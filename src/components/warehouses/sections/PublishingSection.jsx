export default function PublishingSection({

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

        إعدادات النشر والعرض

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        "
      >

        <Check
          title="نشر في الصفحة الرئيسية"
          field="publishToHome"
          form={form}
          updateField={updateField}
        />

        <Check
          title="نشر في صفحة المنتجات"
          field="publishToProducts"
          form={form}
          updateField={updateField}
        />

        <Check
          title="نشر في العروض"
          field="publishToOffers"
          form={form}
          updateField={updateField}
        />

        <Check
          title="منتج مميز"
          field="featured"
          form={form}
          updateField={updateField}
        />

        <Check
          title="إظهار السعر"
          field="showPrice"
          form={form}
          updateField={updateField}
        />

        <Check
          title="إظهار العلامة التجارية"
          field="showBrand"
          form={form}
          updateField={updateField}
        />

        <Check
          title="إظهار الوصف"
          field="showDescription"
          form={form}
          updateField={updateField}
        />

        <Check
          title="إظهار التوفر"
          field="showAvailability"
          form={form}
          updateField={updateField}
        />

        <Check
          title="المنتج نشط"
          field="active"
          form={form}
          updateField={updateField}
        />

      </div>

      <div className="mt-6">

        <label className="block mb-2 font-bold">

          ترتيب الظهور

        </label>

        <input

          type="number"

          value={form.displayOrder}

          onChange={(e)=>

            updateField(

              'displayOrder',

              Number(e.target.value)

            )

          }

          className="
            w-56
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

function Check({

  title,

  field,

  form,

  updateField

}) {

  return (

    <label
      className="
        flex
        items-center
        gap-3
        bg-slate-800
        rounded-xl
        p-4
        cursor-pointer
      "
    >

      <input

        type="checkbox"

        checked={form[field]}

        onChange={(e)=>

          updateField(

            field,

            e.target.checked

          )

        }

      />

      <span className="font-bold">

        {title}

      </span>

    </label>

  )

}