// ======================================================
// EL OLA ERP
// Vehicle Mapper
// ======================================================

export default class VehicleMapper {


  // ====================================================
  // TO NUMBER
  // ====================================================

  static toNumber(

    value,

    fallback = 0

  ) {

    const number = Number(value)

    return Number.isFinite(number)

      ? number

      : fallback

  }


  // ====================================================
  // NORMALIZE VEHICLE TYPE
  // ====================================================

  static normalizeVehicleType(

    type = ''

  ) {

    const value =

      String(type ?? '')

        .toLowerCase()

        .trim()


    if (

      [

        'car',

        'cars',

        'passenger',

        'passenger car',

        'sedan',

        'صالون',

        'سيارة',

        'سيارات'

      ].includes(value)

    ) {

      return 'car'

    }


    if (

      [

        'truck',

        'trucks',

        'lorry',

        'شاحنة',

        'شاحنات'

      ].includes(value)

    ) {

      return 'truck'

    }


    if (

      [

        'bus',

        'buses',

        'حافلة',

        'اتوبيس',

        'أتوبيس'

      ].includes(value)

    ) {

      return 'bus'

    }


    if (

      [

        'motor',

        'motorcycle',

        'motorcycles',

        'bike',

        'دراجة',

        'دراجة نارية'

      ].includes(value)

    ) {

      return 'motorcycle'

    }


    if (

      [

        'suv',

        'suvs'

      ].includes(value)

    ) {

      return 'suv'

    }


    if (

      [

        'pickup',

        'pick-up',

        'pickups',

        'بيك اب',

        'بيك أب'

      ].includes(value)

    ) {

      return 'pickup'

    }


    return value

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static mapVehicleTypes(

    items = []

  ) {

    if (

      !Array.isArray(items)

    )

      return []


    return items

      .filter(Boolean)

      .map(item => {

        if (

          typeof item === 'string'

        ) {

          const type =

            this.normalizeVehicleType(

              item

            )


          return {

            id: type,

            value: type,

            name: item,

            label: item,

            image: ''

          }

        }


        const rawType =

          item?.type ??

          item?.value ??

          item?.id ??

          item?.name ??

          ''


        const type =

          this.normalizeVehicleType(

            rawType

          )


        return {

          id:

            item?.id ??

            type,

          value: type,

          name:

            item?.name ??

            item?.label ??

            item?.type ??

            type,

          label:

            item?.label ??

            item?.name ??

            item?.type ??

            type,

          image:

            item?.image ??

            ''

        }

      })

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static mapBrands(

    items = []

  ) {

    if (

      !Array.isArray(items)

    )

      return []


    return items

      .filter(

        item =>

          item &&

          (

            typeof item === 'object' ||

            typeof item === 'string'

          )

      )

      .map(item => {

        if (

          typeof item === 'string'

        ) {

          return {

            id: item,

            value: item,

            name: item,

            label: item

          }

        }


        const id =

          item?.id ??

          item?.make_id ??

          item?.make ??

          item?.name ??

          item?.make_display ??

          ''


        const name =

          item?.name ??

          item?.make_display ??

          item?.make ??

          item?.label ??

          id


        return {

          ...item,

          id,

          value: id,

          name,

          label: name

        }

      })

  }


  // ====================================================
  // MODELS
  // ====================================================

  static mapModels(

    items = []

  ) {

    if (

      !Array.isArray(items)

    )

      return []


    return items

      .filter(

        item =>

          item &&

          (

            typeof item === 'object' ||

            typeof item === 'string'

          )

      )

      .map(item => {

        if (

          typeof item === 'string'

        ) {

          return {

            id: item,

            value: item,

            name: item,

            label: item

          }

        }


        const id =

          item?.id ??

          item?.model_id ??

          item?.model ??

          item?.model_name ??

          item?.name ??

          ''


        const name =

          item?.name ??

          item?.model_name ??

          item?.model ??

          item?.label ??

          id


        return {

          ...item,

          id,

          value: id,

          name,

          label: name

        }

      })

  }


  // ====================================================
  // YEARS
  // ====================================================

  static mapYears(

    items = []

  ) {

    if (

      !Array.isArray(items)

    )

      return []



    return items

      .map(item => {

        const value =

          typeof item === 'object'

            ? (

                item?.year ??

                item?.name ??

                item?.value ??

                item?.id

              )

            : item


        if (

          value === undefined ||

          value === null ||

          value === ''

        ) {

          return null

        }


        return {

          id: String(value),

          value: String(value),

          name: String(value),

          label: String(value)

        }

      })

      .filter(Boolean)

  }


  // ====================================================
  // CARQUERY
  // ====================================================

  static fromCarQuery(

    vehicle = {}

  ) {

    const make =

      vehicle.make_display ||

      vehicle.make_name ||

      vehicle.model_make_display ||

      vehicle.model_make_id ||

      ''


    const model =

      vehicle.model_name ||

      vehicle.model_display ||

      ''


    const yearFrom =

      this.toNumber(

        vehicle.model_year ||

        vehicle.year_from ||

        vehicle.yearFrom,

        1980

      )


    const yearTo =

      this.toNumber(

        vehicle.year_to ||

        vehicle.yearTo,

        new Date().getFullYear()

      )


    const type =

      this.normalizeVehicleType(

        vehicle.vehicle_type ||

        vehicle.type

      )


    return {

      id:

        vehicle.model_id ||

        `${make}-${model}-${yearFrom}`,

      vehicleType: type,

      type,

      typeName: type,

      make,

      model,

      yearFrom,

      yearTo,

      source: 'carquery',

      raw: vehicle

    }

  }


  // ====================================================
  // NHTSA
  // ====================================================

  static fromNHTSA(

    vehicle = {}

  ) {

    const make =

      vehicle.Make_Name || ''


    const model =

      vehicle.Model_Name || ''


    return {

      id:

        vehicle.Model_ID ||

        `${make}-${model}`,

      vehicleType: 'car',

      type: 'car',

      typeName: 'car',

      make,

      model,

      yearFrom: 1980,

      yearTo:

        new Date().getFullYear(),

      source: 'nhtsa',

      raw: vehicle

    }

  }


  // ====================================================
  // LOCAL
  // ====================================================

  static fromLocal(

    vehicle = {}

  ) {

    return {

      ...vehicle,

      source: 'local'

    }

  }


  // ====================================================
  // ARRAY
  // ====================================================

  static mapArray(

    items = [],

    mapper

  ) {

    if (

      !Array.isArray(items)

    )

      return []


    return items.map(

      mapper

    )

  }

}