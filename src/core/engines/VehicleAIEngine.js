// ======================================================
// EL OLA ERP
// Vehicle AI Engine
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleSearchIndex
from '../search/VehicleSearchIndex'

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
  // FIND BEST MATCH
  // ======================================================

  static findBest(query) {

    const results =

      VehicleSearchIndex.search(

        query

      )

    return results[0] || null

  }

  // ======================================================
  // PARSE
  // ======================================================

  static parse(text = '') {

    const query =

      this.normalize(text)

    if (!query)

      return null

    const year =

      this.extractYear(query)

    const vehicle =

      this.findBest(query)

    if (!vehicle)

      return null

    return {

      vehicle,

      vehicleType:

        vehicle.vehicleType ??

        vehicle.type,

      make:

        vehicle.make,

      model:

        vehicle.model,

      year:

        year ??

        vehicle.yearFrom

    }

  }

  // ======================================================
  // SUGGESTIONS
  // ======================================================

  static suggestions(text = '') {

    if (!text.trim())

      return []

    return VehicleSearchIndex.search(

      text

    )

  }

  // ======================================================
  // SEARCH
  // ======================================================

  static search(text = '') {

    const vehicle =

      this.parse(text)

    return {

      query: text,

      vehicle,

      suggestions:

        this.suggestions(text)

    }

  }

}