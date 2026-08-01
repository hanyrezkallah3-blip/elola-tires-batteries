import ProductsRepository from '../../../repositories/ProductsRepository'
import InventoryRepository from '../../../repositories/InventoryRepository'

class ProductEngine {

  normalize(product = {}) {

    const purchasePrice =
      Number(product.purchasePrice || 0)

    const salePrice =
      Number(product.salePrice || 0)

    const profit =
      salePrice - purchasePrice

    const profitMargin =
      salePrice > 0
        ? (profit / salePrice) * 100
        : 0

    return {

      ...product,

      purchasePrice,

      salePrice,

      averagePurchasePrice:
        Number(
          product.averagePurchasePrice ??
          purchasePrice
        ),

      profit,

      profitMargin,

      compatibleVehicles:
        Array.isArray(
          product.compatibleVehicles
        )
          ? product.compatibleVehicles
          : [],

      active:
        product.active ?? true

    }

  }

  validate(product = {}) {

    const errors = []

    if (!product.name?.trim()) {

      errors.push(
        'اسم المنتج مطلوب'
      )

    }

    if (!product.warehouseId) {

      errors.push(
        'يجب اختيار المخزن'
      )

    }

    if (

      Number(product.salePrice || 0) < 0

    ) {

      errors.push(
        'سعر البيع غير صحيح'
      )

    }

    if (

      Number(product.purchasePrice || 0) < 0

    ) {

      errors.push(
        'سعر الشراء غير صحيح'
      )

    }

    return {

      valid:
        errors.length === 0,

      errors

    }

  }
    async create(product = {}) {

    const validation =
      this.validate(product)

    if (!validation.valid) {

      return {

        success: false,

        errors:
          validation.errors

      }

    }

    const normalized =
      this.normalize(product)

    const {

      warehouseId,

      quantity = 0,

      minimumStock = 0,

      maximumStock = 0,

      reorderPoint = 0,

      ...productData

    } = normalized

    const createdProduct =

      await ProductsRepository.create(
        productData
      )

    await InventoryRepository.create({

      productId:
        createdProduct.id,

      warehouseId,

      quantity:
        Number(quantity),

      minimumStock:
        Number(minimumStock),

      maximumStock:
        Number(maximumStock),

      reorderPoint:
        Number(reorderPoint),

      purchasePrice:
        Number(
          normalized.purchasePrice
        ),

      salePrice:
        Number(
          normalized.salePrice
        )

    })

    return {

      success: true,

      data: createdProduct

    }

  }

  async update(id, product = {}) {

    const normalized =
      this.normalize(product)

    const {

      warehouseId,

      quantity,

      minimumStock,

      maximumStock,

      reorderPoint,

      ...productData

    } = normalized

    return await ProductsRepository.update(

      id,

      productData

    )

  }

  async delete(id) {

    return await ProductsRepository.delete(id)

  }
    async getAll() {

    return await ProductsRepository.getAll()

  }

  async getById(id) {

    return await ProductsRepository.getById(id)

  }

  async getInventory(productId) {

    return await InventoryRepository.getByProduct(
      productId
    )

  }

  async getWarehouseInventory(warehouseId) {

    return await InventoryRepository.getByWarehouse(
      warehouseId
    )

  }

}

export default new ProductEngine()