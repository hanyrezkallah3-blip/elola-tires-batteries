export default function getWarehouseProfitability(

  warehouse = {}

) {

  const products =

    warehouse.products || []


  const expenses =

    warehouse.expenses || []


  const salesValue =

    products.reduce(

      (sum, product) =>

        sum +

        (

          Number(product.quantity || 0) *

          Number(product.salePrice || 0)

        ),

      0

    )


  const costValue =

    products.reduce(

      (sum, product) =>

        sum +

        (

          Number(product.quantity || 0) *

          Number(product.realCost || 0)

        ),

      0

    )


  const expensesValue =

    expenses.reduce(

      (sum, expense) =>

        sum +

        Number(expense.amount || 0),

      0

    )


  return {

    salesValue,

    costValue,

    expensesValue,


    expectedProfit:

      salesValue -

      costValue -

      expensesValue

  }

}