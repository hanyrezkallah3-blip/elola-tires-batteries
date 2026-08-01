import vehicleTypes
from './vehicleTypes'

import Toyota
from './brands/Toyota'

import Hyundai
from './brands/Hyundai'

const brands = [

  Toyota,

  Hyundai

]

export default class VehicleRepository {

  // ==========================================
  // VEHICLE TYPES
  // ==========================================

  static getVehicleTypes() {

    return vehicleTypes

  }

  // ==========================================
  // BRANDS
  // ==========================================

  static getBrands(

    vehicleType = ''

  ) {

    if (!vehicleType)

      return brands

    return brands.filter(

      brand =>

        brand.vehicles.some(

          vehicle =>

            vehicle.type === vehicleType

        )

    )

  }
    // ==========================================
  // MODELS
  // ==========================================

  static getModels(

    brandId

  ) {

    const brand =

      brands.find(

        item =>

          item.id === brandId

      )

    if (!brand)

      return []

    return brand.vehicles

  }

  // ==========================================
  // YEARS
  // ==========================================

  static getYears(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )

    return vehicle

      ? vehicle.years

      : []

  }

  // ==========================================
  // FIND VEHICLE
  // ==========================================

  static findVehicle(

    brandId,

    vehicleId

  ) {

    const brand =

      brands.find(

        item =>

          item.id === brandId

      )

    if (!brand)

      return null

    return (

      brand.vehicles.find(

        vehicle =>

          vehicle.id === vehicleId

      )

      ||

      null

    )

  }
    // ==========================================
  // TIRE SIZES
  // ==========================================

  static getOEMSizes(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )

    return vehicle

      ? vehicle.tire.oemSizes

      : []

  }

  static getAlternativeSizes(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )

    return vehicle

      ? vehicle.tire.optionalSizes

      : []

  }

  // ==========================================
  // BATTERY
  // ==========================================

  static getBattery(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )

    return vehicle

      ? vehicle.battery

      : null

  }

  // ==========================================
  // OIL
  // ==========================================

  static getOil(

    brandId,

    vehicleId

  ) {

    const vehicle =

      this.findVehicle(

        brandId,

        vehicleId

      )

    return vehicle

      ? vehicle.oil

      : null

  }

  // ==========================================
  // SEARCH BY TIRE SIZE
  // ==========================================

  static findByTireSize(

    tireSize

  ) {

    return brands.flatMap(

      brand =>

        brand.vehicles.filter(

          vehicle =>

            vehicle.tire.oemSizes.includes(

              tireSize

            )

        )

        .map(

          vehicle => ({

            brand:

              brand.name,

            ...vehicle

          })

        )

    )

  }

  // ==========================================
  // DATABASE
  // ==========================================

  static getAllVehicles() {

    return brands.flatMap(

      brand =>

        brand.vehicles.map(

          vehicle => ({

            brand:

              brand.name,

            ...vehicle

          })

        )

    )

  }

}