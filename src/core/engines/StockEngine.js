import InventoryService from '../services/InventoryService'
import { useWebsiteStore } from '../../store/websiteStore'

const inventoryService = new InventoryService()

export const StockEngine = {

  // ================= SET QUANTITY =================

  setQuantity({

    productId,

    quantity

  }) {

    const success =

      inventoryService.setQuantity({

        productId,

        quantity

      })

    if (!success)

      return false

    useWebsiteStore

      .getState()

      .updateProduct(

        productId,

        {

          stock: quantity

        }

      )

    return true

  },

  // ================= INCREASE =================

  increase(data) {

    return inventoryService

      .increase(data)

  },

  // ================= DECREASE =================

  decrease(data) {

    return inventoryService

      .decrease(data)

  },

  // ================= TRANSFER =================

  transfer(data) {

    return inventoryService

      .transfer(data)

  },

  // ================= GET QUANTITY =================

  getQuantity(productId) {

    return inventoryService

      .getQuantity(productId)

  },

  // ================= GET ITEM =================

  getItem(productId) {

    return inventoryService

      .getItemByProduct(productId)

  },

  // ================= EXISTS =================

  exists(productId) {

    return inventoryService

      .exists(productId)

  },

  // ================= HAS STOCK =================

  hasStock(productId) {

    return inventoryService

      .hasStock(productId)

  },

  // ================= CAN SELL =================

  canSell({

    productId,

    quantity

  }) {

    return inventoryService

      .canSell({

        productId,

        quantity

      })

  },

  // ================= VALIDATE SALE =================

  validateSale({

    productId,

    quantity

  }) {

    if (!this.exists(productId)) {

      return {

        success: false,

        message: 'المنتج غير موجود'

      }

    }

    if (

      !this.canSell({

        productId,

        quantity

      })

    ) {

      return {

        success: false,

        message: 'الكمية غير متوفرة'

      }

    }

    return {

      success: true

    }

  }

}