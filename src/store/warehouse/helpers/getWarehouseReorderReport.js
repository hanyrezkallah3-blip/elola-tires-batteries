export default function getWarehouseReorderReport(

  warehouse = {}

) {

  return (

    warehouse.products || []

  )

    .filter(

      product =>

        Number(

          product.quantity || 0

        )

        <=

        Number(

          product.reorderPoint ??

          product.minimumStock ??

          0

        )

    )

    .map(

      product => ({

        productId:

          product.productId,

        productName:

          product.productName,

        brand:

          product.brand || '',

        quantity:

          Number(

            product.quantity || 0

          ),

        minimumStock:

          Number(

            product.minimumStock || 0

          ),

        reorderPoint:

          Number(

            product.reorderPoint ??

            product.minimumStock ??

            0

          ),

        suggestedOrder:

          Math.max(

            0,

            Number(

              product.maximumStock || 0

            ) -

            Number(

              product.quantity || 0

            )

          )

      })

    )

}