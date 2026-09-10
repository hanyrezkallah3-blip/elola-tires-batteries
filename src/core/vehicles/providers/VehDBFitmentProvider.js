// ======================================================
// EL OLA ERP
// VehDB Fitment Provider
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Resolve OEM and alternative tire fitment for a vehicle.
//
// VehDB is also used as a clean source for model
// autocomplete when a make is known.
//
// IMPORTANT
// ------------------------------------------------------
//
// This provider:
// - DOES NOT read inventory
// - DOES NOT read product prices
// - DOES NOT decide product availability
// - DOES NOT create products
//
// It resolves vehicle fitment/catalog data only.
//
// VehDB is optional.
// If VITE_VEHDB_API_KEY is missing, this provider
// safely returns null / [] instead of fabricating data.
//
// CACHE POLICY
// ------------------------------------------------------
//
// 1. Successful VehDB results are persisted locally.
// 2. Empty results are NEVER persisted.
// 3. Identical concurrent requests share one Promise.
// 4. Cached successful results survive page reloads.
// 5. HTTP 429 activates a temporary cooldown.
// 6. On HTTP 429, valid cached data is still returned.
// 7. No undocumented VehDB endpoint is introduced.
// ======================================================


// ======================================================
// CONSTANTS
// ======================================================

const BASE_URL =
  'https://api.vehdb.com/v1'


// ======================================================
// API KEY
// ======================================================

const VEHDB_API_KEY =
  String(
    import.meta.env.VITE_VEHDB_API_KEY ?? ''
  ).trim()


// ======================================================
// CACHE
// ======================================================
//
// Fitment data is technical vehicle data and can safely
// remain available after page reloads.
//
// A 24-hour freshness window prevents unnecessary VehDB
// traffic while still allowing the catalog to refresh.
//
// If VehDB responds with 429, stale cached data is still
// allowed to be used.
//

const FITMENT_CACHE_PREFIX =
  'elola:vehdb:fitment:v1:'

const MODEL_CACHE_PREFIX =
  'elola:vehdb:models:v1:'

const FITMENT_CACHE_TTL =
  24 * 60 * 60 * 1000

const MODEL_CACHE_TTL =
  24 * 60 * 60 * 1000

const VEHDB_RATE_LIMIT_COOLDOWN =
  60 * 1000


// ======================================================
// RUNTIME STATE
// ======================================================

const inFlightRequests =
  new Map()


let rateLimitBlockedUntil =
  0


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value => {

  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')

}


// ======================================================
// CACHE KEY NORMALIZATION
// ======================================================

const normalizeCachePart = value => {

  return normalizeText(value)
    .replace(
      /[^a-z0-9\u0600-\u06ff]+/gi,
      '_'
    )
    .replace(
      /^_+|_+$/g,
      ''
    )

}


// ======================================================
// FITMENT CACHE KEY
// ======================================================

const getFitmentCacheKey = ({
  make,
  model,
  year
} = {}) => {

  return (
    FITMENT_CACHE_PREFIX +
    [
      normalizeCachePart(make),
      normalizeCachePart(model),
      normalizeCachePart(year)
    ]
      .join(':')
  )

}


// ======================================================
// MODEL CACHE KEY
// ======================================================

const getModelCacheKey = make => {

  return (
    MODEL_CACHE_PREFIX +
    normalizeCachePart(make)
  )

}


// ======================================================
// SAFE LOCAL STORAGE
// ======================================================

const canUseLocalStorage = () => {

  try {

    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    )

  }

  catch {

    return false

  }

}


// ======================================================
// READ PERSISTENT CACHE
// ======================================================

