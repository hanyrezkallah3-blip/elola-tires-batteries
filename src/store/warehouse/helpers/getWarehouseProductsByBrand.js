export default function getWarehouseProductsByBrand(

  warehouse = {},

  brand = ''

) {

  const value =

    String(brand)

      .trim()

      .toLowerCase()

  return (

    warehouse.products || []

  ).filter(

    product =>

      String(

        product.brand || ''

      )

        .toLowerCase()

        === value

  )

}