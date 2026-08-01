export default function getWarehouseProductBySerial(

  warehouse = {},

  serial = ''

) {

  const value =

    String(serial)

      .trim()


  return (

    warehouse.products || []

  ).find(

    product =>

      (product.serialNumbers || [])

        .includes(value)

  ) || null

}