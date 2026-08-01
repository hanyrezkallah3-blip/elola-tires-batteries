import getLowStockProducts

  from './getLowStockProducts'


import getOutOfStockProducts

  from './getOutOfStockProducts'


export default function getWarehouseAlerts(

  warehouse = {}

) {

  const warehouses = [

    warehouse

  ]


  return {

    lowStock:

      getLowStockProducts(

        warehouses

      ),


    outOfStock:

      getOutOfStockProducts(

        warehouses

      ),


    count:

      getLowStockProducts(

        warehouses

      ).length +

      getOutOfStockProducts(

        warehouses

      ).length

  }

}