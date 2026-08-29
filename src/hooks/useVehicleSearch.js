// ======================================================
// EL OLA ERP
// useVehicleSearch Hook
// ======================================================

import { useMemo, useState } from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleSearchController
  from '../core/controllers/VehicleSearchController'

import {
  useWarehouseStore
} from '../store/warehouseStore'

import {
  useWebsiteStore
} from '../store/websiteStore'


// ======================================================
// NORMALIZE
// ======================================================

const norm = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/يَ|يُ|يِ|َ|ُ|ِ|ّ|ْ/g, '')


// ======================================================
// NORMALIZE TYPE
// ======================================================

const normalizeType = value => {

  const type =
    norm(value)

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
// VALUE EQUALITY
// ======================================================

const valuesMatch = (
  actual,
  wanted
) => {

  const left =
    norm(actual)

  const right =
    norm(wanted)

  if (
    !left ||
    !right
  ) {
    return false
  }

  return (
    left === right ||
    left.includes(right) ||
    right.includes(left)
  )
}


// ======================================================
// TIRE SIZE PARSER
// ======================================================

const parseTireSize = value => {

  const input =
    String(value ?? '')
      .trim()
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/x/gi, '*')
      .replace(/-/g, '/')

  if (!input) {
    return null
  }

  const threePart =
    input.match(
      /^(\d+(?:\.\d+)?)[\/\\*](\d+(?:\.\d+)?)[\/\\*](\d+(?:\.\d+)?)$/
    )

  if (threePart) {

    return {

      width:
        threePart[1],

      profile:
        threePart[2],

      rim:
        threePart[3],

      format:
        'three-part'

    }
  }

  const twoPart =
    input.match(
      /^(\d+(?:\.\d+)?)[\/\\*](\d+(?:\.\d+)?)$/
    )

  if (twoPart) {

    return {

      width:
        twoPart[1],

      profile:
        '',

      rim:
        twoPart[2],

      format:
        'two-part'

    }
  }

  return null
}


// ======================================================
// FLATTEN SEARCH RESULTS
// ======================================================

const flattenSearchResults = (
  tab,
  data
) => {

  if (
    Array.isArray(data)
  ) {
    return data
  }

  if (
    !data ||
    typeof data !== 'object'
  ) {
    return []
  }

  if (
    tab === 'vehicle'
  ) {

    return [

      ...(Array.isArray(data.tires)
        ? data.tires
        : []),

      ...(Array.isArray(data.batteries)
        ? data.batteries
        : []),

      ...(Array.isArray(data.oils)
        ? data.oils
        : []),

      ...(Array.isArray(data.parts)
        ? data.parts
        : []),

      ...(Array.isArray(data.products)
        ? data.products
        : [])

    ]
  }

  if (
    tab === 'tire'
  ) {

    return Array.isArray(data.tires)
      ? data.tires
      : []
  }

  if (
    tab === 'battery'
  ) {

    return Array.isArray(data.batteries)
      ? data.batteries
      : []
  }

  if (
    tab === 'oil'
  ) {

    return Array.isArray(data.oils)
      ? data.oils
      : []
  }

  return []
}


// ======================================================
// IDS
// ======================================================

const idsEqual = (
  a,
  b
) => {

  const left = [

    a?.productId,
    a?.id,
    a?.sku,
    a?.barcode

  ]
    .filter(Boolean)
    .map(norm)

  const right = [

    b?.productId,
    b?.id,
    b?.sku,
    b?.barcode

  ]
    .filter(Boolean)
    .map(norm)

  return left.some(
    id =>
      right.includes(id)
  )
}


// ======================================================
// ACTIVE OFFER
// ======================================================

