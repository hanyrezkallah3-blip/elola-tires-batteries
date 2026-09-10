// ======================================================
// EL OLA ERP
// Cached Vehicle Source
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Persistent vehicle catalog cache.
//
// SOURCES
// ------------------------------------------------------
//
// 1. VehiclesDB local open dataset.
// 2. Existing OnlineVehicleSource.
//
// IMPORTANT
// ------------------------------------------------------
//
// 1. VehiclesDB is local and requires no API request.
// 2. Online vehicle data remains available as fallback/
//    supplementary source.
// 3. Online data is cached cumulatively.
// 4. New non-empty results are merged with previous data.
// 5. Empty results NEVER erase existing cache.
// 6. Existing cached data remains available offline.
// 7. Duplicate vehicles/brands/models/years are removed.
// 8. This layer does NOT fabricate vehicle data.
// 9. VehDB fitment cache is handled separately.
// 10. Identical concurrent requests share one Promise.
// ======================================================

import VehicleCache
  from './VehicleCache'

import OnlineVehicleSource
  from './OnlineVehicleSource'

import VehiclesDBLocalSource
  from './VehiclesDBLocalSource'


// ======================================================
// CACHE VERSION
// ======================================================
//
// New version intentionally separates the catalog cache
// created before VehiclesDB integration.
//
// This prevents an old catalog cache from hiding the
// newly integrated local VehiclesDB catalog.
//

const BRAND_CACHE_VERSION =
  'v3-vehiclesdb'

const MODEL_CACHE_VERSION =
  'v1-vehiclesdb'

const VEHICLE_CACHE_VERSION =
  'v1-vehiclesdb'

const DATABASE_CACHE_VERSION =
  'v1-vehiclesdb'


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
// VEHICLE ITEM KEY
// ======================================================

const getVehicleKey = item => {

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


  const id =
    item.id ??
    item.vehicleId ??
    item.makeId ??
    item.modelId ??
    item.code ??
    item.value


  if (
    id != null &&
    String(id).trim()
  ) {

    return `id:${stableValue(id)}`
  }


  const brand =
    item.brand ??
    item.make ??
    item.manufacturer ??
    ''


  const model =
    item.model ??
    item.modelName ??
    ''


  const year =
    item.year ??
    item.yearFrom ??
    ''


  const vehicleType =
    item.vehicleType ??
    item.type ??
    item.category ??
    ''


  const key =
    [
      stableValue(vehicleType),
      stableValue(brand),
      stableValue(model),
      stableValue(year)
    ]
      .filter(Boolean)
      .join('|')


  if (
    key
  ) {

    return key
  }


  return stableValue(
    item.name ??
    item.label ??
    ''
  )

}


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


  const id =
    item.id ??
    item.value ??
    item.code ??
    item.makeId ??
    item.modelId ??
    item.vehicleId


  if (
    id != null &&
    String(id).trim()
  ) {

    return `id:${stableValue(id)}`
  }


  const brand =
    item.brand ??
    item.make ??
    item.manufacturer ??
    ''


  const model =
    item.model ??
    item.modelName ??
    ''


  const name =
    item.name ??
    item.label ??
    ''


  return stableValue(
    [
      brand,
      model,
      name
    ]
      .filter(Boolean)
      .join('|')
  )

}


// ======================================================
// MERGE LIST
// ======================================================

