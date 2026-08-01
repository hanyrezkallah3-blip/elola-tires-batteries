export default function getLowStockProducts(

  warehouses = []

) {

  const results = []

  warehouses.forEach(

    warehouse => {

      (warehouse.products || []).forEach(

        product => {

          if (

            Number(product.quantity || 0)

            <=

            Number(

              product.minimumStock || 0

            )

          ) {

            results.push({

              ...product,

              warehouseId:

                warehouse.id,

              warehouseName:

                warehouse.name

            })

          }

        }

      )

    }

  )

  return results

}