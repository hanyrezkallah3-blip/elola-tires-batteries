import { useEffect, useMemo } from 'react'

import { loadSuppliers } from "../../../store/masterData/suppliers/supplierService";

export default function SupplierSection({

  form,

  updateField

}) {

  const suppliers = useMemo(

    () =>

      loadSuppliers(),

    []

  )

  useEffect(() => {

    if (!form.supplierId) {

      return

    }

    const supplier = suppliers.find(

      item =>

        item.id === form.supplierId

    )

    if (

      supplier &&

      supplier.name !== form.supplierName

    ) {

      updateField(

        'supplierName',

        supplier.name

      )

    }

  }, [

    form.supplierId,

    form.supplierName,

    suppliers,

    updateField

  ])

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

        المورد وموقع التخزين

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        <div>

          <label className="block mb-2 font-bold">

            المورد

          </label>

          <select

            value={form.supplierId}

            onChange={(e)=>

              updateField(

                'supplierId',

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

            <option value="">

              اختر المورد

            </option>

            {

              suppliers.map(

                supplier => (

                  <option

                    key={supplier.id}

                    value={supplier.id}

                  >

                    {supplier.name}

                  </option>

                )

              )

            }

          </select>

        </div>

        <div>

          <label className="block mb-2 font-bold">

            اسم المورد

          </label>

          <input

            value={form.supplierName}

            readOnly

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

            الموقع داخل المخزن

          </label>

          <input

            value={form.location}

            onChange={(e)=>

              updateField(

                'location',

                e.target.value

              )

            }

            placeholder="مثال: A-01"

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

            الرف

          </label>

          <input

            value={form.shelf}

            onChange={(e)=>

              updateField(

                'shelf',

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

          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            Rack

          </label>

          <input

            value={form.rack}

            onChange={(e)=>

              updateField(

                'rack',

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

          />

        </div>

        <div>

          <label className="block mb-2 font-bold">

            Bin

          </label>

          <input

            value={form.bin}

            onChange={(e)=>

              updateField(

                'bin',

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

          />

        </div>

      </div>

    </div>

  )

}