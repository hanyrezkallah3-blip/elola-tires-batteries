import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () =>
  Date.now().toString() +
  Math.random().toString(36).slice(2)

const now = () =>
  new Date().toISOString()

const countBy = (items, key) => {

  const map = {}

  items.forEach(item => {

    const value = item[key]

    if (!value)
      return

    map[value] =

      (map[value] || 0) + 1

  })

  return Object.entries(map)

    .sort((a, b) => b[1] - a[1])

}

export const useVehicleDemandStore = create(

  persist(

    (set, get) => ({

      searchHistory: [],

      addSearch: (search) =>

        set(state => ({

          searchHistory: [

            {

              id: generateId(),

              createdAt: now(),

              found: false,

              missingProducts: [],

              ...search

            },

            ...state.searchHistory

          ]

        })),

      updateSearch: (id, data) =>

        set(state => ({

          searchHistory:

            state.searchHistory.map(item =>

              item.id === id

                ? {

                    ...item,

                    ...data

                  }

                : item

            )

        })),

      clearHistory: () =>

        set({

          searchHistory: []

        }),

      getHistory: () =>

        get().searchHistory,

      getMostRequestedBrands: () =>

        countBy(

          get().searchHistory,

          'make'

        ),

      getMostRequestedModels: () =>

        countBy(

          get().searchHistory,

          'model'

        ),

      getMostRequestedYears: () =>

        countBy(

          get().searchHistory,

          'year'

        ),

      getMissingSearches: () =>

        get()

          .searchHistory

          .filter(

            item => !item.found

          ),

      getFoundSearches: () =>

        get()

          .searchHistory

          .filter(

            item => item.found

          )

    }),

    {

      name:

        'vehicle-demand-store',

      partialize: state => ({

        searchHistory:

          state.searchHistory

      })

    }

  )

)

export default useVehicleDemandStore