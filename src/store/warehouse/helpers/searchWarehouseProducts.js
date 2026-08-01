export default function searchWarehouseProducts(

  warehouses = [],

  query = ''

) {

  const value =

    String(query)

      .toLowerCase()

      .trim()

  if (!value)

    return []

  const results = []

  warehouses.forEach(

    warehouse => {

      (warehouse.products || [])

        .forEach(product => {

          if (

            String(

              product.productName || ''

            )

              .toLowerCase()

              .includes(value)

            ||

            String(

              product.barcode || ''

            )

              .toLowerCase()

              .includes(value)

            ||

            String(

              product.brand || ''

            )

              .toLowerCase()

              .includes(value)

            ||

            String(

              product.category || ''

            )

              .toLowerCase()

              .includes(value)

          ) {

            results.push({

              ...product,

              warehouseId:

                warehouse.id,

              warehouseName:

                warehouse.name

            })

          }

        })

    }

  )

  return results

}