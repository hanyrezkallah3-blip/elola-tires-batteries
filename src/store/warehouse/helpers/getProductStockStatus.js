export default function getProductStockStatus(

  product = {}

) {

  const quantity =

    Number(product.quantity || 0)

  const minimumStock =

    Number(product.minimumStock || 0)

  const maximumStock =

    Number(product.maximumStock || 0)

  if (quantity <= 0) {

    return 'OUT_OF_STOCK'

  }

  if (quantity <= minimumStock) {

    return 'LOW_STOCK'

  }

  if (

    maximumStock > 0 &&

    quantity >= maximumStock

  ) {

    return 'OVER_STOCK'

  }

  return 'AVAILABLE'

}