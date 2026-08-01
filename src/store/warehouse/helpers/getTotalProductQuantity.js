export default function getTotalProductQuantity(

  warehouses = [],

  productId

) {

  return warehouses.reduce(

    (total, warehouse) =>

      total +

      (warehouse.products || [])

        .filter(

          product =>

            product.productId === productId

        )

        .reduce(

          (sum, product) =>

            sum +

            Number(product.quantity || 0),

          0

        ),

    0

  )

}