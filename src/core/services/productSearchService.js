// =====================================================
// EL OLA ERP
// Product Search Service
// Service Layer
// =====================================================

import ProductsRepository from '../repositories/ProductsRepository'
import SmartSearchEngine from '../core/engines/smartsearchEngine'


class ProductSearchService {


  // =====================================================
  // GLOBAL SEARCH
  // =====================================================

  async search(
    query = '',
    options = {}
  ) {


    const response =
      await ProductsRepository.getAll()


    const products =
      response?.data || []


    return SmartSearchEngine.search(

      products,

      query,

      options

    )

  }



  // =====================================================
  // TIRE SEARCH
  // =====================================================

  async searchTires(
    size
  ) {


    const response =
      await ProductsRepository.getAll()


    const products =
      response?.data || []


    return SmartSearchEngine.searchTires(

      products,

      size

    )

  }



  // =====================================================
  // BATTERY SEARCH
  // =====================================================

  async searchBatteries(
    specification
  ) {


    const response =
      await ProductsRepository.getAll()


    const products =
      response?.data || []


    return SmartSearchEngine.searchBatteries(

      products,

      specification

    )

  }



  // =====================================================
  // PRODUCT BY ID
  // =====================================================

  async getProduct(
    id
  ) {

    return await ProductsRepository.getById(id)

  }


}


export default new ProductSearchService()