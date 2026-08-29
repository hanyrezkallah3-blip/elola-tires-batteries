// ======================================================
// EL OLA ERP
// Vehicle Repository
// Unified Vehicle Data Access
// ======================================================

import vehicleTypes from './vehicleTypes'

import Toyota from './brands/Toyota'
import Hyundai from './brands/Hyundai'


const brands = [

  Toyota,

  Hyundai

]


// ======================================================
// NORMALIZE
// ======================================================

const normalize = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()


// ======================================================
// MATCH VALUE
// ======================================================

const matchesValue = (

  item,

  value,

  fields = []

) => {

  const wanted =

    normalize(value)


  if (!wanted)

    return false


  return fields.some(

    field =>

      normalize(

        item?.[field]

      ) === wanted

  )

}


// ======================================================
// FIND BRAND
// ======================================================

const findBrand = value => {

  const wanted =

    normalize(value)


  if (!wanted)

    return null


  return (

    brands.find(

      brand =>

        matchesValue(

          brand,

          wanted,

          [

            'id',

            'name',

            'make',

            'make_id',

            'make_display',

            'value'

          ]

        )

    )

    ||

    null

  )

}


// ======================================================
// FIND VEHICLE
// ======================================================

const findVehicleInBrand = (

  brand,

  value

) => {

  if (

    !brand ||

    !Array.isArray(

      brand.vehicles

    )

  ) {

    return null

  }


  const wanted =

    normalize(value)


  if (!wanted)

    return null


  return (

    brand.vehicles.find(

      vehicle =>

        matchesValue(

          vehicle,

          wanted,

          [

            'id',

            'name',

            'model',

            'modelName',

            'model_name',

            'model_id',

            'value'

          ]

        )

    )

    ||

    null

  )

}


// ======================================================
// VEHICLE TYPE MATCH
// ======================================================

const vehicleTypeMatches = (

  vehicle,

  vehicleType

) => {

  if (!vehicleType)

    return true


  const wanted =

    normalize(vehicleType)


  const actual =

    normalize(

      vehicle?.type ??

      vehicle?.vehicleType ??

      vehicle?.category ??

      ''

    )


  if (!actual)

    return true


  return (

    actual === wanted

  )

}


// ======================================================
// REPOSITORY
// ======================================================

export default class VehicleRepository {


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    return Array.isArray(

      vehicleTypes

    )

      ? vehicleTypes

      : []

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(

    vehicleType = ''

  ) {

    if (!vehicleType)

      return brands


    return brands.filter(

      brand =>

        Array.isArray(

          brand?.vehicles

        ) &&

        brand.vehicles.some(

          vehicle =>

            vehicleTypeMatches(

              vehicle,

              vehicleType

            )

        )

    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  static getModels(

    brandId,

    vehicleType = ''

  ) {

    const brand =

      findBrand(

        brandId

      )


    if (

      !brand ||

      !Array.isArray(

        brand.vehicles

      )

    ) {

      return []

    }


    return brand.vehicles.filter(

      vehicle =>

        vehicleTypeMatches(

          vehicle,

          vehicleType

        )

    )

  }


  // ====================================================
  // YEARS
  // ====================================================

  static getYears(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )


    if (!vehicle)

      return []


    if (

      Array.isArray(

        vehicle.years

      )

    ) {

      return vehicle.years

    }


    const yearFrom =

      Number(

        vehicle.yearFrom ??

        vehicle.year_from ??

        vehicle.startYear ??

        NaN

      )


    const yearTo =

      Number(

        vehicle.yearTo ??

        vehicle.year_to ??

        vehicle.endYear ??

        NaN

      )


    if (

      Number.isFinite(

        yearFrom

      ) &&

      Number.isFinite(

        yearTo

      ) &&

      yearTo >= yearFrom

    ) {

      const years = []


      for (

        let year = yearFrom;

        year <= yearTo;

        year++

      ) {

        years.push(year)

      }


      return years

    }


    const singleYear =

      Number(

        vehicle.year ??

        vehicle.modelYear ??

        vehicle.model_year ??

        NaN

      )


    if (

      Number.isFinite(

        singleYear

      )

    ) {

      return [

        singleYear

      ]

    }


    return []

  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle(

    brandId,

    vehicleId

  ) {

    const brand =

      findBrand(

        brandId

      )


    if (!brand)

      return null


    return findVehicleInBrand(

      brand,

      vehicleId

    )

  }


  // ====================================================
  // TIRE SIZES
  // ====================================================

  static getOEMSizes(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )


    if (!vehicle)

      return []


    return Array.isArray(

      vehicle?.tire?.oemSizes

    )

      ? vehicle.tire.oemSizes

      : []

  }


  // ====================================================
  // ALTERNATIVE SIZES
  // ====================================================

  static getAlternativeSizes(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )


    if (!vehicle)

      return []


    return Array.isArray(

      vehicle?.tire?.optionalSizes

    )

      ? vehicle.tire.optionalSizes

      : []

  }


  // ====================================================
  // BATTERY
  // ====================================================

  static getBattery(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )


    return vehicle

      ? (

          vehicle.battery ??

          null

        )

      : null

  }


  // ====================================================
  // OIL
  // ====================================================

  static getOil(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )


    return vehicle

      ? (

          vehicle.oil ??

          null

        )

      : null

  }


  // ====================================================
  // SEARCH BY TIRE SIZE
  // ====================================================

  static findByTireSize(

    tireSize

  ) {

    const wanted =

      normalize(tireSize)


    if (!wanted)

      return []


    return brands.flatMap(

      brand =>

        (

          Array.isArray(

            brand?.vehicles

          )

            ? brand.vehicles

            : []

        )

          .filter(

            vehicle => {

              const sizes =

                [

                  ...(Array.isArray(

                    vehicle?.tire?.oemSizes

                  )

                    ? vehicle.tire.oemSizes

                    : []),

                  ...(Array.isArray(

                    vehicle?.tire?.optionalSizes

                  )

                    ? vehicle.tire.optionalSizes

                    : [])

                ]


              return sizes.some(

                size =>

                  normalize(size) ===

                  wanted

              )

            }

          )

          .map(

            vehicle => ({

              brand:

                brand.name ??

                brand.id ??

                '',

              ...vehicle

            })

          )

    )

  }


  // ====================================================
  // DATABASE
  // ====================================================

  static getAllVehicles() {

    return brands.flatMap(

      brand =>

        (

          Array.isArray(

            brand?.vehicles

          )

            ? brand.vehicles

            : []

        ).map(

          vehicle => ({

            brand:

              brand.name ??

              brand.id ??

              '',

            brandId:

              brand.id ??

              '',

            ...vehicle

          })

        )

    )

  }

}