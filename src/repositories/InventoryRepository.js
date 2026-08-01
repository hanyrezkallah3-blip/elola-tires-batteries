// ======================================================
// Elola ERP Enterprise
// src/repositories/InventoryRepository.js
// ======================================================

import BaseRepository from './BaseRepository'

class InventoryRepository extends BaseRepository {

  constructor() {

    super('inventory')

  }

  async getAll() {

    return await this.findAll()

  }

  async getById(id) {

    return await this.findById(id)

  }

  async getByProduct(productId) {

    const items =
      await this.findAll()

    return items.filter(

      item =>

        String(item.productId) ===

        String(productId)

    )

  }

  async getByWarehouse(warehouseId) {

    const items =
      await this.findAll()

    return items.filter(

      item =>

        String(item.warehouseId) ===

        String(warehouseId)

    )

  }

  async create(item = {}) {

    return await super.create({

      productId: '',

      warehouseId: '',

      quantity: 0,

      purchasePrice: 0,

      salePrice: 0,

      minimumStock: 0,

      maximumStock: 0,

      reorderPoint: 0,

      location: '',

      note: '',

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...item

    })

  }

  async update(id, data = {}) {

    return await super.update(

      id,

      {

        ...data,

        updatedAt:
          new Date().toISOString()

      }

    )

  }
    async delete(id) {

    return await super.delete(id)

  }

  async increaseStock(id, quantity) {

    const item =
      await this.getById(id)

    if (!item)
      return null

    return await this.update(id, {

      quantity:

        Number(item.quantity || 0) +

        Number(quantity || 0)

    })

  }

  async decreaseStock(id, quantity) {

    const item =
      await this.getById(id)

    if (!item)
      return null

    return await this.update(id, {

      quantity: Math.max(

        0,

        Number(item.quantity || 0) -

        Number(quantity || 0)

      )

    })

  }

}

export default new InventoryRepository()