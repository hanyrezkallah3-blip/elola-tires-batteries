// ======================================================
// Elola ERP Enterprise
// Wallet Service
// ======================================================

import BaseService from './BaseService'
import WalletEngine from '../engines/wallet/WalletEngine'

class WalletService extends BaseService {

  getWallets() {

    return this.getState().wallets || []

  }

  getWallet(customerId) {

    return this.getWallets().find(

      wallet =>
        wallet.customerId === customerId

    )

  }

  getBalance(customerId) {

    return Number(

      this.getWallet(customerId)?.balance || 0

    )

  }

  hasWallet(customerId) {

    return !!this.getWallet(customerId)

  }

  createWallet(wallet) {

    return this.dispatch(

      'createWallet',

      wallet

    )

  }

  addBalance(data) {

    return this.dispatch(

      'addWalletBalance',

      data

    )

  }

  deductBalance(data) {

    return this.dispatch(

      'deductWalletBalance',

      data

    )

  }

  deleteWallet(id) {

    return this.dispatch(

      'deleteWallet',

      id

    )

  }

  addTransaction(transaction) {

    return this.dispatch(

      'addWalletTransaction',

      transaction

    )

  }

  async applyCashback(
    order,
    percentage = 0
  ) {

    const cashback =
      await WalletEngine.applyCashback(

        order,

        percentage

      )

    if (cashback <= 0)
      return 0

    this.addTransaction({

      customerId:
        order.customerId || order.phone,

      customerName:
        order.customerName,

      phone:
        order.phone,

      amount:
        cashback,

      type:
        'cashback',

      reason:
        'كاش باك من عملية شراء',

      orderId:
        order.id,

      createdAt:
        new Date().toISOString()

    })

    return cashback

  }

  async deductCashback(
    order,
    percentage = 0
  ) {

    return await WalletEngine.deductCashback(

      order,

      percentage

    )

  }

}

export default new WalletService()