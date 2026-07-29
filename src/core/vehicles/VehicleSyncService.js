// ======================================================
// EL OLA ERP
// Vehicle Sync Service
// ======================================================

import VehicleCache
from './VehicleCache'

import OnlineVehicleSource
from './OnlineVehicleSource'

export default class VehicleSyncService {

  // ====================================================
  // UPDATE CACHE
  // ====================================================

  static updateCache(key, data) {

    if (

      Array.isArray(data)

        ? data.length

        : data

    ) {

      VehicleCache.set(

        key,

        data

      )

    }

  }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async syncVehicleTypes() {

    try {

      const data =

        await OnlineVehicleSource.getVehicleTypes()

      this.updateCache(

        'vehicleTypes',

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncVehicleTypes',

        error

      )

    }

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async syncBrands(vehicleType) {

    try {

      const data =

        await OnlineVehicleSource.getBrands(

          vehicleType

        )

      this.updateCache(

        `brands:${vehicleType || '__all__'}`,

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncBrands',

        error

      )

    }

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async syncModels(params) {

    try {

      const data =

        await OnlineVehicleSource.getModels(

          params

        )

      this.updateCache(

        `models:${JSON.stringify(params)}`,

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncModels',

        error

      )

    }

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async syncYears(params) {

    try {

      const data =

        await OnlineVehicleSource.getYears(

          params

        )

      this.updateCache(

        `years:${JSON.stringify(params)}`,

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncYears',

        error

      )

    }

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async syncVehicle(params) {

    try {

      const data =

        await OnlineVehicleSource.findVehicle(

          params

        )

      this.updateCache(

        `vehicle:${JSON.stringify(params)}`,

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncVehicle',

        error

      )

    }

  }

}