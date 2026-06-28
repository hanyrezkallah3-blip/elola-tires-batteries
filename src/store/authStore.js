// src/store/authStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_OWNER,
  STORAGE_KEYS
} from './constants'

export const useAuthStore = create(
  persist(
    (set, get) => ({

      // ==========================================
      // STATE
      // ==========================================

      hydrated: false,

      currentUser: DEFAULT_OWNER,

      isAuthenticated: true,

      loading: false,

      // ==========================================
      // HYDRATION
      // ==========================================

      setHydrated: (value) =>
        set({
          hydrated: Boolean(value)
        }),

      // ==========================================
      // LOGIN
      // ==========================================

      login: ({ username, password }) => {

        const users =
          window.__EL_OLA_USERS__ || []

        const ownerMatch =
          username === DEFAULT_OWNER.username &&
          password === DEFAULT_OWNER.password

        if (ownerMatch) {

          set({

            currentUser: DEFAULT_OWNER,

            isAuthenticated: true

          })

          return {
            success: true,
            user: DEFAULT_OWNER
          }

        }

        const user =
          users.find(
            u =>
              u.username === username &&
              u.password === password &&
              u.active !== false
          )

        if (!user) {

          return {

            success: false,

            message: 'اسم المستخدم أو كلمة المرور غير صحيحة'

          }

        }

        set({

          currentUser: user,

          isAuthenticated: true

        })

        return {

          success: true,

          user

        }

      },

      // ==========================================
      // LOGOUT
      // ==========================================

      logout: () =>

        set({

          currentUser: null,

          isAuthenticated: false

        }),

      // ==========================================
      // SESSION
      // ==========================================

      setCurrentUser: (user) =>

        set({

          currentUser: user,

          isAuthenticated: !!user

        }),

      clearSession: () =>

        set({

          currentUser: null,

          isAuthenticated: false

        })

    }),

    {

      name: STORAGE_KEYS.AUTH,

      partialize: (state) => ({

        currentUser: state.currentUser,

        isAuthenticated: state.isAuthenticated

      }),

      onRehydrateStorage: () => (state) => {

        if (state) {

          state.setHydrated(true)

        }

      }

    }

  )

)