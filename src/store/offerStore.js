// src/store/offerStore.js

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

export const useOfferStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      offers: [],

      // ==================================================
      // SET
      // ==================================================

      setOffers: (offers) =>
        set({
          offers: ensureArray(offers)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addOffer: (offer) => {

        const newOffer = {

          id: generateId(),

          title: '',

          description: '',

          image: '',

          discount: 0,

          productId: null,

          active: true,

          startDate: '',

          endDate: '',

          createdAt: now(),

          ...offer

        }

        set(state => ({

          offers: [

            newOffer,

            ...state.offers

          ]

        }))

        return newOffer

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateOffer: (id, updates) =>

        set(state => ({

          offers: state.offers.map(offer =>

            offer.id === id

              ? {

                  ...offer,

                  ...updates

                }

              : offer

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteOffer: (id) =>

        set(state => ({

          offers:

            state.offers.filter(

              offer => offer.id !== id

            )

        })),

      // ==================================================
      // ENABLE / DISABLE
      // ==================================================

      enableOffer: (id) =>

        set(state => ({

          offers: state.offers.map(offer =>

            offer.id === id

              ? {

                  ...offer,

                  active: true

                }

              : offer

          )

        })),

      disableOffer: (id) =>

        set(state => ({

          offers: state.offers.map(offer =>

            offer.id === id

              ? {

                  ...offer,

                  active: false

                }

              : offer

          )

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchOffers: (keyword) => {

        if (!keyword)
          return get().offers

        return get().offers.filter(offer =>

          contains(offer.title, keyword) ||

          contains(offer.description, keyword)

        )

      },

      // ==================================================
      // ACTIVE OFFERS
      // ==================================================

      getActiveOffers: () =>

        get().offers.filter(

          offer => offer.active

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const offers = get().offers

        return {

          totalOffers: offers.length,

          activeOffers:

            offers.filter(

              offer => offer.active

            ).length,

          inactiveOffers:

            offers.filter(

              offer => !offer.active

            ).length,

          averageDiscount:

            offers.length

              ? offers.reduce(

                  (sum, offer) =>

                    sum + toNumber(offer.discount),

                  0

                ) / offers.length

              : 0

        }

      }

    }),

    {

      name: `${STORAGE_KEYS.PRODUCTS}-offers`,

      partialize: state => ({

        offers: state.offers

      })

    }

  )

)