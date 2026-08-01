export default function getWarehouseExpenseSummary(

  warehouse = {}

) {

  const expenses =

    warehouse.expenses || []


  return {

    total:

      expenses.reduce(

        (sum, expense) =>

          sum +

          Number(

            expense.amount || 0

          ),

        0

      ),


    count:

      expenses.length,


    categories:

      expenses.reduce(

        (result, expense) => {

          const category =

            expense.category || 'other'


          result[category] =

            (

              result[category] || 0

            ) +

            Number(

              expense.amount || 0

            )


          return result

        },

        {}

      )

  }

}