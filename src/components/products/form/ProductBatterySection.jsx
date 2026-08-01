export default function ProductBatterySection({

  form,

  setForm

}) {


  const updateBattery = (

    key,

    value

  ) => {

    setForm(prev => ({

      ...prev,

      battery: {

        ...prev.battery,

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

        بيانات البطارية

      </h3>


      <input

        value={
          form.battery.capacity
        }

        onChange={(e) =>

          updateBattery(

            'capacity',

            e.target.value

          )

        }

        placeholder="السعة"

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
          form.battery.cca
        }

        onChange={(e) =>

          updateBattery(

            'cca',

            e.target.value

          )

        }

        placeholder="CCA"

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
          form.battery.voltage
        }

        onChange={(e) =>

          updateBattery(

            'voltage',

            e.target.value

          )

        }

        placeholder="الفولت"

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
          form.battery.polarity
        }

        onChange={(e) =>

          updateBattery(

            'polarity',

            e.target.value

          )

        }

        placeholder="القطبية"

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
          form.battery.model
        }

        onChange={(e) =>

          updateBattery(

            'model',

            e.target.value

          )

        }

        placeholder="موديل البطارية"

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