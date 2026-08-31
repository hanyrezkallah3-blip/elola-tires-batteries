// ======================================================
// EL OLA ERP
// Vehicle Specification Provider
// ======================================================
//
// PRIMARY SOURCE
// ------------------------------------------------------
// VehicleRepository remains the local authoritative
// vehicle source.
//
// This provider normalizes the vehicle record into the
// OEM specification contract used by OEMCompatibilityEngine.
//
// IMPORTANT
// ------------------------------------------------------
// We do NOT invent battery or oil specifications.
// We only read values that actually exist on the vehicle
// record.
//
// Supported:
// - tire
// - battery
// - oil
// - years
// ======================================================

import VehicleRepository
  from '../../../data/vehicles/VehicleRepository'


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalize = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')


// ======================================================
// GET ALL VEHICLES
// ======================================================

const getAllVehicles = () => {

  try {

    const vehicles =
      VehicleRepository.getAllVehicles?.()

    return Array.isArray(
      vehicles
    )
      ? vehicles
      : []

  }
  catch (error) {

    console.error(
      'VehicleSpecificationProvider.getAllVehicles failed:',
      error
    )

    return []

  }

}


// ======================================================
// FIND VEHICLE
// ======================================================

const findLocalVehicle = ({

  make,

  model,

  year

}) => {

  if (
    !make ||
    !model
  ) {

    return null

  }


  const vehicles =
    getAllVehicles()


  const wantedMake =
    normalize(
      make
    )


  const wantedModel =
    normalize(
      model
    )


  const requestedYear =
    Number(
      year
    )


  return (

    vehicles.find(
      vehicle => {

        const vehicleMake =
          normalize(
            vehicle?.brand ??
            vehicle?.make ??
            vehicle?.brandName ??
            ''
          )


        const models =
          Array.isArray(
            vehicle?.models
          )
            ? vehicle.models
            : []


        if (
          vehicleMake !==
          wantedMake
        ) {

          return false

        }


        const modelData =
          models.find(
            item =>
              normalize(
                item?.name ??
                item?.model ??
                item?.modelName ??
                ''
              ) === wantedModel
          )


        if (!modelData) {

          return false

        }


        // =================================================
        // YEAR
        // =================================================

        if (
          Number.isFinite(
            requestedYear
          )
        ) {

          const years =

            Array.isArray(
              modelData?.years
            )
              ? modelData.years
              : Array.isArray(
                  vehicle?.years
                )
                  ? vehicle.years
                  : []


          if (
            years.length > 0
          ) {

            return years.some(
              item =>
                Number(item) ===
                requestedYear
            )

          }


          const yearFrom =
            Number(
              modelData?.yearFrom ??
              modelData?.year_from ??
              modelData?.startYear ??
              vehicle?.yearFrom ??
              vehicle?.year_from ??
              vehicle?.startYear ??
              NaN
            )


          const yearTo =
            Number(
              modelData?.yearTo ??
              modelData?.year_to ??
              modelData?.endYear ??
              vehicle?.yearTo ??
              vehicle?.year_to ??
              vehicle?.endYear ??
              NaN
            )


          if (
            Number.isFinite(yearFrom) &&
            Number.isFinite(yearTo)
          ) {

            return (
              requestedYear >= yearFrom &&
              requestedYear <= yearTo
            )

          }


          if (
            Number.isFinite(yearFrom)
          ) {

            return (
              requestedYear >= yearFrom
            )

          }


          if (
            Number.isFinite(yearTo)
          ) {

            return (
              requestedYear <= yearTo
            )

          }

        }


        return true

      }
    ) ||

    null

  )

}


// ======================================================
// GET MODEL DATA
// ======================================================

