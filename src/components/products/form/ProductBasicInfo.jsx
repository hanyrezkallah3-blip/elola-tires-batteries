import React from 'react'

export default function ProductBasicInfo({
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

        البيانات الأساسية للمنتج

      </h3>


      <div>

        <label className="
          block
          mb-2
          font-black
        ">

          اسم المنتج

        </label>

        <input

          value={form.name || ''}

          onChange={(e)=>
            update(
              'name',
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

          placeholder="مثال: ميشلان 205/55R16"

        />

      </div>


      <div>

        <label className="
          block
          mb-2
          font-black
        ">

          نوع المنتج

        </label>


        <select

          value={form.type || 'tire'}

          onChange={(e)=>
            update(
              'type',
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

          <option value="tire">
            إطار
          </option>

          <option value="battery">
            بطارية
          </option>

          <option value="oil">
            زيت
          </option>

          <option value="other">
            أخرى
          </option>

        </select>

      </div>


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

            الماركة

          </label>

          <input

            value={form.brand || ''}

            onChange={(e)=>
              update(
                'brand',
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

            placeholder="Michelin"

          />

        </div>


        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            الموديل

          </label>

          <input

            value={form.model || ''}

            onChange={(e)=>
              update(
                'model',
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

            placeholder="Primacy"

          />

        </div>

      </div>


    </div>

  )

}