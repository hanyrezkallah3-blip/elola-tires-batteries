// ======================================================
// EL OLA ERP
// Compatibility Engine
// ======================================================

import vehicleDatabase
from '../database/vehicleDatabase'

export default class CompatibilityEngine {

  // ====================================================
  // VEHICLE → PRODUCTS
  // ====================================================

  static byVehicle({

    make,

    model,

    year

  }) {

    return vehicleDatabase.find(vehicle =>

      vehicle.make === make &&

      vehicle.model === model &&

      Number(year) >= Number(vehicle.yearFrom) &&

      Number(year) <= Number(vehicle.yearTo)

    ) || null

  }

  // ====================================================
  // TIRE SIZE → VEHICLES
  // ====================================================

  static byTireSize({

    width,

    profile,

    rim

  }) {

    return vehicleDatabase.filter(vehicle =>

      vehicle.tires.some(tire =>

        Number(tire.width) === Number(width)

        &&

        Number(tire.profile) === Number(profile)

        &&

        Number(tire.rim) === Number(rim)

      )

    )

  }

  // ====================================================
  // BATTERY
  // ====================================================

  static byBattery({

    capacity

  }) {

    return vehicleDatabase.filter(vehicle =>

      vehicle.batteries.some(battery =>

        Number(battery.capacity) ===

        Number(capacity)

      )

    )

  }

  // ====================================================
  // OIL
  // ====================================================

  static byOil({

    viscosity

  }) {

    return vehicleDatabase.filter(vehicle =>

      vehicle.oils.some(oil =>

        oil.viscosity === viscosity

      )

    )

  }

  // ====================================================
  // GENERIC SEARCH
  // ====================================================

  static search({

    type,

    value

  }) {

    switch(type){

      case 'tire':

        return this.byTireSize(value)

      case 'battery':

        return this.byBattery(value)

      case 'oil':

        return this.byOil(value)

      default:

        return []

    }

  }

}