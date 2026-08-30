// ======================================================
// EL OLA ERP
// OEM Compatibility Engine
// ======================================================
//
// Vehicle compatibility is determined from the vehicle's
// OEM technical specifications.
//
// SOURCE:
// VehicleSpecificationProvider
//
// NOT USED:
// - product.compatibleVehicles
// - warehouse compatibility
// - manual product-to-vehicle links
// ======================================================

import VehicleSpecificationProvider
  from '../vehicles/providers/VehicleSpecificationProvider'


export default class OEMCompatibilityEngine {

  // ====================================================
  // VEHICLE
  // ====================================================

  static async search({

    make,

    model,

    year

  }) {

    const specs =

      await VehicleSpecificationProvider.getSpecifications({

        make,

        model,

        year

      })


    if (!specs) {

      return null

    }


    return {

      vehicle: specs,

      tire:
        this.getTireSpecification(
          specs
        ),

      battery:
        this.getBatterySpecification(
          specs
        ),

      oil:
        this.getOilSpecification(
          specs
        )

    }

  }


  // ====================================================
  // TIRE
  // ====================================================

  static getTireSpecification(
    specs
  ) {

    return (

      specs?.tire ??

      specs?.tireSize ??

      specs?.oemTire ??

      null

    )

  }


  // ====================================================
  // BATTERY
  // ====================================================

  static getBatterySpecification(
    specs
  ) {

    return (

      specs?.battery ??

      specs?.batterySpec ??

      specs?.oemBattery ??

      null

    )

  }


  // ====================================================
  // OIL
  // ====================================================

  static getOilSpecification(
    specs
  ) {

    return (

      specs?.oil ??

      specs?.oilViscosity ??

      specs?.oemOil ??

      null

    )

  }

}