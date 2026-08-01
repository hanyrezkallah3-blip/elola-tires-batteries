export default function getInactiveWarehouses(

  warehouses = []

) {

  return warehouses.filter(

    warehouse =>

      warehouse.active === false

  )

}