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

}

export default InventoryService