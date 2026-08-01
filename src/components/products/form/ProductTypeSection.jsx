export default function ProductTypeSection({

  form,

  setForm

}) {


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

        نوع المنتج

      </h3>


      <select

        value={
          form.type
        }

        onChange={(e) =>

          setForm(prev => ({

            ...prev,

            type:

              e.target.value,

            category:

              e.target.value

          }))

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

        <option value="tire">

          إطارات

        </option>


        <option value="battery">

          بطاريات

        </option>


        <option value="oil">

          زيوت

        </option>


        <option value="accessory">

          إكسسوارات

        </option>


        <option value="service">

          خدمة

        </option>


      </select>


    </div>

  )

}