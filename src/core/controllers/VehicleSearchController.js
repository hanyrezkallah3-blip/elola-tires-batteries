// ======================================================
// EL OLA ERP
// Vehicle Search Controller
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Central controller for customer-facing product search.
//
// DATA RULES
// ------------------------------------------------------
//
// 1. VehDB:
//    - Vehicle fitment only.
//    - Provides OEM + alternative tire sizes.
//    - NEVER provides price.
//    - NEVER provides stock.
//
// 2. Warehouse:
//    - Source of real product availability.
//    - Source of warehouse sale price.
//
// 3. Website / Offers:
//    - Active offer overrides warehouse sale price.
//    - Offer price remains active only during its date range.
//
// 4. Cart:
//    - In-stock products are returned with quantity.
//    - Final customer price is returned in price and salePrice.
//
// VEHICLE FITMENT SOURCE PRIORITY
// ------------------------------------------------------
//
// 1. Local VehicleRepository / local vehicle memory
// 2. VehDB only when LOCAL VEHICLE DOES NOT EXIST
// 3. Existing VehicleEngine fallback only when appropriate
//
// IMPORTANT:
// ------------------------------------------------------
//
// The existence of the local vehicle record is the gate.
//
// LOCAL VEHICLE FOUND:
//    - Use local vehicle data.
//    - DO NOT call VehDB.
//
// LOCAL VEHICLE NOT FOUND:
//    - VehDB may be called.
//
// IMPORTANT PRICING RULE:
// ------------------------------------------------------
//
// Warehouse provides stock + warehouse price.
//
// If the same product exists on the website / offers and
// has an active offer, the offer price overrides the
// warehouse sale price for the customer.
//
// IMPORTANT COMPATIBILITY RULE:
// ------------------------------------------------------
//
// Vehicle compatibility MUST be determined independently
// from warehouse availability.
//
// A compatible product with quantity 0 MUST remain in the
// result.
//
// ======================================================

import VehicleEngine
  from '../engines/VehicleEngine'

import ProductsRepository
  from '../../repositories/ProductsRepository'

import VehicleLookupService
  from '../services/VehicleLookupService'

import VehDBFitmentProvider
  from '../vehicles/providers/VehDBFitmentProvider'


import LocalTechnicalFitmentProvider
  from '../vehicles/providers/LocalTechnicalFitmentProvider'

import {
  useWarehouseStore
} from '../../store/warehouseStore'

import {
  useWebsiteStore
} from '../../store/websiteStore'

import {
  vehicleDatabase
} from '../../data/vehicleDatabase'


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
    .replace(/\s+/g, '')
}


// ======================================================
// NORMALIZE BATTERY VALUE
// ======================================================

const normalizeBatteryValue = value => {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .replace(/ط£|ط¥|ط¢/g, 'ط§')
    .replace(/ط©/g, 'ظ‡')
    .replace(/ظ‰/g, 'ظٹ')
    .replace(/[â€“â€”]/g, '-')
    .replace(/[\/\\*أ—-]/g, '-')
    .replace(/\s+/g, '')
}


// ======================================================
// NUMBER
// ======================================================

