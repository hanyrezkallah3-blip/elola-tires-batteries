// ======================================================
// EL OLA ERP
// Vehicle Sync Service
// Unified Online Vehicle Synchronization
//
// IMPORTANT:
// - No manually maintained manufacturer files.
// - OnlineVehicleSource is the only provider gateway.
// - VehicleCache is the only vehicle cache adapter.
// - Provider registration happens once.
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
// PROVIDER REGISTRATION
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


// ======================================================
// CACHE KEY
// ======================================================

const getParamsKey = (

  prefix,

  params = {}

) =>

  `${prefix}:${JSON.stringify(params)}`


// ======================================================
// UPDATE CACHE
// ======================================================

const updateCache = (

  key,

  value

) => {

  if (

    value === null ||

    value === undefined

  ) {

    return false

  }


  if (

    Array.isArray(value) &&

    value.length === 0

  ) {

    return false

  }


  VehicleCache.set(

    key,

    value

  )


  return true

}


// ======================================================
// VEHICLE SYNC SERVICE
// ======================================================

export default class VehicleSyncService {


  // ====================================================
  // START
  // ====================================================

  static async start() {

    registerProviders()

    return true

  }


  // ====================================================
  // PROVIDERS
  // ====================================================

  static registerProviders() {

    registerProviders()

    return (

      OnlineVehicleSource.providers || []

    )

  }


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async syncVehicleTypes() {

    registerProviders()


    try {

      const data =

        await OnlineVehicleSource

          .getVehicleTypes()


      return updateCache(

        'vehicleTypes',

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncVehicleTypes',

        error

      )

      return false

    }

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static async syncBrands(

    vehicleType = ''

  ) {

    registerProviders()


    try {

      const data =

        await OnlineVehicleSource

          .getBrands(

            vehicleType

          )


      return updateCache(

        `brands:${vehicleType || '__all__'}`,

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncBrands',

        error

      )

      return false

    }

  }


  // ====================================================
  // MODELS
  // ====================================================

  static async syncModels(

    params = {}

  ) {

    registerProviders()


    try {

      const data =

        await OnlineVehicleSource

          .getModels(

            params

          )


      return updateCache(

        getParamsKey(

          'models',

          params

        ),

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncModels',

        error

      )

      return false

    }

  }


  // ====================================================
  // YEARS
  // ====================================================

  static async syncYears(

    params = {}

  ) {

    registerProviders()


    try {

      const data =

        await OnlineVehicleSource

          .getYears(

            params

          )


      return updateCache(

        getParamsKey(

          'years',

          params

        ),

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncYears',

        error

      )

      return false

    }

  }


  // ====================================================
  // VEHICLE
  // ====================================================

  static async syncVehicle(

    params = {}

  ) {

    registerProviders()


    try {

      const data =

        await OnlineVehicleSource

          .findVehicle(

            params

          )


      return updateCache(

        getParamsKey(

          'vehicle',

          params

        ),

        data

      )

    }

    catch (error) {

      console.error(

        '[VehicleSyncService] syncVehicle',

        error

      )

      return false

    }

  }


  // ====================================================
  // SYNC EVERYTHING
  // ====================================================

  static async syncAll() {

    registerProviders()


    return {

      vehicleTypes:

        await this.syncVehicleTypes()

    }

  }


  // ====================================================
  // CLEAR CACHE
  // ====================================================

  static clearCache() {

    VehicleCache.clear()

    return true

  }

}