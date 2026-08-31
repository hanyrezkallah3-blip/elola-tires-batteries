// ======================================================
// Elola ERP Enterprise
// Stock Engine
// ======================================================

import InventoryService
  from '../services/InventoryService'

import {
  useWebsiteStore
} from '../../store/websiteStore'


const inventoryService =
  new InventoryService()


export const StockEngine = {

  // ====================================================
  // SET QUANTITY
  // ====================================================

  setQuantity({

    productId,

    warehouseId = null,

    quantity

  }) {

    const success =

      inventoryService.setQuantity({

        productId,

        warehouseId,

        quantity

      })


    if (!success) {

      return false

    }


    // --------------------------------------------------
    // Keep website product stock synchronized only for
    // legacy product-level stock updates.
    // Warehouse-specific stock remains controlled by
    // inventoryStore.
    // --------------------------------------------------

    if (
      warehouseId === null ||
      warehouseId === undefined ||
      warehouseId === ''
    ) {

      useWebsiteStore

        .getState()

        .updateProduct(

          productId,

          {

            stock:
              Number(quantity || 0)

          }

        )

    }


    return true

  },


  // ====================================================
  // INCREASE
  // ====================================================

  increase(data) {

    return inventoryService

      .increase(data)

  },


  // ====================================================
  // DECREASE
  // ====================================================

  decrease(data) {

    return inventoryService

      .decrease(data)

  },


  // ====================================================
  // TRANSFER
  // ====================================================

  transfer(data) {

    return inventoryService

      .transfer(data)

  },


  // ====================================================
  // GET QUANTITY
  // ====================================================

  getQuantity(

    productId,

    warehouseId = null

  ) {

    return inventoryService

      .getQuantity(

        productId,

        warehouseId

      )

  },


  // ====================================================
  // GET ITEM
  // ====================================================

  getItem(

    productId,

    warehouseId = null

  ) {

    return inventoryService

      .getItemByProduct(

        productId,

        warehouseId

      )

  },


  // ====================================================
  // EXISTS
  // ====================================================

  exists(

    productId,

    warehouseId = null

  ) {

    return inventoryService

      .exists(

        productId,

        warehouseId

      )

  },


  // ====================================================
  // HAS STOCK
  // ====================================================

  hasStock(

    productId,

    warehouseId = null

  ) {

    return inventoryService

      .hasStock(

        productId,

        warehouseId

      )

  },


  // ====================================================
  // CAN SELL
  // ====================================================

  canSell({

    productId,

    warehouseId = null,

    quantity

  }) {

    return inventoryService

      .canSell({

        productId,

        warehouseId,

        quantity

      })

  },


  // ====================================================
  // VALIDATE SALE
  // ====================================================

  validateSale({

    productId,

    warehouseId = null,

    quantity

  }) {

    if (
      !productId
    ) {

      return {

        success: false,

        message:
          'معرف المنتج غير موجود'

      }

    }


    // --------------------------------------------------
    // PRODUCT + WAREHOUSE
    // --------------------------------------------------

    if (
      !inventoryService.exists(

        productId,

        warehouseId

      )
    ) {

      return {

        success: false,

        message:

          warehouseId

            ? 'المنتج غير موجود في هذا المخزن'

            : 'المنتج غير موجود'

      }

    }


    // --------------------------------------------------
    // AVAILABLE STOCK
    // --------------------------------------------------

    const available =

      inventoryService.getQuantity(

        productId,

        warehouseId

      )


    // --------------------------------------------------
    // VALIDATE QUANTITY
    // --------------------------------------------------

    if (

      Number(quantity || 0) <= 0

    ) {

      return {

        success: false,

        message:
          'الكمية المطلوبة غير صحيحة'

      }

    }


    if (

      available <
      Number(quantity)

    ) {

      return {

        success: false,

        message:

          `الكمية غير متوفرة. المتاح: ${available}`

      }

    }


    return {

      success: true,

      available

    }

  }

}