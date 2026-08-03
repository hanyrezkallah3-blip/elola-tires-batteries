import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import createWarehouse from './warehouse/helpers/createWarehouse'
import addProductToWarehouseHelper from './warehouse/helpers/addProductToWarehouse'


const STORAGE_KEY = 'elola_warehouses'


const generateId = () =>

  crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString() +
      Math.random().toString(36).slice(2)



const createProduct = (product = {}) => ({

  id:

    product.id ||

    generateId(),


  productId:

    product.productId ||

    generateId(),


  productName:

    product.productName ||

    '',


  image:

    product.image ||

    '',


  description:

    product.description ||

    '',


  specifications:

    product.specifications ||

    {},


  category:

    product.category ||

    '',


  brand:

    product.brand ||

    '',


  barcode:

    product.barcode ||

    '',


  quantity:

    Number(product.quantity || 0),


  purchasePrice:

    Number(product.purchasePrice || 0),


  salePrice:

    Number(product.salePrice || 0),


  minimumStock:

    Number(product.minimumStock || 0),


  maximumStock:

    Number(product.maximumStock || 0),


  unit:

    product.unit ||

    'piece',


  createdAt:

    new Date().toISOString(),


  updatedAt:

    new Date().toISOString(),


  ...product

})



export const useWarehouseStore = create(

  persist(

    (set, get) => ({


      // ==========================================
      // CORE
      // ==========================================


      warehouses: [],



      // ==========================================
      // ADD WAREHOUSE
      // ==========================================


      addWarehouse: (warehouse = {}) => {


        const newWarehouse = createWarehouse(warehouse)



        set(state => ({


          warehouses: [

            ...state.warehouses,

            newWarehouse

          ]


        }))



        return newWarehouse


      },



      // ==========================================
      // UPDATE WAREHOUSE
      // ==========================================


      updateWarehouse: (

        id,

        data

      ) =>


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
      // DELETE WAREHOUSE
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
      // GET WAREHOUSE
      // ==========================================


      getWarehouse: (id) =>


        get()

          .warehouses

          .find(

            warehouse =>

              warehouse.id === id

          ) || null,



      // ==========================================
      // ADD PRODUCT TO WAREHOUSE
      // ==========================================


      addProductToWarehouse: (

        warehouseId,

        product

      ) =>


        set(state => ({


          warehouses: addProductToWarehouseHelper(

            state.warehouses,

            warehouseId,

            product

          )

        })),
              // ==========================================
      // UPDATE WAREHOUSE PRODUCT
      // ==========================================


      updateWarehouseProduct: (

        warehouseId,

        productId,

        data = {}

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


                  products:

                    (warehouse.products || [])

                      .map(

                        product =>


                          product.productId === productId

                            ? {

                                ...product,

                                ...data,

                                updatedAt:

                                  new Date()

                                    .toISOString()

                              }

                            :

                              product

                      )


                }


              }

            )


        })),



      // ==========================================
      // REMOVE PRODUCT
      // ==========================================


      removeProductFromWarehouse: (

        warehouseId,

        productId

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


                  products:

                    (warehouse.products || [])

                      .filter(

                        product =>

                          product.productId !== productId

                      )


                }


              }

            )


        })),



      // ==========================================
      // GET PRODUCTS BY WAREHOUSE
      // ==========================================


      getWarehouseProducts: (

        warehouseId

      ) => {


        const warehouse =

          get()

            .warehouses

            .find(

              item =>

                item.id === warehouseId

            )



        return (

          warehouse?.products ||

          []

        )


      },



      // ==========================================
      // GET PRODUCT FROM ALL WAREHOUSES
      // ==========================================


      getProductAvailability: (

        productId

      ) => {


        const results = []



        get()

          .warehouses

          .forEach(

            warehouse => {


              const product =

                (warehouse.products || [])

                  .find(

                    item =>

                      item.productId === productId

                  )



              if (product) {


                results.push({


                  warehouseId:

                    warehouse.id,


                  warehouseName:

                    warehouse.name,


                  quantity:

                    product.quantity,


                  salePrice:

                    product.salePrice,


                  purchasePrice:

                    product.purchasePrice,


                  product

                })


              }


            }

          )



        return results


      },



      // ==========================================
      // SEARCH PRODUCTS
      // ==========================================


      searchProducts: (

        query = ''

      ) => {


        const value =

          query

            .toLowerCase()

            .trim()



        if (!value)

          return []



        const results = []



        get()

          .warehouses

          .forEach(

            warehouse => {


              (warehouse.products || [])

                .forEach(

                  product => {


                    if (


                      product.productName

                        .toLowerCase()

                        .includes(value)


                      ||


                      product.barcode

                        .toLowerCase()

                        .includes(value)


                      ||


                      product.brand

                        .toLowerCase()

                        .includes(value)


                    ) {


                      results.push({


                        ...product,


                        warehouseId:

                          warehouse.id,


                        warehouseName:

                          warehouse.name


                      })


                    }


                  }

                )


            }

          )



        return results


      },
            // ==========================================
      // GET ALL PRODUCTS
      // ==========================================


      getAllProducts: () => {


        const products = []



        get()

          .warehouses

          .forEach(

            warehouse => {


              (warehouse.products || [])

                .forEach(

                  product => {


                    products.push({


                      ...product,


                      warehouseId:

                        warehouse.id,


                      warehouseName:

                        warehouse.name


                    })


                  }

                )


            }

          )



        return products


      },



      // ==========================================
      // PRODUCT EXISTS
      // ==========================================


      productExistsInWarehouse: (

        warehouseId,

        productId

      ) => {


        const warehouse =

          get()

            .warehouses

            .find(

              item =>

                item.id === warehouseId

            )



        return Boolean(

          warehouse?.products

            ?.some(

              product =>

                product.productId === productId

            )

        )


      },



      // ==========================================
      // TRANSACTIONS
      // ==========================================


      addTransaction: (

        warehouseId,

        transaction = {}

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

                        generateId(),


                      type:

                        transaction.type || 'in',


                      productId:

                        transaction.productId || '',


                      productName:

                        transaction.productName || '',


                      quantity:

                        Number(

                          transaction.quantity || 0

                        ),


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
      // CLEAR
      // ==========================================


      clearWarehouses: () =>


        set({

          warehouses: []

        })


    }),


    {

      name: STORAGE_KEY

    }

  )

)