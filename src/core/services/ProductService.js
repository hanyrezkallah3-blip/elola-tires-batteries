// ======================================================
// Elola ERP Enterprise
// Product Service
// ======================================================

import BaseService from './BaseService'
import ProductEngine from '../engines/product/ProductEngine'

class ProductService extends BaseService {

  getProducts() {

    return this.getState().products || []

  }

  getProduct(id) {

    return this.getProducts().find(

      product => product.id === id

    )

  }

  async create(product) {

    return await ProductEngine.create(
      product
    )

  }

  async update(id, product) {

    return await ProductEngine.update(

      id,

      product

    )

  }

  async delete(id) {

    return await ProductEngine.delete(id)

  }

  async increaseStock(

    productId,

    warehouseId,

    quantity

  ) {

    return await ProductEngine.increaseStock(

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

    return await ProductEngine.decreaseStock(

      productId,

      warehouseId,

      quantity

    )

  }

  calculateProfit(product) {

    return (

      Number(product.salePrice || 0) -

      Number(product.purchasePrice || 0)

    )

  }

  calculateProfitMargin(product) {

    const salePrice =

      Number(product.salePrice || 0)

    if (salePrice <= 0)

      return 0

    return (

      this.calculateProfit(product) /

      salePrice

    ) * 100

  }

}

export default new ProductService()