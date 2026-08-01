export default function ProductOilSection({

  form,

  setForm

}) {


  const updateOil = (

    key,

    value

  ) => {

    setForm(prev => ({

      ...prev,

      oil: {

        ...prev.oil,

        [key]: value

      }

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

        بيانات الزيت

      </h3>


      <input

        value={
          form.oil.viscosity
        }

        onChange={(e) =>

          updateOil(

            'viscosity',

            e.target.value

          )

        }

        placeholder="اللزوجة"

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


      <input

        value={
          form.oil.api
        }

        onChange={(e) =>

          updateOil(

            'api',

            e.target.value

          )

        }

        placeholder="API"

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


      <input

        value={
          form.oil.acea
        }

        onChange={(e) =>

          updateOil(

            'acea',

            e.target.value

          )

        }

        placeholder="ACEA"

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


      <input

        value={
          form.oil.volume
        }

        onChange={(e) =>

          updateOil(

            'volume',

            e.target.value

          )

        }

        placeholder="الحجم"

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