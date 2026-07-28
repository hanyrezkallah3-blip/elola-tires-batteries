import VehicleDemandEngine from '../engines/VehicleDemandEngine'

export class DemandForecastEngine {

  static forecast() {

    const history =

      VehicleDemandEngine.history()

    const forecast = new Map()

    history.forEach(search => {

      if (search.found)
        return

      const items = [

        {

          type: 'tire',

          value: search.tireSize

        },

        {

          type: 'battery',

          value: search.batteryCapacity

        },

        {

          type: 'oil',

          value: search.oilViscosity

        }

      ]

      items.forEach(item => {

        if (!item.value)
          return

        const key =

          `${item.type}:${item.value}`

        if (!forecast.has(key)) {

          forecast.set(key, {

            type: item.type,

            value: item.value,

            demand: 0,

            suggestedStock: 0

          })

        }

        forecast.get(key).demand++

      })

    })

    return [...forecast.values()]

      .map(item => ({

        ...item,

        suggestedStock:

          Math.ceil(

            item.demand * 1.3

          )

      }))

      .sort(

        (a, b) =>

          b.demand - a.demand

      )

  }

  static top(limit = 10) {

    return this

      .forecast()

      .slice(0, limit)

  }

}

export default DemandForecastEngine