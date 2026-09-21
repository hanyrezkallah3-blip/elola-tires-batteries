const numberValue = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

const textValue = (value, fallback = '') => {
  const text = String(value ?? '').trim()
  return text || fallback
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Date.now().toString() + Math.random().toString(36).slice(2)
}

export default function repriceWarehouseProduct(
  warehouses = [],
  warehouseId,
  productId,
  quantity,
  newSalePrice,
  repricingData = {}
) {

  const requestedQuantity = numberValue(quantity)
  const targetPrice = numberValue(newSalePrice)

  if (requestedQuantity <= 0) {
    return {
      success: false,
      warehouses,
      product: null,
      repricing: null,
      message: 'كمية إعادة التسعير يجب أن تكون أكبر من صفر'
    }
  }

  if (targetPrice < 0) {
    return {
      success: false,
      warehouses,
      product: null,
      repricing: null,
      message: 'سعر البيع الجديد غير صالح'
    }
  }

  const warehouse = warehouses.find(
    item => String(item.id) === String(warehouseId)
  )

  if (!warehouse) {
    return {
      success: false,
      warehouses,
      product: null,
      repricing: null,
      message: 'المخزن غير موجود'
    }
  }

  const sourceProduct = (warehouse.products || []).find(
    item =>
      String(item.productId) === String(productId) ||
      String(item.id) === String(productId)
  )

  if (!sourceProduct) {
    return {
      success: false,
      warehouses,
      product: null,
      repricing: null,
      message: 'المنتج غير موجود في هذا المخزن'
    }
  }

  const availableQuantity = numberValue(sourceProduct.quantity)

  if (requestedQuantity > availableQuantity) {
    return {
      success: false,
      warehouses,
      product: sourceProduct,
      repricing: null,
      message: 'الكمية المطلوب إعادة تسعيرها أكبر من الكمية المتاحة'
    }
  }

  const now = new Date().toISOString()
  const repricingId = textValue(
    repricingData.repricingId,
    generateId()
  )

  const originalSalePrice = numberValue(
    repricingData.originalSalePrice ??
    sourceProduct.salePrice
  )

  const existingSegments = Array.isArray(sourceProduct.priceSegments)
    ? sourceProduct.priceSegments
    : [
        {
          id: generateId(),
          quantity: availableQuantity,
          salePrice: originalSalePrice,
          originalSalePrice,
          salePriceSource: textValue(
            repricingData.salePriceSource,
            'warehouse'
          ),
          createdAt:
            sourceProduct.createdAt || now
        }
      ]

  const normalizedSegments = existingSegments
    .map(segment => ({
      ...segment,
      id: textValue(segment?.id, generateId()),
      quantity: numberValue(segment?.quantity),
      salePrice: numberValue(segment?.salePrice),
      originalSalePrice: numberValue(
        segment?.originalSalePrice ??
        segment?.salePrice
      )
    }))
    .filter(segment => segment.quantity > 0)

  const segmentTotal = normalizedSegments.reduce(
    (total, segment) => total + segment.quantity,
    0
  )

  if (segmentTotal > availableQuantity) {
    return {
      success: false,
      warehouses,
      product: sourceProduct,
      repricing: null,
      message: 'إجمالي كميات شرائح الأسعار أكبر من كمية المخزون'
    }
  }

  if (segmentTotal < availableQuantity) {
    normalizedSegments.push({
      id: generateId(),
      quantity: availableQuantity - segmentTotal,
      salePrice: originalSalePrice,
      originalSalePrice,
      salePriceSource: textValue(
        repricingData.salePriceSource,
        'warehouse'
      ),
      createdAt: now
    })

  }

  let remainingQuantity = requestedQuantity
  const updatedSegments = []
  const affectedSegments = []

  for (const segment of normalizedSegments) {
    if (remainingQuantity <= 0) {
      updatedSegments.push(segment)
      continue
    }

    const allocated = Math.min(
      segment.quantity,
      remainingQuantity
    )

    const remainingSegmentQuantity =
      segment.quantity - allocated

    if (remainingSegmentQuantity > 0) {
      updatedSegments.push({
        ...segment,
        quantity: remainingSegmentQuantity
      })
    }

    affectedSegments.push({
      segmentId: segment.id,
      quantity: allocated,
      previousSalePrice: segment.salePrice,
      originalSalePrice: segment.originalSalePrice
    })

    updatedSegments.push({
      id: generateId(),
      quantity: allocated,
      salePrice: targetPrice,
      originalSalePrice: segment.originalSalePrice,
      salePriceSource: textValue(
        repricingData.salePriceSource,
        'repricing'
      ),
      salePriceSourceId: textValue(
        repricingData.salePriceSourceId
      ),
      salePriceSourceName: textValue(
        repricingData.salePriceSourceName
      ),
      repricingId,
      repricingDate: now,
      repricingReason: textValue(
        repricingData.reason
      ),
      repricingUserId: textValue(
        repricingData.userId
      ),
      repricingUserName: textValue(
        repricingData.userName
      ),
      createdAt: now,
      updatedAt: now
    })

    remainingQuantity -= allocated
  }

  if (remainingQuantity > 0) {
    return {
      success: false,
      warehouses,
      product: sourceProduct,
      repricing: null,
      message: 'تعذر توزيع كامل كمية إعادة التسعير على شرائح المخزون'
    }
  }

  const finalSegmentQuantity = updatedSegments.reduce(
    (total, segment) => total + numberValue(segment.quantity),
    0
  )

  if (finalSegmentQuantity !== availableQuantity) {
    return {
      success: false,
      warehouses,
      product: sourceProduct,
      repricing: null,
      message: 'فشل الحفاظ على إجمالي كمية المخزون أثناء إعادة التسعير'
    }
  }

  const updatedProduct = {
    ...sourceProduct,
    priceSegments: updatedSegments,
    updatedAt: now
  }

  const updatedWarehouses = warehouses.map(
    item => {
      if (String(item.id) !== String(warehouseId)) {
        return item
      }

      return {
        ...item,
        products: (item.products || []).map(
          product => {
            const matches =
              String(product.productId) === String(productId) ||
              String(product.id) === String(productId)

            return matches
              ? updatedProduct
              : product
          }
        )
      }
    }
  )

  const repricing = {
    id: repricingId,
    warehouseId: String(warehouseId),
    productId: String(
      sourceProduct.productId || sourceProduct.id
    ),
    productName: textValue(
      sourceProduct.productName ||
      sourceProduct.name
    ),
    quantity: requestedQuantity,
    previousSalePrice:
      affectedSegments[0]?.previousSalePrice ??
      originalSalePrice,
    newSalePrice: targetPrice,
    salePriceSource: textValue(
      repricingData.salePriceSource,
      'repricing'
    ),
    reason: textValue(repricingData.reason),
    userId: textValue(repricingData.userId),
    userName: textValue(repricingData.userName),
    date: now,
    affectedSegments
  }

  return {
    success: true,
    warehouses: updatedWarehouses,
    product: updatedProduct,
    repricing,
    message: 'تمت إعادة تسعير الكمية المحددة بنجاح'
  }

}
