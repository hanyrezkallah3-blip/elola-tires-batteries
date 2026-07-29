// ======================================================
// EL OLA ERP
// Model Index
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from './VehicleFuzzySearch'

class ModelIndex {

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

      const brand =

        VehicleFuzzySearch.normalize(

          vehicle.make

        )

      if (!this.index.has(brand))

        this.index.set(

          brand,

          new Map()

        )

      const models =

        this.index.get(brand)

      const key =

        VehicleFuzzySearch.normalize(

          vehicle.model

        )

      if (!models.has(key)) {

        models.set(key, {

          id: key,

          name: vehicle.model

        })

      }

    })

    this.loaded = true

  }

  // ====================================================
  // GET MODELS
  // ====================================================

  getModels(make = '') {

    this.build()

    const key =

      VehicleFuzzySearch.normalize(

        make

      )

    const models =

      this.index.get(key)

    if (!models)

      return []

    return [

      ...models.values()

    ].sort((a, b) =>

      a.name.localeCompare(

        b.name

      )

    )

  }

  // ====================================================
  // SEARCH
  // ====================================================

  search(make, query = '') {

    const models =

      this.getModels(make)

    if (!query)

      return models

    query =

      VehicleFuzzySearch.normalize(

        query

      )

    return models

      .map(model => ({

        model,

        score:

          VehicleFuzzySearch.score(

            query,

            model.name

          )

      }))

      .filter(item =>

        item.score >= 30

      )

      .sort((a, b) =>

        b.score - a.score

      )

      .map(item =>

        item.model

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

export default new ModelIndex()