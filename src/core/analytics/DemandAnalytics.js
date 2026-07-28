import VehicleDemandEngine from '../engines/VehicleDemandEngine'

export class DemandAnalytics {

  static summary() {

    const history =

      VehicleDemandEngine.history()

    const total = history.length

    const found = history.filter(

      item => item.found

    ).length

    const missing =

      total - found

    const successRate =

      total === 0

        ? 0

        : Number(

            (

              found * 100 /

              total

            ).toFixed(2)

          )

    return {

      totalSearches: total,

      foundSearches: found,

      missingSearches: missing,

      successRate,

      failureRate:

        Number(

          (

            100 -

            successRate

          ).toFixed(2)

        )

    }

  }

  static topBrands() {

    return VehicleDemandEngine

      .topBrands()

  }

  static topModels() {

    return VehicleDemandEngine

      .topModels()

  }

  static topYears() {

    return VehicleDemandEngine

      .topYears()

  }

  static dashboard() {

    return {

      summary:

        this.summary(),

      brands:

        this.topBrands(),

      models:

        this.topModels(),

      years:

        this.topYears()

    }

  }

}

export default DemandAnalytics