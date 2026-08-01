import getWarehouseInventoryValue

  from './getWarehouseInventoryValue'

import getWarehouseExpenseSummary

  from './getWarehouseExpenseSummary'


export default function getWarehouseFinancialSummary(

  warehouse = {}

) {

  const inventoryValue =

    getWarehouseInventoryValue(

      warehouse

    )


  const expenses =

    getWarehouseExpenseSummary(

      warehouse

    )


  return {

    inventoryValue,


    totalExpenses:

      expenses.total,


    netValue:

      inventoryValue -

      expenses.total

  }

}