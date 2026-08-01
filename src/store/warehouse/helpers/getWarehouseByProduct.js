export default function getWarehouseByProduct(

  warehouses = [],

  productId

) {

  for (const warehouse of warehouses) {

    const product =

      (warehouse.products || []).find(

        item =>

          item.productId === productId

      )

    if (product) {

      return {

        warehouse,

        product

      }

    }

  }

  return null

}