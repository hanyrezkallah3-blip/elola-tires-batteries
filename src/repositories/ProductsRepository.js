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

    delete item.minimumStock
    delete item.maximumStock
    delete item.reorderPoint
    delete item.preferredWarehouseId
    delete item.warehouses
    delete item.stockByWarehouse
    delete item.totalStock
    delete item.quantity

    return await super.create(item)

  }

  async update(id, data = {}) {

    const item = {

      ...data,

      updatedAt:
        new Date().toISOString()

    }

    delete item.minimumStock
    delete item.maximumStock
    delete item.reorderPoint
    delete item.preferredWarehouseId
    delete item.warehouses
    delete item.stockByWarehouse
    delete item.totalStock
    delete item.quantity

    return await super.update(

      id,

      item

    )

  }

  async delete(id) {

    return await super.delete(id)

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

        Array.isArray(
          product.compatibleVehicles
        )
          ? product.compatibleVehicles
          : []

      return vehicles.some(vehicle =>

        (!brand ||

          vehicle.brand === brand)

        &&

        (!model ||

          vehicle.model === model)

        &&

        (

          !year ||

          (

            Number(year) >=
            Number(vehicle.yearFrom)

            &&

            Number(year) <=
            Number(vehicle.yearTo)

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