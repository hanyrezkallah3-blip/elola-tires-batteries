export default function getWarehouseStockReport(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  return products.map(

    product => ({

      productId:

        product.productId,


      productName:

        product.productName,


      brand:

        product.brand || '',


      category:

        product.category || '',


      quantity:

        Number(

          product.quantity || 0

        ),


      incoming:

        Number(

          product.incoming || 0

        ),


      outgoing:

        Number(

          product.outgoing || 0

        ),


      purchasePrice:

        Number(

          product.purchasePrice || 0

        ),


      realCost:

        Number(

          product.realCost || 0

        ),


      salePrice:

        Number(

          product.salePrice || 0

        ),


      stockValue:

        Number(

          product.quantity || 0

        ) *

        Number(

          product.realCost || 0

        ),


      productionDate:

        product.productionDate || '',


      expiryDate:

        product.expiryDate || '',


      batchNumber:

        product.batchNumber || ''

    })

  )

}