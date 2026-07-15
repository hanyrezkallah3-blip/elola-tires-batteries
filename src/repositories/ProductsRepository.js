import BaseRepository from './BaseRepository'

class ProductsRepository extends BaseRepository {

  constructor() {

    super('products')

  }

  async getAll() {

    return await this.findAll()

  }

  async getById(id) {

    if (!id)
      return null

    return await this.findById(id)

  }

  async create(product = {}) {

    const item = {

      name: '',

      brand: '',

      category: '',

      barcode: '',

      sku: '',

      purchasePrice: 0,

      salePrice: 0,

      averagePurchasePrice: 0,

      profit: 0,

      profitMargin: 0,

      minimumStock: 0,

      preferredWarehouseId: null,

      warehouses: [],

      stockByWarehouse: {},

      totalStock: 0,

      active: true,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...product

    }

    return await super.create(item)

  }

  async update(id, data = {}) {

    return await super.update(id, {

      ...data,

      updatedAt:
        new Date().toISOString()

    })

  }

  async delete(id) {

    return await super.delete(id)

  }

  async increaseStock(

    id,

    warehouseId,

    quantity

  ) {

    const product =
      await this.getById(id)

    if (!product)
      return null

    const stock = {

      ...(product.stockByWarehouse || {})

    }

    stock[warehouseId] =

      Number(stock[warehouseId] || 0) +

      Number(quantity || 0)

    const totalStock =

      Object.values(stock).reduce(

        (sum, value) =>

          sum + Number(value || 0),

        0

      )

    return await this.update(id, {

      stockByWarehouse: stock,

      totalStock

    })

  }

  async decreaseStock(

    id,

    warehouseId,

    quantity

  ) {

    const product =
      await this.getById(id)

    if (!product)
      return null

    const stock = {

      ...(product.stockByWarehouse || {})

    }

    stock[warehouseId] = Math.max(

      0,

      Number(stock[warehouseId] || 0) -

      Number(quantity || 0)

    )

    const totalStock =

      Object.values(stock).reduce(

        (sum, value) =>

          sum + Number(value || 0),

        0

      )

    return await this.update(id, {

      stockByWarehouse: stock,

      totalStock

    })

  }

}

export default new ProductsRepository()