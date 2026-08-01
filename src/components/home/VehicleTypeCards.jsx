import React from 'react'

export default function VehicleTypeCards({

  types = [],

  selected,

  onSelect

}) {

  const vehicleTypes =

    Array.isArray(types)

      ? types

      : []

  return (

    <div
      className="

        grid

        grid-cols-2

        md:grid-cols-4

        xl:grid-cols-6

        gap-5

      "
    >

      {

        vehicleTypes.map(type => (

          <button

            key={type.id}

            type="button"

            onClick={() => onSelect(type.id)}

            className={`

              rounded-3xl

              overflow-hidden

              border-2

              transition-all

              bg-slate-900

              ${

                selected === type.id

                  ? 'border-yellow-500 scale-105'

                  : 'border-slate-700 hover:border-yellow-400'

              }

            `}

          >

            <div

              className="

                h-36

                bg-slate-800

                flex

                items-center

                justify-center

                overflow-hidden

              "

            >

              {

                type.image

                  ? (

                      <img

                        src={type.image}

                        alt={type.name}

                        className="

                          w-full

                          h-full

                          object-contain

                          p-4

                        "

                      />

                    )

                  : (

                      <div className="text-6xl">

                        🚗

                      </div>

                    )

              }

            </div>

            <div

              className="

                py-4

                font-black

                text-lg

              "

            >

              {type.name}

            </div>

          </button>

        ))

      }

    </div>

  )

}