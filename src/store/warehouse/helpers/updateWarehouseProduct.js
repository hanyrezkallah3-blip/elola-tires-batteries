export default function updateWarehouseProduct(

  warehouses = [],

  warehouseId,

  productId,

  data = {}

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

            .map(product => {

              if (!product) {

                return product

              }

              return product.productId === productId

                ? {

                    ...product,

                    ...data,

                    updatedAt:

                      new Date()

                        .toISOString()

                  }

                : product

            )

      }

    }

  )

}