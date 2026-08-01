// ======================================================
// EL OLA ERP
// Vehicle Specification Provider
// ======================================================

import CarQueryProvider
from './CarQueryProvider'

import NHTSAProvider
from './NHTSAProvider'

export default class VehicleSpecificationProvider {

  // ====================================================
  // OEM DATA
  // ====================================================

  static async getSpecifications({

    make,

    model,

    year

  }) {

    let result =

      await CarQueryProvider.findVehicle({

        make,

        model,

        year

      })

    if (result)

      return result

    result =

      await NHTSAProvider.findVehicle({

        make,

        model,

        year

      })

    if (result)

      return result

    return null

  }

}