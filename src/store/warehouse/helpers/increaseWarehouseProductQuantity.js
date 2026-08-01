export default function increaseWarehouseProductQuantity(

  warehouses = [],

  warehouseId,

  productId,

  quantity = 0

) {

  const value = Number(quantity || 0)

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

          (warehouse.products || []).map(

            product =>

              product.productId === productId

                ? {

                    ...product,

                    quantity:

                      Number(product.quantity || 0) +

                      value,

                    updatedAt:

                      new Date().toISOString()

                  }

                : product

          )

      }

    }

  )

}