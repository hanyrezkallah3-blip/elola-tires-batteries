// ======================================================
// EL OLA ERP
// Vehicle Search Index
// ======================================================

import VehicleProvider
from '../vehicles/VehicleProvider'

import VehicleFuzzySearch
from './VehicleFuzzySearch'

import VehicleAliasDictionary
from './VehicleAliasDictionary'


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


    this.index = vehicles.map(vehicle => {

      const make =

        VehicleFuzzySearch.normalize(

          vehicle.make

        )


      const model =

        VehicleFuzzySearch.normalize(

          vehicle.model

        )


      return {

        vehicle,

        make,

        model,

        full:

          `${make} ${model}`,

        aliases:

          VehicleAliasDictionary.expand(

            make

          )

      }

    })


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
  // SCORE ITEM
  // ====================================================

  score(item, query) {


    let score = Math.max(

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


    item.aliases.forEach(alias => {

      score = Math.max(

        score,

        VehicleFuzzySearch.score(

          query,

          alias

        )

      )

    })


    return score

  }


  // ====================================================
  // SEARCH
  // ====================================================

  search(query) {

    this.build()


    const expanded =

      VehicleAliasDictionary.expand(

        query

      )


    if (!expanded.length)

      return []


    const results = []


    expanded.forEach(value => {


      this.index.forEach(item => {


        results.push({

          vehicle:

            item.vehicle,

          score:

            this.score(

              item,

              value

            )

        })


      })


    })


    return results

      .filter(item =>

        item.score >= 30

      )

      .sort((a, b) =>

        b.score - a.score

      )

      .slice(0, 20)

      .map(item =>

        item.vehicle

      )

  }

}


export default new VehicleSearchIndex()