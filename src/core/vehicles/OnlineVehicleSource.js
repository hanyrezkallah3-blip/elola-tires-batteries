// ======================================================
// EL OLA ERP
// Online Vehicle Source
// Unified Online Vehicle Provider Gateway
// ======================================================
//
// ARCHITECTURE:
//
// VehicleProvider
//      ↓
// CachedVehicleSource
//      ↓
// OnlineVehicleSource
//      ↓
// ┌───────────────────────┐
// │ CarQueryProvider      │
// │ NHTSAProvider         │
// └───────────────────────┘
//
// IMPORTANT:
// Providers are registered automatically when this
// source is loaded.
//
// This prevents the vehicle system from depending on
// VehicleSyncService.start() before it can access data.
//
// No manually maintained manufacturer files are used.
// ======================================================

import CarQueryProvider
  from './providers/CarQueryProvider'

import NHTSAProvider
  from './providers/NHTSAProvider'


export default class OnlineVehicleSource {


  // ====================================================
  // PROVIDERS
  // ====================================================

  static providers = [

    CarQueryProvider,

    NHTSAProvider

  ]


  // ====================================================
  // REGISTER
  // ====================================================

  static register(provider) {

    if (

      provider &&

      !this.providers.includes(provider)

    ) {

      this.providers.push(
        provider
      )

    }

  }


  // ====================================================
  // UNREGISTER
  // ====================================================

  static unregister(provider) {

    if (!provider)

      return

    this.providers =
      this.providers.filter(
        item =>
          item !== provider
      )

  }


  // ====================================================
  // CLEAR PROVIDERS
  // ====================================================

  static clearProviders() {

    this.providers = []

  }


  // ====================================================
  // GET PROVIDERS
  // ====================================================

  static getProviders() {

    return [
      ...this.providers
    ]

  }


  // ====================================================
  // EXECUTE
  // ====================================================

  static async execute(
    method,
    ...args
  ) {

    for (
      const provider
      of this.providers
    ) {

      if (

        typeof provider?.[method] !==
        'function'

      ) {

        continue

      }


      try {

        const result =
          await provider[method](
            ...args
          )


        // ----------------------------------------------
        // ARRAY RESULT
        // ----------------------------------------------

        if (
          Array.isArray(result)
        ) {

          if (
            result.length > 0
          ) {

            return result

          }

          continue

        }


        // ----------------------------------------------
        // OBJECT / VALUE RESULT
        // ----------------------------------------------

        if (
          result !== null &&
          result !== undefined &&
          result !== ''
        ) {

          return result

        }

      }

      catch (error) {

        console.error(

          `[OnlineVehicleSource] ${
            provider.name ||
            provider.constructor?.name ||
            'Provider'
          } ${method}`,

          error

        )

      }

    }


    // --------------------------------------------------
    // NO PROVIDER RETURNED DATA
    // --------------------------------------------------

    return []

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {

    return this.execute(

      'getVehicleTypes'

    )

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(
    vehicleType
  ) {

    return this.execute(

      'getBrands',

      vehicleType

    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  static getModels(
    params
  ) {

    return this.execute(

      'getModels',

      params

    )

  }


  // ====================================================
  // YEARS
  // ====================================================

  static getYears(
    params
  ) {

    return this.execute(

      'getYears',

      params

    )

  }


  // ====================================================
  // VEHICLE
  // ====================================================

  static findVehicle(
    params
  ) {

    return this.execute(

      'findVehicle',

      params

    )

  }


  // ====================================================
  // ALL VEHICLES
  // ====================================================

  static getAll() {

    return this.execute(

      'getAll'

    )

  }

}