export default function findWarehouseByManager(

  warehouses = [],

  manager = ''

) {

  const value =

    String(manager)

      .trim()

      .toLowerCase()

  return (

    warehouses.find(

      warehouse =>

        String(

          warehouse.manager || ''

        )

          .toLowerCase()

          === value

    ) || null

  )

}