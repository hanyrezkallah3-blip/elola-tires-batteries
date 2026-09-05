// ======================================================
// EL OLA ERP
// Vehicle Provider
// Unified Vehicle Access Layer
//
// ARCHITECTURE:
//
// UI
//  ↓
// VehicleProvider
//  ↓
// CachedVehicleSource
//  ↓
// VehicleCache
//  ↓
// OnlineVehicleSource
//  ↓
// NHTSA / CarQuery
//
// IMPORTANT:
// - All online source methods are asynchronous.
// - VehicleProvider MUST await CachedVehicleSource.
// - No manually maintained manufacturer files.
// - Elola-specific compatibility data is separate.
// ======================================================

import CachedVehicleSource
  from './CachedVehicleSource'

import VehicleMapper
  from './VehicleMapper'


export default class VehicleProvider {


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static async getVehicleTypes() {

    const data =
      await CachedVehicleSource.getVehicleTypes()


    return VehicleMapper.mapVehicleTypes(

      Array.isArray(data)
        ? data
        : []

    )

  }


  // ====================================================
  // BRANDS
  // ====================================================

  static async getBrands(

    vehicleType = ''

  ) {

    const data =
      await CachedVehicleSource.getBrands(

        vehicleType

      )


    return VehicleMapper.mapBrands(

      Array.isArray(data)
        ? data
        : []

    )

  }


  // ====================================================
  // MODELS
  // ====================================================

  static async getModels(

    params = {}

  ) {

    const data =
      await CachedVehicleSource.getModels(

        params

      )


    return VehicleMapper.mapModels(

      Array.isArray(data)
        ? data
        : []

    )

  }


  // ====================================================
  // YEARS
  // ====================================================

  static async getYears(

    params = {}

  ) {

    const data =
      await CachedVehicleSource.getYears(

        params

      )


    return VehicleMapper.mapYears(

      Array.isArray(data)
        ? data
        : []

    )

  }


  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle(

    params = {}

  ) {

    const vehicle =

      await CachedVehicleSource.findVehicle(

        params

      )


    if (!vehicle)

      return null


    return VehicleMapper.fromLocal(

      vehicle

    )

  }


  // ====================================================
  // DATABASE
  // ====================================================

  static async getAll() {

    const data =

      await CachedVehicleSource.getAll()


    return VehicleMapper.mapArray(

      Array.isArray(data)
        ? data
        : [],

      VehicleMapper.fromLocal

    )

  }


  // ====================================================
  // LOCAL DATABASE
  // ====================================================

  static async getLocalDatabase() {

    const data =

      await CachedVehicleSource.getAll()


    return VehicleMapper.mapArray(

      Array.isArray(data)
        ? data
        : [],

      VehicleMapper.fromLocal

    )

  }


  // ====================================================
  // OEM TIRE SIZES
  // ====================================================

  static getOEMSizes(

    brand,

    model

  ) {

    return []

  }


  // ====================================================
  // ALTERNATIVE TIRE SIZES
  // ====================================================

  static getAlternativeSizes(

    brand,

    model

  ) {

    return []

  }


  // ====================================================
  // BATTERY
  // ====================================================

  static getBattery(

    brand,

    model

  ) {

    return null

  }


  // ====================================================
  // OIL
  // ====================================================

  static getOil(

    brand,

    model

  ) {

    return null

  }


  // ====================================================
  // SEARCH BY TIRE SIZE
  // ====================================================

  static findByTireSize(

    tireSize

  ) {

    if (!tireSize)

      return []


    return []

  }


  // ====================================================
  // CLEAR CACHE
  // ====================================================

  static clearCache() {

    if (

      typeof CachedVehicleSource.clear ===
      'function'

    ) {

      return CachedVehicleSource.clear()

    }

    return undefined

  }

}