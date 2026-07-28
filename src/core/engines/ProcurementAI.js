import VehicleDemandEngine from './VehicleDemandEngine'

export class ProcurementAI {

  static generateReport() {

    const searches =

      VehicleDemandEngine.history()

    const report = new Map()

    searches.forEach(search => {

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

        if (!report.has(key)) {

          report.set(key, {

            type: item.type,

            value: item.value,

            requests: 0,

            priority: 'Low'

          })

        }

        report.get(key).requests++

      })

    })

    return [...report.values()]

      .map(item => ({

        ...item,

        priority:

          item.requests >= 50

            ? 'Critical'

            : item.requests >= 20

            ? 'High'

            : item.requests >= 10

            ? 'Medium'

            : 'Low'

      }))

      .sort(

        (a, b) =>

          b.requests - a.requests

      )

  }

  static topSuggestions(limit = 10) {

    return this

      .generateReport()

      .slice(0, limit)

  }

}

export default ProcurementAI