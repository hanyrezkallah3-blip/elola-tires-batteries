import { create } from 'zustand'

export const useAlertsStore = create((set, get) => ({

  // ================= STATE =================

  التنبيهات: [],

  غير_مقروءة: 0,

  // ================= ADD ALERT =================

  إضافة_تنبيه: ({
    النوع,
    الرسالة,
    مستوى = 'info'
  }) => {

    const newAlert = {

      id: Date.now(),

      النوع,

      الرسالة,

      مستوى, // info | warning | danger | success

      تاريخ: new Date(),

      مقروء: false

    }

    set((state) => ({

      التنبيهات: [
        newAlert,
        ...state.التنبيهات
      ],

      غير_مقروءة:
        state.غير_مقروءة + 1

    }))

  },

  // ================= MARK AS READ =================

  قراءة_تنبيه: (id) => {

    set((state) => ({

      التنبيهات:
        state.التنبيهات.map((n) =>
          n.id === id
            ? { ...n, مقروء: true }
            : n
        ),

      غير_مقروءة: Math.max(
        state.غير_مقروءة - 1,
        0
      )

    }))

  },

  // ================= CLEAR ALL =================

  حذف_الكل: () =>
    set({
      التنبيهات: [],
      غير_مقروءة: 0
    }),

  // ================= AUTO ALERT ENGINE =================

  فحص_المخزون: (stockItems = []) => {

    const lowStockItems =
      stockItems.filter(
        (item) =>
          Number(item.quantity || 0) <= 5
      )

    if (lowStockItems.length > 0) {

      get().إضافة_تنبيه({

        النوع: 'المخزون',

        الرسالة:
          `⚠ يوجد ${lowStockItems.length} منتجات منخفضة المخزون`,

        مستوى: 'warning'

      })

    }

  }

}))