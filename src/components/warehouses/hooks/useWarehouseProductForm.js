import { useMemo, useState } from 'react'
import { warehouseProductDefaults } from '../config/warehouseProductDefaults'

export default function useWarehouseProductForm(onSubmit) {

  const [form, setForm] = useState(warehouseProductDefaults)

  const updateField = (key, value) =>

    setForm(previous => ({

      ...previous,

      [key]: value

    }))

  const realCost = useMemo(() => (

    Number(form.purchasePrice || 0) +
    Number(form.shippingCost || 0) +
    Number(form.transportCost || 0) +
    Number(form.customsCost || 0) +
    Number(form.otherCosts || 0)

  ), [

    form.purchasePrice,
    form.shippingCost,
    form.transportCost,
    form.customsCost,
    form.otherCosts

  ])

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

    setForm(warehouseProductDefaults)

  }

  return {

    form,

    updateField,

    realCost,

    submit

  }

}