// ======================================================
// EL OLA ERP
// Online Vehicle Source
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Central online vehicle source.
//
// PROVIDER ORDER
// ------------------------------------------------------
//
// 1. VehDB
// 2. NHTSA
// 3. CarQuery
//
// IMPORTANT
// ------------------------------------------------------
//
// VehDB is an optional enrichment source.
//
// If VehDB is unavailable, rate-limited, or its quota is
// exhausted, the application MUST continue using fallback
// providers.
//
// ======================================================

import CarQueryProvider
  from './providers/CarQueryProvider'

import NHTSAProvider
  from './providers/NHTSAProvider'

import VehDBFitmentProvider
  from './providers/VehDBFitmentProvider'


// ======================================================
// CONSTANTS
// ======================================================

const VEHDB_BASE_URL =
  'https://api.vehdb.com/v1'

const VEHDB_BRANDS_ENDPOINT =
  `${VEHDB_BASE_URL}/tire-sizes/makes`

const VEHDB_BRAND_CACHE_KEY =
  'elola:vehdb:brand-catalog:v4'

const VEHDB_BRAND_CACHE_TTL =
  7 * 24 * 60 * 60 * 1000

const VEHDB_BRAND_FETCH_COOLDOWN =
  60 * 1000

const VEHDB_BRAND_QUOTA_BLOCK_KEY =
  'elola:vehdb:brand-quota-block:v1'

const FALLBACK_BRAND_CACHE_KEY =
  'elola:nhtsa:brand-catalog:v1'

const FALLBACK_BRAND_CACHE_TTL =
  30 * 24 * 60 * 60 * 1000

const MIN_VALID_BRAND_COUNT =
  1

const NHTSA_BRAND_TYPES = [
  'car',
  'truck',
  'motorcycle',
  'bus'
]


// ======================================================
// MEMORY STATE
// ======================================================

let vehDBBrandCatalog = null

let vehDBBrandCatalogPromise = null

let vehDBBrandCatalogBlockedUntil = 0

let fallbackBrandCatalog = null

let fallbackBrandCatalogPromise = null


// ======================================================
// TEXT NORMALIZATION
// ======================================================

const normalizeText = value => {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
}


const normalizeArabic = value => {

  return normalizeText(value)
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
}


// ======================================================
// SAFE LOCAL STORAGE
// ======================================================

const readLocalStorage = key => {

  try {

    if (
      typeof window === 'undefined' ||
      !window.localStorage
    ) {
      return null
    }

    const raw =
      window.localStorage.getItem(key)

    if (!raw) {
      return null
    }

    return JSON.parse(raw)

  } catch (error) {

    console.warn(
      '[OnlineVehicleSource] localStorage read failed:',
      key,
      error
    )

    return null
  }
}


const writeLocalStorage = (
  key,
  value
) => {

  try {

    if (
      typeof window === 'undefined' ||
      !window.localStorage
    ) {
      return false
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(value)
    )

    return true

  } catch (error) {

    console.warn(
      '[OnlineVehicleSource] localStorage write failed:',
      key,
      error
    )

    return false
  }
}


// ======================================================
// VEHDB API KEY
// ======================================================

const getVehDBApiKey = () => {

  return String(
    import.meta.env.VITE_VEHDB_API_KEY ?? ''
  ).trim()
}


// ======================================================
// BRAND RECORD NORMALIZATION
// ======================================================

const normalizeBrandRecord = value => {

  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {

    const name =
      String(value).trim()

    if (!name) {
      return null
    }

    return {
      name
    }
  }

  if (
    typeof value !== 'object'
  ) {
    return null
  }

  const name =
    value.name ??
    value.brand ??
    value.make ??
    value.title ??
    value.label ??
    value.value

  if (
    name === null ||
    name === undefined ||
    !String(name).trim()
  ) {
    return null
  }

  return {
    ...value,
    name: String(name).trim()
  }
}


// ======================================================
// BRAND ARRAY EXTRACTION
// ======================================================

