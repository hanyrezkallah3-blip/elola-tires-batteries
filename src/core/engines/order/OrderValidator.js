// src/core/engines/order/OrderValidator.js

export default class OrderValidator {

  static validate(order = {}) {

    const errors = []

    // ===============================
    // CUSTOMER
    // ===============================

    if (!order.customerName?.trim()) {

      errors.push(
        'اسم العميل مطلوب'
      )

    }

    if (!order.phone?.trim()) {

      errors.push(
        'رقم الهاتف مطلوب'
      )

    }

    // ===============================
    // ITEMS
    // ===============================

    if (

      !Array.isArray(order.items) ||

      order.items.length === 0

    ) {

      errors.push(
        'لا توجد منتجات داخل الطلب'
      )

    }

    // ===============================
    // TOTAL
    // ===============================

    const total =
      Number(order.total || 0)

    if (total <= 0) {

      errors.push(
        'إجمالي الطلب غير صحيح'
      )

    }

    // ===============================
    // PRODUCTS
    // ===============================

    if (Array.isArray(order.items)) {

      order.items.forEach(

        (item, index) => {

          if (!item.id) {

            errors.push(

              `المنتج رقم ${index + 1} لا يحتوي على ID`

            )

          }

          if (

            Number(item.quantity || 0) <= 0

          ) {

            errors.push(

              `كمية المنتج رقم ${index + 1} غير صحيحة`

            )

          }

        }

      )

    }

    // ===============================
    // RESULT
    // ===============================

    return {

      valid:

        errors.length === 0,

      errors

    }

  }

}