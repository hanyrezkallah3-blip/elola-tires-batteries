// ======================================================
// EL OLA ERP
// Vehicle Search Controller
// ======================================================

import VehicleEngine from '../engines/VehicleEngine'

import ProductsRepository
  from '../../repositories/ProductsRepository'

class VehicleSearchController {

  // ====================================================
  // VEHICLE
  // ====================================================

  static async searchVehicle({

    vehicleType,

    make,

    model,

    year

  }) {

    const products =
      await ProductsRepository.getAll()

    return VehicleEngine.search({

      vehicleType,

      make,

      model,

      year,

      products

    })

  }

  // ====================================================
  // TIRE
  // ====================================================

  static async searchTire({

    width,

    profile,

    rim

  }) {

    const products =
      await ProductsRepository.getAll()

    return products.filter(product => {

      if (product.type !== 'tire')
        return false

      return (

        Number(product.tire?.width) === Number(width)

        &&

        Number(product.tire?.height) === Number(profile)

        &&

        Number(product.tire?.rim) === Number(rim)

      )

    })

  }

  // ====================================================
  // BATTERY
  // ====================================================

  static async searchBattery({

    capacity

  }) {

    const products =
      await ProductsRepository.getAll()

    return products.filter(product =>

      product.type === 'battery'

      &&

      Number(product.battery?.capacity)

      ===

      Number(capacity)

    )

  }

  // ====================================================
  // OIL
  // ====================================================

  static async searchOil({

    viscosity

  }) {

    const products =
      await ProductsRepository.getAll()

    return products.filter(product =>

      product.type === 'oil'

      &&

      product.oil?.viscosity === viscosity

    )

  }

}

export default VehicleSearchController