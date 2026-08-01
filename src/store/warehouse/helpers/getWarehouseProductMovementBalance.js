export default function getWarehouseProductMovementBalance(

  warehouse = {},

  productId

) {

  const transactions =

    warehouse.transactions || []


  const incoming =

    transactions

      .filter(

        item =>

          item.productId === productId &&

          item.type === 'in'

      )

      .reduce(

        (sum, item) =>

          sum +

          Number(

            item.quantity || 0

          ),

        0

      )


  const outgoing =

    transactions

      .filter(

        item =>

          item.productId === productId &&

          item.type === 'out'

      )

      .reduce(

        (sum, item) =>

          sum +

          Number(

            item.quantity || 0

          ),

        0

      )


  return {

    incoming,

    outgoing,

    balance:

      incoming -

      outgoing

  }

}