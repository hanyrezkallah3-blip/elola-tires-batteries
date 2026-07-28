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

            SKU

          </label>

          <input

            value={form.sku || ''}

            onChange={(e)=>
              update(
                'sku',
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

            placeholder="SKU-001"

          />

        </div>

        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            Barcode

          </label>

          <input

            value={form.barcode || ''}

            onChange={(e)=>
              update(
                'barcode',
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

            placeholder="629xxxxxxxx"

          />

        </div>

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

            الكود الداخلي

          </label>

          <input

            value={form.code || ''}

            onChange={(e)=>
              update(
                'code',
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

            placeholder="OEM / Internal Code"

          />

        </div>

        <div>

          <label className="
            block
            mb-2
            font-black
          ">

            المركبات المتوافقة

          </label>

          <input

            value={form.vehicleCompatibility || ''}

            onChange={(e)=>
              update(
                'vehicleCompatibility',
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

            placeholder="Corolla - Elantra - Sunny"

          />

        </div>

      </div>

      <div>

        <label className="
          block
          mb-2
          font-black
        ">

          كلمات مفتاحية

        </label>

        <input

          value={form.keywords || ''}

          onChange={(e)=>
            update(
              'keywords',
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

          placeholder="Michelin صيفى فرنسا 205 55 R16"

        />

      </div>

    </div>

  )

}