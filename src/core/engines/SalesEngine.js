// ======================================================
// Elola ERP Enterprise
// Sales Engine
// ======================================================

import BaseEngine from './BaseEngine'
import OrdersRepository from '../../repositories/OrdersRepository'

class SalesEngine extends BaseEngine {

  // ======================================================
  // CREATE ORDER
  // ======================================================

  async createOrder({

    order,

    validateStock,

    decreaseStock,

    addCashback,

    onSuccess,

    onError

  }) {

    return this.execute(

      async () => {

        if (!order) {

          return this.failure(

            'بيانات الطلب غير موجودة'

          )

        }

        // ================= VALIDATE STOCK =================

        if (validateStock) {

          const validation =

            await validateStock(order)

          if (

            validation?.success === false

          ) {

            return validation

          }

        }

        // ================= SAVE ORDER =================

        const saveResult =

          await OrdersRepository.create(

            order

          )

        if (

          !saveResult.success

        ) {

          if (onError)

            await onError(

              saveResult

            )

          return saveResult

        }

        // ================= UPDATE STOCK =================

        if (decreaseStock) {

          await decreaseStock(

            order

          )

        }

        // ================= CASHBACK =================

        if (addCashback) {

          await addCashback(

            order

          )

        }

        // ================= SUCCESS CALLBACK =================

        if (onSuccess) {

          await onSuccess(

            saveResult

          )

        }

        return this.success(

          {

            orderId:

              saveResult.data.id,

            order:

              saveResult.data.order

          },

          'تم إنشاء الطلب بنجاح'

        )

      }

    )

  }

  // ======================================================
  // CANCEL ORDER
  // ======================================================

  async cancelOrder({

    orderId

  }) {

    return await OrdersRepository.delete(

      orderId

    )

  }

  // ======================================================
  // GET ORDERS
  // ======================================================

  async getOrders() {

    return await OrdersRepository.getAll()

  }

  // ======================================================
  // GET ORDER
  // ======================================================

  async getOrder(

    orderId

  ) {

    return await OrdersRepository.getById(

      orderId

    )

  }

}

export default new SalesEngine()