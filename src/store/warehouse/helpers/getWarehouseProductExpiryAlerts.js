export default function getWarehouseProductExpiryAlerts(

  warehouse = {},

  days = 30

) {

  const products =

    warehouse.products || []


  const today =

    new Date()


  const limitDate =

    new Date()


  limitDate.setDate(

    today.getDate() + days

  )


  return products.filter(

    product => {

      if (!product.expiryDate)

        return false


      const expiry =

        new Date(

          product.expiryDate

        )


      return (

        expiry >= today &&

        expiry <= limitDate

      )

    }

  )

}