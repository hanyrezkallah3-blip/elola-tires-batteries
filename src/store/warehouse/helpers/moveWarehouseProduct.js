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

  let next = [...warehouses]

  if (

    !productExistsInWarehouse(

      next,

      toWarehouseId,

      product.productId

    )

  ) {

    next = addProductToWarehouse(

      next,

      toWarehouseId,

      product

    )

  }

  next = decreaseWarehouseProductQuantity(

    next,

    fromWarehouseId,

    product.productId,

    quantity

  )

  next = increaseWarehouseProductQuantity(

    next,

    toWarehouseId,

    product.productId,

    quantity

  )

  return next

}