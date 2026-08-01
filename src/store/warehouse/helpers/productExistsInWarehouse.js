export default function productExistsInWarehouse(

  warehouses = [],

  warehouseId,

  productId

) {

  const warehouse =

    warehouses.find(

      item =>

        item.id === warehouseId

    )

  if (!warehouse)

    return false

  return (warehouse.products || [])

    .some(

      product =>

        product.productId === productId

    )

}