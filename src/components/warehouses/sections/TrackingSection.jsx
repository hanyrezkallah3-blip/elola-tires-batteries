import { useMemo } from 'react'

export default function TrackingSection({

  form,

  updateField

}) {

  const serialList = useMemo(

    () =>

      (form.serialNumbers || '')

        .split(',')

        .map(item => item.trim())

        .filter(Boolean),

    [form.serialNumbers]

  )

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

        بيانات التتبع

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        <Input
          label="Batch Number"
          field="batchNumber"
          form={form}
          updateField={updateField}
        />

        <Input
          label="Lot Number"
          field="lotNumber"
          form={form}
          updateField={updateField}
        />

        <Input
          label="الضمان"
          field="warranty"
          form={form}
          updateField={updateField}
        />

        <DateInput
          label="تاريخ الإنتاج"
          field="productionDate"
          form={form}
          updateField={updateField}
        />

        <DateInput
          label="تاريخ الانتهاء"
          field="expiryDate"
          form={form}
          updateField={updateField}
        />

      </div>

      <div className="mt-6">

        <label className="block mb-2 font-bold">

          Serial Numbers

        </label>

        <textarea

          value={form.serialNumbers}

          onChange={(e)=>

            updateField(

              'serialNumbers',

              e.target.value

            )

          }

          placeholder="SN001,SN002,SN003"

          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            min-h-[120px]
          "

        />

      </div>

      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-2
        "
      >

        {

          serialList.map(serial => (

            <div

              key={serial}

              className="
                px-3
                py-2
                rounded-full
                bg-blue-600
                font-bold
              "

            >

              {serial}

            </div>

          ))

        }

      </div>

    </div>

  )

}

function Input({

  label,

  field,

  form,

  updateField

}) {

  return (

    <div>

      <label className="block mb-2 font-bold">

        {label}

      </label>

      <input

        value={form[field]}

        onChange={(e)=>

          updateField(

            field,

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

  )

}

function DateInput({

  label,

  field,

  form,

  updateField

}) {

  return (

    <div>

      <label className="block mb-2 font-bold">

        {label}

      </label>

      <input

        type="date"

        value={form[field]}

        onChange={(e)=>

          updateField(

            field,

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

  )

}