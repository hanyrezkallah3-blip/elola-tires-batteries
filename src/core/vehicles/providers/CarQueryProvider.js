// ======================================================
// EL OLA ERP
// CarQuery Provider
//
// Vehicle data provider
//
// IMPORTANT
// ------------------------------------------------------
// CarQuery API is currently unreliable in browsers.
//
// This provider therefore uses the official NHTSA vPIC
// API as its online vehicle catalog source.
//
// IMPORTANT CHANGE
// ------------------------------------------------------
// Brand catalog is now requested from GetAllMakes instead
// of GetMakesForVehicleType/car.
//
// This prevents the autocomplete catalog from being
// restricted to only the vehicle-type-specific makes.
//
// No manually maintained manufacturer list is used.
// ======================================================

import VehicleMapper
  from '../VehicleMapper'


// ======================================================
// CONSTANTS
// ======================================================

const VPIC_BASE_URL =
  'https://vpic.nhtsa.dot.gov/api/vehicles'


// ======================================================
// NORMALIZE
// ======================================================

const normalize = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')


// ======================================================
// NORMALIZE MAKE
// ======================================================

const normalizeMake = value => {

  return normalize(value)
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '')
}


// ======================================================
// NORMALIZE MODEL
// ======================================================

const normalizeModel = value => {

  return normalize(value)
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '')
}


// ======================================================
// SAFE JSON REQUEST
// ======================================================

const requestJson = async (

  url

) => {

  try {

    const response =
      await fetch(
        url,
        {
          method:
            'GET',

          headers: {

            Accept:
              'application/json'

          }
        }
      )


    if (
      !response.ok
    ) {

      console.warn(
        '[VehicleProvider] HTTP request failed:',
        response.status,
        response.statusText
      )

      return null

    }


    return await response.json()

  }

  catch (error) {

    console.warn(
      '[VehicleProvider] Online vehicle source unavailable:',
      error
    )

    return null

  }

}


// ======================================================
// PROVIDER
// ======================================================

export default class CarQueryProvider {


  // ====================================================
  // LEGACY BASE URL
  // ====================================================

  static baseUrl =

    'https://www.carqueryapi.com/api/0.3/'


  // ====================================================
  // VPIC BASE URL
  // ====================================================

  static vpicBaseUrl =

    VPIC_BASE_URL


  // ====================================================
  // REQUEST
  // ====================================================

  static async request(

    query = {}

  ) {

    const cmd =
      query?.cmd


    // ================================================
    // GET MAKES
    // ================================================

    if (
      cmd ===
      'getMakes'
    ) {

      return this.requestMakes()

    }


    // ================================================
    // GET MODELS
    // ================================================

    if (
      cmd ===
      'getModels'
    ) {

      return this.requestModels({

        make:
          query?.make,

        year:
          query?.year

      })

    }


    return null

  }


  // ====================================================
  // REQUEST MAKES
  // ====================================================
  //
  // IMPORTANT:
  //
  // Use the complete NHTSA make catalog.
  //
  // We intentionally do NOT use:
  //
  // GetMakesForVehicleType/car
  //
  // because that endpoint limits the catalog according
  // to vehicle type.
  //
  // ====================================================

  static async requestMakes() {

    const url =

      `${this.vpicBaseUrl}` +
      `/GetAllMakes` +
      `?format=json`


    return requestJson(
      url
    )

  }


  // ====================================================
  // REQUEST MODELS
  // ====================================================

  static async requestModels({

    make,

    year

  } = {}) {

    if (
      !make
    ) {

      return null

    }


    const encodedMake =

      encodeURIComponent(
        String(make)
          .trim()
      )


    let url =

      `${this.vpicBaseUrl}` +
      `/GetModelsForMake/${encodedMake}` +
      `?format=json`


    if (
      year
    ) {

      url +=

        `&modelyear=${encodeURIComponent(
          year
        )}`

    }


    return requestJson(
      url
    )

  }


  // ====================================================
  // PARSE JSONP
  // ====================================================

  static parseJsonp(

    text = ''

  ) {

    try {

      const start =
        text.indexOf('(')

      const end =
        text.lastIndexOf(')')


      if (

        start === -1 ||

        end === -1

      ) {

        return null

      }


      return JSON.parse(

        text.substring(

          start + 1,

          end

        )

      )

    }

    catch (error) {

      console.error(

        '[CarQueryProvider] JSONP parse failed:',

        error

      )

      return null

    }

  }


  // ====================================================
  // TYPES
  // ====================================================

  static async getVehicleTypes() {

    return [

      {
        id:
          'car',

        value:
          'car',

        name:
          'سيارة',

        label:
          'سيارة'
      },

      {
        id:
          'suv',

        value:
          'suv',

        name:
          'SUV',

        label:
          'SUV'
      },

      {
        id:
          'truck',

        value:
          'truck',

        name:
          'شاحنة',

        label:
          'شاحنة'
      },

      {
        id:
          'motorcycle',

        value:
          'motorcycle',

        name:
          'دراجة نارية',

        label:
          'دراجة نارية'
      },

      {
        id:
          'bus',

        value:
          'bus',

        name:
          'حافلة',

        label:
          'حافلة'
      }

    ]

  }


  // ====================================================
  // BRANDS
  // ====================================================
  //
  // IMPORTANT:
  //
  // vehicleType is accepted for API compatibility but
  // does NOT restrict the manufacturer catalog.
  //
  // The autocomplete needs the complete make catalog.
  //
  // ====================================================

