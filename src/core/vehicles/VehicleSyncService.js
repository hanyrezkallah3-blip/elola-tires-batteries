// ======================================================
// EL OLA ERP
// Vehicle Sync Service
// ======================================================

import VehicleCache
from './VehicleCache'

import OnlineVehicleSource
from './OnlineVehicleSource'

import CarQueryProvider
from './providers/CarQueryProvider'

import NHTSAProvider
from './providers/NHTSAProvider'

// ======================================================
// REGISTER PROVIDERS (مرة واحدة)
// ======================================================

let registered = false

function registerProviders() {

  if (registered)

    return

  OnlineVehicleSource.register(

    CarQueryProvider

  )

  OnlineVehicleSource.register(

    NHTSAProvider

  )

  registered = true

}

export default class VehicleSyncService {

  // ====================================================
  // START
  // ====================================================

  static async start() {

    registerProviders()

  }

  // ====================================================
  // CACHE
  // ====================================================

  static updateCache(key, value) {

    if (

      value == null

    ) {

      return

    }

    if (

      Array.isArray(value) &&

      value.length === 0

    ) {

      return

    }

    VehicleCache.set(

      key,

      value

    )

  }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async syncVehicleTypes() {

    registerProviders()

    const data =

      await OnlineVehicleSource.getVehicleTypes()

    this.updateCache(

      'vehicleTypes',

      data

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static async syncBrands(vehicleType) {

    registerProviders()

    const data =

      await OnlineVehicleSource.getBrands(

        vehicleType

      )

    this.updateCache(

      `brands:${vehicleType || '__all__'}`,

      data

    )

  }

  // ====================================================
  // MODELS
  // ====================================================

  static async syncModels(params) {

    registerProviders()

    const data =

      await OnlineVehicleSource.getModels(

        params

      )

    this.updateCache(

      `models:${JSON.stringify(params)}`,

      data

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  static async syncYears(params) {

    registerProviders()

    const data =

      await OnlineVehicleSource.getYears(

        params

      )

    this.updateCache(

      `years:${JSON.stringify(params)}`,

      data

    )

  }

  // ====================================================
  // VEHICLE
  // ====================================================

  static async syncVehicle(params) {

    registerProviders()

    const data =

      await OnlineVehicleSource.findVehicle(

        params

      )

    this.updateCache(

      `vehicle:${JSON.stringify(params)}`,

      data

    )

  }

}