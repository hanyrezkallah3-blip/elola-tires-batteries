import { create } from 'zustand'

export const useMultiWarehouseStore = create((set, get) => ({

  // ================= WAREHOUSES =================

  المخازن: [

    {
      id: 'main',
      الاسم: 'المخزن الرئيسي',
      المدينة: 'القاهرة',
      نشط: true
    }

  ],

  // ================= PRODUCTS PER WAREHOUSE =================

  مخزون_المخازن: [
    /*
      {
        warehouseId: 'main',
        productId: '123',
        الاسم: 'إطار سيارة',
        الكمية: 10,
        السعر: 500
      }
    */
  ],

  // ================= ADD WAREHOUSE =================

  إضافة_مخزن: (مخزن) => {

    const newWarehouse = {

      id: Date.now(),

      الاسم: '',

      المدينة: '',

      نشط: true,

      ...مخزن

    }

    set((state) => ({

      المخازن: [
        ...state.المخازن,
        newWarehouse
      ]

    }))

  },

  // ================= ADD PRODUCT TO WAREHOUSE =================

  إضافة_منتج_للمخزن: ({
    warehouseId,
    productId,
    الاسم,
    الكمية,
    السعر
  }) => {

    const newItem = {

      id: Date.now(),

      warehouseId,

      productId,

      الاسم,

      الكمية,

      السعر

    }

    set((state) => ({

      مخزون_المخازن: [
        ...state.مخزون_المخازن,
        newItem
      ]

    }))

  },

  // ================= TRANSFER BETWEEN WAREHOUSES =================

  نقل_بين_المخازن: ({
    fromWarehouse,
    toWarehouse,
    productId,
    quantity
  }) => {

    const state = get()

    const items =
      [...state.مخزون_المخازن]

    const source =
      items.find(
        (i) =>
          i.warehouseId === fromWarehouse &&
          i.productId === productId
      )

    if (!source) return

    // خصم من المصدر
    source.الكمية -= quantity

    // إضافة للوجهة
    const target =
      items.find(
        (i) =>
          i.warehouseId === toWarehouse &&
          i.productId === productId
      )

    if (target) {

      target.الكمية += quantity

    } else {

      items.push({

        id: Date.now(),

        warehouseId: toWarehouse,

        productId,

        الاسم: source.الاسم,

        الكمية: quantity,

        السعر: source.السعر

      })

    }

    set({ مخزون_المخازن: items })

  },

  // ================= ANALYTICS =================

  تحليل_المخازن: () => {

    const data = get().مخزون_المخازن

    const warehouses = get().المخازن

    return warehouses.map((w) => {

      const items =
        data.filter(
          (i) => i.warehouseId === w.id
        )

      const totalStock =
        items.reduce(
          (a, i) => a + i.الكمية,
          0
        )

      return {

        warehouseId: w.id,

        name: w.الاسم,

        totalProducts: items.length,

        totalStock

      }

    })

  }

}))