export default function getWarehouseCostReport(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  const productCosts =

    products.map(

      product => ({

        productId:

          product.productId,


        productName:

          product.productName,


        quantity:

          Number(

            product.quantity || 0

          ),


        purchaseCost:

          Number(

            product.purchasePrice || 0

          ) *


          Number(

            product.quantity || 0

          ),


        extraCosts:

          (

            Number(product.shippingCost || 0) +

            Number(product.customsCost || 0) +

            Number(product.transportCost || 0) +

            Number(product.otherCosts || 0)

          ),


        totalCost:

          Number(product.realCost || 0) *

          Number(product.quantity || 0)

      })

    )


  return {

    products:

      productCosts,


    total:

      productCosts.reduce(

        (sum, item) =>

          sum +

          Number(

            item.totalCost || 0

          ),

        0

      )

  }

}