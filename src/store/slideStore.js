// src/store/slideStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains
} from './helpers'

export const useSlideStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      slides: [],

      // ==================================================
      // SET
      // ==================================================

      setSlides: (slides) =>
        set({
          slides: ensureArray(slides)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addSlide: (slide) => {

        const order =
          get().slides.length + 1

        const newSlide = {

          id: generateId(),

          title: '',

          subtitle: '',

          description: '',

          image: '',

          buttonText: '',

          buttonLink: '',

          active: true,

          featured: false,

          order,

          createdAt: now(),

          ...slide

        }

        set(state => ({

          slides: [

            ...state.slides,

            newSlide

          ]

        }))

        return newSlide

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateSlide: (id, updates) =>

        set(state => ({

          slides: state.slides.map(slide =>

            slide.id === id

              ? {

                  ...slide,

                  ...updates

                }

              : slide

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteSlide: (id) =>

        set(state => ({

          slides:

            state.slides.filter(

              slide => slide.id !== id

            )

        })),

      // ==================================================
      // ACTIVATE
      // ==================================================

      activateSlide: (id) =>

        set(state => ({

          slides: state.slides.map(slide =>

            slide.id === id

              ? {

                  ...slide,

                  active: true

                }

              : slide

          )

        })),

      deactivateSlide: (id) =>

        set(state => ({

          slides: state.slides.map(slide =>

            slide.id === id

              ? {

                  ...slide,

                  active: false

                }

              : slide

          )

        })),

      // ==================================================
      // FEATURED
      // ==================================================

      setFeatured: (id, featured = true) =>

        set(state => ({

          slides: state.slides.map(slide =>

            slide.id === id

              ? {

                  ...slide,

                  featured

                }

              : slide

          )

        })),

      // ==================================================
      // ORDER
      // ==================================================

      moveSlide: (id, direction) =>

        set(state => {

          const slides = [...state.slides]

          const index = slides.findIndex(
            slide => slide.id === id
          )

          if (index === -1)
            return { slides }

          const target =
            direction === 'up'
              ? index - 1
              : index + 1

          if (
            target < 0 ||
            target >= slides.length
          ) {
            return { slides }
          }

          ;[
            slides[index],
            slides[target]
          ] = [
            slides[target],
            slides[index]
          ]

          const normalized = slides.map(
            (slide, i) => ({
              ...slide,
              order: i + 1
            })
          )

          return {

            slides: normalized

          }

        }),

      // ==================================================
      // SEARCH
      // ==================================================

      searchSlides: (keyword) => {

        if (!keyword)
          return get().slides

        return get().slides.filter(slide =>

          contains(slide.title, keyword) ||

          contains(slide.subtitle, keyword) ||

          contains(slide.description, keyword)

        )

      },

      // ==================================================
      // GETTERS
      // ==================================================

      getSlide: (id) =>

        get().slides.find(

          slide => slide.id === id

        ) || null,

      getActiveSlides: () =>

        [...get().slides]
          .filter(slide => slide.active)
          .sort((a, b) => a.order - b.order),

      getFeaturedSlides: () =>

        get().slides.filter(

          slide =>

            slide.active &&

            slide.featured

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const slides = get().slides

        return {

          totalSlides:

            slides.length,

          activeSlides:

            slides.filter(

              slide => slide.active

            ).length,

          inactiveSlides:

            slides.filter(

              slide => !slide.active

            ).length,

          featuredSlides:

            slides.filter(

              slide =>

                slide.active &&

                slide.featured

            ).length

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetSlides: () =>

        set({

          slides: []

        })

    }),

    {

      name: `${STORAGE_KEYS.PRODUCTS}-slides`,

      partialize: state => ({

        slides: state.slides

      })

    }

  )

)