const extractBrandArray = payload => {

  if (Array.isArray(payload)) {
    return payload
  }

  if (
    payload &&
    typeof payload === 'object'
  ) {

    const candidates = [
      payload.makes,
      payload.brands,
      payload.data,
      payload.items,
      payload.results,
      payload.records,
      payload.list,
      payload.vehicles
    ]

    for (
      const candidate of candidates
    ) {

      if (Array.isArray(candidate)) {
        return candidate
      }
    }

    const values =
      Object.values(payload)

    if (
      values.length &&
      values.some(
        value =>
          typeof value === 'string' ||
          typeof value === 'object'
      )
    ) {
      return values
    }
  }

  return []
}


// ======================================================
// BRAND CATALOG NORMALIZATION
// ======================================================

const normalizeBrandCatalog = payload => {

  const array =
    extractBrandArray(payload)

  const result = []

  const seen =
    new Set()

  for (
    const item of array
  ) {

    const normalized =
      normalizeBrandRecord(item)

    if (!normalized) {
      continue
    }

    const key =
      normalizeArabic(
        normalized.name
      )

    if (!key) {
      continue
    }

    if (seen.has(key)) {
      continue
    }

    seen.add(key)

    result.push(normalized)
  }

  return result
}


// ======================================================
// VEHDB BRAND CACHE
// ======================================================

const readCachedVehDBBrandCatalog = () => {

  const cached =
    readLocalStorage(
      VEHDB_BRAND_CACHE_KEY
    )

  if (
    !cached ||
    !Array.isArray(cached.data)
  ) {
    return []
  }

  const timestamp =
    Number(
      cached.timestamp ?? 0
    )

  if (
    !timestamp ||
    Date.now() - timestamp >
      VEHDB_BRAND_CACHE_TTL
  ) {
    return []
  }

  return normalizeBrandCatalog(
    cached.data
  )
}


const writeCachedVehDBBrandCatalog = catalog => {

  if (!Array.isArray(catalog)) {
    return false
  }

  return writeLocalStorage(
    VEHDB_BRAND_CACHE_KEY,
    {
      timestamp: Date.now(),
      data: catalog
    }
  )
}


// ======================================================
// VEHDB QUOTA BLOCK
// ======================================================

const readVehDBBrandQuotaBlock = () => {

  const cached =
    readLocalStorage(
      VEHDB_BRAND_QUOTA_BLOCK_KEY
    )

  const blockedUntil =
    Number(
      cached?.blockedUntil ?? 0
    )

  if (
    blockedUntil > Date.now()
  ) {
    return blockedUntil
  }

  return 0
}


const writeVehDBBrandQuotaBlock = blockedUntil => {

  if (
    !Number.isFinite(
      blockedUntil
    ) ||
    blockedUntil <= Date.now()
  ) {
    return false
  }

  return writeLocalStorage(
    VEHDB_BRAND_QUOTA_BLOCK_KEY,
    {
      blockedUntil,
      reason: 'quota-exceeded'
    }
  )
}


// ======================================================
// FALLBACK BRAND CACHE
// ======================================================

const readCachedFallbackBrandCatalog = () => {

  const cached =
    readLocalStorage(
      FALLBACK_BRAND_CACHE_KEY
    )

  if (
    !cached ||
    !Array.isArray(cached.data)
  ) {
    return []
  }

  const timestamp =
    Number(
      cached.timestamp ?? 0
    )

  if (
    !timestamp ||
    Date.now() - timestamp >
      FALLBACK_BRAND_CACHE_TTL
  ) {
    return []
  }

  return normalizeBrandCatalog(
    cached.data
  )
}


const writeCachedFallbackBrandCatalog = catalog => {

  if (!Array.isArray(catalog)) {
    return false
  }

  return writeLocalStorage(
    FALLBACK_BRAND_CACHE_KEY,
    {
      timestamp: Date.now(),
      data: catalog
    }
  )
}


// ======================================================
// VEHDB BRAND FETCH
// ======================================================