  static async getBrands(

    vehicleType = ''

  ) {

    const result =

      await this.request({

        cmd:
          'getMakes'

      })


    const makes =

      Array.isArray(
        result?.Results
      )
        ? result.Results
        : []


    const mapped =

      makes
        .map(item => {

          const id =

            item?.Make_ID ??

            item?.make_id ??

            item?.MakeId ??

            item?.Make_Name ??

            item?.make_display ??

            ''


          const name =

            item?.Make_Name ??

            item?.make_display ??

            item?.MakeName ??

            id


          return {

            id:
              String(id)
                .trim(),

            value:
              String(id)
                .trim(),

            name:
              String(name)
                .trim(),

            label:
              String(name)
                .trim(),

            source:
              'nhtsa',

            vehicleType:
              vehicleType || '',

            raw:
              item

          }

        })

        .filter(
          item =>
            item.id &&
            item.name
        )


    // ==================================================
    // REMOVE DUPLICATES
    // ==================================================

    const seen =
      new Set()


    return mapped.filter(
      item => {

        const key =
          normalize(
            item.name
          )


        if (
          !key
        ) {

          return false

        }


        if (
          seen.has(key)
        ) {

          return false

        }


        seen.add(key)

        return true

      }
    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  static async getModels({

    brand,

    year

  } = {}) {

    if (
      !brand
    ) {

      return []

    }


    const result =

      await this.request({

        cmd:
          'getModels',

        make:
          brand,

        year

      })


    const models =

      Array.isArray(
        result?.Results
      )
        ? result.Results
        : []


    const mapped =

      models.map(
        item => {

          const make =

            item?.Make_Name ??

            item?.make_display ??

            brand


          const model =

            item?.Model_Name ??

            item?.model_name ??

            item?.model_display ??

            ''


          return {

            id:

              item?.Model_ID ??

              `${make}-${model}`,

            make,

            brand:
              make,

            manufacturer:
              make,

            model,

            modelName:
              model,

            vehicleType:
              'car',

            year:
              year || '',

            source:
              'nhtsa',

            raw:
              item

          }

        }
      )


    const normalized =

      mapped.map(
        item => {

          try {

            const mappedItem =

              VehicleMapper.fromCarQuery(
                item
              )


            if (
              mappedItem &&
              typeof mappedItem ===
                'object'
            ) {

              return {

                ...item,

                ...mappedItem,

                make:
                  mappedItem.make ??
                  item.make,

                brand:
                  mappedItem.brand ??
                  mappedItem.make ??
                  item.brand,

                model:
                  mappedItem.model ??
                  item.model,

                modelName:
                  mappedItem.modelName ??
                  mappedItem.model ??
                  item.model

              }

            }

          }

          catch (error) {

            console.warn(
              '[VehicleProvider] VehicleMapper failed:',
              error
            )

          }


          return item

        }
      )


    // ==================================================
    // REMOVE DUPLICATE MODELS
    // ==================================================

    const seen =
      new Set()


    return normalized.filter(
      item => {

        const key =

          [

            normalize(
              item?.make ??
              item?.brand ??
              brand
            ),

            normalize(
              item?.model ??
              item?.modelName
            )

          ]
            .join('|')


        if (
          !key
        ) {

          return false

        }


        if (
          seen.has(key)
        ) {

          return false

        }


        seen.add(key)

        return true

      }
    )

  }


  // ====================================================
  // YEARS
  // ====================================================

  static async getYears({

    brand,

    model

  } = {}) {

    const years = []

    const current =
      new Date()
        .getFullYear()


    for (

      let year = 1980;

      year <= current;

      year++

    ) {

      years.push(
        year
      )

    }


    return years.reverse()

  }


  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle({

    make,

    model,

    year

  } = {}) {

    if (
      !make ||
      !model
    ) {

      return null

    }


    const vehicles =

      await this.getModels({

        brand:
          make,

        year

      })


    if (
      !Array.isArray(
        vehicles
      )
    ) {

      return null

    }


    const wantedMake =
      normalizeMake(
        make
      )


    const wantedModel =
      normalizeModel(
        model
      )


    const vehicle =

      vehicles.find(
        item => {

          const actualMake =

            normalizeMake(

              item?.make ??

              item?.brand ??

              item?.manufacturer ??

              ''

            )


          const actualModel =

            normalizeModel(

              item?.model ??

              item?.modelName ??

              ''

            )


          const makeMatch =

            actualMake ===
              wantedMake ||

            actualMake.includes(
              wantedMake
            ) ||

            wantedMake.includes(
              actualMake
            )


          const modelMatch =

            actualModel ===
              wantedModel ||

            actualModel.includes(
              wantedModel
            ) ||

            wantedModel.includes(
              actualModel
            )


          return (

            makeMatch &&

            modelMatch

          )

        }
      )


    if (
      !vehicle
    ) {

      return null

    }


    return {

      ...vehicle,

      make:
        vehicle?.make ??
        vehicle?.brand ??
        make,

      brand:
        vehicle?.brand ??
        vehicle?.make ??
        make,

      model:
        vehicle?.model ??
        vehicle?.modelName ??
        model,

      modelName:
        vehicle?.modelName ??
        vehicle?.model ??
        model,

      year:
        year || ''

    }

  }

}