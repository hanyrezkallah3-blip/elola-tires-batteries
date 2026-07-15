// ======================================================
// EL OLA ERP
// Vehicle AI Engine
// ======================================================

import { vehicleDatabase } from '../data/vehicleDatabase'

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
  // EXTRACT YEAR
  // ======================================================

  static extractYear(text = '') {

    const match =

      String(text)

        .match(/(19|20)\d{2}/)

    if (!match)

      return null

    return Number(match[0])

  }

  // ======================================================
  // FIND VEHICLE
  // ======================================================

  static parse(text = '') {

    const query =

      this.normalize(text)

    const year =

      this.extractYear(query)

    for (

      const vehicle of vehicleDatabase

    ) {

      const make =

        this.normalize(vehicle.make)

      const model =

        this.normalize(vehicle.model)

      if (

        query.includes(make)

        &&

        query.includes(model)

      ) {

        return {

          make: vehicle.make,

          model: vehicle.model,

          year:

            year ||

            vehicle.yearFrom

        }

      }

    }

    return null

  }

  // ======================================================
  // SUGGESTIONS
  // ======================================================

  static suggestions(text = '') {

    const query =

      this.normalize(text)

    if (!query)

      return []

    return vehicleDatabase

      .filter(vehicle => {

        return (

          this.normalize(vehicle.make)

            .includes(query)

          ||

          this.normalize(vehicle.model)

            .includes(query)

        )

      })

      .slice(0, 10)

  }

}