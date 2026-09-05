// ======================================================
// Elola ERP Enterprise
// Warehouse Store
// ======================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import createWarehouse
  from './warehouse/helpers/createWarehouse'

import addProductToWarehouseHelper
  from './warehouse/helpers/addProductToWarehouse'

import addWarehouseTransaction
  from './warehouse/helpers/addWarehouseTransaction'

import ProductEngine
  from '../core/engines/product/ProductEngine'


const STORAGE_KEY =
  'elola_warehouses'


// ==========================================
// GENERATE ID
// ==========================================

const generateId = () => {

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {

    return crypto.randomUUID()

  }

  return (
    Date.now().toString() +
    Math.random()
      .toString(36)
      .slice(2)
  )

}


// ==========================================
// NORMALIZE PRODUCT
// ==========================================

const normalizeProduct = (
  product = {}
) => {

  const productId =
    product.productId ||
    product.id ||
    generateId()


  const productName =
    String(
      product.productName ||
      product.name ||
      ''
    ).trim()


  const quantity =
    Number(
      product.quantity || 0
    )


  return {

    ...product,

    id:
      product.id ||
      productId,

    productId,

    productName,

    name:
      product.name ||
      productName,

    quantity,

    incoming:
      Number(
        product.incoming || 0
      ),

    outgoing:
      Number(
        product.outgoing || 0
      ),

    reserved:
      Number(
        product.reserved || 0
      ),

    availableQuantity:
      Number(
        product.availableQuantity ??
        quantity ??
        0
      ),

    purchasePrice:
      Number(
        product.purchasePrice || 0
      ),

    salePrice:
      Number(
        product.salePrice || 0
      ),

    wholesalePrice:
      Number(
        product.wholesalePrice || 0
      ),

    minimumStock:
      Number(
        product.minimumStock || 0
      ),

    maximumStock:
      Number(
        product.maximumStock || 0
      ),

    reorderPoint:
      Number(
        product.reorderPoint || 0
      ),

    active:
      product.active !== false,

    updatedAt:
      new Date().toISOString()

  }

}


