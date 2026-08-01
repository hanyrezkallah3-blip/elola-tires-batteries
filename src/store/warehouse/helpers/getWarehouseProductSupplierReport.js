export default function getWarehouseProductSupplierReport(

  warehouse = {}

) {

  return (

    warehouse.products || []

  )

    .map(

      product => ({

        productId:

          product.productId,


        productName:

          product.productName,


        supplierId:

          product.supplierId || '',


        supplierName:

          product.supplierName || '',


        quantity:

          Number(

            product.quantity || 0

          ),


        purchasePrice:

          Number(

            product.purchasePrice || 0

          )

      })

    )

}