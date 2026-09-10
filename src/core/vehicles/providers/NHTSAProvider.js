// ======================================================
// EL OLA ERP
// NHTSA Vehicle Provider
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Online vehicle catalog provider using NHTSA vPIC.
//
// IMPORTANT
// ------------------------------------------------------
//
// 1. Provides real vehicle makes/models from vPIC.
// 2. Vehicle brands are requested by vehicle category.
// 3. GetAllMakes is intentionally NOT used for the
//    consumer vehicle brand catalog.
// 4. Vehicle fitment is NOT provided by this provider.
// 5. No vehicle data is fabricated.
// 6. Models remain resolved through vPIC.
// 7. VehDB fitment and Elola local fitment are handled
//    separately.
//
// IMPORTANT UPDATE
// ------------------------------------------------------
//
// vPIC year-specific model endpoints can return HTTP 404
// for valid makes in the current application flow.
//
// Therefore this provider intentionally uses:
//
//   /vehicles/GetModelsForMake/{make}
//
// as its model catalog endpoint.
//
// Year is treated as search metadata and matching is
// handled by the caller/local fitment layer.
//
// This prevents NHTSA catalog failures from interfering
// with Elola local vehicle fitment.
//
// ======================================================


import HttpClient
  from '../../network/HttpClient'


// ======================================================
// BASE URL
// ======================================================

const baseUrl =
  'https://vpic.nhtsa.dot.gov/api'


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
// TYPE NORMALIZATION
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
// REQUEST
// ======================================================

const request = async (
  endpoint,
  params = {}
) => {

  const query =
    new URLSearchParams(
      {
        format: 'json',
        ...params
      }
    )


  const url =
    `${baseUrl}${endpoint}?${query.toString()}`


  return HttpClient.get(
    url
  )
}


// ======================================================
// NORMALIZE MAKE RESULT
// ======================================================

const normalizeMake = (
  item,
  vehicleType = ''
) => {

  if (
    !item ||
    typeof item !== 'object'
  ) {

    return null
  }


  const makeId =
    item.Make_ID ??
    item.makeId ??
    item.id ??
    ''


  const makeName =
    item.Make_Name ??
    item.makeName ??
    item.name ??
    item.Make ??
    ''


  if (
    !String(makeName).trim()
  ) {

    return null
  }


  const type =
    normalizeVehicleType(
      vehicleType
    )


  return {

    id:
      makeId
        ? String(makeId)
        : `nhtsa-make-${stableValue(makeName)}`,

    value:
      String(makeName).trim(),

    name:
      String(makeName).trim(),

    label:
      String(makeName).trim(),

    make:
      String(makeName).trim(),

    brand:
      String(makeName).trim(),

    manufacturer:
      String(makeName).trim(),

    vehicleType:
      type || '',

    source:
      'nhtsa',

    raw:
      item

  }
}


// ======================================================
// NORMALIZE MODEL RESULT
// ======================================================

const normalizeModel = (
  item,
  params = {}
) => {

  if (
    !item ||
    typeof item !== 'object'
  ) {

    return null
  }


  const modelId =
    item.Model_ID ??
    item.modelId ??
    item.id ??
    ''


  const modelName =
    item.Model_Name ??
    item.modelName ??
    item.name ??
    item.Model ??
    ''


  if (
    !String(modelName).trim()
  ) {

    return null
  }


  const make =
    params?.brand ??
    params?.make ??
    params?.manufacturer ??
    ''


  const year =
    params?.year ??
    ''


  const vehicleType =
    normalizeVehicleType(
      params?.vehicleType ??
      ''
    )


  return {

    id:
      modelId
        ? String(modelId)
        : `nhtsa-model-${stableValue(modelName)}`,

    value:
      String(modelName).trim(),

    name:
      String(modelName).trim(),

    label:
      String(modelName).trim(),

    model:
      String(modelName).trim(),

    modelName:
      String(modelName).trim(),

    make:
      String(make).trim(),

    brand:
      String(make).trim(),

    manufacturer:
      String(make).trim(),

    vehicleType:
      vehicleType,

    year:
      year
        ? Number(year)
        : '',

    source:
      'nhtsa',

    raw:
      item

  }
}


// ======================================================
// DEDUPE
// ======================================================

