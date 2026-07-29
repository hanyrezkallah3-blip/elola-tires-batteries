// ======================================================
// EL OLA ERP
// Vehicle Sync Manager
// ======================================================

import VehicleSyncService
from './VehicleSyncService'

export default class VehicleSyncManager {

  static started = false

  // ====================================================
  // START
  // ====================================================

  static async start() {

    if (this.started)

      return

    this.started = true

    try {

      await VehicleSyncService.syncVehicleTypes()

    }

    catch (error) {

      console.error(

        '[VehicleSyncManager]',

        error

      )

    }

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async syncBrands(vehicleType) {

    try {

      await VehicleSyncService.syncBrands(

        vehicleType

      )

    }

    catch (error) {

      console.error(error)

    }

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async syncModels(params) {

    try {

      await VehicleSyncService.syncModels(

        params

      )

    }

    catch (error) {

      console.error(error)

    }

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async syncYears(params) {

    try {

      await VehicleSyncService.syncYears(

        params

      )

    }

    catch (error) {

      console.error(error)

    }

  }

}