import { create } from 'zustand'

const defaultBrands = [

  {
    id: 'bridgestone',
    name: 'Bridgestone'
  },

  {
    id: 'michelin',
    name: 'Michelin'
  },

  {
    id: 'goodyear',
    name: 'Goodyear'
  },

  {
    id: 'continental',
    name: 'Continental'
  },

  {
    id: 'pirelli',
    name: 'Pirelli'
  },

  {
    id: 'yokohama',
    name: 'Yokohama'
  }

]

export const useBrandStore = create(

  (set) => ({

    brands: defaultBrands,

    addBrand: (brand) =>

      set((state) => ({

        brands: [

          ...state.brands,

          {

            id: crypto.randomUUID(),

            ...brand

          }

        ]

      })),

    updateBrand: (

      id,

      data

    ) =>

      set((state) => ({

        brands:

          state.brands.map(

            brand =>

              brand.id === id

                ? {

                    ...brand,

                    ...data

                  }

                : brand

          )

      })),

    deleteBrand: (id) =>

      set((state) => ({

        brands:

          state.brands.filter(

            brand =>

              brand.id !== id

          )

      }))

  })

)