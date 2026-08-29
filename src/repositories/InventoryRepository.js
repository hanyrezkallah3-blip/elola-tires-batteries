// ======================================================
// Elola ERP Enterprise
// src/repositories/InventoryRepository.js
// ======================================================

import BaseRepository from './BaseRepository'


class InventoryRepository
  extends BaseRepository {


  constructor() {

    super('inventory')

  }


  // ======================================================
  // GET ALL
  // ======================================================

  async getAll() {

    const result =
      await super.getAll()


    if (
      result?.success === false
    ) {

      console.error(
        'InventoryRepository.getAll failed:',
        result?.message,
        result?.errors
      )

      return []

    }


    return Array.isArray(
      result?.data
    )

      ? result.data

      : []

  }


  // ======================================================
  // GET BY ID
  // ======================================================

  async getById(id) {

    if (!id)
      return null


    const result =
      await super.getById(id)


    if (
      result?.success === false
    ) {

      return null

    }


    return result?.data || null

  }


  // ======================================================
  // GET BY PRODUCT
  // ======================================================

  async getByProduct(productId) {

    if (!productId)
      return []


    const items =
      await this.getAll()


    return items.filter(

      item =>

        String(item.productId) ===
        String(productId)

    )

  }


  // ======================================================
  // GET BY WAREHOUSE
  // ======================================================

  async getByWarehouse(warehouseId) {

    if (!warehouseId)
      return []


    const items =
      await this.getAll()


    return items.filter(

      item =>

        String(item.warehouseId) ===
        String(warehouseId)

    )

  }


  // ======================================================
  // GET BY PRODUCT + WAREHOUSE
  // ======================================================

  async getByProductAndWarehouse(

    productId,

    warehouseId

  ) {

    if (
      !productId ||
      !warehouseId
    ) {

      return null

    }


    const items =
      await this.getAll()


    return (

      items.find(

        item =>

          String(item.productId) ===
            String(productId)

          &&

          String(item.warehouseId) ===
            String(warehouseId)

      )

      || null

    )

  }


  // ======================================================
  // CREATE
  // ======================================================

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


  // ======================================================
  // UPDATE
  // ======================================================

  async update(

    id,

    data = {}

  ) {

    if (!id) {

      return {

        success: false,

        data: null,

        message:
          'معرف المخزون مطلوب',

        errors: []

      }

    }


    return await super.update(

      id,

      {

        ...data,

        updatedAt:
          new Date().toISOString()

      }

    )

  }


  // ======================================================
  // DELETE
  // ======================================================

  async delete(id) {

    if (!id) {

      return {

        success: false,

        data: null,

        message:
          'معرف المخزون مطلوب',

        errors: []

      }

    }


    return await super.delete(id)

  }


  // ======================================================
  // INCREASE STOCK
  // ======================================================

  async increaseStock(

    id,

    quantity

  ) {

    const item =
      await this.getById(id)


    if (!item) {

      return {

        success: false,

        data: null,

        message:
          'سجل المخزون غير موجود',

        errors: []

      }

    }


    const amount =
      Number(quantity || 0)


    if (amount <= 0) {

      return {

        success: false,

        data: null,

        message:
          'كمية الزيادة يجب أن تكون أكبر من صفر',

        errors: []

      }

    }


    return await this.update(

      id,

      {

        quantity:

          Number(
            item.quantity || 0
          ) + amount

      }

    )

  }


  // ======================================================
  // DECREASE STOCK
  // ======================================================

  async decreaseStock(

    id,

    quantity

  ) {

    const item =
      await this.getById(id)


    if (!item) {

      return {

        success: false,

        data: null,

        message:
          'سجل المخزون غير موجود',

        errors: []

      }

    }


    const amount =
      Number(quantity || 0)


    if (amount <= 0) {

      return {

        success: false,

        data: null,

        message:
          'كمية النقص يجب أن تكون أكبر من صفر',

        errors: []

      }

    }


    const current =
      Number(
        item.quantity || 0
      )


    if (current < amount) {

      return {

        success: false,

        data: null,

        message:
          'الكمية المطلوبة أكبر من المخزون المتاح',

        errors: []

      }

    }


    return await this.update(

      id,

      {

        quantity:
          current - amount

      }

    )

  }

}


export default new InventoryRepository()