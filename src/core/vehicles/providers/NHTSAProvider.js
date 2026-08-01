// ======================================================
// EL OLA ERP
// NHTSA Provider
// ======================================================

import HttpClient
from '../../network/HttpClient'

export default class NHTSAProvider {

  static baseUrl =

    'https://vpic.nhtsa.dot.gov/api'

  // ====================================================
  // GET MAKES
  // ====================================================

  static async getBrands() {

    const result = await HttpClient.get(

      `${this.baseUrl}/vehicles/GetAllMakes`,

      {

        format: 'json'

      }

    )

    if (

      !result ||

      !Array.isArray(result.Results)

    ) {

      return []

    }

    return result.Results.map(make => ({

      id:

        String(

          make.Make_ID

        ),

      name:

        make.Make_Name

    }))

  }

  // ====================================================
  // GET MODELS
  // ====================================================

  static async getModels({

    brand

  }) {

    if (!brand)

      return []

    const result = await HttpClient.get(

      `${this.baseUrl}/vehicles/GetModelsForMake/${encodeURIComponent(brand)}`,

      {

        format: 'json'

      }

    )

    if (

      !result ||

      !Array.isArray(result.Results)

    ) {

      return []

    }

    return result.Results.map(model => ({

      id:

        String(

          model.Model_ID

        ),

      name:

        model.Model_Name

    }))

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears() {

    const current =

      new Date().getFullYear()

    const years = []

    for (

      let year = current;

      year >= 1980;

      year--

    ) {

      years.push(year)

    }

    return years

  }

  // ====================================================
  // TYPES
  // ====================================================

  static async getVehicleTypes() {

    return []

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle({

    make,

    model,

    year

  }) {

    return {

      vehicleType: '',

      make,

      model,

      year

    }

  }

}