export function validateWarehouseProduct(form) {

  if (!form.warehouseId) {

    return 'يرجى اختيار المخزن'

  }

  if (!form.name.trim()) {

    return 'اسم المنتج مطلوب'

  }

  if (!form.category) {

    return 'يرجى اختيار الفئة'

  }

  if (!form.brand) {

    return 'يرجى اختيار العلامة التجارية'

  }

  if (Number(form.salePrice) <= 0) {

    return 'يجب إدخال سعر بيع صحيح'

  }

  if (Number(form.quantity) < 0) {

    return 'الكمية لا يمكن أن تكون سالبة'

  }

  return null

}