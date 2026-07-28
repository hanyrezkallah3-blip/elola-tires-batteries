// ======================================================
// EL OLA ERP
// Compatibility Engine
// ======================================================

import ProductsRepository
  from '../../repositories/ProductsRepository'

export default class CompatibilityEngine {

  // ====================================================
  // VEHICLE → PRODUCTS
  // ====================================================

  static async byVehicle({

    make,

    model,

    year

  }) {

    return await ProductsRepository.findCompatibleProducts({

      brand: make,

      model,

      year

    })

  }

  // ====================================================
  // TIRE SIZE → PRODUCTS
  // ====================================================

  static async byTireSize({

    width,

    profile,

    rim

  }) {

    return await ProductsRepository.findTiresBySize({

      width,

      profile,

      rim

    })

  }

  // ====================================================
  // BATTERY → PRODUCTS
  // ====================================================

  static async byBattery({

    capacity

  }) {

    return await ProductsRepository.findBatteries({

      capacity

    })

  }

  // ====================================================
  // OIL → PRODUCTS
  // ====================================================

  static async byOil({

    viscosity

  }) {

    return await ProductsRepository.findOils({

      viscosity

    })

  }

  // ====================================================
  // GENERIC SEARCH
  // ====================================================

  static async search({

    type,

    value

  }) {

    switch (type) {

      case 'vehicle':

        return await this.byVehicle(value)

      case 'tire':

        return await this.byTireSize(value)

      case 'battery':

        return await this.byBattery(value)

      case 'oil':

        return await this.byOil(value)

      default:

        return []

    }

  }

}