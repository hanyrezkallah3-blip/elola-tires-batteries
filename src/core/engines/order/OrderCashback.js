// src/core/engines/order/OrderCashback.js

import { useWalletStore } from '../../../store/walletStore'

export default class OrderCashback {

  static apply(order = {}) {

    const walletStore =
      useWalletStore.getState()

    if (!walletStore.walletEnabled) {

      return {

        cashback: 0,

        walletCreated: false

      }

    }

    const rate =

      Number(
        walletStore.cashbackPercentage || 0
      ) / 100

    if (rate <= 0) {

      return {

        cashback: 0,

        walletCreated: false

      }

    }

    const cashback =

      Number(order.total || 0) * rate

    if (cashback <= 0) {

      return {

        cashback: 0,

        walletCreated: false

      }

    }

    const existed =

      !!walletStore.getWallet(
        order.phone
      )

    walletStore.addWalletBalance({

      phone: order.phone,

      customerName:
        order.customerName,

      amount: cashback,

      reason:
        'كاش باك من عملية شراء'

    })

    return {

      cashback,

      walletCreated: !existed

    }

  }

}