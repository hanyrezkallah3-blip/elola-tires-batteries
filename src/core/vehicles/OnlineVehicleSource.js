// ======================================================
// EL OLA ERP
// Online Vehicle Source
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Central online vehicle data source.
//
// IMPORTANT
// ------------------------------------------------------
//
// 1. Multiple providers may contribute vehicle data.
// 2. Vehicle brand autocomplete uses VehDB tire-fitment
//    makes as the primary clean consumer catalog.
// 3. NHTSA remains available for vehicle/model resolution.
// 4. NHTSA broad manufacturer catalogs are NOT used for
//    default brand autocomplete.
// 5. CarQueryProvider is NOT used for default brand
//    autocomplete because its current vPIC source can
//    return thousands of non-consumer manufacturers.
// 6. Empty provider responses never erase useful results.
// 7. Duplicate brands/models/years are removed.
// 8. No vehicle data is fabricated.
// 9. VehDB fitment remains the authoritative fitment
//    source used elsewhere in the vehicle pipeline.
//
// ======================================================

import CarQueryProvider
  from './providers/CarQueryProvider'

import NHTSAProvider
  from './providers/NHTSAProvider'


// ======================================================
// PROVIDERS
// ======================================================

const providers = [

  CarQueryProvider,

  NHTSAProvider

]


// ======================================================
// VEHDB
// ======================================================

const VEHDB_BASE_URL =
  'https://api.vehdb.com/v1'


const VEHDB_API_KEY =
  String(
    import.meta.env.VITE_VEHDB_API_KEY ?? ''
  ).trim()


// ======================================================
// NORMALIZE
// ======================================================

const normalize = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()


// ======================================================
// STABLE VALUE
// ======================================================

const stableValue = value =>
  normalize(value)
    .replace(/\s+/g, ' ')


// ======================================================
// GENERIC ITEM KEY
// ======================================================

const getItemKey = item => {

  if (
    item == null
  ) {
    return ''
  }


  if (
    typeof item !== 'object'
  ) {
    return stableValue(item)
  }


  const name =
    item.name ??
    item.label ??
    item.value ??
    item.brand ??
    item.make ??
    item.model ??
    item.manufacturer ??
    ''


  return stableValue(name)
}


// ======================================================
// MERGE LISTS
// ======================================================

const mergeLists = (
  existing,
  incoming
) => {

  const previous =
    Array.isArray(existing)
      ? existing
      : []


  const fresh =
    Array.isArray(incoming)
      ? incoming
      : []


  const map =
    new Map()


  const add = item => {

    if (
      item == null
    ) {
      return
    }


    const key =
      getItemKey(item)


    if (
      !key
    ) {
      return
    }


    const current =
      map.get(key)


    if (
      current &&
      typeof current === 'object' &&
      typeof item === 'object'
    ) {

      map.set(
        key,
        {
          ...current,
          ...item
        }
      )

      return
    }


    map.set(
      key,
      item
    )
  }


  previous.forEach(add)

  fresh.forEach(add)


  return Array.from(
    map.values()
  )
}


// ======================================================
// NORMALIZE VEHICLE TYPE
// ======================================================

const normalizeVehicleType = value => {

  const type =
    stableValue(value)


  const aliases = {

    car:
      'car',

    cars:
      'car',

    automobile:
      'car',

    automobiles:
      'car',

    suv:
      'suv',

    suvs:
      'suv',

    truck:
      'truck',

    trucks:
      'truck',

    pickup:
      'pickup',

    pickups:
      'pickup',

    motorcycle:
      'motorcycle',

    motorcycles:
      'motorcycle',

    bike:
      'motorcycle',

    bikes:
      'motorcycle',

    bus:
      'bus',

    buses:
      'bus'

  }


  return (
    aliases[type] ??
    type
  )
}


// ======================================================
// VEHDB BRAND NORMALIZATION
// ======================================================

const normalizeVehDBBrand = item => {

  if (
    item == null
  ) {
    return null
  }


  // ----------------------------------------------------
  // String response
  // ----------------------------------------------------

  if (
    typeof item === 'string'
  ) {

    const name =
      item.trim()


    if (
      !name
    ) {
      return null
    }


    return {

      id:
        name,

      value:
        name,

      name:
        name,

      label:
        name

    }
  }


  // ----------------------------------------------------
  // Object response
  // ----------------------------------------------------

  if (
    typeof item !== 'object'
  ) {
    return null
  }


  const name =
    String(
      item.name ??
      item.make ??
      item.brand ??
      item.value ??
      item.label ??
      item.manufacturer ??
      ''
    ).trim()


  if (
    !name
  ) {
    return null
  }


  const id =
    String(
      item.id ??
      item.uuid ??
      name
    ).trim()


  return {

    id:
      id || name,

    value:
      name,

    name:
      name,

    label:
      name

  }
}


// ======================================================
// VEHDB RESPONSE EXTRACTION
// ======================================================

const extractVehDBBrands = payload => {

  if (
    Array.isArray(payload)
  ) {

    return payload
      .map(
        normalizeVehDBBrand
      )
      .filter(Boolean)
  }


  if (
    !payload ||
    typeof payload !== 'object'
  ) {
    return []
  }


  const candidates = [

    payload.data,

    payload.makes,

    payload.results,

    payload.items,

    payload.records

  ]


  for (
    const candidate
    of candidates
  ) {

    if (
      Array.isArray(candidate)
    ) {

      return candidate
        .map(
          normalizeVehDBBrand
        )
        .filter(Boolean)
    }
  }


  // ----------------------------------------------------
  // Single make object
  // ----------------------------------------------------

  const single =
    normalizeVehDBBrand(
      payload
    )


  return single
    ? [single]
    : []
}


