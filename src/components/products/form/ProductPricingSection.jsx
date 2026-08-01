export default function ProductPricingSection({

  form,

  setForm

}) {

  const update = (

    key,

    value

  ) => {

    setForm(prev => ({

      ...prev,

      [key]: Number(value)

    }))

  }

  const purchasePrice =

    Number(form.purchasePrice || 0)

  const additionalCost =

    Number(form.additionalCost || 0)

  const salePrice =

    Number(form.salePrice || 0)

  const totalCost =

    purchasePrice +

    additionalCost

  const profit =

    salePrice -

    totalCost

  const profitMargin =

    totalCost > 0

      ? (

          profit /

          totalCost

        ) * 100

      : 0

  return (

    <div

      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-6
      "

    >

      <h3

        className="
          text-2xl
          font-black
          text-yellow-400
        "

      >

        الأسعار والتكاليف

      </h3>

      <div

        className="
          grid
          md:grid-cols-2
          gap-5
        "

      >

        <div>

          <label className="font-bold text-gray-300">

            سعر الشراء

          </label>

          <input

            type="number"

            value={form.purchasePrice}

            onChange={(e)=>

              update(

                'purchasePrice',

                e.target.value

              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>

        <div>

          <label className="font-bold text-gray-300">

            تكلفة إضافية

          </label>

          <input

            type="number"

            value={form.additionalCost || 0}

            onChange={(e)=>

              update(

                'additionalCost',

                e.target.value

              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>

        <div>

          <label className="font-bold text-gray-300">

            سعر البيع

          </label>

          <input

            type="number"

            value={form.salePrice}

            onChange={(e)=>

              update(

                'salePrice',

                e.target.value

              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>

        <div>

          <label className="font-bold text-gray-300">

            سعر الخصم

          </label>

          <input

            type="number"

            value={form.discountPrice}

            onChange={(e)=>

              update(

                'discountPrice',

                e.target.value

              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>

      </div>

      <div

        className="
          grid
          md:grid-cols-3
          gap-5
        "

      >

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            إجمالي التكلفة

          </div>

          <div className="text-3xl font-black text-yellow-400">

            {totalCost.toFixed(2)}

          </div>

        </div>

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            الربح

          </div>

          <div className="text-3xl font-black text-green-400">

            {profit.toFixed(2)}

          </div>

        </div>

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            هامش الربح

          </div>

          <div className="text-3xl font-black text-cyan-400">

            {profitMargin.toFixed(1)}%

          </div>

        </div>

      </div>

    </div>

  )

}