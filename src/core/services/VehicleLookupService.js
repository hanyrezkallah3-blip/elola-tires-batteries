// ======================================================
// EL OLA ERP
// Vehicle Lookup Service
// ======================================================

import vehicleCategories from '../database/vehicleCategories'
import vehicleBrands from '../database/vehicleBrands'
import vehicleModels from '../database/vehicleModels'
import vehicleDatabase from '../database/vehicleDatabase'

class VehicleLookupService {

  // ================= CATEGORIES =================

  static getCategories() {

    return vehicleCategories

  }

  // ================= BRANDS =================

  static getBrands(categoryId = null) {

    if (!categoryId) {

      return vehicleBrands

    }

    return vehicleBrands.filter(

      brand =>

        !brand.category ||

        brand.category === categoryId

    )

  }

  // ================= MODELS =================

  static getModels(manufacturer) {

    return vehicleModels.filter(

      model =>

        model.manufacturer === manufacturer

    )

  }

  // ================= YEARS =================

  static getYears({

    manufacturer,

    model

  }) {

    const vehicle = vehicleDatabase.filter(

      item =>

        item.make === manufacturer &&

        item.model === model

    )

    const years = new Set()

    vehicle.forEach(item => {

      for (

        let year = item.yearFrom;

        year <= item.yearTo;

        year++

      ) {

        years.add(year)

      }

    })

    return [...years].sort()

  }

}

export default VehicleLookupService