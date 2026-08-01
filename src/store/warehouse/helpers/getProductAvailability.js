export default function getProductAvailability(

  warehouses = [],

  productId

) {

  const results = []

  warehouses.forEach(

    warehouse => {

      const product =

        (warehouse.products || [])

          .find(

            item =>

              item.productId ===

              productId

          )

      if (!product)

        return

      results.push({

        warehouseId:

          warehouse.id,

        warehouseName:

          warehouse.name,

        quantity:

          Number(

            product.quantity || 0

          ),

        purchasePrice:

          Number(

            product.purchasePrice || 0

          ),

        salePrice:

          Number(

            product.salePrice || 0

          ),

        minimumStock:

          Number(

            product.minimumStock || 0

          ),

        maximumStock:

          Number(

            product.maximumStock || 0

          ),

        product

      })

    }

  )

  return results

}