const readPersistentCache = (

  key,

  ttl

) => {

  if (
    !canUseLocalStorage()
  ) {

    return null

  }


  try {

    const raw =
      window.localStorage.getItem(
        key
      )


    if (
      !raw
    ) {

      return null

    }


    const parsed =
      JSON.parse(
        raw
      )


    if (
      !parsed ||
      typeof parsed !== 'object'
    ) {

      return null

    }


    if (
      parsed.value == null
    ) {

      return null

    }


    const createdAt =
      Number(
        parsed.createdAt
      )


    if (
      !Number.isFinite(
        createdAt
      )
    ) {

      return null

    }


    const age =
      Date.now() -
      createdAt


    if (
      age <= ttl
    ) {

      return parsed.value

    }


    // --------------------------------------------------
    // Expired cache is intentionally NOT deleted.
    //
    // It can still be used as stale fallback if VehDB
    // responds with HTTP 429.
    // --------------------------------------------------

    return {
      __stale: true,
      value:
        parsed.value
    }

  }

  catch (
    error
  ) {

    console.warn(
      '[VehDB] Persistent cache read failed:',
      error
    )

    return null

  }

}


// ======================================================
// READ STALE CACHE
// ======================================================

const readAnyPersistentCache = key => {

  if (
    !canUseLocalStorage()
  ) {

    return null

  }


  try {

    const raw =
      window.localStorage.getItem(
        key
      )


    if (
      !raw
    ) {

      return null

    }


    const parsed =
      JSON.parse(
        raw
      )


    if (
      !parsed ||
      typeof parsed !== 'object'
    ) {

      return null

    }


    return (
      parsed.value ??
      null
    )

  }

  catch {

    return null

  }

}


// ======================================================
// WRITE PERSISTENT CACHE
// ======================================================
//
// Empty values are NEVER persisted.
//

const writePersistentCache = (

  key,

  value

) => {

  if (
    value == null
  ) {

    return value

  }


  if (
    Array.isArray(value) &&
    value.length === 0
  ) {

    return value

  }


  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {

    return value

  }


  if (
    !canUseLocalStorage()
  ) {

    return value

  }


  try {

    window.localStorage.setItem(

      key,

      JSON.stringify({

        createdAt:
          Date.now(),

        value

      })

    )

  }

  catch (
    error
  ) {

    console.warn(
      '[VehDB] Persistent cache write failed:',
      error
    )

  }


  return value

}


// ======================================================
// CACHE VALUE VALIDATION
// ======================================================

const isUsableCachedValue = value => {

  if (
    value == null
  ) {

    return false

  }


  if (
    Array.isArray(value)
  ) {

    return (
      value.length > 0
    )

  }


  if (
    typeof value === 'object'
  ) {

    return (
      Object.keys(value).length > 0
    )

  }


  return (
    String(value).trim() !== ''
  )

}


// ======================================================
// API KEY
// ======================================================

const getApiKey = () => {

  return VEHDB_API_KEY

}


// ======================================================
// RATE LIMIT STATE
// ======================================================

const isRateLimited = () => {

  return (
    Date.now() <
    rateLimitBlockedUntil
  )

}


// ======================================================
// ACTIVATE RATE LIMIT COOLDOWN
// ======================================================

const activateRateLimitCooldown = () => {

  rateLimitBlockedUntil =
    Date.now() +
    VEHDB_RATE_LIMIT_COOLDOWN

  console.warn(
    '[VehDB] Rate limit cooldown activated:',
    VEHDB_RATE_LIMIT_COOLDOWN,
    'ms'
  )

}


// ======================================================
// SAFE REQUEST
// ======================================================
//
// Returns:
//
//   {
//     data,
//     status
//   }
//
// HTTP 429 is explicitly preserved so callers can
// distinguish rate limiting from an ordinary failure.
//

