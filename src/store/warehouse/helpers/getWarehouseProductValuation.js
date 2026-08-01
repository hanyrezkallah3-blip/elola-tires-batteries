export default function getWarehouseProductValuation(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  return products.map(

    product => {

      const quantity =

        Number(

          product.quantity || 0

        )


      const cost =

        Number(

          product.realCost ||

          product.purchasePrice ||

          0

        )


      const salePrice =

        Number(

          product.salePrice || 0

        )


      return {

        productId:

          product.productId,


        productName:

          product.productName,


        quantity,


        costValue:

          quantity * cost,


        saleValue:

          quantity * salePrice,


        expectedProfit:

          (

            quantity * salePrice

          )

          -

          (

            quantity * cost

          )

      }

    }

  )

}