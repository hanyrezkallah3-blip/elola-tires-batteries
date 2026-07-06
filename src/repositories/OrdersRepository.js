// ======================================================
// Elola ERP Enterprise
// Orders Repository
// ======================================================

import BaseRepository from './BaseRepository'

class OrdersRepository extends BaseRepository {

  constructor() {

    super('orders')

  }

  // ======================================================
  // BEFORE CREATE
  // ======================================================

  async beforeCreate(order) {

    return {

      ...order,

      status:

        order.status ||

        'طلب جديد',

      createdAt:

        order.createdAt ||

        new Date().toISOString()

    }

  }

  // ======================================================
  // AFTER CREATE
  // ======================================================

  async afterCreate(result, order) {

    if (!result.success)

      return result

    return {

      ...result,

      data: {

        ...result.data,

        order

      }

    }

  }

  // ======================================================
  // GET NEW ORDERS
  // ======================================================

  async getNewOrders() {

    return await this.getAll()

  }

}

export default new OrdersRepository()