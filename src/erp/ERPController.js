import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/InventoryStore'
import { useAnalyticsStore } from '../store/analyticsStore'

/**
 * ERP CORE CONTROLLER
 * العقل المركزي للنظام (Single Source of Truth)
 */

class ERPController {

  // ================= INTERNAL =================

  static initialized = false

  static syncTimer = null

  static lastSignature = ''

  // ================= INIT =================

  static init() {

    if (this.initialized) return

    this.initialized = true

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
        const signature = JSON.stringify({

      products:

        products.length,

      stockItems:

        inventory.stockItems.length,

      warehouses:

        inventory.warehouses.length,

      orders:

        website.orders.length,

      wallets:

        website.wallets?.length || 0,

      totalItems:

        summary.totalItems,

      lowStock:

        summary.lowStockCount

    })

    if (

      signature ===

      this.lastSignature

    ) {

      return

    }

    this.lastSignature =

      signature

    website.addNotification?.(

      '📊 ERP Sync',

      `تم تحديث النظام | منتجات: ${summary.totalItems}`

    )

  }

  // ================= AUTO SYNC ENGINE =================

  static startAutoSync() {

    if (

      this.syncTimer

    ) {

      return

    }

    this.syncTimer =

      setInterval(() => {

        try {

          this.syncAll()

        }

        catch (err) {

          console.error(

            'ERP Auto Sync Error:',

            err

          )

        }

      }, 5000)

  }

  // ================= STOP AUTO SYNC =================

  static stopAutoSync() {

    if (

      !this.syncTimer

    ) {

      return

    }

    clearInterval(

      this.syncTimer

    )

    this.syncTimer = null

  }

  // ================= ORDER HOOK =================

  static onNewOrder(order) {

    const website =

      useWebsiteStore.getState()

    order.items?.forEach((item) => {

      const inventory =

        useInventoryStore.getState()
                const stockItem =

          inventory.stockItems.find(

            (i) =>

              i.productId ===

              item.productId

          )

        if (

          stockItem

        ) {

          inventory.decreaseStock({

            itemId:

              stockItem.id,

            quantity:

              item.quantity

          })

        }

      })

    useAnalyticsStore

      .getState()

      .updateDashboardStats({

        orders:

          website.orders,

        products:

          website.products,

        wallets:

          website.wallets,

        walletTransactions:

          website.walletTransactions

      })

    if (

      website.applyCashback

    ) {

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