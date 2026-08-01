import createWarehouseExpense

  from './createWarehouseExpense'


export default function addWarehouseExpense(

  warehouses = [],

  warehouseId,

  expense = {}

) {

  return warehouses.map(

    warehouse => {

      if (

        warehouse.id !== warehouseId

      ) {

        return warehouse

      }


      return {

        ...warehouse,


        expenses: [

          ...(warehouse.expenses || []),

          createWarehouseExpense({

            ...expense,

            warehouseId

          })

        ]

      }

    }

  )

}