const fetchVehDBBrandCatalog = async () => {

  const apiKey =
    getVehDBApiKey()

  if (!apiKey) {

    console.warn(
      '[OnlineVehicleSource] VITE_VEHDB_API_KEY is missing'
    )

    return []
  }

  try {

    const response =
      await fetch(
        VEHDB_BRANDS_ENDPOINT,
        {
          method: 'GET',

          headers: {
            Accept:
              'application/json',

            Authorization:
              `Bearer ${apiKey}`
          }
        }
      )

    if (!response.ok) {

      let payload = null

      try {

        payload =
          await response.json()

      } catch {
        payload = null
      }

      if (
        response.status === 429
      ) {

        const resetAt =
          Date.parse(
            payload?.resets_at ?? ''
          )

        const blockedUntil =
          Number.isFinite(resetAt) &&
          resetAt > Date.now()

            ? resetAt

            : Date.now() +
              VEHDB_BRAND_FETCH_COOLDOWN

        vehDBBrandCatalogBlockedUntil =
          blockedUntil

        writeVehDBBrandQuotaBlock(
          blockedUntil
        )

        console.warn(
          '[OnlineVehicleSource] VehDB brand quota exhausted until:',
          new Date(
            blockedUntil
          ).toISOString()
        )

      } else {

        vehDBBrandCatalogBlockedUntil =
          Date.now() +
          VEHDB_BRAND_FETCH_COOLDOWN

        console.warn(
          '[OnlineVehicleSource] VehDB brand request failed:',
          response.status
        )
      }

      return []
    }

    const payload =
      await response.json()

    const catalog =
      normalizeBrandCatalog(
        payload
      )

    if (
      catalog.length <
      MIN_VALID_BRAND_COUNT
    ) {

      console.warn(
        '[OnlineVehicleSource] VehDB returned an empty brand catalog'
      )

      return []
    }

    vehDBBrandCatalog =
      catalog

    writeCachedVehDBBrandCatalog(
      catalog
    )

    return catalog

  } catch (error) {

    vehDBBrandCatalogBlockedUntil =
      Date.now() +
      VEHDB_BRAND_FETCH_COOLDOWN

    console.warn(
      '[OnlineVehicleSource] VehDB brand request failed:',
      error
    )

    return []
  }
}


// ======================================================
// INITIALIZE VEHDB BRAND CATALOG
// ======================================================

const initializeVehDBBrandCatalog = async () => {

  if (
    Array.isArray(
      vehDBBrandCatalog
    ) &&
    vehDBBrandCatalog.length
  ) {
    return vehDBBrandCatalog
  }


  const persistedBlock =
    readVehDBBrandQuotaBlock()

  if (
    persistedBlock >
    Date.now()
  ) {

    vehDBBrandCatalogBlockedUntil =
      persistedBlock

    return []
  }


  if (
    vehDBBrandCatalogBlockedUntil >
    Date.now()
  ) {
    return []
  }


  const cached =
    readCachedVehDBBrandCatalog()

  if (cached.length) {

    vehDBBrandCatalog =
      cached

    return cached
  }


  if (
    vehDBBrandCatalogPromise
  ) {
    return vehDBBrandCatalogPromise
  }


  vehDBBrandCatalogPromise =
    fetchVehDBBrandCatalog()

      .finally(() => {

        vehDBBrandCatalogPromise =
          null
      })


  return vehDBBrandCatalogPromise
}


// ======================================================
// FILTER BRAND CATALOG BY VEHICLE TYPE
// ======================================================

const filterBrandCatalogByVehicleType = (
  catalog,
  vehicleType = ''
) => {

  if (
    !Array.isArray(catalog)
  ) {
    return []
  }

  const normalizedType =
    normalizeArabic(
      vehicleType
    )

  if (!normalizedType) {
    return catalog
  }

  const typed =
    catalog.filter(
      item => {

        const itemType =
          normalizeArabic(
            item?.vehicleType ??
            item?.type ??
            ''
          )

        return (
          itemType ===
          normalizedType
        )
      }
    )

  if (typed.length) {
    return typed
  }

  return catalog
}


// ======================================================
// INITIALIZE NHTSA FALLBACK BRAND CATALOG
// ======================================================

