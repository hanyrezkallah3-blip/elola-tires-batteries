import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import createWarehouse from './warehouse/helpers/createWarehouse'
import addProductToWarehouseHelper from './warehouse/helpers/addProductToWarehouse'
import addWarehouseTransaction from './warehouse/helpers/addWarehouseTransaction'

import ProductEngine from '../core/engines/product/ProductEngine'

const STORAGE_KEY = 'elola_warehouses'


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
// CREATE PRODUCT
// ==========================================

const createProduct = (product = {}) => {

  const productId =
    product.productId ||
    product.id ||
    generateId()

  return {

    id:
      product.id ||
      productId,

    productId,

    productName:
      product.productName ||
      product.name ||
      '',

    name:
      product.name ||
      product.productName ||
      '',

    image:
      product.image ||
      '',

    images:
      Array.isArray(product.images)
        ? product.images
        : [],

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

    model:
      product.model ||
      '',

    sku:
      product.sku ||
      '',

    barcode:
      product.barcode ||
      '',

    code:
      product.code ||
      '',

    type:
      product.type ||
      'tire',

    tire:
      product.tire ||
      {},

    battery:
      product.battery ||
      {},

    oil:
      product.oil ||
      {},

    compatibleVehicles:
      Array.isArray(product.compatibleVehicles)
        ? product.compatibleVehicles
        : [],

    compatibleSizes:
      Array.isArray(product.compatibleSizes)
        ? product.compatibleSizes
        : [],

    quantity:
      Number(
        product.quantity || 0
      ),

    purchasePrice:
      Number(
        product.purchasePrice || 0
      ),

    salePrice:
      Number(
        product.salePrice || 0
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

    unit:
      product.unit ||
      'piece',

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
        product.quantity ??
        0
      ),

    wholesalePrice:
      Number(
        product.wholesalePrice || 0
      ),

    discountPrice:
      Number(
        product.discountPrice || 0
      ),

    cost:
      Number(
        product.cost ??
        product.purchasePrice ??
        0
      ),

    location:
      product.location ||
      '',

    shelf:
      product.shelf ||
      '',

    rack:
      product.rack ||
      '',

    bin:
      product.bin ||
      '',

    supplierId:
      product.supplierId ||
      '',

    supplierName:
      product.supplierName ||
      '',

    batchNumber:
      product.batchNumber ||
      '',

    lotNumber:
      product.lotNumber ||
      '',

    productionDate:
      product.productionDate ||
      '',

    expiryDate:
      product.expiryDate ||
      '',

    warranty:
      product.warranty ||
      '',

    serialNumbers:
      Array.isArray(product.serialNumbers)
        ? product.serialNumbers
        : [],

    publishToHome:
      product.publishToHome ??
      product.publishedToHome ??
      false,

    publishToProducts:
      product.publishToProducts ??
      product.publishedToProducts ??
      false,

    publishToOffers:
      product.publishToOffers ??
      product.publishedToOffers ??
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
      false,

    hidden:
      product.hidden ??
      false,

    featured:
      product.featured ??
      false,

    active:
      product.active !== false,

    createdAt:
      product.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    ...product,

    id:
      product.id ||
      productId,

    productId,

    productName:
      product.productName ||
      product.name ||
      '',

    name:
      product.name ||
      product.productName ||
      ''

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
        data
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

                      ...data

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


      // ==========================================
      // ADD PRODUCT TO WAREHOUSE
      // ==========================================

      addProductToWarehouse: async (
        warehouseId,
        product = {}
      ) => {

        // ==========================================
        // VALIDATION
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

        const existingProductId =
          product.productId ||
          product.id ||
          ''


        // ==========================================
        // PREVENT DUPLICATE
        // ==========================================

        const existingProduct =
          (
            warehouse.products ||
            []
          ).find(
            item => {

              if (
                existingProductId
              ) {

                return (

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

              }

              return (

                String(
                  item.productName ||
                  item.name ||
                  ''
                )
                  .trim()
                  .toLowerCase()

                ===

                productName
                  .toLowerCase()

              )

            }
          )


        if (existingProduct) {

          return {

            success: false,

            data: existingProduct,

            message:
              'المنتج موجود بالفعل في هذا المخزن',

            errors: []

          }

        }


        // ==========================================
        // PREPARE PRODUCT DATA
        // ==========================================

        const productData = {

          ...product,

          id:
            existingProductId ||
            undefined,

          productId:
            existingProductId ||
            undefined,

          name:
            product.name ||
            productName,

          productName,

          type:
            product.type ||
            'tire',

          category:
            product.category ||
            product.type ||
            '',

          purchasePrice:
            Number(
              product.purchasePrice || 0
            ),

          salePrice:
            Number(
              product.salePrice || 0
            ),

          quantity:
            Number(
              product.quantity || 0
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
            product.active !== false

        }


        // ==========================================
        // CREATE IN FIRESTORE
        // ==========================================

        let firestoreResult

        try {

          firestoreResult =
            await ProductEngine.create({

              ...productData,

              warehouseId,

              quantity:
                productData.quantity,

              minimumStock:
                productData.minimumStock,

              maximumStock:
                productData.maximumStock,

              reorderPoint:
                productData.reorderPoint

            })

        }

        catch (error) {

          console.error(
            'warehouseStore.addProductToWarehouse Firestore error:',
            error
          )

          return {

            success: false,

            data: null,

            message:
              error?.message ||
              'فشل حفظ المنتج في Firestore',

            errors: [
              error
            ]

          }

        }


        // ==========================================
        // FIRESTORE FAILURE
        // ==========================================

        if (
          !firestoreResult?.success
        ) {

          console.error(
            'warehouseStore.addProductToWarehouse failed:',
            firestoreResult
          )

          return {

            success: false,

            data: null,

            message:
              firestoreResult?.message ||
              'فشل إنشاء المنتج في Firestore',

            errors:
              firestoreResult?.errors ||
              []

          }

        }


        // ==========================================
        // PRODUCT ID FROM FIRESTORE
        // ==========================================

        const firestoreProductId =
          firestoreResult
            ?.data
            ?.id


        if (!firestoreProductId) {

          return {

            success: false,

            data: null,

            message:
              'تم إنشاء المنتج ولكن لم يتم الحصول على معرفه من Firestore',

            errors: []

          }

        }


        // ==========================================
        // CREATE LOCAL PRODUCT
        // ==========================================

        const normalizedLocalProduct =
          createProduct({

            ...productData,

            id:
              firestoreProductId,

            productId:
              firestoreProductId,

            productName,

            quantity:
              productData.quantity,

            availableQuantity:
              productData.quantity,

            incoming:
              Number(
                product.incoming || 0
              ),

            outgoing:
              Number(
                product.outgoing || 0
              )

          })


        // ==========================================
        // ADD TO LOCAL WAREHOUSE
        // ==========================================

        set(state => ({

          warehouses:

            addProductToWarehouseHelper(

              state.warehouses,

              warehouseId,

              normalizedLocalProduct

            )

        }))


        // ==========================================
        // RETURN RESULT
        // ==========================================

        return {

          success: true,

          data: {

            productId:
              firestoreProductId,

            product:
              normalizedLocalProduct,

            warehouseId,

            inventoryCreated:
              true

          },

          message:
            'تم إنشاء المنتج والمخزون وحفظهما في Firestore بنجاح',

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
                          ) ||
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


        // ==========================================
        // VALIDATE QUANTITY
        // ==========================================

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


        // ==========================================
        // VALIDATE TYPE
        // ==========================================

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

            message:
              'المخزن غير موجود'

          }

        }


        // ==========================================
        // FIND PRODUCT
        // ==========================================

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
              ) ||

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


        // ==========================================
        // CURRENT VALUES
        // ==========================================

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


        // ==========================================
        // INCOMING
        // ==========================================

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


        // ==========================================
        // OUTGOING
        // ==========================================

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


        // ==========================================
        // TIMESTAMP
        // ==========================================

        const now =
          new Date()
            .toISOString()


        // ==========================================
        // UNIT PRICE
        // ==========================================

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


        // ==========================================
        // TRANSACTION OBJECT
        // ==========================================

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

          newQuantity:
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

          unitPrice:
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


        // ==========================================
        // UPDATE WAREHOUSE
        // ==========================================

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
                          ) ||

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


        // ==========================================
        // RETURN RESULT
        // ==========================================

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
                        ) &&

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
                    ) ||

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
                    ) ||

                    barcode.includes(
                      value
                    ) ||

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
                ) ||

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