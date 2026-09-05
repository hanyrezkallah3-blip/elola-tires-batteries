// ======================================================
// EL OLA ERP
// Cached Vehicle Source
// Unified Cached + Online Vehicle Source
//
// ARCHITECTURE:
//
// VehicleProvider
//      ↓
// CachedVehicleSource
//      ↓
// VehicleCache
//      ↓
// OnlineVehicleSource
//      ↓
// CarQuery / NHTSA
//
// IMPORTANT:
// This source MUST NOT fall back to manually maintained
// manufacturer files such as Toyota.js or Hyundai.js.
// ======================================================

import VehicleCache
  from './VehicleCache'

import OnlineVehicleSource
  from './OnlineVehicleSource'


export default class CachedVehicleSource {


  // ====================================================
  // CACHE HELPER
  // ====================================================

  static getCached(key) {

    if (!VehicleCache.has(key)) {

      return null

    }

    const value =
      VehicleCache.get(key)

    if (
      Array.isArray(value)
    ) {

      return value.length > 0
        ? value
        : null

    }

    if (
      value !== null &&
      value !== undefined &&
      value !== ''
    ) {

      return value

    }

    return null

  }


  // ====================================================
  // SAVE CACHE
  // ====================================================

  static save(key, value) {

    if (
      value === null ||
      value === undefined
    ) {

      return value

    }

    if (
      Array.isArray(value) &&
      value.length === 0
    ) {

      return value

    }

    VehicleCache.set(
      key,
      value
    )

    return value

  }


  // ====================================================
  // GENERIC SOURCE
  // ====================================================

  static async resolve(
    key,
    loader
  ) {

    const cached =
      this.getCached(key)

    if (
      cached !== null
    ) {

      return cached

    }

    try {

      const online =
        await loader()

      if (
        online === null ||
        online === undefined
      ) {

        return Array.isArray(
          cached
        )
          ? []
          : null

      }

      if (
        Array.isArray(online) &&
        online.length === 0
      ) {

        return []

      }

      return this.save(
        key,
        online
      )

    }

    catch (error) {

      console.warn(
        '[CachedVehicleSource]',
        key,
        error
      )

      return Array.isArray(
        cached
      )
        ? cached || []
        : null

    }

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    return this.resolve(
      'vehicleTypes',

      () =>
        OnlineVehicleSource
          .getVehicleTypes()

    )

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(
    vehicleType
  ) {

    const key =
      `brands:${vehicleType || '__all__'}`

    return this.resolve(
      key,

      () =>
        OnlineVehicleSource
          .getBrands(
            vehicleType
          )

    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(
    params = {}
  ) {

    const key =
      `models:${JSON.stringify(params)}`

    return this.resolve(
      key,

      () =>
        OnlineVehicleSource
          .getModels(
            params
          )

    )

  }


  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(
    params = {}
  ) {

    const key =
      `years:${JSON.stringify(params)}`

    return this.resolve(
      key,

      () =>
        OnlineVehicleSource
          .getYears(
            params
          )

    )

  }


  // ====================================================
  // VEHICLE
  // ====================================================

  static async findVehicle(
    params = {}
  ) {

    const key =
      `vehicle:${JSON.stringify(params)}`

    return this.resolve(
      key,

      () =>
        OnlineVehicleSource
          .findVehicle(
            params
          )

    )

  }


  // ====================================================
  // DATABASE
  // ====================================================
  //
  // There is intentionally NO local manufacturer
  // database fallback here.
  //
  // The complete vehicle catalog is obtained from the
  // online source when requested.
  // ====================================================

  static async getAll() {

    const key =
      'vehicleDatabase'

    return this.resolve(
      key,

      async () => {

        const types =
          await OnlineVehicleSource
            .getVehicleTypes()

        const allVehicles = []

        /*
         * Online providers do not necessarily expose a
         * single "get all vehicles" endpoint.
         *
         * Therefore this method only returns a provider
         * supplied database if one exists.
         */

        if (
          typeof OnlineVehicleSource
            .getAll === 'function'
        ) {

          const result =
            await OnlineVehicleSource
              .getAll()

          if (
            Array.isArray(result)
          ) {

            return result

          }

        }

        /*
         * Do not manufacture a local database here.
         */

        if (
          Array.isArray(types) &&
          types.length === 0
        ) {

          return []

        }

        return []

      }

    )

  }


  // ====================================================
  // CLEAR
  // ====================================================

  static clear() {

    VehicleCache.clear()

  }

}