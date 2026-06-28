import { create } from 'zustand'

export const useAutoPilotStore = create((set, get) => ({

  // ================= SETTINGS =================

  enabled: false,

  setEnabled: (value) =>
    set({
      enabled: Boolean(value)
    }),

  lastRun: null,

  lastReport: null,

  autoActions: [],

  executionHistory: [],

  statistics: {

    totalRuns: 0,

    totalTransfersSuggested: 0,

    totalPurchasesSuggested: 0

  },

  // ================= AUTO PILOT =================

  runAutoPilot: ({
    inventoryStore,
    coreStore
  }) => {

    const state = get()

    if (!state.enabled) {
      return []
    }

    if (!inventoryStore) {
      return []
    }

    const stockItems =
      inventoryStore.stockItems || []

    const warehouses =
      inventoryStore.warehouses || []

    const lowStockItems =

      inventoryStore.getLowStockItems
        ? inventoryStore.getLowStockItems()
        : inventoryStore.getLowStock
          ? inventoryStore.getLowStock()
          : []

    const actions = []

    const purchaseSuggestions = []

    const transferSuggestions = []

    // ================= SMART TRANSFERS =================

    lowStockItems.forEach((item) => {

      const source = stockItems.find(

        (stock) =>

          stock.productId === item.productId &&

          stock.warehouseId !== item.warehouseId &&

          Number(stock.quantity || 0) >
          Number(stock.minQuantity || 5) + 10

      )

      if (source) {

        const suggestedQty = Math.min(

          10,

          Math.max(
            5,
            Number(source.quantity || 0) -
            Number(source.minQuantity || 5)
          )

        )

        const action = {

          id:
            Date.now() +
            Math.random(),

          type: 'TRANSFER',

          productId:
            item.productId,

          productName:
            item.productName,

          from:
            source.warehouseId,

          to:
            item.warehouseId,

          quantity:
            suggestedQty,

          createdAt:
            new Date().toISOString()

        }

        actions.push(action)

        transferSuggestions.push(action)

      } else {

        const purchase = {

          id:
            Date.now() +
            Math.random(),

          type: 'PURCHASE',

          productId:
            item.productId,

          productName:
            item.productName,

          warehouseId:
            item.warehouseId,

          currentQuantity:
            item.quantity,

          suggestedQuantity:

            Math.max(
              20,
              Number(item.minQuantity || 5) * 4
            ),

          createdAt:
            new Date().toISOString()

        }

        actions.push(purchase)

        purchaseSuggestions.push(purchase)

      }

    })

    // ================= KPI =================

    const criticalItems =
      stockItems.filter(

        (item) =>

          Number(item.quantity || 0) <= 0

      )

    const report = {

      totalWarehouses:
        warehouses.length,

      totalProducts:
        stockItems.length,

      lowStockCount:
        lowStockItems.length,

      criticalCount:
        criticalItems.length,

      transferSuggestions:
        transferSuggestions.length,

      purchaseSuggestions:
        purchaseSuggestions.length,

      recommendation:

        criticalItems.length > 0

          ? '🚨 يوجد منتجات منتهية بالكامل'

          : lowStockItems.length > 5

            ? '⚠ يفضل تنفيذ تحويلات بين المخازن'

            : '✅ المخزون مستقر'

    }

    const executionRecord = {

      id:
        Date.now(),

      executedAt:
        new Date().toISOString(),

      report

    }

    set({

      lastRun:
        executionRecord.executedAt,

      lastReport:
        report,

      autoActions:
        actions,

      executionHistory: [

        executionRecord,

        ...state.executionHistory

      ].slice(0, 50),

      statistics: {

        totalRuns:
          state.statistics.totalRuns + 1,

        totalTransfersSuggested:
          state.statistics.totalTransfersSuggested +
          transferSuggestions.length,

        totalPurchasesSuggested:
          state.statistics.totalPurchasesSuggested +
          purchaseSuggestions.length

      }

    })

    return actions

  },

  // ================= HELPERS =================

  clearReport: () =>

    set({

      lastReport: null,

      autoActions: []

    }),

  clearHistory: () =>

    set({

      executionHistory: [],

      statistics: {

        totalRuns: 0,

        totalTransfersSuggested: 0,

        totalPurchasesSuggested: 0

      }

    })

}))