import getWarehouseStatistics

  from './getWarehouseStatistics'

export default function getGlobalWarehouseStatistics(

  warehouses = []

) {

  const summary = {

    totalWarehouses: warehouses.length,

    totalProducts: 0,

    totalQuantity: 0,

    totalPurchaseValue: 0,

    totalSaleValue: 0,

    lowStock: 0

  }

  warehouses.forEach(

    warehouse => {

      const stats =

        getWarehouseStatistics(

          warehouse

        )

      summary.totalProducts +=

        stats.totalProducts

      summary.totalQuantity +=

        stats.totalQuantity

      summary.totalPurchaseValue +=

        stats.totalPurchaseValue

      summary.totalSaleValue +=

        stats.totalSaleValue

      summary.lowStock +=

        stats.lowStock

    }

  )

  return summary

}