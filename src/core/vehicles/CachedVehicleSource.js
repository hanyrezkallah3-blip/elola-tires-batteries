// ======================================================
// EL OLA ERP
// Cached Vehicle Source
// ======================================================

import VehicleCache
from './VehicleCache'

import LocalVehicleSource
from './LocalVehicleSource'

export default class CachedVehicleSource {

  // ====================================================
  // HELPERS
  // ====================================================

  static fromCache(key, fallback) {

    if (

      VehicleCache.has(key)

    ) {

      const value =

        VehicleCache.get(key)

      if (

        Array.isArray(value)

      ) {

        if (value.length)

          return value

      }

      else if (value) {

        return value

      }

    }

    return fallback()

  }

  // ====================================================
  // TYPES
  // ====================================================

  static getVehicleTypes() {

    return this.fromCache(

      'vehicleTypes',

      () =>

        LocalVehicleSource.getVehicleTypes()

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    const key =

      `brands:${vehicleType || '__all__'}`

    return this.fromCache(

      key,

      () =>

        LocalVehicleSource.getBrands(

          vehicleType

        )

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    const key =

      `models:${JSON.stringify(params)}`

    return this.fromCache(

      key,

      () =>

        LocalVehicleSource.getModels(

          params

        )

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    const key =

      `years:${JSON.stringify(params)}`

    return this.fromCache(

      key,

      () =>

        LocalVehicleSource.getYears(

          params

        )

    )

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static findVehicle(params) {

    const key =

      `vehicle:${JSON.stringify(params)}`

    return this.fromCache(

      key,

      () =>

        LocalVehicleSource.findVehicle(

          params

        )

    )

  }

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    return this.fromCache(

      'vehicleDatabase',

      () =>

        LocalVehicleSource.getAll()

    )

  }

  // ====================================================
  // CLEAR
  // ====================================================

  static clear() {

    VehicleCache.clear()

  }

}