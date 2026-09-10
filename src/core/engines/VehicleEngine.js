// ======================================================
// EL OLA ERP
// Vehicle Engine
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Central engine for vehicle-based product compatibility.
//
// ARCHITECTURE
// ------------------------------------------------------
//
// Vehicle
//   â†“
// VehDB / OEM specifications
//   â†“
// Technical requirements
//   â†“
// Technical Product Universe
//   â†“
// Compatible products / requirements
//   â†“
// Warehouse availability
//
// IMPORTANT
// ------------------------------------------------------
//
// Technical compatibility MUST be decided independently
// from stock quantity.
//
// Tires, batteries and oils are technical requirements.
// If a matching Elola Product Master exists:
//   â†’ attach its availability.
//
// If no Elola product exists:
//   â†’ keep the technical requirement as a result
//   â†’ mark it unavailable.
//
// ======================================================

import VehicleProvider
  from '../vehicles/VehicleProvider'

import OEMCompatibilityEngine
  from './OEMCompatibilityEngine'

import VehicleCompatibilityEngine
  from './VehicleCompatibilityEngine'

import ProductsRepository
  from '../../repositories/ProductsRepository'


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value => {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .replace(/ط£|ط¥|ط¢/g, 'ط§')
    .replace(/ط©/g, 'ظ‡')
    .replace(/ظ‰/g, 'ظٹ')
    .replace(/[\u064B-\u065F\u0670]/g, '')
}


// ======================================================
// COMPACT TEXT
// ======================================================

