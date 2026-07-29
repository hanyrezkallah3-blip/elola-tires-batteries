// ======================================================
// EL OLA ERP
// Vehicle Bootstrap
// ======================================================

import VehicleSyncManager
from '../core/vehicles/VehicleSyncManager'

export default class VehicleBootstrap {

  static initialized = false

  // ====================================================
  // INITIALIZE
  // ====================================================

  static async initialize() {

    if (this.initialized)

      return

    this.initialized = true

    try {

      await VehicleSyncManager.start()

    }

    catch (error) {

      console.error(

        '[VehicleBootstrap]',

        error

      )

    }

  }

}