export default function InventorySection({

  form,

  updateField

}) {

  return (

    <div
      className="
        bg-slate-900
        rounded-3xl
        p-6
        border
        border-slate-700
      "
    >

      <h2
        className="
          text-2xl
          font-black
          text-yellow-400
          mb-6
        "
      >

        بيانات المخزون

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <div>

          <label className="block mb-2 font-bold">

            الكمية

          </label>

          <input
            type="number"
            value={form.quantity}
            onChange={(e)=>

              updateField(

                'quantity',

                Number(e.target.value)

              )

            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الوحدة

          </label>

          <select
            value={form.unit}
            onChange={(e)=>

              updateField(

                'unit',

                e.target.value

              )

            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "
          >

            <option value="piece">قطعة</option>
            <option value="box">علبة</option>
            <option value="set">طقم</option>
            <option value="liter">لتر</option>
            <option value="kg">كيلوجرام</option>

          </select>

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الحد الأدنى

          </label>

          <input
            type="number"
            value={form.minimumStock}
            onChange={(e)=>

              updateField(

                'minimumStock',

                Number(e.target.value)

              )

            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            الحد الأقصى

          </label>

          <input
            type="number"
            value={form.maximumStock}
            onChange={(e)=>

              updateField(

                'maximumStock',

                Number(e.target.value)

              )

            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
            "
          />

        </div>

      </div>

      <div className="mt-5">

        <label className="block mb-2 font-bold">

          نقطة إعادة الطلب

        </label>

        <input
          type="number"
          value={form.reorderPoint}
          onChange={(e)=>

            updateField(

              'reorderPoint',

              Number(e.target.value)

            )

          }
          className="
            w-full
            md:w-60
            p-4
            rounded-2xl
            bg-slate-800
            text-white
          "
        />

      </div>

    </div>

  )

}