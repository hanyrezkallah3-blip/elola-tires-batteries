import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'
import { useAnalyticsStore } from '../store/analyticsStore'

/**
 * ERP CORE CONTROLLER
 * العقل المركزي للنظام (Single Source of Truth)
 */

class ERPController {

  // ================= INIT =================
  static init() {
    this.syncAll()
    this.startAutoSync()
  }

  // ================= MAIN SYNC =================
  static syncAll() {

    const website = useWebsiteStore.getState()
    const inventory = useInventoryStore.getState()
    const analytics = useAnalyticsStore.getState()

    // ===== PRODUCTS → INVENTORY =====
    const products = website.products || []

    // sync products into stockItems if missing
    products.forEach((p) => {
      const exists = inventory.stockItems.find(
        (i) => i.productId === p.id
      )

      if (!exists) {
        inventory.addStockItem({
          productId: p.id,
          productName: p.name,
          quantity: p.stock || 0,
          price: p.price || 0
        })
      }
    })

    // ===== ORDERS → ANALYTICS =====
    analytics.updateDashboardStats({
      orders: website.orders,
      products: website.products,
      wallets: website.wallets,
      walletTransactions: website.walletTransactions
    })

    analytics.updateERPSummary({
      warehouses: inventory.warehouses,
      products: website.products,
      orders: website.orders,
      users: website.users,
      stockItems: inventory.stockItems
    })

    // ===== INVENTORY ANALYTICS =====
    const summary = inventory.getSummary()

    website.addNotification?.(
      '📊 ERP Sync',
      `تم تحديث النظام | منتجات: ${summary.totalItems}`
    )
  }

  // ================= AUTO SYNC ENGINE =================
  static startAutoSync() {

    setInterval(() => {
      this.syncAll()
    }, 5000) // كل 5 ثواني

  }

  // ================= ORDER HOOK =================
  static onNewOrder(order) {

    const website = useWebsiteStore.getState()

    // تقليل المخزون
    order.items?.forEach((item) => {

      const inventory = useInventoryStore.getState()

      const stockItem = inventory.stockItems.find(
        (i) => i.productId === item.productId
      )

      if (stockItem) {
        inventory.decreaseStock({
          itemId: stockItem.id,
          quantity: item.quantity
        })
      }
    })

    // تحديث التحليلات
    useAnalyticsStore.getState().updateDashboardStats({
      orders: website.orders,
      products: website.products,
      wallets: website.wallets,
      walletTransactions: website.walletTransactions
    })

    // كاش باك
    if (website.applyCashback) {
      website.applyCashback(
        order.phone,
        order.total
      )
    }

    this.syncAll()
  }

  // ================= PRODUCT HOOK =================
  static onProductChange() {
    this.syncAll()
  }

  // ================= WALLET HOOK =================
  static onWalletChange() {
    this.syncAll()
  }

}

export default ERPController