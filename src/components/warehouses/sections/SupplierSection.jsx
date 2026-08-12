import { useMemo } from 'react'

import SmartInput from '../../common/SmartInput'

import { loadSuppliers } from '../../../store/masterData/suppliers/supplierService'

export default function SupplierSection({

  form,

  updateField

}) {

  const suppliers = useMemo(

    () => loadSuppliers(),

    []

  )

  const handleSupplierChange = (value) => {

    updateField(

      'supplierName',

      value

    )

    const supplier = suppliers.find(

      item =>

        item.name === value ||

        item.companyName === value

    )

    updateField(

      'supplierId',

      supplier?.id || ''

    )

  }

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

        <SmartInput

          label="المورد"

          value={form.supplierName}

          options={suppliers}

          placeholder="اختر أو اكتب اسم المورد"

          onChange={handleSupplierChange}

        />

        <div>

          <label className="block mb-2 font-bold">

            الموقع داخل المخزن

          </label>

          <input

            value={form.location}

            onChange={(e) =>

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

            onChange={(e) =>

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

            onChange={(e) =>

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

            onChange={(e) =>

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