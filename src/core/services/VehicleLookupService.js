// ======================================================
// EL OLA ERP
// Vehicle Lookup Service
// ======================================================

import VehicleRepository
  from '../../repositories/VehicleRepository'

class VehicleLookupService {

  // ======================================================
  // VEHICLE TYPES
  // ======================================================

  static getCategories() {

    return VehicleRepository.getVehicleTypes()

  }

  // ======================================================
  // BRANDS
  // ======================================================

  static getBrands(vehicleType = '') {

    return VehicleRepository.getBrands(

      vehicleType

    )

  }

  // ======================================================
  // MODELS
  // ======================================================

  static getModels(brand, vehicleType = '') {

    return VehicleRepository.getModels({

      brand,

      vehicleType

    })

  }

  // ======================================================
  // YEARS
  // ======================================================

  static getYears({

    manufacturer,

    model

  }) {

    return VehicleRepository.getYears({

      brand: manufacturer,

      model

    })

  }

  // ======================================================
  // FIND VEHICLE
  // ======================================================

  static findVehicle({

    manufacturer,

    model,

    year

  }) {

    return VehicleRepository.find({

      brand: manufacturer,

      model,

      year

    })

  }

}

export default VehicleLookupService