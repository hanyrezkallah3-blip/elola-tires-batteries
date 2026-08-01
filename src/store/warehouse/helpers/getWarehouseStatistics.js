export default function getWarehouseStatistics(

  warehouse = {}

) {

  const products =

    warehouse.products || []

  const totalProducts =

    products.length

  const totalQuantity =

    products.reduce(

      (sum, product) =>

        sum +

        Number(product.quantity || 0),

      0

    )

  const totalPurchaseValue =

    products.reduce(

      (sum, product) =>

        sum +

        Number(product.quantity || 0) *

        Number(product.purchasePrice || 0),

      0

    )

  const totalSaleValue =

    products.reduce(

      (sum, product) =>

        sum +

        Number(product.quantity || 0) *

        Number(product.salePrice || 0),

      0

    )

  const lowStock =

    products.filter(

      product =>

        Number(product.quantity || 0)

        <=

        Number(

          product.minimumStock || 0

        )

    ).length

  return {

    totalProducts,

    totalQuantity,

    totalPurchaseValue,

    totalSaleValue,

    lowStock

  }

}