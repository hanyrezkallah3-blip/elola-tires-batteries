// ======================================================
// EL OLA ERP
// Vehicle Engine
// ======================================================

import { vehicleDatabase } from '../data/vehicleDatabase'

export class VehicleEngine {

  // ======================================================
  // FIND VEHICLE
  // ======================================================

  static findVehicle({

    make,

    model,

    year

  }) {

    return (

      vehicleDatabase.find(vehicle =>

        vehicle.make
          .toLowerCase() ===
        String(make)
          .toLowerCase()

        &&

        vehicle.model
          .toLowerCase() ===
        String(model)
          .toLowerCase()

        &&

        Number(year) >=
        Number(vehicle.yearFrom)

        &&

        Number(year) <=
        Number(vehicle.yearTo)

      ) ||

      null

    )

  }

  // ======================================================
  // MATCH TIRES
  // ======================================================

  static findMatchingTires({

    vehicle,

    products = []

  }) {

    if (!vehicle)
      return []

    return products.filter(product => {

      if (product.type !== 'tire')
        return false

      return vehicle.tires.some(size =>

        Number(product.width) === Number(size.width)

        &&

        Number(product.profile) === Number(size.profile)

        &&

        Number(product.rim) === Number(size.rim)

      )

    })

  }

  // ======================================================
  // MATCH BATTERIES
  // ======================================================

  static findMatchingBatteries({

    vehicle,

    products = []

  }) {

    if (!vehicle)
      return []

    return products.filter(product => {

      if (product.type !== 'battery')
        return false

      return vehicle.batteries.some(battery =>

        Number(product.capacity) === Number(battery.capacity)

      )

    })

  }

  // ======================================================
  // MATCH OILS
  // ======================================================

  static findMatchingOils({

    vehicle,

    products = []

  }) {

    if (!vehicle)
      return []

    return products.filter(product => {

      if (product.type !== 'oil')
        return false

      return vehicle.oils.some(oil =>

        String(product.viscosity || '')
          .toLowerCase()

        ===

        String(oil.viscosity || '')
          .toLowerCase()

      )

    })

  }

  // ======================================================
  // COMPLETE SEARCH
  // ======================================================

  static search({

    make,

    model,

    year,

    products = []

  }) {

    const vehicle =

      this.findVehicle({

        make,

        model,

        year

      })

    if (!vehicle) {

      return {

        vehicle: null,

        tires: [],

        batteries: [],

        oils: []

      }

    }

    return {

      vehicle,

      tires:

        this.findMatchingTires({

          vehicle,

          products

        }),

      batteries:

        this.findMatchingBatteries({

          vehicle,

          products

        }),

      oils:

        this.findMatchingOils({

          vehicle,

          products

        })

    }

  }

}

export default VehicleEngine