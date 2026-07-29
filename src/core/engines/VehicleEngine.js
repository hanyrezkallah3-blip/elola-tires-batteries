// ======================================================
// EL OLA ERP
// Vehicle Engine
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

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

    return VehicleProvider.findVehicle({

      make,

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

      this.filterTires({

        products,

        vehicleType,

        make,

        model,

        year

      })

    const batteries =

      this.filterBatteries({

        products,

        vehicleType,

        make,

        model,

        year

      })

    const oils =

      this.filterOils({

        products,

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

  // ======================================================
  // FILTER TIRES
  // ======================================================

  static filterTires(params) {

    return VehicleCompatibilityEngine.filterProducts({

      ...params,

      type: 'tire'

    })

  }

  // ======================================================
  // FILTER BATTERIES
  // ======================================================

  static filterBatteries(params) {

    return VehicleCompatibilityEngine.filterProducts({

      ...params,

      type: 'battery'

    })

  }

  // ======================================================
  // FILTER OILS
  // ======================================================

  static filterOils(params) {

    return VehicleCompatibilityEngine.filterProducts({

      ...params,

      type: 'oil'

    })

  }

  // ======================================================
  // ALL PRODUCTS
  // ======================================================

  static filterAll(params) {

    return [

      ...this.filterTires(params),

      ...this.filterBatteries(params),

      ...this.filterOils(params)

    ]

  }

}

export default VehicleEngine