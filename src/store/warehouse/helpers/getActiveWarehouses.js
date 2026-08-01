export default function getActiveWarehouses(

  warehouses = []

) {

  return warehouses.filter(

    warehouse =>

      warehouse.active !== false

  )

}