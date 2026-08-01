export default function getWarehouseProductManufacturingReport(

  warehouse = {}

) {

  return (

    warehouse.products || []

  )

    .filter(

      product =>

        product.productionDate

    )

    .map(

      product => ({

        productId:

          product.productId,


        productName:

          product.productName,


        brand:

          product.brand || '',


        productionDate:

          product.productionDate,


        expiryDate:

          product.expiryDate || '',


        batchNumber:

          product.batchNumber || '',


        lotNumber:

          product.lotNumber || '',


        quantity:

          Number(

            product.quantity || 0

          )

      })

    )

}