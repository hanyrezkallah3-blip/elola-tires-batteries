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
        .replace(/ah$/i, '')
        .trim()
    )

  return Number.isFinite(normalized)
    ? normalized
    : null
}

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')

// ======================================================
// NORMALIZE TYPE
// ======================================================

const normalizeType = (value) => {

  const type =
    normalizeText(
      value
    )

  if (
    [
      'tire',
      'tires',
      'tyre',
      'tyres',
      'إطار',
      'اطار',
      'إطارات',
      'اطارات'
    ].includes(type)
  ) {
    return 'tire'
  }

  if (
    [
      'battery',
      'batteries',
      'بطارية',
      'بطاريات',
      'بطاريه',
      'بطاريات'
    ].includes(type)
  ) {
    return 'battery'
  }

  if (
    [
      'oil',
      'oils',
      'زيت',
      'زيوت'
    ].includes(type)
  ) {
    return 'oil'
  }

  return type
}

// ======================================================
// VALUE CANDIDATES
// ======================================================

const getNestedValue = (
  product,
  paths = []
) => {

  const values = []

  paths.forEach(
    path => {

      let current =
        product

      path.forEach(
        key => {

          if (
            current === undefined ||
            current === null
          ) {
            current =
              undefined

            return
          }

          current =
            current?.[key]
        }
      )

      if (
        current !== undefined &&
        current !== null &&
        current !== ''
      ) {
        values.push(
          current
        )
      }
    }
  )

  return values
}

// ======================================================
// BATTERY CAPACITY VALUES
// ======================================================

const getBatteryCapacityValues = (
  product
) => {

  return [

    ...getNestedValue(
      product,
      [
        ['battery', 'capacity'],
        ['battery', 'ampereHour'],
        ['battery', 'ah'],
        ['battery', 'amp'],
        ['battery', 'ampHours'],

        ['specifications', 'battery', 'capacity'],
        ['specifications', 'battery', 'ampereHour'],
        ['specifications', 'battery', 'ah'],
        ['specifications', 'battery', 'amp'],
        ['specifications', 'battery', 'ampHours'],

        ['specification', 'battery', 'capacity'],
        ['specification', 'battery', 'ampereHour'],
        ['specification', 'battery', 'ah'],
        ['specification', 'battery', 'amp'],
        ['specification', 'battery', 'ampHours'],

        ['attributes', 'battery', 'capacity'],
        ['attributes', 'battery', 'ampereHour'],
        ['attributes', 'battery', 'ah'],
        ['attributes', 'battery', 'amp'],
        ['attributes', 'battery', 'ampHours']
      ]
    ),

    product?.capacity,
    product?.ampereHour,
    product?.ah,
    product?.amp,
    product?.ampHours,

    product?.specifications?.capacity,
    product?.specifications?.ampereHour,
    product?.specifications?.ah,
    product?.specifications?.amp,
    product?.specifications?.ampHours,

    product?.attributes?.capacity,
    product?.attributes?.ampereHour,
    product?.attributes?.ah,
    product?.attributes?.amp,
    product?.attributes?.ampHours,

    product?.name,
    product?.productName,
    product?.model,
    product?.sku

  ].filter(
    value =>
      value !== undefined &&
      value !== null &&
      value !== ''
  )
}

// ======================================================
// OIL VISCOSITY VALUES
// ======================================================

const getOilViscosityValues = (
  product
) => {

  return [

    ...getNestedValue(
      product,
      [
        ['oil', 'viscosity'],
        ['oil', 'grade'],
        ['oil', 'oilGrade'],

        ['specifications', 'oil', 'viscosity'],
        ['specifications', 'oil', 'grade'],
        ['specifications', 'oil', 'oilGrade'],

        ['specification', 'oil', 'viscosity'],
        ['specification', 'oil', 'grade'],
        ['specification', 'oil', 'oilGrade'],

        ['attributes', 'oil', 'viscosity'],
        ['attributes', 'oil', 'grade'],
        ['attributes', 'oil', 'oilGrade']
      ]
    ),

    product?.viscosity,
    product?.grade,
    product?.oilGrade,

    product?.specifications?.viscosity,
    product?.specifications?.grade,
    product?.specifications?.oilGrade,

    product?.attributes?.viscosity,
    product?.attributes?.grade,
    product?.attributes?.oilGrade,

    product?.name,
    product?.productName,
    product?.model,
    product?.sku

  ].filter(
    value =>
      value !== undefined &&
      value !== null &&
      value !== ''
  )
}

