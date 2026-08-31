// ======================================================
// Elola ERP Enterprise
// Cart Stock
// ======================================================

import { StockEngine }
  from '../../core'

import {
  findStockItem
} from './CartHelpers'


// ======================================================
// VALIDATE STOCK
// ======================================================

export function validateStock(

  cart = []

) {

  for (const item of cart) {

    const productId =

      item?.productId ||

      item?.sourceProductId ||

      item?.id


    const warehouseId =

      item?.warehouseId ||


      item?.sourceWarehouseId ||


      item?.warehouse?.id ||


      null


    const quantity =

      Number(

        item?.quantity || 1

      )


    // --------------------------------------------------
    // IMPORTANT
    //
    // Offers must use the ORIGINAL warehouse product.
    // The offer ID must NEVER be used as the inventory
    // product ID when productId already exists.
    // --------------------------------------------------

    const result =

      StockEngine.validateSale({

        productId,

        warehouseId,

        quantity

      })


    if (!result.success) {

      return {

        success: false,

        message:

          `${item?.name || 'المنتج'}\n${result.message}`

      }

    }

  }


  return {

    success: true

  }

}


// ======================================================
// UPDATE INVENTORY
// ======================================================

export function updateInventory({

  cart = [],

  stockItems = [],

  decreaseStock,

  updateStockItem,

  customerName

}) {

  for (const cartItem of cart) {

    // --------------------------------------------------
    // Find the EXACT stock record.
    //
    // The warehouseId is important for offers because
    // the same product may exist in multiple warehouses.
    // --------------------------------------------------

    const stockItem =

      findStockItem(

        stockItems,

        cartItem

      )


    if (!stockItem) {

      continue

    }


    const quantity =

      Number(

        cartItem?.quantity || 1

      )


    if (
      quantity <= 0
    ) {

      continue

    }


    // --------------------------------------------------
    // Safety check
    //
    // Never allow the inventory quantity to become
    // negative.
    // --------------------------------------------------

    const available =

      Number(

        stockItem.quantity || 0

      )


    if (
      quantity > available
    ) {

      continue

    }


    // --------------------------------------------------
    // DECREASE REAL WAREHOUSE STOCK
    // --------------------------------------------------

    decreaseStock({

      itemId:

        stockItem.id,

      quantity,

      note:

        `بيع - الطلب ${customerName || ''}`

    })


    // --------------------------------------------------
    // UPDATE SOLD COUNT
    // --------------------------------------------------

    updateStockItem(

      stockItem.id,

      {

        sold:

          Number(

            stockItem.sold || 0

          ) +

          quantity

      }

    )

  }

}
