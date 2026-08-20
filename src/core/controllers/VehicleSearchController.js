// ======================================================
// EL OLA ERP
// Vehicle Search Controller
// ======================================================

import VehicleEngine
  from '../engines/VehicleEngine'

import ProductsRepository
  from '../../repositories/ProductsRepository'

import {
  useInventoryStore
} from '../../store/inventoryStore'

import {
  useWarehouseStore
} from '../../store/warehouseStore'

import {
  useWebsiteStore
} from '../../store/websiteStore'


// ======================================================
// HELPERS
// ======================================================

const numberValue = (value) => {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {

    return null

  }


  const normalized =
    Number(

      String(value)
        .trim()
        .replace(',', '.')

    )


  return Number.isFinite(normalized)
    ? normalized
    : null

}


const normalizeText = (value) =>

  String(value ?? '')
    .trim()
    .toLowerCase()


// ======================================================
// NORMALIZE TIRE SIZE
// ======================================================

const normalizeTireSize = (
  value
) => {

  return String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/x/gi, '*')
    .replace(/-/g, '/')

}


// ======================================================
// PARSE TIRE SIZE
// ======================================================

const parseTireSize = (
  value
) => {

  const normalized =
    normalizeTireSize(value)


  if (!normalized)
    return null


  // ==============================================
  // 205/55/16
  // 205*55*16
  // ==============================================

  const threePart =
    normalized.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )


  if (threePart) {

    return {

      width:
        numberValue(
          threePart[1]
        ),

      profile:
        numberValue(
          threePart[2]
        ),

      rim:
        numberValue(
          threePart[3]
        ),

      format:
        'three-part'

    }

  }


  // ==============================================
  // 1200/24
  // 1200*24
  // ==============================================

  const twoPart =
    normalized.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )


  if (twoPart) {

    return {

      width:
        numberValue(
          twoPart[1]
        ),

      profile:
        null,

      rim:
        numberValue(
          twoPart[2]
        ),

      format:
        'two-part'

    }

  }


  return null

}


// ======================================================
// GET TIRE VALUE
// ======================================================

const getTireValue = (
  tire,
  keys
) => {

  for (
    const key of keys
  ) {

    const value =
      tire?.[key]


    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {

      return value

    }

  }


  return null

}


// ======================================================
// GET PRODUCT TIRE DATA
// ======================================================

const getProductTire = (
  product
) => {

  return (

    product?.tire ||

    product?.tireData ||

    product?.tireSpecification ||

    product?.tireSpecifications ||

    product?.specifications?.tire ||

    product?.specification?.tire ||

    product?.attributes?.tire ||

    {}

  )

}


// ======================================================
// GET POSSIBLE SIZE VALUES
// ======================================================

const getProductSizeValues = (
  product,
  tire
) => {

  return [

    // ==============================================
    // PRODUCT SIZE FIELDS
    // ==============================================

    product?.tireSize,

    product?.size,

    product?.dimension,

    product?.dimensions,

    product?.sizeCode,

    product?.skuSize,

    product?.name,

    product?.productName,

    // ==============================================
    // SPECIFICATIONS
    // ==============================================

    product?.specifications?.tireSize,

    product?.specifications?.size,

    product?.specifications?.dimension,

    product?.specification?.tireSize,

    product?.specification?.size,

    product?.attributes?.tireSize,

    product?.attributes?.size,

    // ==============================================
    // TIRE OBJECT
    // ==============================================

    tire?.size,

    tire?.tireSize,

    tire?.dimension,

    tire?.dimensions,

    tire?.sizeCode

  ]

    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )

}


// ======================================================
// EXTRACT PRODUCT TIRE
// ======================================================

const extractProductTire = (
  product
) => {

  const tire =
    getProductTire(
      product
    )


  let width =
    numberValue(

      getTireValue(

        tire,

        [
          'width',
          'sectionWidth',
          'tireWidth'
        ]

      )

    )


  let profile =
    numberValue(

      getTireValue(

        tire,

        [
          'height',
          'profile',
          'aspectRatio',
          'aspect'
        ]

      )

    )


  let rim =
    numberValue(

      getTireValue(

        tire,

        [
          'rim',
          'rimSize',
          'wheelDiameter',
          'diameter'
        ]

      )

    )


  // ====================================================
  // TRY SIZE STRING
  // ====================================================

  if (
    width === null ||
    rim === null
  ) {

    const sizeValues =
      getProductSizeValues(
        product,
        tire
      )


    for (
      const value of sizeValues
    ) {

      const parsed =
        parseTireSize(
          value
        )


      if (!parsed)
        continue


      width =
        width ??
        parsed.width


      profile =
        profile ??
        parsed.profile


      rim =
        rim ??
        parsed.rim


      if (
        width !== null &&
        rim !== null
      ) {

        break

      }

    }

  }


  return {

    width,

    profile,

    rim

  }

}


// ======================================================
// IS TIRE PRODUCT
// ======================================================