// ======================================================
// NORMALIZE BATTERY VALUE
// ======================================================

const normalizeBatteryValue = (
  value
) => {

  return normalizeText(
    value
  )
    .replace(/\s+/g, '')
    .replace(/ah$/i, '')
    .replace(/amperehours?/gi, '')
    .replace(/amphours?/gi, '')
    .replace(/amps?/gi, '')
}

// ======================================================
// NORMALIZE OIL VALUE
// ======================================================

const normalizeOilValue = (
  value
) => {

  return normalizeText(
    value
  )
    .replace(/\s+/g, '')
    .replace(/×/g, 'x')
}

// ======================================================
// BATTERY MATCH
// ======================================================

const batteryCapacityMatches = (
  product,
  requested
) => {

  const wanted =
    normalizeBatteryValue(
      requested
    )

  if (!wanted) {
    return false
  }

  const values =
    getBatteryCapacityValues(
      product
    )

  return values.some(
    value => {

      const actual =
        normalizeBatteryValue(
          value
        )

      if (!actual) {
        return false
      }

      const actualNumber =
        numberValue(
          actual
        )

      const wantedNumber =
        numberValue(
          wanted
        )

      if (
        actualNumber !== null &&
        wantedNumber !== null &&
        actualNumber === wantedNumber
      ) {
        return true
      }

      return (
        actual === wanted ||
        actual.includes(wanted) ||
        wanted.includes(actual)
      )
    }
  )
}

// ======================================================
// OIL MATCH
// ======================================================

