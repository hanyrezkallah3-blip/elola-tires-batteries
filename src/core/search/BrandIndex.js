// ======================================================
// EL OLA ERP
// Brand Index
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from './VehicleFuzzySearch'

class BrandIndex {

  constructor() {

    this.loaded = false

    this.brands = []

  }

  // ====================================================
  // BUILD
  // ====================================================

  build() {

    if (this.loaded)

      return

    const map = new Map()

    const vehicles =

      VehicleProvider.getAll() || []

    vehicles.forEach(vehicle => {

      const name =

        String(

          vehicle.make

        ).trim()

      if (!name)

        return

      const key =

        VehicleFuzzySearch.normalize(

          name

        )

      if (!map.has(key)) {

        map.set(key, {

          id: key,

          name

        })

      }

    })

    this.brands = [

      ...map.values()

    ].sort((a, b) =>

      a.name.localeCompare(

        b.name

      )

    )

    this.loaded = true

  }

  // ====================================================
  // ALL
  // ====================================================

  getAll() {

    this.build()

    return this.brands

  }

  // ====================================================
  // SEARCH
  // ====================================================

  search(query = '') {

    this.build()

    query =

      VehicleFuzzySearch.normalize(

        query

      )

    if (!query)

      return this.brands

    return this.brands

      .map(item => ({

        item,

        score:

          VehicleFuzzySearch.score(

            query,

            item.name

          )

      }))

      .filter(item =>

        item.score >= 30

      )

      .sort((a, b) =>

        b.score - a.score

      )

      .map(item =>

        item.item

      )

  }

  // ====================================================
  // CLEAR
  // ====================================================

  clear() {

    this.loaded = false

    this.brands = []

  }

}

export default new BrandIndex()