// ======================================================
// EL OLA ERP
// Vehicle Repository
// Unified Vehicle Data Access
//
// IMPORTANT:
// This repository MUST NOT depend on manually created
// brand/model files such as Toyota.js or Hyundai.js.
//
// Vehicle catalog data comes from the online vehicle
// providers through the Provider layer.
//
// Elola-specific vehicle intelligence (OEM tire sizes,
// alternative sizes, battery, oil, etc.) must be handled
// by its own data source and is NOT fabricated here.
// ======================================================

import VehicleMapper
  from '../../core/vehicles/VehicleMapper'


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

      vehicle?.vehicleType ??

      vehicle?.type ??

      vehicle?.category ??

      ''

    )


  if (!actual)

    return true


  return (

    VehicleMapper.normalizeVehicleType(

      actual

    ) ===

    VehicleMapper.normalizeVehicleType(

      wanted

    )

  )

}


// ======================================================
// VEHICLE REPOSITORY
// ======================================================

export default class VehicleRepository {


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    /*
     * Vehicle types are intentionally kept minimal here.
     *
     * The actual vehicle catalog is supplied by the
     * online providers.
     *
     * This is NOT a manufacturer database.
     */

    return [

      {

        id: 'car',

        value: 'car',

        name: 'Car',

        label: 'Car'

      },

      {

        id: 'truck',

        value: 'truck',

        name: 'Truck',

        label: 'Truck'

      },

      {

        id: 'bus',

        value: 'bus',

        name: 'Bus',

        label: 'Bus'

      },

      {

        id: 'motorcycle',

        value: 'motorcycle',

        name: 'Motorcycle',

        label: 'Motorcycle'

      }

    ]

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(

    vehicleType = ''

  ) {

    /*
     * This method is intentionally NOT backed by
     * local manufacturer files.
     *
     * CachedVehicleSource is responsible for supplying
     * cached online data when available.
     *
     * If no online data has been synchronized yet,
     * return an empty array instead of inventing brands.
     */

    return []

  }


  // ====================================================
  // MODELS
  // ====================================================

  static getModels(

    brandId,

    vehicleType = ''

  ) {

    if (!brandId)

      return []


    /*
     * No manually maintained model database exists here.
     *
     * Models are supplied by the active online provider.
     */

    return []

  }


  // ====================================================
  // YEARS
  // ====================================================

  static getYears(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return []

    }


    /*
     * Years are provider data.
     *
     * We do not fabricate vehicle-specific years
     * from local manufacturer files.
     */

