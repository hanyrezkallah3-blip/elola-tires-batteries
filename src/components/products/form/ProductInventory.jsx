import React from 'react'

export default function ProductInventory({
  form,
  setForm
}) {

  const update = (key, value) => {

    setForm(prev => ({

      ...prev,

      [key]: Number(value) || 0

    }))

  }


  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      p-6
      space-y-6
    ">

      <h3 className="
        text-2xl
        font-black
        text-yellow-400
      ">

        إدارة المخزون

      </h3>


      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">


        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            الكمية الحالية

          </label>

          <input

            type="number"

            value={
              form.quantity || ''
            }

            onChange={(e)=>
              update(
                'quantity',
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

          />

        </div>


        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            الحد الأدنى للمخزون

          </label>

          <input

            type="number"

            value={
              form.minimumStock || ''
            }

            onChange={(e)=>
              update(
                'minimumStock',
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

          />

        </div>


        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            الحد الأقصى للمخزون

          </label>

          <input

            type="number"

            value={
              form.maximumStock || ''
            }

            onChange={(e)=>
              update(
                'maximumStock',
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

          />

        </div>


        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            نقطة إعادة الطلب

          </label>

          <input

            type="number"

            value={
              form.reorderPoint || ''
            }

            onChange={(e)=>
              update(
                'reorderPoint',
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

          />

        </div>


      </div>


    </div>

  )

}