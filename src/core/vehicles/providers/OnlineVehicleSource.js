// ======================================================
// EL OLA ERP
// Online Vehicle Source
// ======================================================

import VehicleSourceSelector
from './VehicleSourceSelector'

export default class OnlineVehicleSource {

  // ====================================================
  // TYPES
  // ====================================================

  static async getVehicleTypes() {

    return await VehicleSourceSelector.getVehicleTypes()

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(vehicleType) {

    return await VehicleSourceSelector.getBrands(

      vehicleType

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(params) {

    return await VehicleSourceSelector.getModels(

      params

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(params) {

    return await VehicleSourceSelector.getYears(

      params

    )

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle(params) {

    return await VehicleSourceSelector.findVehicle(

      params

    )

  }

}