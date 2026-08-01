export default function getWarehouseTransferReport(

  warehouse = {}

) {

  const transactions =

    warehouse.transactions || []


  return transactions.filter(

    item =>

      item.type === 'transfer'

  )

}