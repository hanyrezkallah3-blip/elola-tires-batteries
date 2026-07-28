// ======================================================
// EL OLA ERP
// Vehicle Repository
// Temporary Compatibility Layer
// ======================================================

import { vehicleDatabase }
from '../data/vehicleDatabase'

export default class VehicleRepository {

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    const map = new Map()

    vehicleDatabase.forEach(vehicle => {

      if (!map.has(vehicle.type)) {

        map.set(vehicle.type, {

          id: vehicle.type,

          name: vehicle.typeName,

          image: ''

        })

      }

    })

    return [...map.values()]

  }

  // ====================================================
  // MANUFACTURERS
  // ====================================================

  static getManufacturers() {

    return [...new Set(

      vehicleDatabase.map(

        vehicle => vehicle.make

      )

    )]

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    return [

      ...new Set(

        vehicleDatabase

          .filter(vehicle =>

            !vehicleType ||

            vehicle.type === vehicleType

          )

          .map(vehicle => vehicle.make)

      )

    ]

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels({

    vehicleType,

    brand

  }) {

    if (!brand)

      return []

    return [

      ...new Set(

        vehicleDatabase

          .filter(vehicle =>

            vehicle.make === brand &&

            (

              !vehicleType ||

              vehicle.type === vehicleType

            )

          )

          .map(vehicle => vehicle.model)

      )

    ]

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears({

    brand,

    model

  }) {

    if (!brand || !model)

      return []

    const years = []

    vehicleDatabase

      .filter(vehicle =>

        vehicle.make === brand &&

        vehicle.model === model

      )

      .forEach(vehicle => {

        for (

          let year = vehicle.yearFrom;

          year <= vehicle.yearTo;

          year++

        ) {

          years.push(year)

        }

      })

    return [...new Set(years)].sort()

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle({

    make,

    model,

    year

  }) {

    return (

      vehicleDatabase.find(vehicle =>

        vehicle.make === make &&

        vehicle.model === model &&

        Number(year) >= vehicle.yearFrom &&

        Number(year) <= vehicle.yearTo

      ) || null

    )

  }

  // ====================================================
  // SEARCH
  // ====================================================

  static search(params) {

    const vehicle =

      this.findVehicle(params)

    if (!vehicle)

      return null

    return {

      vehicle,

      tires: vehicle.tires || [],

      batteries: vehicle.batteries || [],

      oils: vehicle.oils || []

    }

  }

  // ====================================================
  // LEGACY
  // ====================================================

  static getAll() {

    return vehicleDatabase

  }

  static getVehicleById(id) {

    return (

      vehicleDatabase.find(

        vehicle => vehicle.id === id

      ) || null

    )

  }

}