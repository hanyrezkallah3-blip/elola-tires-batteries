import getWarehouseDashboardData

  from './getWarehouseDashboardData'


export default function getAllWarehouseDashboardData(

  warehouses = []

) {

  return warehouses.map(

    warehouse =>

      getWarehouseDashboardData(

        warehouse

      )

  )

}