// ======================================================
// EL OLA ERP
// Vehicle Search Controller
// ======================================================

import VehicleEngine
  from '../engines/VehicleEngine'

import ProductsRepository
  from '../../repositories/ProductsRepository'

import {
  useWarehouseStore
} from '../../store/warehouseStore'


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value => {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')

}


// ======================================================
// NORMALIZE TYPE
// ======================================================

const normalizeType = value => {

  const type =
    normalizeText(value)

  if (
    [
      'tire',
      'tires',
      'tyre',
      'tyres',
      'اطار',
      'اطارات'
    ].includes(type)
  ) {

    return 'tire'

  }


  if (
    [
      'battery',
      'batteries',
      'بطاريه',
      'بطاريات',
      'بطارية'
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
// NUMBER VALUE
// ======================================================

const numberValue = value => {

  if (
    value === null ||
    value === undefined ||
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


  return Number.isFinite(
    normalized
  )
    ? normalized
    : null

}


// ======================================================
// GET PRODUCT TYPE
// ======================================================

const getProductType = product => {

  if (!product) {

    return ''

  }


  const candidates = [

    product?.type,

    product?.productType,

    product?.category,

    product?.categoryType,

    product?.itemType,

    product?.kind,

    product?.productCategory,

    product?.specifications?.type,

    product?.attributes?.type

  ]


  for (
    const value of candidates
  ) {

    const normalized =
      normalizeType(value)


    if (
      normalized === 'tire' ||
      normalized === 'battery' ||
      normalized === 'oil'
    ) {

      return normalized

    }

  }


  return ''

}


// ======================================================
// GET TIRE DATA
// ======================================================

const getProductTire = product => {

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
// GET BATTERY DATA
// ======================================================

const getProductBattery = product => {

  return (

    product?.battery ||

    product?.batteryData ||

    product?.batterySpecification ||

    product?.batterySpecifications ||

    product?.specifications?.battery ||

    product?.specification?.battery ||

    product?.attributes?.battery ||

    {}

  )

}


// ======================================================
// GET OIL DATA
// ======================================================

const getProductOil = product => {

  return (

    product?.oil ||

    product?.oilData ||

    product?.oilSpecification ||

    product?.oilSpecifications ||

    product?.specifications?.oil ||

    product?.specification?.oil ||

    product?.attributes?.oil ||

    {}

  )

}


// ======================================================
// GET TIRE VALUE
// ======================================================

const getTireValue = (
  tire,
  keys
) => {

  if (
    !tire ||
    typeof tire !== 'object'
  ) {

    return null

  }


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
// GET ALL WAREHOUSE PRODUCTS
// ======================================================

const getWarehouseProducts = () => {

  let warehouses = []


  try {

    const state =
      useWarehouseStore.getState()


    if (
      Array.isArray(
        state?.warehouses
      )
    ) {

      warehouses =
        state.warehouses

    }

  }
  catch (error) {

    console.error(
      'Warehouse products read failed:',
      error
    )

    return []

  }


  const products = []


  warehouses.forEach(
    warehouse => {

      if (!warehouse) {

        return

      }


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
              ''
            ).trim()


          if (!productId) {

            return

          }


          const quantity =
            Number(
              product?.availableQuantity ??
              product?.quantity ??
              product?.stock ??
              0
            )


          const salePrice =
            Number(
              product?.salePrice ??
              product?.sellingPrice ??
              product?.consumerPrice ??
              product?.price ??
              0
            )


          products.push({

            ...product,

            id:
              productId,

            productId,

            name:
              product?.name ||
              product?.productName ||
              '',

            productName:
              product?.productName ||
              product?.name ||
              '',

            type:
              normalizeType(
                product?.type ||
                product?.productType ||
                product?.category ||
                product?.categoryType ||
                product?.itemType ||
                product?.kind
              ),

            warehouseId:
              warehouse?.id,

            warehouseName:
              warehouse?.name ||
              '',

            quantity,

            stock:
              quantity,

            availableQuantity:
              quantity,

            salePrice,

            price:
              salePrice

          })

        }
      )

    }
  )


  return products

}


// ======================================================
// GET REPOSITORY PRODUCTS
// ======================================================

const getRepositoryProducts = async () => {

  try {

    const response =
      await ProductsRepository.getAll()


    if (
      response?.success === false
    ) {

      console.error(
        'ProductsRepository.getAll failed:',
        response?.message,
        response?.errors
      )

      return []

    }


    const products =
      Array.isArray(
        response?.data
      )
        ? response.data
        : []


    console.log(
      '[VehicleSearchController] Repository products:',
      products.length
    )


    return products

  }
  catch (error) {

    console.error(
      'ProductsRepository.getAll failed:',
      error
    )

    return []

  }

}


// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getAllProducts = async () => {

  console.log(
    '[VehicleSearchController] getAllProducts START'
  )

  let repositoryProducts = []
  let warehouseProducts = []

  try {

    [
      repositoryProducts,
      warehouseProducts
    ] = await Promise.all([

      getRepositoryProducts(),

      Promise.resolve(
        getWarehouseProducts()
      )

    ])

  }
  catch (error) {

    console.error(
      '[VehicleSearchController] getAllProducts LOAD ERROR:',
      error
    )

    return []

  }


  console.log(
    '[VehicleSearchController] Repository count:',
    repositoryProducts.length
  )

  console.log(
    '[VehicleSearchController] Warehouse count:',
    warehouseProducts.length
  )


  const map =
    new Map()


  // ====================================================
  // FIRST: REPOSITORY CATALOG
  // ====================================================

  try {

    repositoryProducts.forEach(
      product => {

        if (!product) {

          return

        }


        const id =
          String(
            product?.productId ??
            product?.id ??
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
              id,

            type:
              getProductType(product)

          }
        )

      }
    )

  }
  catch (error) {

    console.error(
      '[VehicleSearchController] Repository catalog build ERROR:',
      error
    )

    return []

  }


  // ====================================================
  // SECOND: WAREHOUSE ENRICHMENT
  // ====================================================

  try {

    warehouseProducts.forEach(
      product => {

        if (!product) {

          return

        }


        const id =
          String(
            product?.productId ??
            product?.id ??
            ''
          ).trim()


        if (!id) {

          return

        }


        const existing =
          map.get(id) ||
          {}


        map.set(
          id,
          {

            ...existing,

            ...product,

            id,

            productId:
              id,

            name:
              existing?.name ||
              existing?.productName ||
              product?.name ||
              product?.productName ||
              '',

            productName:
              existing?.productName ||
              existing?.name ||
              product?.productName ||
              product?.name ||
              '',

            type:
              getProductType(existing) ||
              getProductType(product),

            salePrice:
              Number(
                product?.salePrice ??
                product?.sellingPrice ??
                product?.consumerPrice ??
                product?.price ??
                existing?.salePrice ??
                existing?.sellingPrice ??
                existing?.consumerPrice ??
                existing?.price ??
                0
              ),

            price:
              Number(
                product?.salePrice ??
                product?.sellingPrice ??
                product?.consumerPrice ??
                product?.price ??
                existing?.salePrice ??
                existing?.sellingPrice ??
                existing?.consumerPrice ??
                existing?.price ??
                0
              )

          }
        )

      }
    )

  }
  catch (error) {

    console.error(
      '[VehicleSearchController] Warehouse enrichment ERROR:',
      error
    )

    return []

  }


  // ====================================================
  // BUILD WAREHOUSE AVAILABILITY
  // ====================================================

  const availabilityMap =
    new Map()


  try {

    warehouseProducts.forEach(
      product => {

        if (!product) {

          return

        }


        const id =
          String(
            product?.productId ??
            product?.id ??
            ''
          ).trim()


        if (!id) {

          return

        }


        if (
          !availabilityMap.has(id)
        ) {

          availabilityMap.set(
            id,
            []
          )

        }


        const quantity =
          Number(
            product?.availableQuantity ??
            product?.quantity ??
            product?.stock ??
            0
          )


        availabilityMap
          .get(id)
          .push({

            id:
              product?.warehouseId,

            warehouseId:
              product?.warehouseId,

            name:
              product?.warehouseName ||
              'المخزن',

            warehouseName:
              product?.warehouseName ||
              'المخزن',

            quantity

          })

      }
    )

  }
  catch (error) {

    console.error(
      '[VehicleSearchController] Availability build ERROR:',
      error
    )

    return []

  }


  // ====================================================
  // FINAL PRODUCTS
  // ====================================================

  let finalProducts = []

  try {

    finalProducts =
      Array.from(
        map.values()
      )
        .map(
          product => {

            const productId =
              String(
                product?.productId ??
                product?.id ??
                ''
              ).trim()


            const warehouses =
              availabilityMap.get(
                productId
              ) || []


            const totalStock =
              warehouses.reduce(
                (
                  total,
                  warehouse
                ) =>
                  total +
                  Number(
                    warehouse?.quantity ||
                    0
                  ),
                0
              )


            return {

              ...product,

              id:
                productId,

              productId,

              stock:
                totalStock,

              quantity:
                totalStock,

              availableQuantity:
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
  catch (error) {

    console.error(
      '[VehicleSearchController] Final catalog build ERROR:',
      error
    )

    return []

  }


  console.log(
    '[VehicleSearchController] Final catalog:',
    finalProducts.length
  )

  console.log(
    '[VehicleSearchController] getAllProducts END'
  )


  return finalProducts

}


// ======================================================
// CONTROLLER
// ======================================================

class VehicleSearchController {


  // ====================================================
  // VEHICLE SEARCH
  // ====================================================

  static async searchVehicle({

    vehicleType,

    make,

    model,

    year

  }) {

    console.log(
      '=================================================='
    )

    console.log(
      '[VehicleSearchController] searchVehicle START'
    )

    console.log(
      '[VehicleSearchController] searchVehicle INPUT:',
      {
        vehicleType,
        make,
        model,
        year
      }
    )


    let products = []

    try {

      console.log(
        '[VehicleSearchController] BEFORE getAllProducts'
      )

      products =
        await getAllProducts()

      console.log(
        '[VehicleSearchController] AFTER getAllProducts:',
        products.length
      )

    }
    catch (error) {

      console.error(
        '[VehicleSearchController] getAllProducts ERROR:',
        error
      )

      return {

        vehicle: null,

        oem: {},

        compatibility: null,

        tires: [],

        batteries: [],

        oils: [],

        products: []

      }

    }


    console.log(
      '[VehicleSearchController] Vehicle search:',
      {
        vehicleType,
        make,
        model,
        year,
        productsCount:
          products.length
      }
    )


    console.log(
      '[VehicleSearchController] BEFORE VehicleEngine.search'
    )

    console.log(
      '[VehicleSearchController] VehicleEngine:',
      VehicleEngine
    )


    try {

      console.log(
        '[VehicleSearchController] CALLING VehicleEngine.search'
      )

      const result =
        await VehicleEngine.search({

          vehicleType,

          make,

          model,

          year,

          products

        })


      console.log(
        '[VehicleSearchController] VehicleEngine.search RETURNED',
        {
          products:
            result?.products?.length ?? 0,

          tires:
            result?.tires?.length ?? 0,

          batteries:
            result?.batteries?.length ?? 0,

          oils:
            result?.oils?.length ?? 0
        }
      )

      console.log(
        '[VehicleSearchController] searchVehicle END'
      )

      console.log(
        '=================================================='
      )


      return result

    }
    catch (error) {

      console.error(
        '[VehicleSearchController] VehicleEngine.search ERROR:',
        error
      )

      console.log(
        '=================================================='
      )


      return {

        vehicle: null,

        oem: {},

        compatibility: null,

        tires: [],

        batteries: [],

        oils: [],

        products: []

      }

    }

  }


  // ====================================================
  // TIRE SEARCH
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
      numberValue(width)


    const requestedProfile =
      numberValue(profile)


    const requestedRim =
      numberValue(rim)


    if (
      requestedWidth === null ||
      requestedRim === null
    ) {

      return []

    }


    return products

      // ----------------------------------------------
      // TYPE
      // ----------------------------------------------

      .filter(
        product =>
          getProductType(product) ===
          'tire'
      )

      // ----------------------------------------------
      // SIZE
      // ----------------------------------------------

      .filter(
        product => {

          const tire =
            getProductTire(product)


          const productWidth =
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


          const productProfile =
            numberValue(
              getTireValue(
                tire,
                [
                  'profile',
                  'height',
                  'aspectRatio',
                  'aspect'
                ]
              )
            )


          const productRim =
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
            productWidth !==
            requestedWidth
          ) {

            return false

          }


          if (
            productRim !==
            requestedRim
          ) {

            return false

          }


          if (
            format ===
            'two-part'
          ) {

            return true

          }


          return (

            productProfile !== null &&

            requestedProfile !== null &&

            productProfile ===
            requestedProfile

          )

        }
      )

      // ----------------------------------------------
      // AVAILABLE STOCK
      // ----------------------------------------------

      .filter(
        product =>
          Number(
            product?.availability?.quantity ??
            product?.quantity ??
            product?.stock ??
            0
          ) > 0
      )

  }


  // ====================================================
  // BATTERY SEARCH
  // ====================================================

  static async searchBattery({

    capacity

  }) {

    const products =
      await getAllProducts()


    const requestedCapacity =
      numberValue(capacity)


    if (
      requestedCapacity === null
    ) {

      return []

    }


    return products

      // ----------------------------------------------
      // TYPE
      // ----------------------------------------------

      .filter(
        product =>
          getProductType(product) ===
          'battery'
      )

      // ----------------------------------------------
      // CAPACITY
      // ----------------------------------------------

      .filter(
        product => {

          const battery =
            getProductBattery(product)


          const productCapacity =
            numberValue(

              battery?.capacity ??
              battery?.ampereHour ??
              battery?.ah ??
              battery?.amp ??
              battery?.ampHours ??
              product?.capacity ??
              product?.ampereHour ??
              product?.ah ??
              product?.amp ??
              product?.ampHours

            )


          return (
            productCapacity ===
            requestedCapacity
          )

        }
      )

      // ----------------------------------------------
      // AVAILABLE STOCK
      // ----------------------------------------------

      .filter(
        product =>
          Number(
            product?.availability?.quantity ??
            product?.quantity ??
            product?.stock ??
            0
          ) > 0
      )

  }


  // ====================================================
  // OIL SEARCH
  // ====================================================

  static async searchOil({

    viscosity

  }) {

    const products =
      await getAllProducts()


    const requestedViscosity =
      normalizeText(viscosity)
        .replace(/\s+/g, '')
        .replace(/×/g, 'x')


    if (!requestedViscosity) {

      return []

    }


    return products

      // ----------------------------------------------
      // TYPE
      // ----------------------------------------------

      .filter(
        product =>
          getProductType(product) ===
          'oil'
      )

      // ----------------------------------------------
      // VISCOSITY
      // ----------------------------------------------

      .filter(
        product => {

          const oil =
            getProductOil(product)


          const productViscosity =
            normalizeText(

              oil?.viscosity ??
              oil?.grade ??
              oil?.oilGrade ??
              product?.viscosity ??
              product?.grade ??
              product?.oilGrade ??
              ''

            )
              .replace(/\s+/g, '')
              .replace(/×/g, 'x')


          return (
            productViscosity ===
            requestedViscosity
          )

        }
      )

      // ----------------------------------------------
      // AVAILABLE STOCK
      // ----------------------------------------------

      .filter(
        product =>
          Number(
            product?.availability?.quantity ??
            product?.quantity ??
            product?.stock ??
            0
          ) > 0
      )

  }

}


// ======================================================
// EXPORT
// ======================================================

export default VehicleSearchController