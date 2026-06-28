// src/store/productStore.js

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

export const useProductStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      products: [],

      // ==================================================
      // SET
      // ==================================================

      setProducts: (products) =>
        set({
          products: ensureArray(products)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addProduct: (product) => {

        const newProduct = {

          id: generateId(),

          name: '',

          sku: '',

          barcode: '',

          brand: '',

          category: '',

          description: '',

          image: '',

          cost: 0,

          price: 0,

          stock: 0,

          sold: 0,

          active: true,

          featured: false,

          createdAt: now(),

          ...product

        }

        set(state => ({

          products: [

            newProduct,

            ...state.products

          ]

        }))

        return newProduct

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateProduct: (id, updates) =>

        set(state => ({

          products: state.products.map(product =>

            product.id === id

              ? {

                  ...product,

                  ...updates

                }

              : product

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteProduct: (id) =>

        set(state => ({

          products:

            state.products.filter(

              product => product.id !== id

            )

        })),

      // ==================================================
      // STOCK
      // ==================================================

      increaseStock: (id, quantity = 0) =>

        set(state => ({

          products: state.products.map(product =>

            product.id === id

              ? {

                  ...product,

                  stock:

                    toNumber(product.stock) +

                    toNumber(quantity)

                }

              : product

          )

        })),

      decreaseStock: (id, quantity = 0) =>

        set(state => ({

          products: state.products.map(product => {

            if (product.id !== id)
              return product

            const nextStock = Math.max(
              0,
              toNumber(product.stock) - toNumber(quantity)
            )

            return {

              ...product,

              stock: nextStock,

              sold:
                toNumber(product.sold) +
                toNumber(quantity)

            }

          })

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchProducts: (keyword) => {

        if (!keyword)
          return get().products

        return get().products.filter(product =>

          contains(product.name, keyword) ||

          contains(product.brand, keyword) ||

          contains(product.category, keyword) ||

          contains(product.sku, keyword) ||

          contains(product.barcode, keyword)

        )

      },

      // ==================================================
      // HELPERS
      // ==================================================

      getProduct: (id) =>

        get().products.find(
          product => product.id === id
        ) || null,

      getLowStockProducts: (limit = 5) =>

        get().products.filter(product =>

          toNumber(product.stock) <= limit

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const products = get().products

        const totalProducts = products.length

        const totalStock = products.reduce(

          (sum, product) =>

            sum + toNumber(product.stock),

          0

        )

        const totalSold = products.reduce(

          (sum, product) =>

            sum + toNumber(product.sold),

          0

        )

        const inventoryValue = products.reduce(

          (sum, product) =>

            sum +

            toNumber(product.stock) *

            toNumber(product.cost),

          0

        )

        const lowStock = products.filter(

          product =>

            toNumber(product.stock) <= 5

        ).length

        return {

          totalProducts,

          totalStock,

          totalSold,

          inventoryValue,

          lowStock

        }

      }

    }),

    {

      name: STORAGE_KEYS.PRODUCTS,

      partialize: state => ({

        products: state.products

      })

    }

  )

)