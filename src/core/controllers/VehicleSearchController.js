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
      'اطارات',
      'إطار',
      'إطارات'
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
    value ===
    null ||
    value ===
    undefined ||
    value ===
    ''
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

  return normalizeType(
    product?.type ||
    product?.productType ||
    product?.category
  )

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

  for (
    const key of keys
  ) {

    const value =
      tire?.[key]


    if (
      value !==
        undefined &&
      value !==
        null &&
      value !==
        ''
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
            )


          if (!productId) {
            return
          }


          const quantity =
            Number(
              product?.availableQuantity ??
              product?.quantity ??
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
                product?.category
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

            salePrice:
              Number(
                product?.salePrice ??
                product?.sellingPrice ??
                product?.consumerPrice ??
                product?.price ??
                0
              ),

            price:
              Number(
                product?.salePrice ??
                product?.sellingPrice ??
                product?.consumerPrice ??
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


// ======================================================
// GET REPOSITORY PRODUCTS
// ======================================================

const getRepositoryProducts = async () => {

  try {

    const data =
      await ProductsRepository.getAll()


    return Array.isArray(data)
      ? data
      : []

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
//
// المصدر الأساسي:
// warehouseStore
//
// ProductsRepository يبقى مصدرًا إضافيًا
// حتى لا نكسر المنتجات القديمة.
// ======================================================

const getAllProducts = async () => {

  const [
    repositoryProducts,
    warehouseProducts
  ] = await Promise.all([

    getRepositoryProducts(),

    Promise.resolve(
      getWarehouseProducts()
    )

  ])


  const map =
    new Map()


  // ====================================================
  // FIRST: REPOSITORY
  // ====================================================

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
        )


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
            normalizeType(
              product?.type ||
              product?.productType ||
              product?.category
            )

        }
      )

    }
  )


  // ====================================================
  // SECOND: WAREHOUSE
  // ====================================================
  //
  // بيانات المخزن لها الأولوية:
  //
  // - المنتج
  // - السعر
  // - الكمية
  // - نوع المنتج
  // - بيانات البطارية
  // - بيانات الزيت
  // - بيانات الإطار
  //
  // ====================================================

  warehouseProducts.forEach(
    product => {

      const id =
        String(
          product?.productId ??
          product?.id ??
          ''
        )


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
            normalizeType(
              product?.type ||
              product?.productType ||
              product?.category ||
              existing?.type ||
              existing?.productType ||
              existing?.category
            ),

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
            ),

          quantity:
            Number(
              product?.quantity ??
              product?.availableQuantity ??
              product?.stock ??
              0
            ),

          stock:
            Number(
              product?.quantity ??
              product?.availableQuantity ??
              product?.stock ??
              0
            ),

          availableQuantity:
            Number(
              product?.quantity ??
              product?.availableQuantity ??
              product?.stock ??
              0
            )

        }
      )

    }
  )


  // ====================================================
  // BUILD WAREHOUSE AVAILABILITY
  // ====================================================

  const availabilityMap =
    new Map()


  warehouseProducts.forEach(
    product => {

      const id =
        String(
          product?.productId ??
          product?.id ??
          ''
        )


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
          product?.quantity ??
          product?.availableQuantity ??
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


  // ====================================================
  // FINAL PRODUCTS
  // ====================================================

  return Array.from(
    map.values()
  )
    .map(
      product => {

        const productId =
          String(
            product?.productId ??
            product?.id ??
            ''
          )


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
      requestedWidth ===
      null ||

      requestedRim ===
      null
    ) {

      return []

    }


    return products

      // ----------------------------------------------
      // TYPE
      // ----------------------------------------------

      .filter(
        product =>
          getProductType(
            product
          ) ===
          'tire'
      )


      // ----------------------------------------------
      // SIZE
      // ----------------------------------------------

      .filter(
        product => {

          const tire =
            getProductTire(
              product
            )


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


          // المقاسات ذات جزئين:
          // 1200/24
          //
          // لا يوجد Profile.

          if (
            format ===
            'two-part'
          ) {

            return true

          }


          return (

            productProfile !==
              null &&

            requestedProfile !==
              null &&

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
            product?.availability
              ?.quantity ??
            product?.quantity ??
            product?.stock ??
            0
          ) > 0
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
    requestedCapacity ===
    null
  ) {

    return []

  }


  return products

    // ----------------------------------------------
    // TYPE
    // ----------------------------------------------

    .filter(
      product =>
        getProductType(
          product
        ) ===
        'battery'
    )


    // ----------------------------------------------
    // CAPACITY
    // ----------------------------------------------

    .filter(
      product => {

        const battery =
          getProductBattery(
            product
          )


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
          product?.availability
            ?.quantity ??
          product?.quantity ??
          product?.stock ??
          0
        ) > 0
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


  if (
    !requestedViscosity
  ) {

    return []

  }


  return products

    // ----------------------------------------------
    // TYPE
    // ----------------------------------------------

    .filter(
      product =>
        getProductType(
          product
        ) ===
        'oil'
    )


    // ----------------------------------------------
    // VISCOSITY
    // ----------------------------------------------

    .filter(
      product => {

        const oil =
          getProductOil(
            product
          )


        const productViscosity =
          normalizeText(

            oil?.viscosity ??
            oil?.grade ??
            oil?.oilGrade ??
            product?.viscosity ??
            product?.grade ??
            product?.oilGrade

          )


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
          product?.availability
            ?.quantity ??
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
