export default function ProductBasicSection({

  form,

  setForm

}) {

  const update = (key, value) => {

    setForm(prev => ({

      ...prev,

      [key]: value

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

        بيانات المنتج الأساسية

      </h3>


      <input

        value={
          form.name
        }

        onChange={(e) =>

          update(

            'name',

            e.target.value

          )

        }

        placeholder="اسم المنتج"

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
          form.brand
        }

        onChange={(e) =>

          update(

            'brand',

            e.target.value

          )

        }

        placeholder="الماركة"

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
          form.model
        }

        onChange={(e) =>

          update(

            'model',

            e.target.value

          )

        }

        placeholder="الموديل"

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
          form.sku
        }

        onChange={(e) =>

          update(

            'sku',

            e.target.value

          )

        }

        placeholder="SKU"

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
          form.barcode
        }

        onChange={(e) =>

          update(

            'barcode',

            e.target.value

          )

        }

        placeholder="Barcode"

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      />


      <textarea

        value={
          form.description
        }

        onChange={(e) =>

          update(

            'description',

            e.target.value

          )

        }

        placeholder="وصف المنتج"

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