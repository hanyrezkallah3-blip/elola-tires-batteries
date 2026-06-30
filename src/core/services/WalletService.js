// ======================================================
// Elola ERP Enterprise
// Wallet Service
// ======================================================

import BaseService from './BaseService'

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

}

export default WalletService