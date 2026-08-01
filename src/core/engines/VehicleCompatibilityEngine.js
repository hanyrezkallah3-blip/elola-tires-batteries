// ======================================================
// EL OLA ERP
// Vehicle Compatibility Engine
// ======================================================

export class VehicleCompatibilityEngine {

  // ======================================================
  // MATCH VEHICLE
  // ======================================================

  static matchVehicle({

    product,

    make,

    model,

    year,

    vehicleType

  }) {

    const vehicles =

      Array.isArray(product.compatibleVehicles)

        ? product.compatibleVehicles

        : []

    if (vehicles.length === 0) {

      return false

    }

    return vehicles.some(vehicle =>

      this.isCompatible({

        vehicle,

        make,

        model,

        year,

        vehicleType

      })

    )

  }

  // ======================================================
  // CHECK
  // ======================================================

  static isCompatible({

    vehicle,

    make,

    model,

    year,

    vehicleType

  }) {

    const vehicleTypeValue =

      vehicle.vehicleType ||

      vehicle.type ||

      ''

    if (

      vehicleType &&

      vehicleTypeValue &&

      vehicleTypeValue.toLowerCase() !==

      String(vehicleType).toLowerCase()

    ) {

      return false

    }

    const vehicleBrand =

      vehicle.brand ||

      vehicle.make ||

      ''

    if (

      make &&

      vehicleBrand &&

      vehicleBrand.toLowerCase() !==

      String(make).toLowerCase()

    ) {

      return false

    }

    const vehicleModel =

      vehicle.model ||

      ''

    if (

      model &&

      vehicleModel &&

      vehicleModel.toLowerCase() !==

      String(model).toLowerCase()

    ) {

      return false

    }

    return this.matchYear({

      vehicle,

      year

    })

  }

  // ======================================================
  // YEAR
  // ======================================================

  static matchYear({

    vehicle,

    year

  }) {

    if (!year) {

      return true

    }

    const from = Number(

      vehicle.yearFrom ||

      vehicle.from ||

      0

    )

    const to = Number(

      vehicle.yearTo ||

      vehicle.to ||

      vehicle.yearFrom ||

      new Date().getFullYear()

    )

    const value = Number(year)

    return (

      value >= from &&

      value <= to

    )

  }

  // ======================================================
  // FILTER
  // ======================================================

  static filterProducts({

    products = [],

    type,

    make,

    model,

    year,

    vehicleType

  }) {

    return products.filter(product => {

      if (product.type !== type) {

        return false

      }

      return this.matchVehicle({

        product,

        make,

        model,

        year,

        vehicleType

      })

    })

  }

}

export default VehicleCompatibilityEngine