const mergeLists = (
  cached,
  fresh
) => {

  const previous =
    Array.isArray(cached)
      ? cached
      : []


  const incoming =
    Array.isArray(fresh)
      ? fresh
      : []


  if (
    incoming.length === 0
  ) {

    return previous
  }


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


    const existing =
      map.get(key)


    if (
      existing &&
      typeof existing === 'object' &&
      typeof item === 'object'
    ) {

      map.set(
        key,
        {
          ...existing,
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

  incoming.forEach(add)


  return Array.from(
    map.values()
  )

}


// ======================================================
// MERGE VEHICLES
// ======================================================

const mergeVehicles = (
  cached,
  fresh
) => {

  const previous =
    Array.isArray(cached)
      ? cached
      : []


  const incoming =
    Array.isArray(fresh)
      ? fresh
      : []


  if (
    incoming.length === 0
  ) {

    return previous
  }


  const map =
    new Map()


  const add = vehicle => {

    if (
      vehicle == null
    ) {
      return
    }


    const key =
      getVehicleKey(vehicle)


    if (
      !key
    ) {
      return
    }


    const existing =
      map.get(key)


    if (
      existing &&
      typeof existing === 'object' &&
      typeof vehicle === 'object'
    ) {

      map.set(
        key,
        {
          ...existing,
          ...vehicle
        }
      )

      return
    }


    map.set(
      key,
      vehicle
    )

  }


  previous.forEach(add)

  incoming.forEach(add)


  return Array.from(
    map.values()
  )

}


// ======================================================
// MERGE YEARS
// ======================================================

const mergeYears = (
  cached,
  fresh
) => {

  const previous =
    Array.isArray(cached)
      ? cached
      : []


  const incoming =
    Array.isArray(fresh)
      ? fresh
      : []


  const values =
    [
      ...previous,
      ...incoming
    ]
      .map(value => {

        if (
          typeof value === 'object'
        ) {

          return (
            value?.year ??
            value?.value ??
            value?.id ??
            value?.name
          )
        }


        return value
      })
      .filter(
        value =>
          value != null &&
          String(value).trim() !== ''
      )


  const unique =
    new Map()


  values.forEach(value => {

    const key =
      stableValue(value)


    if (
      !key
    ) {
      return
    }


    if (
      !unique.has(key)
    ) {

      unique.set(
        key,
        value
      )
    }

  })


  return Array.from(
    unique.values()
  )
    .sort(
      (a, b) =>
        Number(b) -
        Number(a)
    )

}


// ======================================================
// IS EMPTY
// ======================================================

const isEmptyValue = value => {

  if (
    value == null
  ) {
    return true
  }


  if (
    Array.isArray(value)
  ) {

    return value.length === 0
  }


  if (
    typeof value === 'object'
  ) {

    return Object.keys(
      value
    ).length === 0
  }


  return (
    String(value).trim() === ''
  )

}


// ======================================================
// CACHE SOURCE
// ======================================================

class CachedVehicleSource {


  constructor() {

    // --------------------------------------------------
    // Requests currently being resolved.
    //
    // Prevents duplicate concurrent requests.
    // --------------------------------------------------

    this.inFlight =
      new Map()

  }


  // ====================================================
  // READ CACHE
  // ====================================================

  getCached(
    key
  ) {

    const value =
      VehicleCache.get(
        key
      )


    if (
      Array.isArray(value)
    ) {

      return value.length > 0
        ? value
        : null
    }


    if (
      value == null
    ) {

      return null
    }


    if (
      typeof value === 'object'
    ) {

      return Object.keys(
        value
      ).length > 0
        ? value
        : null
    }


    if (
      String(value).trim() === ''
    ) {

      return null
    }


    return value

  }


  // ====================================================
  // SAVE CACHE
  // ====================================================

  save(
    key,
    value
  ) {

    if (
      isEmptyValue(value)
    ) {

      return value
    }


    VehicleCache.set(
      key,
      value
    )


    return value

  }


  // ====================================================
  // IN-FLIGHT KEY
  // ====================================================

  getInFlightKey(
    key
  ) {

    return String(
      key ?? ''
    )

  }


  // ====================================================
  // RESOLVE
  // ====================================================

  async resolve(
    key,
    loader,
    options = {}
  ) {

    const cached =
      this.getCached(
        key
      )


    if (
      cached != null
    ) {

      return cached
    }


    const requestKey =
      this.getInFlightKey(
        key
      )


    const existingRequest =
      this.inFlight.get(
        requestKey
      )


    if (
      existingRequest
    ) {

      return existingRequest
    }


    const request =

      (async () => {

        try {

          const fresh =
            await loader()


          if (
            isEmptyValue(fresh)
          ) {

            return (
              cached ??
              (
                Array.isArray(fresh)
                  ? []
                  : null
              )
            )
          }


          if (
            options.merge === true &&
            Array.isArray(fresh)
          ) {

            const merged =
              options.mergeYears
                ? mergeYears(
                    cached,
                    fresh
                  )
                : options.mergeVehicles
                  ? mergeVehicles(
                      cached,
                      fresh
                    )
                  : mergeLists(
                      cached,
                      fresh
                    )


            return this.save(
              key,
              merged
            )
          }


          return this.save(
            key,
            fresh
          )

        }

        catch (
          error
        ) {

          console.warn(
            '[CachedVehicleSource] Source failed:',
            error
          )


          return (
            cached ??
            (
              Array.isArray(
                cached
              )
                ? []
                : null
            )
          )

        }

        finally {

          this.inFlight.delete(
            requestKey
          )

        }

      })()


    this.inFlight.set(
      requestKey,
      request
    )


    return request

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  async getVehicleTypes() {

    const key =
      `vehicleTypes:${VEHICLE_CACHE_VERSION}`


    return this.resolve(
      key,

      async () => {

        const local =
          typeof VehiclesDBLocalSource
            .getVehicleTypes ===
            'function'
            ? VehiclesDBLocalSource
                .getVehicleTypes()
            : []


        let online = []


        try {

          if (
            typeof OnlineVehicleSource
              .getVehicleTypes ===
              'function'
          ) {

            online =
              await OnlineVehicleSource
                .getVehicleTypes()

          }

        }

        catch (
          error
        ) {

          console.warn(
            '[CachedVehicleSource] Online vehicle types failed:',
            error
          )

        }


        return mergeLists(
          local,
          online
        )

      },

      {
        merge: true
      }
    )

  }


  // ====================================================
  // BRANDS
  // ====================================================

  async getBrands(
    vehicleType
  ) {

    const type =
      stableValue(
        vehicleType ||
        '__all__'
      )


    const key =
      [
        'brands',
        BRAND_CACHE_VERSION,
        type
      ]
        .join(':')


    return this.resolve(
      key,

      async () => {

        const local =
          typeof VehiclesDBLocalSource
            .getBrands ===
            'function'
            ? VehiclesDBLocalSource
                .getBrands(
                  vehicleType
                )
            : []


        let online = []


        try {

          online =
            await OnlineVehicleSource
              .getBrands(
                vehicleType
              )

        }

        catch (
          error
        ) {

          console.warn(
            '[CachedVehicleSource] Online brands failed:',
            error
          )

        }


        return mergeLists(
          local,
          online
        )

      },

      {
        merge: true
      }
    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  async getModels(
    params = {}
  ) {

    const vehicleType =
      stableValue(
        params?.vehicleType ??
        ''
      )


    const brand =
      stableValue(
        params?.brand ??
        params?.make ??
        params?.brandId ??
        ''
      )


    const year =
      stableValue(
        params?.year ??
        ''
      )


    const exactKey =
      [
        'models',
        MODEL_CACHE_VERSION,
        JSON.stringify(params)
      ]
        .join(':')


    const familyKey =
      [
        'modelsCatalog',
        MODEL_CACHE_VERSION,
        vehicleType || '__all__',
        brand || '__all__'
      ]
        .join(':')


    const familyCached =
      this.getCached(
        familyKey
      )


    const exactCached =
      this.getCached(
        exactKey
      )


    if (
      familyCached != null &&
      !year
    ) {

      return familyCached
    }


    if (
      exactCached != null
    ) {

      return exactCached
    }


    try {

      const fresh =
        await this.resolve(
          exactKey,

          async () => {

            const local =
              typeof VehiclesDBLocalSource
                .getModels ===
                'function'
                ? VehiclesDBLocalSource
                    .getModels(
                      params
                    )
                : []


            let online = []


            try {

              online =
                await OnlineVehicleSource
                  .getModels(
                    params
                  )

            }

            catch (
              error
            ) {

              console.warn(
                '[CachedVehicleSource] Online models failed:',
                error
              )

            }


            return mergeLists(
              local,
              online
            )

          }
        )


      if (
        !Array.isArray(fresh) ||
        fresh.length === 0
      ) {

        return (
          familyCached ??
          exactCached ??
          []
        )
      }


      const merged =
        mergeLists(
          familyCached,
          fresh
        )


      this.save(
        familyKey,
        merged
      )


      return merged

    }

    catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] Models failed:',
        error
      )


      return (
        familyCached ??
        exactCached ??
        []
      )

    }

  }


  // ====================================================
  // YEARS
  // ====================================================

  async getYears(
    params = {}
  ) {

    const brand =
      stableValue(
        params?.brand ??
        params?.make ??
        params?.brandId ??
        ''
      )


    const model =
      stableValue(
        params?.model ??
        params?.vehicleId ??
        ''
      )


    const vehicleType =
      stableValue(
        params?.vehicleType ??
        ''
      )


    const exactKey =
      `years:${JSON.stringify(
        params
      )}`


    const familyKey =
      [
        'yearsCatalog',
        vehicleType || '__all__',
        brand || '__all__',
        model || '__all__'
      ]
        .join(':')


    const familyCached =
      this.getCached(
        familyKey
      )


    const exactCached =
      this.getCached(
        exactKey
      )


    if (
      familyCached != null
    ) {

      return mergeYears(
        familyCached,
        exactCached
      )
    }


    if (
      exactCached != null
    ) {

      return exactCached
    }


    try {

      const fresh =
        await this.resolve(
          exactKey,
          () =>
            OnlineVehicleSource
              .getYears(
                params
              )
        )


      if (
        !Array.isArray(fresh) ||
        fresh.length === 0
      ) {

        return (
          familyCached ??
          exactCached ??
          []
        )
      }


      const merged =
        mergeYears(
          familyCached,
          fresh
        )


      this.save(
        familyKey,
        merged
      )


      return merged

    }

    catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] Years online source failed:',
        error
      )


      return (
        familyCached ??
        exactCached ??
        []
      )

    }

  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  async findVehicle(
    params = {}
  ) {

    const key =
      [
        'vehicle',
        VEHICLE_CACHE_VERSION,
        JSON.stringify(params)
      ]
        .join(':')


    const cached =
      this.getCached(
        key
      )


    if (
      cached != null
    ) {

      return cached
    }


    return this.resolve(
      key,

      async () => {

        // ------------------------------------------------
        // VehiclesDB local catalog first.
        // ------------------------------------------------

        let local =
          null


        try {

          if (
            typeof VehiclesDBLocalSource
              .findVehicle ===
              'function'
          ) {

            local =
              VehiclesDBLocalSource
                .findVehicle(
                  params
                )

          }

        }

        catch (
          error
        ) {

          console.warn(
            '[CachedVehicleSource] VehiclesDB findVehicle failed:',
            error
          )

        }


        if (
          local
        ) {

          return local
        }


        // ------------------------------------------------
        // Existing online sources remain fallback.
        // ------------------------------------------------

        try {

          const fresh =
            await OnlineVehicleSource
              .findVehicle(
                params
              )


          if (
            fresh != null
          ) {

            return fresh
          }

        }

        catch (
          error
        ) {

          console.warn(
            '[CachedVehicleSource] Online findVehicle failed:',
            error
          )

        }


        return null

      }
    )

  }


  // ====================================================
  // GET ALL
  // ====================================================

  async getAll() {

    const key =
      `vehicleDatabase:${DATABASE_CACHE_VERSION}`


    const cached =
      this.getCached(
        key
      )


    if (
      cached != null
    ) {

      return cached
    }


    try {

      // ------------------------------------------------
      // Local VehiclesDB catalog.
      // ------------------------------------------------

      const local =
        typeof VehiclesDBLocalSource
          .getAll ===
          'function'
          ? VehiclesDBLocalSource
              .getAll()
          : []


      // ------------------------------------------------
      // Existing online database.
      // ------------------------------------------------

      let online = []


      try {

        if (
          typeof OnlineVehicleSource
            .getAll ===
            'function'
        ) {

          online =
            await OnlineVehicleSource
              .getAll()

        }

      }

      catch (
        error
      ) {

        console.warn(
          '[CachedVehicleSource] Online getAll failed:',
          error
        )

      }


      const merged =
        mergeVehicles(
          local,
          online
        )


      if (
        merged.length === 0
      ) {

        return []
      }


      return this.save(
        key,
        merged
      )

    }

    catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] getAll failed:',
        error
      )


      return cached ?? []

    }

  }


  // ====================================================
  // CLEAR
  // ====================================================

  clear() {

    this.inFlight.clear()

    VehicleCache.clear()

  }

}


// ======================================================
// SINGLETON
// ======================================================

export default new CachedVehicleSource()