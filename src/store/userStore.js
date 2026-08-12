import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_OWNER,
  ROLE_PERMISSIONS,
  STORAGE_KEYS
} from './constants'

import {
  generateId,
  now,
  ensureArray,
  contains
} from './helpers'

import { useWarehouseStore } from './warehouseStore'


export const useUserStore = create(

  persist(

    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      users: [DEFAULT_OWNER],

      currentUser: null,


      // ==================================================
      // AUTH
      // ==================================================

      setCurrentUser: (user) =>

        set({

          currentUser: user

        }),


      login: (username, password) => {

        const cleanUsername =
          String(username || '').trim()

        const cleanPassword =
          String(password || '').trim()


        if (
          !cleanUsername ||
          !cleanPassword
        ) {

          return false

        }


        // ==================================================
        // 1. NORMAL USERS / OWNER
        // ==================================================

        const user = get().users.find(

          u =>

            u.username === cleanUsername &&

            u.password === cleanPassword &&

            u.active !== false

        )


        if (user) {

          set({

            currentUser: user

          })


          return true

        }


        // ==================================================
        // 2. WAREHOUSE LOGIN
        // ==================================================

        let warehouses = []


        try {

          warehouses =
            useWarehouseStore.getState().warehouses || []

        } catch (error) {

          console.error(
            'Warehouse Store Error:',
            error
          )

          return false

        }


        const warehouse =
          warehouses.find(

            item =>

              String(item.username || '').trim() ===
                cleanUsername &&

              String(item.password || '').trim() ===
                cleanPassword &&

              item.active !== false

          )


        if (!warehouse) {

          return false

        }


        // ==================================================
        // CREATE WAREHOUSE SESSION USER
        // ==================================================

        const warehouseUser = {

          id:
            `warehouse-user-${warehouse.id}`,

          username:
            warehouse.username,

          password:
            warehouse.password,

          fullName:
            warehouse.manager ||
            warehouse.name ||
            'مستخدم المخزن',

          role:
            'warehouse',

          active:
            warehouse.active !== false,

          warehouseId:
            warehouse.id,

          warehouseName:
            warehouse.name || '',

          warehouseType:
            warehouse.type || 'main',

          financeAccess:
            false,

          walletAccess:
            false,

          permissions:
            ROLE_PERMISSIONS.warehouse || [],

          ownerControlled:
            warehouse.ownerControlled !== false,

          createdAt:
            warehouse.createdAt || now()

        }


        set({

          currentUser:
            warehouseUser

        })


        return true

      },


      logout: () =>

        set({

          currentUser: null

        }),



      // ==================================================
      // GETTERS
      // ==================================================

      getUserById: (id) =>

        get().users.find(

          user => user.id === id

        ) || null,


      getUserByUsername: (username) =>

        get().users.find(

          user => user.username === username

        ) || null,


      getCurrentWarehouse: () => {

        const currentUser =
          get().currentUser


        if (
          !currentUser ||
          !currentUser.warehouseId
        ) {

          return null

        }


        try {

          return (

            useWarehouseStore
              .getState()
              .warehouses || []

          ).find(

            warehouse =>
              warehouse.id ===
              currentUser.warehouseId

          ) || null

        } catch (error) {

          console.error(
            'Get Current Warehouse Error:',
            error
          )

          return null

        }

      },



      // ==================================================
      // SETTERS
      // ==================================================

      setUsers: (users) =>

        set({

          users:
            ensureArray(users)

        }),



      // ==================================================
      // CREATE
      // ==================================================

      addUser: (user) => {

        const users =
          get().users


        const exists =
          users.some(

            u =>
              u.username ===
              user.username

          )


        if (exists) {

          return {

            success: false,

            message:
              'اسم المستخدم موجود بالفعل'

          }

        }


        const newUser = {

          id:
            generateId(),

          username:
            '',

          password:
            '',

          fullName:
            '',

          role:
            'employee',

          active:
            true,

          warehouseId:
            null,

          warehouseName:
            '',

          financeAccess:
            false,

          walletAccess:
            false,

          permissions:
            ROLE_PERMISSIONS[user.role] || [],

          createdAt:
            now(),

          ...user

        }


        set(state => ({

          users: [

            ...state.users,

            newUser

          ]

        }))


        return {

          success:
            true,

          user:
            newUser

        }

      },



      // ==================================================
      // UPDATE
      // ==================================================

      updateUser: (id, updates) =>

        set(state => ({

          users:
            state.users.map(user => {

              if (
                user.id !== id
              )

                return user


              return {

                ...user,

                ...updates,

                permissions:

                  updates.role

                    ? ROLE_PERMISSIONS[
                        updates.role
                      ] || []

                    : user.permissions

              }

            })

        })),



      // ==================================================
      // DELETE
      // ==================================================

      deleteUser: (id) =>

        set(state => ({

          users:

            state.users.filter(

              user =>

                user.id !== id &&

                user.id !==
                  DEFAULT_OWNER.id

            )

        })),



      // ==================================================
      // ENABLE
      // ==================================================

      enableUser: (id) =>

        set(state => ({

          users:

            state.users.map(user =>

              user.id === id

                ? {

                    ...user,

                    active:
                      true

                  }

                : user

            )

        })),



      // ==================================================
      // DISABLE
      // ==================================================

      disableUser: (id) =>

        set(state => ({

          users:

            state.users.map(user =>

              user.id === id

                ? {

                    ...user,

                    active:
                      false

                  }

                : user

            )

        })),



      // ==================================================
      // SEARCH
      // ==================================================

      searchUsers: (keyword) => {

        if (!keyword)

          return get().users


        return get().users.filter(user =>

          contains(
            user.username,
            keyword
          ) ||

          contains(
            user.fullName,
            keyword
          )

        )

      },



      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const users =
          get().users


        return {

          totalUsers:
            users.length,

          activeUsers:

            users.filter(

              u =>
                u.active

            ).length,


          inactiveUsers:

            users.filter(

              u =>
                !u.active

            ).length

        }

      }

    }),


    {

      name:
        STORAGE_KEYS.USERS,


      partialize:
        state => ({

          users:
            state.users,

          currentUser:
            state.currentUser

        })

    }

  )

)

