export default function getWarehouseInventoryValue(

  warehouse = {}

) {

  const products =

    warehouse.products || []

  return products.reduce(

    (total, product) =>

      total +

      (

        Number(product.quantity || 0) *

        Number(product.purchasePrice || 0)

      ),

    0

  )

}