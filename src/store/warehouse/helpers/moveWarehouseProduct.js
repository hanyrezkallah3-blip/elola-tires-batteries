import decreaseWarehouseProductQuantity
  from './decreaseWarehouseProductQuantity'

import increaseWarehouseProductQuantity
  from './increaseWarehouseProductQuantity'

import productExistsInWarehouse
  from './productExistsInWarehouse'

import addProductToWarehouse
  from './addProductToWarehouse'


export default function moveWarehouseProduct(

  warehouses = [],

  fromWarehouseId,

  toWarehouseId,

  product,

  quantity

) {

  if (
    !fromWarehouseId ||
    !toWarehouseId ||
    !product
  ) {

    return warehouses

  }


  const amount =
    Number(
      quantity || 0
    )


  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    return warehouses

  }


  if (
    String(fromWarehouseId) ===
    String(toWarehouseId)
  ) {

    return warehouses

  }


  const productId =
    product.productId ||
    product.id ||
    ''


  if (!productId) {

    return warehouses

  }


  let next =
    [...warehouses]


  // ==========================================
  // ENSURE PRODUCT EXISTS IN TARGET
  // ==========================================

  if (
    !productExistsInWarehouse(
      next,
      toWarehouseId,
      productId
    )
  ) {

    next =
      addProductToWarehouse(

        next,

        toWarehouseId,

        {

          ...product,

          id:
            product.id ||
            productId,

          productId,

          // مهم:
          // النقل لا ينقل الرصيد الأصلي الموجود
          // في المصدر كرصيد افتتاحي.
          //
          // نبدأ الوجهة بصفر ثم نضيف كمية النقل.

          quantity:
            0,

          incoming:
            0,

          outgoing:
            0,

          reserved:
            0,

          availableQuantity:
            0

        }

      )

  }


  // ==========================================
  // DECREASE SOURCE
  // ==========================================

  next =
    decreaseWarehouseProductQuantity(

      next,

      fromWarehouseId,

      productId,

      amount

    )


  // ==========================================
  // INCREASE TARGET
  // ==========================================

  next =
    increaseWarehouseProductQuantity(

      next,

      toWarehouseId,

      productId,

      amount

    )


  return next

}