const isTireProduct = (
  product
) => {

  const type =
    normalizeText(
      product?.type
    )


  if (
    type === 'tire' ||
    type === 'tyre' ||
    type === 'tires' ||
    type === 'إطار' ||
    type === 'اطار' ||
    type === 'إطارات' ||
    type === 'اطارات'
  ) {

    return true

  }


  const tire =
    getProductTire(
      product
    )


  const extracted =
    extractProductTire(
      product
    )


  if (
    extracted.width !== null &&
    extracted.rim !== null
  ) {

    return true

  }


  if (
    Object.keys(tire).length > 0
  ) {

    return true

  }


  return false

}


// ======================================================
// GET WAREHOUSE PRODUCTS
// ======================================================

const getWarehouseProducts = () => {

  try {

    const state =
      useWarehouseStore.getState()


    const warehouses =
      Array.isArray(
        state?.warehouses
      )
        ? state.warehouses
        : []


    const products = []


    warehouses.forEach(
      warehouse => {

        const warehouseProducts =
          Array.isArray(
            warehouse?.products
          )
            ? warehouse.products
            : []


        warehouseProducts.forEach(
          product => {

            if (!product)
              return


            const productId =
              String(

                product?.productId ??
                product?.id ??
                ''

              )


            if (!productId)
              return


            products.push({

              ...product,

              id:
                productId,

              productId:
                productId,

              name:
                product?.name ||
                product?.productName ||
                '',

              productName:
                product?.productName ||
                product?.name ||
                '',

              warehouseId:
                product?.warehouseId ??
                warehouse?.id,

              warehouseName:
                product?.warehouseName ||
                warehouse?.name ||
                '',

              quantity:
                Number(
                  product?.quantity ??
                  product?.availableQuantity ??
                  0
                ),

              availableQuantity:
                Number(
                  product?.availableQuantity ??
                  product?.quantity ??
                  0
                ),

              salePrice:
                Number(
                  product?.salePrice ??
                  product?.sellingPrice ??
                  product?.price ??
                  0
                )

            })

          }
        )

      }
    )


    return products

  }
  catch (error) {

    console.error(
      'Warehouse products read failed:',
      error
    )

    return []

  }

}


// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getAllProducts = async () => {

  // ====================================================
  // REPOSITORY
  // ====================================================

  let repositoryProducts = []


  try {

    const data =
      await ProductsRepository.getAll()


    if (
      Array.isArray(data)
    ) {

      repositoryProducts =
        data

    }

  }
  catch (error) {

    console.error(
      'ProductsRepository.getAll failed:',
      error
    )

  }


  // ====================================================
  // WAREHOUSE
  // ====================================================

  const warehouseProducts =
    getWarehouseProducts()


  // ====================================================
  // WEBSITE
  // ====================================================

  let websiteProducts = []


  try {

    const state =
      useWebsiteStore.getState()


    if (
      Array.isArray(
        state?.products
      )
    ) {

      websiteProducts =
        state.products

    }

  }
  catch (error) {

    console.error(
      'Website products read failed:',
      error
    )

  }


  // ====================================================
  // MERGE
  // ====================================================

  const map =
    new Map()


  // ====================================================
  // FIRST: REPOSITORY
  // ====================================================

  repositoryProducts.forEach(
    product => {

      if (!product)
        return


      const id =
        String(
          product?.id ??
          product?.productId ??
          ''
        )


      if (!id)
        return


      map.set(
        id,
        {
          ...product,

          id,

          productId:
            product?.productId ??
            id

        }
      )

    }
  )


  // ====================================================
  // SECOND: WEBSITE
  // ====================================================

  websiteProducts.forEach(
    product => {

      if (!product)
        return


      const id =
        String(
          product?.id ??
          product?.productId ??
          ''
        )


      if (!id)
        return


      map.set(
        id,
        {

          ...map.get(id),

          ...product,

          id,

          productId:
            product?.productId ??
            id

        }
      )

    }
  )


  // ====================================================
  // THIRD: WAREHOUSE
  //
  // WAREHOUSE DATA IS AUTHORITATIVE FOR STOCK
  // ====================================================

  warehouseProducts.forEach(
    product => {

      if (!product)
        return


      const id =
        String(
          product?.productId ??
          product?.id ??
          ''
        )


      if (!id)
        return


      const existing =
        map.get(id)


      map.set(
        id,
        {

          ...existing,

          ...product,

          id,

          productId:
            id,

          name:
            product?.name ||
            product?.productName ||
            existing?.name ||
            existing?.productName ||
            '',

          productName:
            product?.productName ||
            product?.name ||
            existing?.productName ||
            existing?.name ||
            '',

          type:
            product?.type ||
            existing?.type ||
            '',

          brand:
            product?.brand ||
            existing?.brand ||
            '',

          salePrice:
            Number(
              product?.salePrice ??
              existing?.salePrice ??
              0
            )

        }
      )

    }
  )


  return Array.from(
    map.values()
  )

}


// ======================================================
// GET WAREHOUSE STOCK FOR PRODUCT
// ======================================================

const getWarehouseStockForProduct = (
  productId
) => {

  const normalizedId =
    String(
      productId ?? ''
    )


  if (!normalizedId)
    return []


  const warehouseProducts =
    getWarehouseProducts()


  return warehouseProducts.filter(
    product =>

      String(
        product?.productId ??
        product?.id ??
        ''
      ) === normalizedId

  )

}


