// ======================================================
// EL OLA ERP
// NHTSA Provider
// ======================================================

import NHTSAClient
from './NHTSAClient'

export default class NHTSAProvider {

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    return []

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands() {

    const response =

      await NHTSAClient.getManufacturers()

    if (

      !response ||

      !Array.isArray(response.Results)

    ) {

      return []

    }

    return response.Results

      .map(item => ({

        id:

          String(

            item.Make_ID

          ),

        name:

          item.Make_Name

      }))

      .sort(

        (a, b) =>

          a.name.localeCompare(b.name)

      )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels({

    brand

  }) {

    if (!brand)

      return []

    const response =

      await NHTSAClient.getModels(

        brand

      )

    if (

      !response ||

      !Array.isArray(response.Results)

    ) {

      return []

    }

    return response.Results

      .map(item =>

        item.Model_Name

      )

      .filter(Boolean)

      .sort()

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears() {

    return []

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle() {

    return null

  }

}