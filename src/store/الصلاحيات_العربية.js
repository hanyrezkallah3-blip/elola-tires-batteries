import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePermissionsStore = create(
  persist(
    (set, get) => ({

      // ================= USERS ROLES =================

      الأدوار: {

        المدير: {
          لوحة_تحكم: true,
          منتجات: true,
          مخازن: true,
          مخزون: true,
          طلبات: true,
          تقارير: true,
          مستخدمين: true
        },

        مخزن: {
          لوحة_تحكم: true,
          منتجات: true,
          مخزون: true,
          مخازن: true,
          طلبات: false,
          تقارير: false,
          مستخدمين: false
        },

        فرع: {
          لوحة_تحكم: true,
          منتجات: true,
          طلبات: true,
          مخزون: false,
          مخازن: false,
          تقارير: false,
          مستخدمين: false
        },

        كاشير: {
          لوحة_تحكم: false,
          منتجات: true,
          طلبات: true,
          مخزون: false,
          مخازن: false,
          تقارير: false,
          مستخدمين: false
        }

      },

      // ================= CURRENT USER =================

      المستخدم_الحالي: null,

      تعيين_مستخدم: (user) =>
        set({ المستخدم_الحالي: user }),

      تسجيل_خروج: () =>
        set({ المستخدم_الحالي: null }),

      // ================= CHECK PERMISSION =================

      يملك_صلاحية: (الميزة) => {

        const state = get()

        const user = state.المستخدم_الحالي

        if (!user) return false

        const role = user.role

        return state.الأدوار[role]?.[المَيزة] || false

      }

    }),

    {
      name: 'permissions-storage'
    }

  )
)