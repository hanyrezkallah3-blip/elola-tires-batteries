import generateWarehouseId from './generateWarehouseId'

export default function createWarehouseExpense(

  expense = {}

) {

  return {

    id:

      expense.id ||

      generateWarehouseId(),


    warehouseId:

      expense.warehouseId || '',


    type:

      expense.type || 'other',


    title:

      expense.title || '',


    description:

      expense.description || '',


    amount:

      Number(

        expense.amount || 0

      ),


    currency:

      expense.currency || 'EGP',


    category:

      expense.category || '',


    date:

      expense.date ||

      new Date().toISOString(),


    createdBy:

      expense.createdBy || '',


    createdAt:

      new Date().toISOString()

  }

}