const numberValue = value => {

  if (
    value === undefined ||
    value === null ||
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
// PRODUCT TYPE
// ======================================================

const normalizeProductType = product => {

  const raw =
    normalizeText(
      product?.type ??
      product?.productType ??
      product?.category ??
      ''
    )

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
      'ط¨ط·ط§ط±ظٹط§طھ'
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

  return raw
}


// ======================================================
// PRODUCT ID
// ======================================================

const getProductId = product => {

  return String(
    product?.productId ??
    product?.id ??
    ''
  ).trim()
}


// ======================================================
// NORMALIZED PRODUCT ID
// ======================================================

const getProductMapKey = product => {

  return normalizeText(
    getProductId(
      product
    )
  )
}


// ======================================================
// IDS EQUAL
// ======================================================

const idsEqual = (
  first,
  second
) => {

  const left = [
    first?.productId,
    first?.id,
    first?.sku,
    first?.barcode
  ]
    .filter(Boolean)
    .map(normalizeText)

  const right = [
    second?.productId,
    second?.id,
    second?.sku,
    second?.barcode
  ]
    .filter(Boolean)
    .map(normalizeText)

  return left.some(
    id =>
      right.includes(id)
  )
}


// ======================================================
// GET NON-EMPTY OBJECT
// ======================================================

const getNonEmptyObject = value => {

  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return null
  }

  return Object.keys(value).length > 0
    ? value
    : null
}


// ======================================================
// MERGE TECHNICAL OBJECTS
// ======================================================

const mergeTechnicalObjects = (
  first,
  second
) => {

  const left =
    getNonEmptyObject(
      first
    ) || {}

  const right =
    getNonEmptyObject(
      second
    ) || {}

  if (
    Object.keys(left).length === 0 &&
    Object.keys(right).length === 0
  ) {
    return {}
  }

  return {
    ...right,
    ...left
  }
}


// ======================================================
// GET PRODUCT TIRE
// ======================================================

const getProductTire = product => {

  const candidates = [

    product?.tire,
    product?.tireData,
    product?.tyre,
    product?.tyreData,

    product?.tireSpecification,
    product?.tireSpecifications,
    product?.tyreSpecification,
    product?.tyreSpecifications,

    product?.specifications?.tire,
    product?.specifications?.tireData,
    product?.specifications?.tyre,
    product?.specifications?.tyreData,

    product?.specification?.tire,
    product?.specification?.tireData,
    product?.specification?.tyre,
    product?.specification?.tyreData,

    product?.attributes?.tire,
    product?.attributes?.tireData,
    product?.attributes?.tyre,
    product?.attributes?.tyreData,

    product?.productData?.tire,
    product?.productData?.tireData,
    product?.productData?.tyre,
    product?.productData?.tyreData

  ]

  return candidates.reduce(
    (
      result,
      candidate
    ) =>
      mergeTechnicalObjects(
        result,
        candidate
      ),
    {}
  )
}


// ======================================================
// GET PRODUCT BATTERY
// ======================================================

const getProductBattery = product => {

  const candidates = [

    product?.battery,
    product?.batteryData,
    product?.batterySpecification,
    product?.batterySpecifications,

    product?.specifications?.battery,
    product?.specifications?.batteryData,

    product?.specification?.battery,
    product?.specification?.batteryData,

    product?.attributes?.battery,
    product?.attributes?.batteryData

  ]

  return candidates.reduce(
    (
      result,
      candidate
    ) =>
      mergeTechnicalObjects(
        result,
        candidate
      ),
    {}
  )
}


// ======================================================
// GET PRODUCT OIL
// ======================================================

const getProductOil = product => {

  const candidates = [

    product?.oil,
    product?.oilData,
    product?.oilSpecification,
    product?.oilSpecifications,

    product?.specifications?.oil,
    product?.specifications?.oilData,

    product?.specification?.oil,
    product?.specification?.oilData,

    product?.attributes?.oil,
    product?.attributes?.oilData

  ]

  return candidates.reduce(
    (
      result,
      candidate
    ) =>
      mergeTechnicalObjects(
        result,
        candidate
      ),
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
    const key
    of keys
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
// 1200/24
// 1200*24
//
// ======================================================

const parseTireSize = value => {

  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  // ----------------------------------------------------
  // Object-based tire size.
  // ----------------------------------------------------

  if (
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {

    const width =
      numberValue(
        value?.width ??
        value?.sectionWidth ??
        value?.tireWidth ??
        value?.tyreWidth
      )

    const profile =
      numberValue(
        value?.profile ??
        value?.aspectRatio ??
        value?.aspect ??
        value?.height
      )

    const rim =
      numberValue(
        value?.rim ??
        value?.rimSize ??
        value?.wheelDiameter ??
        value?.diameter
      )

    if (
      width !== null &&
      rim !== null
    ) {

      return {
        width,
        profile,
        rim
      }
    }

    const nestedValue =
      value?.size ??
      value?.tireSize ??
      value?.tyreSize ??
      value?.dimension ??
      value?.dimensions ??
      value?.sizeCode ??
      value?.tireDimension ??
      value?.tyreDimension ??
      value?.value ??
      value?.code

    if (
      nestedValue !== undefined &&
      nestedValue !== null &&
      nestedValue !== ''
    ) {

      return parseTireSize(
        nestedValue
      )
    }

    return null
  }

  let text =
    String(
      value
    )
      .trim()
      .toLowerCase()

  if (!text) {
    return null
  }

  text =
    text
      .replace(/أ—/g, '/')
      .replace(/[\/\\*]/g, '/')
      .replace(/-/g, '/')
      .replace(/\s+/g, '')
      .replace(/r/g, '/')

  const numbers =
    text.match(
      /\d+(?:\.\d+)?/g
    )

  if (
    !Array.isArray(
      numbers
    )
  ) {
    return null
  }

  if (
    numbers.length >= 3
  ) {

    return {

      width:
        numberValue(
          numbers[0]
        ),

      profile:
        numberValue(
          numbers[1]
        ),

      rim:
        numberValue(
          numbers[2]
        )

    }
  }

  if (
    numbers.length === 2
  ) {

    return {

      width:
        numberValue(
          numbers[0]
        ),

      profile:
        null,

      rim:
        numberValue(
          numbers[1]
        )

    }
  }

  return null
}


// ======================================================
// EXPAND TIRE SIZE VALUE
// ======================================================
//
// A tire size can be stored as:
//
//    "195/65R15"
//    { size: "195/65R15" }
//    { width: 195, profile: 65, rim: 15 }
//    [ "195/65R15", ... ]
//
// ======================================================

const expandTireSizeValue = (
  value,
  result = [],
  depth = 0
) => {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return result
  }

  if (
    depth > 6
  ) {
    return result
  }

  if (
    Array.isArray(
      value
    )
  ) {

    value.forEach(
      item =>
        expandTireSizeValue(
          item,
          result,
          depth + 1
        )
    )

    return result
  }

  if (
    typeof value === 'object'
  ) {

    // --------------------------------------------------
    // First preserve all known textual/nested aliases.
    // --------------------------------------------------

    const objectCandidates = [

      value?.size,
      value?.tireSize,
      value?.tyreSize,

      value?.dimension,
      value?.dimensions,

      value?.sizeCode,

      value?.tireDimension,
      value?.tyreDimension,

      value?.value,
      value?.code,

      value?.tire,
      value?.tyre

    ]

    objectCandidates.forEach(
      candidate => {

        if (
          candidate !== undefined &&
          candidate !== null &&
          candidate !== ''
        ) {

          expandTireSizeValue(
            candidate,
            result,
            depth + 1
          )
        }
      }
    )

    // --------------------------------------------------
    // Then preserve direct numeric dimensions.
    // --------------------------------------------------

    const width =
      numberValue(
        value?.width ??
        value?.sectionWidth ??
        value?.tireWidth ??
        value?.tyreWidth
      )

    const profile =
      numberValue(
        value?.profile ??
        value?.aspectRatio ??
        value?.aspect ??
        value?.height
      )

    const rim =
      numberValue(
        value?.rim ??
        value?.rimSize ??
        value?.wheelDiameter ??
        value?.diameter
      )

    if (
      width !== null &&
      rim !== null
    ) {

      result.push({

        width,

        profile,

        rim

      })
    }

    return result
  }

  result.push(
    value
  )

  return result
}


// ======================================================
// GET ALL TIRE SIZE CANDIDATES
// ======================================================
//
// IMPORTANT:
//
// Explicit technical fields are always checked before
// generic textual fields.
//
// Every representation is preserved.
//
// ======================================================

const getTireSizeCandidates = product => {

  const tire =
    getProductTire(
      product
    )

  const specifications =
    getNonEmptyObject(
      product?.specifications
    ) || {}

  const specification =
    getNonEmptyObject(
      product?.specification
    ) || {}

  const attributes =
    getNonEmptyObject(
      product?.attributes
    ) || {}

  const productData =
    getNonEmptyObject(
      product?.productData
    ) || {}

  const rawCandidates = [

    // --------------------------------------------------
    // ROOT EXPLICIT
    // --------------------------------------------------

    product?.tireSize,
    product?.tyreSize,
    product?.tireDimension,
    product?.tyreDimension,
    product?.sizeCode,
    product?.skuSize,

    // --------------------------------------------------
    // ROOT GENERIC
    // --------------------------------------------------

    product?.size,
    product?.dimension,
    product?.dimensions,

    // --------------------------------------------------
    // ROOT NUMERIC
    // --------------------------------------------------

    product?.width !== undefined &&
    product?.width !== null &&
    product?.rim !== undefined &&
    product?.rim !== null
      ? {
          width:
            product.width,

          profile:
            product?.profile ??
            product?.aspectRatio ??
            product?.aspect ??
            product?.height ??
            null,

          rim:
            product.rim
        }
      : null,

    // --------------------------------------------------
    // TIRE EXPLICIT
    // --------------------------------------------------

    tire?.tireSize,
    tire?.tyreSize,
    tire?.tireDimension,
    tire?.tyreDimension,
    tire?.sizeCode,

    // --------------------------------------------------
    // TIRE GENERIC
    // --------------------------------------------------

    tire?.size,
    tire?.dimension,
    tire?.dimensions,

    // --------------------------------------------------
    // TIRE NUMERIC
    // --------------------------------------------------

    tire?.width !== undefined &&
    tire?.width !== null &&
    tire?.rim !== undefined &&
    tire?.rim !== null
      ? {
          width:
            tire.width,

          profile:
            tire?.profile ??
            tire?.aspectRatio ??
            tire?.aspect ??
            tire?.height ??
            null,

          rim:
            tire.rim
        }
      : null,

    // --------------------------------------------------
    // SPECIFICATIONS EXPLICIT
    // --------------------------------------------------

    specifications?.tireSize,
    specifications?.tyreSize,
    specifications?.tireDimension,
    specifications?.tyreDimension,
    specifications?.sizeCode,
    specifications?.skuSize,

    // --------------------------------------------------
    // SPECIFICATIONS GENERIC
    // --------------------------------------------------

    specifications?.size,
    specifications?.dimension,
    specifications?.dimensions,

    // --------------------------------------------------
    // SPECIFICATIONS NUMERIC
    // --------------------------------------------------

    specifications?.width !== undefined &&
    specifications?.width !== null &&
    specifications?.rim !== undefined &&
    specifications?.rim !== null
      ? {
          width:
            specifications.width,

          profile:
            specifications?.profile ??
            specifications?.aspectRatio ??
            specifications?.aspect ??
            specifications?.height ??
            null,

          rim:
            specifications.rim
        }
      : null,

    // --------------------------------------------------
    // SPECIFICATION EXPLICIT
    // --------------------------------------------------

    specification?.tireSize,
    specification?.tyreSize,
    specification?.tireDimension,
    specification?.tyreDimension,
    specification?.sizeCode,
    specification?.skuSize,

    // --------------------------------------------------
    // SPECIFICATION GENERIC
    // --------------------------------------------------

    specification?.size,
    specification?.dimension,
    specification?.dimensions,

    // --------------------------------------------------
    // SPECIFICATION NUMERIC
    // --------------------------------------------------

    specification?.width !== undefined &&
    specification?.width !== null &&
    specification?.rim !== undefined &&
    specification?.rim !== null
      ? {
          width:
            specification.width,

          profile:
            specification?.profile ??
            specification?.aspectRatio ??
            specification?.aspect ??
            specification?.height ??
            null,

          rim:
            specification.rim
        }
      : null,

    // --------------------------------------------------
    // ATTRIBUTES EXPLICIT
    // --------------------------------------------------

    attributes?.tireSize,
    attributes?.tyreSize,
    attributes?.tireDimension,
    attributes?.tyreDimension,
    attributes?.sizeCode,
    attributes?.skuSize,

    // --------------------------------------------------
    // ATTRIBUTES GENERIC
    // --------------------------------------------------

    attributes?.size,
    attributes?.dimension,
    attributes?.dimensions,

    // --------------------------------------------------
    // ATTRIBUTES NUMERIC
    // --------------------------------------------------

    attributes?.width !== undefined &&
    attributes?.width !== null &&
    attributes?.rim !== undefined &&
    attributes?.rim !== null
      ? {
          width:
            attributes.width,

          profile:
            attributes?.profile ??
            attributes?.aspectRatio ??
            attributes?.aspect ??
            attributes?.height ??
            null,

          rim:
            attributes.rim
        }
      : null,

    // --------------------------------------------------
    // PRODUCT DATA EXPLICIT
    // --------------------------------------------------

    productData?.tireSize,
    productData?.tyreSize,
    productData?.tireDimension,
    productData?.tyreDimension,
    productData?.sizeCode,
    productData?.skuSize,

    // --------------------------------------------------
    // PRODUCT DATA GENERIC
    // --------------------------------------------------

    productData?.size,
    productData?.dimension,
    productData?.dimensions,

    // --------------------------------------------------
    // PRODUCT DATA NUMERIC
    // --------------------------------------------------

    productData?.width !== undefined &&
    productData?.width !== null &&
    productData?.rim !== undefined &&
    productData?.rim !== null
      ? {
          width:
            productData.width,

          profile:
            productData?.profile ??
            productData?.aspectRatio ??
            productData?.aspect ??
            productData?.height ??
            null,

          rim:
            productData.rim
        }
      : null

  ]

  const expanded =
    rawCandidates.flatMap(
      value =>
        expandTireSizeValue(
          value
        )
    )

  // ----------------------------------------------------
  // LAST-RESORT TEXTUAL SOURCES
  // ----------------------------------------------------
  //
  // These are deliberately NOT used as primary sources.
  //
  // A product name/SKU can contain numbers that are not
  // a tire size.
  //
  // ----------------------------------------------------

  const textualCandidates = [

    product?.name,
    product?.productName,
    product?.title,
    product?.description,
    product?.sku

  ]
    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )

  return [
    ...expanded,
    ...textualCandidates
  ]
    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
}


// ======================================================
// GET ALL PARSED TIRE CANDIDATES
// ======================================================
//
// IMPORTANT FIX:
//
// Do not depend on one "best" extracted tire object.
//
// A product can contain several valid size representations.
//
// ======================================================

const getParsedTireCandidates = product => {

  const candidates =
    getTireSizeCandidates(
      product
    )

  const parsed = []

  candidates.forEach(
    candidateValue => {

      const expanded =
        expandTireSizeValue(
          candidateValue
        )

      expanded.forEach(
        expandedValue => {

          const parsedValue =
            parseTireSize(
              expandedValue
            )

          if (!parsedValue) {
            return
          }

          if (
            parsedValue.width === null ||
            parsedValue.rim === null
          ) {
            return
          }

          parsed.push(
            parsedValue
          )
        }
      )
    }
  )

  // ----------------------------------------------------
  // Deduplicate parsed sizes.
  // ----------------------------------------------------

  const seen =
    new Set()

  return parsed.filter(
    value => {

      const key =
        [
          value?.width ?? '',
          value?.profile ?? '',
          value?.rim ?? ''
        ].join('|')

      if (
        seen.has(key)
      ) {
        return false
      }

      seen.add(key)

      return true
    }
  )
}


// ======================================================
// EXTRACT PRODUCT TIRE
// ======================================================

const extractProductTire = product => {

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
          'tireWidth',
          'tyreWidth'
        ]
      )
    )

  let profile =
    numberValue(
      getTireValue(
        tire,
        [
          'profile',
          'aspectRatio',
          'aspect',
          'height'
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

  let size =
    getTireValue(
      tire,
      [
        'tireSize',
        'tyreSize',
        'tireDimension',
        'tyreDimension',
        'sizeCode',
        'size',
        'dimension',
        'dimensions'
      ]
    )

  const specifications =
    getNonEmptyObject(
      product?.specifications
    ) || {}

  const specification =
    getNonEmptyObject(
      product?.specification
    ) || {}

  const attributes =
    getNonEmptyObject(
      product?.attributes
    ) || {}

  const productData =
    getNonEmptyObject(
      product?.productData
    ) || {}

  // ----------------------------------------------------
  // Direct numeric product fields.
  // ----------------------------------------------------

  width =
    width ??
    numberValue(
      product?.width ??
      product?.sectionWidth ??
      product?.tireWidth ??
      product?.tyreWidth
    )

  profile =
    profile ??
    numberValue(
      product?.profile ??
      product?.aspectRatio ??
      product?.aspect ??
      product?.height
    )

  rim =
    rim ??
    numberValue(
      product?.rim ??
      product?.rimSize ??
      product?.wheelDiameter ??
      product?.diameter
    )

  // ----------------------------------------------------
  // Specification numeric fields.
  // ----------------------------------------------------

  width =
    width ??
    numberValue(
      specifications?.width ??
      specifications?.sectionWidth ??
      specifications?.tireWidth ??
      specifications?.tyreWidth ??
      specification?.width ??
      specification?.sectionWidth ??
      specification?.tireWidth ??
      specification?.tyreWidth ??
      attributes?.width ??
      attributes?.sectionWidth ??
      attributes?.tireWidth ??
      attributes?.tyreWidth ??
      productData?.width ??
      productData?.sectionWidth ??
      productData?.tireWidth ??
      productData?.tyreWidth
    )

  profile =
    profile ??
    numberValue(
      specifications?.profile ??
      specifications?.aspectRatio ??
      specifications?.aspect ??
      specifications?.height ??
      specification?.profile ??
      specification?.aspectRatio ??
      specification?.aspect ??
      specification?.height ??
      attributes?.profile ??
      attributes?.aspectRatio ??
      attributes?.aspect ??
      attributes?.height ??
      productData?.profile ??
      productData?.aspectRatio ??
      productData?.aspect ??
      productData?.height
    )

  rim =
    rim ??
    numberValue(
      specifications?.rim ??
      specifications?.rimSize ??
      specifications?.wheelDiameter ??
      specifications?.diameter ??
      specification?.rim ??
      specification?.rimSize ??
      specification?.wheelDiameter ??
      specification?.diameter ??
      attributes?.rim ??
      attributes?.rimSize ??
      attributes?.wheelDiameter ??
      attributes?.diameter ??
      productData?.rim ??
      productData?.rimSize ??
      productData?.wheelDiameter ??
      productData?.diameter
    )

  // ----------------------------------------------------
  // IMPORTANT:
  //
  // Evaluate ALL parsed sizes.
  //
  // Prefer a complete 3-part size when dimensions are
  // otherwise missing, but never discard other candidates.
  // ----------------------------------------------------

  const parsedCandidates =
    getParsedTireCandidates(
      product
    )

  let bestParsed =
    null

  for (
    const candidate
    of parsedCandidates
  ) {

    if (!bestParsed) {

      bestParsed =
        candidate

      continue
    }

    const candidateComplete =
      candidate?.width !== null &&
      candidate?.profile !== null &&
      candidate?.rim !== null

    const bestComplete =
      bestParsed?.width !== null &&
      bestParsed?.profile !== null &&
      bestParsed?.rim !== null

    if (
      candidateComplete &&
      !bestComplete
    ) {

      bestParsed =
        candidate
    }
  }

  if (
    bestParsed
  ) {

    width =
      width ??
      bestParsed.width

    profile =
      profile ??
      bestParsed.profile

    rim =
      rim ??
      bestParsed.rim

    if (
      size === null ||
      size === undefined ||
      size === ''
    ) {

      const reconstructed =
        bestParsed.profile !== null
          ? `${bestParsed.width}/${bestParsed.profile}/${bestParsed.rim}`
          : `${bestParsed.width}/${bestParsed.rim}`

      size =
        reconstructed
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
// NORMALIZE SIZE FOR MATCHING
// ======================================================

const normalizeSizeForMatch = value => {

  return normalizeText(
    value
  )
    .replace(
      /[\/\\*أ—-]/g,
      '/'
    )
}


// ======================================================
// PARSED TIRE SIZE COMPATIBILITY
// ======================================================

const parsedTireSizesMatch = (
  candidate,
  requested
) => {

  if (
    !candidate ||
    !requested
  ) {
    return false
  }

  if (
    candidate.width === null ||
    requested.width === null
  ) {
    return false
  }

  if (
    candidate.rim === null ||
    requested.rim === null
  ) {
    return false
  }

  if (
    candidate.width !==
    requested.width
  ) {
    return false
  }

  if (
    candidate.rim !==
    requested.rim
  ) {
    return false
  }

  // ----------------------------------------------------
  // If requested profile exists, candidate MUST contain
  // the same profile.
  // ----------------------------------------------------

  if (
    requested.profile !== null
  ) {

    if (
      candidate.profile === null
    ) {
      return false
    }

    if (
      candidate.profile !==
      requested.profile
    ) {
      return false
    }
  }

  return true
}


// ======================================================
// TIRE SIZE MATCH
// ======================================================
//
// IMPORTANT FIX:
//
// Match against EVERY parsed candidate.
//
// A product can have:
//
//    tireSize = "205/55R16"
//    size = "195/65R15"
//    tire = { width: 195, profile: 65, rim: 15 }
//
// Any valid matching technical representation is enough.
//
// ======================================================

const tireSizeMatches = (
  product,
  requestedSize
) => {

  const parsedRequested =
    parseTireSize(
      requestedSize
    )

  if (!parsedRequested) {
    return false
  }

  // ----------------------------------------------------
  // 1. ALL structured / explicit product candidates.
  // ----------------------------------------------------

  const parsedCandidates =
    getParsedTireCandidates(
      product
    )

  if (
    parsedCandidates.some(
      candidate =>
        parsedTireSizesMatch(
          candidate,
          parsedRequested
        )
    )
  ) {

    return true
  }

  // ----------------------------------------------------
  // 2. Consolidated technical representation.
  // ----------------------------------------------------

  const productTire =
    extractProductTire(
      product
    )

  if (
    parsedTireSizesMatch(
      productTire,
      parsedRequested
    )
  ) {
    return true
  }

  // ----------------------------------------------------
  // 3. Exact normalized fallback.
  //
  // This is mainly useful for non-standard strings that
  // normalize exactly.
  // ----------------------------------------------------

  const requestedRaw =
    typeof requestedSize === 'object' &&
    requestedSize !== null
      ? (
          requestedSize?.size ??
          requestedSize?.tireSize ??
          requestedSize?.tyreSize ??
          requestedSize?.dimension ??
          requestedSize?.dimensions ??
          requestedSize?.sizeCode ??
          requestedSize?.value ??
          ''
        )
      : requestedSize

  const requestedNormalized =
    normalizeSizeForMatch(
      requestedRaw
    )

  if (
    requestedNormalized
  ) {

    const values =
      getTireSizeCandidates(
        product
      )

    for (
      const value
      of values
    ) {

      const expanded =
        expandTireSizeValue(
          value
        )

      for (
        const candidate
        of expanded
      ) {

        if (
          typeof candidate === 'object'
        ) {

          const parsedCandidate =
            parseTireSize(
              candidate
            )

          if (
            parsedCandidate &&
            parsedTireSizesMatch(
              parsedCandidate,
              parsedRequested
            )
          ) {
            return true
          }

          continue
        }

        if (
          normalizeSizeForMatch(
            candidate
          ) ===
          requestedNormalized
        ) {
          return true
        }
      }
    }
  }

  return false
}


// ======================================================
// GET PRODUCT SIZE VALUES
// ======================================================

const getProductSizeValues = product => {

  const tire =
    getProductTire(
      product
    )

  const specifications =
    getNonEmptyObject(
      product?.specifications
    ) || {}

  const specification =
    getNonEmptyObject(
      product?.specification
    ) || {}

  const attributes =
    getNonEmptyObject(
      product?.attributes
    ) || {}

  const productData =
    getNonEmptyObject(
      product?.productData
    ) || {}

  const reconstructedSize =
    tire?.width !== undefined &&
    tire?.width !== null &&
    tire?.profile !== undefined &&
    tire?.profile !== null &&
    tire?.rim !== undefined &&
    tire?.rim !== null
      ? `${tire.width}/${tire.profile}/${tire.rim}`
      : null

  const values = [

    // --------------------------------------------------
    // ROOT
    // --------------------------------------------------

    product?.tireSize,
    product?.tyreSize,
    product?.tireDimension,
    product?.tyreDimension,
    product?.sizeCode,
    product?.skuSize,
    product?.size,
    product?.dimension,
    product?.dimensions,

    // --------------------------------------------------
    // ROOT NUMERIC
    // --------------------------------------------------

    product?.width !== undefined &&
    product?.width !== null &&
    product?.rim !== undefined &&
    product?.rim !== null
      ? (
          product?.profile !== undefined &&
          product?.profile !== null
            ? `${product.width}/${product.profile}/${product.rim}`
            : `${product.width}/${product.rim}`
        )
      : null,

    // --------------------------------------------------
    // TIRE OBJECT
    // --------------------------------------------------

    tire?.tireSize,
    tire?.tyreSize,
    tire?.tireDimension,
    tire?.tyreDimension,
    tire?.sizeCode,
    tire?.size,
    tire?.dimension,
    tire?.dimensions,

    reconstructedSize,

    tire?.width !== undefined &&
    tire?.width !== null &&
    tire?.rim !== undefined &&
    tire?.rim !== null
      ? (
          tire?.profile !== undefined &&
          tire?.profile !== null
            ? `${tire.width}/${tire.profile}/${tire.rim}`
            : `${tire.width}/${tire.rim}`
        )
      : null,

    // --------------------------------------------------
    // SPECIFICATIONS
    // --------------------------------------------------

    specifications?.tireSize,
    specifications?.tyreSize,
    specifications?.tireDimension,
    specifications?.tyreDimension,
    specifications?.sizeCode,
    specifications?.skuSize,
    specifications?.size,
    specifications?.dimension,
    specifications?.dimensions,

    specifications?.width !== undefined &&
    specifications?.width !== null &&
    specifications?.rim !== undefined &&
    specifications?.rim !== null
      ? (
          specifications?.profile !== undefined &&
          specifications?.profile !== null
            ? `${specifications.width}/${specifications.profile}/${specifications.rim}`
            : `${specifications.width}/${specifications.rim}`
        )
      : null,

    // --------------------------------------------------
    // SPECIFICATION
    // --------------------------------------------------

    specification?.tireSize,
    specification?.tyreSize,
    specification?.tireDimension,
    specification?.tyreDimension,
    specification?.sizeCode,
    specification?.skuSize,
    specification?.size,
    specification?.dimension,
    specification?.dimensions,

    specification?.width !== undefined &&
    specification?.width !== null &&
    specification?.rim !== undefined &&
    specification?.rim !== null
      ? (
          specification?.profile !== undefined &&
          specification?.profile !== null
            ? `${specification.width}/${specification.profile}/${specification.rim}`
            : `${specification.width}/${specification.rim}`
        )
      : null,

    // --------------------------------------------------
    // ATTRIBUTES
    // --------------------------------------------------

    attributes?.tireSize,
    attributes?.tyreSize,
    attributes?.tireDimension,
    attributes?.tyreDimension,
    attributes?.sizeCode,
    attributes?.skuSize,
    attributes?.size,
    attributes?.dimension,
    attributes?.dimensions,

    attributes?.width !== undefined &&
    attributes?.width !== null &&
    attributes?.rim !== undefined &&
    attributes?.rim !== null
      ? (
          attributes?.profile !== undefined &&
          attributes?.profile !== null
            ? `${attributes.width}/${attributes.profile}/${attributes.rim}`
            : `${attributes.width}/${attributes.rim}`
        )
      : null,

    // --------------------------------------------------
    // PRODUCT DATA
    // --------------------------------------------------

    productData?.tireSize,
    productData?.tyreSize,
    productData?.tireDimension,
    productData?.tyreDimension,
    productData?.sizeCode,
    productData?.skuSize,
    productData?.size,
    productData?.dimension,
    productData?.dimensions,

    productData?.width !== undefined &&
    productData?.width !== null &&
    productData?.rim !== undefined &&
    productData?.rim !== null
      ? (
          productData?.profile !== undefined &&
          productData?.profile !== null
            ? `${productData.width}/${productData.profile}/${productData.rim}`
            : `${productData.width}/${productData.rim}`
        )
      : null,

    // --------------------------------------------------
    // LAST RESORT TEXT
    // --------------------------------------------------

    product?.name,
    product?.productName,
    product?.title,
    product?.description,
    product?.sku

  ]

  return values
    .flatMap(
      value =>
        expandTireSizeValue(
          value
        )
    )
    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
}


// ======================================================
// TIRE MATCH AGAINST VEHDB / LOCAL SIZE
// ======================================================

const tireMatchesVehDBSize = (
  product,
  size
) => {

  const parsed =
    parseTireSize(
      size
    )

  if (parsed) {

    return tireSizeMatches(
      product,
      parsed
    )
  }

  const wanted =
    normalizeSizeForMatch(
      size
    )

  if (!wanted) {
    return false
  }

  return getProductSizeValues(
    product
  )
    .some(
      value =>
        normalizeSizeForMatch(
          value
        ) === wanted
    )
}


// ======================================================
// GET BATTERY VALUES
// ======================================================

const getBatteryValues = product => {

  const battery =
    getProductBattery(
      product
    )

  const specifications =
    product?.specifications ||
    {}

  const attributes =
    product?.attributes ||
    {}

  return [

    battery?.capacity,
    battery?.batteryCapacity,
    battery?.ampereHour,
    battery?.ah,
    battery?.amp,
    battery?.ampHours,
    battery?.batteryType,
    battery?.typeCode,
    battery?.batteryCode,
    battery?.code,
    battery?.model,
    battery?.batteryModel,
    battery?.group,
    battery?.groupSize,
    battery?.size,
    battery?.sizeCode,
    battery?.name,
    battery?.productName,
    battery?.title,
    battery?.description,
    battery?.sku,

    product?.capacity,
    product?.batteryCapacity,
    product?.ampereHour,
    product?.ah,
    product?.amp,
    product?.ampHours,
    product?.batteryType,
    product?.typeCode,
    product?.batteryCode,
    product?.code,
    product?.model,
    product?.batteryModel,
    product?.group,
    product?.groupSize,
    product?.size,
    product?.sizeCode,
    product?.name,
    product?.productName,
    product?.title,
    product?.description,
    product?.sku,

    specifications?.capacity,
    specifications?.batteryCapacity,
    specifications?.ampereHour,
    specifications?.ah,
    specifications?.amp,
    specifications?.ampHours,
    specifications?.batteryType,
    specifications?.typeCode,
    specifications?.batteryCode,
    specifications?.code,
    specifications?.model,
    specifications?.batteryModel,
    specifications?.group,
    specifications?.groupSize,
    specifications?.size,
    specifications?.sizeCode,

    attributes?.capacity,
    attributes?.batteryCapacity,
    attributes?.ampereHour,
    attributes?.ah,
    attributes?.amp,
    attributes?.ampHours,
    attributes?.batteryType,
    attributes?.typeCode,
    attributes?.batteryCode,
    attributes?.code,
    attributes?.model,
    attributes?.batteryModel,
    attributes?.group,
    attributes?.groupSize,
    attributes?.size,
    attributes?.sizeCode

  ]
    .filter(
      value =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
}


// ======================================================
// BATTERY CODE EXTRACTION
// ======================================================

const extractBatteryCodes = value => {

  const text =
    normalizeBatteryValue(
      value
    )

  if (!text) {
    return []
  }

  const matches =
    text.match(
      /\bn\d{0,3}[a-z]?\b|\b\d{1,3}ah\b|\b\d{1,3}\b/gi
    )

  if (
    !Array.isArray(
      matches
    )
  ) {
    return []
  }

  return [
    ...new Set(
      matches
        .map(
          item =>
            normalizeBatteryValue(
              item
            )
        )
        .filter(Boolean)
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

  if (!wanted) {
    return false
  }

  const values =
    getBatteryValues(
      product
    )

  const wantedNumber =
    numberValue(
      wanted.replace(
        /ah$/i,
        ''
      )
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

      if (!actual) {
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

      const actualNumber =
        numberValue(
          actual.replace(
            /ah$/i,
            ''
          )
        )

      if (
        wantedNumber !== null &&
        actualNumber !== null &&
        wantedNumber === actualNumber
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

    const result = []

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

            if (!product) {
              return
            }

            const productId =
              getProductId(
                product
              )

            if (!productId) {
              return
            }

            result.push({

              ...product,

              id:
                productId,

              productId:
                productId,

              warehouseId:
                product?.warehouseId ??
                warehouse?.id ??
                null,

              warehouseName:
                product?.warehouseName ||
                warehouse?.name ||
                'ط§ظ„ظ…ط®ط²ظ†',

              quantity:
                Math.max(
                  0,
                  Number(
                    product?.availableQuantity ??
                    product?.quantity ??
                    product?.stock ??
                    0
                  )
                )

            })
          }
        )
      }
    )

    return result

  }
  catch (
    error
  ) {

    console.error(
      '[VehicleSearchController] Warehouse read failed:',
      error
    )

    return []
  }
}


// ======================================================
// WAREHOUSE STOCK
// ======================================================

const getWarehouseStockForProduct = productId => {

  const normalizedId =
    normalizeText(
      productId
    )

  if (!normalizedId) {
    return []
  }

  return getWarehouseProducts()
    .filter(
      product =>
        normalizeText(
          product?.productId ??
          product?.id ??
          ''
        ) === normalizedId
    )
}


// ======================================================
// ACTIVE OFFER
// ======================================================

const getActiveOfferFor = product => {

  const websiteState =
    useWebsiteStore.getState()

  const websiteProducts =
    Array.isArray(
      websiteState?.products
    )
      ? websiteState.products
      : []

  const offers =
    Array.isArray(
      websiteState?.offers
    )
      ? websiteState.offers
      : []

  const websiteProduct =
    websiteProducts.find(
      item =>
        idsEqual(
          item,
          product
        )
    ) || null

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
            product,
            {
              productId:
                item.productId
            }
          )
        ) {

          if (
            !websiteProduct ||
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
        }

        const now =
          new Date()

        if (
          item.startDate
        ) {

          const start =
            new Date(
              item.startDate
            )

          if (
            !Number.isNaN(
              start.getTime()
            ) &&
            now < start
          ) {
            return false
          }
        }

        if (
          item.endDate
        ) {

          const end =
            new Date(
              item.endDate
            )

          if (
            !Number.isNaN(
              end.getTime()
            ) &&
            now > end
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
// CALCULATE OFFER PRICE
// ======================================================

const calculateOfferPrice = (
  basePrice,
  offer
) => {

  if (!offer) {
    return null
  }

  const explicitPrice =
    Number(
      offer?.offerPrice ??
      offer?.salePrice ??
      offer?.newPrice ??
      NaN
    )

  if (
    Number.isFinite(
      explicitPrice
    ) &&
    explicitPrice >= 0
  ) {
    return explicitPrice
  }

  const discount =
    Number(
      offer?.discount ??
      offer?.discountPercentage ??
      offer?.discountPercent ??
      0
    )

  if (
    Number.isFinite(
      discount
    ) &&
    discount > 0 &&
    discount < 100 &&
    basePrice > 0
  ) {

    return (
      basePrice *
      (1 - discount / 100)
    )
  }

  return null
}


// ======================================================
// BUILD CUSTOMER PRODUCT
// ======================================================

const buildCustomerProduct = product => {

  const productId =
    getProductId(
      product
    )

  const warehouseRows =
    getWarehouseStockForProduct(
      productId
    )

  const warehouseQuantity =
    warehouseRows.reduce(
      (
        total,
        row
      ) =>
        total +
        Number(
          row?.quantity ??
          row?.availableQuantity ??
          0
        ),
      0
    )

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
    ) || null

  const warehousePriceCandidates = [

    ...warehouseRows.map(
      row =>
        row?.salePrice ??
        row?.sellingPrice ??
        row?.price
    ),

    product?.salePrice,
    product?.sellingPrice,
    product?.price,
    product?.consumerPrice

  ]

  const warehousePrice =
    warehousePriceCandidates
      .map(
        value =>
          Number(value)
      )
      .find(
        value =>
          Number.isFinite(value) &&
          value > 0
      ) ?? 0

  const {
    offer
  } =
    getActiveOfferFor(
      product
    )

  const offerPrice =
    calculateOfferPrice(
      warehousePrice,
      offer
    )

  const finalPrice =
    offerPrice !== null
      ? offerPrice
      : warehousePrice

  const warehouses =
    warehouseRows.map(
      row => {

        const rowWarehousePrice =
          Number(
            row?.salePrice ??
            row?.sellingPrice ??
            row?.price ??
            warehousePrice
          )

        return {

          id:
            row?.warehouseId,

          warehouseId:
            row?.warehouseId,

          name:
            row?.warehouseName ||
            'ط§ظ„ظ…ط®ط²ظ†',

          warehouseName:
            row?.warehouseName ||
            'ط§ظ„ظ…ط®ط²ظ†',

          quantity:
            Number(
              row?.quantity ??
              row?.availableQuantity ??
              0
            ),

          warehousePrice:
            Number.isFinite(
              rowWarehousePrice
            )
              ? rowWarehousePrice
              : warehousePrice,

          finalCustomerPrice:
            finalPrice,

          offerApplied:
            offerPrice !== null,

          warehousePriceSource:
            offerPrice !== null
              ? 'warehouse-with-active-offer'
              : 'warehouse',

          warehousePriceLabel:
            offerPrice !== null
              ? 'ط³ط¹ط± ط§ظ„ظ…ط®ط²ظ† ط§ظ„ط£طµظ„ظٹ - ط§ظ„ط¹ط±ط¶ ظ…ط·ط¨ظ‚ ط¹ظ„ظ‰ ط§ظ„ط¹ظ…ظٹظ„'
              : 'ط³ط¹ط± ط§ظ„ط¨ظٹط¹ ظ…ظ† ط§ظ„ظ…ط®ط²ظ†'

        }
      }
    )

  const productTire =
    mergeTechnicalObjects(
      getProductTire(
        product
      ),
      getProductTire(
        websiteProduct
      )
    )

  const productBattery =
    mergeTechnicalObjects(
      getProductBattery(
        product
      ),
      getProductBattery(
        websiteProduct
      )
    )

  const productOil =
    mergeTechnicalObjects(
      getProductOil(
        product
      ),
      getProductOil(
        websiteProduct
      )
    )

  const specifications =
    mergeTechnicalObjects(
      product?.specifications,
      websiteProduct?.specifications
    )

  const attributes =
    mergeTechnicalObjects(
      product?.attributes,
      websiteProduct?.attributes
    )

  return {

    ...(websiteProduct || {}),

    ...product,

    id:
      productId,

    productId:
      productId,

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
      productTire,

    battery:
      productBattery,

    oil:
      productOil,

    specifications,

    attributes,

    // ==================================================
    // PRICING
    // ==================================================

    warehousePrice,

    originalSalePrice:
      warehousePrice,

    salePrice:
      finalPrice,

    price:
      finalPrice,

    offerPrice,

    oldPrice:
      offerPrice !== null
        ? warehousePrice
        : null,

    hasOffer:
      offerPrice !== null,

    offerApplied:
      offerPrice !== null,

    offerId:
      offer?.id ??
      null,

    offerTitle:
      offer?.title ||
      '',

    offerDescription:
      offer?.description ||
      '',

    offerStartDate:
      offer?.startDate ??
      null,

    offerEndDate:
      offer?.endDate ??
      null,

    warehouseFinalPrice:
      finalPrice,

    warehousePriceLabel:
      offerPrice !== null
        ? 'ط³ط¹ط± ط§ظ„ط¨ظٹط¹ ط¨ط¹ط¯ ط§ظ„ط¹ط±ط¶'
        : 'ط³ط¹ط± ط§ظ„ط¨ظٹط¹ ظ…ظ† ط§ظ„ظ…ط®ط²ظ†',

    // ==================================================
    // STOCK
    // ==================================================

    quantity:
      warehouseQuantity,

    stock:
      warehouseQuantity,

    availableQuantity:
      warehouseQuantity,

    available:
      warehouseQuantity > 0,

    availability:
      warehouseQuantity > 0
        ? 'ظ…طھظˆظپط±'
        : 'ط؛ظٹط± ظ…طھظˆظپط±',

    warehouses,

    // ==================================================
    // FLAGS
    // ==================================================

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
// MERGE PRODUCT RECORDS
// ======================================================

const mergeProductRecords = (
  existing,
  incoming
) => {

  if (!existing) {
    return {
      ...incoming
    }
  }

  if (!incoming) {
    return {
      ...existing
    }
  }

  const mergedTire =
    mergeTechnicalObjects(
      getProductTire(
        existing
      ),
      getProductTire(
        incoming
      )
    )

  const mergedBattery =
    mergeTechnicalObjects(
      getProductBattery(
        existing
      ),
      getProductBattery(
        incoming
      )
    )

  const mergedOil =
    mergeTechnicalObjects(
      getProductOil(
        existing
      ),
      getProductOil(
        incoming
      )
    )

  const mergedSpecifications =
    mergeTechnicalObjects(
      existing?.specifications,
      incoming?.specifications
    )

  const mergedSpecification =
    mergeTechnicalObjects(
      existing?.specification,
      incoming?.specification
    )

  const mergedAttributes =
    mergeTechnicalObjects(
      existing?.attributes,
      incoming?.attributes
    )

  return {

    ...existing,

    ...incoming,

    id:
      existing?.id ||
      incoming?.id,

    productId:
      existing?.productId ||
      incoming?.productId ||
      existing?.id ||
      incoming?.id,

    name:
      existing?.name ||
      incoming?.name ||
      existing?.productName ||
      incoming?.productName ||
      '',

    productName:
      existing?.productName ||
      incoming?.productName ||
      existing?.name ||
      incoming?.name ||
      '',

    type:
      existing?.type ||
      incoming?.type ||
      existing?.productType ||
      incoming?.productType ||
      '',

    brand:
      existing?.brand ||
      incoming?.brand ||
      '',

    model:
      existing?.model ||
      incoming?.model ||
      '',

    tire:
      mergedTire,

    battery:
      mergedBattery,

    oil:
      mergedOil,

    tireData:
      mergedTire,

    batteryData:
      mergedBattery,

    oilData:
      mergedOil,

    tireSize:
      existing?.tireSize ??
      incoming?.tireSize,

    tyreSize:
      existing?.tyreSize ??
      incoming?.tyreSize,

    size:
      existing?.size ??
      incoming?.size,

    dimension:
      existing?.dimension ??
      incoming?.dimension,

    dimensions:
      existing?.dimensions ??
      incoming?.dimensions,

    sizeCode:
      existing?.sizeCode ??
      incoming?.sizeCode,

    skuSize:
      existing?.skuSize ??
      incoming?.skuSize,

    specifications:
      mergedSpecifications,

    specification:
      mergedSpecification,

    attributes:
      mergedAttributes

  }
}


// ======================================================
// GET ALL PRODUCTS
// ======================================================

const getAllProducts = async () => {

  let repositoryProducts = []

  try {

    const result =
      await ProductsRepository.getAll()

    if (
      result?.success === false
    ) {

      console.error(
        '[VehicleSearchController] ProductsRepository returned an error:',
        result?.message,
        result?.errors
      )

    }
    else if (
      Array.isArray(
        result?.data
      )
    ) {

      repositoryProducts =
        result.data

    }

    console.log(
      '[VehicleSearchController] PRODUCT CATALOG LOADED:',
      {
        repositoryProducts:
          repositoryProducts.length
      }
    )

  }
  catch (
    error
  ) {

    console.error(
      '[VehicleSearchController] ProductsRepository failed:',
      error
    )
  }

  const warehouseProducts =
    getWarehouseProducts()

  const websiteState =
    useWebsiteStore.getState()

  const websiteProducts =
    Array.isArray(
      websiteState?.products
    )
      ? websiteState.products
      : []

  const map =
    new Map()

  // ====================================================
  // REPOSITORY
  // ====================================================

  repositoryProducts.forEach(
    product => {

      const id =
        getProductId(
          product
        )

      const mapKey =
        getProductMapKey(
          product
        )

      if (
        !id ||
        !mapKey
      ) {
        return
      }

      map.set(
        mapKey,
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

      const id =
        getProductId(
          product
        )

      const mapKey =
        getProductMapKey(
          product
        )

      if (
        !id ||
        !mapKey
      ) {
        return
      }

      const existing =
        map.get(
          mapKey
        )

      map.set(
        mapKey,
        mergeProductRecords(
          existing,
          {
            ...product,
            id,
            productId:
              product?.productId ??
              id
          }
        )
      )
    }
  )

  // ====================================================
  // WAREHOUSE
  // ====================================================

  warehouseProducts.forEach(
    warehouseProduct => {

      const id =
        getProductId(
          warehouseProduct
        )

      const mapKey =
        getProductMapKey(
          warehouseProduct
        )

      if (
        !id ||
        !mapKey
      ) {
        return
      }

      const existing =
        map.get(
          mapKey
        )

      map.set(
        mapKey,
        mergeProductRecords(
          existing,
          {
            ...warehouseProduct,
            id,
            productId:
              id
          }
        )
      )
    }
  )

  const result =
    Array.from(
      map.values()
    )

  // ====================================================
  // DEBUG PRODUCT CATALOG
  // ====================================================

  const tireProducts =
    result.filter(
      product =>
        normalizeProductType(
          product
        ) === 'tire'
    )

  const productsWithTireData =
    tireProducts.filter(
      product =>
        getProductSizeValues(
          product
        ).length > 0
    )

  const productsWithoutTireData =
    tireProducts.filter(
      product =>
        getProductSizeValues(
          product
        ).length === 0
    )

  console.log(
    '[VehicleSearchController] COMPLETE PRODUCT CATALOG:',
    {

      repositoryProducts:
        repositoryProducts.length,

      websiteProducts:
        websiteProducts.length,

      warehouseProducts:
        warehouseProducts.length,

      uniqueProducts:
        result.length,

      tires:
        tireProducts.length,

      tiresWithSizeData:
        productsWithTireData.length,

      tiresWithoutSizeData:
        productsWithoutTireData.length,

      batteries:
        result.filter(
          product =>
            normalizeProductType(
              product
            ) === 'battery'
        ).length,

      oils:
        result.filter(
          product =>
            normalizeProductType(
              product
            ) === 'oil'
        ).length

    }
  )

  // ====================================================
  // DEBUG TIRE CATALOG
  // ====================================================

  console.log(
    '[VehicleSearchController] TIRE CATALOG DEBUG:',
    tireProducts.map(
      product => ({

        id:
          getProductId(
            product
          ),

        name:
          product?.name ||
          product?.productName ||
          '',

        quantity:
          getWarehouseStockForProduct(
            getProductId(
              product
            )
          ).reduce(
            (
              total,
              row
            ) =>
              total +
              Number(
                row?.quantity ??
                row?.availableQuantity ??
                0
              ),
            0
          ),

        sizeValues:
          getProductSizeValues(
            product
          ),

        extractedTire:
          extractProductTire(
            product
          ),

        parsedTireCandidates:
          getParsedTireCandidates(
            product
          ),

        tireCandidates:
          getTireSizeCandidates(
            product
          )

      })
    )
  )

  return result
}


// ======================================================
// BUILD RESULT
// ======================================================

const buildResults = products => {

  if (
    !Array.isArray(
      products
    )
  ) {
    return []
  }

  return products.map(
    product =>
      buildCustomerProduct(
        product
      )
  )
}


// ======================================================
// LOCAL FITMENT HELPERS
// ======================================================

const getLocalSizeValue = value => {

  if (
    value === undefined ||
    value === null
  ) {
    return ''
  }

  if (
    typeof value !== 'object'
  ) {

    return String(
      value
    ).trim()
  }

  return String(

    value?.size ??
    value?.tireSize ??
    value?.tyreSize ??
    value?.dimension ??
    value?.dimensions ??
    value?.sizeCode ??
    value?.value ??
    ''

  ).trim()
}


// ======================================================
// EXTRACT LOCAL SIZES
// ======================================================

const extractLocalSizes = source => {

  if (
    !source ||
    typeof source !== 'object'
  ) {
    return []
  }

  const rawSizes = [

    ...(Array.isArray(source?.sizes)
      ? source.sizes
      : []),

    ...(Array.isArray(source?.tireSizes)
      ? source.tireSizes
      : []),

    ...(Array.isArray(source?.tyreSizes)
      ? source.tyreSizes
      : []),

    ...(Array.isArray(source?.oemSizes)
      ? source.oemSizes
      : []),

    ...(Array.isArray(source?.alternateSizes)
      ? source.alternateSizes
      : []),

    ...(Array.isArray(source?.tires)
      ? source.tires
      : []),

    ...(Array.isArray(source?.models)
      ? source.models.flatMap(
          model =>
            Array.isArray(
              model?.tireSizes
            )
              ? model.tireSizes
              : []
        )
      : [])

  ]

  return rawSizes
    .map(
      size => {

        if (
          typeof size === 'object'
        ) {

          return (

            size?.size ??
            size?.tireSize ??
            size?.tyreSize ??
            size?.dimension ??
            size?.dimensions ??
            size?.sizeCode ??
            size?.value ??
            ''

          )
        }

        return size
      }
    )
    .filter(
      size =>
        String(
          size ?? ''
        ).trim() !== ''
    )
}


// ======================================================
// LOCAL NESTED DATABASE LOOKUP
// ======================================================

const findNestedLocalVehicle = ({
  make,
  model,
  year
}) => {

  if (
    !Array.isArray(
      vehicleDatabase
    )
  ) {
    return null
  }

  const wantedMake =
    normalizeText(
      make
    )

  const wantedModel =
    normalizeText(
      model
    )

  const wantedYear =
    numberValue(
      year
    )

  if (
    !wantedMake ||
    !wantedModel ||
    wantedYear === null
  ) {
    return null
  }

  for (
    const brandEntry
    of vehicleDatabase
  ) {

    if (
      normalizeText(
        brandEntry?.brand
      ) !== wantedMake
    ) {
      continue
    }

    const models =
      Array.isArray(
        brandEntry?.models
      )
        ? brandEntry.models
        : []

    for (
      const modelEntry
      of models
    ) {

      if (
        normalizeText(
          modelEntry?.name
        ) !== wantedModel
      ) {
        continue
      }

      const years =
        Array.isArray(
          modelEntry?.years
        )
          ? modelEntry.years
          : []

      const yearExists =
        years.some(
          item =>
            numberValue(
              item
            ) === wantedYear
        )

      if (!yearExists) {
        continue
      }

      return {

        ...modelEntry,

        brand:
          brandEntry?.brand ??
          make,

        make:
          brandEntry?.brand ??
          make,

        model:
          modelEntry?.name ??
          model,

        year,

        tireSizes:
          Array.isArray(
            modelEntry?.tireSizes
          )
            ? [
                ...modelEntry.tireSizes
              ]
            : [],

        tires:
          Array.isArray(
            modelEntry?.tireSizes
          )
            ? [
                ...modelEntry.tireSizes
              ]
            : []

      }
    }
  }

  return null
}


// ======================================================
// LOCAL VEHICLE LOOKUP
// ======================================================

const getLocalFitment = ({
  make,
  model,
  year
}) => {

  try {

    let serviceVehicle = null

    try {

      serviceVehicle =
        VehicleLookupService.findVehicle({
          manufacturer:
            make,

          model,

          year
        })

    } catch (error) {

      console.warn(
        '[VehicleSearchController] VehicleLookupService lookup failed:',
        error
      )

    }

    const nestedVehicle =
      findNestedLocalVehicle({
        make,
        model,
        year
      })

    const localVehicle =
      serviceVehicle ||
      nestedVehicle ||
      null

    if (!localVehicle) {

      return {
        found: false,
        vehicle: null,
        fitment: null
      }

    }

    console.log(
      '[VehicleSearchController] LOCAL VEHICLE MEMORY HIT',
      {
        make,
        model,
        year,
        vehicle:
          localVehicle
      }
    )

    console.log(
      '[VehicleSearchController] VEHDB SKIPPED — LOCAL VEHICLE EXISTS'
    )

    /*
     * Local vehicle memory provides the vehicle identity
     * and may already contain tire fitment.
     *
     * LocalTechnicalFitmentProvider adds the technical
     * fallback requirements for:
     *
     * - tires
     * - batteries
     * - oils
     *
     * Compatibility is resolved independently from
     * warehouse availability.
     */

    let technicalFitment = null

    try {

      technicalFitment =
        LocalTechnicalFitmentProvider
          .findFitmentSync({
            make,
            model,
            year
          })

    } catch (error) {

      console.warn(
        '[VehicleSearchController] Local technical fitment lookup failed:',
        error
      )

    }

    const candidates = [

      serviceVehicle?.fitment,

      serviceVehicle?.fitments,

      serviceVehicle?.compatibility,

      serviceVehicle?.tireFitment,

      serviceVehicle?.tireFitments,

      serviceVehicle?.vehicleFitment,

      serviceVehicle,

      nestedVehicle?.fitment,

      nestedVehicle?.fitments,

      nestedVehicle?.compatibility,

      nestedVehicle?.tireFitment,

      nestedVehicle?.tireFitments,

      nestedVehicle

    ]

    const allSizes = []

    const allOemSizes = []

    const allAlternateSizes = []

    const seenSizes = new Set()

    const seenOemSizes = new Set()

    const seenAlternateSizes = new Set()

    let firstFitmentSource = null

    const addSize = (
      value,
      target,
      seen
    ) => {

      const normalized =
        normalizeSizeForMatch(value)

      if (
        !normalized ||
        seen.has(normalized)
      ) {
        return
      }

      seen.add(normalized)
      target.push(normalized)
    }

    for (
      const candidate of candidates
    ) {

      if (!candidate) {
        continue
      }

      if (!firstFitmentSource) {
        firstFitmentSource =
          candidate
      }

      const localSizes =
        extractLocalSizes(
          candidate
        )

      for (
        const size of localSizes
      ) {

        addSize(
          size,
          allSizes,
          seenSizes
        )

      }

      const oemSizes =
        Array.isArray(
          candidate?.oemSizes
        )
          ? candidate.oemSizes
          : []

      for (
        const size of oemSizes
      ) {

        addSize(
          size,
          allOemSizes,
          seenOemSizes
        )

        addSize(
          size,
          allSizes,
          seenSizes
        )

      }

      const alternateSizes =
        Array.isArray(
          candidate?.alternateSizes
        )
          ? candidate.alternateSizes
          : []

      for (
        const size of alternateSizes
      ) {

        addSize(
          size,
          allAlternateSizes,
          seenAlternateSizes
        )

        addSize(
          size,
          allSizes,
          seenSizes
        )

      }

    }

    /*
     * Merge local technical tire requirements.
     */

    const technicalTireSizes =
      Array.isArray(
        technicalFitment?.tireSizes
      )
        ? technicalFitment.tireSizes
        : Array.isArray(
            technicalFitment?.tires
          )
          ? technicalFitment.tires
          : []

    for (
      const tire of technicalTireSizes
    ) {

      const size =
        typeof tire === 'string'
          ? tire
          : tire?.size ||
            tire?.tireSize ||
            tire

      addSize(
        size,
        allSizes,
        seenSizes
      )

    }

    const technicalOemSizes =
      Array.isArray(
        technicalFitment?.oemSizes
      )
        ? technicalFitment.oemSizes
        : []

    for (
      const size of technicalOemSizes
    ) {

      addSize(
        size,
        allOemSizes,
        seenOemSizes
      )

      addSize(
        size,
        allSizes,
        seenSizes
      )

    }

    const technicalAlternateSizes =
      Array.isArray(
        technicalFitment?.alternateSizes
      )
        ? technicalFitment.alternateSizes
        : Array.isArray(
            technicalFitment?.alternativeSizes
          )
          ? technicalFitment.alternativeSizes
          : []

    for (
      const size of technicalAlternateSizes
    ) {

      addSize(
        size,
        allAlternateSizes,
        seenAlternateSizes
      )

      addSize(
        size,
        allSizes,
        seenSizes
      )

    }

    /*
     * Technical battery requirements.
     */

    const batteries =
      Array.isArray(
        technicalFitment?.batteries
      )
        ? technicalFitment.batteries
        : []

    const batteryCapacities =
      Array.isArray(
        technicalFitment?.batteryCapacities
      )
        ? technicalFitment.batteryCapacities
        : batteries
            .map(
              battery =>
                battery?.capacity ??
                battery?.ah ??
                battery?.ampHours
            )
            .filter(
              value =>
                value !== null &&
                value !== undefined &&
                value !== ''
            )

    /*
     * Technical oil requirements.
     */

    const oils =
      Array.isArray(
        technicalFitment?.oils
      )
        ? technicalFitment.oils
        : []

    const oilViscosities =
      Array.isArray(
        technicalFitment?.oilViscosities
      )
        ? technicalFitment.oilViscosities
        : oils
            .map(
              oil =>
                oil?.viscosity ??
                oil?.grade
            )
            .filter(
              value =>
                value !== null &&
                value !== undefined &&
                value !== ''
            )

    const hasTechnicalData =
      allSizes.length > 0 ||
      batteries.length > 0 ||
      batteryCapacities.length > 0 ||
      oils.length > 0 ||
      oilViscosities.length > 0

    if (!hasTechnicalData) {

      console.log(
        '[VehicleSearchController] LOCAL VEHICLE FOUND BUT NO TECHNICAL FITMENT',
        {
          make,
          model,
          year
        }
      )

      return {
        found: true,
        vehicle: localVehicle,
        fitment: null
      }

    }

    const fitment = {

      ...(firstFitmentSource || {}),

      ...(technicalFitment || {}),

      sizes:
        allSizes,

      tireSizes:
        allSizes,

      oemSizes:
        allOemSizes,

      alternateSizes:
        allAlternateSizes,

      batteries,

      batteryCapacities,

      oils,

      oilViscosities,

      compatibilityResolved:
        Boolean(
          technicalFitment?.compatibilityResolved
        ),

      availabilityChecked:
        false,

      technicalSource:
        technicalFitment?.source ||
        'local-technical'

    }

    console.log(
      '[VehicleSearchController] LOCAL VEHICLE FITMENT READY',
      {
        source:
          fitment.technicalSource,

        tireSizes:
          fitment.sizes,

        batteryCapacities:
          fitment.batteryCapacities,

        oilViscosities:
          fitment.oilViscosities,

        compatibilityResolved:
          fitment.compatibilityResolved
      }
    )

    return {

      found:
        true,

      vehicle:
        localVehicle,

      fitment

    }

  } catch (error) {

    console.warn(
      '[VehicleSearchController] Local vehicle memory lookup failed:',
      error
    )

    return {

      found:
        false,

      vehicle:
        null,

      fitment:
        null

    }

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

    // --------------------------------------------------
    // LOCAL MEMORY FIRST
    // --------------------------------------------------

    const localResult =
      getLocalFitment({
        make,
        model,
        year
      })

    let fitment =
      localResult?.fitment ??
      null

    let fitmentSource =
      localResult?.found
        ? 'local'
        : null

    // --------------------------------------------------
    // VEHDB
    // --------------------------------------------------

    if (
      localResult?.found !== true
    ) {

      try {

        console.log(
          '[VehicleSearchController] LOCAL VEHICLE MISS â†’ VehDB'
        )

        fitment =
          await VehDBFitmentProvider.findTireFitment({
            make,
            model,
            year
          })

        if (
          fitment &&
          Array.isArray(
            fitment.sizes
          ) &&
          fitment.sizes.length > 0
        ) {

          fitmentSource =
            'vehdb'

        }
        else {

          fitment =
            null

        }

      }
      catch (
        error
      ) {

        console.warn(
          '[VehicleSearchController] VehDB fitment failed:',
          error
        )

        fitment =
          null
      }

    }
    else {

      console.log(
        '[VehicleSearchController] VEHDB NOT CALLED â€” LOCAL VEHICLE IS AUTHORITATIVE'
      )
    }

    // --------------------------------------------------
    // LOCAL / VEHDB FITMENT SUCCESS
    // --------------------------------------------------

    if (
      fitment &&
      Array.isArray(
        fitment.sizes
      ) &&
      fitment.sizes.length > 0
    ) {

      const tireProducts =
        products
          .filter(
            product =>
              normalizeProductType(
                product
              ) === 'tire'
          )

      // ------------------------------------------------
      // NO STOCK FILTER.
      //
      // Compatibility is independent from availability.
      // ------------------------------------------------

      const matchedTires =
        tireProducts
          .filter(
            product => {

              return fitment.sizes.some(
                size =>
                  tireMatchesVehDBSize(
                    product,
                    size
                  )
              )

            }
          )

      // ------------------------------------------------
      // PER-SIZE DIAGNOSTICS
      // ------------------------------------------------

      const matchDiagnostics =
        fitment.sizes.map(
          size => {

            const matches =
              tireProducts.filter(
                product =>
                  tireMatchesVehDBSize(
                    product,
                    size
                  )
              )

            return {

              size,

              matchedCount:
                matches.length,

              matchedProductIds:
                matches.map(
                  product =>
                    getProductId(
                      product
                    )
                ),

              matchedProducts:
                matches.map(
                  product => ({

                    id:
                      getProductId(
                        product
                      ),

                    name:
                      product?.name ||
                      product?.productName ||
                      '',

                    sizeValues:
                      getProductSizeValues(
                        product
                      ),

                    tireCandidates:
                      getTireSizeCandidates(
                        product
                      ),

                    parsedTireCandidates:
                      getParsedTireCandidates(
                        product
                      ),

                    extractedTire:
                      extractProductTire(
                        product
                      ),

                    quantity:
                      getWarehouseStockForProduct(
                        getProductId(
                          product
                        )
                      ).reduce(
                        (
                          total,
                          row
                        ) =>
                          total +
                          Number(
                            row?.quantity ??
                            row?.availableQuantity ??
                            0
                          ),
                        0
                      )

                  })
                )

            }

          }
        )

      console.log(
        '[VehicleSearchController] VEHICLE TIRE SIZE MATCH DIAGNOSTICS:',
        matchDiagnostics
      )

      const finalTireProducts =
        buildResults(
          matchedTires
        )

      // ------------------------------------------------
      // TECHNICAL BATTERY REQUIREMENTS
      //
      // These are compatibility requirements, NOT
      // warehouse products.
      // ------------------------------------------------

      const batteryValues =
        Array.isArray(
          fitment.batteryCapacities
        )
          ? fitment.batteryCapacities
          : Array.isArray(
              fitment.batteries
            )
            ? fitment.batteries
                .map(
                  battery =>
                    battery?.capacity ??
                    battery?.ah ??
                    battery?.ampHours ??
                    battery
                )
            : []

      const normalizedBatteryValues =
        [
          ...new Set(
            batteryValues
              .map(
                value =>
                  String(
                    value ?? ''
                  ).trim()
              )
              .filter(
                value =>
                  value !== ''
              )
          )
        ]

      const batteryResults =
        normalizedBatteryValues.map(
          (
            capacity,
            index
          ) => ({

            id:
              `technical-battery-${capacity}-${index}`,

            productId:
              null,

            name:
              `Battery ${capacity}Ah`,

            productName:
              `Battery ${capacity}Ah`,

            type:
              'battery',

            productType:
              'battery',

            category:
              'battery',

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

            batteryCapacity:
              capacity,

            capacity,

            available:
              false,

            inStock:
              false,

            quantity:
              0,

            price:
              null,

            salePrice:
              null,

            availabilityChecked:
              true,

            availabilitySource:
              'warehouse'

          })
        )

      // ------------------------------------------------
      // TECHNICAL OIL REQUIREMENTS
      //
      // These are compatibility requirements, NOT
      // warehouse products.
      // ------------------------------------------------

      const oilValues =
        Array.isArray(
          fitment.oilViscosities
        )
          ? fitment.oilViscosities
          : Array.isArray(
              fitment.oils
            )
            ? fitment.oils
                .map(
                  oil =>
                    oil?.viscosity ??
                    oil?.grade ??
                    oil
                )
            : []

      const normalizedOilValues =
        [
          ...new Set(
            oilValues
              .map(
                value =>
                  String(
                    value ?? ''
                  )
                    .trim()
                    .toUpperCase()
              )
              .filter(
                value =>
                  value !== ''
              )
          )
        ]

      const oilResults =
        normalizedOilValues.map(
          (
            viscosity,
            index
          ) => ({

            id:
              `technical-oil-${viscosity}-${index}`,

            productId:
              null,

            name:
              `Engine Oil ${viscosity}`,

            productName:
              `Engine Oil ${viscosity}`,

            type:
              'oil',

            productType:
              'oil',

            category:
              'oil',

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

            oilViscosity:
              viscosity,

            viscosity,

            available:
              false,

            inStock:
              false,

            quantity:
              0,

            price:
              null,

            salePrice:
              null,

            availabilityChecked:
              true,

            availabilitySource:
              'warehouse'

          })
        )

      const technicalResults = [
        ...batteryResults,
        ...oilResults
      ]

      const finalProducts = [
        ...finalTireProducts,
        ...technicalResults
      ]

      console.log(
        '[VehicleSearchController] VEHICLE FITMENT RESULTS:',
        {

          source:
            fitmentSource,

          fitmentSizes:
            fitment.sizes.length,

          fitmentSizeValues:
            fitment.sizes,

          catalogTires:
            tireProducts.length,

          matchedTires:
            finalTireProducts.length,

          batteryRequirements:
            batteryResults.length,

          batteryCapacities:
            normalizedBatteryValues,

          oilRequirements:
            oilResults.length,

          oilViscosities:
            normalizedOilValues,

          totalResults:
            finalProducts.length,

          matchedProductIds:
            finalTireProducts.map(
              product =>
                product?.id
            ),

          technicalBatteryIds:
            batteryResults.map(
              product =>
                product?.id
            ),

          technicalOilIds:
            oilResults.map(
              product =>
                product?.id
            ),

          availableMatchedProducts:
            finalTireProducts.filter(
              product =>
                product?.available === true
            ).length,

          unavailableMatchedProducts:
            finalTireProducts.filter(
              product =>
                product?.available !== true
            ).length

        }
      )

      return {

        vehicle: {

          vehicleType:
            vehicleType ??
            null,

          make:
            make ??
            null,

          model:
            model ??
            null,

          year:
            year ??
            null

        },

        source:
          fitmentSource,

        fitment,

        tireSizes:
          fitment.sizes,

        oemSizes:
          fitment.oemSizes ?? [],

        alternateSizes:
          fitment.alternateSizes ?? [],

        tires:
          finalTireProducts,

        batteries:
          batteryResults,

        oils:
          oilResults,

        products:
          finalProducts

      }

    }

    // --------------------------------------------------
    // LOCAL VEHICLE FOUND BUT NO FITMENT
    // --------------------------------------------------

    if (
      localResult?.found === true
    ) {

      console.log(
        '[VehicleSearchController] LOCAL VEHICLE FOUND â€” NO VEHDB FALLBACK',
        {
          make,
          model,
          year
        }
      )

      return {

        vehicle: {

          vehicleType:
            vehicleType ??
            null,

          make:
            localResult?.vehicle?.make ??
            localResult?.vehicle?.brand ??
            make ??
            null,

          model:
            localResult?.vehicle?.model ??
            localResult?.vehicle?.name ??
            model ??
            null,

          year:
            localResult?.vehicle?.year ??
            year ??
            null

        },

        source:
          'local',

        fitment:
          null,

        tireSizes:
          [],

        oemSizes:
          [],

        alternateSizes:
          [],

        tires:
          [],

        batteries:
          [],

        oils:
          [],

        products:
          []

      }
    }

    // --------------------------------------------------
    // FALLBACK TO EXISTING ENGINE
    // --------------------------------------------------

    try {

      const response =
        await VehicleEngine.search({

          vehicleType,

          make,

          model,

          year,

          products

        })

      const engineProducts =
        Array.isArray(
          response?.products
        )
          ? response.products
          : []

      const finalProducts =
        buildResults(
          engineProducts
        )

      return {

        ...response,

        source:
          response?.source ||
          'local',

        tires:
          buildResults(
            response?.tires ||
            []
          ),

        batteries:
          buildResults(
            response?.batteries ||
            []
          ),

        oils:
          buildResults(
            response?.oils ||
            []
          ),

        products:
          finalProducts

      }

    }
    catch (
      error
    ) {

      console.error(
        '[VehicleSearchController] Vehicle search failed:',
        error
      )

      return {

        vehicle: {

          vehicleType:
            vehicleType ??
            null,

          make:
            make ??
            null,

          model:
            model ??
            null,

          year:
            year ??
            null

        },

        source:
          'none',

        fitment:
          null,

        tireSizes:
          [],

        oemSizes:
          [],

        alternateSizes:
          [],

        tires:
          [],

        batteries:
          [],

        oils:
          [],

        products:
          []

      }
    }
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

    const matched =
      products
        .filter(
          product =>
            normalizeProductType(
              product
            ) === 'tire'
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

            if (
              format ===
              'two-part'
            ) {
              return true
            }

            return (

              tire.profile !== null &&

              requestedProfile !== null &&

              tire.profile ===
              requestedProfile

            )
          }
        )

    return buildResults(
      matched
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
      normalizeBatteryValue(
        capacity
      )

    if (
      !requestedCapacity
    ) {
      return []
    }

    const matched =
      products
        .filter(
          product =>
            normalizeProductType(
              product
            ) === 'battery'
        )
        .filter(
          product =>
            batteryMatches(
              product,
              requestedCapacity
            )
        )

    return buildResults(
      matched
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

    const requested =
      normalizeText(
        viscosity
      )

    if (
      !requested
    ) {
      return []
    }

    const matched =
      products
        .filter(
          product =>
            normalizeProductType(
              product
            ) === 'oil'
        )
        .filter(
          product => {

            const oil =
              getProductOil(
                product
              )

            const actual =
              normalizeText(

                oil?.viscosity ??
                oil?.grade ??
                oil?.oilGrade ??
                product?.viscosity ??
                product?.grade ??
                product?.oilGrade ??
                ''

              )

            return (

              actual ===
              requested ||

              actual.includes(
                requested
              ) ||

              requested.includes(
                actual
              )

            )
          }
        )

    return buildResults(
      matched
    )
  }
}


// ======================================================
// EXPORT
// ======================================================

export default VehicleSearchController