const activeOfferFor = product => {

  const websiteState =
    useWebsiteStore.getState()

  const websiteProducts =
    Array.isArray(
      websiteState?.products
    )
      ? websiteState.products
      : []

  const websiteProduct =
    websiteProducts.find(
      item =>
        idsEqual(
          item,
          product
        )
    )

  if (
    !websiteProduct
  ) {

    return {

      websiteProduct:
        null,

      offer:
        null

    }
  }

  const offers =
    Array.isArray(
      websiteState?.offers
    )
      ? websiteState.offers
      : []

  const now =
    new Date()

  const offer =
    offers.find(
      item => {

        if (
          !item ||
          item.active === false ||
          item.productId == null
        ) {
          return false
        }

        if (
          !idsEqual(
            websiteProduct,
            {
              productId:
                item.productId
            }
          )
        ) {
          return false
        }

        if (
          item.startDate
        ) {

          const date =
            new Date(
              item.startDate
            )

          if (
            !Number.isNaN(
              date.getTime()
            ) &&
            now < date
          ) {
            return false
          }
        }

        if (
          item.endDate
        ) {

          const date =
            new Date(
              item.endDate
            )

          if (
            !Number.isNaN(
              date.getTime()
            ) &&
            now > date
          ) {
            return false
          }
        }

        return true
      }
    ) || null

  return {

    websiteProduct,
    offer

  }
}


// ======================================================
// PUBLIC WAREHOUSE PRODUCT
// ======================================================

const publicWarehouseProduct =
  product => {

    const {
      websiteProduct,
      offer
    } =
      activeOfferFor(
        product
      )

    const warehousePrice =
      Number(
        product?.salePrice ??
        product?.sellingPrice ??
        product?.price ??
        0
      )

    const catalogPrice =
      Number(
        websiteProduct?.salePrice ??
        websiteProduct?.sellingPrice ??
        websiteProduct?.price ??
        0
      )

    const salePrice =
      Number.isFinite(
        warehousePrice
      ) &&
      warehousePrice > 0

        ? warehousePrice

        : (
            Number.isFinite(
              catalogPrice
            )
              ? catalogPrice
              : 0
          )

    let offerPrice =
      null

    if (
      offer
    ) {

      const explicit =
        Number(
          offer.offerPrice ??
          offer.salePrice ??
          offer.newPrice ??
          NaN
        )

      if (
        Number.isFinite(
          explicit
        ) &&
        explicit >= 0
      ) {

        offerPrice =
          explicit

      } else {

        const discount =
          Number(
            offer.discount ??
            0
          )

        if (
          discount > 0 &&
          discount < 100 &&
          salePrice > 0
        ) {

          offerPrice =
            salePrice -
            (
              salePrice *
              discount /
              100
            )
        }
      }
    }

    const quantity =
      Math.max(
        0,
        Number(
          product?.quantity ??
          product?.availableQuantity ??
          product?.stock ??
          0
        )
      )

    return {

      ...(websiteProduct || {}),
      ...product,

      id:
        product?.productId ??
        product?.id ??
        websiteProduct?.id,

      productId:
        product?.productId ??
        product?.id ??
        websiteProduct?.productId ??
        websiteProduct?.id,

      name:
        product?.name ||
        product?.productName ||
        websiteProduct?.name ||
        websiteProduct?.productName ||
        '',

      productName:
        product?.productName ||
        product?.name ||
        websiteProduct?.productName ||
        websiteProduct?.name ||
        '',

      image:
        product?.image ||
        websiteProduct?.image ||
        '',

      description:
        product?.description ||
        websiteProduct?.description ||
        '',

      brand:
        product?.brand ||
        websiteProduct?.brand ||
        '',

      model:
        product?.model ||
        websiteProduct?.model ||
        '',

      type:
        product?.type ||
        websiteProduct?.type ||
        '',

      tire:
        product?.tire ||
        websiteProduct?.tire,

      battery:
        product?.battery ||
        websiteProduct?.battery,

      oil:
        product?.oil ||
        websiteProduct?.oil,

      compatibleVehicles:
        product?.compatibleVehicles ||
        websiteProduct?.compatibleVehicles ||
        [],

      vehicleCompatibility:
        product?.vehicleCompatibility ||
        websiteProduct?.vehicleCompatibility ||
        [],

      vehicleCompatibilities:
        product?.vehicleCompatibilities ||
        websiteProduct?.vehicleCompatibilities ||
        [],

      vehicles:
        product?.vehicles ||
        websiteProduct?.vehicles ||
        [],

      compatibility:
        product?.compatibility ||
        websiteProduct?.compatibility ||
        {},

      specifications:
        product?.specifications ||
        websiteProduct?.specifications ||
        {},

      attributes:
        product?.attributes ||
        websiteProduct?.attributes ||
        {},

      salePrice,

      offerPrice,

      oldPrice:
        offerPrice !== null
          ? salePrice
          : null,

      hasOffer:
        offerPrice !== null,

      offerTitle:
        offer?.title ||
        '',

      offerDescription:
        offer?.description ||
        '',

      offerId:
        offer?.id ??
        null,

      quantity,

      availableQuantity:
        quantity,

      available:
        quantity > 0,

      availability:
        quantity > 0
          ? 'متوفر'
          : 'غير متوفر',

      active:
        product?.active !== false &&
        websiteProduct?.active !== false,

      hidden:
        Boolean(
          product?.hidden
        )

    }
  }


