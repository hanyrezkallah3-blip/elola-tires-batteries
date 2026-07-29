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
  // TYPES
  // ====================================================

  static getVehicleTypes() {

    const key = 'vehicleTypes'

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

      LocalVehicleSource.getVehicleTypes()

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    const key =

      `brands:${vehicleType || '__all__'}`

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

      LocalVehicleSource.getBrands(vehicleType)

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    const key =

      `models:${JSON.stringify(params)}`

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

      LocalVehicleSource.getModels(params)

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    const key =

      `years:${JSON.stringify(params)}`

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

      LocalVehicleSource.getYears(params)

    )

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle(params) {

    const key =

      `vehicle:${JSON.stringify(params)}`

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

      LocalVehicleSource.findVehicle(params)

    )

  }

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    const key = 'vehicleDatabase'

    if (

      VehicleCache.has(key)

    ) {

      return VehicleCache.get(key)

    }

    return VehicleCache.set(

      key,

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