// ======================================================
// EL OLA ERP
// Vehicle AI Engine
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from '../search/VehicleFuzzySearch'

export default class VehicleAIEngine {

  // ======================================================
  // NORMALIZE
  // ======================================================

  static normalize(text = '') {

    return String(text)

      .toLowerCase()

      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim()

  }

  // ======================================================
  // YEAR
  // ======================================================

  static extractYear(text = '') {

    const match =

      String(text)

        .match(/(19|20)\d{2}/)

    return match

      ? Number(match[0])

      : null

  }

  // ======================================================
  // DATABASE
  // ======================================================

  static getDatabase() {

    return VehicleProvider.getAll() || []

  }

  // ======================================================
  // PARSE
  // ======================================================

  static parse(text = '') {

    const query =

      this.normalize(text)

    const year =

      this.extractYear(query)

    const vehicle =

      VehicleFuzzySearch

        .search(

          query,

          this.getDatabase()

        )[0]

    if (!vehicle)

      return null

    return {

      vehicle,

      make: vehicle.make,

      model: vehicle.model,

      vehicleType:

        vehicle.vehicleType ??

        vehicle.type,

      year:

        year ||

        vehicle.yearFrom

    }

  }

  // ======================================================
  // SUGGESTIONS
  // ======================================================

  static suggestions(text = '') {

    return VehicleFuzzySearch.search(

      text,

      this.getDatabase()

    )

  }

  // ======================================================
  // SEARCH
  // ======================================================

  static search(text = '') {

    return {

      query: text,

      vehicle:

        this.parse(text),

      suggestions:

        this.suggestions(text)

    }

  }

}