// ======================================================
// WAREHOUSE PRODUCTS
// ======================================================

const warehouseProducts = () => {

  const out = []

  const state =
    useWarehouseStore.getState()

  const warehouses =
    Array.isArray(
      state?.warehouses
    )
      ? state.warehouses
      : []

  warehouses.forEach(
    warehouse => {

      const products =
        Array.isArray(
          warehouse?.products
        )
          ? warehouse.products
          : []

      products.forEach(
        product => {

          if (
            !product
          ) {
            return
          }

          out.push({

            ...product,

            warehouseId:
              product?.warehouseId ??
              warehouse?.id,

            warehouseName:
              product?.warehouseName ||
              warehouse?.name ||
              ''

          })
        }
      )
    }
  )

  return out
}


// ======================================================
// WEBSITE PRODUCTS
// ======================================================

const websiteProducts = () => {

  const state =
    useWebsiteStore.getState()

  return Array.isArray(
    state?.products
  )
    ? state.products
    : []
}


// ======================================================
// TIRE MATCH
// ======================================================

const tireMatches = (
  product,
  parsed
) => {

  if (
    !parsed
  ) {
    return false
  }

  const tire =
    product?.tire ||
    product?.tireData ||
    product?.tireSpecification ||
    product?.tireSpecifications ||
    product?.specifications?.tire ||
    product?.attributes?.tire ||
    {}

  const width =
    norm(
      tire?.width ??
      tire?.sectionWidth ??
      tire?.tireWidth ??
      product?.width
    )

  const profile =
    norm(
      tire?.profile ??
      tire?.height ??
      tire?.aspectRatio ??
      tire?.aspect ??
      product?.profile
    )

  const rim =
    norm(
      tire?.rim ??
      tire?.rimSize ??
      tire?.wheelDiameter ??
      tire?.diameter ??
      product?.rim
    )

  const wantedWidth =
    norm(parsed.width)

  const wantedProfile =
    norm(parsed.profile)

  const wantedRim =
    norm(parsed.rim)

  if (
    width === wantedWidth &&
    rim === wantedRim
  ) {

    if (
      !wantedProfile
    ) {
      return true
    }

    if (
      profile === wantedProfile
    ) {
      return true
    }
  }

  const sizeValues = [

    product?.tireSize,
    product?.size,
    product?.dimension,
    product?.dimensions,
    product?.sizeCode,
    product?.skuSize,
    product?.name,
    product?.productName,

    tire?.size,
    tire?.tireSize,
    tire?.dimension,
    tire?.dimensions,
    tire?.sizeCode

  ]

  const wanted = [

    wantedWidth,
    wantedProfile,
    wantedRim

  ].join('/')

  return sizeValues.some(
    value => {

      const size =
        norm(value)
          .replace(
            /[\/\\*×-]/g,
            '/'
          )
          .replace(
            /\s/g,
            ''
          )

      return (
        size === wanted
      )
    }
  )
}


// ======================================================
// VALUE MATCH
// ======================================================

