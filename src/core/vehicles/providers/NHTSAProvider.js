// ======================================================
// EL OLA ERP
// NHTSA Provider
// Online Vehicle Catalog Provider
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Provides normalized vehicle catalog data from the
// official NHTSA vPIC API.
//
// IMPORTANT:
// - No manually maintained manufacturer files.
// - No Toyota.js / Hyundai.js / etc.
// - Brands and models come from NHTSA vPIC.
// - When year is available, models are requested for the
//   selected make + year.
// - Vehicle type is also passed when supported.
// - This provider supplies vehicle catalog information.
// - It does NOT invent OEM tire, battery, or oil data.
//
// ======================================================

import HttpClient
  from '../../network/HttpClient'


export default class NHTSAProvider {


  // ====================================================
  // BASE URL
  // ====================================================

  static baseUrl =

    'https://vpic.nhtsa.dot.gov/api'


  // ====================================================
  // REQUEST
  // ====================================================

  static async request(

    endpoint,

    params = {}

  ) {

    try {

      return await HttpClient.get(

        `${this.baseUrl}${endpoint}`,

        {

          format: 'json',

          ...params

        }

      )

    }

    catch (error) {

      console.error(

        '[NHTSAProvider]',

        endpoint,

        error

      )

      return null

    }

  }


  // ====================================================
  // NORMALIZE TEXT
  // ====================================================

  static normalizeText(

    value

  ) {

    return String(value ?? '')

      .trim()

      .toLowerCase()

      .replace(/أ|إ|آ/g, 'ا')

      .replace(/ة/g, 'ه')

      .replace(/ى/g, 'ي')

      .replace(/\s+/g, ' ')

  }


  // ====================================================
  // NORMALIZE VEHICLE TYPE
  // ====================================================

  static normalizeVehicleType(

    value

  ) {

    const type =

      this.normalizeText(

        value

      )


    if (

      type === 'car' ||

      type === 'cars' ||

      type === 'vehicle' ||

      type === 'passenger' ||

      type === 'passenger car' ||

      type === 'sedan' ||

      type === 'سياره' ||

      type === 'سيارة' ||

      type === 'سيارات'

    ) {

      return 'car'

    }


    if (

      type === 'truck' ||

      type === 'trucks' ||

      type === 'lorry' ||

      type === 'شاحنه' ||

      type === 'شاحنة' ||

      type === 'شاحنات'

    ) {

      return 'truck'

    }


    if (

      type === 'bus' ||

      type === 'buses' ||

      type === 'حافله' ||

      type === 'حافلة' ||

      type === 'اتوبيس' ||

      type === 'أتوبيس'

    ) {

      return 'bus'

    }


    if (

      type === 'motorcycle' ||

      type === 'motorcycles' ||

      type === 'motor' ||

      type === 'bike' ||

      type === 'دراجه' ||

      type === 'دراجة' ||

      type === 'دراجة نارية'

    ) {

      return 'motorcycle'

    }


    if (

      type === 'suv' ||

      type === 'suvs'

    ) {

      return 'suv'

    }


    if (

      type === 'pickup' ||

      type === 'pick-up' ||

      type === 'pickups' ||

      type === 'بيك اب' ||

      type === 'بيك أب'

    ) {

      return 'pickup'

    }


    return type

  }


  // ====================================================
  // GET BRANDS
  // ====================================================

