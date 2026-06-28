import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2)

// ================= CORE INVENTORY ENGINE =================

export const useInventoryStore = create(
  persist(
    (set, get) => ({

      // ================= HYDRATION =================

      hydrated: false,

      setHydrated: (v) =>
        set({ hydrated: v }),

      // ================= WAREHOUSES =================

      warehouses: [
  {
    id: 'main',

    name: 'المخزن الرئيسي',

    type: 'warehouse',

    location: 'القاهرة',

    manager: 'الإدارة',

    username: '',

    password: '',

    incoming: 0,

    outgoing: 0,

    currentStock: 0,

    active: true,

    createdAt: new Date().toISOString()
  }
],

      addWarehouse: (data) =>
  set((state) => ({
    warehouses: [
      {
        id: generateId(),

        name: '',

        type: 'warehouse',

        location: '',

        manager: '',

        username: '',

        password: '',

        incoming: 0,

        outgoing: 0,

        currentStock: 0,

        active: true,

        createdAt: new Date().toISOString(),

        ...data
      },
      ...state.warehouses
    ]
  })),

      updateWarehouse: (id, data) =>
        set((state) => ({
          warehouses: state.warehouses.map((w) =>
            w.id === id
              ? { ...w, ...data }
              : w
          )
        })),

      deleteWarehouse: (id) =>
  set((state) => {

    if (id === 'main') {
      return {
        warehouses: state.warehouses
      }
    }

    return {
      warehouses:
        state.warehouses.filter(
          (w) => w.id !== id
        )
    }

  }),

      // ================= STOCK =================

      stockItems: [],

      addStockItem: (item) =>
        set((state) => ({
          stockItems: [
            {
              id: generateId(),
              productId: '',
              productName: '',
              warehouseId: 'main',
              warehouseName: 'المخزن الرئيسي',
              quantity: 0,
              minQuantity: 5,
              price: 0,
              barcode: '',
              category: '',
              sold: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...item
            },
            ...state.stockItems
          ]
        })),

      updateStockItem: (id, data) =>
        set((state) => ({
          stockItems: state.stockItems.map((i) =>
            i.id === id
              ? {
                  ...i,
                  ...data,
                  updatedAt:
                    new Date().toISOString()
                }
              : i
          )
        })),

      deleteStockItem: (id) =>
        set((state) => ({
          stockItems:
            state.stockItems.filter(
              (i) => i.id !== id
            )
        })),

      // ================= MOVEMENTS =================

      stockMovements: [],
      
      transfers: [],

      addMovement: (movement) =>
        set((state) => ({
          stockMovements: [
            {
              id: generateId(),
              type: 'add',
              quantity: 0,
              note: '',
              createdAt:
                new Date().toISOString(),
              ...movement
            },
            ...state.stockMovements
          ]
        })),

      // ================= OPERATIONS =================

      increaseStock: ({
        itemId,
        quantity,
        note
      }) => {

        const items =
          [...get().stockItems]

        const item =
          items.find(
            (i) => i.id === itemId
          )

        if (!item) return

        item.quantity =
          Number(item.quantity) +
          Number(quantity)

        get().addMovement({

          productId:
            item.productId,

          productName:
            item.productName,

          warehouseId:
            item.warehouseId,

          warehouseName:
            item.warehouseName,

          quantity,

          type: 'add',

          note

        })

        set({
          stockItems: items
        })

      },

      decreaseStock: ({
        itemId,
        quantity,
        note
      }) => {

        const items =
          [...get().stockItems]

        const item =
          items.find(
            (i) => i.id === itemId
          )

        if (!item) return

        item.quantity = Math.max(
          0,
          Number(item.quantity) -
            Number(quantity)
        )

        get().addMovement({

          productId:
            item.productId,

          productName:
            item.productName,

          warehouseId:
            item.warehouseId,

          warehouseName:
            item.warehouseName,

          quantity,

          type: 'deduct',

          note

        })

        set({
          stockItems: items
        })

      },

      transferStock: ({
  itemId,
  toWarehouseId,
  quantity
}) => {

  const state = get()

  const items = [...state.stockItems]

  const source =
    items.find(
      (i) => i.id === itemId
    )

  if (!source) return false

  const qty =
    Number(quantity)

  if (
    !qty ||
    qty <= 0
  ) {
    return false
  }

  if (
    Number(source.quantity) <
    qty
  ) {

    return false

  }

  const targetWarehouse =
    state.warehouses.find(
      (w) =>
        w.id === toWarehouseId
    )

  source.quantity =
    Number(source.quantity) -
    qty

  source.updatedAt =
    new Date().toISOString()

  let target =
    items.find(
      (i) =>
        i.productId ===
          source.productId &&
        i.warehouseId ===
          toWarehouseId
    )

  if (target) {

    target.quantity =
      Number(target.quantity) +
      qty

    target.updatedAt =
      new Date().toISOString()

  } else {

    items.push({

      ...source,

      id: generateId(),

      warehouseId:
        toWarehouseId,

      warehouseName:
        targetWarehouse?.name ||
        '',

      quantity: qty,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()

    })

  }

  const transferRecord = {

    id: generateId(),

    productId:
      source.productId,

    productName:
      source.productName,

    quantity: qty,

    fromWarehouseId:
      source.warehouseId,

    fromWarehouseName:
      source.warehouseName,

    toWarehouseId,

    toWarehouseName:
      targetWarehouse?.name ||
      '',

    createdAt:
      new Date().toISOString()

  }

  get().addMovement({

    productId:
      source.productId,

    productName:
      source.productName,

    warehouseId:
      source.warehouseId,

    warehouseName:
      source.warehouseName,

    quantity: qty,

    type: 'transfer',

    note:
      'تحويل بين المخازن'

  })

  set({

    stockItems: items,

    transfers: [
      transferRecord,
      ...(state.transfers || [])
    ]

  })

  return true

},
// ================= INCOMING =================

addIncoming: ({
  warehouseId,
  quantity
}) => {

  const warehouses =
    [...get().warehouses]

  const warehouse =
    warehouses.find(
      (w) => w.id === warehouseId
    )

  if (!warehouse) return

  warehouse.incoming =
    Number(warehouse.incoming || 0) +
    Number(quantity)

  warehouse.currentStock =
    Number(warehouse.currentStock || 0) +
    Number(quantity)

  set({ warehouses })

},

// ================= OUTGOING =================

addOutgoing: ({
  warehouseId,
  quantity
}) => {

  const warehouses =
    [...get().warehouses]

  const warehouse =
    warehouses.find(
      (w) => w.id === warehouseId
    )

  if (!warehouse) return

  warehouse.outgoing =
    Number(warehouse.outgoing || 0) +
    Number(quantity)

  warehouse.currentStock =
    Math.max(
      0,
      Number(warehouse.currentStock || 0) -
      Number(quantity)
    )

  set({ warehouses })

},
      // ================= ANALYTICS =================

      getLowStock: () =>
        get().stockItems.filter(
          (i) =>
            i.quantity <=
            i.minQuantity
        ),

      // ================= ERP COMPATIBILITY =================

      getLowStockItems: () =>
        get().stockItems.filter(
          (i) =>
            i.quantity <=
            i.minQuantity
        ),

      getSummary: () => {

        const items =
          get().stockItems

        return {

          totalItems:
            items.length,

          totalQuantity:
            items.reduce(
              (a, i) =>
                a +
                Number(
                  i.quantity
                ),
              0
            ),

          totalValue:
            items.reduce(
              (a, i) =>
                a +
                i.quantity *
                  i.price,
              0
            ),

          lowStock:
            get()
              .getLowStock()
              .length

        }

      },

      getInventorySummary: () => {

        const items =
          get().stockItems

        return {

          totalItems:
            items.length,

          totalQuantity:
            items.reduce(
              (a, i) =>
                a +
                Number(
                  i.quantity
                ),
              0
            ),

          totalValue:
            items.reduce(
              (a, i) =>
                a +
                Number(
                  i.quantity
                ) *
                  Number(
                    i.price || 0
                  ),
              0
            ),

          lowStock:
            get()
              .getLowStockItems()
              .length

        }

      },

      getWarehouseAnalytics: () => {

        const warehouses =
          get().warehouses

        const stockItems =
          get().stockItems

        return warehouses.map(
          (warehouse) => {

            const items =
              stockItems.filter(
                (i) =>
                  i.warehouseId ===
                  warehouse.id
              )

            return {

              warehouseId:
                warehouse.id,

              warehouseName:
                warehouse.name,

              totalProducts:
                items.length,

              totalStock:
                items.reduce(
                  (a, i) =>
                    a +
                    Number(
                      i.quantity
                    ),
                  0
                ),

              totalValue:
                items.reduce(
                  (a, i) =>
                    a +
                    Number(
                      i.quantity
                    ) *
                      Number(
                        i.price || 0
                      ),
                  0
                )

            }

          }
        )

      },

      getProductAnalytics: () => {

        return get().stockItems.map(
          (item) => ({

            productId:
              item.productId,

            productName:
              item.productName,

            warehouseId:
              item.warehouseId,

            quantity:
              item.quantity,

            sold:
              item.sold || 0,

            stockValue:
              Number(
                item.quantity
              ) *
              Number(
                item.price || 0
              ),

            status:
              item.quantity <=
              item.minQuantity
                ? 'LOW'
                : 'OK'

          })
        )

      }

    }),

    {
      name: 'inventory-core-engine',

      partialize: (state) => ({

  warehouses:
    state.warehouses,

  stockItems:
    state.stockItems,

  stockMovements:
    state.stockMovements,

  transfers:
    state.transfers

}),

      onRehydrateStorage:
        () => (state) => {

          if (state) {

            state.setHydrated(
              true
            )

          }

        }

    }
  )
)