// ======================================================
// VEHDB BRAND CATALOG
// ======================================================
//
// VehDB documents this endpoint specifically as the
// make list for dropdown/type-ahead selectors:
//
// GET /v1/tire-sizes/makes
//
// This is intentionally isolated from NHTSA/CarQuery.
//
// ======================================================

const getVehDBBrands = async () => {

  if (
    !VEHDB_API_KEY
  ) {

    console.warn(
      '[OnlineVehicleSource] VehDB brand catalog skipped: VITE_VEHDB_API_KEY is missing.'
    )

    return []
  }


  const url =
    `${VEHDB_BASE_URL}/tire-sizes/makes`


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
              `Bearer ${VEHDB_API_KEY}`

          }

        }
      )


    if (
      !response.ok
    ) {

      console.warn(
        '[OnlineVehicleSource] VehDB brand catalog HTTP error:',
        response.status
      )

      return []
    }


    const payload =
      await response.json()


    const brands =
      extractVehDBBrands(
        payload
      )


    const result =
      mergeLists(
        [],
        brands
      )


    console.log(
      '[OnlineVehicleSource] VehDB brand catalog:',
      result.length
    )


    return result

  } catch (
    error
  ) {

    console.warn(
      '[OnlineVehicleSource] VehDB brand catalog request failed:',
      error
    )


    return []
  }
}


// ======================================================
// DEFAULT BRAND CATALOG
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
//
// The default autocomplete must NEVER fall back to the
// broad CarQuery/NHTSA manufacturer catalog.
//
// If VehDB is unavailable, returning an empty catalog is
// safer than reintroducing thousands of irrelevant
// manufacturers.
//
// ======================================================

const DEFAULT_BRAND_CATALOG_TYPE =
  'car'


// ======================================================
// ONLINE VEHICLE SOURCE
// ======================================================

class OnlineVehicleSource {

  // ====================================================
  // PROVIDER MANAGEMENT
  // ====================================================

  static register(
    provider
  ) {

    if (
      !provider
    ) {
      return
    }


    if (
      providers.includes(provider)
    ) {
      return
    }


    providers.push(
      provider
    )
  }


  static unregister(
    provider
  ) {

    const index =
      providers.indexOf(
        provider
      )


    if (
      index === -1
    ) {
      return
    }


    providers.splice(
      index,
      1
    )
  }


  static clearProviders() {

    providers.length = 0
  }


  static getProviders() {

    return [
      ...providers
    ]
  }


  // ====================================================
  // GENERIC EXECUTION
  // ====================================================

  static async execute(
    method,
    ...args
  ) {

    let result = null


    for (
      const provider
      of providers
    ) {

      if (
        !provider ||
        typeof provider[method] !== 'function'
      ) {
        continue
      }


      try {

        const value =
          await provider[method](
            ...args
          )


        if (
          Array.isArray(value)
        ) {

          if (
            value.length > 0
          ) {

            result =
              mergeLists(
                result,
                value
              )
          }


          continue
        }


        if (
          value != null
        ) {

          return value
        }

      } catch (
        error
      ) {

        console.warn(
          `[OnlineVehicleSource] ${method} provider failed:`,
          error
        )
      }
    }


    return (
      result ??
      []
    )
  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    return this.execute(
      'getVehicleTypes'
    )
  }


  // ====================================================
  // BRANDS
  // ====================================================
  //
  // DEFAULT
  // ----------------------------------------------------
  //
  // VehDB is the only source for the default brand
  // autocomplete.
  //
  // We deliberately DO NOT use:
  //
  //   CarQueryProvider.getBrands('car')
  //   NHTSAProvider.getBrands('car')
  //
  // because the current vPIC-backed catalog can contain
  // thousands of specialist / aftermarket / custom
  // manufacturers that are not suitable for Elola's
  // consumer vehicle selector.
  //
  // EXPLICIT TYPE
  // ----------------------------------------------------
  //
  // When the UI explicitly selects a vehicle type,
  // existing provider resolution remains available.
  //
  // ====================================================

  static async getBrands(
    vehicleType
  ) {

    const requestedType =
      normalizeVehicleType(
        vehicleType
      )


    // --------------------------------------------------
    // DEFAULT CONSUMER BRAND CATALOG
    // --------------------------------------------------

    if (
      !requestedType ||
      requestedType === '__all__'
    ) {

      const result =
        await getVehDBBrands()


      console.log(
        '[OnlineVehicleSource] Consumer brand catalog:',
        result.length
      )


      return result
    }


    // --------------------------------------------------
    // EXPLICIT TYPE
    // --------------------------------------------------
    //
    // Preserve existing provider behavior for explicitly
    // selected vehicle types.
    //
    // --------------------------------------------------

    const results = []


    for (
      const provider
      of providers
    ) {

      if (
        !provider ||
        typeof provider.getBrands !== 'function'
      ) {
        continue
      }


      try {

        const value =
          await provider.getBrands(
            requestedType
          )


        if (
          Array.isArray(value) &&
          value.length > 0
        ) {

          results.push(
            value
          )
        }

      } catch (
        error
      ) {

        console.warn(
          `[OnlineVehicleSource] Brand provider failed for ${requestedType}:`,
          error
        )
      }
    }


    return mergeLists(
      [],
      results.flat()
    )
  }


  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(
    params = {}
  ) {

    return this.execute(
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

    return this.execute(
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

    return this.execute(
      'findVehicle',
      params
    )
  }


  // ====================================================
  // GET ALL
  // ====================================================

  static async getAll() {

    return this.execute(
      'getAll'
    )
  }
}


// ======================================================
// EXPORT
// ======================================================

export default OnlineVehicleSource