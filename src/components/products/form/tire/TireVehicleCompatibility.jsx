export default function TireVehicleCompatibility({

  compatibleVehicles

}) {


  if (

    !compatibleVehicles ||

    compatibleVehicles.length === 0

  )

    return null



  return (

    <div

      className="
        bg-slate-800
        rounded-3xl
        p-6
        space-y-5
      "

    >

      <h4

        className="
          text-xl
          font-black
          text-yellow-400
        "

      >

        🚗 توافق المركبات (AI)

      </h4>



      <div

        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-4
        "

      >

        {

          compatibleVehicles.map(

            (vehicle, index) => (

              <div

                key={index}

                className="
                  bg-slate-700
                  rounded-2xl
                  p-4
                  space-y-2
                "

              >

                <div

                  className="
                    text-lg
                    font-black
                  "

                >

                  {

                    vehicle.brand

                  }

                  {' '}

                  {

                    vehicle.model

                  }

                </div>
                                <div

                  className="
                    text-sm
                    text-gray-300
                  "

                >

                  السنوات:

                  {' '}

                  {

                    vehicle.years?.join(

                      ' - '

                    )

                  }

                </div>


              </div>

            )

          )

        }


      </div>


    </div>

  )

}