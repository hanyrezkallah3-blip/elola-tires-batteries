// ======================================================
// EL OLA ERP
// Vehicle Provider
// ======================================================

import CachedVehicleSource
from './CachedVehicleSource'

import LocalVehicleSource
from './LocalVehicleSource'

import VehicleMapper
from './VehicleMapper'

export default class VehicleProvider {

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    return VehicleMapper.mapVehicleTypes(

      CachedVehicleSource.getVehicleTypes()

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    return VehicleMapper.mapBrands(

      CachedVehicleSource.getBrands(

        vehicleType

      )

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    return VehicleMapper.mapModels(

      CachedVehicleSource.getModels(

        params

      )

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    return VehicleMapper.mapYears(

      CachedVehicleSource.getYears(

        params

      )

    )

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static findVehicle(params) {

    const vehicle =

      CachedVehicleSource.findVehicle(

        params

      )

    if (!vehicle)

      return null

    return VehicleMapper.fromLocal(

      vehicle

    )

  }

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    return VehicleMapper.mapArray(

      CachedVehicleSource.getAll(),

      VehicleMapper.fromLocal

    )

  }

  // ====================================================
  // LOCAL DATABASE
  // ====================================================

  static getLocalDatabase() {

    return VehicleMapper.mapArray(

      LocalVehicleSource.getAll(),

      VehicleMapper.fromLocal

    )

  }

  // ====================================================
  // CACHE
  // ====================================================

  static clearCache() {

    if (

      CachedVehicleSource.clear

    ) {

      CachedVehicleSource.clear()

    }

  }

}