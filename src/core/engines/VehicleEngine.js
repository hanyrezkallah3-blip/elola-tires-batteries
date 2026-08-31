// ======================================================
// EL OLA ERP
// Vehicle Engine
//
// PURPOSE
// ------------------------------------------------------
// Vehicle search MUST determine compatibility from
// vehicle/OEM technical specifications.
//
// Product catalog is used ONLY to find the actual
// products matching those technical specifications.
//
// We DO NOT depend on:
// - product.compatibleVehicles
// - warehouse compatibility
// - manual product-to-vehicle links
// ======================================================

import VehicleProvider
  from '../vehicles/VehicleProvider'

import OEMCompatibilityEngine
  from './OEMCompatibilityEngine'


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')


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
        .replace(/ah$/i, '')
        .trim()

    )

  return Number.isFinite(number)

    ? number

    : null

}


// ======================================================
// TYPE
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
// PRODUCT TYPE
// ======================================================
//
// Firestore/product data may expose the type through
// more than one field.
//
// The canonical result is always:
// tire / battery / oil
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
// GET FIRST VALUE
// ======================================================

const firstValue = (

  object,

  keys

) => {

  if (
    !object ||
    typeof object !== 'object'
  ) {

    return null

  }

  for (
    const key of keys
  ) {

    const value =
      object?.[key]

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
// GET PRODUCT TIRE
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
// GET PRODUCT BATTERY
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
// GET PRODUCT OIL
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
// NORMALIZE TIRE SIZE TEXT
// ======================================================

const normalizeTireSize = value => {

  return normalizeText(value)

    .replace(/×/g, '/')

    .replace(/x/gi, '/')

    .replace(/[*\\]/g, '/')

    .replace(/-/g, '/')

    .replace(/r/gi, '/')

    .replace(/\s+/g, '')

}


// ======================================================
// PARSE TIRE SIZE
// ======================================================

const parseTireSize = value => {

  if (
    value === null ||
    value === undefined
  ) {

    return null

  }

  const input =
    normalizeTireSize(value)

  if (!input) {

    return null

  }


  const three =
    input.match(
      /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/
    )

  if (three) {

    return {

      width:
        numberValue(
          three[1]
        ),

      profile:
        numberValue(
          three[2]
        ),

      rim:
        numberValue(
          three[3]
        )

    }

  }


  const two =
    input.match(
      /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/
    )

  if (two) {

    return {

      width:
        numberValue(
          two[1]
        ),

      profile:
        null,

      rim:
        numberValue(
          two[2]
        )

    }

  }

  return null

}


// ======================================================
// EXTRACT TIRE SPECIFICATIONS
// ======================================================

const extractTireSpecifications = value => {

  if (!value) {

    return []

  }


  if (
    Array.isArray(value)
  ) {

    return value.flatMap(
      extractTireSpecifications
    )

  }


  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {

    const parsed =
      parseTireSize(value)

    return parsed
      ? [parsed]
      : []

  }


  if (
    typeof value !== 'object'
  ) {

    return []

  }


  const width =
    numberValue(
      firstValue(
        value,
        [
          'width',
          'sectionWidth',
          'tireWidth'
        ]
      )
    )


  const profile =
    numberValue(
      firstValue(
        value,
        [
          'profile',
          'height',
          'aspectRatio',
          'aspect'
        ]
      )
    )


  const rim =
    numberValue(
      firstValue(
        value,
        [
          'rim',
          'rimSize',
          'wheelDiameter',
          'diameter'
        ]
      )
    )


  if (
    width !== null &&
    rim !== null
  ) {

    return [
      {
        width,
        profile,
        rim
      }
    ]

  }


  const nestedValues = [

    value?.size,

    value?.tireSize,

    value?.dimension,

    value?.dimensions,

    value?.sizes,

    value?.tireSizes,

    value?.oemTire,

    value?.oemSizes,

    value?.optionalSizes,

    value?.alternativeSizes,

    value?.alternativeSize

  ]


  const nestedResults =
    nestedValues.flatMap(
      nested => {

        if (
          nested === undefined ||
          nested === null ||
          nested === value
        ) {

          return []

        }

        return extractTireSpecifications(
          nested
        )

      }
    )


  return nestedResults

}


// ======================================================
// TIRE MATCH
// ======================================================

const tireMatchesOEM = (

  product,

  oemTire

) => {

  const requested =
    extractTireSpecifications(
      oemTire
    )

  if (
    requested.length === 0
  ) {

    return false

  }


  const productTire =
    getProductTire(product)


  const productCandidates = [

    ...extractTireSpecifications(
      productTire
    ),

    ...extractTireSpecifications(
      product?.tireSize
    ),

    ...extractTireSpecifications(
      product?.size
    ),

    ...extractTireSpecifications(
      product?.dimension
    ),

    ...extractTireSpecifications(
      product?.dimensions
    ),

    ...extractTireSpecifications(
      product?.sizeCode
    ),

    ...extractTireSpecifications(
      product?.skuSize
    ),

    ...extractTireSpecifications(
      product?.name
    ),

    ...extractTireSpecifications(
      product?.productName
    )

  ]


  if (
    productCandidates.length === 0
  ) {

    return false

  }


  return requested.some(

    requestedSize =>

      productCandidates.some(

        productSize => {

          if (
            productSize.width === null ||
            productSize.rim === null
          ) {

            return false

          }


          if (
            productSize.width !==
            requestedSize.width
          ) {

            return false

          }


          if (
            productSize.rim !==
            requestedSize.rim
          ) {

            return false

          }


          if (
            requestedSize.profile !== null
          ) {

            if (
              productSize.profile === null
            ) {

              return false

            }

            if (
              productSize.profile !==
              requestedSize.profile
            ) {

              return false

            }

          }


          return true

        }

      )

  )

}


// ======================================================
// BATTERY CAPACITY
// ======================================================

const extractBatteryCapacity = value => {

  if (
    value === null ||
    value === undefined
  ) {

    return []

  }


  if (
    Array.isArray(value)
  ) {

    return value.flatMap(
      extractBatteryCapacity
    )

  }


  if (
    typeof value === 'object'
  ) {

    const nested =
      firstValue(
        value,
        [
          'capacity',
          'ampereHour',
          'ampHours',
          'ah',
          'capacityAh',
          'batteryCapacity'
        ]
      )


    if (
      nested !== null
    ) {

      return extractBatteryCapacity(
        nested
      )

    }


    return []

  }


  const text =
    String(value)
      .trim()


  const direct =
    numberValue(
      text
        .replace(
          /ah/gi,
          ''
        )
        .trim()
    )


  return direct !== null
    ? [direct]
    : []

}


// ======================================================
// BATTERY MATCH
// ======================================================

const batteryMatchesOEM = (

  product,

  oemBattery

) => {

  const wanted =
    extractBatteryCapacity(
      oemBattery
    )

  if (
    wanted.length === 0
  ) {

    return false

  }


  const productBattery =
    getProductBattery(product)


  const candidates = [

    ...extractBatteryCapacity(
      productBattery
    ),

    ...extractBatteryCapacity(
      product?.capacity
    ),

    ...extractBatteryCapacity(
      product?.ampereHour
    ),

    ...extractBatteryCapacity(
      product?.ampHours
    ),

    ...extractBatteryCapacity(
      product?.ah
    ),

    ...extractBatteryCapacity(
      product?.capacityAh
    ),

    ...extractBatteryCapacity(
      product?.batteryCapacity
    ),

    ...extractBatteryCapacity(
      product?.specifications?.capacity
    ),

    ...extractBatteryCapacity(
      product?.specifications?.ampereHour
    ),

    ...extractBatteryCapacity(
      product?.specifications?.ampHours
    ),

    ...extractBatteryCapacity(
      product?.specifications?.ah
    ),

    ...extractBatteryCapacity(
      product?.attributes?.capacity
    ),

    ...extractBatteryCapacity(
      product?.attributes?.ampereHour
    ),

    ...extractBatteryCapacity(
      product?.attributes?.ampHours
    ),

    ...extractBatteryCapacity(
      product?.attributes?.ah
    )

  ]


  if (
    candidates.length === 0
  ) {

    return false

  }


  return wanted.some(

    value =>

      candidates.some(

        candidate =>

          candidate === value

      )

  )

}


// ======================================================
// OIL VISCOSITY
// ======================================================

const extractOilViscosities = value => {

  if (
    value === null ||
    value === undefined
  ) {

    return []

  }


  if (
    Array.isArray(value)
  ) {

    return value.flatMap(
      extractOilViscosities
    )

  }


  if (
    typeof value === 'object'
  ) {

    const nested =
      firstValue(
        value,
        [
          'viscosity',
          'grade',
          'oilGrade',
          'viscosities',
          'grades',
          'oilViscosity'
        ]
      )


    if (
      nested !== null
    ) {

      return extractOilViscosities(
        nested
      )

    }


    return []

  }


  const normalized =
    normalizeText(value)
      .replace(/\s+/g, '')
      .replace(/×/g, 'x')


  if (!normalized) {

    return []

  }


  return [
    normalized
  ]

}


// ======================================================
// OIL MATCH
// ======================================================

const oilMatchesOEM = (

  product,

  oemOil

) => {

  const wanted =
    extractOilViscosities(
      oemOil
    )

  if (
    wanted.length === 0
  ) {

    return false

  }


  const productOil =
    getProductOil(product)


  const candidates = [

    ...extractOilViscosities(
      productOil
    ),

    ...extractOilViscosities(
      product?.viscosity
    ),

    ...extractOilViscosities(
      product?.grade
    ),

    ...extractOilViscosities(
      product?.oilGrade
    ),

    ...extractOilViscosities(
      product?.oilViscosity
    ),

    ...extractOilViscosities(
      product?.specifications?.viscosity
    ),

    ...extractOilViscosities(
      product?.specifications?.grade
    ),

    ...extractOilViscosities(
      product?.specifications?.oilGrade
    ),

    ...extractOilViscosities(
      product?.attributes?.viscosity
    ),

    ...extractOilViscosities(
      product?.attributes?.grade
    ),

    ...extractOilViscosities(
      product?.attributes?.oilGrade
    )

  ]


  if (
    candidates.length === 0
  ) {

    return false

  }


  return wanted.some(

    wantedValue =>

      candidates.some(

        candidate =>

          candidate === wantedValue ||

          candidate.includes(
            wantedValue
          ) ||

          wantedValue.includes(
            candidate
          )

      )

  )

}


// ======================================================
// OEM PRODUCT MATCH
// ======================================================

const matchProductAgainstOEM = ({

  product,

  type,

  oem

}) => {

  if (!product) {

    return false

  }


  const productType =
    getProductType(product)


  if (
    productType !== type
  ) {

    return false

  }


  if (
    type === 'tire'
  ) {

    return tireMatchesOEM(
      product,
      oem?.tire
    )

  }


  if (
    type === 'battery'
  ) {

    return batteryMatchesOEM(
      product,
      oem?.battery
    )

  }


  if (
    type === 'oil'
  ) {

    return oilMatchesOEM(
      product,
      oem?.oil
    )

  }


  return false

}


// ======================================================
// FILTER BY OEM
// ======================================================

const filterByOEM = ({

  products,

  type,

  oem

}) => {

  if (!oem) {

    return []

  }


  return (

    Array.isArray(products)
      ? products
      : []

  ).filter(

    product =>

      matchProductAgainstOEM({

        product,

        type,

        oem

      })

  )

}


// ======================================================
// ENRICH RESULT
// ======================================================

const enrichProduct = ({

  product,

  type,

  oem

}) => {

  const result = {

    ...product,

    compatibilitySource:
      'OEM / Vehicle Intelligence',

    compatibilityType:
      'vehicle',

    compatibilityVerified:
      true,

    recommendedForVehicle:
      true

  }


  if (
    type === 'tire'
  ) {

    result.vehicleCompatibility = {

      source:
        'OEM',

      specification:
        oem?.tire ?? null

    }

  }


  if (
    type === 'battery'
  ) {

    result.vehicleCompatibility = {

      source:
        'OEM',

      specification:
        oem?.battery ?? null

    }

  }


  if (
    type === 'oil'
  ) {

    result.vehicleCompatibility = {

      source:
        'OEM',

      specification:
        oem?.oil ?? null

    }

  }


  return result

}


// ======================================================
// VEHICLE ENGINE
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

    return await VehicleProvider.findVehicle({

      make,

      model,

      year

    })

  }


  // ====================================================
  // SEARCH VEHICLE
  // ====================================================

  static async search({

    vehicleType,

    make,

    model,

    year,

    products = []

  }) {

    const vehicle =

      await this.findVehicle({

        make,

        model,

        year

      })


    const oem =

      await OEMCompatibilityEngine.search({

        make,

        model,

        year

      })


    // ==================================================
    // SEARCH TIRES
    // ==================================================

    const tires =

      filterByOEM({

        products,

        type:
          'tire',

        oem

      }).map(

        product =>

          enrichProduct({

            product,

            type:
              'tire',

            oem

          })

      )


    // ==================================================
    // SEARCH BATTERIES
    // ==================================================

    const batteries =

      filterByOEM({

        products,

        type:
          'battery',

        oem

      }).map(

        product =>

          enrichProduct({

            product,

            type:
              'battery',

            oem

          })

      )


    // ==================================================
    // SEARCH OILS
    // ==================================================

    const oils =

      filterByOEM({

        products,

        type:
          'oil',

        oem

      }).map(

        product =>

          enrichProduct({

            product,

            type:
              'oil',

            oem

          })

      )


    // ==================================================
    // RETURN
    // ==================================================

    return {

      vehicle,

      vehicleType,

      make,

      model,

      year,

      oem,

      intelligence: {

        source:
          'OEM / Vehicle Intelligence',

        vehicleFound:
          Boolean(
            vehicle
          ),

        specificationsFound:
          Boolean(
            oem
          ),

        tireSpecification:
          oem?.tire ?? null,

        batterySpecification:
          oem?.battery ?? null,

        oilSpecification:
          oem?.oil ?? null

      },

      tires,

      batteries,

      oils,

      products: [

        ...tires,

        ...batteries,

        ...oils

      ]

    }

  }


  // ====================================================
  // FILTER TIRES
  // ====================================================

  static filterTires({

    products = [],

    oem

  }) {

    return filterByOEM({

      products,

      type:
        'tire',

      oem

    })

  }


  // ====================================================
  // FILTER BATTERIES
  // ====================================================

  static filterBatteries({

    products = [],

    oem

  }) {

    return filterByOEM({

      products,

      type:
        'battery',

      oem

    })

  }


  // ====================================================
  // FILTER OILS
  // ====================================================

  static filterOils({

    products = [],

    oem

  }) {

    return filterByOEM({

      products,

      type:
        'oil',

      oem

    })

  }


  // ====================================================
  // FILTER ALL
  // ====================================================

  static filterAll({

    products = [],

    oem

  }) {

    return [

      ...this.filterTires({

        products,

        oem

      }),

      ...this.filterBatteries({

        products,

        oem

      }),

      ...this.filterOils({

        products,

        oem

      })

    ]

  }

}


export default VehicleEngine