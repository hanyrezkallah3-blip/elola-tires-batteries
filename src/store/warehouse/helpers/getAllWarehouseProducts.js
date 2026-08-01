export default function getAllWarehouseProducts(

  warehouses = []

) {

  return warehouses.flatMap(

    warehouse =>

      (warehouse.products || []).map(

        product => ({

          ...product,

          warehouseId:

            warehouse.id,

          warehouseName:

            warehouse.name

        })

      )

  )

}