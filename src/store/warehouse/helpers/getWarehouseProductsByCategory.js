export default function getWarehouseProductsByCategory(

  warehouse = {},

  category = ''

) {

  const value =

    String(category)

      .trim()

      .toLowerCase()

  return (

    warehouse.products || []

  ).filter(

    product =>

      String(

        product.category || ''

      )

        .toLowerCase()

        === value

  )

}