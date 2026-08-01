export default function removeWarehouseProduct(

  warehouses = [],

  warehouseId,

  productId

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

        products:

          (warehouse.products || [])

            .filter(

              product =>

                product.productId !== productId

            )

      }

    }

  )

}