const requestJson = async (

  url

) => {

  const apiKey =
    getApiKey()


  console.log(
    '[VehDB] API enabled:',
    Boolean(apiKey)
  )

  console.log(
    '[VehDB] API key length:',
    apiKey.length
  )


  if (!apiKey) {

    console.warn(
      '[VehDB] VITE_VEHDB_API_KEY is missing'
    )

    return {

      data:
        null,

      status:
        0

    }

  }


  if (
    isRateLimited()
  ) {

    console.warn(
      '[VehDB] Request skipped because rate-limit cooldown is active.'
    )

    return {

      data:
        null,

      status:
        429,

      rateLimited:
        true

    }

  }


  console.log(
    '[VehDB] Request URL:',
    url
  )


  try {

    const response =
      await fetch(

        url,

        {

          method:
            'GET',

          headers: {

            Accept:
              'application/json',

            Authorization:
              `Bearer ${apiKey}`

          }

        }

      )


    console.log(
      '[VehDB] HTTP status:',
      response.status,
      response.statusText
    )


    if (
      response.status === 429
    ) {

      activateRateLimitCooldown()


      return {

        data:
          null,

        status:
          429,

        rateLimited:
          true

      }

    }


    if (!response.ok) {

      console.warn(
        '[VehDB] HTTP request failed:',
        response.status,
        response.statusText
      )

      return {

        data:
          null,

        status:
          response.status

      }

    }


    const data =
      await response.json()


    console.log(
      '[VehDB] Raw response:',
      data
    )


    return {

      data,

      status:
        response.status

    }

  }

  catch (error) {

    console.error(
      '[VehDB] Request failed:',
      error
    )

    return {

      data:
        null,

      status:
        0,

      error

    }

  }

}


// ======================================================
// COLLECT SIZE VALUES
// ======================================================

const collectSizes = value => {

  const sizes = []


  const add = item => {

    if (
      item === null ||
      item === undefined ||
      item === ''
    ) {

      return

    }


    if (
      Array.isArray(item)
    ) {

      item.forEach(add)

      return

    }


    if (
      typeof item === 'string'
    ) {

      item
        .split(',')
        .forEach(
          part => {

            const size =
              String(part)
                .trim()

            if (size) {

              sizes.push(size)

            }

          }
        )

      return

    }


    if (
      typeof item === 'object'
    ) {

      Object.values(item)
        .forEach(add)

      return

    }


    sizes.push(
      String(item).trim()
    )

  }


  add(value)


  return sizes

}


// ======================================================
// DEDUPLICATE SIZES
// ======================================================

const uniqueSizes = sizes => {

  const seen =
    new Set()


  return sizes.filter(
    size => {

      const normalized =
        normalizeText(size)


      if (!normalized) {

        return false

      }


      if (
        seen.has(normalized)
      ) {

        return false

      }


      seen.add(normalized)

      return true

    }
  )

}


// ======================================================
// FIND DATA ARRAY
// ======================================================

const getDataArray = result => {

  if (
    Array.isArray(
      result?.data
    )
  ) {

    return result.data

  }


  if (
    Array.isArray(
      result?.results
    )
  ) {

    return result.results

  }


  if (
    Array.isArray(
      result?.items
    )
  ) {

    return result.items

  }


  if (
    Array.isArray(
      result?.records
    )
  ) {

    return result.records

  }


  if (
    Array.isArray(result)
  ) {

    return result

  }


  return []

}


// ======================================================
// MODEL NAME EXTRACTION
// ======================================================

const extractModelName = item => {

  if (
    item === null ||
    item === undefined
  ) {

    return ''

  }


  if (
    typeof item === 'string'
  ) {

    return item.trim()

  }


  if (
    typeof item !== 'object'
  ) {

    return ''

  }


  const value =
    item.model ??
    item.model_name ??
    item.modelName ??
    item.vehicleModel ??
    item.vehicle_model ??
    item.vehicle_model_name ??
    ''


  return String(
    value
  ).trim()

}


// ======================================================
// NORMALIZE MODEL
// ======================================================

const normalizeModel = (

  item,

  make

) => {

  const model =
    extractModelName(
      item
    )


  if (
    !model
  ) {

    return null

  }


  return {

    id:
      `${String(make ?? '').trim()}::${model}`,

    value:
      model,

    name:
      model,

    label:
      model,

    model:
      model,

    modelName:
      model,

    make:
      String(make ?? '').trim(),

    brand:
      String(make ?? '').trim(),

    source:
      'vehdb'

  }

}


// ======================================================
// NORMALIZE MODEL LIST
// ======================================================

