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

      searchProducts: (keyword) => {

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

      getProduct: (id) =>

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