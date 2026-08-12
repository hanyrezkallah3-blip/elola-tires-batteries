import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains
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

          products:
            ensureArray(products)

        }),


      // ==================================================
      // CREATE
      // ==================================================

      addProduct: (product = {}) => {

        const newProduct = {

          id:
            generateId(),

          // ================= BASIC =================

          name: '',

          sku: '',

          barcode: '',

          brand: '',

          model: '',

          category: '',

          description: '',

          image: '',


          // ================= PRICING =================

          purchasePrice: 0,

          salePrice: 0,

          averagePurchasePrice: 0,

          profit: 0,

          profitMargin: 0,


          // ================= PRICE VISIBILITY =================

          purchasePriceVisible:
            product.purchasePriceVisible ??
            false,

          salePriceVisible:
            product.salePriceVisible ??
            true,


          // ================= STATUS =================

          active: true,

          featured: false,


          createdAt:
            now(),

          updatedAt:
            now(),


          // ================= TYPE =================

          type: 'tire',


          // ================= TIRE =================

          tire: {

            width: null,

            height: null,

            rim: null,

            loadIndex: '',

            speedRating: '',

            season: '',

            runFlat: false

          },


          // ================= BATTERY =================

          battery: {

            capacity: null,

            cca: null,

            voltage: 12,

            technology: '',

            polarity: '',

            terminalType: ''

          },


          // ================= OIL =================

          oil: {

            viscosity: '',

            standard: '',

            oilType: ''

          },


          // ================= VEHICLES =================

          compatibleVehicles: [],


          // ================= EXTRA =================

          specifications: {},

          attributes: {},

          tags: [],


          ...product,

          // ==========================================
          // NORMALIZE PRICE VISIBILITY AFTER SPREAD
          // ==========================================

          purchasePriceVisible:
            product.purchasePriceVisible ??
            false,

          salePriceVisible:
            product.salePriceVisible ??
            true,

          createdAt:
            product.createdAt ||
            now(),

          updatedAt:
            now()

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

      updateProduct: (
        id,
        updates = {}
      ) =>

        set(state => ({

          products:

            state.products.map(product =>

              product.id === id

                ? {

                    ...product,

                    ...updates,

                    updatedAt:
                      now()

                  }

                :

                  product

            )

        })),


      // ==================================================
      // UPDATE SELLING PRICE
      // ==================================================

      updateProductPrice: (
        id,
        salePrice
      ) => {

        const value =
          Number(salePrice)

        if (
          !Number.isFinite(value) ||
          value < 0
        ) {

          return {

            success: false,

            message:
              'سعر البيع غير صحيح'

          }

        }


        set(state => ({

          products:

            state.products.map(product => {

              if (
                product.id !== id
              ) {

                return product

              }


              const purchase =
                Number(
                  product.purchasePrice || 0
                )

              const profit =
                value -
                purchase

              const profitMargin =
                value > 0
                  ? (
                      profit /
                      value
                    ) * 100
                  : 0


              return {

                ...product,

                salePrice:
                  value,

                profit,

                profitMargin,

                updatedAt:
                  now()

              }

            })

        }))


        return {

          success: true

        }

      },


      // ==================================================
      // TOGGLE PURCHASE PRICE VISIBILITY
      // ==================================================

      togglePurchasePriceVisibility: (
        id
      ) => {

        let updatedProduct = null


        set(state => ({

          products:

            state.products.map(product => {

              if (
                product.id !== id
              ) {

                return product

              }


              updatedProduct = {

                ...product,

                purchasePriceVisible:
                  product.purchasePriceVisible !== false
                    ? false
                    : true,

                updatedAt:
                  now()

              }


              return updatedProduct

            })

        }))


        return updatedProduct

      },


      // ==================================================
      // TOGGLE SALE PRICE VISIBILITY
      // ==================================================

      toggleSalePriceVisibility: (
        id
      ) => {

        let updatedProduct = null


        set(state => ({

          products:

            state.products.map(product => {

              if (
                product.id !== id
              ) {

                return product

              }


              updatedProduct = {

                ...product,

                salePriceVisible:
                  product.salePriceVisible === false
                    ? true
                    : false,

                updatedAt:
                  now()

              }


              return updatedProduct

            })

        }))


        return updatedProduct

      },


      // ==================================================
      // DELETE
      // ==================================================

      deleteProduct: (id) =>

        set(state => ({

          products:

            state.products.filter(

              product =>

                product.id !== id

            )

        })),


      // ==================================================
      // SEARCH
      // ==================================================

      searchProducts: (
        keyword
      ) => {

        if (!keyword)

          return get().products


        return get().products.filter(product =>

          contains(
            product.name,
            keyword
          )

          ||

          contains(
            product.brand,
            keyword
          )

          ||

          contains(
            product.category,
            keyword
          )

          ||

          contains(
            product.sku,
            keyword
          )

          ||

          contains(
            product.barcode,
            keyword
          )

        )

      },


      // ==================================================
      // HELPERS
      // ==================================================

      getProduct: (
        id
      ) =>

        get().products.find(

          product =>

            product.id === id

        ) || null,


      getProductsCount: () =>

        get().products.length,


      getActiveProducts: () =>

        get().products.filter(

          product =>

            product.active

        )

    }),

    {

      name:
        STORAGE_KEYS.PRODUCTS,

      partialize: state => ({

        products:
          state.products

      })

    }

  )
)