const normalizeModels = (

  records,

  make

) => {

  const seen =
    new Map()


  ;(
    Array.isArray(records)
      ? records
      : []
  )
    .forEach(
      item => {

        const normalized =
          normalizeModel(
            item,
            make
          )


        if (
          !normalized
        ) {

          return

        }


        const key =
          normalizeText(
            normalized.model
          )


        if (
          !key
        ) {

          return

        }


        if (
          !seen.has(key)
        ) {

          seen.set(
            key,
            normalized
          )

        }

      }
    )


  return Array.from(
    seen.values()
  )

}


// ======================================================
// NORMALIZE FITMENT RECORD
// ======================================================

const normalizeFitmentRecord = (

  item,

  vehicle

) => {

  if (
    !item ||
    typeof item !== 'object'
  ) {

    return null

  }


  const oemSizes =
    uniqueSizes(

      collectSizes(

        item?.tire_size_oem ??

        item?.oem_tire_size ??

        item?.oemSize ??

        item?.tireSizeOEM ??

        item?.tire_size

      )

    )


  const alternateSizes =
    uniqueSizes(

      collectSizes(

        item?.alternate_tire_sizes ??

        item?.alternateTireSizes ??

        item?.alternate_sizes ??

        item?.alternatives ??

        item?.alternate

      )

    )


  const allSizes =
    uniqueSizes([

      ...oemSizes,

      ...alternateSizes

    ])


  return {

    make:
      item?.make ??
      vehicle?.make ??
      null,

    brand:
      item?.make ??
      vehicle?.make ??
      null,

    model:
      item?.model ??
      vehicle?.model ??
      null,

    modelName:
      item?.model ??
      vehicle?.model ??
      null,

    year:
      item?.year ??
      vehicle?.year ??
      null,

    submodel:
      item?.submodel ??
      item?.trim ??
      item?.configuration ??
      null,

    oemSizes,

    alternateSizes,

    sizes:
      allSizes,

    raw:
      item

  }

}


// ======================================================
// PROVIDER
// ======================================================

export default class VehDBFitmentProvider {


  // ====================================================
  // ENABLED
  // ====================================================

  static isEnabled() {

    return Boolean(
      getApiKey()
    )

  }


  // ====================================================
  // IN-FLIGHT KEY
  // ====================================================

  static getInFlightKey(

    prefix,

    value

  ) {

    return (
      `${prefix}:${normalizeText(value)}`
    )

  }


  // ====================================================
  // GET MODELS
  // ====================================================
  //
  // Uses the SAME known VehDB tire-sizes endpoint that
  // already works for vehicle fitment.
  //
  // No undocumented /models endpoint is introduced.
  //
  // Request:
  //
  //   /v1/tire-sizes?make=Toyota
  //
  // The returned fitment records are inspected for their
  // model field and converted into autocomplete records.
  //
  // ====================================================