const dedupe = (
  items
) => {

  const list =
    Array.isArray(items)
      ? items
      : []


  const map =
    new Map()


  list.forEach(
    item => {

      if (
        !item
      ) {
        return
      }


      const name =
        stableValue(
          item.name ??
          item.label ??
          item.value ??
          item.model ??
          item.make ??
          ''
        )


      if (
        !name
      ) {
        return
      }


      const type =
        stableValue(
          item.vehicleType ??
          ''
        )


      const key =
        [
          type,
          name
        ]
          .filter(Boolean)
          .join('|')


      const existing =
        map.get(key)


      if (
        existing &&
        typeof existing === 'object'
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
  )


  return Array.from(
    map.values()
  )
}


// ======================================================
// PROVIDER
// ======================================================

const NHTSAProvider = {

  // ====================================================
  // PROVIDER NAME
  // ====================================================

  name:
    'NHTSA',


  // ====================================================
  // GET BRANDS
  // ====================================================

  async getBrands(
    vehicleType = ''
  ) {

    const type =
      normalizeVehicleType(
        vehicleType
      )


    if (
      !type
    ) {

      return []
    }


    try {

      const response =
        await request(
          `/vehicles/GetMakesForVehicleType/${encodeURIComponent(type)}`
        )


      const results =
        Array.isArray(
          response?.Results
        )
          ? response.Results
          : Array.isArray(
              response?.results
            )
            ? response.results
            : []


      if (
        results.length === 0
      ) {

        console.warn(
          '[NHTSAProvider] No makes returned for vehicle type:',
          type
        )


        return []
      }


      const normalized =
        results
          .map(
            item =>
              normalizeMake(
                item,
                type
              )
          )
          .filter(Boolean)


      return dedupe(
        normalized
      )

    }
    catch (
      error
    ) {

      console.warn(
        '[NHTSAProvider] getBrands failed:',
        error
      )


      return []
    }
  },


  // ====================================================
  // GET MODELS
  // ====================================================
  //
  // IMPORTANT
  // ----------------------------------------------------
  //
  // NHTSA vPIC year-specific endpoint:
  //
  //   /GetModelsForMakeYear/{make}/{year}
  //
  // has produced HTTP 404 responses in the application.
  //
  // We therefore intentionally use ONLY:
  //
  //   /GetModelsForMake/{make}
  //
  // Year remains metadata and is preserved in the
  // normalized model records.
  //
  // Vehicle fitment is NOT inferred from NHTSA.
  //
  // ====================================================

  async getModels(
    params = {}
  ) {

    const brand =
      String(
        params?.brand ??
        params?.make ??
        params?.brandId ??
        ''
      )
        .trim()


    const year =
      String(
        params?.year ??
        ''
      )
        .trim()


    const vehicleType =
      normalizeVehicleType(
        params?.vehicleType ??
        ''
      )


    if (
      !brand
    ) {

      return []
    }


    // --------------------------------------------------
    // IMPORTANT:
    // Do NOT call GetModelsForMakeYear.
    //
    // It is the source of the HTTP 404 noise seen in
    // VehicleEngine -> OnlineVehicleSource.
    // --------------------------------------------------

    const endpoint =
      `/vehicles/GetModelsForMake/${encodeURIComponent(brand)}`


    try {

      const response =
        await request(
          endpoint
        )


      const results =
        Array.isArray(
          response?.Results
        )
          ? response.Results
          : Array.isArray(
              response?.results
            )
            ? response.results
            : []


      if (
        results.length === 0
      ) {

        return []
      }


      const normalized =
        results
          .map(
            item =>
              normalizeModel(
                item,
                {
                  ...params,

                  brand,

                  make:
                    brand,

                  year,

                  vehicleType

                }
              )
          )
          .filter(Boolean)


      return dedupe(
        normalized
      )

    }
    catch (
      error
    ) {

      console.warn(
        '[NHTSAProvider] Model request failed:',
        endpoint,
        error
      )


      return []
    }
  },


  // ====================================================
  // GET YEARS
  // ====================================================

  async getYears(
    params = {}
  ) {

    const brand =
      String(
        params?.brand ??
        params?.make ??
        ''
      )
        .trim()


    if (
      !brand
    ) {

      return []
    }


    const currentYear =
      new Date()
        .getFullYear()


    const years = []


    // --------------------------------------------------
    // IMPORTANT
    // --------------------------------------------------
    //
    // Do not issue hundreds of year-specific requests.
    //
    // The current application does not use NHTSA as the
    // technical fitment source.
    //
    // Use the make model catalog and inspect only data
    // actually returned by NHTSA when available.
    //
    // Since GetModelsForMake does not guarantee year
    // metadata, returning [] is safer than fabricating
    // supported years.
    //
    // --------------------------------------------------

    try {

      const models =
        await this.getModels(
          {
            brand,
            make:
              brand,
            vehicleType:
              params?.vehicleType ?? ''
          }
        )


      if (
        !Array.isArray(models) ||
        models.length === 0
      ) {

        return []
      }


      models.forEach(
        model => {

          const modelYear =
            Number(
              model?.year
            )


          if (
            Number.isFinite(modelYear) &&
            modelYear >= 1996 &&
            modelYear <= currentYear
          ) {

            years.push(
              modelYear
            )
          }
        }
      )

    }
    catch (
      error
    ) {

      console.warn(
        '[NHTSAProvider] getYears failed:',
        error
      )
    }


    return [
      ...new Set(
        years
      )
    ]
      .sort(
        (a, b) =>
          b - a
      )
  },


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  async getVehicleTypes() {

    return [

      {
        id:
          'car',

        value:
          'car',

        name:
          'Car',

        label:
          'Car',

        source:
          'nhtsa'
      },

      {
        id:
          'truck',

        value:
          'truck',

        name:
          'Truck',

        label:
          'Truck',

        source:
          'nhtsa'
      },

      {
        id:
          'bus',

        value:
          'bus',

        name:
          'Bus',

        label:
          'Bus',

        source:
          'nhtsa'
      },

      {
        id:
          'motorcycle',

        value:
          'motorcycle',

        name:
          'Motorcycle',

        label:
          'Motorcycle',

        source:
          'nhtsa'
      },

      {
        id:
          'suv',

        value:
          'suv',

        name:
          'SUV',

        label:
          'SUV',

        source:
          'nhtsa'
      },

      {
        id:
          'pickup',

        value:
          'pickup',

        name:
          'Pickup',

        label:
          'Pickup',

        source:
          'nhtsa'
      }

    ]
  },


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  async findVehicle(
    params = {}
  ) {

    const brand =
      String(
        params?.brand ??
        params?.make ??
        ''
      )
        .trim()


    const model =
      String(
        params?.model ??
        ''
      )
        .trim()


    const year =
      String(
        params?.year ??
        ''
      )
        .trim()


    if (
      !brand
    ) {

      return null
    }


    // --------------------------------------------------
    // NHTSA is catalog-only.
    //
    // We intentionally use GetModelsForMake through
    // getModels(). No year-specific endpoint is called.
    // --------------------------------------------------

    const models =
      await this.getModels(
        {
          ...params,

          brand,

          make:
            brand,

          year
        }
      )


    if (
      !Array.isArray(models) ||
      models.length === 0
    ) {

      return null
    }


    const normalizedModel =
      stableValue(
        model
      )


    let matched =
      null


    // --------------------------------------------------
    // 1. Exact model match
    // --------------------------------------------------

    if (
      normalizedModel
    ) {

      matched =
        models.find(
          item =>
            stableValue(
              item.model
            ) ===
            normalizedModel
        )


      // ------------------------------------------------
      // 2. Includes match
      // ------------------------------------------------

      if (
        !matched
      ) {

        matched =
          models.find(
            item => {

              const itemModel =
                stableValue(
                  item.model
                )


              return (
                itemModel.includes(
                  normalizedModel
                ) ||
                normalizedModel.includes(
                  itemModel
                )
              )
            }
          )
      }
    }


    // --------------------------------------------------
    // IMPORTANT
    // --------------------------------------------------
    //
    // Do NOT arbitrarily return the first NHTSA model
    // when a requested model was supplied but no model
    // matched.
    //
    // That could turn:
    //
    // Toyota Corolla 2021
    //
    // into an unrelated Toyota model.
    //
    // --------------------------------------------------

    if (
      normalizedModel &&
      !matched
    ) {

      return null
    }


    matched =
      matched ??
      models[0]


    return {

      id:
        matched.id,

      make:
        matched.make ||
        brand,

      brand:
        matched.brand ||
        brand,

      manufacturer:
        matched.manufacturer ||
        brand,

      model:
        matched.model,

      modelName:
        matched.modelName ||
        matched.model,

      vehicleType:
        matched.vehicleType ||
        normalizeVehicleType(
          params?.vehicleType
        ),

      year:
        year
          ? Number(year)
          : (
              matched.year ||
              ''
            ),

      source:
        'nhtsa',

      raw:
        matched.raw ??
        matched

    }
  }

}


// ======================================================
// EXPORT
// ======================================================

export default NHTSAProvider