const compactText = value => {
  return normalizeText(value)
    .replace(/[\s_\-/*\\xأ—]/gi, '')
}


// ======================================================
// NUMBER
// ======================================================

const numberValue = value => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const number =
    Number(
      String(value)
        .trim()
        .replace(',', '.')
    )

  return Number.isFinite(number)
    ? number
    : null
}


// ======================================================
// VALUE MATCH
// ======================================================

const valuesMatch = (
  actual,
  wanted
) => {
  const left =
    compactText(actual)

  const right =
    compactText(wanted)

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
// PRODUCT TYPE
// ======================================================

const normalizeProductType = product => {
  const rawValues = [
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
    const value of rawValues
  ) {
    const raw =
      normalizeText(value)

    if (
      [
        'tire',
        'tires',
        'tyre',
        'tyres',
        'ط§ط·ط§ط±',
        'ط§ط·ط§ط±ط§طھ'
      ].includes(raw)
    ) {
      return 'tire'
    }

    if (
      [
        'battery',
        'batteries',
        'ط¨ط·ط§ط±ظٹظ‡',
        'ط¨ط·ط§ط±ظٹط§طھ',
        'ط¨ط·ط§ط±ظٹظ‡'
      ].includes(raw)
    ) {
      return 'battery'
    }

    if (
      [
        'oil',
        'oils',
        'ط²ظٹطھ',
        'ط²ظٹظˆطھ'
      ].includes(raw)
    ) {
      return 'oil'
    }
  }

  return ''
}


// ======================================================
// PRODUCT DATA HELPERS
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
// GET VALUE FROM OBJECT
// ======================================================

const getValue = (
  object,
  keys = []
) => {
  for (
    const key of keys
  ) {
    const value =
      object?.[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {
      return value
    }
  }

  return null
}


// ======================================================
// PARSE TIRE SIZE
// ======================================================
//
// Supports:
//
// 205/55/16
// 205*55*16
// 205-55-16
// 205/55R16
// 205/55 R16
// 215 55 16
// 1200/24
// 1200*24
//
// ======================================================

const parseTireSize = value => {
  let text =
    String(
      value ?? ''
    )
      .trim()
      .toLowerCase()

  if (!text) {
    return null
  }

  text =
    text
      .replace(/[أ—*]/g, '/')
      .replace(/\\/g, '/')
      .replace(/-/g, '/')
      .replace(/\s+/g, '')

  text =
    text.replace(
      /r/g,
      '/'
    )

  const numbers =
    text.match(
      /\d+(?:\.\d+)?/g
    )

  if (
    !Array.isArray(numbers)
  ) {
    return null
  }

  if (
    numbers.length >= 3
  ) {
    const width =
      numberValue(
        numbers[0]
      )

    const profile =
      numberValue(
        numbers[1]
      )

    const rim =
      numberValue(
        numbers[2]
      )

    if (
      width !== null &&
      profile !== null &&
      rim !== null
    ) {
      return {
        width,
        profile,
        rim,
        format: 'three-part'
      }
    }
  }

  if (
    numbers.length === 2
  ) {
    const width =
      numberValue(
        numbers[0]
      )

    const rim =
      numberValue(
        numbers[1]
      )

    if (
      width !== null &&
      rim !== null
    ) {
      return {
        width,
        profile: null,
        rim,
        format: 'two-part'
      }
    }
  }

  return null
}


// ======================================================
// FORMAT TIRE SIZE
// ======================================================

const formatTireSize = tire => {
  if (!tire) {
    return ''
  }

  if (
    tire.width !== null &&
    tire.width !== undefined &&
    tire.profile !== null &&
    tire.profile !== undefined &&
    tire.rim !== null &&
    tire.rim !== undefined
  ) {
    return (
      `${tire.width}/${tire.profile}/${tire.rim}`
    )
  }

  if (
    tire.width !== null &&
    tire.width !== undefined &&
    tire.rim !== null &&
    tire.rim !== undefined
  ) {
    return (
      `${tire.width}/${tire.rim}`
    )
  }

  return (
    tire.size ||
    ''
  )
}


// ======================================================
// EXTRACT TIRE FROM PRODUCT
// ======================================================

const extractProductTire = product => {
  const tire =
    getProductTire(
      product
    )

  let width =
    numberValue(
      getValue(
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
      getValue(
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
      getValue(
        tire,
        [
          'rim',
          'rimSize',
          'wheelDiameter',
          'diameter'
        ]
      )
    )

  let size =
    getValue(
      tire,
      [
        'size',
        'tireSize',
        'dimension',
        'dimensions',
        'sizeCode'
      ]
    )

  if (
    width === null
  ) {
    width =
      numberValue(
        product?.width ??
        product?.sectionWidth ??
        product?.tireWidth
      )
  }

  if (
    profile === null
  ) {
    profile =
      numberValue(
        product?.profile ??
        product?.height ??
        product?.aspectRatio ??
        product?.aspect
      )
  }

  if (
    rim === null
  ) {
    rim =
      numberValue(
        product?.rim ??
        product?.rimSize ??
        product?.wheelDiameter ??
        product?.diameter
      )
  }

  if (!size) {
    size =
      product?.tireSize ??
      product?.size ??
      product?.dimension ??
      product?.dimensions ??
      null
  }

  if (size) {
    const parsed =
      parseTireSize(
        size
      )

    if (parsed) {
      width =
        width ??
        parsed.width

      profile =
        profile ??
        parsed.profile

      rim =
        rim ??
        parsed.rim
    }
  }

  if (
    width === null ||
    rim === null ||
    (
      profile === null &&
      size === null
    )
  ) {
    const candidateTexts = [
      product?.name,
      product?.productName,
      product?.shortName,
      product?.title,
      product?.sku,
      product?.code,
      product?.barcode,
      product?.description,
      product?.tire?.name,
      product?.tire?.size,
      product?.tire?.tireSize,
      product?.specifications?.name,
      product?.specifications?.size,
      product?.attributes?.name,
      product?.attributes?.size
    ]

    for (
      const candidate of candidateTexts
    ) {
      if (
        candidate === null ||
        candidate === undefined ||
        candidate === ''
      ) {
        continue
      }

      const parsed =
        parseTireSize(
          candidate
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

      size =
        size ??
        candidate

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
    rim,
    size
  }
}


// ======================================================
// COLLECT NESTED VALUES
// ======================================================

const collectValues = (
  value,
  output = []
) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return output
  }

  if (
    Array.isArray(value)
  ) {
    value.forEach(
      item =>
        collectValues(
          item,
          output
        )
    )

    return output
  }

  if (
    typeof value === 'object'
  ) {
    Object.values(
      value
    ).forEach(
      item =>
        collectValues(
          item,
          output
        )
    )

    return output
  }

  output.push(
    String(value)
  )

  return output
}


// ======================================================
// OEM TIRE VALUES
// ======================================================

const collectOEMTireValues = oem => {
  const values = []

  const sources = [
    oem?.tire,
    oem?.vehicle?.tire,
    oem?.vehicle?.tireSize,
    oem?.vehicle?.oemTire,
    oem?.tireSize,
    oem?.oemTire,

    // VehDB / technical sources
    oem?.oemSizes,
    oem?.alternativeSizes,
    oem?.alternateSizes,
    oem?.compatibleSizes,
    oem?.compatibleTireSizes,

    oem?.vehicle?.oemSizes,
    oem?.vehicle?.alternativeSizes,
    oem?.vehicle?.alternateSizes,
    oem?.vehicle?.compatibleSizes,
    oem?.vehicle?.compatibleTireSizes,

    oem?.fitments
  ]

  sources.forEach(
    source =>
      collectValues(
        source,
        values
      )
  )

  return [
    ...new Set(
      values
        .map(
          value =>
            String(value).trim()
        )
        .filter(Boolean)
    )
  ]
}


// ======================================================
// TIRE OEM MATCH
// ======================================================

const tireMatchesOEM = (
  product,
  oem
) => {
  if (!oem) {
    return false
  }

  const wantedValues =
    collectOEMTireValues(
      oem
    )

  if (
    wantedValues.length === 0
  ) {
    return false
  }

  const productTire =
    extractProductTire(
      product
    )

  const productName =
    product?.name ??
    product?.productName ??
    product?.title ??
    ''

  console.log(
    '[VehicleEngine] TIRE MATCH CHECK:',
    {
      productName,
      productTire,
      wantedValues
    }
  )

  for (
    const wanted of wantedValues
  ) {
    const parsedWanted =
      parseTireSize(
        wanted
      )

    if (
      parsedWanted &&
      productTire.width !== null &&
      productTire.rim !== null
    ) {
      if (
        productTire.width ===
        parsedWanted.width
      ) {
        if (
          parsedWanted.profile === null
        ) {
          if (
            productTire.rim ===
            parsedWanted.rim
          ) {
            return true
          }
        }

        if (
          parsedWanted.profile !== null &&
          productTire.profile !== null &&
          productTire.rim ===
            parsedWanted.rim &&
          productTire.profile ===
            parsedWanted.profile
        ) {
          return true
        }
      }
    }

    if (
      productTire.size &&
      valuesMatch(
        productTire.size,
        wanted
      )
    ) {
      return true
    }
  }

  return false
}


// ======================================================
// COLLECT PRODUCT VALUES
// ======================================================

const collectProductValues = (
  product,
  fields = []
) => {
  const values = []

  fields.forEach(
    field => {
      values.push(
        ...collectValues(
          product?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.battery?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.oil?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.specifications?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.attributes?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.specifications?.battery?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.specifications?.oil?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.attributes?.battery?.[field]
        )
      )

      values.push(
        ...collectValues(
          product?.attributes?.oil?.[field]
        )
      )
    }
  )

  return [
    ...new Set(
      values
        .map(
          value =>
            String(value).trim()
        )
        .filter(Boolean)
    )
  ]
}


// ======================================================
// BATTERY OEM VALUES
// ======================================================

const collectOEMBatteryValues = oem => {
  const values = []

  const sources = [
    oem?.battery,
    oem?.batteries,
    oem?.batteryCapacities,
    oem?.compatibleBatteryCapacities,

    oem?.vehicle?.battery,
    oem?.vehicle?.batteries,
    oem?.vehicle?.batterySpec,
    oem?.vehicle?.oemBattery,

    oem?.batterySpec,
    oem?.oemBattery
  ]

  sources.forEach(
    source =>
      collectValues(
        source,
        values
      )
  )

  return [
    ...new Set(
      values
        .map(
          value =>
            String(value).trim()
        )
        .filter(Boolean)
    )
  ]
}


// ======================================================
// NORMALIZE BATTERY CAPACITY
// ======================================================

const normalizeBatteryCapacity = value => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const text =
    String(value)
      .trim()
      .toLowerCase()

  const match =
    text.match(
      /\d+(?:\.\d+)?/
    )

  if (!match) {
    return null
  }

  const number =
    numberValue(
      match[0]
    )

  return number
}


// ======================================================
// BATTERY MATCH
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
//
// When OEM battery requirements exist, battery
// compatibility is decided technically by capacity.
//
// We do NOT declare a battery compatible merely because
// its product name, code, N70 code, SKU, or description
// happens to contain a similar number.
//
// ======================================================

const batteryMatchesOEM = (
  product,
  oem
) => {
  if (!oem) {
    return false
  }

  const wantedValues =
    collectOEMBatteryValues(
      oem
    )

  if (
    wantedValues.length === 0
  ) {
    return false
  }

  const wantedCapacities =
    wantedValues
      .map(
        normalizeBatteryCapacity
      )
      .filter(
        value =>
          value !== null
      )

  const battery =
    getProductBattery(
      product
    )

  const productValues =
    collectProductValues(
      product,
      [
        'capacity',
        'batteryCapacity',
        'ampereHour',
        'ampHour',
        'ah',
        'ampHours',
        'capacities',
        'batteryCapacities'
      ]
    )

  const productCapacities = [
    ...productValues,
    ...collectValues(
      battery?.capacity
    ),
    ...collectValues(
      battery?.batteryCapacity
    ),
    ...collectValues(
      battery?.ah
    ),
    ...collectValues(
      battery?.ampereHour
    ),
    ...collectValues(
      battery?.ampHours
    ),
    ...collectValues(
      battery?.capacities
    ),
    ...collectValues(
      battery?.batteryCapacities
    )
  ]
    .map(
      normalizeBatteryCapacity
    )
    .filter(
      value =>
        value !== null
    )

  const uniqueProductCapacities =
    [
      ...new Set(
        productCapacities
      )
    ]

  console.log(
    '[VehicleEngine] BATTERY MATCH CHECK:',
    {
      product:
        product?.name ??
        product?.productName ??
        product?.title,
      wantedValues,
      wantedCapacities,
      productCapacities:
        uniqueProductCapacities
    }
  )

  if (
    wantedCapacities.length === 0 ||
    uniqueProductCapacities.length === 0
  ) {
    return false
  }

  return wantedCapacities.some(
    wanted =>
      uniqueProductCapacities.some(
        actual =>
          actual === wanted
      )
  )
}


// ======================================================
// OIL OEM VALUES
// ======================================================

const collectOILValues = oem => {
  const values = []

  const sources = [
    oem?.oil,
    oem?.oils,
    oem?.oilViscosity,
    oem?.oilViscosities,
    oem?.compatibleOilViscosities,

    oem?.vehicle?.oil,
    oem?.vehicle?.oils,
    oem?.vehicle?.oilViscosity,
    oem?.vehicle?.oemOil,

    oem?.oilViscosity,
    oem?.oemOil
  ]

  sources.forEach(
    source =>
      collectValues(
        source,
        values
      )
  )

  return [
    ...new Set(
      values
        .map(
          value =>
            String(value).trim()
        )
        .filter(Boolean)
    )
  ]
}


// ======================================================
// NORMALIZE OIL VISCOSITY
// ======================================================

const normalizeOilViscosity = value => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return ''
  }

  return String(value)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/_/g, '-')
}


// ======================================================
// EXTRACT OIL VISCOSITIES FROM PRODUCT
// ======================================================

const extractProductOilViscosities = product => {
  const oil =
    getProductOil(
      product
    )

  const values = [
    ...collectValues(
      oil?.viscosity
    ),
    ...collectValues(
      oil?.viscosities
    ),
    ...collectValues(
      oil?.oilViscosity
    ),
    ...collectValues(
      oil?.oilViscosities
    ),
    ...collectValues(
      oil?.grade
    ),
    ...collectValues(
      oil?.grades
    ),
    ...collectValues(
      oil?.oilGrade
    ),
    ...collectValues(
      oil?.oilGrades
    ),
    ...collectValues(
      oil?.sae
    ),

    ...collectProductValues(
      product,
      [
        'viscosity',
        'viscosityGrade',
        'grade',
        'oilGrade',
        'oilViscosity',
        'oilViscosities',
        'sae',
        'SAE'
      ]
    )
  ]

  return [
    ...new Set(
      values
        .map(
          normalizeOilViscosity
        )
        .filter(Boolean)
    )
  ]
}


// ======================================================
// OIL MATCH
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
//
// Oil compatibility is based on the technical viscosity /
// grade requirement.
//
// We do NOT infer compatibility from a generic product
// name or description when the product has no technical
// viscosity value.
//
// ======================================================

const oilMatchesOEM = (
  product,
  oem
) => {
  if (!oem) {
    return false
  }

  const wantedValues =
    collectOILValues(
      oem
    )

  if (
    wantedValues.length === 0
  ) {
    return false
  }

  const wantedViscosities =
    wantedValues
      .map(
        normalizeOilViscosity
      )
      .filter(Boolean)

  const productViscosities =
    extractProductOilViscosities(
      product
    )

  console.log(
    '[VehicleEngine] OIL MATCH CHECK:',
    {
      product:
        product?.name ??
        product?.productName ??
        product?.title,
      wantedValues,
      wantedViscosities,
      productViscosities
    }
  )

  if (
    wantedViscosities.length === 0 ||
    productViscosities.length === 0
  ) {
    return false
  }

  return wantedViscosities.some(
    wanted =>
      productViscosities.some(
        actual =>
          actual === wanted
      )
  )
}


// ======================================================
// EXPLICIT VEHICLE COMPATIBILITY
// ======================================================

const explicitVehicleMatch = ({
  product,
  make,
  model,
  year,
  vehicleType
}) => {
  try {
    return VehicleCompatibilityEngine.matchVehicle({
      product,
      make,
      model,
      year,
      vehicleType
    })
  }
  catch (error) {
    console.warn(
      '[VehicleEngine] Explicit compatibility check failed:',
      error
    )

    return false
  }
}


// ======================================================
// PRODUCT MATCHES VEHICLE
// ======================================================

const productMatchesVehicle = ({
  product,
  make,
  model,
  year,
  vehicleType,
  oem
}) => {
  if (!product) {
    return false
  }

  const type =
    normalizeProductType(
      product
    )

  // ----------------------------------------------------
  // Technical tire matching
  // ----------------------------------------------------

  if (
    type === 'tire'
  ) {
    return tireMatchesOEM(
      product,
      oem
    )
  }

  // ----------------------------------------------------
  // Technical battery matching
  // ----------------------------------------------------

  if (
    type === 'battery'
  ) {
    const technicalMatch =
      batteryMatchesOEM(
        product,
        oem
      )

    if (technicalMatch) {
      return true
    }

    // If OEM battery requirements exist, do not allow
    // explicit vehicle compatibility to bypass the
    // technical battery requirement.
    const batteryRequirements =
      collectOEMBatteryValues(
        oem
      )

    if (
      batteryRequirements.length > 0
    ) {
      return false
    }
  }

  // ----------------------------------------------------
  // Technical oil matching
  // ----------------------------------------------------

  if (
    type === 'oil'
  ) {
    const technicalMatch =
      oilMatchesOEM(
        product,
        oem
      )

    if (technicalMatch) {
      return true
    }

    // If OEM oil requirements exist, do not allow
    // explicit vehicle compatibility to bypass the
    // technical oil requirement.
    const oilRequirements =
      collectOILValues(
        oem
      )

    if (
      oilRequirements.length > 0
    ) {
      return false
    }
  }

  // ----------------------------------------------------
  // Explicit compatibility
  // ----------------------------------------------------

  return explicitVehicleMatch({
    product,
    make,
    model,
    year,
    vehicleType
  })
}


// ======================================================
// PRODUCT ID
// ======================================================

const getProductId = product => {
  return String(
    product?.productId ??
    product?.id ??
    product?.selectedProductId ??
    product?.selectedWarehouseProductId ??
    product?.uuid ??
    product?.code ??
    ''
  ).trim()
}


// ======================================================
// AVAILABILITY IDS
// ======================================================

const getAvailabilityIds = product => {
  return [
    product?.productId,
    product?.id,
    product?.selectedProductId,
    product?.selectedWarehouseProductId,
    product?.sku,
    product?.code
  ]
    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
    )
    .map(
      value =>
        String(value).trim()
    )
}


// ======================================================
// AVAILABILITY QUANTITY
// ======================================================

const getAvailabilityQuantity = product => {
  const values = [
    product?.availableQuantity,
    product?.availability?.quantity,
    product?.quantity,
    product?.stock
  ]

  for (
    const value of values
  ) {
    const quantity =
      Number(value)

    if (
      Number.isFinite(quantity)
    ) {
      return quantity
    }
  }

  return 0
}


// ======================================================
// AVAILABILITY MAP
// ======================================================

const buildAvailabilityMap = (
  products = []
) => {
  const map =
    new Map()

  products.forEach(
    product => {
      if (!product) {
        return
      }

      const quantity =
        getAvailabilityQuantity(
          product
        )

      const ids =
        getAvailabilityIds(
          product
        )

      ids.forEach(
        id => {
          const current =
            map.get(
              id
            )

          if (!current) {
            map.set(
              id,
              {
                quantity,
                product
              }
            )

            return
          }

          if (
            quantity >
            current.quantity
          ) {
            map.set(
              id,
              {
                quantity,
                product
              }
            )
          }
        }
      )
    }
  )

  return map
}


// ======================================================
// FIND INVENTORY PRODUCT BY TIRE SIZE
// ======================================================

const findAvailabilityByTireSize = (
  tireRequirement,
  availabilityProducts = []
) => {
  if (!tireRequirement) {
    return null
  }

  const wanted =
    parseTireSize(
      tireRequirement.size
    ) ||
    tireRequirement

  for (
    const product of availabilityProducts
  ) {
    if (!product) {
      continue
    }

    if (
      normalizeProductType(
        product
      ) !== 'tire'
    ) {
      continue
    }

    const actual =
      extractProductTire(
        product
      )

    if (
      actual.width === null ||
      actual.rim === null
    ) {
      continue
    }

    if (
      actual.width !==
      wanted.width
    ) {
      continue
    }

    if (
      actual.rim !==
      wanted.rim
    ) {
      continue
    }

    if (
      wanted.profile !== null &&
      wanted.profile !== undefined &&
      actual.profile !==
      wanted.profile
    ) {
      continue
    }

    return {
      quantity:
        getAvailabilityQuantity(
          product
        ),
      product
    }
  }

  return null
}


// ======================================================
// FIND PRODUCT BY BATTERY CAPACITY
// ======================================================

const findProductByBatteryCapacity = (
  capacity,
  products = []
) => {
  const wanted =
    normalizeBatteryCapacity(
      capacity
    )

  if (
    wanted === null
  ) {
    return null
  }

  for (
    const product of products
  ) {
    if (!product) {
      continue
    }

    if (
      normalizeProductType(
        product
      ) !== 'battery'
    ) {
      continue
    }

    const battery =
      getProductBattery(
        product
      )

    const values = [
      ...collectValues(
        battery?.capacity
      ),
      ...collectValues(
        battery?.batteryCapacity
      ),
      ...collectValues(
        battery?.ah
      ),
      ...collectValues(
        battery?.ampereHour
      ),
      ...collectValues(
        battery?.ampHour
      ),
      ...collectValues(
        battery?.ampHours
      ),
      ...collectValues(
        battery?.capacities
      ),
      ...collectValues(
        battery?.batteryCapacities
      ),
      ...collectProductValues(
        product,
        [
          'capacity',
          'batteryCapacity',
          'ampereHour',
          'ampHour',
          'ah',
          'ampHours',
          'capacities',
          'batteryCapacities'
        ]
      )
    ]

    const capacities =
      [
        ...new Set(
          values
            .map(
              normalizeBatteryCapacity
            )
            .filter(
              value =>
                value !== null
            )
        )
      ]

    if (
      capacities.includes(
        wanted
      )
    ) {
      return {
        quantity:
          getAvailabilityQuantity(
            product
          ),
        product
      }
    }
  }

  return null
}


// ======================================================
// FIND PRODUCT BY OIL VISCOSITY
// ======================================================

const findProductByOilViscosity = (
  viscosity,
  products = []
) => {
  const wanted =
    normalizeOilViscosity(
      viscosity
    )

  if (!wanted) {
    return null
  }

  for (
    const product of products
  ) {
    if (!product) {
      continue
    }

    if (
      normalizeProductType(
        product
      ) !== 'oil'
    ) {
      continue
    }

    const viscosities =
      extractProductOilViscosities(
        product
      )

    if (
      viscosities.includes(
        wanted
      )
    ) {
      return {
        quantity:
          getAvailabilityQuantity(
            product
          ),
        product
      }
    }
  }

  return null
}


// ======================================================
// BUILD SYNTHETIC TECHNICAL TIRE
// ======================================================
//
// This is NOT a fake Elola product.
//
// It represents a technical requirement returned by
// the vehicle technical source.
//
// ======================================================

const buildTechnicalTireRequirement = (
  size,
  index = 0
) => {
  const parsed =
    parseTireSize(
      size
    )

  if (!parsed) {
    return null
  }

  const formatted =
    formatTireSize(
      {
        ...parsed,
        size
      }
    )

  return {
    id:
      `technical-tire-${compactText(formatted)}-${index}`,

    productId:
      `technical-tire-${compactText(formatted)}-${index}`,

    name:
      formatted ||
      String(size),

    productName:
      formatted ||
      String(size),

    title:
      formatted ||
      String(size),

    type:
      'tire',

    tire: {
      width:
        parsed.width,

      profile:
        parsed.profile,

      rim:
        parsed.rim,

      size:
        formatted ||
        String(size),

      tireSize:
        formatted ||
        String(size)
    },

    technicalRequirement:
      true,

    technicalRequirementType:
      'tire-size',

    technicalCompatibility:
      true,

    compatibilitySource:
      'vehdb',

    vehdbSize:
      String(size),

    availability: {
      available:
        false,

      quantity:
        0
    },

    isAvailable:
      false,

    available:
      false,

    quantity:
      0,

    stock:
      0,

    availableQuantity:
      0,

    salePrice:
      0,

    price:
      0,

    warehouseId:
      null,

    warehouseName:
      null
  }
}


// ======================================================
// BUILD SYNTHETIC TECHNICAL BATTERY
// ======================================================
//
// This is NOT a fake Elola product.
//
// It represents an OEM technical requirement.
//
// ======================================================

const buildTechnicalBatteryRequirement = (
  capacity,
  index = 0
) => {
  const normalized =
    normalizeBatteryCapacity(
      capacity
    )

  if (
    normalized === null
  ) {
    return null
  }

  const displayCapacity =
    String(
      normalized
    )

  return {
    id:
      `technical-battery-${compactText(displayCapacity)}-${index}`,

    productId:
      `technical-battery-${compactText(displayCapacity)}-${index}`,

    name:
      `${displayCapacity}Ah`,

    productName:
      `${displayCapacity}Ah`,

    title:
      `${displayCapacity}Ah`,

    type:
      'battery',

    battery: {
      capacity:
        normalized,

      ah:
        normalized,

      ampereHour:
        normalized
    },

    technicalRequirement:
      true,

    technicalRequirementType:
      'battery-capacity',

    technicalCompatibility:
      true,

    compatibilitySource:
      'technical',

    technicalBatteryCapacity:
      normalized,

    availability: {
      available:
        false,

      quantity:
        0
    },

    isAvailable:
      false,

    available:
      false,

    quantity:
      0,

    stock:
      0,

    availableQuantity:
      0,

    salePrice:
      0,

    price:
      0,

    warehouseId:
      null,

    warehouseName:
      null
  }
}


// ======================================================
// BUILD SYNTHETIC TECHNICAL OIL
// ======================================================
//
// This is NOT a fake Elola product.
//
// It represents an OEM technical requirement.
//
// ======================================================

const buildTechnicalOilRequirement = (
  viscosity,
  index = 0
) => {
  const normalized =
    normalizeOilViscosity(
      viscosity
    )

  if (!normalized) {
    return null
  }

  return {
    id:
      `technical-oil-${compactText(normalized)}-${index}`,

    productId:
      `technical-oil-${compactText(normalized)}-${index}`,

    name:
      normalized,

    productName:
      normalized,

    title:
      normalized,

    type:
      'oil',

    oil: {
      viscosity:
        normalized,

      viscosityGrade:
        normalized,

      grade:
        normalized,

      oilViscosity:
        normalized
    },

    technicalRequirement:
      true,

    technicalRequirementType:
      'oil-viscosity',

    technicalCompatibility:
      true,

    compatibilitySource:
      'technical',

    technicalOilViscosity:
      normalized,

    availability: {
      available:
        false,

      quantity:
        0
    },

    isAvailable:
      false,

    available:
      false,

    quantity:
      0,

    stock:
      0,

    availableQuantity:
      0,

    salePrice:
      0,

    price:
      0,

    warehouseId:
      null,

    warehouseName:
      null
  }
}


// ======================================================
// BUILD TIRE REQUIREMENT RESULTS
// ======================================================

const buildTireRequirementResults = ({
  oem,
  availabilityProducts = [],
  technicalCatalog = []
}) => {
  const wantedValues =
    collectOEMTireValues(
      oem
    )

  const uniqueSizes =
    [
      ...new Set(
        wantedValues
          .map(
            value =>
              String(value).trim()
          )
          .filter(Boolean)
      )
    ]

  const results = []

  uniqueSizes.forEach(
    (size, index) => {
      const requirement =
        buildTechnicalTireRequirement(
          size,
          index
        )

      if (!requirement) {
        return
      }

      const requirementParsed =
        parseTireSize(
          size
        )

      if (!requirementParsed) {
        return
      }

      // ------------------------------------------------
      // First search supplied availability records.
      // ------------------------------------------------

      let inventoryMatch =
        findAvailabilityByTireSize(
          requirementParsed,
          availabilityProducts
        )

      // ------------------------------------------------
      // Search Product Master.
      // ------------------------------------------------

      let catalogMatch =
        null

      for (
        const product of technicalCatalog
      ) {
        if (
          normalizeProductType(
            product
          ) !== 'tire'
        ) {
          continue
        }

        const actual =
          extractProductTire(
            product
          )

        if (
          actual.width ===
            requirementParsed.width &&
          actual.rim ===
            requirementParsed.rim &&
          (
            requirementParsed.profile === null ||
            requirementParsed.profile === undefined ||
            actual.profile ===
              requirementParsed.profile
          )
        ) {
          catalogMatch =
            product

          break
        }
      }

      const baseProduct =
        catalogMatch ||
        inventoryMatch?.product ||
        requirement

      const availability =
        inventoryMatch

      const quantity =
        availability
          ? availability.quantity
          : 0

      const inventoryProduct =
        availability?.product

      results.push({
        ...requirement,
        ...baseProduct,

        id:
          baseProduct?.id ??
          requirement.id,

        productId:
          baseProduct?.productId ??
          baseProduct?.id ??
          requirement.productId,

        name:
          baseProduct?.name ||
          baseProduct?.productName ||
          formattedSizeFallback(
            size
          ),

        productName:
          baseProduct?.productName ||
          baseProduct?.name ||
          formattedSizeFallback(
            size
          ),

        type:
          'tire',

        tire:
          baseProduct?.tire ||
          requirement.tire,

        technicalRequirement:
          true,

        technicalRequirementType:
          'tire-size',

        technicalCompatibility:
          true,

        compatibilitySource:
          'vehdb',

        vehdbSize:
          String(size),

        warehouseId:
          inventoryProduct?.warehouseId ??
          null,

        warehouseName:
          inventoryProduct?.warehouseName ??
          null,

        quantity,

        stock:
          quantity,

        availableQuantity:
          quantity,

        salePrice:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        price:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        availability: {
          available:
            quantity > 0,

          quantity,

          warehouseId:
            inventoryProduct?.warehouseId ??
            null,

          warehouseName:
            inventoryProduct?.warehouseName ??
            null
        },

        isAvailable:
          quantity > 0,

        available:
          quantity > 0
      })
    }
  )

  return results
}


// ======================================================
// BUILD BATTERY REQUIREMENT RESULTS
// ======================================================
//
// ALL technical battery capacities become results.
//
// Product Master / availability is attached separately.
//
// ======================================================

const buildBatteryRequirementResults = ({
  oem,
  availabilityProducts = [],
  technicalCatalog = []
}) => {
  const wantedValues =
    collectOEMBatteryValues(
      oem
    )

  const capacities =
    [
      ...new Set(
        wantedValues
          .map(
            normalizeBatteryCapacity
          )
          .filter(
            value =>
              value !== null
          )
      )
    ]

  const results = []

  capacities.forEach(
    (capacity, index) => {
      const requirement =
        buildTechnicalBatteryRequirement(
          capacity,
          index
        )

      if (!requirement) {
        return
      }

      // ------------------------------------------------
      // Search supplied availability records first.
      // ------------------------------------------------

      let inventoryMatch =
        findProductByBatteryCapacity(
          capacity,
          availabilityProducts
        )

      // ------------------------------------------------
      // Search Product Master.
      // ------------------------------------------------

      let catalogMatch =
        findProductByBatteryCapacity(
          capacity,
          technicalCatalog
        )

      const baseProduct =
        catalogMatch?.product ||
        inventoryMatch?.product ||
        requirement

      const inventoryProduct =
        inventoryMatch?.product

      const quantity =
        inventoryMatch?.quantity ??
        0

      results.push({
        ...requirement,
        ...baseProduct,

        id:
          baseProduct?.id ??
          requirement.id,

        productId:
          baseProduct?.productId ??
          baseProduct?.id ??
          requirement.productId,

        name:
          baseProduct?.name ||
          baseProduct?.productName ||
          `${capacity}Ah`,

        productName:
          baseProduct?.productName ||
          baseProduct?.name ||
          `${capacity}Ah`,

        title:
          baseProduct?.title ||
          baseProduct?.name ||
          `${capacity}Ah`,

        type:
          'battery',

        battery:
          baseProduct?.battery ||
          requirement.battery,

        technicalRequirement:
          true,

        technicalRequirementType:
          'battery-capacity',

        technicalCompatibility:
          true,

        compatibilitySource:
          'technical',

        technicalBatteryCapacity:
          capacity,

        warehouseId:
          inventoryProduct?.warehouseId ??
          null,

        warehouseName:
          inventoryProduct?.warehouseName ??
          null,

        quantity,

        stock:
          quantity,

        availableQuantity:
          quantity,

        salePrice:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        price:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        availability: {
          available:
            quantity > 0,

          quantity,

          warehouseId:
            inventoryProduct?.warehouseId ??
            null,

          warehouseName:
            inventoryProduct?.warehouseName ??
            null
        },

        isAvailable:
          quantity > 0,

        available:
          quantity > 0
      })
    }
  )

  return results
}


// ======================================================
// BUILD OIL REQUIREMENT RESULTS
// ======================================================
//
// ALL technical oil viscosities become results.
//
// Product Master / availability is attached separately.
//
// ======================================================

const buildOilRequirementResults = ({
  oem,
  availabilityProducts = [],
  technicalCatalog = []
}) => {
  const wantedValues =
    collectOILValues(
      oem
    )

  const viscosities =
    [
      ...new Set(
        wantedValues
          .map(
            normalizeOilViscosity
          )
          .filter(Boolean)
      )
    ]

  const results = []

  viscosities.forEach(
    (viscosity, index) => {
      const requirement =
        buildTechnicalOilRequirement(
          viscosity,
          index
        )

      if (!requirement) {
        return
      }

      // ------------------------------------------------
      // Search supplied availability records first.
      // ------------------------------------------------

      let inventoryMatch =
        findProductByOilViscosity(
          viscosity,
          availabilityProducts
        )

      // ------------------------------------------------
      // Search Product Master.
      // ------------------------------------------------

      let catalogMatch =
        findProductByOilViscosity(
          viscosity,
          technicalCatalog
        )

      const baseProduct =
        catalogMatch?.product ||
        inventoryMatch?.product ||
        requirement

      const inventoryProduct =
        inventoryMatch?.product

      const quantity =
        inventoryMatch?.quantity ??
        0

      results.push({
        ...requirement,
        ...baseProduct,

        id:
          baseProduct?.id ??
          requirement.id,

        productId:
          baseProduct?.productId ??
          baseProduct?.id ??
          requirement.productId,

        name:
          baseProduct?.name ||
          baseProduct?.productName ||
          viscosity,

        productName:
          baseProduct?.productName ||
          baseProduct?.name ||
          viscosity,

        title:
          baseProduct?.title ||
          baseProduct?.name ||
          viscosity,

        type:
          'oil',

        oil:
          baseProduct?.oil ||
          requirement.oil,

        technicalRequirement:
          true,

        technicalRequirementType:
          'oil-viscosity',

        technicalCompatibility:
          true,

        compatibilitySource:
          'technical',

        technicalOilViscosity:
          viscosity,

        warehouseId:
          inventoryProduct?.warehouseId ??
          null,

        warehouseName:
          inventoryProduct?.warehouseName ??
          null,

        quantity,

        stock:
          quantity,

        availableQuantity:
          quantity,

        salePrice:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        price:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          baseProduct?.salePrice ??
          baseProduct?.price ??
          0,

        availability: {
          available:
            quantity > 0,

          quantity,

          warehouseId:
            inventoryProduct?.warehouseId ??
            null,

          warehouseName:
            inventoryProduct?.warehouseName ??
            null
        },

        isAvailable:
          quantity > 0,

        available:
          quantity > 0
      })
    }
  )

  return results
}


// ======================================================
// SIZE FALLBACK
// ======================================================

function formattedSizeFallback(size) {
  const parsed =
    parseTireSize(
      size
    )

  return (
    parsed
      ? formatTireSize({
          ...parsed,
          size
        })
      : String(size)
  )
}


// ======================================================
// MERGE CATALOG WITH AVAILABILITY
// ======================================================

const mergeCatalogWithAvailability = (
  compatibleCatalog,
  availabilityProducts
) => {
  const availabilityMap =
    buildAvailabilityMap(
      availabilityProducts
    )

  return compatibleCatalog.map(
    catalogProduct => {
      const ids =
        getAvailabilityIds(
          catalogProduct
        )

      let availability =
        null

      for (
        const id of ids
      ) {
        const found =
          availabilityMap.get(
            id
          )

        if (found) {
          availability =
            found

          break
        }
      }

      // ------------------------------------------------
      // Tire technical requirement.
      // ------------------------------------------------

      if (
        !availability &&
        normalizeProductType(
          catalogProduct
        ) === 'tire'
      ) {
        const tire =
          extractProductTire(
            catalogProduct
          )

        availability =
          findAvailabilityByTireSize(
            tire,
            availabilityProducts
          )
      }

      // ------------------------------------------------
      // Compatible but unavailable.
      // ------------------------------------------------

      if (!availability) {
        return {
          ...catalogProduct,

          availability: {
            available:
              false,

            quantity:
              0
          },

          isAvailable:
            false,

          available:
            false,

          stock:
            0,

          availableQuantity:
            0,

          quantity:
            0,

          warehouseId:
            null,

          warehouseName:
            null,

          compatibilitySource:
            catalogProduct?.compatibilitySource ||
            'technical'
        }
      }

      const inventoryProduct =
        availability.product

      const quantity =
        availability.quantity

      return {
        ...catalogProduct,

        id:
          catalogProduct?.id ??
          inventoryProduct?.id,

        productId:
          catalogProduct?.productId ??
          inventoryProduct?.productId ??
          catalogProduct?.id,

        name:
          catalogProduct?.name ||
          catalogProduct?.productName ||
          inventoryProduct?.name ||
          inventoryProduct?.productName ||
          '',

        productName:
          catalogProduct?.productName ||
          catalogProduct?.name ||
          inventoryProduct?.productName ||
          inventoryProduct?.name ||
          '',

        type:
          normalizeProductType(
            catalogProduct
          ) ||
          normalizeProductType(
            inventoryProduct
          ),

        warehouseId:
          inventoryProduct?.warehouseId,

        warehouseName:
          inventoryProduct?.warehouseName,

        quantity,

        stock:
          quantity,

        availableQuantity:
          quantity,

        salePrice:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          catalogProduct?.salePrice ??
          catalogProduct?.price ??
          0,

        price:
          inventoryProduct?.salePrice ??
          inventoryProduct?.sellingPrice ??
          inventoryProduct?.consumerPrice ??
          inventoryProduct?.price ??
          catalogProduct?.salePrice ??
          catalogProduct?.price ??
          0,

        availability: {
          available:
            quantity > 0,

          quantity,

          warehouseId:
            inventoryProduct?.warehouseId,

          warehouseName:
            inventoryProduct?.warehouseName
        },

        isAvailable:
          quantity > 0,

        available:
          quantity > 0,

        compatibilitySource:
          catalogProduct?.compatibilitySource ||
          'technical'
      }
    }
  )
}


// ======================================================
// LOAD PRODUCT CATALOG
// ======================================================

const loadProductCatalog = async () => {
  try {
    let result =
      await ProductsRepository.getAllData()

    if (
      !Array.isArray(result)
    ) {
      if (
        Array.isArray(
          result?.data
        )
      ) {
        result =
          result.data
      }
      else {
        result = []
      }
    }

    console.log(
      '[VehicleEngine] FULL PRODUCT CATALOG:',
      {
        count:
          result.length,

        products:
          result.map(
            product => ({
              id:
                product?.id ??
                product?.productId,

              productId:
                product?.productId,

              name:
                product?.name ??
                product?.productName,

              type:
                normalizeProductType(
                  product
                ),

              tire:
                extractProductTire(
                  product
                ),

              battery:
                getProductBattery(
                  product
                ),

              oil:
                getProductOil(
                  product
                ),

              compatibleVehicles:
                Array.isArray(
                  product?.compatibleVehicles
                )
                  ? product.compatibleVehicles.length
                  : 0
            })
          )
      }
    )

    return result
  }
  catch (error) {
    console.error(
      '[VehicleEngine] Product catalog load failed:',
      error
    )

    return []
  }
}


// ======================================================
// NORMALIZE CATALOG
// ======================================================

const normalizeCatalog = products => {
  if (
    !Array.isArray(products)
  ) {
    return []
  }

  const map =
    new Map()

  products.forEach(
    product => {
      if (!product) {
        return
      }

      const id =
        getProductId(
          product
        )

      if (!id) {
        return
      }

      const normalized = {
        ...product,

        id:
          product?.id ??
          id,

        productId:
          product?.productId ??
          id,

        type:
          normalizeProductType(
            product
          ),

        compatibilitySource:
          product?.compatibilitySource ||
          'catalog'
      }

      const existing =
        map.get(
          id
        )

      if (!existing) {
        map.set(
          id,
          normalized
        )

        return
      }

      const existingTire =
        extractProductTire(
          existing
        )

      const currentTire =
        extractProductTire(
          normalized
        )

      const existingScore =
        [
          existingTire.width,
          existingTire.profile,
          existingTire.rim,
          existingTire.size,
          existing?.compatibleVehicles?.length,
          existing?.specifications,
          existing?.battery,
          existing?.oil
        ]
          .filter(Boolean)
          .length

      const currentScore =
        [
          currentTire.width,
          currentTire.profile,
          currentTire.rim,
          currentTire.size,
          normalized?.compatibleVehicles?.length,
          normalized?.specifications,
          normalized?.battery,
          normalized?.oil
        ]
          .filter(Boolean)
          .length

      if (
        currentScore >
        existingScore
      ) {
        map.set(
          id,
          {
            ...existing,
            ...normalized
          }
        )
      }
      else {
        map.set(
          id,
          {
            ...normalized,
            ...existing
          }
        )
      }
    }
  )

  return [
    ...map.values()
  ]
}


// ======================================================
// BUILD TECHNICAL PRODUCT UNIVERSE
// ======================================================

const buildTechnicalProductUniverse = (
  catalogProducts = [],
  suppliedProducts = []
) => {
  const combined = []

  if (
    Array.isArray(
      catalogProducts
    )
  ) {
    catalogProducts.forEach(
      product => {
        if (!product) {
          return
        }

        combined.push({
          ...product,

          compatibilitySource:
            product?.compatibilitySource ||
            'catalog'
        })
      }
    )
  }

  if (
    Array.isArray(
      suppliedProducts
    )
  ) {
    suppliedProducts.forEach(
      product => {
        if (!product) {
          return
        }

        combined.push({
          ...product,

          compatibilitySource:
            product?.compatibilitySource ||
            'supplied-product-record'
        })
      }
    )
  }

  const universe =
    normalizeCatalog(
      combined
    )

  console.log(
    '[VehicleEngine] TECHNICAL PRODUCT UNIVERSE:',
    {
      catalogCount:
        Array.isArray(
          catalogProducts
        )
          ? catalogProducts.length
          : 0,

      suppliedCount:
        Array.isArray(
          suppliedProducts
        )
          ? suppliedProducts.length
          : 0,

      universeCount:
        universe.length
    }
  )

  return universe
}


// ======================================================
// COMPATIBILITY DIAGNOSTIC
// ======================================================

const debugCompatibilityCatalog = ({
  catalog,
  make,
  model,
  year,
  vehicleType,
  oem
}) => {
  console.groupCollapsed(
    '[VehicleEngine] COMPATIBILITY CATALOG'
  )

  console.log(
    'Vehicle:',
    {
      vehicleType,
      make,
      model,
      year
    }
  )

  console.log(
    'OEM tire requirements:',
    collectOEMTireValues(
      oem
    )
  )

  console.log(
    'OEM battery requirements:',
    collectOEMBatteryValues(
      oem
    )
  )

  console.log(
    'OEM oil requirements:',
    collectOILValues(
      oem
    )
  )

  console.log(
    'Catalog count:',
    catalog.length
  )

  catalog.forEach(
    product => {
      const type =
        normalizeProductType(
          product
        )

      const tire =
        type === 'tire'
          ? extractProductTire(
              product
            )
          : null

      console.log(
        {
          id:
            product?.id ??
            product?.productId,

          name:
            product?.name ??
            product?.productName ??
            product?.title,

          type,

          tire,

          battery:
            type === 'battery'
              ? getProductBattery(
                  product
                )
              : null,

          oil:
            type === 'oil'
              ? getProductOil(
                  product
                )
              : null,

          batteryCapacities:
            type === 'battery'
              ? extractProductBatteryCapacities(
                  product
                )
              : [],

          oilViscosities:
            type === 'oil'
              ? extractProductOilViscosities(
                  product
                )
              : [],

          explicitCompatibility:
            Array.isArray(
              product?.compatibleVehicles
            )
              ? product.compatibleVehicles.length
              : 0,

          compatibilitySource:
            product?.compatibilitySource
        }
      )
    }
  )

  console.groupEnd()
}


// ======================================================
// EXTRACT PRODUCT BATTERY CAPACITIES
// ======================================================

const extractProductBatteryCapacities = product => {
  const battery =
    getProductBattery(
      product
    )

  const values = [
    ...collectValues(
      battery?.capacity
    ),
    ...collectValues(
      battery?.batteryCapacity
    ),
    ...collectValues(
      battery?.ah
    ),
    ...collectValues(
      battery?.ampereHour
    ),
    ...collectValues(
      battery?.ampHour
    ),
    ...collectValues(
      battery?.ampHours
    ),
    ...collectValues(
      battery?.capacities
    ),
    ...collectValues(
      battery?.batteryCapacities
    ),
    ...collectProductValues(
      product,
      [
        'capacity',
        'batteryCapacity',
        'ampereHour',
        'ampHour',
        'ah',
        'ampHours',
        'capacities',
        'batteryCapacities'
      ]
    )
  ]

  return [
    ...new Set(
      values
        .map(
          normalizeBatteryCapacity
        )
        .filter(
          value =>
            value !== null
        )
    )
  ]
}


// ======================================================
// ENGINE
// ======================================================

export class VehicleEngine {

  // ====================================================
  // FIND VEHICLE
  // ====================================================

  static async findVehicle({
    make,
    model,
    year
  }) {
    try {
      return await VehicleProvider.findVehicle({
        make,
        model,
        year
      })
    }
    catch (error) {
      console.warn(
        '[VehicleEngine] Vehicle provider failed:',
        error
      )

      return null
    }
  }


  // ====================================================
  // SEARCH
  // ====================================================

  static async search({
    vehicleType,
    make,
    model,
    year,
    products = []
  }) {
    console.log(
      '[VehicleEngine] SEARCH INPUT:',
      {
        vehicleType,
        make,
        model,
        year,
        productsCount:
          Array.isArray(products)
            ? products.length
            : 0
      }
    )


    // --------------------------------------------------
    // VEHICLE
    // --------------------------------------------------

    let vehicle =
      null

    try {
      vehicle =
        await this.findVehicle({
          make,
          model,
          year
        })
    }
    catch (error) {
      console.warn(
        '[VehicleEngine] Vehicle lookup failed:',
        error
      )
    }


    // --------------------------------------------------
    // OEM / VehDB
    // --------------------------------------------------

    let oem =
      null

    try {
      oem =
        await OEMCompatibilityEngine.search({
          vehicleType,
          make,
          model,
          year
        })
    }
    catch (error) {
      console.warn(
        '[VehicleEngine] OEM lookup failed:',
        error
      )
    }

    console.log(
      '[VehicleEngine] OEM RESULT:',
      oem
    )


    // --------------------------------------------------
    // LOAD PRODUCT CATALOG
    // --------------------------------------------------

    const rawCatalog =
      await loadProductCatalog()

    const catalog =
      normalizeCatalog(
        rawCatalog
      )

    console.log(
      '[VehicleEngine] CATALOG NORMALIZED:',
      {
        rawCount:
          rawCatalog.length,

        normalizedCount:
          catalog.length
      }
    )


    // --------------------------------------------------
    // AVAILABILITY PRODUCTS
    // --------------------------------------------------

    const availabilityProducts =
      Array.isArray(
        products
      )
        ? products
        : []


    // --------------------------------------------------
    // TECHNICAL PRODUCT UNIVERSE
    // --------------------------------------------------

    const technicalProductUniverse =
      buildTechnicalProductUniverse(
        catalog,
        availabilityProducts
      )


    debugCompatibilityCatalog({
      catalog:
        technicalProductUniverse,

      make,
      model,
      year,
      vehicleType,
      oem
    })


    // --------------------------------------------------
    // TECHNICALLY COMPATIBLE CATALOG PRODUCTS
    // --------------------------------------------------

    const technicallyCompatible =
      technicalProductUniverse.filter(
        product =>
          productMatchesVehicle({
            product,
            make,
            model,
            year,
            vehicleType,
            oem
          })
      )

    console.log(
      '[VehicleEngine] TECHNICALLY COMPATIBLE PRODUCTS:',
      {
        count:
          technicallyCompatible.length,

        products:
          technicallyCompatible.map(
            product => ({
              id:
                product?.id ??
                product?.productId,

              name:
                product?.name ??
                product?.productName,

              type:
                normalizeProductType(
                  product
                ),

              tire:
                normalizeProductType(
                  product
                ) === 'tire'
                  ? extractProductTire(
                      product
                    )
                  : null,

              batteryCapacities:
                normalizeProductType(
                  product
                ) === 'battery'
                  ? extractProductBatteryCapacities(
                      product
                    )
                  : [],

              oilViscosities:
                normalizeProductType(
                  product
                ) === 'oil'
                  ? extractProductOilViscosities(
                      product
                    )
                  : [],

              compatibilitySource:
                product?.compatibilitySource
            })
          )
      }
    )


    // --------------------------------------------------
    // ALL TECHNICAL TIRE REQUIREMENTS
    // --------------------------------------------------

    const tireRequirementResults =
      buildTireRequirementResults({
        oem,
        availabilityProducts,
        technicalCatalog:
          technicalProductUniverse
      })

    console.log(
      '[VehicleEngine] ALL TECHNICAL TIRE RESULTS:',
      {
        count:
          tireRequirementResults.length,

        results:
          tireRequirementResults.map(
            product => ({
              name:
                product?.name,

              size:
                product?.tire?.size,

              technicalRequirement:
                product?.technicalRequirement,

              isAvailable:
                product?.isAvailable,

              quantity:
                product?.quantity
            })
          )
      }
    )


    // --------------------------------------------------
    // ALL TECHNICAL BATTERY REQUIREMENTS
    // --------------------------------------------------

    const batteryRequirementResults =
      buildBatteryRequirementResults({
        oem,
        availabilityProducts,
        technicalCatalog:
          technicalProductUniverse
      })

    console.log(
      '[VehicleEngine] ALL TECHNICAL BATTERY RESULTS:',
      {
        count:
          batteryRequirementResults.length,

        results:
          batteryRequirementResults.map(
            product => ({
              name:
                product?.name,

              capacity:
                product?.technicalBatteryCapacity ??
                product?.battery?.capacity,

              technicalRequirement:
                product?.technicalRequirement,

              isAvailable:
                product?.isAvailable,

              quantity:
                product?.quantity
            })
          )
      }
    )


    // --------------------------------------------------
    // ALL TECHNICAL OIL REQUIREMENTS
    // --------------------------------------------------

    const oilRequirementResults =
      buildOilRequirementResults({
        oem,
        availabilityProducts,
        technicalCatalog:
          technicalProductUniverse
      })

    console.log(
      '[VehicleEngine] ALL TECHNICAL OIL RESULTS:',
      {
        count:
          oilRequirementResults.length,

        results:
          oilRequirementResults.map(
            product => ({
              name:
                product?.name,

              viscosity:
                product?.technicalOilViscosity ??
                product?.oil?.viscosity,

              technicalRequirement:
                product?.technicalRequirement,

              isAvailable:
                product?.isAvailable,

              quantity:
                product?.quantity
            })
          )
      }
    )


    // --------------------------------------------------
    // OTHER TECHNICAL RESULTS
    // --------------------------------------------------
    //
    // Tire, battery and oil requirements are now built
    // independently from inventory.
    //
    // Therefore they must NOT be taken again from
    // technicallyCompatible.
    //
    // --------------------------------------------------

    const otherTechnicalCompatible =
      technicallyCompatible.filter(
        product => {
          const type =
            normalizeProductType(
              product
            )

          return (
            type !== 'tire' &&
            type !== 'battery' &&
            type !== 'oil'
          )
        }
      )

    const otherTechnicalMatched =
      mergeCatalogWithAvailability(
        otherTechnicalCompatible,
        availabilityProducts
      )


    // --------------------------------------------------
    // FINAL MATCHED
    // --------------------------------------------------

    const matched = [
      ...tireRequirementResults,
      ...batteryRequirementResults,
      ...oilRequirementResults,
      ...otherTechnicalMatched
    ]


    // --------------------------------------------------
    // TYPE RESULTS
    // --------------------------------------------------

    const tires =
      matched.filter(
        product =>
          normalizeProductType(
            product
          ) === 'tire'
      )

    const batteries =
      matched.filter(
        product =>
          normalizeProductType(
            product
          ) === 'battery'
      )

    const oils =
      matched.filter(
        product =>
          normalizeProductType(
            product
          ) === 'oil'
      )


    // --------------------------------------------------
    // FINAL LOGS
    // --------------------------------------------------

    console.log(
      '[VehicleEngine] FINAL MATCHED PRODUCTS:',
      matched
    )

    console.log(
      '[VehicleEngine] AVAILABILITY SUMMARY:',
      {
        totalCompatible:
          matched.length,

        available:
          matched.filter(
            product =>
              product?.isAvailable === true
          ).length,

        unavailable:
          matched.filter(
            product =>
              product?.isAvailable !== true
          ).length
      }
    )


    return {
      vehicle,
      oem,
      tires,
      batteries,
      oils,
      products:
        matched
    }
  }


  // ====================================================
  // FILTER TIRES
  // ====================================================

  static filterTires({
    products = [],
    vehicleType,
    make,
    model,
    year,
    oem
  }) {
    return (
      Array.isArray(
        products
      )
        ? products
        : []
    )
      .filter(
        product =>
          normalizeProductType(
            product
          ) === 'tire'
      )
      .filter(
        product =>
          productMatchesVehicle({
            product,
            make,
            model,
            year,
            vehicleType,
            oem
          })
      )
  }


  // ====================================================
  // FILTER BATTERIES
  // ====================================================

  static filterBatteries({
    products = [],
    vehicleType,
    make,
    model,
    year,
    oem
  }) {
    return (
      Array.isArray(
        products
      )
        ? products
        : []
    )
      .filter(
        product =>
          normalizeProductType(
            product
          ) === 'battery'
      )
      .filter(
        product =>
          productMatchesVehicle({
            product,
            make,
            model,
            year,
            vehicleType,
            oem
          })
      )
  }


  // ====================================================
  // FILTER OILS
  // ====================================================

  static filterOils({
    products = [],
    vehicleType,
    make,
    model,
    year,
    oem
  }) {
    return (
      Array.isArray(
        products
      )
        ? products
        : []
    )
      .filter(
        product =>
          normalizeProductType(
            product
          ) === 'oil'
      )
      .filter(
        product =>
          productMatchesVehicle({
            product,
            make,
            model,
            year,
            vehicleType,
            oem
          })
      )
  }


  // ====================================================
  // FILTER ALL
  // ====================================================

  static filterAll(params) {
    return [
      ...this.filterTires(
        params
      ),

      ...this.filterBatteries(
        params
      ),

      ...this.filterOils(
        params
      )
    ]
  }
}


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default VehicleEngine



