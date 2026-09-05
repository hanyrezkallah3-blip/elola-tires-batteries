// ======================================================
// EL OLA ERP
// useVehicleSearch Hook
//
// AI-FIRST VEHICLE SEARCH
//
// Supports:
// 1. Structured vehicle search
// 2. Free-text AI vehicle search
// 3. Tire size search
// 4. Battery search
// 5. Oil search
// ======================================================

import {
  useMemo,
  useState
} from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleEngine
  from '../core/engines/VehicleEngine'

import VehicleAIEngine
  from '../core/engines/VehicleAIEngine'

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
    .replace(/\s+/g, '')


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
      }
      else {

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
// ALL SEARCHABLE PRODUCTS
// ======================================================

const allSearchableProducts = () => {

  return [
    ...warehouseProducts(),
    ...websiteProducts()
  ]
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
// COLLECT VALUES
// ======================================================

const collectValues = (
  product,
  fields
) => {

  const values = []

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

      Object.values(
        value
      ).forEach(
        item =>
          add(item)
      )

      return
    }

    values.push(
      String(value)
    )
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

  fields.forEach(
    field => {

      add(
        product?.[field]
      )

      add(
        battery?.[field]
      )

      add(
        oil?.[field]
      )

      add(
        specifications?.[field]
      )

      add(
        attributes?.[field]
      )

      add(
        specifications?.battery?.[field]
      )

      add(
        specifications?.oil?.[field]
      )

      add(
        attributes?.battery?.[field]
      )

      add(
        attributes?.oil?.[field]
      )
    }
  )

  return values
}


// ======================================================
// NORMALIZE OIL INPUT
// ======================================================

const normalizeOilValue = value => {

  return norm(value)
    .replace(/–|—/g, '-')
    .replace(/[\/\\]/g, '-')
    .replace(/\_/g, '-')
}


// ======================================================
// OIL GRADE EXTRACTION
// ======================================================

const extractOilGrades = value => {

  const text =
    normalizeOilValue(
      value
    )

  if (
    !text
  ) {
    return []
  }

  const grades = []

  const rangeMatches =
    text.match(
      /\b\d{1,3}w-?\d{1,3}\b/gi
    )

  if (
    Array.isArray(
      rangeMatches
    )
  ) {

    rangeMatches.forEach(
      item => {

        grades.push(
          norm(item)
        )
      }
    )
  }

  const wMatches =
    text.match(
      /\b\d{1,3}w\b/gi
    )

  if (
    Array.isArray(
      wMatches
    )
  ) {

    wMatches.forEach(
      item =>
        grades.push(
          norm(item)
        )
    )
  }

  const numberMatches =
    text.match(
      /\b\d{1,3}\b/g
    )

  if (
    Array.isArray(
      numberMatches
    )
  ) {

    numberMatches.forEach(
      item =>
        grades.push(
          norm(item)
        )
    )
  }

  return [
    ...new Set(
      grades.filter(Boolean)
    )
  ]
}


// ======================================================
// OIL MATCH
// ======================================================

const oilMatches = (
  product,
  viscosity
) => {

  const wanted =
    normalizeOilValue(
      viscosity
    )

  if (
    !wanted
  ) {
    return false
  }

  const values =
    collectValues(
      product,
      [
        'viscosity',
        'viscosityGrade',
        'grade',
        'oilGrade',
        'oilViscosity',
        'sae',
        'SAE',
        'weight',
        'oilWeight',
        'specification',
        'description',
        'name',
        'productName',
        'title',
        'code',
        'sku'
      ]
    )

  const wantedGrades =
    extractOilGrades(
      wanted
    )

  return values.some(
    value => {

      const actual =
        normalizeOilValue(
          value
        )

      if (
        !actual
      ) {
        return false
      }

      if (
        actual === wanted
      ) {
        return true
      }

      if (
        actual.includes(
          wanted
        )
      ) {
        return true
      }

      const actualGrades =
        extractOilGrades(
          actual
        )

      return wantedGrades.some(
        wantedGrade =>
          actualGrades.some(
            actualGrade => {

              if (
                actualGrade ===
                wantedGrade
              ) {
                return true
              }

              if (
                /^\d+$/.test(
                  wantedGrade
                ) &&
                /^\d+w$/.test(
                  actualGrade
                )
              ) {
                return (
                  actualGrade.slice(
                    0,
                    -1
                  ) ===
                  wantedGrade
                )
              }

              if (
                /^\d+w$/.test(
                  wantedGrade
                ) &&
                actualGrade.startsWith(
                  wantedGrade
                )
              ) {
                return true
              }

              return false
            }
          )
      )
    }
  )
}


// ======================================================
// NORMALIZE BATTERY VALUE
// ======================================================

const normalizeBatteryValue = value => {

  return norm(value)
    .replace(/–|—/g, '-')
    .replace(/[\/\\]/g, '-')
}


// ======================================================
// BATTERY CODE EXTRACTION
// ======================================================

const extractBatteryCodes = value => {

  const text =
    normalizeBatteryValue(
      value
    )

  if (
    !text
  ) {
    return []
  }

  const codes = []

  const matches =
    text.match(
      /\bn\d{0,3}[a-z]?\b|\b\d{1,3}ah\b|\b\d{1,3}\b/gi
    )

  if (
    Array.isArray(
      matches
    )
  ) {

    matches.forEach(
      item => {

        const normalized =
          normalizeBatteryValue(
            item
          )

        if (
          normalized
        ) {
          codes.push(
            normalized
          )
        }
      }
    )
  }

  return [
    ...new Set(
      codes
    )
  ]
}


// ======================================================
// BATTERY MATCH
// ======================================================

const batteryMatches = (
  product,
  capacity
) => {

  const wanted =
    normalizeBatteryValue(
      capacity
    )

  if (
    !wanted
  ) {
    return false
  }

  const values =
    collectValues(
      product,
      [
        'capacity',
        'batteryCapacity',
        'ampereHour',
        'ah',
        'amp',
        'ampHours',
        'batteryType',
        'typeCode',
        'batteryCode',
        'code',
        'model',
        'batteryModel',
        'group',
        'groupSize',
        'size',
        'sizeCode',
        'name',
        'productName',
        'title',
        'description',
        'sku'
      ]
    )

  const wantedCodes =
    extractBatteryCodes(
      wanted
    )

  return values.some(
    value => {

      const actual =
        normalizeBatteryValue(
          value
        )

      if (
        !actual
      ) {
        return false
      }

      if (
        actual === wanted
      ) {
        return true
      }

      if (
        actual.includes(
          wanted
        )
      ) {
        return true
      }

      if (
        wanted.includes(
          actual
        )
      ) {
        return true
      }

      const actualCodes =
        extractBatteryCodes(
          actual
        )

      return wantedCodes.some(
        wantedCode =>
          actualCodes.some(
            actualCode => {

              if (
                actualCode ===
                wantedCode
              ) {
                return true
              }

              if (
                wantedCode.startsWith('n') &&
                actualCode.startsWith(
                  wantedCode
                )
              ) {
                return true
              }

              if (
                /^\d+$/.test(
                  wantedCode
                ) &&
                actualCode ===
                  `${wantedCode}ah`
              ) {
                return true
              }

              return false
            }
          )
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

  const values =
    collectValues(
      product,
      fields
    )

  return values.some(
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
        actual.includes(wanted) ||
        wanted.includes(actual)
      )
    }
  )
}


// ======================================================
// PRODUCT TYPE
// ======================================================

const productType = product => {

  return normalizeType(
    product?.type ??
    product?.productType ??
    product?.category ??
    product?.categoryType ??
    product?.kind ??
    ''
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

const collectVehicleCompatibility =
  product => {

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

  if (
    tab === 'battery'
  ) {

    warehouseMatches =
      warehouse.filter(
        product => {

          const type =
            productType(
              product
            )

          return (
            type === 'battery' &&
            batteryMatches(
              product,
              form.capacity
            )
          )
        }
      )

    catalogMatches =
      catalog.filter(
        product => {

          const type =
            productType(
              product
            )

          return (
            type === 'battery' &&
            batteryMatches(
              product,
              form.capacity
            )
          )
        }
      )
  }

  if (
    tab === 'oil'
  ) {

    warehouseMatches =
      warehouse.filter(
        product => {

          const type =
            productType(
              product
            )

          return (
            type === 'oil' &&
            oilMatches(
              product,
              form.viscosity
            )
          )
        }
      )

    catalogMatches =
      catalog.filter(
        product => {

          const type =
            productType(
              product
            )

          return (
            type === 'oil' &&
            oilMatches(
              product,
              form.viscosity
            )
          )
        }
      )
  }

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
// AI VEHICLE SEARCH
//
// IMPORTANT
// ------------------------------------------------------
//
// Free text must go through VehicleAIEngine first.
//
// Example:
//
// "تويوتا كرولا 2020"
//
// VehicleAIEngine:
//   1. Parses the text.
//   2. Resolves make/model/year.
//   3. Calls VehicleEngine with structured data.
//
// VehicleEngine then performs:
//
//   VehicleProvider
//   OEMCompatibilityEngine
//   VehicleCompatibilityEngine
//   Product matching
//
// This keeps AI parsing separate from compatibility logic.
// ======================================================

const searchVehicleWithAI = async query => {

  const text =
    String(
      query ?? ''
    ).trim()

  if (
    !text
  ) {
    return {
      query:
        '',

      response:
        null,

      results:
        []
    }
  }

  const products =
    allSearchableProducts()

  try {

    console.log(
      '[Vehicle AI] Searching:',
      text
    )

    console.log(
      '[Vehicle AI] Products available:',
      products.length
    )

    // --------------------------------------------------
    // CORRECT AI PATH
    // --------------------------------------------------
    //
    // DO NOT send free text directly to VehicleEngine.
    //
    // VehicleAIEngine is responsible for parsing:
    //
    // "Toyota corolla 2021"
    //
    // into:
    //
    // make  = Toyota
    // model = Corolla
    // year  = 2021
    //
    // and then calling VehicleEngine.
    // --------------------------------------------------

    const response =
      await VehicleAIEngine.search({
        query:
          text,
        products
      })

    console.log(
      '[Vehicle AI] AI Engine response:',
      response
    )

    // --------------------------------------------------
    // VehicleAIEngine.search() returns an object
    // containing the final matched products.
    //
    // flattenSearchResults() already understands
    // response.products.
    // --------------------------------------------------

    const engineProducts =
      flattenSearchResults(
        'vehicle',
        response
      )

    console.log(
      '[Vehicle AI] Matched products:',
      engineProducts.length
    )

    if (
      engineProducts.length > 0
    ) {

      return {
        query:
          text,

        response,

        results:
          mergeProducts(
            engineProducts.map(
              publicWarehouseProduct
            )
          )
      }
    }

    // --------------------------------------------------
    // If VehicleAIEngine resolved the vehicle but
    // returned no Elola products, do NOT treat this
    // as an AI parsing failure.
    //
    // Compatibility and availability remain separate.
    // --------------------------------------------------

    console.warn(
      '[Vehicle AI] Vehicle resolved but no matching products were returned.',
      response
    )

    return {
      query:
        text,

      response,

      results:
        []
    }
  }
  catch (
    error
  ) {

    console.error(
      '[Vehicle AI] Search failed:',
      error
    )

    return {
      query:
        text,

      response:
        null,

      results:
        []
    }
  }
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
        '',

      vehicleQuery:
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

          // --------------------------------------------
          // AI FREE TEXT SEARCH
          // --------------------------------------------

          const aiQuery =
            String(
              form.vehicleQuery ??
              form.query ??
              ''
            ).trim()

          if (
            aiQuery
          ) {

            console.log(
              '[Vehicle Search] AI query:',
              aiQuery
            )

            const aiResult =
              await searchVehicleWithAI(
                aiQuery
              )

            const finalResults =
              Array.isArray(
                aiResult?.results
              )
                ? aiResult.results
                : []

            // ------------------------------------------------
            // IMPORTANT MARKET DEMAND CONTRACT
            // ------------------------------------------------
            //
            // search() historically returns the result array.
            // Keep that behavior so existing consumers continue
            // to work.
            //
            // At the same time, attach the REAL AI query to the
            // returned array so HomeVehicleSearch can use:
            //
            // response.query
            //
            // This fixes:
            //
            // searchQuery: ''
            //
            // becoming:
            //
            // searchQuery: 'toyota corolla 2021'
            //
            // without changing the result-array contract.
            // ------------------------------------------------

            finalResults.query =
              String(
                aiResult?.query ??
                aiQuery
              ).trim()

            finalResults.searchQuery =
              finalResults.query

            finalResults.searchType =
              'vehicle'

            finalResults.aiResponse =
              aiResult?.response ??
              null

            setResults(
              finalResults
            )

            console.log(
              '[Vehicle Search] Returning AI results with query:',
              finalResults.query
            )

            return finalResults
          }


          // --------------------------------------------
          // STRUCTURED SEARCH
          // --------------------------------------------

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
          }
          catch (
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
              'اكتب مقاس الإطار بهذا الشكل: 205/55/16 أو 205*55*16 أو 24.9/24'
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
          }
          catch (
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
          }
          catch (
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
          }
          catch (
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


  // ====================================================
  // RETURN
  // ====================================================

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

    search,

    searchVehicleWithAI
  }
}