const valueMatches = (
  product,
  value,
  fields
) => {

  const wanted =
    norm(value)

  if (
    !wanted
  ) {
    return false
  }

  const specifications =
    product?.specifications ||
    {}

  const attributes =
    product?.attributes ||
    {}

  const battery =
    product?.battery ||
    {}

  const oil =
    product?.oil ||
    {}

  const candidates = []

  fields.forEach(
    field => {

      candidates.push(
        product?.[field]
      )

      candidates.push(
        battery?.[field]
      )

      candidates.push(
        oil?.[field]
      )

      candidates.push(
        specifications?.[field]
      )

      candidates.push(
        attributes?.[field]
      )

      candidates.push(
        specifications?.battery?.[field]
      )

      candidates.push(
        specifications?.oil?.[field]
      )

      candidates.push(
        attributes?.battery?.[field]
      )

      candidates.push(
        attributes?.oil?.[field]
      )
    }
  )

  return candidates.some(
    candidate => {

      const actual =
        norm(candidate)

      if (
        !actual
      ) {
        return false
      }

      return (

        actual === wanted ||

        actual.includes(
          wanted
        ) ||

        wanted.includes(
          actual
        )

      )
    }
  )
}


// ======================================================
// BATTERY MATCH
// ======================================================

const batteryMatches = (
  product,
  capacity
) => {

  return valueMatches(
    product,
    capacity,
    [

      'capacity',
      'ampereHour',
      'ah',
      'amp',
      'ampHours'

    ]
  )
}


// ======================================================
// OIL MATCH
// ======================================================

const oilMatches = (
  product,
  viscosity
) => {

  return valueMatches(
    product,
    viscosity,
    [

      'viscosity',
      'grade',
      'oilGrade'

    ]
  )
}


// ======================================================
// PRODUCT TYPE
// ======================================================

const productType = product => {

  return normalizeType(
    product?.type
  )
}


// ======================================================
// VEHICLE OBJECT MATCH
// ======================================================

const vehicleObjectMatches = (
  vehicle,
  form
) => {

  if (
    !vehicle ||
    typeof vehicle !== 'object'
  ) {
    return false
  }

  const vehicleType =
    vehicle?.vehicleType ??
    vehicle?.vehicle_type ??
    vehicle?.type ??
    vehicle?.category ??
    vehicle?.vehicleCategory ??
    ''

  if (
    form?.vehicleType &&
    vehicleType &&
    !valuesMatch(
      vehicleType,
      form.vehicleType
    )
  ) {
    return false
  }

  const brand =
    vehicle?.brand ??
    vehicle?.make ??
    vehicle?.manufacturer ??
    vehicle?.brandName ??
    vehicle?.makeName ??
    ''

  if (
    form?.brand &&
    brand &&
    !valuesMatch(
      brand,
      form.brand
    )
  ) {
    return false
  }

  const model =
    vehicle?.model ??
    vehicle?.modelName ??
    vehicle?.vehicleModel ??
    vehicle?.vehicleModelName ??
    ''

  if (
    form?.model &&
    model &&
    !valuesMatch(
      model,
      form.model
    )
  ) {
    return false
  }

  if (
    form?.year !== '' &&
    form?.year !== null &&
    form?.year !== undefined
  ) {

    const requestedYear =
      Number(
        form.year
      )

    if (
      !Number.isFinite(
        requestedYear
      )
    ) {
      return false
    }

    const singleYear =
      Number(
        vehicle?.year ??
        vehicle?.modelYear ??
        vehicle?.productionYear ??
        vehicle?.yearModel ??
        NaN
      )

    if (
      Number.isFinite(
        singleYear
      )
    ) {

      return (
        requestedYear ===
        singleYear
      )
    }

    const from =
      Number(
        vehicle?.yearFrom ??
        vehicle?.fromYear ??
        vehicle?.from ??
        vehicle?.startYear ??
        vehicle?.minYear ??
        NaN
      )

    const to =
      Number(
        vehicle?.yearTo ??
        vehicle?.toYear ??
        vehicle?.to ??
        vehicle?.endYear ??
        vehicle?.maxYear ??
        NaN
      )

    if (
      Number.isFinite(from) &&
      Number.isFinite(to)
    ) {

      return (
        requestedYear >= from &&
        requestedYear <= to
      )
    }

    if (
      Number.isFinite(from)
    ) {

      return (
        requestedYear >= from
      )
    }

    if (
      Number.isFinite(to)
    ) {

      return (
        requestedYear <= to
      )
    }
  }

  return true
}


// ======================================================
// VEHICLE STRING MATCH
// ======================================================

