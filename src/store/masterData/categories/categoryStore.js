import { create } from 'zustand'

const defaultCategories = [

  {
    id: 'tires',
    name: 'الإطارات'
  },

  {
    id: 'batteries',
    name: 'البطاريات'
  },

  {
    id: 'oils',
    name: 'الزيوت'
  },

  {
    id: 'filters',
    name: 'الفلاتر'
  },

  {
    id: 'spare-parts',
    name: 'قطع الغيار'
  },

  {
    id: 'services',
    name: 'الخدمات'
  }

]

export const useCategoryStore = create(

  (set) => ({

    categories: defaultCategories,

    addCategory: (category) =>

      set((state) => ({

        categories: [

          ...state.categories,

          {

            id: crypto.randomUUID(),

            ...category

          }

        ]

      })),

    updateCategory: (

      id,

      data

    ) =>

      set((state) => ({

        categories:

          state.categories.map(

            item =>

              item.id === id

                ? {

                    ...item,

                    ...data

                  }

                : item

          )

      })),

    deleteCategory: (id) =>

      set((state) => ({

        categories:

          state.categories.filter(

            item =>

              item.id !== id

          )

      }))

  })

)