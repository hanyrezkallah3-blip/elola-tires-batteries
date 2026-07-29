// ======================================================
// EL OLA ERP
// NHTSA Client
// ======================================================

const BASE_URL = 'https://vpic.nhtsa.dot.gov/api'

export default class NHTSAClient {

  // ====================================================
  // REQUEST
  // ====================================================

  static async request(path) {

    try {

      const response = await fetch(

        `${BASE_URL}${path}`

      )

      if (!response.ok) {

        throw new Error(

          `HTTP ${response.status}`

        )

      }

      return await response.json()

    }

    catch (error) {

      console.error(

        '[NHTSAClient]',

        error

      )

      return null

    }

  }

  // ====================================================
  // ALL MANUFACTURERS
  // ====================================================

  static async getManufacturers() {

    return await this.request(

      '/vehicles/getallmakes?format=json'

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(make) {

    return await this.request(

      `/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`

    )

  }

}