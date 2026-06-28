import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2)

// ================= ERP INVENTORY CORE =================

export const useInventoryStore = create(
  persist(
    (set, get) => ({

      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      // ================= STOCK (SOURCE OF TRUTH) =================
      stockItems: [],

      setStockItems: (items) =>
        set({ stockItems: Array.isArray(items) ? items : [] }),

      // ================= ERP ENGINE =================
      erpEngine: {

        deductStock: (productId, qty = 1) => {
          const items = [...get().stockItems]

          const item = items.find(
            (i) => String(i.productId) === String(productId)
          )

          if (!item) return false

          item.quantity = Math.max(0, Number(item.quantity) - Number(qty))

          set({ stockItems: items })
          return true
        },

        addStock: (productId, qty = 1) => {
          const items = [...get().stockItems]

          const item = items.find(
            (i) => String(i.productId) === String(productId)
          )

          if (!item) return false

          item.quantity = Number(item.quantity) + Number(qty)

          set({ stockItems: items })
          return true
        },

        transfer: (productId, fromId, toId, qty = 1) => {
          const items = [...get().stockItems]

          const from = items.find(
            (i) =>
              String(i.productId) === String(productId) &&
              i.warehouseId === fromId
          )

          if (!from || from.quantity < qty) return false

          from.quantity -= qty

          let to = items.find(
            (i) =>
              String(i.productId) === String(productId) &&
              i.warehouseId === toId
          )

          if (to) {
            to.quantity += qty
          } else {
            items.push({
              ...from,
              id: generateId(),
              warehouseId: toId,
              quantity: qty
            })
          }

          set({ stockItems: items })
          return true
        }
      },

      // ================= ANALYTICS =================

      getLowStock: () =>
        get().stockItems.filter(i => i.quantity <= (i.minQuantity || 5)),

      getSummary: () => {
        const items = get().stockItems

        return {
          totalItems: items.length,
          totalQuantity: items.reduce((a, i) => a + Number(i.quantity), 0),
          lowStock: items.filter(i => i.quantity <= (i.minQuantity || 5)).length
        }
      }

    }),

    {
      name: 'inventory-core-erp',
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true)
      }
    }
  )
)