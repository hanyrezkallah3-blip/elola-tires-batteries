export default function findWarehouseById(

  warehouses = [],

  warehouseId

) {

  return (

    warehouses.find(

      warehouse =>

        warehouse.id === warehouseId

    ) || null

  )

}