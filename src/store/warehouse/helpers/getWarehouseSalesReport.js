export default function getWarehouseSalesReport(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  const sales =

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


        salePrice:

          Number(

            product.salePrice || 0

          ),


        expectedRevenue:

          Number(

            product.quantity || 0

          ) *

          Number(

            product.salePrice || 0

          ),


        cost:

          Number(

            product.quantity || 0

          ) *

          Number(

            product.realCost || 0

          ),


        expectedProfit:

          (

            Number(product.quantity || 0) *

            Number(product.salePrice || 0)

          )

          -

          (

            Number(product.quantity || 0) *

            Number(product.realCost || 0)

          )

      })

    )


  return {

    products: sales,


    totalRevenue:

      sales.reduce(

        (sum, item) =>

          sum +

          item.expectedRevenue,

        0

      ),


    totalProfit:

      sales.reduce(

        (sum, item) =>

          sum +

          item.expectedProfit,

        0

      )

  }

}