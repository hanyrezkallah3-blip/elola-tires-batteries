export default function PricingSection({

  form,

  updateField,

  realCost

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

        الأسعار والتكاليف

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
          label="سعر الشراء"
          value={form.purchasePrice}
          field="purchasePrice"
          updateField={updateField}
        />

        <Input
          label="الشحن"
          value={form.shippingCost}
          field="shippingCost"
          updateField={updateField}
        />

        <Input
          label="النقل"
          value={form.transportCost}
          field="transportCost"
          updateField={updateField}
        />

        <Input
          label="الجمارك"
          value={form.customsCost}
          field="customsCost"
          updateField={updateField}
        />

        <Input
          label="تكاليف أخرى"
          value={form.otherCosts}
          field="otherCosts"
          updateField={updateField}
        />

        <Input
          label="سعر الجملة"
          value={form.wholesalePrice}
          field="wholesalePrice"
          updateField={updateField}
        />

        <Input
          label="سعر البيع"
          value={form.salePrice}
          field="salePrice"
          updateField={updateField}
        />

      </div>

      <div
        className="
          mt-8
          bg-slate-800
          rounded-2xl
          p-5
        "
      >

        <div className="text-gray-400">

          التكلفة الفعلية

        </div>

        <div
          className="
            text-3xl
            font-black
            text-green-400
          "
        >

          {realCost} ج

        </div>

      </div>

    </div>

  )

}

function Input({

  label,

  value,

  field,

  updateField

}) {

  return (

    <div>

      <label className="block mb-2 font-bold">

        {label}

      </label>

      <input

        type="number"

        value={value}

        onChange={(e)=>

          updateField(

            field,

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

  )

}