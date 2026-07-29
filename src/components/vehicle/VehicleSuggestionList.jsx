import React from 'react'

export default function VehicleSuggestionList({

  suggestions = [],

  highlighted = 0,

  onHover,

  onSelect

}) {

  if (

    !suggestions.length

  ) {

    return null

  }

  return (

    <div

      className="

        absolute

        z-50

        mt-3

        w-full

        overflow-hidden

        rounded-3xl

        border

        border-slate-700

        bg-slate-900

        shadow-2xl

        max-h-[420px]

        overflow-y-auto

      "

    >

      {

        suggestions.map(

          (

            vehicle,

            index

          ) => (

            <button

              key={

                vehicle.id ||

                `${vehicle.make}-${vehicle.model}-${vehicle.yearFrom}`

              }

              type="button"

              onMouseEnter={() =>

                onHover(index)

              }

              onClick={() =>

                onSelect(vehicle)

              }

              className={

                `

                w-full

                text-right

                px-5

                py-4

                border-b

                border-slate-800

                transition-all

                hover:bg-yellow-500

                hover:text-black

                ${

                  highlighted === index

                    ? 'bg-yellow-500 text-black'

                    : 'text-white'

                }

                `

              }

            >

              <div className="flex items-center gap-4">

                <div className="text-3xl">

                  🚗

                </div>

                <div className="flex-1">

                  <div className="font-black text-lg">

                    {vehicle.make}

                  </div>

                  <div className="text-sm opacity-80">

                    {vehicle.model}

                  </div>

                </div>

                <div className="text-sm whitespace-nowrap">

                  {

                    vehicle.yearFrom

                  }

                  {

                    vehicle.yearTo

                      ? ` - ${vehicle.yearTo}`

                      : ''

                  }

                </div>

              </div>

            </button>

          )

        )

      }

    </div>

  )

}