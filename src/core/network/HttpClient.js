// ======================================================
// EL OLA ERP
// HTTP Client
// ======================================================

export default class HttpClient {

  // ====================================================
  // GET
  // ====================================================

  static async get(url) {

    try {

      const response = await fetch(url)

      if (!response.ok) {

        throw new Error(

          `HTTP ${response.status}`

        )

      }

      return await response.json()

    }

    catch (error) {

      console.error(

        '[HttpClient]',

        error

      )

      return null

    }

  }

}