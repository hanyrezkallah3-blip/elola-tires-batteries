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
// IMPORTANT
// ------------------------------------------------------
//
// 1. Online vehicle data is cached cumulatively.
// 2. New non-empty results are merged with previous data.
// 3. Empty online results are NEVER allowed to erase cache.
// 4. Existing cached data remains available offline.
// 5. Duplicate vehicles/brands/models/years are removed.
// 6. This layer does NOT fabricate vehicle data.
// 7. VehDB fitment cache is handled separately.
// 8. Brand catalog cache uses a versioned key so an old
//    limited catalog cannot permanently block expansion.
//
// ======================================================

import VehicleCache
  from './VehicleCache'

import OnlineVehicleSource
  from './OnlineVehicleSource'


// ======================================================
// CACHE VERSION
// ======================================================
//
// Changing this value intentionally creates a new cache
// namespace for the expanded vehicle brand catalog.
//
// ======================================================

const BRAND_CACHE_VERSION =
  'v2-expanded'


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


  const name =
    item.name ??
    item.label ??
    item.value ??
    item.make ??
    item.model ??
    item.brand ??
    item.manufacturer ??
    ''


  return stableValue(name)
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

    } catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] Online source failed:',
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
  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  async getVehicleTypes() {

    return this.resolve(
      'vehicleTypes',
      () =>
        OnlineVehicleSource
          .getVehicleTypes(),

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


    // --------------------------------------------------
    // VERSIONED CACHE
    // --------------------------------------------------
    //
    // The old brands:<type> cache may contain the
    // previous limited catalog.
    //
    // The expanded catalog uses a separate namespace.
    //
    // --------------------------------------------------

    const key =
      [
        'brands',
        BRAND_CACHE_VERSION,
        type
      ]
        .join(':')


    return this.resolve(
      key,

      () =>
        OnlineVehicleSource
          .getBrands(
            vehicleType
          ),

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
      `models:${JSON.stringify(
        params
      )}`


    const familyKey =
      [
        'modelsCatalog',
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
        await OnlineVehicleSource
          .getModels(
            params
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


      this.save(
        exactKey,
        fresh
      )


      return merged

    } catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] Models online source failed:',
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
        await OnlineVehicleSource
          .getYears(
            params
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


      this.save(
        exactKey,
        fresh
      )


      return merged

    } catch (
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
      `vehicle:${JSON.stringify(
        params
      )}`


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

      const fresh =
        await OnlineVehicleSource
          .findVehicle(
            params
          )


      if (
        fresh == null
      ) {

        return cached ?? null
      }


      return this.save(
        key,
        fresh
      )

    } catch (
      error
    ) {

      console.warn(
        '[CachedVehicleSource] Vehicle lookup failed:',
        error
      )


      return cached ?? null
    }
  }


  // ====================================================
  // GET ALL
  // ====================================================

  async getAll() {

    const key =
      'vehicleDatabase'


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

      if (
        typeof OnlineVehicleSource
          .getAll !== 'function'
      ) {

        return []
      }


      const fresh =
        await OnlineVehicleSource
          .getAll()


      if (
        !Array.isArray(fresh) ||
        fresh.length === 0
      ) {

        return []
      }


      return this.save(
        key,
        fresh
      )

    } catch (
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

    VehicleCache.clear()
  }
}


// ======================================================
// SINGLETON
// ======================================================

export default new CachedVehicleSource()