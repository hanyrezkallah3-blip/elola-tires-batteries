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
// 4. This prevents non-vehicle/business manufacturer
//    names from entering autocomplete.
// 5. No vehicle data is fabricated.
// 6. Models remain resolved through vPIC.
// 7. VehDB fitment is handled separately.
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
  //
  // IMPORTANT
  // ----------------------------------------------------
  //
  // We deliberately do NOT fall back to:
  //
  //   /vehicles/GetAllMakes
  //
  // because that endpoint contains thousands of
  // manufacturers that are not suitable for consumer
  // vehicle autocomplete.
  //
  // ====================================================

  async getBrands(
    vehicleType = ''
  ) {

    const type =
      normalizeVehicleType(
        vehicleType
      )


    // --------------------------------------------------
    // A specific vehicle type is required here.
    // --------------------------------------------------

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

    } catch (
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


    const requests = []


    // --------------------------------------------------
    // 1. Vehicle type + make + year
    // --------------------------------------------------

    if (
      vehicleType &&
      year
    ) {

      requests.push(
        `/vehicles/GetModelsForMakeYear/${encodeURIComponent(brand)}/${encodeURIComponent(year)}/vehicletype/${encodeURIComponent(vehicleType)}`
      )
    }


    // --------------------------------------------------
    // 2. Vehicle type + make
    // --------------------------------------------------

    if (
      vehicleType
    ) {

      requests.push(
        `/vehicles/GetModelsForMake/${encodeURIComponent(brand)}/vehicletype/${encodeURIComponent(vehicleType)}`
      )
    }


    // --------------------------------------------------
    // 3. Make + year
    // --------------------------------------------------

    if (
      year
    ) {

      requests.push(
        `/vehicles/GetModelsForMakeYear/${encodeURIComponent(brand)}/${encodeURIComponent(year)}`
      )
    }


    // --------------------------------------------------
    // 4. Make only
    // --------------------------------------------------

    requests.push(
      `/vehicles/GetModelsForMake/${encodeURIComponent(brand)}`
    )


    for (
      const endpoint
      of requests
    ) {

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

          continue
        }


        const normalized =
          results
            .map(
              item =>
                normalizeModel(
                  item,
                  params
                )
            )
            .filter(Boolean)


        if (
          normalized.length > 0
        ) {

          return dedupe(
            normalized
          )
        }

      } catch (
        error
      ) {

        console.warn(
          '[NHTSAProvider] Model request failed:',
          endpoint,
          error
        )
      }
    }


    return []
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
    // vPIC model data is more reliable than fabricating
    // years from a generic range.
    //
    // Query the available years through model lookups.
    // --------------------------------------------------

    for (
      let year = 1996;
      year <= currentYear;
      year++
    ) {

      try {

        const response =
          await request(
            `/vehicles/GetModelsForMakeYear/${encodeURIComponent(brand)}/${year}`
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
          results.length > 0
        ) {

          years.push(
            year
          )
        }

      } catch (
        error
      ) {

        // ------------------------------------------------
        // One failed year must not stop the entire lookup.
        // ------------------------------------------------

        continue
      }
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


    const models =
      await this.getModels(
        {
          ...params,
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


      if (
        !matched
      ) {

        matched =
          models.find(
            item =>
              stableValue(
                item.model
              )
                .includes(
                  normalizedModel
                ) ||
              normalizedModel.includes(
                stableValue(
                  item.model
                )
              )
          )
      }
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