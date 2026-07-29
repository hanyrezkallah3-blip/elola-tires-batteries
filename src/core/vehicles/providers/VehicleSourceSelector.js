// ======================================================
// EL OLA ERP
// Vehicle Source Selector
// ======================================================

import NHTSAProvider
from './NHTSAProvider'

import CarQueryProvider
from './CarQueryProvider'

export default class VehicleSourceSelector {

  // ====================================================
  // PROVIDERS PRIORITY
  // ====================================================

  static providers = [

    NHTSAProvider,

    CarQueryProvider

  ]

  // ====================================================
  // EXECUTE
  // ====================================================

  static async execute(callback) {

    for (const provider of this.providers) {

      try {

        const data =

          await callback(provider)

        if (

          Array.isArray(data)

            ? data.length > 0

            : data

        ) {

          return data

        }

      }

      catch (error) {

        console.warn(

          `[${provider.name}]`,

          error

        )

      }

    }

    return null

  }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    return (

      await this.execute(

        provider =>

          provider.getVehicleTypes()

      )

    ) || []

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(vehicleType) {

    return (

      await this.execute(

        provider =>

          provider.getBrands(

            vehicleType

          )

      )

    ) || []

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(params) {

    return (

      await this.execute(

        provider =>

          provider.getModels(

            params

          )

      )

    ) || []

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(params) {

    return (

      await this.execute(

        provider =>

          provider.getYears(

            params

          )

      )

    ) || []

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle(params) {

    return await this.execute(

      provider =>

        provider.findVehicle(

          params

        )

    )

  }

}