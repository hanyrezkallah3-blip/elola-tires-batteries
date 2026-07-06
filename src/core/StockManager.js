import { useInventoryStore } from '../store/inventoryStore'
import { useWebsiteStore } from '../store/websiteStore'

export const StockManager = {

  // ================= SET QUANTITY =================

  setQuantity(productId, quantity) {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const success =
      inventory.setProductQuantity({

        productId,

        quantity

      })

    if (!success) {

      console.warn(

        '[StockManager] Product not linked to inventory:',

        productId

      )

      return false

    }

    website.updateProduct(

      productId,

      {

        stock: quantity

      }

    )

    return true

  },

  // ================= INCREASE =================

  increase(data) {

    return useInventoryStore
      .getState()
      .increaseStock(data)

  },

  // ================= DECREASE =================

  decrease(data) {

    return useInventoryStore
      .getState()
      .decreaseStock(data)

  },

  // ================= TRANSFER =================

  transfer(data) {

    return useInventoryStore
      .getState()
      .transferStock(data)

  }

}