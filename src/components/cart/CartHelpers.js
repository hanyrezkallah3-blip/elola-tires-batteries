// ======================================================
// Elola ERP Enterprise
// Cart Helpers
// ======================================================

export function getItemPrice(item) {

  return Number(

    String(

      item?.price || ''

    ).replace(/[^\d]/g, '')

  )

}

// ======================================================

export function getItemQuantity(item) {

  return Number(

    item?.quantity || 1

  )

}

// ======================================================

export function calculateItemTotal(item) {

  return (

    getItemPrice(item) *

    getItemQuantity(item)

  )

}

// ======================================================

export function calculateCartTotal(cart = []) {

  return cart.reduce(

    (total, item) =>

      total +

      calculateItemTotal(item),

    0

  )

}

// ======================================================

export function findStockItem(

  stockItems = [],

  item

) {

  return stockItems.find(

    stock =>

      String(

        stock.productId

      ) ===

      String(

        item.id

      )

      ||

      String(

        stock.productId

      ) ===

      String(

        item.productId

      )

  )

}