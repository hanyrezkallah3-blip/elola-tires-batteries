// src/store/serviceStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains
} from './helpers'

export const useServiceStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      services: [],

      // ==================================================
      // SET
      // ==================================================

      setServices: (services) =>
        set({
          services: ensureArray(services)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addService: (service) => {

        const newService = {

          id: generateId(),

          title: '',

          description: '',

          image: '',

          category: '',

          price: 0,

          duration: '',

          active: true,

          featured: false,

          createdAt: now(),

          ...service

        }

        set(state => ({

          services: [

            newService,

            ...state.services

          ]

        }))

        return newService

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateService: (id, updates) =>

        set(state => ({

          services: state.services.map(service =>

            service.id === id

              ? {

                  ...service,

                  ...updates

                }

              : service

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteService: (id) =>

        set(state => ({

          services:

            state.services.filter(

              service => service.id !== id

            )

        })),

      // ==================================================
      // ACTIVATE
      // ==================================================

      activateService: (id) =>

        set(state => ({

          services: state.services.map(service =>

            service.id === id

              ? {

                  ...service,

                  active: true

                }

              : service

          )

        })),

      // ==================================================
      // DEACTIVATE
      // ==================================================

      deactivateService: (id) =>

        set(state => ({

          services: state.services.map(service =>

            service.id === id

              ? {

                  ...service,

                  active: false

                }

              : service

          )

        })),

      // ==================================================
      // FEATURED
      // ==================================================

      setFeatured: (id, featured = true) =>

        set(state => ({

          services: state.services.map(service =>

            service.id === id

              ? {

                  ...service,

                  featured

                }

              : service

          )

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchServices: (keyword) => {

        if (!keyword)
          return get().services

        return get().services.filter(service =>

          contains(service.title, keyword) ||

          contains(service.description, keyword) ||

          contains(service.category, keyword)

        )

      },

      // ==================================================
      // GETTERS
      // ==================================================

      getService: (id) =>

        get().services.find(

          service => service.id === id

        ) || null,

      getActiveServices: () =>

        get().services.filter(

          service => service.active

        ),

      getFeaturedServices: () =>

        get().services.filter(

          service =>

            service.active &&

            service.featured

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const services = get().services

        return {

          totalServices:

            services.length,

          activeServices:

            services.filter(

              service => service.active

            ).length,

          inactiveServices:

            services.filter(

              service => !service.active

            ).length,

          featuredServices:

            services.filter(

              service =>

                service.active &&

                service.featured

            ).length

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetServices: () =>

        set({

          services: []

        })

    }),

    {

      name: `${STORAGE_KEYS.PRODUCTS}-services`,

      partialize: state => ({

        services: state.services

      })

    }

  )

)