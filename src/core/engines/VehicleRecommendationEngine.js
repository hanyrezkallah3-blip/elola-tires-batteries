import VehicleDemandEngine from './VehicleDemandEngine'

export class VehicleRecommendationEngine {

  static build() {

    const searches =

      VehicleDemandEngine.history()

    const recommendations = new Map()

    searches.forEach(search => {

      if (search.found)
        return

      const key = [

        search.make,

        search.model,

        search.year

      ].join('|')

      if (!recommendations.has(key)) {

        recommendations.set(key, {

          make: search.make,

          model: search.model,

          year: search.year,

          requests: 0,

          tireSize: search.tireSize,

          batteryCapacity:
            search.batteryCapacity,

          oilViscosity:
            search.oilViscosity

        })

      }

      recommendations.get(key)

        .requests++

    })

    return [...recommendations.values()]

      .sort(

        (a, b) =>

          b.requests - a.requests

      )

  }

  static top(limit = 10) {

    return this

      .build()

      .slice(0, limit)

  }

  static first() {

    return this.top(1)[0] || null

  }

}

export default VehicleRecommendationEngine