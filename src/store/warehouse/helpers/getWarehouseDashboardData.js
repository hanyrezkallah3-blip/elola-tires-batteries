import getWarehouseStatistics

  from './getWarehouseStatistics'

import getWarehouseExpenseSummary

  from './getWarehouseExpenseSummary'

import getWarehouseMovementSummary

  from './getWarehouseMovementSummary'

import getWarehouseInventoryValue

  from './getWarehouseInventoryValue'


export default function getWarehouseDashboardData(

  warehouse = {}

) {

  return {

    warehouseId:

      warehouse.id,


    warehouseName:

      warehouse.name,


    statistics:

      getWarehouseStatistics(

        warehouse

      ),


    inventoryValue:

      getWarehouseInventoryValue(

        warehouse

      ),


    expenses:

      getWarehouseExpenseSummary(

        warehouse

      ),


    movements:

      getWarehouseMovementSummary(

        warehouse

      )

  }

}