const initializeFallbackBrandCatalog = async (
  vehicleType = ''
) => {

  const normalizedType =
    normalizeText(
      vehicleType
    )


  if (
    Array.isArray(
      fallbackBrandCatalog
    ) &&
    fallbackBrandCatalog.length
  ) {

    return filterBrandCatalogByVehicleType(
      fallbackBrandCatalog,
      normalizedType
    )
  }


  const cached =
    readCachedFallbackBrandCatalog()

  if (cached.length) {

    fallbackBrandCatalog =
      cached

    return filterBrandCatalogByVehicleType(
      cached,
      normalizedType
    )
  }


  if (
    fallbackBrandCatalogPromise
  ) {

    const catalog =
      await fallbackBrandCatalogPromise

    return filterBrandCatalogByVehicleType(
      catalog,
      normalizedType
    )
  }


  const requestedTypes =
    normalizedType

      ? [normalizedType]

      : NHTSA_BRAND_TYPES


  fallbackBrandCatalogPromise =
    Promise.all(
      requestedTypes.map(
        async type => {

          try {

            const result =
              await NHTSAProvider.getBrands(
                type
              )

            return normalizeBrandCatalog(
              result
            )

          } catch (error) {

            console.warn(
              '[OnlineVehicleSource] NHTSA brand fallback failed:',
              type,
              error
            )

            return []
          }
        }
      )
    )

      .then(results => {

        const catalog =
          normalizeBrandCatalog(
            results.flat()
          )

        if (catalog.length) {

          fallbackBrandCatalog =
            catalog

          writeCachedFallbackBrandCatalog(
            catalog
          )
        }

        return catalog
      })

      .finally(() => {

        fallbackBrandCatalogPromise =
          null
      })


  const catalog =
    await fallbackBrandCatalogPromise

  return filterBrandCatalogByVehicleType(
    catalog,
    normalizedType
  )
}


// ======================================================
// ONLINE VEHICLE SOURCE
// ======================================================

class OnlineVehicleSource {

  // ====================================================
  // PROVIDERS
  // ====================================================

  static providers = [

    VehDBFitmentProvider,

    NHTSAProvider,

    CarQueryProvider

  ]


  // ====================================================
  // GENERIC EXECUTOR
  // ====================================================

  static async execute(
    method,
    params = {}
  ) {

    for (
      const provider
      of OnlineVehicleSource.providers
    ) {

      if (
        !provider ||
        typeof provider[method] !==
          'function'
      ) {
        continue
      }

      try {

        const result =
          await provider[method](
            params
          )

        if (
          Array.isArray(result) &&
          result.length
        ) {
          return result
        }

        if (
          result &&
          !Array.isArray(result)
        ) {
          return result
        }

      } catch (error) {

        console.warn(
          `[OnlineVehicleSource] ${method} provider failed:`,
          provider?.name ??
            'UnknownProvider',
          error
        )
      }
    }

    return []
  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes(
    params = {}
  ) {

    return OnlineVehicleSource.execute(
      'getVehicleTypes',
      params
    )
  }


  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(
    params = {}
  ) {

    const vehicleType =
      typeof params === 'string'

        ? params

        : (
            params?.vehicleType ??
            params?.type ??
            ''
          )


    const vehDBCatalog =
      await initializeVehDBBrandCatalog()


    if (
      vehDBCatalog.length
    ) {

      return filterBrandCatalogByVehicleType(
        vehDBCatalog,
        vehicleType
      )
    }


    return initializeFallbackBrandCatalog(
      vehicleType
    )
  }


  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(
    params = {}
  ) {

    return OnlineVehicleSource.execute(
      'getModels',
      params
    )
  }


  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(
    params = {}
  ) {

    return OnlineVehicleSource.execute(
      'getYears',
      params
    )
  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle(
    params = {}
  ) {

    return OnlineVehicleSource.execute(
      'findVehicle',
      params
    )
  }


  // ====================================================
  // ALL VEHICLES
  // ====================================================

  static async getAll(
    params = {}
  ) {

    return OnlineVehicleSource.execute(
      'getAll',
      params
    )
  }

}


// ======================================================
// EXPORT
// ======================================================

export default OnlineVehicleSource