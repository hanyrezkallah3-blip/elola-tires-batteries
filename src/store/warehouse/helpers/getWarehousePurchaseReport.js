export default function getWarehousePurchaseReport(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  const purchases =

    products.map(

      product => ({

        productId:

          product.productId,


        productName:

          product.productName,


        supplier:

          product.supplierName || '',


        quantity:

          Number(

            product.quantity || 0

          ),


        purchasePrice:

          Number(

            product.purchasePrice || 0

          ),


        purchaseValue:

          Number(

            product.quantity || 0

          ) *

          Number(

            product.purchasePrice || 0

          ),


        extraCosts:

          Number(product.shippingCost || 0) +

          Number(product.customsCost || 0) +

          Number(product.transportCost || 0) +

          Number(product.otherCosts || 0)

      })

    )


  return {

    products: purchases,


    totalPurchase:

      purchases.reduce(

        (sum, item) =>

          sum +

          item.purchaseValue,

        0

      ),


    totalExtraCosts:

      purchases.reduce(

        (sum, item) =>

          sum +

          item.extraCosts,

        0

      )

  }

}