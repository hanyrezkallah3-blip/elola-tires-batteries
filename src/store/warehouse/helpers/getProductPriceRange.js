export default function getProductPriceRange(

  warehouses = [],

  productId

) {

  const prices = []

  warehouses.forEach(

    warehouse => {

      const product =

        (warehouse.products || []).find(

          item =>

            item.productId === productId

        )

      if (product) {

        prices.push(

          Number(

            product.salePrice || 0

          )

        )

      }

    }

  )

  if (!prices.length) {

    return null

  }

  return {

    minPrice:

      Math.min(...prices),

    maxPrice:

      Math.max(...prices),

    averagePrice:

      prices.reduce(

        (a, b) => a + b,

        0

      ) / prices.length

  }

}