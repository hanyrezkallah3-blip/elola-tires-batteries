// src/repositories/SearchRepository.js

import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'

class SearchRepository {

  static getProducts() {
    return useWebsiteStore.getState().products || []
  }

  static getOffers() {
    return useWebsiteStore.getState().offers || []
  }

  static getServices() {
    return useWebsiteStore.getState().services || []
  }

  static getVideos() {
    return useWebsiteStore.getState().videos || []
  }

  static getSlides() {
    return useWebsiteStore.getState().slides || []
  }

  static getOrders() {
    return useWebsiteStore.getState().orders || []
  }

  static getWallets() {
    return useWebsiteStore.getState().wallets || []
  }

  static getUsers() {
    return useWebsiteStore.getState().users || []
  }

  static getStockItems() {
    return useInventoryStore.getState().stockItems || []
  }

  static getWarehouses() {
    return useInventoryStore.getState().warehouses || []
  }

  static getAll() {

    return {

      products: this.getProducts(),

      offers: this.getOffers(),

      services: this.getServices(),

      videos: this.getVideos(),

      slides: this.getSlides(),

      orders: this.getOrders(),

      wallets: this.getWallets(),

      users: this.getUsers(),

      stockItems: this.getStockItems(),

      warehouses: this.getWarehouses()

    }

  }

}

export default SearchRepository