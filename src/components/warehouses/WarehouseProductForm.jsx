import useWarehouseProductForm from './hooks/useWarehouseProductForm'
import BasicInfoSection from './sections/BasicInfoSection'
import InventorySection from './sections/InventorySection'
import PricingSection from './sections/PricingSection'
import SupplierSection from './sections/SupplierSection'
import TrackingSection from './sections/TrackingSection'
import PublishingSection from './sections/PublishingSection'



export default function WarehouseProductForm({

  warehouses = [],

  onSubmit,

  onCancel

}) {

  const {

  form,

  setForm,

  updateField,

  realCost,

  initialForm

} = useWarehouseProductForm()
    const submit = () => {

    if (!form.warehouseId) {

      alert('يرجى اختيار المخزن')

      return

    }

    if (!form.name.trim()) {

      alert('اسم المنتج مطلوب')

      return

    }

    if (Number(form.salePrice) <= 0) {

      alert('يجب إدخال سعر بيع صحيح')

      return

    }

    onSubmit({

      ...form,

      realCost,

      serialNumbers:

        form.serialNumbers

          .split(',')

          .map(item => item.trim())

          .filter(Boolean)

    })

    setForm(initialForm)

  }

  return (

    <div

      className="space-y-8"

    >

      {/* ==========================================
          اختيار المخزن
      ========================================== */}

      <div

        className="bg-slate-900 rounded-3xl p-6"

      >

        <h2

          className="text-2xl font-black text-yellow-400 mb-6"

        >

          اختيار المخزن

        </h2>

        <select

          value={form.warehouseId}

          onChange={(e) =>

            updateField(

              'warehouseId',

              e.target.value

            )

          }

          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
          "

        >

          <option value="">

            اختر المخزن

          </option>

          {

            warehouses.map(

              warehouse => (

                <option

                  key={warehouse.id}

                  value={warehouse.id}

                >

                  {warehouse.name}

                </option>

              )

            )

          }

        </select>

      </div>

      <BasicInfoSection

        form={form}

        updateField={updateField}

      />

      <InventorySection

        form={form}

        updateField={updateField}

      />

      <PricingSection

        form={form}

        updateField={updateField}

        realCost={realCost}

      />

      <SupplierSection

        form={form}

        updateField={updateField}

      />

      <TrackingSection

        form={form}

        updateField={updateField}

      />

      <PublishingSection

        form={form}

        updateField={updateField}

      />

      {/* ==========================================
          أزرار الحفظ
      ========================================== */}

      <div

        className="
          flex
          flex-wrap
          gap-4
          pt-6
        "

      >

        <button

          type="button"

          onClick={submit}

          className="
            flex-1
            bg-green-600
            hover:bg-green-700
            p-4
            rounded-2xl
            font-black
            text-lg
          "

        >

          💾 حفظ المنتج

        </button>

        <button

          type="button"

          onClick={onCancel}

          className="
            flex-1
            bg-slate-700
            hover:bg-slate-600
            p-4
            rounded-2xl
            font-black
            text-lg
          "

        >

          إلغاء

        </button>

      </div>

    </div>

  )

}