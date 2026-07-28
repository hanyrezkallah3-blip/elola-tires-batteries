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

      type: 'tire',

      brand: '',

      model: '',

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

      compatibleVehicles: [],

      tire: {},

      battery: {},

      oil: {},

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

  // =====================================================
  // VEHICLE SEARCH
  // =====================================================

  async findCompatibleProducts({

    brand,

    model,

    year

  }) {

    const products =

      await this.getAll()

    return products.filter(product => {

      const vehicles =

        Array.isArray(product.compatibleVehicles)

          ? product.compatibleVehicles

          : []

      return vehicles.some(vehicle =>

        (!brand || vehicle.brand === brand)

        &&

        (!model || vehicle.model === model)

        &&

        (

          !year ||

          (

            Number(year) >= Number(vehicle.yearFrom)

            &&

            Number(year) <= Number(vehicle.yearTo)

          )

        )

      )

    })

  }

  // =====================================================
  // TIRE SEARCH
  // =====================================================

  async findTiresBySize({

    width,

    profile,

    rim

  }) {

    const products =

      await this.getAll()

    return products.filter(product =>

      product.type === 'tire'

      &&

      Number(product.tire?.width)

      ===

      Number(width)

      &&

      Number(product.tire?.height)

      ===

      Number(profile)

      &&

      Number(product.tire?.rim)

      ===

      Number(rim)

    )

  }

  // =====================================================
  // BATTERY SEARCH
  // =====================================================

  async findBatteries({

    capacity

  }) {

    const products =

      await this.getAll()

    return products.filter(product =>

      product.type === 'battery'

      &&

      Number(product.battery?.capacity)

      ===

      Number(capacity)

    )

  }

  // =====================================================
  // OIL SEARCH
  // =====================================================

  async findOils({

    viscosity

  }) {

    const products =

      await this.getAll()

    return products.filter(product =>

      product.type === 'oil'

      &&

      String(

        product.oil?.viscosity || ''

      ).toLowerCase()

      ===

      String(

        viscosity || ''

      ).toLowerCase()

    )

  }

}

export default new ProductsRepository()