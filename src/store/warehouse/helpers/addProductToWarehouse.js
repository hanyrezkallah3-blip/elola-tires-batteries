import createWarehouseProduct from './createWarehouseProduct'

export default function addProductToWarehouse(

  warehouses = [],

  warehouseId,

  product

) {

  if (!product || !product.productId) {

    return warehouses

  }

  return warehouses.map(

    warehouse => {

      if (

        warehouse.id !== warehouseId

      ) {

        return warehouse

      }

      const exists =

        (warehouse.products || [])

          .some(

            item =>

              item.productId ===

              product.productId

          )

      if (exists) {

        return warehouse

      }

      return {

        ...warehouse,

        products: [

          ...(warehouse.products || []),

          createWarehouseProduct(

            product

          )

        ]

      }

    }

  )

}