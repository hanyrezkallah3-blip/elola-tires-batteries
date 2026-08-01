export default function getWarehouseProductCount(

  warehouse = {}

) {

  return (

    warehouse.products || []

  ).length

}