import { useMemo, useState } from 'react'

import { warehouseProductDefaults } from '../config/warehouseProductDefaults'

const createInitialForm = () => ({
  ...warehouseProductDefaults
})

export default function useWarehouseProductForm() {

  const [initialForm] = useState(
    createInitialForm
  )

  const [form, setForm] = useState(
    createInitialForm
  )

  const updateField = (
    key,
    value
  ) => {

    setForm(previous => ({

      ...previous,

      [key]: value

    }))

  }

  const realCost = useMemo(() => {

    return (

      Number(form.purchasePrice || 0) +

      Number(form.shippingCost || 0) +

      Number(form.transportCost || 0) +

      Number(form.customsCost || 0) +

      Number(form.otherCosts || 0)

    )

  }, [

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

    if (!String(form.name || '').trim()) {

      alert('اسم المنتج مطلوب')

      return

    }

    if (Number(form.salePrice) <= 0) {

      alert('يجب إدخال سعر بيع صحيح')

      return

    }

    const preparedForm = {

      ...form,

      realCost,

      serialNumbers:

        typeof form.serialNumbers === 'string'

          ? form.serialNumbers

              .split(',')

              .map(item => item.trim())

              .filter(Boolean)

          : Array.isArray(form.serialNumbers)

            ? form.serialNumbers

            : []

    }

    return preparedForm

  }

  const reset = () => {

    setForm(
      createInitialForm()
    )

  }

  return {

    form,

    setForm,

    updateField,

    realCost,

    submit,

    reset,

    initialForm

  }

}