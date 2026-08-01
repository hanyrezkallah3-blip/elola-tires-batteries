export default function findWarehouseByName(

  warehouses = [],

  warehouseName = ''

) {

  const value =

    String(warehouseName)

      .trim()

      .toLowerCase()

  return (

    warehouses.find(

      warehouse =>

        String(

          warehouse.name || ''

        )

          .toLowerCase()

          === value

    ) || null

  )

}