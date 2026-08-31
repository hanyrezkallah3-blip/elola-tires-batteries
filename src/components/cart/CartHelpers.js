// ======================================================
// Elola ERP Enterprise
// Cart Helpers
// ======================================================


// ======================================================
// PRICE
// ======================================================

export function getItemPrice(item) {

  const value =

    item?.offerPrice ??

    item?.salePrice ??

    item?.price ??

    0


  return Number(

    String(value)

      .replace(/[^\d.-]/g, '')

  )

}


// ======================================================
// QUANTITY
// ======================================================

export function getItemQuantity(item) {

  return Number(

    item?.quantity || 1

  )

}


// ======================================================
// ITEM TOTAL
// ======================================================

export function calculateItemTotal(item) {

  return (

    getItemPrice(item) *

    getItemQuantity(item)

  )

}


// ======================================================
// CART TOTAL
// ======================================================

export function calculateCartTotal(

  cart = []

) {

  return cart.reduce(

    (total, item) =>

      total +

      calculateItemTotal(item),

    0

  )

}


// ======================================================
// FIND STOCK ITEM
//
// PRIMARY KEY:
// productId + warehouseId
//
// This is critical for offers.
// An offer is NOT a warehouse product itself.
// It points to the original warehouse product.
// ======================================================

export function findStockItem(

  stockItems = [],

  item

) {

  if (
    !Array.isArray(stockItems) ||
    !item
  ) {

    return null

  }


  const productId =

    item?.productId ||

    item?.sourceProductId ||


    item?.id


  const warehouseId =

    item?.warehouseId ||


    item?.sourceWarehouseId ||


    item?.warehouse?.id ||


    null


  // --------------------------------------------------
  // EXACT PRODUCT + WAREHOUSE
  // --------------------------------------------------

  if (
    productId &&
    warehouseId
  ) {

    const exact =

      stockItems.find(

        stock =>

          String(

            stock?.productId ?? ''

          ) ===

          String(productId) &&

          String(

            stock?.warehouseId ?? ''

          ) ===

          String(warehouseId)

      )


    if (exact) {

      return exact

    }

  }


  // --------------------------------------------------
  // PRODUCT ONLY FALLBACK
  //
  // Used only for legacy cart items that have no
  // warehouse information.
  // --------------------------------------------------

  if (productId) {

    return (

      stockItems.find(

        stock =>

          String(

            stock?.productId ?? ''

          ) ===

          String(productId)

      ) ||

      null

    )

  }


  return null

}