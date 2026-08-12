import { create } from 'zustand'

const defaultSuppliers = [

  {
    id: 'michelin-eg',
    name: 'Michelin Egypt'
  },

  {
    id: 'bridgestone-eg',
    name: 'Bridgestone Egypt'
  },

  {
    id: 'goodyear-eg',
    name: 'Goodyear Egypt'
  },

  {
    id: 'continental-eg',
    name: 'Continental Egypt'
  },

  {
    id: 'pirelli-eg',
    name: 'Pirelli Egypt'
  }

]

export const useSupplierStore = create(

  (set) => ({

    suppliers: defaultSuppliers,

    addSupplier: (supplier) =>

      set((state) => ({

        suppliers: [

          ...state.suppliers,

          {

            id: crypto.randomUUID(),

            code: '',

            name: '',

            companyName: '',

            contactPerson: '',

            phone: '',

            mobile: '',

            email: '',

            website: '',

            taxNumber: '',

            commercialRegister: '',

            country: '',

            city: '',

            address: '',

            currency: 'EGP',

            paymentTerms: '',

            creditLimit: 0,

            notes: '',

            active: true,

            createdAt:

              new Date().toISOString(),

            ...supplier,

            name:

              supplier.name ||

              supplier.companyName ||

              ''

          }

        ]

      })),

    updateSupplier: (

      id,

      data

    ) =>

      set((state) => ({

        suppliers:

          state.suppliers.map(

            supplier =>

              supplier.id === id

                ? {

                    ...supplier,

                    ...data,

                    name:

                      data.name ||

                      data.companyName ||

                      supplier.name

                  }

                : supplier

          )

      })),

    deleteSupplier: (id) =>

      set((state) => ({

        suppliers:

          state.suppliers.filter(

            supplier =>

              supplier.id !== id

          )

      }))

  })

)