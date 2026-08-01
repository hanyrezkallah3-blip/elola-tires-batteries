export default function ProductCompatibilitySection({

  form,

  setForm

}) {


  const updateVehicles = (value) => {

    const list =

      value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)


    setForm(prev => ({

      ...prev,

      compatibleVehicles: list,

      vehicleCompatibility:

        list.join(' ')

    }))

  }


  return (

    <div

      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-4
      "

    >

      <h3

        className="
          text-2xl
          font-black
          text-yellow-400
        "

      >

        توافق المركبات

      </h3>


      <textarea

        value={

          Array.isArray(
            form.compatibleVehicles
          )

            ?

            form.compatibleVehicles.join(', ')

            :

            ''

        }

        onChange={(e) =>

          updateVehicles(

            e.target.value

          )

        }

        placeholder="
          اكتب السيارات المتوافقة مفصولة بفاصلة
        "

        className="
          w-full
          min-h-32
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


      <input

        value={

          Array.isArray(
            form.compatibleSizes
          )

            ?

            form.compatibleSizes.join(', ')

            :

            ''

        }

        onChange={(e) =>

          setForm(prev => ({

            ...prev,

            compatibleSizes:

              e.target.value

                .split(',')

                .map(
                  item =>
                    item.trim()
                )

                .filter(Boolean)

          }))

        }

        placeholder="
          المقاسات المتوافقة
        "

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


    </div>

  )

}