const vehicleStringMatches = (
  value,
  form
) => {

  const text =
    norm(value)

  if (
    !text
  ) {
    return false
  }

  const requested = [

    form?.vehicleType,
    form?.brand,
    form?.model

  ]
    .filter(Boolean)
    .map(norm)

  if (
    requested.length === 0
  ) {
    return false
  }

  const basicMatch =
    requested.every(
      item =>
        text.includes(item)
    )

  if (
    !basicMatch
  ) {
    return false
  }

  if (
    form?.year !== '' &&
    form?.year !== null &&
    form?.year !== undefined
  ) {

    const year =
      norm(
        form.year
      )

    if (
      year &&
      !text.includes(year)
    ) {
      return false
    }
  }

  return true
}


// ======================================================
// VEHICLE COMPATIBILITY VALUES
// ======================================================

const collectVehicleCompatibility = product => {

  const output = []

  const add = value => {

    if (
      value == null
    ) {
      return
    }

    if (
      Array.isArray(value)
    ) {

      value.forEach(
        item =>
          add(item)
      )

      return
    }

    if (
      typeof value === 'object'
    ) {

      output.push(
        value
      )

      return
    }

    if (
      typeof value === 'string'
    ) {

      if (
        value.trim()
      ) {

        output.push(
          value
        )
      }
    }
  }

  add(
    product?.compatibleVehicles
  )

  add(
    product?.vehicleCompatibility
  )

  add(
    product?.vehicleCompatibilities
  )

  add(
    product?.vehicles
  )

  add(
    product?.compatibility?.vehicles
  )

  add(
    product?.compatibility?.compatibleVehicles
  )

  add(
    product?.compatibility?.vehicleCompatibility
  )

  add(
    product?.compatibility?.vehicleCompatibilities
  )

  add(
    product?.specifications?.compatibleVehicles
  )

  add(
    product?.specifications?.vehicleCompatibility
  )

  add(
    product?.specifications?.vehicleCompatibilities
  )

  add(
    product?.specifications?.vehicles
  )

  add(
    product?.attributes?.compatibleVehicles
  )

  add(
    product?.attributes?.vehicleCompatibility
  )

  add(
    product?.attributes?.vehicleCompatibilities
  )

  add(
    product?.attributes?.vehicles
  )

  return output
}


// ======================================================
// VEHICLE MATCH
// ======================================================

const vehicleMatches = (
  product,
  form
) => {

  if (
    !product ||
    !form
  ) {
    return false
  }

  const vehicles =
    collectVehicleCompatibility(
      product
    )

  if (
    vehicles.length === 0
  ) {
    return false
  }

  return vehicles.some(
    vehicle => {

      if (
        typeof vehicle === 'string'
      ) {

        return vehicleStringMatches(
          vehicle,
          form
        )
      }

      if (
        typeof vehicle !== 'object'
      ) {
        return false
      }

      return vehicleObjectMatches(
        vehicle,
        form
      )
    }
  )
}


// ======================================================
// MERGE
// ======================================================

