// ======================================================
// EL OLA ERP
// Online Vehicle Source
// ======================================================

export default class OnlineVehicleSource {

  static providers = []

  // ====================================================
  // REGISTER
  // ====================================================

  static register(provider) {

    if (

      provider &&

      !this.providers.includes(provider)

    ) {

      this.providers.push(provider)

    }

  }

  // ====================================================
  // EXECUTE
  // ====================================================

  static async execute(method, ...args) {

    for (const provider of this.providers) {

      if (

        typeof provider?.[method] !== 'function'

      ) {

        continue

      }

      try {

        const result = await provider[method](

          ...args

        )

        if (

          Array.isArray(result)

            ? result.length > 0

            : result

        ) {

          return result

        }

      }

      catch (error) {

        console.error(

          `[OnlineVehicleSource] ${provider.constructor?.name || 'Provider'} ${method}`,

          error

        )

      }

    }

    return Array.isArray(

      await Promise.resolve([])

    )

      ? []

      : null

  }

  // ====================================================
  // TYPES
  // ====================================================

  static getVehicleTypes() {

    return this.execute(

      'getVehicleTypes'

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    return this.execute(

      'getBrands',

      vehicleType

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    return this.execute(

      'getModels',

      params

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    return this.execute(

      'getYears',

      params

    )

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static findVehicle(params) {

    return this.execute(

      'findVehicle',

      params

    )

  }

}