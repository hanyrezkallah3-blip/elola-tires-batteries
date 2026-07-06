// ======================================================
// Elola ERP Enterprise
// Cart Stock
// ======================================================

import { StockEngine } from '../../core'
import { findStockItem } from './CartHelpers'

// ======================================================

export function validateStock(

  cart = []

) {

  for (const item of cart) {

    const result =

      StockEngine.validateSale({

        productId:

          item.productId ||

          item.id,

        quantity:

          Number(

            item.quantity || 1

          )

      })

    if (!result.success) {

      return {

        success: false,

        message:

          `${item.name}\n${result.message}`

      }

    }

  }

  return {

    success: true

  }

}

// ======================================================

export function updateInventory({

  cart = [],

  stockItems = [],

  decreaseStock,

  updateStockItem,

  customerName

}) {

  for (const cartItem of cart) {

    const stockItem =

      findStockItem(

        stockItems,

        cartItem

      )

    if (!stockItem)

      continue

    decreaseStock({

      itemId:

        stockItem.id,

      quantity:

        Number(

          cartItem.quantity || 1

        ),

      note:

        `بيع - الطلب ${customerName}`

    })

    updateStockItem(

      stockItem.id,

      {

        sold:

          Number(

            stockItem.sold || 0

          ) +

          Number(

            cartItem.quantity || 1

          )

      }

    )

  }

}