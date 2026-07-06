// ======================================================
// Elola ERP Enterprise
// Inventory Service
// ======================================================

import BaseService from './BaseService'

class InventoryService extends BaseService {

  getStockItems() {

    return this.getState().stockItems || []

  }

  getItem(itemId) {

    return this.getStockItems().find(

      item => item.id === itemId

    )

  }

  getItemByProduct(productId) {

    return this.getStockItems().find(

      item => item.productId === productId

    )

  }

  getQuantity(productId) {

    const item =

      this.getItemByProduct(productId)

    return Number(

      item?.quantity || 0

    )

  }

  // ================= SET QUANTITY =================

  setQuantity({

    productId,

    quantity

  }) {

    return this.getState()

      .setProductQuantity({

        productId,

        quantity

      })

  }

  // ================= INCREASE =================

  increase(data) {

    return this.getState()

      .increaseStock(data)

  }

  // ================= DECREASE =================

  decrease(data) {

    return this.getState()

      .decreaseStock(data)

  }

  // ================= TRANSFER =================

  transfer(data) {

    return this.getState()

      .transferStock(data)

  }

  // ================= EXISTS =================

  exists(productId) {

    return !!this.getItemByProduct(

      productId

    )

  }

  // ================= CAN SELL =================

  canSell({

    productId,

    quantity

  }) {

    return (

      this.getQuantity(productId)

      >=

      Number(quantity)

    )

  }

  // ================= HAS STOCK =================

  hasStock(productId) {

    return this.getQuantity(

      productId

    ) > 0

  }

}

export default InventoryService