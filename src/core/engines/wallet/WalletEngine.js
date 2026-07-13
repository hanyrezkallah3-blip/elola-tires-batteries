import WalletRepository from '../../../repositories/WalletRepository'

class WalletEngine {

  calculateCashback(order, percentage = 0) {

    const total =
      Number(order?.total || 0)

    return (
      total *
      (Number(percentage || 0) / 100)
    )

  }

  async ensureWallet(order) {

    const customerId =
      order.customerId ||
      order.phone

    let wallet =
      await WalletRepository.findByCustomerId(
        customerId
      )

    if (wallet)
      return wallet

    return await WalletRepository.createIfNotExists({

      customerId,

      customerName:
        order.customerName,

      phone:
        order.phone,

      balance: 0,

      totalCashback: 0,

      createdAt:
        new Date().toISOString()

    })

  }

  async applyCashback(
    order,
    percentage = 0
  ) {

    const wallet =
      await this.ensureWallet(order)

    if (!wallet)
      return 0

    const cashback =
      this.calculateCashback(
        order,
        percentage
      )

    if (cashback <= 0)
      return 0

    await WalletRepository.addBalance(

      wallet.customerId,

      cashback

    )

    return cashback

  }

  async deductCashback(
    order,
    percentage = 0
  ) {

    const customerId =
      order.customerId ||
      order.phone

    const cashback =
      this.calculateCashback(
        order,
        percentage
      )

    if (cashback <= 0)
      return 0

    await WalletRepository.deductBalance(

      customerId,

      cashback

    )

    return cashback

  }

}

export default new WalletEngine()