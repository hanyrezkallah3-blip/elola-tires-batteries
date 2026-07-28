// ======================================================
// EL OLA ERP
// Cached Vehicle Source
// ======================================================

import LocalVehicleSource
from './LocalVehicleSource'

export default class CachedVehicleSource {

  static cache = {

    vehicleTypes: null,

    brands: new Map(),

    models: new Map(),

    years: new Map(),

    vehicles: new Map(),

    allVehicles: null

  }

  // ====================================================
  // TYPES
  // ====================================================

  static getVehicleTypes() {

    if (!this.cache.vehicleTypes) {

      this.cache.vehicleTypes =

        LocalVehicleSource.getVehicleTypes()

    }

    return this.cache.vehicleTypes

  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType) {

    const key = vehicleType || '__all__'

    if (!this.cache.brands.has(key)) {

      this.cache.brands.set(

        key,

        LocalVehicleSource.getBrands(vehicleType)

      )

    }

    return this.cache.brands.get(key)

  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels(params) {

    const key = JSON.stringify(params)

    if (!this.cache.models.has(key)) {

      this.cache.models.set(

        key,

        LocalVehicleSource.getModels(params)

      )

    }

    return this.cache.models.get(key)

  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears(params) {

    const key = JSON.stringify(params)

    if (!this.cache.years.has(key)) {

      this.cache.years.set(

        key,

        LocalVehicleSource.getYears(params)

      )

    }

    return this.cache.years.get(key)

  }

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static findVehicle(params) {

    const key = JSON.stringify(params)

    if (!this.cache.vehicles.has(key)) {

      this.cache.vehicles.set(

        key,

        LocalVehicleSource.findVehicle(params)

      )

    }

    return this.cache.vehicles.get(key)

  }

  // ====================================================
  // DATABASE
  // ====================================================

  static getAll() {

    if (!this.cache.allVehicles) {

      this.cache.allVehicles =

        LocalVehicleSource.getAll()

    }

    return this.cache.allVehicles

  }

  // ====================================================
  // CLEAR
  // ====================================================

  static clear() {

    this.cache = {

      vehicleTypes: null,

      brands: new Map(),

      models: new Map(),

      years: new Map(),

      vehicles: new Map(),

      allVehicles: null

    }

  }

}