// ==========================================
// STORE
// ==========================================

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

      addWarehouse: (
        warehouse = {}
      ) => {

        const newWarehouse =
          createWarehouse(
            warehouse
          )


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
        data = {}
      ) =>

        set(state => ({

          warehouses:

            state.warehouses.map(
              warehouse =>

                String(
                  warehouse.id
                ) ===
                String(id)

                  ? {

                      ...warehouse,

                      ...data,

                      updatedAt:
                        new Date()
                          .toISOString()

                    }

                  : warehouse
            )

        })),


      // ==========================================
      // DELETE WAREHOUSE
      // ==========================================

      deleteWarehouse: (
        id
      ) =>

        set(state => ({

          warehouses:

            state.warehouses.filter(
              warehouse =>

                String(
                  warehouse.id
                ) !==
                String(id)

            )

        })),


      // ==========================================
      // GET WAREHOUSE
      // ==========================================

      getWarehouse: (
        id
      ) =>

        get()
          .warehouses
          .find(
            warehouse =>

              String(
                warehouse.id
              ) ===
              String(id)

          ) || null,


      // ==================================================
      // ADD PRODUCT FROM WAREHOUSE PAGE
      // ==================================================
      //
      // IMPORTANT ARCHITECTURE
      //
      // Warehouse page is the ONLY place where a new
      // product is introduced.
      //
      // The product MUST first be persisted to the
      // Product Master through ProductEngine.
      //
      // Product Master:
      //      Firestore / products
      //
      // Inventory:
      //      Firestore / inventory
      //
      // Warehouse Store:
      //      Zustand / localStorage
      //
      // Technical compatibility NEVER depends on quantity.
      //
      // ==================================================

      addProductToWarehouse:

        async (
          warehouseId,
          product = {}
        ) => {

          // ==========================================
          // VALIDATE INPUT
          // ==========================================

          if (
            !warehouseId ||
            !product
          ) {

            return {

              success: false,

              data: null,

              message:
                'المخزن والمنتج مطلوبان',

              errors: []

            }

          }


          // ==========================================
          // FIND WAREHOUSE
          // ==========================================

          const warehouse =
            get()
              .warehouses
              .find(
                item =>

                  String(
                    item.id
                  ) ===
                  String(
                    warehouseId
                  )

              )


          if (!warehouse) {

            return {

              success: false,

              data: null,

              message:
                'المخزن غير موجود',

              errors: []

            }

          }


          // ==========================================
          // PRODUCT NAME
          // ==========================================

          const productName =
            String(
              product.productName ||
              product.name ||
              ''
            ).trim()


          if (!productName) {

            return {

              success: false,

              data: null,

              message:
                'اسم المنتج مطلوب',

              errors: []

            }

          }


          // ==========================================
          // EXISTING PRODUCT ID
          // ==========================================
          //
          // A supplied productId means that this is
          // already an existing Product Master.
          //
          // A missing productId means this is a NEW
          // Product Master and ProductEngine must create it.
          //
          // ==========================================

          const existingProductId =
            product.productId ||
            product.id ||
            null


          // ==========================================
          // PREVENT DUPLICATE LOCAL WAREHOUSE PRODUCT
          // ==========================================

          if (existingProductId) {

            const existingProduct =
              (
                warehouse.products ||
                []
              ).find(
                item =>

                  String(
                    item.productId
                  ) ===
                  String(
                    existingProductId
                  )

                  ||

                  String(
                    item.id
                  ) ===
                  String(
                    existingProductId
                  )
              )


            if (existingProduct) {

              return {

                success: false,

                data:
                  existingProduct,

                message:
                  'المنتج موجود بالفعل في هذا المخزن',

                errors: []

              }

            }

          }


          // ==========================================
          // PREPARE PRODUCT DATA
          // ==========================================

          const quantity =
            Number(
              product.quantity || 0
            )


          const minimumStock =
            Number(
              product.minimumStock || 0
            )


          const maximumStock =
            Number(
              product.maximumStock || 0
            )


          const reorderPoint =
            Number(
              product.reorderPoint || 0
            )


          // ==========================================
          // CREATE PRODUCT MASTER
          // ==========================================
          //
          // NEW PRODUCTS MUST ENTER THE SYSTEM THROUGH
          // ProductEngine.
          //
          // ProductEngine will:
          //
          // 1. Validate product.
          // 2. Normalize technical/product data.
          // 3. Create Firestore Product Master.
          // 4. Obtain the REAL Firestore product ID.
          // 5. Create the initial Inventory record.
          //
          // ==========================================

          let masterProductId =
            existingProductId


          let persistedProduct = null


          if (!masterProductId) {

            console.log(
              '[WarehouseStore] Creating NEW Product Master:',
              {
                warehouseId,
                productName
              }
            )


            const productResult =
              await ProductEngine.create({

                ...product,

                name:
                  product.name ||
                  productName,

                productName,

                warehouseId,

                quantity,

                minimumStock,

                maximumStock,

                reorderPoint

              })


            // ==========================================
            // PRODUCT MASTER CREATION FAILED
            // ==========================================

            if (
              !productResult?.success
            ) {

              console.error(
                '[WarehouseStore] Product Master creation failed:',
                productResult
              )


              return {

                success: false,

                data:
                  productResult?.data ||
                  null,

                message:
                  productResult?.message ||
                  'فشل إنشاء المنتج',

                errors:
                  productResult?.errors ||
                  []

              }

            }


            masterProductId =
              productResult
                ?.data
                ?.id


            if (!masterProductId) {

              console.error(
                '[WarehouseStore] ProductEngine returned no product ID:',
                productResult
              )


              return {

                success: false,

                data: null,

                message:
                  'تم إنشاء المنتج ولكن لم يتم الحصول على معرف المنتج',

                errors: []

              }

            }


            persistedProduct =
              productResult.data


            console.log(
              '[WarehouseStore] Product Master created:',
              {
                productId:
                  masterProductId,

                productName,

                warehouseId
              }
            )

          }


          // ==========================================
          // NORMALIZE LOCAL WAREHOUSE PRODUCT
          // ==========================================
          //
          // IMPORTANT:
          //
          // The REAL Firestore Product ID is used here.
          //
          // We do NOT keep the temporary local ID generated
          // before ProductEngine.create().
          //
          // ==========================================

          const normalizedProduct =
            normalizeProduct({

              ...product,

              ...(
                persistedProduct ||
                {}
              ),

              id:
                masterProductId,

              productId:
                masterProductId,

              productName,

              name:
                product.name ||
                productName,

              quantity,

              availableQuantity:
                quantity,

              minimumStock,

              maximumStock,

              reorderPoint,

              warehouseId

            })


          // ==========================================
          // ADD TO LOCAL WAREHOUSE STORE
          // ==========================================

          set(state => ({

            warehouses:

              addProductToWarehouseHelper(

                state.warehouses,

                warehouseId,

                normalizedProduct

              )

          }))


          // ==========================================
          // GET CREATED LOCAL PRODUCT
          // ==========================================

          const updatedWarehouse =
            get()
              .warehouses
              .find(
                item =>

                  String(
                    item.id
                  ) ===
                  String(
                    warehouseId
                  )

              )


          const createdProduct =
            (
              updatedWarehouse?.products ||
              []
            ).find(
              item =>

                String(
                  item.productId
                ) ===
                String(
                  masterProductId
                )

            )


          // ==========================================
          // LOG SUCCESS
          // ==========================================

          console.log(
            '[WarehouseStore] PRODUCT CREATION COMPLETE:',
            {

              productId:
                masterProductId,

              productName,

              warehouseId,

              quantity,

              firestoreProductMaster:
                !existingProductId,

              localWarehouseProduct:
                Boolean(
                  createdProduct
                )

            }
          )


          // ==========================================
          // RETURN
          // ==========================================

          return {

            success: true,

            data: {

              productId:
                masterProductId,

              product:
                createdProduct ||
                normalizedProduct,

              warehouseId,

              inventoryCreated:
                !existingProductId

            },

            message:
              'تم إنشاء المنتج وإضافته إلى المخزن بنجاح',

            errors: []

          }

        },


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
                  String(
                    warehouse.id
                  ) !==
                  String(
                    warehouseId
                  )
                ) {

                  return warehouse

                }


                return {

                  ...warehouse,

                  products:

                    (
                      warehouse.products ||
                      []
                    ).map(
                      product => {

                        const matches =

                          String(
                            product.productId
                          ) ===
                          String(
                            productId
                          )

                          ||

                          String(
                            product.id
                          ) ===
                          String(
                            productId
                          )


                        if (!matches) {

                          return product

                        }


                        return {

                          ...product,

                          ...data,

                          updatedAt:
                            new Date()
                              .toISOString()

                        }

                      }
                    )

                }

              }

            )

        })),


      // ==========================================
      // PROCESS INVENTORY TRANSACTION
      // ==========================================

      processInventoryTransaction: (
        warehouseId,
        productId,
        type,
        quantity,
        transactionData = {}
      ) => {

        const amount =
          Number(
            quantity || 0
          )


        if (
          !Number.isFinite(
            amount
          ) ||
          amount <= 0
        ) {

          return {

            success: false,

            message:
              'الكمية يجب أن تكون أكبر من صفر'

          }

        }


        if (
          type !== 'in' &&
          type !== 'out'
        ) {

          return {

            success: false,

            message:
              'نوع الحركة غير صحيح'

          }

        }


        const warehouse =
          get()
            .warehouses
            .find(
              item =>

                String(
                  item.id
                ) ===
                String(
                  warehouseId
                )

            )


        if (!warehouse) {

          return {

            success: false,

            message:
              'المخزن غير موجود'

          }

        }


        const product =
          (
            warehouse.products ||
            []
          ).find(
            item =>

              String(
                item.productId
              ) ===
              String(
                productId
              )

              ||

              String(
                item.id
              ) ===
              String(
                productId
              )

          )


        if (!product) {

          return {

            success: false,

            message:
              'المنتج غير موجود في المخزن'

          }

        }


        const currentQuantity =
          Number(
            product.quantity || 0
          )


        const currentIncoming =
          Number(
            product.incoming || 0
          )


        const currentOutgoing =
          Number(
            product.outgoing || 0
          )


        let newQuantity =
          currentQuantity


        let newIncoming =
          currentIncoming


        let newOutgoing =
          currentOutgoing


        if (
          type === 'in'
        ) {

          newQuantity =
            currentQuantity +
            amount


          newIncoming =
            currentIncoming +
            amount

        }


        if (
          type === 'out'
        ) {

          if (
            amount >
            currentQuantity
          ) {

            return {

              success: false,

              message:
                'الكمية المطلوبة أكبر من المخزون المتاح'

            }

          }


          newQuantity =
            currentQuantity -
            amount


          newOutgoing =
            currentOutgoing +
            amount

        }


        const now =
          new Date()
            .toISOString()


        const defaultUnitPrice =
          type === 'in'
            ? Number(
                product.purchasePrice || 0
              )
            : Number(
                product.salePrice || 0
              )


        const unitPrice =
          Number(
            transactionData.unitPrice ??
            defaultUnitPrice
          )


        const transaction = {

          id:
            generateId(),

          type,

          warehouseId:
            warehouse.id,

          warehouseName:
            warehouse.name ||
            '',

          productId:
            product.productId ||
            product.id ||
            productId,

          productName:
            product.productName ||
            product.name ||
            '',

          quantity:
            amount,

          previousQuantity:
            currentQuantity,

          beforeQuantity:
            currentQuantity,

          newQuantity,

          afterQuantity:
            newQuantity,

          incoming:
            type === 'in'
              ? amount
              : 0,

          outgoing:
            type === 'out'
              ? amount
              : 0,

          unitPrice,

          purchasePrice:
            Number(
              transactionData.purchasePrice ??
              product.purchasePrice ??
              0
            ),

          salePrice:
            Number(
              transactionData.salePrice ??
              product.salePrice ??
              0
            ),

          totalValue:
            amount *
            unitPrice,

          userId:
            transactionData.userId ||
            '',

          userName:
            transactionData.userName ||
            '',

          notes:
            transactionData.notes ||
            '',

          reference:
            transactionData.reference ||
            '',

          source:
            transactionData.source ||
            'warehouse',

          createdAt:
            now,

          updatedAt:
            now

        }


        set(state => ({

          warehouses:

            state.warehouses.map(
              warehouseItem => {

                if (
                  String(
                    warehouseItem.id
                  ) !==
                  String(
                    warehouseId
                  )
                ) {

                  return warehouseItem

                }


                return {

                  ...warehouseItem,

                  products:

                    (
                      warehouseItem.products ||
                      []
                    ).map(
                      productItem => {

                        const matches =

                          String(
                            productItem.productId
                          ) ===
                          String(
                            productId
                          )

                          ||

                          String(
                            productItem.id
                          ) ===
                          String(
                            productId
                          )


                        if (!matches) {

                          return productItem

                        }


                        return {

                          ...productItem,

                          quantity:
                            newQuantity,

                          incoming:
                            newIncoming,

                          outgoing:
                            newOutgoing,

                          availableQuantity:
                            newQuantity,

                          updatedAt:
                            now

                        }

                      }

                    ),

                  transactions: [

                    ...(
                      warehouseItem.transactions ||
                      []
                    ),

                    transaction

                  ]

                }

              }

            )

        }))


        return {

          success: true,

          newQuantity,

          incoming:
            newIncoming,

          outgoing:
            newOutgoing,

          transaction

        }

      },


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
                  String(
                    warehouse.id
                  ) !==
                  String(
                    warehouseId
                  )
                ) {

                  return warehouse

                }


                return {

                  ...warehouse,

                  products:

                    (
                      warehouse.products ||
                      []
                    ).filter(
                      product =>

                        String(
                          product.productId
                        ) !==
                        String(
                          productId
                        )

                        &&

                        String(
                          product.id
                        ) !==
                        String(
                          productId
                        )

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

                String(
                  item.id
                ) ===
                String(
                  warehouseId
                )

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
                (
                  warehouse.products ||
                  []
                ).find(
                  item =>

                    String(
                      item.productId
                    ) ===
                    String(
                      productId
                    )

                    ||

                    String(
                      item.id
                    ) ===
                    String(
                      productId
                    )

                )


              if (product) {

                results.push({

                  warehouseId:
                    warehouse.id,

                  warehouseName:
                    warehouse.name,

                  quantity:
                    Number(
                      product.quantity ||
                      0
                    ),

                  salePrice:
                    Number(
                      product.salePrice ||
                      0
                    ),

                  purchasePrice:
                    Number(
                      product.purchasePrice ||
                      0
                    ),

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
          String(query)
            .toLowerCase()
            .trim()


        if (!value) {

          return []

        }


        const results = []


        get()
          .warehouses
          .forEach(
            warehouse => {

              (
                warehouse.products ||
                []
              ).forEach(
                product => {

                  const productName =
                    String(
                      product.productName ||
                      product.name ||
                      ''
                    )
                      .toLowerCase()


                  const barcode =
                    String(
                      product.barcode ||
                      ''
                    )
                      .toLowerCase()


                  const brand =
                    String(
                      product.brand ||
                      ''
                    )
                      .toLowerCase()


                  if (

                    productName.includes(
                      value
                    )

                    ||

                    barcode.includes(
                      value
                    )

                    ||

                    brand.includes(
                      value
                    )

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

              (
                warehouse.products ||
                []
              ).forEach(
                product => {

                  products.push({

                    ...product,

                    warehouseId:
                      warehouse.id,

                    warehouseName:
                      warehouse.name,

                    stock:
                      Number(
                        product.quantity ||
                        0
                      ),

                    quantity:
                      Number(
                        product.quantity ||
                        0
                      ),

                    price:
                      Number(
                        product.salePrice ||
                        0
                      ),

                    hidden:
                      product.hidden ??
                      false,

                    publishedToHome:
                      product.publishedToHome ??
                      product.publishToHome ??
                      false,

                    publishedToProducts:
                      product.publishedToProducts ??
                      product.publishToProducts ??
                      false,

                    publishedToOffers:
                      product.publishedToOffers ??
                      product.publishToOffers ??
                      false

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

                String(
                  item.id
                ) ===
                String(
                  warehouseId
                )

            )


        return Boolean(

          warehouse?.products
            ?.some(
              product =>

                String(
                  product.productId
                ) ===
                String(
                  productId
                )

                ||

                String(
                  product.id
                ) ===
                String(
                  productId
                )

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

            addWarehouseTransaction(

              state.warehouses,

              warehouseId,

              transaction

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

      name:
        STORAGE_KEY

    }

  )

)


export default useWarehouseStore