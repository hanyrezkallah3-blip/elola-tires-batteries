import ProductsRepository from '../../../repositories/ProductsRepository'

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

      minimumStock:

        Number(product.minimumStock || 0),

      preferredWarehouseId:

        product.preferredWarehouseId || null,

      warehouses:

        Array.isArray(product.warehouses)

          ? product.warehouses

          : [],

      stockByWarehouse:

        product.stockByWarehouse || {},

      totalStock:

        Number(product.totalStock || 0)

    }

  }

  validate(product = {}) {

    const errors = []

    if (!product.name?.trim())

      errors.push(
        'اسم المنتج مطلوب'
      )

    if (

      Number(product.salePrice || 0) < 0

    )

      errors.push(
        'سعر البيع غير صحيح'
      )

    if (

      Number(product.purchasePrice || 0) < 0

    )

      errors.push(
        'سعر الشراء غير صحيح'
      )

    return {

      valid:

        errors.length === 0,

      errors

    }

  }

  async create(product) {

    const validation =
      this.validate(product)

    if (!validation.valid)

      return {

        success: false,

        errors:
          validation.errors

      }

    const normalized =
      this.normalize(product)

    const result =

      await ProductsRepository.create(
        normalized
      )

    return {

      success: true,

      data: result

    }

  }

  async update(id, product) {

    const normalized =
      this.normalize(product)

    return await ProductsRepository.update(

      id,

      normalized

    )

  }

  async delete(id) {

    return await ProductsRepository.delete(id)

  }

  async increaseStock(

    productId,

    warehouseId,

    quantity

  ) {

    return await ProductsRepository
      .increaseStock(

        productId,

        warehouseId,

        quantity

      )

  }

  async decreaseStock(

    productId,

    warehouseId,

    quantity

  ) {

    return await ProductsRepository
      .decreaseStock(

        productId,

        warehouseId,

        quantity

      )

  }

}

export default new ProductEngine()