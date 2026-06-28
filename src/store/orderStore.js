// src/store/orderStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  STORAGE_KEYS,
  ORDER_STATUS
} from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains,
  toNumber
} from './helpers'

export const useOrderStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      orders: [],

      // ==================================================
      // SET
      // ==================================================

      setOrders: (orders) =>
        set({
          orders: ensureArray(orders)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addOrder: (order) => {

        const newOrder = {

          id: generateId(),

          customerName: '',

          phone: '',

          items: [],

          total: 0,

          discount: 0,

          shipping: 0,

          notes: '',

          paymentMethod: 'cash',

          paymentStatus: 'pending',

          status: ORDER_STATUS.PENDING,

          createdAt: now(),

          updatedAt: now(),

          ...order

        }

        set(state => ({

          orders: [

            newOrder,

            ...state.orders

          ]

        }))

        return newOrder

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateOrder: (id, updates) =>

        set(state => ({

          orders: state.orders.map(order =>

            order.id === id

              ? {

                  ...order,

                  ...updates,

                  updatedAt: now()

                }

              : order

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteOrder: (id) =>

        set(state => ({

          orders:

            state.orders.filter(

              order => order.id !== id

            )

        })),

      // ==================================================
      // STATUS
      // ==================================================

      updateOrderStatus: (id, status) =>

        set(state => ({

          orders: state.orders.map(order =>

            order.id === id

              ? {

                  ...order,

                  status,

                  updatedAt: now()

                }

              : order

          )

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchOrders: (keyword) => {

        if (!keyword)
          return get().orders

        return get().orders.filter(order =>

          contains(order.customerName, keyword) ||

          contains(order.phone, keyword) ||

          contains(order.id, keyword)

        )

      },

      // ==================================================
      // GETTERS
      // ==================================================

      getOrder: (id) =>

        get().orders.find(

          order => order.id === id

        ) || null,

      getOrdersByStatus: (status) =>

        get().orders.filter(

          order => order.status === status

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const orders = get().orders

        const totalOrders = orders.length

        const totalRevenue = orders.reduce(

          (sum, order) =>

            sum + toNumber(order.total),

          0

        )

        const pendingOrders = orders.filter(

          order =>

            order.status === ORDER_STATUS.PENDING

        ).length

        const deliveredOrders = orders.filter(

          order =>

            order.status === ORDER_STATUS.DELIVERED

        ).length

        const cancelledOrders = orders.filter(

          order =>

            order.status === ORDER_STATUS.CANCELLED

        ).length

        return {

          totalOrders,

          totalRevenue,

          pendingOrders,

          deliveredOrders,

          cancelledOrders

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetOrders: () =>

        set({

          orders: []

        })

    }),

    {

      name: STORAGE_KEYS.ORDERS,

      partialize: state => ({

        orders: state.orders

      })

    }

  )

)