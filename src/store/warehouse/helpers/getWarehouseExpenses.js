export default function getWarehouseExpenses(

  warehouse = {}

) {

  return (

    warehouse.expenses || []

  )

}