  static async getBrands(

    vehicleType = ''

  ) {

    let result = null


    // --------------------------------------------------
    // Prefer the vehicle-type endpoint when a type was
    // explicitly selected.
    // --------------------------------------------------

    if (

      vehicleType

    ) {

      const normalizedType =

        this.normalizeVehicleType(

          vehicleType

        )


      result =

        await this.request(

          `/vehicles/GetMakesForVehicleType/${encodeURIComponent(

            normalizedType

          )}`

        )

    }


    // --------------------------------------------------
    // If the type-specific endpoint returned nothing,
    // use the complete NHTSA make catalog.
    // --------------------------------------------------

    if (

      !Array.isArray(

        result?.Results

      ) ||

      result.Results.length === 0

    ) {

      result =

        await this.request(

          '/vehicles/GetAllMakes'

        )

    }


    if (

      !result ||

      !Array.isArray(

        result.Results

      )

    ) {

      return []

    }


    const seen =

      new Set()


    return result.Results

      .filter(

        make =>

          make &&

          (

            make.Make_ID ||

            make.Make_Name

          )

      )

      .map(

        make => {

          const id =

            make?.Make_ID ??

            make?.make_id ??

            make?.MakeId ??

            make?.Make_Name ??

            ''


          const name =

            make?.Make_Name ??

            make?.make_display ??

            make?.MakeName ??

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

            raw:

              make

          }

        }

      )

      .filter(

        item =>

          item.id &&

          item.name

      )

