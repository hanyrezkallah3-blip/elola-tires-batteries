// ======================================================
// EL OLA ERP
// Local Vehicle Source
// Repository Adapter
// ======================================================

import VehicleRepository
from '../../data/vehicles/VehicleRepository'

export default class LocalVehicleSource {

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    return VehicleRepository.getAllVehicles()

  }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    return VehicleRepository.getVehicleTypes()

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(

    vehicleType

  ) {

    return VehicleRepository.getBrands(

      vehicleType

    )

  }
    // ====================================================
  // MODELS
  // ====================================================

  static getModels({

    brand

  }) {

    if (!brand)

      return []

    return VehicleRepository

      .getModels(

        brand

      )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears({

    brand,

    model

  }) {

    if (

      !brand ||

      !model

    )

      return []

    return VehicleRepository

      .getYears(

        brand,

        model

      )

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle({

    make,

    model

  }) {

    if (

      !make ||

      !model

    )

      return null

    return VehicleRepository

      .findVehicle(

        make,

        model

      )

  }
    // ====================================================
  // SEARCH BY TIRE SIZE
  // ====================================================

  static getOEMSizes(

    brand,

    model

  ) {

    return VehicleRepository

      .getOEMSizes(

        brand,

        model

      )

  }

  static getAlternativeSizes(

    brand,

    model

  ) {

    return VehicleRepository

      .getAlternativeSizes(

        brand,

        model

      )

  }

  // ====================================================
  // BATTERY
  // ====================================================

  static getBattery(

    brand,

    model

  ) {

    return VehicleRepository

      .getBattery(

        brand,

        model

      )

  }

  // ====================================================
  // OIL
  // ====================================================

  static getOil(

    brand,

    model

  ) {

    return VehicleRepository

      .getOil(

        brand,

        model

      )

  }

}