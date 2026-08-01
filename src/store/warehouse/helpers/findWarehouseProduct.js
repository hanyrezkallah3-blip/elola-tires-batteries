export default function findWarehouseProduct(

  warehouses = [],

  warehouseId,

  productId

) {

  const warehouse =

    warehouses.find(

      item =>

        item.id === warehouseId

    )

  if (!warehouse) {

    return null

  }

  return (

    warehouse.products || []

  ).find(

    product =>

      product.productId === productId

  ) || null

}