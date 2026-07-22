// src/store/userStore.js

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

        const user = get().users.find(

          u =>

            u.username === username &&

            u.password === password &&

            u.active !== false

        )


        if (!user) {

          return false

        }


        set({

          currentUser: user

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



      // ==================================================
      // SETTERS
      // ==================================================

      setUsers: (users) =>

        set({

          users: ensureArray(users)

        }),



      // ==================================================
      // CREATE
      // ==================================================

      addUser: (user) => {

        const users = get().users


        const exists = users.some(

          u => u.username === user.username

        )


        if (exists) {

          return {

            success: false,

            message: 'اسم المستخدم موجود بالفعل'

          }

        }


        const newUser = {

          id: generateId(),

          username: '',

          password: '',

          fullName: '',

          role: 'employee',

          active: true,

          warehouseId: null,

          warehouseName: '',

          financeAccess: false,

          walletAccess: false,

          permissions:

            ROLE_PERMISSIONS[user.role] || [],

          createdAt: now(),

          ...user

        }


        set(state => ({

          users: [

            ...state.users,

            newUser

          ]

        }))


        return {

          success: true,

          user: newUser

        }

      },



      // ==================================================
      // UPDATE
      // ==================================================

      updateUser: (id, updates) =>

        set(state => ({

          users: state.users.map(user => {


            if (user.id !== id)

              return user


            return {

              ...user,

              ...updates,

              permissions:

                updates.role

                  ? ROLE_PERMISSIONS[updates.role] || []

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

                user.id !== DEFAULT_OWNER.id

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

                    active: true

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

                    active: false

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

          contains(user.username, keyword) ||

          contains(user.fullName, keyword)

        )

      },



      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const users = get().users


        return {

          totalUsers: users.length,

          activeUsers:

            users.filter(

              u => u.active

            ).length,


          inactiveUsers:

            users.filter(

              u => !u.active

            ).length

        }

      }


    }),


    {

      name: STORAGE_KEYS.USERS,


      partialize: state => ({

        users: state.users,

        currentUser: state.currentUser

      })

    }

  )

)