const oilViscosityMatches = (
  product,
  requested
) => {

  const wanted =
    normalizeOilValue(
      requested
    )

  if (!wanted) {
    return false
  }

  const values =
    getOilViscosityValues(
      product
    )

  return values.some(
    value => {

      const actual =
        normalizeOilValue(
          value
        )

      if (!actual) {
        return false
      }

      return (
        actual === wanted ||
        actual.includes(wanted) ||
        wanted.includes(actual)
      )
    }
  )
}

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
    normalizeTireSize(
      value
    )

  if (!normalized) {
    return null
  }

  // ----------------------------------------------------
  // 3 PART
  // 205/55/16
  // 205*55*16
  // 205-55-16
  // ----------------------------------------------------

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

  // ----------------------------------------------------
  // 2 PART
  // 1200/24
  // 1200*24
  // 1200-24
  // ----------------------------------------------------

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

    product?.tireSize,
    product?.size,
    product?.dimension,
    product?.dimensions,
    product?.sizeCode,
    product?.skuSize,

    product?.name,
    product?.productName,

    product?.specifications?.tireSize,
    product?.specifications?.size,
    product?.specifications?.dimension,

    product?.specification?.tireSize,
    product?.specification?.size,

    product?.attributes?.tireSize,
    product?.attributes?.size,

    tire?.size,
    tire?.tireSize,
    tire?.dimension,
    tire?.dimensions,
    tire?.sizeCode

  ].filter(
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

      if (!parsed) {
        continue
      }

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
    normalizeType(
      product?.type
    )

  if (
    type === 'tire'
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

  return (
    Object.keys(
      tire
    ).length > 0
  )
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

            if (!product) {
              return
            }

            const productId =
              String(
                product?.productId ??
                product?.id ??
                product?.sku ??
                product?.barcode ??
                ''
              ).trim()

            if (!productId) {
              return
            }

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
                  product?.stock ??
                  0
                ),

              availableQuantity:
                Number(
                  product?.availableQuantity ??
                  product?.quantity ??
                  product?.stock ??
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

  const warehouseProducts =
    getWarehouseProducts()

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

  const map =
    new Map()

  // ====================================================
  // REPOSITORY
  // ====================================================

  repositoryProducts.forEach(
    product => {

      if (!product) {
        return
      }

      const id =
        String(
          product?.id ??
          product?.productId ??
          product?.sku ??
          product?.barcode ??
          ''
        ).trim()

      if (!id) {
        return
      }

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
  // WEBSITE
  // ====================================================

  websiteProducts.forEach(
    product => {

      if (!product) {
        return
      }

      const id =
        String(
          product?.id ??
          product?.productId ??
          product?.sku ??
          product?.barcode ??
          ''
        ).trim()

      if (!id) {
        return
      }

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
  // WAREHOUSE
  // ====================================================

  warehouseProducts.forEach(
    product => {

      if (!product) {
        return
      }

      const id =
        String(
          product?.productId ??
          product?.id ??
          product?.sku ??
          product?.barcode ??
          ''
        ).trim()

      if (!id) {
        return
      }

      const existing =
        map.get(
          id
        )

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
              product?.sellingPrice ??
              product?.price ??
              existing?.salePrice ??
              existing?.sellingPrice ??
              existing?.price ??
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
    ).trim()

  if (!normalizedId) {
    return []
  }

  const warehouseProducts =
    getWarehouseProducts()

  return warehouseProducts.filter(
    product =>
      String(
        product?.productId ??
        product?.id ??
        ''
      ).trim() === normalizedId
  )
}

// ======================================================
// GET INVENTORY STOCK FOR PRODUCT
// ======================================================

const getInventoryStockForProduct = (
  productId
) => {

  const normalizedId =
    String(
      productId ?? ''
    ).trim()

  if (!normalizedId) {
    return []
  }

  try {

    const inventoryState =
      useInventoryStore.getState()

    const stockItems =
      Array.isArray(
        inventoryState?.stockItems
      )
        ? inventoryState.stockItems
        : []

    return stockItems.filter(
      item =>
        String(
          item?.productId ??
          item?.id ??
          ''
        ).trim() === normalizedId
    )
  }

  catch (error) {

    console.error(
      'Inventory stock read failed:',
      error
    )

    return []
  }
}

// ======================================================
// BUILD AVAILABILITY
// ======================================================

const buildAvailability = (
  productId
) => {

  const warehouseRows =
    getWarehouseStockForProduct(
      productId
    )

  const inventoryRows =
    getInventoryStockForProduct(
      productId
    )

  const sourceRows =
    warehouseRows.length > 0
      ? warehouseRows
      : inventoryRows

  const totalStock =
    sourceRows.reduce(
      (
        total,
        item
      ) =>
        total +
        Math.max(
          0,
          Number(
            item?.quantity ??
            item?.availableQuantity ??
            item?.stock ??
            0
          )
        ),
      0
    )

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
          Math.max(
            0,
            Number(
              item?.quantity ??
              item?.availableQuantity ??
              item?.stock ??
              0
            )
          )
      })
    )

  return {

    available:
      totalStock > 0,

    quantity:
      totalStock,

    warehouses
  }
}

// ======================================================
// BUILD SEARCH RESULT
// ======================================================

const buildSearchResult = (
  product
) => {

  const productId =
    String(
      product?.productId ??
      product?.id ??
      product?.sku ??
      product?.barcode ??
      ''
    ).trim()

  const availability =
    buildAvailability(
      productId
    )

  const price =
    Number(
      product?.salePrice ??
      product?.sellingPrice ??
      product?.price ??
      product?.consumerPrice ??
      0
    )

  return {

    ...product,

    id:
      productId,

    productId,

    price,

    salePrice:
      price,

    stock:
      availability.quantity,

    quantity:
      availability.quantity,

    availableQuantity:
      availability.quantity,

    available:
      availability.available,

    availability
  }
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

            if (
              tire.width !==
              requestedWidth
            ) {
              return false
            }

            if (
              tire.rim !==
              requestedRim
            ) {
              return false
            }

            // ------------------------------------------------
            // TWO PART
            // 1200/24
            // ------------------------------------------------

            if (
              format ===
              'two-part'
            ) {
              return true
            }

            // ------------------------------------------------
            // THREE PART
            // 205/55/16
            // ------------------------------------------------

            return (
              tire.profile !== null &&
              requestedProfile !== null &&
              tire.profile ===
              requestedProfile
            )
          }
        )

    return matchedProducts.map(
      buildSearchResult
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

    const matchedProducts =
      products.filter(
        product => {

          const type =
            normalizeType(
              product?.type
            )

          if (
            type !== 'battery'
          ) {
            return false
          }

          return batteryCapacityMatches(
            product,
            requestedCapacity
          )
        }
      )

    return matchedProducts.map(
      buildSearchResult
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
      normalizeOilValue(
        viscosity
      )

    if (
      !requestedViscosity
    ) {
      return []
    }

    const matchedProducts =
      products.filter(
        product => {

          const type =
            normalizeType(
              product?.type
            )

          if (
            type !== 'oil'
          ) {
            return false
          }

          return oilViscosityMatches(
            product,
            requestedViscosity
          )
        }
      )

    return matchedProducts.map(
      buildSearchResult
    )
  }
}

export default VehicleSearchController