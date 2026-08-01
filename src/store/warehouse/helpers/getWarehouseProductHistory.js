export default function getWarehouseProductHistory(

  warehouse = {},

  productId

) {

  const transactions =

    warehouse.transactions || []


  return transactions.filter(

    item =>

      item.productId === productId

  )

}