import { useMemo } from 'react'

export default function useProductsStats({

  products,

  stockItems

}) {

  return useMemo(() => ({

    totalStock:

      stockItems.reduce(

        (sum, item) =>

          sum +

          Number(item.quantity || 0),

        0

      ),

    totalSold:

      stockItems.reduce(

        (sum, item) =>

          sum +

          Number(item.sold || 0),

        0

      ),

    hiddenProducts:

      products.filter(

        product => product.hidden

      ).length,

    lowStockProducts:

      products.filter(

        product =>

          Number(product.stock || 0) <= 5

      ),

    totalProducts:

      products.length

  }), [

    products,

    stockItems

  ])

}