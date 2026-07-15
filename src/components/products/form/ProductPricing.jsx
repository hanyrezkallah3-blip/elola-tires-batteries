import React from 'react'

export default function ProductPricing({
  form,
  setForm
}) {

  const update = (key, value) => {

    setForm(prev => ({

      ...prev,

      [key]: Number(value)

    }))

  }

  const purchase =
    Number(form.purchasePrice || 0)

  const sale =
    Number(form.salePrice || 0)

  const profit =
    sale - purchase

  const margin =
    purchase > 0
      ? ((profit / purchase) * 100).toFixed(2)
      : 0

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

        الأسعار والربحية

      </h3>

      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">

        <div>

          <label className="block mb-2 font-black">

            سعر الشراء

          </label>

          <input

            type="number"

            value={form.purchasePrice || ''}

            onChange={(e)=>

              update(
                'purchasePrice',
                e.target.value
              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
            "

          />

        </div>

        <div>

          <label className="block mb-2 font-black">

            سعر البيع

          </label>

          <input

            type="number"

            value={form.salePrice || ''}

            onChange={(e)=>

              update(
                'salePrice',
                e.target.value
              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
            "

          />

        </div>

        <div>

          <label className="block mb-2 font-black">

            سعر الخصم

          </label>

          <input

            type="number"

            value={form.discountPrice || ''}

            onChange={(e)=>

              update(
                'discountPrice',
                e.target.value
              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
            "

          />

        </div>

        <div>

          <label className="block mb-2 font-black">

            التكلفة

          </label>

          <input

            type="number"

            value={form.cost || ''}

            onChange={(e)=>

              update(
                'cost',
                e.target.value
              )

            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
            "

          />

        </div>

      </div>

      <div className="
        grid
        md:grid-cols-2
        gap-5
      ">

        <div className="
          bg-green-700
          rounded-2xl
          p-5
          text-xl
          font-black
        ">

          الربح:
          {profit}

        </div>

        <div className="
          bg-blue-700
          rounded-2xl
          p-5
          text-xl
          font-black
        ">

          هامش الربح:
          {margin}%

        </div>

      </div>

    </div>

  )

}