// ======================================================
// EL OLA ERP
// Smart Vehicle Search
// ======================================================

import {
  useMemo,
  useState
} from 'react'

import VehicleAIEngine
from '../../engines/VehicleAIEngine'

export default function SmartVehicleSearch({

  onSelect

}) {

  const [

    text,

    setText

  ] = useState('')

  const suggestions = useMemo(() => {

    if (!text.trim())

      return []

    return VehicleAIEngine.suggestions(

      text

    )

  }, [

    text

  ])

  function handleChoose(vehicle) {

    setText(

      `${vehicle.make} ${vehicle.model}`

    )

    onSelect?.({

      vehicleType:

        vehicle.vehicleType ??

        vehicle.type,

      make:

        vehicle.make,

      model:

        vehicle.model,

      year:

        vehicle.yearFrom,

      vehicle

    })

  }

  return (

    <div className="space-y-4">

      <input

        value={text}

        onChange={e =>

          setText(

            e.target.value

          )

        }

        placeholder="ابحث باسم السيارة مثل Corolla أو تويوتا كورولا"

        className="

          w-full

          p-4

          rounded-2xl

          bg-slate-900

          border

          border-slate-700

          text-white

          focus:border-yellow-500

          outline-none

        "

      />

      {

        suggestions.length > 0 &&

        <div

          className="

            rounded-2xl

            overflow-hidden

            border

            border-slate-700

            divide-y

            divide-slate-700

          "

        >

          {

            suggestions.map(vehicle => (

              <button

                key={

                  vehicle.id ??

                  `${vehicle.make}-${vehicle.model}-${vehicle.yearFrom}`

                }

                type="button"

                onClick={() =>

                  handleChoose(vehicle)

                }

                className="

                  w-full

                  text-left

                  p-4

                  bg-slate-800

                  hover:bg-slate-700

                  transition-colors

                "

              >

                <div className="font-black">

                  {vehicle.make}

                  {' '}

                  {vehicle.model}

                </div>

                <div className="text-sm text-slate-400 mt-1">

                  {

                    vehicle.yearFrom

                  }

                  {

                    vehicle.yearTo

                    ?

                    ` - ${vehicle.yearTo}`

                    :

                    ''

                  }

                </div>

              </button>

            ))

          }

        </div>

      }

    </div>

  )

}