// ======================================================
// CONTROLLER
// ======================================================

class VehicleSearchController {


  // ====================================================
  // VEHICLE
  // ====================================================

  static async searchVehicle({

    vehicleType,

    make,

    model,

    year

  }) {

    const products =
      await getAllProducts()


    return VehicleEngine.search({

      vehicleType,

      make,

      model,

      year,

      products

    })

  }


  // ====================================================
  // TIRE
  // ====================================================

  static async searchTire({

    width,

    profile,

    rim,

    format

  }) {

    const products =
      await getAllProducts()


    const requestedWidth =
      numberValue(
        width
      )


    const requestedProfile =
      numberValue(
        profile
      )


    const requestedRim =
      numberValue(
        rim
      )


    if (
      requestedWidth === null ||
      requestedRim === null
    ) {

      return []

    }


    // ==================================================
    // INVENTORY STORE FALLBACK
    // ==================================================

    const inventoryState =
      useInventoryStore.getState()


    const stockItems =
      Array.isArray(
        inventoryState?.stockItems
      )
        ? inventoryState.stockItems
        : []


    // ==================================================
    // SEARCH PRODUCTS
    // ==================================================

    const matchedProducts =

      products

        .filter(
          product =>
            isTireProduct(
              product
            )
        )

        .filter(
          product => {

            const tire =
              extractProductTire(
                product
              )


            // ==========================================
            // WIDTH
            // ==========================================

            if (
              tire.width !==
              requestedWidth
            ) {

              return false

            }


            // ==========================================
            // RIM
            // ==========================================

            if (
              tire.rim !==
              requestedRim
            ) {

              return false

            }


            // ==========================================
            // COMMERCIAL
            // ==========================================

            if (
              format ===
              'two-part'
            ) {

              return true

            }


            // ==========================================
            // PASSENGER
            // ==========================================

            return (

              tire.profile !==
              null &&

              requestedProfile !==
              null &&

              tire.profile ===
              requestedProfile

            )

          }

        )


    // ==================================================
    // ADD INVENTORY
    // ==================================================

    return matchedProducts.map(
      product => {

        const productId =
          String(
            product?.productId ??
            product?.id ??
            ''
          )


        // ==============================================
        // WAREHOUSE ROWS
        // ==============================================

        const warehouseRows =
          getWarehouseStockForProduct(
            productId
          )


        // ==============================================
        // INVENTORY ROWS
        // ==============================================

        const inventoryRows =
          stockItems.filter(
            item =>

              String(
                item?.productId ??
                ''
              ) === productId

              &&

              Number(
                item?.quantity || 0
              ) > 0

          )


        // ==============================================
        // USE WAREHOUSE DATA FIRST
        // ==============================================

        const sourceRows =
          warehouseRows.length > 0
            ? warehouseRows
            : inventoryRows


        // ==============================================
        // TOTAL STOCK
        // ==============================================

        const totalStock =
          sourceRows.reduce(

            (
              total,
              item
            ) =>

              total +

              Number(
                item?.quantity ??
                item?.availableQuantity ??
                0
              ),

            0

          )


        // ==============================================
        // WAREHOUSES
        // ==============================================

        const warehouses =
          sourceRows.map(
            item => ({

              id:
                item?.warehouseId,

              name:
                item?.warehouseName ||
                item?.warehouse?.name ||
                'المخزن',

              quantity:
                Number(
                  item?.quantity ??
                  item?.availableQuantity ??
                  0
                )

            })
          )


        // ==============================================
        // PRICE
        // ==============================================

        const price =

          Number(
            product?.salePrice ??
            product?.sellingPrice ??
            product?.price ??
            product?.consumerPrice ??
            0
          )


        // ==============================================
        // RESULT
        // ==============================================

        return {

          ...product,

          id:
            productId,

          productId,

          price,

          salePrice:
            price,

          stock:
            totalStock,

          quantity:
            totalStock,

          availability: {

            available:
              totalStock > 0,

            quantity:
              totalStock,

            warehouses

          }

        }

      }

    )

  }


  // ====================================================
  // BATTERY
  // ====================================================

  static async searchBattery({

    capacity

  }) {

    const products =
      await getAllProducts()


    const requestedCapacity =
      numberValue(
        capacity
      )


    if (
      requestedCapacity === null
    ) {

      return []

    }


    return products.filter(
      product =>

        normalizeText(
          product?.type
        ) === 'battery'

        &&

        numberValue(
          product?.battery?.capacity
        )

        ===

        requestedCapacity

    )

  }


  // ====================================================
  // OIL
  // ====================================================

  static async searchOil({

    viscosity

  }) {

    const products =
      await getAllProducts()


    const requestedViscosity =
      normalizeText(
        viscosity
      )


    return products.filter(
      product =>

        normalizeText(
          product?.type
        ) === 'oil'

        &&

        normalizeText(
          product?.oil?.viscosity
        )

        ===

        requestedViscosity

    )

  }

}


export default VehicleSearchController