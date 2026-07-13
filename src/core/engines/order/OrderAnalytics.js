// src/core/engines/order/OrderAnalytics.js

export default class OrderAnalytics {

  // ==================================================
  // BUILD ANALYTICS SNAPSHOT
  // ==================================================

  static build(orders = []) {

    const totalOrders = orders.length

    const totalRevenue = orders.reduce(

      (sum, order) =>

        sum + Number(order.total || 0),

      0

    )

    const totalDiscount = orders.reduce(

      (sum, order) =>

        sum + Number(order.discount || 0),

      0

    )

    const totalShipping = orders.reduce(

      (sum, order) =>

        sum + Number(order.shipping || 0),

      0

    )

    const averageOrderValue =

      totalOrders === 0

        ? 0

        : totalRevenue / totalOrders

    return {

      totalOrders,

      totalRevenue,

      totalDiscount,

      totalShipping,

      averageOrderValue,

      updatedAt:

        new Date().toISOString()

    }

  }

  // ==================================================
  // PRODUCT SALES
  // ==================================================

  static getProductSales(orders = []) {

    const result = {}

    orders.forEach(order => {

      if (!Array.isArray(order.items))
        return

      order.items.forEach(item => {

        const id = item.id

        if (!id)
          return

        if (!result[id]) {

          result[id] = {

            id,

            name:

              item.name || '',

            quantity: 0,

            revenue: 0

          }

        }

        result[id].quantity +=

          Number(item.quantity || 0)

        result[id].revenue +=

          Number(item.total || item.price || 0)

      })

    })

    return Object.values(result)

      .sort(

        (a, b) =>

          b.quantity - a.quantity

      )

  }

  // ==================================================
  // CUSTOMER SALES
  // ==================================================

  static getCustomerSales(orders = []) {

    const customers = {}

    orders.forEach(order => {

      const phone =

        order.phone || 'unknown'

      if (!customers[phone]) {

        customers[phone] = {

          phone,

          customerName:

            order.customerName || '',

          orders: 0,

          total: 0

        }

      }

      customers[phone].orders++

      customers[phone].total +=

        Number(order.total || 0)

    })

    return Object.values(customers)

      .sort(

        (a, b) =>

          b.total - a.total

      )

  }

}