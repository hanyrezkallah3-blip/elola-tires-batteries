// src/core/engines/order/OrderInventory.js

import { useInventoryStore } from '../../../store/inventoryStore'

export default class OrderInventory {

  // ==========================================
  // DECREASE STOCK
  // ==========================================

  static decrease(order = {}) {

    const inventory =
      useInventoryStore.getState()

    if (
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      return
    }

    order.items.forEach(item => {

      const quantity =
        Number(item.quantity || 0)

      if (quantity <= 0)
        return

      inventory.decreaseStock(

        item.id,

        quantity

      )

    })

  }

  // ==========================================
  // RESTORE STOCK
  // ==========================================

  static restore(order = {}) {

    const inventory =
      useInventoryStore.getState()

    if (
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      return
    }

    order.items.forEach(item => {

      const quantity =
        Number(item.quantity || 0)

      if (quantity <= 0)
        return

      inventory.increaseStock(

        item.id,

        quantity

      )

    })

  }

  // ==========================================
  // VALIDATE STOCK
  // ==========================================

  static validate(order = {}) {

    const inventory =
      useInventoryStore.getState()

    if (
      !Array.isArray(order.items)
    ) {

      return {

        valid: false,

        errors: [

          'لا توجد منتجات داخل الطلب'

        ]

      }

    }

    const errors = []

    order.items.forEach(item => {

      const product =

        inventory.stockItems.find(

          stock =>

            stock.id === item.id

        )

      if (!product) {

        errors.push(

          `المنتج ${item.name || item.id} غير موجود بالمخزون`

        )

        return

      }

      if (

        Number(product.quantity || 0) <

        Number(item.quantity || 0)

      ) {

        errors.push(

          `الكمية غير كافية للمنتج ${item.name}`

        )

      }

    })

    return {

      valid:

        errors.length === 0,

      errors

    }

  }

}