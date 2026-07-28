// ======================================================
// EL OLA ERP
// Vehicle Provider
// ======================================================

import CachedVehicleSource
from './CachedVehicleSource'

export default class VehicleProvider {

  // ====================================================
  // TYPES
  // ====================================================

  static getVehicleTypes() {

    return CachedVehicleSource.getVehicleTypes()

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    return CachedVehicleSource.getBrands(vehicleType)

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    return CachedVehicleSource.getModels(params)

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    return CachedVehicleSource.getYears(params)

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static findVehicle(params) {

    return CachedVehicleSource.findVehicle(params)

  }

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    return CachedVehicleSource.getAll()

  }

}