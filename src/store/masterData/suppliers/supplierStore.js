import { create } from 'zustand'

const defaultSuppliers = []

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

            ...supplier

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

                    ...data

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