// src/store/customerStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains,
  toNumber
} from './helpers'

export const useCustomerStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      customers: [],

      // ==================================================
      // SET
      // ==================================================

      setCustomers: (customers) =>
        set({
          customers: ensureArray(customers)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addCustomer: (customer) => {

        const newCustomer = {

          id: generateId(),

          name: '',

          phone: '',

          email: '',

          address: '',

          city: '',

          notes: '',

          active: true,

          totalOrders: 0,

          totalSpent: 0,

          walletBalance: 0,

          createdAt: now(),

          updatedAt: now(),

          ...customer

        }

        set(state => ({

          customers: [

            newCustomer,

            ...state.customers

          ]

        }))

        return newCustomer

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateCustomer: (id, updates) =>

        set(state => ({

          customers: state.customers.map(customer =>

            customer.id === id

              ? {

                  ...customer,

                  ...updates,

                  updatedAt: now()

                }

              : customer

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteCustomer: (id) =>

        set(state => ({

          customers:

            state.customers.filter(

              customer => customer.id !== id

            )

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchCustomers: (keyword) => {

        if (!keyword)
          return get().customers

        return get().customers.filter(customer =>

          contains(customer.name, keyword) ||

          contains(customer.phone, keyword) ||

          contains(customer.email, keyword) ||

          contains(customer.city, keyword)

        )

      },

      // ==================================================
      // GETTERS
      // ==================================================

      getCustomer: (id) =>

        get().customers.find(

          customer => customer.id === id

        ) || null,

      getCustomerByPhone: (phone) =>

        get().customers.find(

          customer => customer.phone === phone

        ) || null,

      // ==================================================
      // BUSINESS
      // ==================================================

      increaseOrders: (id, amount = 0) =>

        set(state => ({

          customers: state.customers.map(customer =>

            customer.id === id

              ? {

                  ...customer,

                  totalOrders:

                    toNumber(customer.totalOrders) + 1,

                  totalSpent:

                    toNumber(customer.totalSpent) +

                    toNumber(amount),

                  updatedAt: now()

                }

              : customer

          )

        })),

      updateWalletBalance: (id, balance) =>

        set(state => ({

          customers: state.customers.map(customer =>

            customer.id === id

              ? {

                  ...customer,

                  walletBalance:

                    toNumber(balance),

                  updatedAt: now()

                }

              : customer

          )

        })),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const customers = get().customers

        return {

          totalCustomers:

            customers.length,

          activeCustomers:

            customers.filter(

              customer => customer.active

            ).length,

          inactiveCustomers:

            customers.filter(

              customer => !customer.active

            ).length,

          totalSpent:

            customers.reduce(

              (sum, customer) =>

                sum +

                toNumber(customer.totalSpent),

              0

            ),

          totalOrders:

            customers.reduce(

              (sum, customer) =>

                sum +

                toNumber(customer.totalOrders),

              0

            )

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetCustomers: () =>

        set({

          customers: []

        })

    }),

    {

      name: 'elola-customers',

      partialize: (state) => ({

        customers: state.customers

      })

    }

  )

)