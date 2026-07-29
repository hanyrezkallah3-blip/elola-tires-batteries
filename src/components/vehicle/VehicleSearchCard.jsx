import React from 'react'

export default function VehicleSearchCard({

  vehicle

}) {

  if (

    !vehicle

  ) {

    return null

  }

  return (

    <div

      className="

        rounded-3xl

        border

        border-yellow-500

        bg-slate-900

        p-6

        shadow-xl

      "

    >

      <div className="flex items-start gap-6">

        <div

          className="

            w-24

            h-24

            rounded-2xl

            bg-slate-800

            flex

            items-center

            justify-center

            text-5xl

            shrink-0

          "

        >

          🚗

        </div>

        <div className="flex-1">

          <h3

            className="

              text-2xl

              font-black

              text-white

            "

          >

            {vehicle.make}

            {' '}

            {vehicle.model}

          </h3>

          <div

            className="

              mt-2

              text-slate-400

            "

          >

            {

              vehicle.typeName ||

              vehicle.type ||

              'Vehicle'

            }

          </div>

          <div

            className="

              mt-4

              grid

              md:grid-cols-3

              gap-4

            "

          >

            <Info

              title="سنة البداية"

              value={

                vehicle.yearFrom

              }

            />

            <Info

              title="سنة النهاية"

              value={

                vehicle.yearTo

              }

            />

            <Info

              title="الشركة"

              value={

                vehicle.make

              }

            />

          </div>

        </div>

      </div>

    </div>

  )

}

function Info({

  title,

  value

}) {

  return (

    <div

      className="

        rounded-2xl

        bg-slate-800

        p-4

      "

    >

      <div

        className="

          text-xs

          text-slate-400

          mb-2

        "

      >

        {title}

      </div>

      <div

        className="

          text-lg

          font-bold

          text-white

        "

      >

        {

          value ||

          '-'

        }

      </div>

    </div>

  )

}