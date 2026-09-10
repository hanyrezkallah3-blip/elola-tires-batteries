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

    // --------------------------------------------------
    // Prevent duplicate asynchronous builds
    // --------------------------------------------------

    this.buildPromise = null

  }


  // ====================================================
  // NORMALIZE VEHICLE COLLECTION
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
  // REMOVE YEAR FROM QUERY
  // ====================================================

  removeYear(
    query = ''
  ) {

    return VehicleFuzzySearch
      .normalize(
        query
      )
      .replace(
        /(19|20)\d{2}/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()

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
  //
  // IMPORTANT:
  // VehicleProvider.getAll() is asynchronous.
  //
  // The previous implementation treated the returned
  // Promise as a vehicle collection, causing the index
  // to become empty.
  //
  // ====================================================

  async build() {

    if (
      this.loaded
    ) {

      return this.index

    }


    if (
      this.buildPromise
    ) {

      return this.buildPromise

    }


    this.buildPromise =
      (async () => {

        let source = []


        try {

          source =
            await VehicleProvider.getAll()

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


        return this.index

      })()
        .finally(
          () => {

            this.buildPromise =
              null

          }
        )


    return this.buildPromise

  }


  // ====================================================
  // CLEAR
  // ====================================================

  clear() {

    this.loaded = false

    this.index = []

    this.buildPromise = null

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
  // SCORE ORIGINAL VEHICLE QUERY
  // ====================================================
  //
  // Gives priority to:
  //
  // Toyota Corolla
  //
  // over:
  //
  // Toyota
  //
  // when the user explicitly entered both make
  // and model.
  //
  // ====================================================

  scoreVehicleQuery(
    item,
    query
  ) {

    const normalized =
      VehicleFuzzySearch.normalize(
        query
      )


    if (
      !normalized
    ) {

      return 0

    }


    const makeScore =
      VehicleFuzzySearch.score(
        normalized,
        item.make
      )


    const modelScore =
      VehicleFuzzySearch.score(
        normalized,
        item.model
      )


    const fullScore =
      VehicleFuzzySearch.score(
        normalized,
        item.full
      )


    return Math.max(
      fullScore,
      Math.min(
        makeScore,
        modelScore
      ) + 20
    )

  }


  // ====================================================
  // SEARCH
  // ====================================================
  //
  // IMPORTANT:
  // This method is asynchronous because the vehicle
  // database is asynchronous.
  //
  // ====================================================

  async search(
    query
  ) {

    await this.build()


    const normalizedQuery =
      VehicleFuzzySearch.normalize(
        query
      )


    if (
      !normalizedQuery
    ) {

      return []

    }


    const requestedYear =
      this.extractYear(
        normalizedQuery
      )


    // --------------------------------------------------
    // Search make/model without year.
    //
    // Year is handled separately by yearMatches().
    // --------------------------------------------------

    const vehicleQuery =
      this.removeYear(
        normalizedQuery
      )


    const expanded =
      VehicleAliasDictionary.expand(
        vehicleQuery
      )


    if (
      !expanded.length
    ) {

      return []

    }


    const results = []


    // --------------------------------------------------
    // First pass:
    //
    // Always prioritize the actual make + model query.
    // This prevents "Toyota" alias scoring 100 and
    // pushing Corolla behind other Toyota models.
    // --------------------------------------------------

    this.index.forEach(
      item => {

        if (
          requestedYear &&
          !this.yearMatches(
            item.vehicle,
            requestedYear
          )
        ) {

          return

        }


        const itemScore =
          this.scoreVehicleQuery(
            item,
            vehicleQuery
          )


        if (
          itemScore < 30
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


    // --------------------------------------------------
    // Alias fallback:
    //
    // Used when the original query did not provide a
    // sufficiently strong match.
    // --------------------------------------------------

    expanded.forEach(
      value => {

        if (
          value === vehicleQuery
        ) {

          return

        }


        this.index.forEach(
          item => {

            if (
              requestedYear &&
              !this.yearMatches(
                item.vehicle,
                requestedYear
              )
            ) {

              return

            }


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


            results.push({

              vehicle:
                item.vehicle,

              score:
                Math.min(
                  itemScore,
                  89
                )

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