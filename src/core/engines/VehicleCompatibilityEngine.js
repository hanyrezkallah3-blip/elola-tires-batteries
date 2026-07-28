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

      product.compatibleVehicles || []

    if (vehicles.length === 0)
      return false

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

    if (

      vehicleType &&

      vehicle.vehicleType &&

      String(vehicle.vehicleType)
        .toLowerCase()

      !==

      String(vehicleType)
        .toLowerCase()

    ) {

      return false

    }

    if (

      make &&

      String(vehicle.brand)
        .toLowerCase()

      !==

      String(make)
        .toLowerCase()

    ) {

      return false

    }

    if (

      model &&

      String(vehicle.model)
        .toLowerCase()

      !==

      String(model)
        .toLowerCase()

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

    if (!year)
      return true

    const from =

      Number(vehicle.yearFrom || 0)

    const to =

      Number(

        vehicle.yearTo ||

        vehicle.yearFrom ||

        9999

      )

    const value =

      Number(year)

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

    return products.filter(product =>

      product.type === type &&

      this.matchVehicle({

        product,

        make,

        model,

        year,

        vehicleType

      })

    )

  }

}

export default VehicleCompatibilityEngine