import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const STORAGE_KEY = 'elola_warehouses'


const INITIAL_WAREHOUSES = []


export const useWarehouseStore = create(

  persist(

    (set, get) => ({

      warehouses: INITIAL_WAREHOUSES,


      // ==========================================
      // ADD
      // ==========================================

      addWarehouse: (warehouse) => {

        const newWarehouse = {

          id:

            warehouse.id ||

            crypto.randomUUID(),


          name:

            warehouse.name || '',


          type:

            warehouse.type || 'main',


          location:

            warehouse.location || '',


          phone:

            warehouse.phone || '',


          manager:

            warehouse.manager || '',


          active: true,


          products: [],


          transactions: [],


          createdAt:

            new Date()

              .toISOString()

        }


        set(state => ({

          warehouses: [

            ...state.warehouses,

            newWarehouse

          ]

        }))


        return newWarehouse

      },


      // ==========================================
      // UPDATE
      // ==========================================

      updateWarehouse: (id, data) =>

        set(state => ({

          warehouses:

            state.warehouses.map(

              warehouse =>

                warehouse.id === id

                  ? {

                      ...warehouse,

                      ...data

                    }

                  :

                    warehouse

            )

        })),


      // ==========================================
      // DELETE
      // ==========================================

      deleteWarehouse: (id) =>

        set(state => ({

          warehouses:

            state.warehouses.filter(

              warehouse =>

                warehouse.id !== id

            )

        })),


      // ==========================================
      // GET
      // ==========================================

      getWarehouse: (id) =>

        get()

          .warehouses

          .find(

            warehouse =>

              warehouse.id === id

          ) || null,


      // ==========================================
      // STOCK TRANSACTIONS
      // ==========================================

      addTransaction: (

        warehouseId,

        transaction

      ) =>

        set(state => ({

          warehouses:

            state.warehouses.map(

              warehouse => {


                if (

                  warehouse.id !== warehouseId

                )

                  return warehouse



                return {

                  ...warehouse,


                  transactions: [

                    ...(warehouse.transactions || []),

                    {

                      id:

                        crypto.randomUUID(),


                      type:

                        transaction.type || 'in',


                      quantity:

                        Number(

                          transaction.quantity || 0

                        ),


                      productId:

                        transaction.productId || '',


                      productName:

                        transaction.productName || '',


                      createdAt:

                        new Date()

                          .toISOString()

                    }

                  ]

                }

              }

            )

        })),


      // ==========================================
      // PRODUCTS LINK
      // ==========================================

      addProductToWarehouse: (

        warehouseId,

        product

      ) =>

        set(state => ({

          warehouses:

            state.warehouses.map(

              warehouse => {


                if (

                  warehouse.id !== warehouseId

                )

                  return warehouse



                return {

                  ...warehouse,


                  products: [

                    ...(warehouse.products || []),

                    product

                  ]

                }

              }

            )

        }))

    }),


    {

      name: STORAGE_KEY

    }

  )

)