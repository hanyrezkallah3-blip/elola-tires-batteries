import {
  useState
} from 'react'


export default function TireVehicleSelector({

  compatibleVehicles

}) {


  const [selectedVehicle, setSelectedVehicle] =

    useState(null)



  if (

    !compatibleVehicles ||

    compatibleVehicles.length === 0

  )

    return null



  const brands = [

    ...new Set(

      compatibleVehicles.map(

        vehicle => vehicle.brand

      )

    )

  ]



  const models =

    selectedVehicle

      ?

      compatibleVehicles.filter(

        vehicle =>

          vehicle.brand === selectedVehicle

      )

      :

      []



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

        🚗 السيارات المتوافقة تلقائيًا

      </h4>



      <select

        onChange={(e)=>

          setSelectedVehicle(

            e.target.value

          )

        }

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      >

        <option value="">

          اختر الماركة

        </option>


        {

          brands.map(

            brand => (

              <option

                key={brand}

                value={brand}

              >

                {brand}

              </option>

            )

          )

        }

      </select>
            {

        selectedVehicle && (

          <select

            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          >

            <option value="">

              اختر الموديل

            </option>


            {

              models.map(

                (vehicle, index) => (

                  <option

                    key={index}

                    value={vehicle.model}

                  >

                    {

                      vehicle.model

                    }

                    {' - '}

                    {

                      vehicle.years.join(

                        ' / '

                      )

                    }

                  </option>

                )

              )

            }


          </select>

        )

      }



      {

        selectedVehicle && (

          <div

            className="
              bg-slate-700
              rounded-2xl
              p-4
            "

          >

            <p className="font-bold">

              تم توليد التوافق بواسطة الذكاء الاصطناعي

            </p>


            <p className="text-gray-300 mt-2">

              يمكنك اختيار المركبة من القائمة بدون إدخال يدوي

            </p>


          </div>

        )

      }


    </div>

  )

}