  static async getModels({

    make,
    brand

  } = {}) {

    const requestedMake =
      String(
        make ??
        brand ??
        ''
      ).trim()


    console.log(
      '[VehDB] getModels input:',
      {
        make:
          requestedMake
      }
    )


    if (
      !requestedMake
    ) {

      console.warn(
        '[VehDB] getModels skipped: make is missing'
      )

      return []

    }


    if (
      !this.isEnabled()
    ) {

      console.warn(
        '[VehDB] getModels disabled because API key is missing'
      )

      return []

    }


    const cacheKey =
      getModelCacheKey(
        requestedMake
      )


    const cached =
      readPersistentCache(
        cacheKey,
        MODEL_CACHE_TTL
      )


    if (
      cached &&
      cached.__stale !== true &&
      Array.isArray(cached)
    ) {

      console.log(
        '[VehDB] Model catalog cache HIT:',
        requestedMake,
        cached.length
      )

      return cached

    }


    const requestKey =
      this.getInFlightKey(
        'models',
        requestedMake
      )


    const existingRequest =
      inFlightRequests.get(
        requestKey
      )


    if (
      existingRequest
    ) {

      console.log(
        '[VehDB] Model request deduplicated:',
        requestedMake
      )

      return existingRequest

    }


    const request =

      (async () => {

        try {

          const params =
            new URLSearchParams()


          params.set(
            'make',
            requestedMake
          )


          const requestUrl =
            `${BASE_URL}/tire-sizes?${params.toString()}`


          console.log(
            '[VehDB] Model catalog request:',
            requestUrl
          )


          const response =
            await requestJson(
              requestUrl
            )


          if (
            response?.rateLimited
          ) {

            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            if (
              Array.isArray(stale) &&
              stale.length > 0
            ) {

              console.warn(
                '[VehDB] Model catalog rate limited. Using stale cached catalog:',
                requestedMake,
                stale.length
              )

              return stale

            }


            console.warn(
              '[VehDB] Model catalog rate limited and no cache is available:',
              requestedMake
            )

            return []

          }


          const result =
            response?.data


          if (
            !result
          ) {

            console.warn(
              '[VehDB] getModels: no response data'
            )

            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              Array.isArray(stale)
                ? stale
                : []
            )

          }


          const records =
            getDataArray(
              result
            )


          console.log(
            '[VehDB] Model catalog records:',
            records.length
          )


          if (
            records.length === 0
          ) {

            console.warn(
              '[VehDB] getModels: no records returned for make:',
              requestedMake
            )

            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              Array.isArray(stale)
                ? stale
                : []
            )

          }


          const models =
            normalizeModels(
              records,
              requestedMake
            )


          console.log(
            '[VehDB] Model catalog normalized:',
            {
              make:
                requestedMake,

              count:
                models.length,

              models:
                models.slice(
                  0,
                  30
                )
            }
          )


          if (
            models.length > 0
          ) {

            writePersistentCache(
              cacheKey,
              models
            )

          }


          return models

        }

        catch (
          error
        ) {

          console.warn(
            '[VehDB] getModels failed:',
            error
          )


          const stale =
            readAnyPersistentCache(
              cacheKey
            )


          return (
            Array.isArray(stale)
              ? stale
              : []
          )

        }

        finally {

          inFlightRequests.delete(
            requestKey
          )

        }

      })()


    inFlightRequests.set(
      requestKey,
      request
    )


    return request

  }


  // ====================================================
  // FIND TIRE FITMENT
  // ====================================================

  static async findTireFitment({

    make,

    model,

    year

  } = {}) {

    console.log(
      '[VehDB] findTireFitment input:',
      {
        make,
        model,
        year
      }
    )


    if (
      !make ||
      !model
    ) {

      console.warn(
        '[VehDB] Missing make or model'
      )

      return null

    }


    if (
      !this.isEnabled()
    ) {

      console.warn(
        '[VehDB] Provider disabled because API key is missing'
      )

      return null

    }


    const cacheKey =
      getFitmentCacheKey({

        make,

        model,

        year

      })


    const cached =
      readPersistentCache(
        cacheKey,
        FITMENT_CACHE_TTL
      )


    if (
      cached &&
      cached.__stale !== true &&
      isUsableCachedValue(cached)
    ) {

      console.log(
        '[VehDB] Fitment cache HIT:',
        {
          make,
          model,
          year
        }
      )


      return cached

    }


    const requestKey =
      this.getInFlightKey(

        'fitment',

        [
          make,
          model,
          year
        ]
          .map(
            normalizeText
          )
          .join('|')

      )


    const existingRequest =
      inFlightRequests.get(
        requestKey
      )


    if (
      existingRequest
    ) {

      console.log(
        '[VehDB] Fitment request deduplicated:',
        {
          make,
          model,
          year
        }
      )

      return existingRequest

    }


    const request =

      (async () => {

        try {

          const params =
            new URLSearchParams()


          params.set(
            'make',
            String(make).trim()
          )


          params.set(
            'model',
            String(model).trim()
          )


          if (
            year
          ) {

            params.set(
              'year',
              String(year)
            )

          }


          const requestUrl =
            `${BASE_URL}/tire-sizes?${params.toString()}`


          console.log(
            '[VehDB] Tire fitment request:',
            requestUrl
          )


          const response =
            await requestJson(
              requestUrl
            )


          // ------------------------------------------------
          // HTTP 429
          // ------------------------------------------------

          if (
            response?.rateLimited
          ) {

            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            if (
              isUsableCachedValue(stale)
            ) {

              console.warn(
                '[VehDB] Fitment rate limited. Using cached VehDB result:',
                {
                  make,
                  model,
                  year
                }
              )

              return stale

            }


            console.warn(
              '[VehDB] Fitment rate limited and no cached result is available:',
              {
                make,
                model,
                year
              }
            )

            return null

          }


          const result =
            response?.data


          if (
            !result
          ) {

            console.warn(
              '[VehDB] No response data'
            )


            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              isUsableCachedValue(stale)
                ? stale
                : null
            )

          }


          const records =
            getDataArray(
              result
            )


          console.log(
            '[VehDB] Records count:',
            records.length
          )


          if (
            records.length === 0
          ) {

            console.warn(
              '[VehDB] Response contains no fitment records'
            )


            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              isUsableCachedValue(stale)
                ? stale
                : null
            )

          }


          const fitments =
            records

              .map(
                item =>
                  normalizeFitmentRecord(

                    item,

                    {
                      make,
                      model,
                      year
                    }

                  )
              )

              .filter(Boolean)


          console.log(
            '[VehDB] Normalized fitments:',
            fitments
          )


          if (
            fitments.length === 0
          ) {

            console.warn(
              '[VehDB] Could not normalize any fitment records'
            )


            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              isUsableCachedValue(stale)
                ? stale
                : null
            )

          }


          const oemSizes =
            uniqueSizes(

              fitments.flatMap(
                item =>
                  item.oemSizes
              )

            )


          const alternateSizes =
            uniqueSizes(

              fitments.flatMap(
                item =>
                  item.alternateSizes
              )

            )


          const sizes =
            uniqueSizes([

              ...oemSizes,

              ...alternateSizes

            ])


          console.log(
            '[VehDB] OEM sizes:',
            oemSizes
          )

          console.log(
            '[VehDB] Alternate sizes:',
            alternateSizes
          )

          console.log(
            '[VehDB] Final sizes:',
            sizes
          )


          if (
            sizes.length === 0
          ) {

            console.warn(
              '[VehDB] Fitment records found but no tire sizes were extracted'
            )


            const stale =
              readAnyPersistentCache(
                cacheKey
              )


            return (
              isUsableCachedValue(stale)
                ? stale
                : null
            )

          }


          const finalResult = {

            make,

            brand:
              make,

            model,

            modelName:
              model,

            year:
              year ?? null,

            oemSizes,

            alternateSizes,

            sizes,

            fitments,

            source:
              'vehdb',

            raw:
              result

          }


          console.log(
            '[VehDB] FINAL FITMENT RESULT:',
            finalResult
          )


          // -----------------------------------------------
          // Persist ONLY successful non-empty results.
          // -----------------------------------------------

          writePersistentCache(
            cacheKey,
            finalResult
          )


          return finalResult

        }

        catch (
          error
        ) {

          console.error(
            '[VehDB] findTireFitment failed:',
            error
          )


          const stale =
            readAnyPersistentCache(
              cacheKey
            )


          return (
            isUsableCachedValue(stale)
              ? stale
              : null
          )

        }

        finally {

          inFlightRequests.delete(
            requestKey
          )

        }

      })()


    inFlightRequests.set(
      requestKey,
      request
    )


    return request

  }


  // ====================================================
  // GET OEM SIZES
  // ====================================================

  static async getOEMSizes({

    make,

    model,

    year

  } = {}) {

    const result =
      await this.findTireFitment({

        make,

        model,

        year

      })


    return (
      result?.oemSizes ??
      []
    )

  }


  // ====================================================
  // GET ALTERNATIVE SIZES
  // ====================================================

  static async getAlternativeSizes({

    make,

    model,

    year

  } = {}) {

    const result =
      await this.findTireFitment({

        make,

        model,

        year

      })


    return (
      result?.alternateSizes ??
      []
    )

  }


  // ====================================================
  // GET COMPLETE FITMENT
  // ====================================================

  static async getSpecifications({

    make,

    model,

    year

  } = {}) {

    return this.findTireFitment({

      make,

      model,

      year

    })

  }

}