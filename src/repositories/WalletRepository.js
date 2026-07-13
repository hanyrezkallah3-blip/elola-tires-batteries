import BaseRepository from './BaseRepository'

class WalletRepository extends BaseRepository {

  constructor() {

    super('wallets')

  }

  async findByCustomerId(customerId) {

    const wallets = await this.getAll()

    return (
      wallets.find(
        (wallet) =>
          wallet.customerId === customerId
      ) || null
    )

  }

  async findByPhone(phone) {

    const wallets = await this.getAll()

    return (
      wallets.find(
        (wallet) =>
          wallet.phone === phone
      ) || null
    )

  }

  async createIfNotExists(wallet) {

    const exists =
      await this.findByCustomerId(
        wallet.customerId
      )

    if (exists)
      return exists

    return await this.create(wallet)

  }

  async addBalance(
    customerId,
    amount
  ) {

    const wallet =
      await this.findByCustomerId(
        customerId
      )

    if (!wallet)
      return null

    return await this.update(
      wallet.id,
      {
        balance:
          Number(wallet.balance || 0) +
          Number(amount || 0),

        totalCashback:
          Number(
            wallet.totalCashback || 0
          ) +
          Number(amount || 0)
      }
    )

  }

  async deductBalance(
    customerId,
    amount
  ) {

    const wallet =
      await this.findByCustomerId(
        customerId
      )

    if (!wallet)
      return null

    return await this.update(
      wallet.id,
      {
        balance: Math.max(
          0,
          Number(wallet.balance || 0) -
            Number(amount || 0)
        )
      }
    )

  }

}

export default new WalletRepository()