// ======================================================
// EL OLA ERP
// CarQuery Provider
// ======================================================

export default class CarQueryProvider {

  // ====================================================
  // TYPES
  // ====================================================

  static async getVehicleTypes() {

    return []

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(vehicleType) {

    try {

      // سيتم ربط CarQuery API هنا

      return []

    }

    catch (error) {

      console.error(

        '[CarQueryProvider]',

        error

      )

      return []

    }

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(params) {

    try {

      // سيتم ربط CarQuery API هنا

      return []

    }

    catch (error) {

      console.error(

        '[CarQueryProvider]',

        error

      )

      return []

    }

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(params) {

    try {

      return []

    }

    catch (error) {

      console.error(

        '[CarQueryProvider]',

        error

      )

      return []

    }

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle(params) {

    try {

      return null

    }

    catch (error) {

      console.error(

        '[CarQueryProvider]',

        error

      )

      return null

    }

  }

}