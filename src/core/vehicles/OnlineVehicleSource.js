// ======================================================
// EL OLA ERP
// Online Vehicle Source
// ======================================================

export default class OnlineVehicleSource {

  static providers = []

  // ====================================================
  // REGISTER PROVIDER
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
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    for (const provider of this.providers) {

      if (!provider.getVehicleTypes)

        continue

      const result =

        await provider.getVehicleTypes()

      if (

        result &&

        result.length

      ) {

        return result

      }

    }

    return []

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(vehicleType) {

    for (const provider of this.providers) {

      if (!provider.getBrands)

        continue

      const result =

        await provider.getBrands(vehicleType)

      if (

        result &&

        result.length

      ) {

        return result

      }

    }

    return []

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(params) {

    for (const provider of this.providers) {

      if (!provider.getModels)

        continue

      const result =

        await provider.getModels(params)

      if (

        result &&

        result.length

      ) {

        return result

      }

    }

    return []

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(params) {

    for (const provider of this.providers) {

      if (!provider.getYears)

        continue

      const result =

        await provider.getYears(params)

      if (

        result &&

        result.length

      ) {

        return result

      }

    }

    return []

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle(params) {

    for (const provider of this.providers) {

      if (!provider.findVehicle)

        continue

      const result =

        await provider.findVehicle(params)

      if (result)

        return result

    }

    return null

  }

  // ====================================================
  // SYNC
  // ====================================================

  static async sync() {

    return true

  }

}