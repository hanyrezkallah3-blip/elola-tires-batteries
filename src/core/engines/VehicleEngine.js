// ======================================================
// EL OLA ERP
// Vehicle Engine
// ======================================================

import VehicleRepository
  from '../../repositories/VehicleRepository'

import VehicleCompatibilityEngine
  from './VehicleCompatibilityEngine'

export class VehicleEngine {

  // ======================================================
  // FIND VEHICLE
  // ======================================================

  static findVehicle({

    make,

    model,

    year

  }) {

    return VehicleRepository.find({

      brand: make,

      model,

      year

    })

  }

  // ======================================================
  // SEARCH
  // ======================================================

  static search({

    vehicleType,

    make,

    model,

    year,

    products = []

  }) {

    const vehicle =

      this.findVehicle({

        make,

        model,

        year

      })

    const tires =

      VehicleCompatibilityEngine.filterProducts({

        products,

        type: 'tire',

        vehicleType,

        make,

        model,

        year

      })

    const batteries =

      VehicleCompatibilityEngine.filterProducts({

        products,

        type: 'battery',

        vehicleType,

        make,

        model,

        year

      })

    const oils =

      VehicleCompatibilityEngine.filterProducts({

        products,

        type: 'oil',

        vehicleType,

        make,

        model,

        year

      })

    return {

      vehicle,

      tires,

      batteries,

      oils,

      products: [

        ...tires,

        ...batteries,

        ...oils

      ]

    }

  }

}

export default VehicleEngine