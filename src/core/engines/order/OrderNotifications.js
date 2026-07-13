// src/core/engines/order/OrderNotifications.js

export default class OrderNotifications {

  // ==================================================
  // NEW ORDER
  // ==================================================

  static onCreated(order = {}) {

    return [

      {

        type: 'order',

        level: 'success',

        title: 'طلب جديد',

        message:

          `تم إنشاء طلب جديد للعميل ${order.customerName}`,

        createdAt:

          new Date().toISOString()

      }

    ]

  }

  // ==================================================
  // ORDER UPDATED
  // ==================================================

  static onUpdated(order = {}) {

    return [

      {

        type: 'order',

        level: 'info',

        title: 'تحديث الطلب',

        message:

          `تم تحديث الطلب ${order.id}`,

        createdAt:

          new Date().toISOString()

      }

    ]

  }

  // ==================================================
  // ORDER DELETED
  // ==================================================

  static onDeleted(order = {}) {

    return [

      {

        type: 'order',

        level: 'warning',

        title: 'حذف الطلب',

        message:

          `تم حذف الطلب ${order.id}`,

        createdAt:

          new Date().toISOString()

      }

    ]

  }

  // ==================================================
  // ORDER DELIVERED
  // ==================================================

  static onDelivered(order = {}) {

    return [

      {

        type: 'order',

        level: 'success',

        title: 'تسليم الطلب',

        message:

          `تم تسليم الطلب للعميل ${order.customerName}`,

        createdAt:

          new Date().toISOString()

      }

    ]

  }

  // ==================================================
  // LOW STOCK
  // ==================================================

  static lowStock(product = {}) {

    return {

      type: 'inventory',

      level: 'warning',

      title: 'انخفاض المخزون',

      message:

        `المنتج ${product.name} أوشك على النفاد`,

      createdAt:

        new Date().toISOString()

    }

  }

}