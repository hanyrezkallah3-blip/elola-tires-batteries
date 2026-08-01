export default function getWarehouseProductByBarcode(

  warehouse = {},

  barcode = ''

) {

  const value =

    String(barcode)

      .trim()


  return (

    warehouse.products || []

  ).find(

    product =>

      String(

        product.barcode || ''

      )

        === value

  ) || null

}