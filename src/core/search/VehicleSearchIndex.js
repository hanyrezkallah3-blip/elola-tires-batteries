// ======================================================
// EL OLA ERP
// Vehicle Search Index
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from './VehicleFuzzySearch'

class VehicleSearchIndex {

  constructor() {

    this.index = []

    this.loaded = false

  }

  // ====================================================
  // BUILD
  // ====================================================

  build() {

    if (this.loaded)

      return

    const vehicles =

      VehicleProvider.getAll() || []

    this.index = vehicles.map(vehicle => ({

      vehicle,

      make:

        VehicleFuzzySearch.normalize(

          vehicle.make

        ),

      model:

        VehicleFuzzySearch.normalize(

          vehicle.model

        ),

      full:

        VehicleFuzzySearch.normalize(

          `${vehicle.make} ${vehicle.model}`

        )

    }))

    this.loaded = true

  }

  // ====================================================
  // CLEAR
  // ====================================================

  clear() {

    this.loaded = false

    this.index = []

  }

  // ====================================================
  // SEARCH
  // ====================================================

  search(query) {

    this.build()

    query =

      VehicleFuzzySearch.normalize(

        query

      )

    if (!query)

      return []

    return this.index

      .map(item => ({

        vehicle:

          item.vehicle,

        score: Math.max(

          VehicleFuzzySearch.score(

            query,

            item.make

          ),

          VehicleFuzzySearch.score(

            query,

            item.model

          ),

          VehicleFuzzySearch.score(

            query,

            item.full

          )

        )

      }))

      .filter(item =>

        item.score >= 30

      )

      .sort(

        (a, b) =>

          b.score - a.score

      )

      .slice(0, 20)

      .map(item =>

        item.vehicle)

  }

}

export default new VehicleSearchIndex()