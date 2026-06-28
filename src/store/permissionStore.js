// src/store/permissionStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  ROLE_PERMISSIONS,
  STORAGE_KEYS
} from './constants'

import {
  ensureArray
} from './helpers'

export const usePermissionStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      rolePermissions: { ...ROLE_PERMISSIONS },

      customPermissions: {},

      // ==================================================
      // ROLE PERMISSIONS
      // ==================================================

      getRolePermissions: (role) => {

        const permissions =
          get().rolePermissions[role]

        return ensureArray(permissions)

      },

      setRolePermissions: (role, permissions) =>

        set(state => ({

          rolePermissions: {

            ...state.rolePermissions,

            [role]: ensureArray(permissions)

          }

        })),

      // ==================================================
      // USER CUSTOM PERMISSIONS
      // ==================================================

      setUserPermissions: (userId, permissions) =>

        set(state => ({

          customPermissions: {

            ...state.customPermissions,

            [userId]: ensureArray(permissions)

          }

        })),

      clearUserPermissions: (userId) =>

        set(state => {

          const next = {
            ...state.customPermissions
          }

          delete next[userId]

          return {

            customPermissions: next

          }

        }),

      // ==================================================
      // GET EFFECTIVE PERMISSIONS
      // ==================================================

      getPermissionsForUser: (user) => {

        if (!user)
          return []

        if (user.role === 'owner')
          return ['*']

        const rolePermissions =
          get().getRolePermissions(user.role)

        const customPermissions =
          get().customPermissions[user.id] || []

        return [

          ...new Set([

            ...rolePermissions,

            ...customPermissions

          ])

        ]

      },

      // ==================================================
      // CHECK
      // ==================================================

      hasPermission: (user, permission) => {

        if (!user)
          return false

        if (user.role === 'owner')
          return true

        const permissions =
          get().getPermissionsForUser(user)

        return (

          permissions.includes('*') ||

          permissions.includes(permission)

        )

      },

      hasAnyPermission: (
        user,
        permissions = []
      ) => {

        if (!user)
          return false

        if (user.role === 'owner')
          return true

        return permissions.some(permission =>
          get().hasPermission(
            user,
            permission
          )
        )

      },

      hasAllPermissions: (
        user,
        permissions = []
      ) => {

        if (!user)
          return false

        if (user.role === 'owner')
          return true

        return permissions.every(permission =>
          get().hasPermission(
            user,
            permission
          )
        )

      },

      // ==================================================
      // PAGE ACCESS
      // ==================================================

      canAccessPage: (
        user,
        page
      ) =>

        get().hasPermission(
          user,
          page
        ),

      // ==================================================
      // BUTTON ACCESS
      // ==================================================

      canUseButton: (
        user,
        permission
      ) =>

        get().hasPermission(
          user,
          permission
        ),

      // ==================================================
      // RESET
      // ==================================================

      resetPermissions: () =>

        set({

          rolePermissions: {

            ...ROLE_PERMISSIONS

          },

          customPermissions: {}

        })

    }),

    {

      name: `${STORAGE_KEYS.SETTINGS}-permissions`,

      partialize: state => ({

        rolePermissions:
          state.rolePermissions,

        customPermissions:
          state.customPermissions

      })

    }

  )

)