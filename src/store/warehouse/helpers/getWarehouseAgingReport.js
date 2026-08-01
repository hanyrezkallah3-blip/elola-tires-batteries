export default function getWarehouseAgingReport(

  warehouse = {}

) {

  const today =

    new Date()

  return (

    warehouse.products || []

  ).map(

    product => {

      const createdAt =

        new Date(

          product.createdAt ||

          today

        )

      const ageInDays =

        Math.floor(

          (

            today -

            createdAt

          ) /

          86400000

        )

      return {

        productId:

          product.productId,

        productName:

          product.productName,

        quantity:

          Number(

            product.quantity || 0

          ),

        createdAt:

          product.createdAt,

        ageInDays

      }

    }

  )

}