const mergeProducts = products => {

  const map =
    new Map()

  products.forEach(
    product => {

      if (
        !product
      ) {
        return
      }

      const id =
        String(
          product?.productId ??
          product?.id ??
          product?.sku ??
          product?.barcode ??
          ''
        )
          .trim()

      if (
        !id
      ) {
        return
      }

      const key =
        norm(id)

      const existing =
        map.get(key)

      map.set(
        key,
        {

          ...(existing || {}),

          ...product,

          id,

          productId:
            product?.productId ??
            existing?.productId ??
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

          compatibleVehicles:
            product?.compatibleVehicles?.length
              ? product.compatibleVehicles
              : (
                  existing?.compatibleVehicles ||
                  []
                ),

          vehicleCompatibility:
            product?.vehicleCompatibility?.length
              ? product.vehicleCompatibility
              : (
                  existing?.vehicleCompatibility ||
                  []
                ),

          vehicleCompatibilities:
            product?.vehicleCompatibilities?.length
              ? product.vehicleCompatibilities
              : (
                  existing?.vehicleCompatibilities ||
                  []
                ),

          vehicles:
            product?.vehicles?.length
              ? product.vehicles
              : (
                  existing?.vehicles ||
                  []
                ),

          compatibility:
            product?.compatibility ||
            existing?.compatibility ||
            {},

          specifications:
            product?.specifications ||
            existing?.specifications ||
            {},

          attributes:
            product?.attributes ||
            existing?.attributes ||
            {},

          quantity:
            Math.max(
              0,
              Number(
                product?.quantity ??
                product?.availableQuantity ??
                product?.stock ??
                existing?.quantity ??
                existing?.availableQuantity ??
                existing?.stock ??
                0
              )
            ),

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
// MERGE WAREHOUSE SEARCH RESULTS
// ======================================================

const mergeWarehouseSearchResults = (
  tab,
  controllerResults,
  form,
  parsed
) => {

  const warehouse =
    warehouseProducts()

  const catalog =
    websiteProducts()

  let warehouseMatches =
    []

  let catalogMatches =
    []

  // ====================================================
  // TIRE
  // ====================================================

  if (
    tab === 'tire'
  ) {

    warehouseMatches =
      warehouse.filter(
        product =>
          productType(
            product
          ) === 'tire' &&
          tireMatches(
            product,
            parsed
          )
      )

    catalogMatches =
      catalog.filter(
        product =>
          productType(
            product
          ) === 'tire' &&
          tireMatches(
            product,
            parsed
          )
      )
  }

  // ====================================================
  // BATTERY
  // ====================================================

  if (
    tab === 'battery'
  ) {

    warehouseMatches =
      warehouse.filter(
        product =>
          productType(
            product
          ) === 'battery' &&
          batteryMatches(
            product,
            form.capacity
          )
      )

    catalogMatches =
      catalog.filter(
        product =>
          productType(
            product
          ) === 'battery' &&
          batteryMatches(
            product,
            form.capacity
          )
      )
  }

  // ====================================================
  // OIL
  // ====================================================

  if (
    tab === 'oil'
  ) {

    warehouseMatches =
      warehouse.filter(
        product =>
          productType(
            product
          ) === 'oil' &&
          oilMatches(
            product,
            form.viscosity
          )
      )

    catalogMatches =
      catalog.filter(
        product =>
          productType(
            product
          ) === 'oil' &&
          oilMatches(
            product,
            form.viscosity
          )
      )
  }

  // ====================================================
  // VEHICLE
  // ====================================================

  if (
    tab === 'vehicle'
  ) {

    warehouseMatches =
      warehouse.filter(
        product =>
          vehicleMatches(
            product,
            form
          )
      )

    catalogMatches =
      catalog.filter(
        product =>
          vehicleMatches(
            product,
            form
          )
      )
  }

  const normalizedWarehouse =
    warehouseMatches.map(
      publicWarehouseProduct
    )

  const normalizedCatalog =
    catalogMatches.map(
      publicWarehouseProduct
    )

  const normalizedController =
    Array.isArray(
      controllerResults
    )
      ? controllerResults.map(
          publicWarehouseProduct
        )
      : []

  return mergeProducts(
    [

      ...normalizedWarehouse,

      ...normalizedCatalog,

      ...normalizedController

    ]
  )
}


// ======================================================
// HOOK
// ======================================================

export default function useVehicleSearch() {

  const [
    loading,
    setLoading
  ] =
    useState(false)

  const [
    results,
    setResults
  ] =
    useState([])

  const [
    tireSearchError,
    setTireSearchError
  ] =
    useState('')

  const [
    form,
    setForm
  ] =
    useState({

      vehicleType:
        '',

      brand:
        '',

      model:
        '',

      year:
        '',

      tireSize:
        '',

      capacity:
        '',

      viscosity:
        ''

    })


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  const vehicleTypes =
    useMemo(
      () =>
        VehicleProvider.getVehicleTypes(),
      []
    )


  // ====================================================
  // BRANDS
  // ====================================================

  const brands =
    useMemo(
      () =>
        VehicleProvider.getBrands(
          form.vehicleType
        ),
      [
        form.vehicleType
      ]
    )


  // ====================================================
  // MODELS
  // ====================================================

  const models =
    useMemo(
      () =>
        VehicleProvider.getModels({

          vehicleType:
            form.vehicleType,

          brand:
            form.brand

        }),
      [
        form.vehicleType,
        form.brand
      ]
    )


  // ====================================================
  // YEARS
  // ====================================================

  const years =
    useMemo(
      () =>
        VehicleProvider.getYears({

          brand:
            form.brand,

          model:
            form.model

        }),
      [
        form.brand,
        form.model
      ]
    )


  // ====================================================
  // SEARCH
  // ====================================================

  const search =
    async tab => {

      setLoading(true)

      if (
        tab === 'tire'
      ) {

        setTireSearchError('')
      }

      try {

        // ==============================================
        // VEHICLE
        // ==============================================

        if (
          tab === 'vehicle'
        ) {

          if (
            !form.brand ||
            !form.model
          ) {

            setResults([])

            return []
          }

          let controllerResults =
            []

          try {

            const response =
              await VehicleSearchController.searchVehicle({

                vehicleType:
                  form.vehicleType,

                make:
                  form.brand,

                model:
                  form.model,

                year:
                  form.year

              })

            controllerResults =
              flattenSearchResults(
                'vehicle',
                response
              )

          } catch (
            controllerError
          ) {

            console.warn(
              'Vehicle controller search failed. Using local product compatibility search.',
              controllerError
            )

            controllerResults =
              []
          }

          const merged =
            mergeWarehouseSearchResults(

              'vehicle',

              controllerResults,

              form,

              null

            )

          setResults(
            merged
          )

          return merged
        }


        // ==============================================
        // TIRE
        // ==============================================

        if (
          tab === 'tire'
        ) {

          const parsed =
            parseTireSize(
              form.tireSize
            )

          if (
            !parsed
          ) {

            setResults([])

            setTireSearchError(
              'اكتب مقاس الإطار بهذا الشكل: 205/55/16 أو 1200/24'
            )

            return []
          }

          let controllerResults =
            []

          try {

            const response =
              await VehicleSearchController.searchTire({

                width:
                  parsed.width,

                profile:
                  parsed.profile,

                rim:
                  parsed.rim,

                format:
                  parsed.format

              })

            controllerResults =
              flattenSearchResults(
                'tire',
                response
              )

          } catch (
            error
          ) {

            console.warn(
              'Tire controller search failed. Using local product search.',
              error
            )

            controllerResults =
              []
          }

          const merged =
            mergeWarehouseSearchResults(

              'tire',

              controllerResults,

              form,

              parsed

            )

          setResults(
            merged
          )

          return merged
        }


        // ==============================================
        // BATTERY
        // ==============================================

        if (
          tab === 'battery'
        ) {

          let controllerResults =
            []

          try {

            const response =
              await VehicleSearchController.searchBattery({

                capacity:
                  form.capacity

              })

            controllerResults =
              flattenSearchResults(
                'battery',
                response
              )

          } catch (
            error
          ) {

            console.warn(
              'Battery controller search failed. Using local product search.',
              error
            )

            controllerResults =
              []
          }

          const merged =
            mergeWarehouseSearchResults(

              'battery',

              controllerResults,

              form,

              null

            )

          setResults(
            merged
          )

          return merged
        }


        // ==============================================
        // OIL
        // ==============================================

        if (
          tab === 'oil'
        ) {

          let controllerResults =
            []

          try {

            const response =
              await VehicleSearchController.searchOil({

                viscosity:
                  form.viscosity

              })

            controllerResults =
              flattenSearchResults(
                'oil',
                response
              )

          } catch (
            error
          ) {

            console.warn(
              'Oil controller search failed. Using local product search.',
              error
            )

            controllerResults =
              []
          }

          const merged =
            mergeWarehouseSearchResults(

              'oil',

              controllerResults,

              form,

              null

            )

          setResults(
            merged
          )

          return merged
        }


        // ==============================================
        // UNKNOWN
        // ==============================================

        setResults([])

        return []

      }
      catch (
        error
      ) {

        console.error(
          'Vehicle search failed:',
          error
        )

        setResults([])

        return []

      }
      finally {

        setLoading(false)
      }
    }


  return {

    loading,

    results,

    form,

    setForm,

    vehicleTypes,

    brands,

    models,

    years,

    tireSearchError,

    search

  }
}