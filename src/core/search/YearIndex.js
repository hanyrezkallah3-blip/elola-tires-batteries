// ======================================================
// EL OLA ERP
// Year Index
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from './VehicleFuzzySearch'

class YearIndex {

  constructor() {

    this.loaded = false

    this.index = new Map()

  }

  // ====================================================
  // BUILD
  // ====================================================

  build() {

    if (this.loaded)

      return

    const vehicles =

      VehicleProvider.getAll() || []

    vehicles.forEach(vehicle => {

      const make =

        VehicleFuzzySearch.normalize(

          vehicle.make

        )

      const model =

        VehicleFuzzySearch.normalize(

          vehicle.model

        )

      const key =

        `${make}|${model}`

      if (!this.index.has(key))

        this.index.set(

          key,

          new Set()

        )

      const years =

        this.index.get(key)

      const from =

        Number(vehicle.yearFrom)

      const to =

        Number(

          vehicle.yearTo ||

          vehicle.yearFrom

        )

      for (

        let year = from;

        year <= to;

        year++

      ) {

        years.add(year)

      }

    })

    this.loaded = true

  }

  // ====================================================
  // GET YEARS
  // ====================================================

  getYears(make = '', model = '') {

    this.build()

    const key =

      `${

        VehicleFuzzySearch.normalize(make)

      }|${

        VehicleFuzzySearch.normalize(model)

      }`

    const years =

      this.index.get(key)

    if (!years)

      return []

    return [

      ...years

    ].sort(

      (a, b) => b - a

    )

  }

  // ====================================================
  // CLEAR
  // ====================================================

  clear() {

    this.loaded = false

    this.index.clear()

  }

}

export default new YearIndex()