const getModelData = vehicle => {

  if (!vehicle) {

    return null

  }


  if (
    vehicle?.modelData &&
    typeof vehicle.modelData === 'object'
  ) {

    return vehicle.modelData

  }


  if (
    Array.isArray(
      vehicle?.models
    )
  ) {

    const wantedModel =
      normalize(
        vehicle?.model ??
        vehicle?.modelName ??
        ''
      )


    if (wantedModel) {

      return (

        vehicle.models.find(
          item =>
            normalize(
              item?.name ??
              item?.model ??
              item?.modelName ??
              ''
            ) === wantedModel
        ) ||

        null

      )

    }

  }


  return null

}


// ======================================================
// GET FIRST EXISTING VALUE
// ======================================================

const firstExisting = (

  objects,

  keys

) => {

  for (
    const object of objects
  ) {

    if (
      !object ||
      typeof object !== 'object'
    ) {

      continue

    }


    for (
      const key of keys
    ) {

      const value =
        object?.[key]


      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {

        return value

      }

    }

  }


  return null

}


// ======================================================
// TIRE SPECIFICATION
// ======================================================

const getTireSpecification = vehicle => {

  const model =
    getModelData(
      vehicle
    )


  const sources = [

    model,

    vehicle

  ]


  const direct =
    firstExisting(

      sources,

      [

        'tire',

        'tireSpec',

        'tireSpecification',

        'tireSpecifications',

        'tireSize',

        'tireSizes',

        'oemTire',

        'oemTires',

        'oemTireSize',

        'oemTireSizes'

      ]

    )


  if (
    direct !== null
  ) {

    return direct

  }


  return null

}


// ======================================================
// BATTERY SPECIFICATION
// ======================================================

const getBatterySpecification = vehicle => {

  const model =
    getModelData(
      vehicle
    )


  const sources = [

    model?.batterySpecifications,

    model?.batterySpecification,

    model?.batterySpec,

    model?.battery,

    vehicle?.batterySpecifications,

    vehicle?.batterySpecification,

    vehicle?.batterySpec,

    vehicle?.battery,

    model,

    vehicle

  ]


  return firstExisting(

    sources,

    [

      'battery',

      'batterySpec',

      'batterySpecification',

      'batterySpecifications',

      'oemBattery',

      'oemBatterySpec',

      'batterySize',

      'batteryCapacity',

      'batteryCapacityAh',

      'capacity',

      'capacityAh',

      'ampereHour',

      'ampHours',

      'ah'

    ]

  )

}


// ======================================================
// OIL SPECIFICATION
// ======================================================

const getOilSpecification = vehicle => {

  const model =
    getModelData(
      vehicle
    )


  const sources = [

    model?.oilSpecifications,

    model?.oilSpecification,

    model?.oilSpec,

    model?.oil,

    vehicle?.oilSpecifications,

    vehicle?.oilSpecification,

    vehicle?.oilSpec,

    vehicle?.oil,

    model,

    vehicle

  ]


  return firstExisting(

    sources,

    [

      'oil',

      'oilSpec',

      'oilSpecification',

      'oilSpecifications',

      'oemOil',

      'oemOilSpec',

      'oilViscosity',

      'viscosity',

      'oilGrade',

      'grade',

      'grades',

      'viscosities'

    ]

  )

}


// ======================================================
// PROVIDER
// ======================================================

export default class VehicleSpecificationProvider {


  // ====================================================
  // OEM DATA
  // ====================================================

  static async getSpecifications({

    make,

    model,

    year

  }) {

    const vehicle =
      findLocalVehicle({

        make,

        model,

        year

      })


    if (!vehicle) {

      return null

    }


    const modelData =
      getModelData({

        ...vehicle,

        model

      })


    const normalizedVehicle = {

      ...vehicle,

      model:
        modelData?.name ??
        vehicle?.model ??
        model

    }


    return {

      ...normalizedVehicle,

      tire:
        getTireSpecification(
          normalizedVehicle
        ),

      battery:
        getBatterySpecification(
          normalizedVehicle
        ),

      oil:
        getOilSpecification(
          normalizedVehicle
        )

    }

  }

}