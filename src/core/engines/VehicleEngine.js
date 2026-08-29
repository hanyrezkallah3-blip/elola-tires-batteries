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
    .replace(/َ|ُ|ِ|ّ|ْ/g, '')


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

    product?.attributes?.oil ||

    {}

  )
}


// ======================================================
// NORMALIZE TIRE SIZE TEXT
// ======================================================

const normalizeTireSize = value => {

  return normalizeText(value)

    .replace(
      /×/g,
      '/'
    )

    .replace(
      /x/gi,
      '/'
    )

    .replace(
      /\*/g,
      '/'
    )

    .replace(
      /-/g,
      '/'
    )

    .replace(
      /\\/g,
      '/'
    )

    .replace(
      /\s+/g,
      ''
    )

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
    normalizeTireSize(
      value
    )

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
//
// Supports:
// 205/55/16
// 205*55*16
// 205-55-16
// { width, profile, rim }
// { sectionWidth, aspectRatio, rimSize }
// ======================================================

const extractTireSpecifications = value => {

  if (
    !value
  ) {
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
      parseTireSize(
        value
      )

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


  const nested =
    firstValue(
      value,
      [
        'size',
        'tireSize',
        'dimension',
        'dimensions',
        'sizes',
        'tireSizes',
        'oemTire'
      ]
    )


  if (
    nested &&
    nested !== value
  ) {

    return extractTireSpecifications(
      nested
    )

  }


  return []

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
    getProductTire(
      product
    )


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


          // If OEM specifies profile,
          // product must have same profile.

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
          'capacityAh'
        ]
      )


    if (
      nested !== null
    ) {

      return [
        numberValue(
          nested
        )
      ].filter(
        value =>
          value !== null
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
    getProductBattery(
      product
    )


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
      product?.ah
    ),

    ...extractBatteryCapacity(
      product?.specifications?.capacity
    ),

    ...extractBatteryCapacity(
      product?.attributes?.capacity
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
          'grades'
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
    normalizeText(
      value
    )
      .replace(
        /\s+/g,
        ''
      )


  if (
    !normalized
  ) {
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
    getProductOil(
      product
    )


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
      product?.specifications?.viscosity
    ),

    ...extractOilViscosities(
      product?.attributes?.viscosity
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

          candidate ===
          wantedValue

          ||

          candidate.includes(
            wantedValue
          )

          ||

          wantedValue.includes(
            candidate
          )

      )
  )

}


// ======================================================
// OEM PRODUCT MATCH
// ======================================================
//
// IMPORTANT:
//
// The vehicle compatibility decision comes from OEM
// specifications.
//
// product.compatibleVehicles is intentionally NOT used.
// warehouse data is intentionally NOT used.
// ======================================================

const matchProductAgainstOEM = ({
  product,
  type,
  oem
}) => {

  if (
    !product
  ) {
    return false
  }


  if (
    normalizeType(
      product?.type
    ) !== type
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

  if (
    !oem
  ) {
    return []
  }


  return (

    Array.isArray(
      products
    )
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

    result.vehicleCompatibility =
      {

        source:
          'OEM',

        specification:
          oem?.tire ?? null

      }

  }


  if (
    type === 'battery'
  ) {

    result.vehicleCompatibility =
      {

        source:
          'OEM',

        specification:
          oem?.battery ?? null

      }

  }


  if (
    type === 'oil'
  ) {

    result.vehicleCompatibility =
      {

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
  //
  // Flow:
  //
  // Vehicle selection
  //       ↓
  // Vehicle/OEM intelligence
  //       ↓
  // Tire specification
  // Battery specification
  // Oil specification
  //       ↓
  // Match actual catalog products
  //
  // NO warehouse compatibility lookup.
  // NO product.compatibleVehicles lookup.
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


    // --------------------------------------------------
    // SEARCH RESULTS
    // --------------------------------------------------

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


    // --------------------------------------------------
    // RETURN
    // --------------------------------------------------

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