    return []

  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return null

    }


    /*
     * Vehicle lookup is performed by the provider layer.
     */

    return null

  }


  // ====================================================
  // TIRE SIZES
  // ====================================================

  static getOEMSizes(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return []

    }


    /*
     * OEM sizes must come from Elola's vehicle
     * intelligence/data layer.
     *
     * They must NOT be fabricated inside brand files.
     */

    return []

  }


  // ====================================================
  // ALTERNATIVE SIZES
  // ====================================================

  static getAlternativeSizes(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return []

    }


    /*
     * Alternative sizes belong to Elola's own
     * compatibility intelligence layer.
     */

    return []

  }


  // ====================================================
  // BATTERY
  // ====================================================

  static getBattery(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return null

    }


    /*
     * Battery compatibility belongs to Elola's
     * vehicle intelligence layer.
     */

    return null

  }


  // ====================================================
  // OIL
  // ====================================================

  static getOil(

    brandId,

    vehicleId

  ) {

    if (

      !brandId ||

      !vehicleId

    ) {

      return null

    }


    /*
     * Oil compatibility belongs to Elola's
     * vehicle intelligence layer.
     */

    return null

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


    /*
     * There is deliberately no manually maintained
     * manufacturer database here.
     *
     * Tire-size search will be connected later to the
     * unified Elola vehicle compatibility repository.
     */

    return []

  }


  // ====================================================
  // DATABASE
  // ====================================================

  static getAllVehicles() {

    /*
     * The repository no longer constructs a fake local
     * vehicle database from manufacturer files.
     *
     * OnlineVehicleSource / VehicleProvider owns the
     * external catalog.
     */

    return []

  }


  // ====================================================
  // NORMALIZED VEHICLE
  // ====================================================

  static normalizeVehicle(

    vehicle = {}

  ) {

    if (

      !vehicle ||

      typeof vehicle !== 'object'

    ) {

      return null

    }


    const make =

      vehicle.make ??

      vehicle.brand ??

      vehicle.manufacturer ??

      vehicle.make_display ??

      ''


    const model =

      vehicle.model ??

      vehicle.modelName ??

      vehicle.model_name ??

      vehicle.model_display ??

      ''


    const vehicleType =

      VehicleMapper.normalizeVehicleType(

        vehicle.vehicleType ??

        vehicle.type ??

        vehicle.category ??

        ''

      )


    const yearFrom =

      Number(

        vehicle.yearFrom ??

        vehicle.year_from ??

        vehicle.startYear ??

        vehicle.model_year ??

        NaN

      )


    const yearTo =

      Number(

        vehicle.yearTo ??

        vehicle.year_to ??

        vehicle.endYear ??

        vehicle.model_year ??

        NaN

      )


    return {

      ...vehicle,

      id:

        vehicle.id ??

        vehicle.model_id ??

        `${make}-${model}`,

      vehicleType,

      type:

        vehicle.type ??

        vehicleType,

      make,

      model,

      ...(

        Number.isFinite(yearFrom)

          ? { yearFrom }

          : {}

      ),

      ...(

        Number.isFinite(yearTo)

          ? { yearTo }

          : {}

      )

    }

  }


  // ====================================================
  // FILTER VEHICLES
  // ====================================================

  static filterVehicles(

    vehicles = [],

    {

      vehicleType = '',

      brand = '',

      make = '',

      model = '',

      year = ''

    } = {}

  ) {

    if (

      !Array.isArray(vehicles)

    ) {

      return []

    }


    const requestedBrand =

      brand ||

      make


    return vehicles.filter(

      vehicle => {

        const normalized =

          this.normalizeVehicle(

            vehicle

          )


        if (!normalized)

          return false


        // ----------------------------------------------
        // TYPE
        // ----------------------------------------------

        if (

          vehicleType &&

          !vehicleTypeMatches(

            normalized,

            vehicleType

          )

        ) {

          return false

        }


        // ----------------------------------------------
        // BRAND
        // ----------------------------------------------

        if (

          requestedBrand &&

          !matchesValue(

            normalized,

            requestedBrand,

            [

              'id',

              'make',

              'brand',

              'manufacturer',

              'make_display'

            ]

          )

        ) {

          const actualBrand =

            normalize(

              normalized.make

            )


          const wantedBrand =

            normalize(

              requestedBrand

            )


          if (

            !actualBrand ||

            (

              !actualBrand.includes(

                wantedBrand

              ) &&

              !wantedBrand.includes(

                actualBrand

              )

            )

          ) {

            return false

          }

        }


        // ----------------------------------------------
        // MODEL
        // ----------------------------------------------

        if (model) {

          const actualModel =

            normalize(

              normalized.model

            )


          const wantedModel =

            normalize(

              model

            )


          if (

            !actualModel ||

            (

              !actualModel.includes(

                wantedModel

              ) &&

              !wantedModel.includes(

                actualModel

              )

            )

          ) {

            return false

          }

        }


        // ----------------------------------------------
        // YEAR
        // ----------------------------------------------

        if (year) {

          const requestedYear =

            Number(year)


          if (

            Number.isFinite(

              requestedYear

            )

          ) {

            const from =

              Number(

                normalized.yearFrom

              )


            const to =

              Number(

                normalized.yearTo

              )


            if (

              Number.isFinite(from) &&

              Number.isFinite(to)

            ) {

              if (

                requestedYear < from ||

                requestedYear > to

              ) {

                return false

              }

            }

            else if (

              Number.isFinite(from)

            ) {

              if (

                requestedYear !== from

              ) {

                return false

              }

            }

          }

        }


        return true

      }

    )

  }


  // ====================================================
  // SEARCH
  // ====================================================

  static search(

    vehicles = [],

    params = {}

  ) {

    return this.filterVehicles(

      vehicles,

      params

    )

  }

}