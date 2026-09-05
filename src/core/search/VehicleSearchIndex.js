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
  // NORMALIZE VEHICLE COLLECTION
  // ====================================================
  //
  // VehicleProvider.getAll() may return:
  //
  // 1. Array
  // 2. Object containing vehicles
  // 3. Object keyed by vehicle id
  //
  // The search index must always work with an Array.
  //
  // ====================================================

  normalizeVehicles(
    source
  ) {

    if (
      Array.isArray(source)
    ) {

      return source

    }


    if (
      !source ||
      typeof source !== 'object'
    ) {

      return []

    }


    // --------------------------------------------------
    // Common collection properties
    // --------------------------------------------------

    const candidates = [

      source.vehicles,

      source.data,

      source.items,

      source.results,

      source.records,

      source.list

    ]


    for (
      const candidate of candidates
    ) {

      if (
        Array.isArray(candidate)
      ) {

        return candidate

      }

    }


    // --------------------------------------------------
    // Object keyed by vehicle id
    // --------------------------------------------------

    const values =
      Object.values(
        source
      )


    if (
      values.length > 0 &&
      values.every(
        value =>
          value &&
          typeof value === 'object'
      )
    ) {

      return values

    }


    return []

  }


  // ====================================================
  // GET VEHICLE FIELD
  // ====================================================

  getVehicleField(
    vehicle,
    fields = []
  ) {

    if (
      !vehicle ||
      typeof vehicle !== 'object'
    ) {

      return ''

    }


    for (
      const field of fields
    ) {

      const value =
        vehicle?.[field]


      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ''
      ) {

        return value

      }

    }


    return ''

  }


  // ====================================================
  // GET MAKE
  // ====================================================

  getMake(
    vehicle
  ) {

    return this.getVehicleField(
      vehicle,
      [
        'make',
        'brand',
        'manufacturer',
        'vehicleBrand',
        'vehicleMake',
        'makeName',
        'brandName',
        'manufacturerName'
      ]
    )

  }


  // ====================================================
  // GET MODEL
  // ====================================================

  getModel(
    vehicle
  ) {

    return this.getVehicleField(
      vehicle,
      [
        'model',
        'modelName',
        'vehicleModel',
        'model_name',
        'vehicleModelName'
      ]
    )

  }


  // ====================================================
  // GET YEAR
  // ====================================================

  getYear(
    vehicle
  ) {

    return this.getVehicleField(
      vehicle,
      [
        'year',
        'modelYear',
        'productionYear'
      ]
    )

  }


  // ====================================================
  // GET YEAR FROM
  // ====================================================

  getYearFrom(
    vehicle
  ) {

    return this.getVehicleField(
      vehicle,
      [
        'yearFrom',
        'from',
        'startYear',
        'productionFrom'
      ]
    )

  }


  // ====================================================
  // GET YEAR TO
  // ====================================================

  getYearTo(
    vehicle
  ) {

    return this.getVehicleField(
      vehicle,
      [
        'yearTo',
        'to',
        'endYear',
        'productionTo'
      ]
    )

  }


  // ====================================================
  // EXTRACT YEAR FROM QUERY
  // ====================================================

  extractYear(
    query = ''
  ) {

    const match =
      String(
        query
      )
        .match(
          /(19|20)\d{2}/
        )


    return match
      ? Number(
          match[0]
        )
      : null

  }


  // ====================================================
  // YEAR MATCH
  // ====================================================

  yearMatches(
    vehicle,
    requestedYear
  ) {

    const year =
      Number(
        requestedYear
      )


    if (
      !Number.isFinite(year)
    ) {

      return true

    }


    const singleYear =
      Number(
        this.getYear(
          vehicle
        )
      )


    if (
      Number.isFinite(singleYear)
    ) {

      return (
        year ===
        singleYear
      )

    }


    const from =
      Number(
        this.getYearFrom(
          vehicle
        )
      )


    const to =
      Number(
        this.getYearTo(
          vehicle
        )
      )


    if (
      Number.isFinite(from) &&
      Number.isFinite(to)
    ) {

      return (
        year >= from &&
        year <= to
      )

    }


    if (
      Number.isFinite(from)
    ) {

      return (
        year >= from
      )

    }


    if (
      Number.isFinite(to)
    ) {

      return (
        year <= to
      )

    }


    // If the vehicle has no year information,
    // do not reject it at the index level.
    return true

  }


  // ====================================================
  // BUILD
  // ====================================================

  build() {

    if (
      this.loaded
    ) {

      return

    }


    let source


    try {

      source =
        VehicleProvider.getAll()

    }
    catch (error) {

      console.warn(
        '[VehicleSearchIndex] VehicleProvider.getAll failed:',
        error
      )

      source = []

    }


    const vehicles =
      this.normalizeVehicles(
        source
      )


    console.log(
      '[VehicleSearchIndex] BUILD',
      {
        sourceType:
          Array.isArray(source)
            ? 'array'
            : typeof source,

        vehiclesCount:
          vehicles.length
      }
    )


    this.index =
      vehicles
        .filter(
          vehicle =>
            vehicle &&
            typeof vehicle === 'object'
        )
        .map(
          vehicle => {

            const make =
              VehicleFuzzySearch.normalize(
                this.getMake(
                  vehicle
                )
              )


            const model =
              VehicleFuzzySearch.normalize(
                this.getModel(
                  vehicle
                )
              )


            const year =
              this.getYear(
                vehicle
              )


            const yearFrom =
              this.getYearFrom(
                vehicle
              )


            const yearTo =
              this.getYearTo(
                vehicle
              )


            return {

              vehicle,

              make,

              model,

              year,

              yearFrom,

              yearTo,

              full:
                `${make} ${model}`.trim(),

              aliases:
                VehicleAliasDictionary.expand(
                  make
                )

            }

          }
        )


    this.loaded =
      true


    console.log(
      '[VehicleSearchIndex] READY',
      {
        indexCount:
          this.index.length
      }
    )

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

  score(
    item,
    query
  ) {

    let score =
      Math.max(

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


    if (
      Array.isArray(
        item.aliases
      )
    ) {

      item.aliases.forEach(
        alias => {

          score =
            Math.max(

              score,

              VehicleFuzzySearch.score(
                query,
                alias
              )

            )

        }
      )

    }


    return score

  }


  // ====================================================
  // SEARCH
  // ====================================================

  search(
    query
  ) {

    this.build()


    const normalizedQuery =
      VehicleFuzzySearch.normalize(
        query
      )


    if (
      !normalizedQuery
    ) {

      return []

    }


    const expanded =
      VehicleAliasDictionary.expand(
        normalizedQuery
      )


    if (
      !expanded.length
    ) {

      return []

    }


    const requestedYear =
      this.extractYear(
        normalizedQuery
      )


    const results = []


    expanded.forEach(
      value => {

        this.index.forEach(
          item => {

            const itemScore =
              this.score(
                item,
                value
              )


            if (
              itemScore < 30
            ) {

              return

            }


            if (
              requestedYear &&
              !this.yearMatches(
                item.vehicle,
                requestedYear
              )
            ) {

              return

            }


            results.push({

              vehicle:
                item.vehicle,

              score:
                itemScore

            })

          }
        )

      }
    )


    // --------------------------------------------------
    // Remove duplicate vehicles
    // --------------------------------------------------

    const unique =
      new Map()


    results.forEach(
      item => {

        const vehicle =
          item.vehicle


        const id =
          vehicle?.id ??
          vehicle?._id ??
          vehicle?.vehicleId ??
          vehicle?.code ??
          `${this.getMake(vehicle)}-${this.getModel(vehicle)}-${this.getYear(vehicle)}`


        const existing =
          unique.get(
            id
          )


        if (
          !existing ||
          item.score >
          existing.score
        ) {

          unique.set(
            id,
            item
          )

        }

      }
    )


    return Array.from(
      unique.values()
    )
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(
        0,
        20
      )
      .map(
        item =>
          item.vehicle
      )

  }

}


export default new VehicleSearchIndex()