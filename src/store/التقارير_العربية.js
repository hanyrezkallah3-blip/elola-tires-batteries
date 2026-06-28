import { create } from 'zustand'

export const useReportsStore = create((set, get) => ({

  // ================= STATE =================

  التقارير: {
    مبيعات_يومية: [],
    مبيعات_شهرية: [],
    مخزون: [],
    منتجات_الأكثر_مبيعاً: [],
    منتجات_الأقل_مبيعاً: []
  },

  // ================= GENERATE REPORTS =================

  توليد_التقارير: ({
    طلبات = [],
    منتجات = [],
    مخزون = []
  }) => {

    // ================= DAILY SALES =================

    const اليوم = new Date().toDateString()

    const مبيعات_يومية =
      طلبات.filter(
        (o) =>
          new Date(o.createdAt).toDateString() === اليوم
      )

    // ================= MONTHLY SALES =================

    const الشهر = new Date().getMonth()

    const مبيعات_شهرية =
      طلبات.filter(
        (o) =>
          new Date(o.createdAt).getMonth() === الشهر
      )

    // ================= BEST PRODUCTS =================

    const منتجات_الأكثر_مبيعاً =
      [...منتجات]
        .sort(
          (a, b) =>
            Number(b.sold || 0) -
            Number(a.sold || 0)
        )
        .slice(0, 5)

    // ================= WORST PRODUCTS =================

    const منتجات_الأقل_مبيعاً =
      [...منتجات]
        .sort(
          (a, b) =>
            Number(a.sold || 0) -
            Number(b.sold || 0)
        )
        .slice(0, 5)

    // ================= LOW STOCK =================

    const مخزون_منخفض =
      مخزون.filter(
        (i) =>
          Number(i.quantity || 0) <= 5
      )

    // ================= SAVE =================

    set({
      التقارير: {
        مبيعات_يومية,
        مبيعات_شهرية,
        منتجات_الأكثر_مبيعاً,
        منتجات_الأقل_مبيعاً,
        مخزون_منخفض
      }
    })

  }

}))