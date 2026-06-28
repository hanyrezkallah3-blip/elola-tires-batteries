import { useEffect } from 'react'
import { useWebsiteStore } from './websiteStore'
import { useInventoryStore } from './useInventoryStore'
import { useAnalyticsStore } from './useAnalyticsStore'

// ================= ERP BRIDGE ENGINE =================

export function useERPBridge() {

  const website = useWebsiteStore()
  const inventory = useInventoryStore()
  const analytics = useAnalyticsStore()

  // ================= SYNC ENGINE =================

  useEffect(() => {

    const syncERP = () => {

      // ================= DATA =================

      const products = website.products || []
      const orders = website.orders || []
      const users = website.users || []
      const warehouses = inventory.warehouses || []
      const stockItems = inventory.stockItems || []
      const wallets = website.wallets || []
      const walletTransactions = website.walletTransactions || []

      // ================= ANALYTICS UPDATE =================

      analytics.updateDashboardStats({
        orders,
        products,
        wallets,
        walletTransactions
      })

      // ================= ERP SUMMARY UPDATE =================

      analytics.updateERPSummary({
        warehouses,
        products,
        orders,
        users,
        stockItems
      })

      // ================= CHARTS =================

      analytics.generateSalesChart(orders)
      analytics.generateWalletChart(wallets)
      analytics.generateOrdersChart(orders)

    }

    // ================= INITIAL SYNC =================

    syncERP()

    // ================= AUTO SYNC INTERVAL =================

    const interval = setInterval(syncERP, 3000)

    return () => clearInterval(interval)

  }, [])

  return null
}

// ================= MANUAL TRIGGER =================

export function triggerERPUpdate() {

  const website = useWebsiteStore.getState()
  const inventory = useInventoryStore.getState()
  const analytics = useAnalyticsStore.getState()

  const products = website.products || []
  const orders = website.orders || []
  const users = website.users || []
  const warehouses = inventory.warehouses || []
  const stockItems = inventory.stockItems || []
  const wallets = website.wallets || []
  const walletTransactions = website.walletTransactions || []

  analytics.updateDashboardStats({
    orders,
    products,
    wallets,
    walletTransactions
  })

  analytics.updateERPSummary({
    warehouses,
    products,
    orders,
    users,
    stockItems
  })

  analytics.generateSalesChart(orders)
  analytics.generateWalletChart(wallets)
  analytics.generateOrdersChart(orders)

}