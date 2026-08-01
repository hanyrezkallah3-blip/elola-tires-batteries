export default function getAvailableWarehousesForProduct(

  warehouses = [],

  productId

) {

  return warehouses

    .filter(

      warehouse =>

        (warehouse.products || []).some(

          product =>

            product.productId === productId &&

            Number(product.quantity || 0) > 0

        )

    )

    .map(

      warehouse => {

        const product =

          warehouse.products.find(

            item =>

              item.productId === productId

          )

        return {

          warehouseId:

            warehouse.id,

          warehouseName:

            warehouse.name,

          quantity:

            Number(

              product.quantity || 0

            ),

          salePrice:

            Number(

              product.salePrice || 0

            )

        }

      }

    )

}