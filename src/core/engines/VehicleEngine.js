// ======================================================
// EL OLA ERP
// Vehicle Engine
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import OEMCompatibilityEngine
from './OEMCompatibilityEngine'

import VehicleCompatibilityEngine
from './VehicleCompatibilityEngine'

export class VehicleEngine {

  // ======================================================
  // FIND VEHICLE
  // ======================================================

  static async findVehicle({

    make,

    model,

    year

  }) {

    return await VehicleProvider.findVehicle({

      make,

      model,

      year

    })

  }

  // ======================================================
  // SEARCH
  // ======================================================

  static async search({

    vehicleType,

    make,

    model,

    year,

    products = []

  }) {

    const vehicle =

      await this.findVehicle({

        make,

        model,

        year

      })

    const oem =

      await OEMCompatibilityEngine.search({

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

        year,

        oem

      })

    const batteries =

      this.filterBatteries({

        products,

        vehicleType,

        make,

        model,

        year,

        oem

      })

    const oils =

      this.filterOils({

        products,

        vehicleType,

        make,

        model,

        year,

        oem

      })

    return {

      vehicle,

      oem,

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

    if (

      params.oem?.tire

    ) {

      // المرحلة القادمة:
      // ProductsRepository.findByTireSpecification()

    }

    return VehicleCompatibilityEngine.filterProducts({

      ...params,

      type: 'tire'

    })

  }

  // ======================================================
  // FILTER BATTERIES
  // ======================================================

  static filterBatteries(params) {

    if (

      params.oem?.battery

    ) {

      // المرحلة القادمة:
      // ProductsRepository.findByBatterySpecification()

    }

    return VehicleCompatibilityEngine.filterProducts({

      ...params,

      type: 'battery'

    })

  }

  // ======================================================
  // FILTER OILS
  // ======================================================

  static filterOils(params) {

    if (

      params.oem?.oil

    ) {

      // المرحلة القادمة:
      // ProductsRepository.findByOilSpecification()

    }

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