      .filter(

        item => {

          const key =

            this.normalizeText(

              item.name

            )


          if (

            !key ||

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
  // GET MODELS
  // ====================================================

  static async getModels(

    params = {}

  ) {

    const brand =

      params?.brand ??

      params?.make ??

      params?.brandId


    const year =

      params?.year


    const vehicleType =

      params?.vehicleType ??

      params?.type


    if (

      !brand

    ) {

      return []

    }


    let result = null


    // --------------------------------------------------
    // YEAR + MAKE + VEHICLE TYPE
    // --------------------------------------------------
    //
    // NHTSA officially supports:
    //
    // GetModelsForMakeYear
    //
    // and:
    //
    // GetModelsForMakeYear/.../vehicletype/...
    //
    // --------------------------------------------------

    if (

      year

    ) {

      const encodedBrand =

        encodeURIComponent(

          String(brand)

            .trim()

        )


      const encodedYear =

        encodeURIComponent(

          String(year)

            .trim()

        )


      if (

        vehicleType

      ) {

        const normalizedType =

          this.normalizeVehicleType(

            vehicleType

          )


        result =

          await this.request(

            `/vehicles/GetModelsForMakeYear/make/${encodedBrand}/modelyear/${encodedYear}/vehicletype/${encodeURIComponent(

              normalizedType

            )}`

          )

      }


      // ------------------------------------------------
      // FALLBACK: MAKE + YEAR
      // ------------------------------------------------

      if (

        !Array.isArray(

          result?.Results

        ) ||

        result.Results.length === 0

      ) {

        result =

          await this.request(

            `/vehicles/GetModelsForMakeYear/make/${encodedBrand}/modelyear/${encodedYear}`

          )

      }

    }


    // --------------------------------------------------
    // FALLBACK: MAKE ONLY
    // --------------------------------------------------

    if (

      !Array.isArray(

        result?.Results

      ) ||

      result.Results.length === 0

    ) {

      result =

        await this.request(

          `/vehicles/GetModelsForMake/${encodeURIComponent(

            String(brand)

              .trim()

          )}`

        )

    }


    if (

      !result ||

      !Array.isArray(

        result.Results

      )

    ) {

      return []

    }


    const seen =

      new Set()


    return result.Results

      .filter(

        model =>

          model &&

          (

            model.Model_ID ||

            model.Model_Name

          )

      )

      .map(

        model => {

          const make =

            model?.Make_Name ??

            model?.make_name ??

            brand


          const modelName =

            model?.Model_Name ??

            model?.model_name ??

            model?.model_display ??

            ''


          const id =

            model?.Model_ID ??

            `${make}-${modelName}`


          return {

            id:

              String(id)

                .trim(),

            value:

              String(id)

                .trim(),

            name:

              String(modelName)

                .trim(),

            label:

              String(modelName)

                .trim(),

            make:

              String(make)

                .trim(),

            brand:

              String(make)

                .trim(),

            manufacturer:

              String(make)

                .trim(),

            model:

              String(modelName)

                .trim(),

            modelName:

              String(modelName)

                .trim(),

            vehicleType:

              this.normalizeVehicleType(

                vehicleType ||

                'car'

              ),

            year:

              year ??

              '',

            source:

              'nhtsa',

            raw:

              model

          }

        }

      )

      .filter(

        item =>

          item.name

      )

      .filter(

        item => {

          const key =

            [

              this.normalizeText(

                item.make

              ),

              this.normalizeText(

                item.model

              )

            ]

              .join('|')


          if (

            !key ||

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
  // GET YEARS
  // ====================================================

  static async getYears(

    params = {}

  ) {

    const make =

      params?.make ??

      params?.brand


    const model =

      params?.model


    if (

      !make ||

      !model

    ) {

      return []

    }


    /*
     * vPIC does not provide the previous implementation's
     * simple "years for exact model" endpoint.
     *
     * We therefore build candidate years from the actual
     * NHTSA model catalog rather than claiming that every
     * year from 1980 to today belongs to the selected model.
     *
     * NHTSA's make/year model endpoint officially supports
     * model-year filtering.
     */


    const currentYear =

      new Date()

        .getFullYear()


    const minimumYear =

      1996


    const years = []


    /*
     * Querying every year is intentionally done only here,
     * when the UI specifically asks for years.
     *
     * The result is filtered against the selected model.
     */

    for (

      let year = currentYear;

      year >= minimumYear;

      year--

    ) {

      try {

        const models =

          await this.getModels({

            brand:

              make,

            year

          })


        if (

          !Array.isArray(

            models

          ) ||

          models.length === 0

        ) {

          continue

        }


        const wantedModel =

          this.normalizeText(

            model

          )


        const found =

          models.some(

            item => {

              const actual =

                this.normalizeText(

                  item?.model ??

                  item?.modelName ??

                  item?.name

                )


              return (

                actual ===

                  wantedModel ||

                actual.includes(

                  wantedModel

                ) ||

                wantedModel.includes(

                  actual

                )

              )

            }

          )


        if (

          found

        ) {

          years.push(

            year

          )

        }

      }

      catch (error) {

        console.warn(

          '[NHTSAProvider] Year lookup failed:',

          make,

          model,

          year,

          error

        )

      }

    }


    return years

      .sort(

        (a, b) =>

          b - a

      )

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

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

  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle(

    params = {}

  ) {

    const make =

      params?.make ??

      params?.brand


    const model =

      params?.model


    const year =

      params?.year


    const vehicleType =

      params?.vehicleType ??

      params?.type


    if (

      !make ||

      !model

    ) {

      return null

    }


    // --------------------------------------------------
    // IMPORTANT:
    //
    // When year is supplied, query the exact make/year
    // catalog instead of loading all models for the make.
    // --------------------------------------------------

    const models =

      await this.getModels({

        brand:

          make,

        year,

        vehicleType

      })


    if (

      !Array.isArray(

        models

      ) ||

      models.length === 0

    ) {

      return null

    }


    const wantedMake =

      this.normalizeText(

        make

      )


    const wantedModel =

      this.normalizeText(

        model

      )


    const vehicle =

      models.find(

        item => {

          const actualMake =

            this.normalizeText(

              item?.make ??

              item?.brand ??

              item?.manufacturer ??

              ''

            )


          const actualModel =

            this.normalizeText(

              item?.model ??

              item?.modelName ??

              item?.name ??

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

      id:

        vehicle?.id ??

        `${make}-${model}-${year || 'unknown'}`,

      vehicleType:

        vehicle?.vehicleType ??

        this.normalizeVehicleType(

          vehicleType ||

          'car'

        ),

      type:

        vehicle?.type ??

        this.normalizeVehicleType(

          vehicleType ||

          'car'

        ),

      make:

        vehicle?.make ??

        vehicle?.brand ??

        make,

      brand:

        vehicle?.brand ??

        vehicle?.make ??

        make,

      manufacturer:

        vehicle?.manufacturer ??

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

        year ??

        vehicle?.year ??

        null,

      yearFrom:

        year ??

        vehicle?.yearFrom ??

        null,

      yearTo:

        year ??

        vehicle?.yearTo ??

        null,

      source:

        'nhtsa',

      raw:

        vehicle?.raw ??

        vehicle

    }

  }

}