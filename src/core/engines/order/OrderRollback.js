// src/core/engines/order/OrderRollback.js

import OrderInventory from './OrderInventory'

import { useWalletStore } from '../../../store/walletStore'

import { useOrderStore } from '../../../store/orderStore'

export default class OrderRollback {

  // ==================================================
  // ROLLBACK ORDER
  // ==================================================

  static rollback({

    order = null,

    cashback = 0,

    reason = 'Rollback'

  } = {}) {

    try {

      // ==========================================
      // RESTORE INVENTORY
      // ==========================================

      if (order) {

        OrderInventory.restore(order)

      }

      // ==========================================
      // RESTORE WALLET
      // ==========================================

      if (

        cashback > 0 &&

        order?.phone

      ) {

        const walletStore =

          useWalletStore.getState()

        walletStore.deductWalletBalance({

          phone: order.phone,

          amount: cashback,

          reason

        })

      }

      // ==========================================
      // DELETE ORDER
      // ==========================================

      if (order?.id) {

        const orderStore =

          useOrderStore.getState()

        orderStore.deleteOrder(

          order.id

        )

      }

      return {

        success: true

      }

    }

    catch (error) {

      console.error(

        'Order Rollback Error:',

        error

      )

      return {

        success: false,

        error

      }

    }

  }

}