// src/store/videoStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  contains
} from './helpers'

export const useVideoStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      videos: [],

      // ==================================================
      // SET
      // ==================================================

      setVideos: (videos) =>
        set({
          videos: ensureArray(videos)
        }),

      // ==================================================
      // CREATE
      // ==================================================

      addVideo: (video) => {

        const newVideo = {

          id: generateId(),

          title: '',

          description: '',

          url: '',

          thumbnail: '',

          category: '',

          active: true,

          featured: false,

          views: 0,

          createdAt: now(),

          ...video

        }

        set(state => ({

          videos: [

            newVideo,

            ...state.videos

          ]

        }))

        return newVideo

      },

      // ==================================================
      // UPDATE
      // ==================================================

      updateVideo: (id, updates) =>

        set(state => ({

          videos: state.videos.map(video =>

            video.id === id

              ? {

                  ...video,

                  ...updates

                }

              : video

          )

        })),

      // ==================================================
      // DELETE
      // ==================================================

      deleteVideo: (id) =>

        set(state => ({

          videos:

            state.videos.filter(

              video => video.id !== id

            )

        })),

      // ==================================================
      // ACTIVATE
      // ==================================================

      activateVideo: (id) =>

        set(state => ({

          videos: state.videos.map(video =>

            video.id === id

              ? {

                  ...video,

                  active: true

                }

              : video

          )

        })),

      // ==================================================
      // DEACTIVATE
      // ==================================================

      deactivateVideo: (id) =>

        set(state => ({

          videos: state.videos.map(video =>

            video.id === id

              ? {

                  ...video,

                  active: false

                }

              : video

          )

        })),

      // ==================================================
      // FEATURED
      // ==================================================

      setFeatured: (id, featured = true) =>

        set(state => ({

          videos: state.videos.map(video =>

            video.id === id

              ? {

                  ...video,

                  featured

                }

              : video

          )

        })),

      // ==================================================
      // VIEWS
      // ==================================================

      increaseViews: (id) =>

        set(state => ({

          videos: state.videos.map(video =>

            video.id === id

              ? {

                  ...video,

                  views: Number(video.views || 0) + 1

                }

              : video

          )

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchVideos: (keyword) => {

        if (!keyword)
          return get().videos

        return get().videos.filter(video =>

          contains(video.title, keyword) ||

          contains(video.description, keyword) ||

          contains(video.category, keyword)

        )

      },

      // ==================================================
      // GETTERS
      // ==================================================

      getVideo: (id) =>

        get().videos.find(

          video => video.id === id

        ) || null,

      getActiveVideos: () =>

        get().videos.filter(

          video => video.active

        ),

      getFeaturedVideos: () =>

        get().videos.filter(

          video =>

            video.active &&

            video.featured

        ),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const videos = get().videos

        return {

          totalVideos:

            videos.length,

          activeVideos:

            videos.filter(

              video => video.active

            ).length,

          inactiveVideos:

            videos.filter(

              video => !video.active

            ).length,

          featuredVideos:

            videos.filter(

              video =>

                video.active &&

                video.featured

            ).length,

          totalViews:

            videos.reduce(

              (sum, video) =>

                sum + Number(video.views || 0),

              0

            )

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetVideos: () =>

        set({

          videos: []

        })

    }),

    {

      name: `${STORAGE_KEYS.PRODUCTS}-videos`,

      partialize: state => ({

        videos: state.videos

      })

    }

  )

)