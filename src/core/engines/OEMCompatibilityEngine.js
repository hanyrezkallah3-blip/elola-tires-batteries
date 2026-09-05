// ======================================================
// EL OLA ERP
// OEM Compatibility Engine
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Resolve technical OEM compatibility requirements
// for a selected vehicle.
//
// IMPORTANT
// ------------------------------------------------------
//
// This engine:
// - DOES NOT read inventory
// - DOES NOT read warehouse stock
// - DOES NOT read product availability
// - DOES NOT decide prices
//
// It only resolves technical vehicle requirements.
//
// ======================================================

import VehicleSpecificationProvider
  from '../vehicles/providers/VehicleSpecificationProvider'


// ======================================================
// COLLECT VALUES
// ======================================================

const collectValues = value => {

  const result = []


  const add = item => {

    if (
      item === null ||
      item === undefined ||
      item === ''
    ) {
      return
    }


    if (
      Array.isArray(item)
    ) {

      item.forEach(add)

      return

    }


    if (
      typeof item === 'object'
    ) {

      Object.values(item)
        .forEach(add)

      return

    }


    result.push(
      String(item).trim()
    )

  }


  add(value)


  return result.filter(Boolean)

}


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value => {

  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')

}


// ======================================================
// UNIQUE VALUES
// ======================================================

const uniqueValues = values => {

  const seen =
    new Set()


  return values.filter(
    value => {

      const normalized =
        normalizeText(value)


      if (!normalized) {
        return false
      }


      if (
        seen.has(normalized)
      ) {
        return false
      }


      seen.add(normalized)

      return true

    }
  )

}


// ======================================================
// FIRST VALUE
// ======================================================

const firstValue = value => {

  if (
    Array.isArray(value)
  ) {

    return value.length
      ? value[0]
      : null

  }


  return value ??
    null

}


// ======================================================
// FIND NESTED SPECIFICATION
// ======================================================

const findNestedSpecification = (
  source,
  keys = []
) => {

  if (
    !source ||
    typeof source !== 'object'
  ) {

    return null

  }


  // ====================================================
  // DIRECT KEYS FIRST
  // ====================================================

  for (
    const key of keys
  ) {

    if (
      source[key] !== undefined &&
      source[key] !== null
    ) {

      return source[key]

    }

  }


  // ====================================================
  // NESTED CONTAINERS
  // ====================================================

  const containers = [

    source.specifications,

    source.technicalSpecifications,

    source.technicalSpecification,

    source.technical,

    source.oem,

    source.oemSpecifications,

    source.fitment,

    source.fitments,

    source.compatibility,

    source.vehicle

  ]


  for (
    const container of containers
  ) {

    if (
      !container ||
      typeof container !== 'object'
    ) {

      continue

    }


    for (
      const key of keys
    ) {

      if (
        container[key] !== undefined &&
        container[key] !== null
      ) {

        return container[key]

      }

    }

  }


  return null

}


// ======================================================
// TIRE SIZE EXTRACTION
// ======================================================
//
// Extract actual tire-size strings from arbitrary
// VehDB / OEM structures.
//
// This is intentionally separate from collectValues()
// because fitment records are objects and must be
// inspected by field name rather than converted blindly.
// ======================================================

const collectTireSizes = value => {

  const sizes = []


  const add = item => {

    if (
      item === null ||
      item === undefined ||
      item === ''
    ) {

      return

    }


    if (
      Array.isArray(item)
    ) {

      item.forEach(add)

      return

    }


    if (
      typeof item === 'string' ||
      typeof item === 'number'
    ) {

      const text =
        String(item).trim()


      if (text) {

        text
          .split(',')
          .forEach(
            part => {

              const normalized =
                String(part).trim()


              if (normalized) {

                sizes.push(
                  normalized
                )

              }

            }
          )

      }

      return

    }


    if (
      typeof item !== 'object'
    ) {

      return

    }


    // ==================================================
    // KNOWN TIRE SIZE FIELDS
    // ==================================================

    const fields = [

      item.oemSizes,
      item.oemSize,
      item.oem_tire_size,
      item.oemTireSize,
      item.oemTireSizes,

      item.tire_size_oem,
      item.tireSizeOEM,

      item.alternateSizes,
      item.alternateSize,
      item.alternate_tire_sizes,
      item.alternateTireSizes,
      item.alternate_sizes,

      item.alternatives,
      item.alternate,

      item.sizes,
      item.tireSizes,
      item.compatibleSizes,
      item.compatibleTireSizes,

      item.size,
      item.tireSize,
      item.tire_size,

      item.tire,

      item.frontTireSize,
      item.rearTireSize,

      item.frontTire,
      item.rearTire

    ]


    fields.forEach(add)

  }


  add(value)


  return uniqueValues(
    sizes
  )

}


// ======================================================
// NORMALIZE TIRE
// ======================================================

const normalizeTire = specs => {

  if (
    !specs
  ) {

    return {

      width: null,
      profile: null,
      rim: null,

      size: null,

      oemSizes: [],
      alternativeSizes: [],
      alternateSizes: [],

      sizes: [],
      compatibleSizes: []

    }

  }


  // ====================================================
  // COLLECT ALL RAW VALUES
  // ====================================================

  const allSizes =
    collectTireSizes(
      specs
    )


  // ====================================================
  // OEM SIZES
  // ====================================================

  const oemSizes =
    uniqueValues([

      ...collectTireSizes(
        specs?.oemSizes
      ),

      ...collectTireSizes(
        specs?.oemSize
      ),

      ...collectTireSizes(
        specs?.oem_tire_size
      ),

      ...collectTireSizes(
        specs?.oemTireSize
      ),

      ...collectTireSizes(
        specs?.oemTireSizes
      ),

      ...collectTireSizes(
        specs?.tire_size_oem
      ),

      ...collectTireSizes(
        specs?.tireSizeOEM
      )

    ])


  // ====================================================
  // ALTERNATIVE SIZES
  // ====================================================

  const alternativeSizes =
    uniqueValues([

      ...collectTireSizes(
        specs?.alternativeSizes
      ),

      ...collectTireSizes(
        specs?.alternateSizes
      ),

      ...collectTireSizes(
        specs?.alternateTireSizes
      ),

      ...collectTireSizes(
        specs?.alternate_tire_sizes
      ),

      ...collectTireSizes(
        specs?.alternate_sizes
      ),

      ...collectTireSizes(
        specs?.alternatives
      ),

      ...collectTireSizes(
        specs?.alternate
      )

    ])


  // ====================================================
  // DIRECT SIZE COLLECTION
  // ====================================================

  const directSizes =
    uniqueValues([

      ...collectTireSizes(
        specs?.sizes
      ),

      ...collectTireSizes(
        specs?.tireSizes
      ),

      ...collectTireSizes(
        specs?.compatibleSizes
      ),

      ...collectTireSizes(
        specs?.compatibleTireSizes
      ),

      ...collectTireSizes(
        specs?.size
      ),

      ...collectTireSizes(
        specs?.tireSize
      ),

      ...collectTireSizes(
        specs?.tire_size
      )

    ])


  // ====================================================
  // DIMENSIONS
  // ====================================================

  const width =
    firstValue(
      specs?.width ??
      specs?.tireWidth
    )


  const profile =
    firstValue(
      specs?.profile ??
      specs?.aspectRatio ??
      specs?.tireProfile
    )


  const rim =
    firstValue(
      specs?.rim ??
      specs?.rimSize ??
      specs?.wheelSize
    )


  const dimensionSize = [

    width,
    profile,
    rim

  ].every(
    value =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
  )

    ? `${width}/${profile}/${rim}`

    : null


  const size =
    firstValue(
      specs?.size ??
      specs?.tireSize ??
      specs?.tire_size ??
      dimensionSize
    )


  // ====================================================
  // COMPATIBLE SIZES
  // ====================================================

  const compatibleSizes =
    uniqueValues([

      ...oemSizes,

      ...alternativeSizes,

      ...directSizes,

      ...allSizes,

      ...(size
        ? [size]
        : []),

      ...(dimensionSize
        ? [dimensionSize]
        : [])

    ])


  return {

    width:
      width ?? null,

    profile:
      profile ?? null,

    rim:
      rim ?? null,

    size:
      size ?? null,

    oemSizes,

    alternativeSizes,

    alternateSizes:
      alternativeSizes,

    sizes:
      compatibleSizes,

    compatibleSizes

  }

}


// ======================================================
// NORMALIZE BATTERY
// ======================================================

const normalizeBattery = specs => {

  if (
    !specs
  ) {

    return {

      capacity: null,
      capacities: [],
      values: []

    }

  }


  const capacities =
    uniqueValues(

      collectValues([

        specs.capacity,
        specs.batteryCapacity,

        specs.ah,
        specs.ampHour,

        specs.ampHours,

        specs.capacities,

        specs.batteryCapacities

      ])

    )


  return {

    capacity:
      firstValue(
        capacities
      ),

    capacities,

    values:
      capacities

  }

}


// ======================================================
// NORMALIZE OIL
// ======================================================

const normalizeOil = specs => {

  if (
    !specs
  ) {

    return {

      viscosity: null,
      viscosities: [],
      grades: [],
      values: []

    }

  }


  const viscosities =
    uniqueValues(

      collectValues([

        specs.viscosity,

        specs.viscosities,

        specs.oilViscosity,

        specs.oilViscosities,

        specs.grade,

        specs.grades,

        specs.oilGrade,

        specs.oilGrades

      ])

    )


  return {

    viscosity:
      firstValue(
        viscosities
      ),

    viscosities,

    grades:
      viscosities,

    values:
      viscosities

  }

}


// ======================================================
// RESOLVE TIRE
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
//
// Never return early merely because fitment data exists.
//
// VehDB may provide:
//
//   oemSizes
//   alternateSizes
//   sizes
//   fitments
//
// All of them must participate in the final
// compatibility set.
// ======================================================

const resolveTire = specs => {

  if (
    !specs
  ) {

    return normalizeTire(
      null
    )

  }


  // ====================================================
  // DIRECT VEHDB VALUES
  // ====================================================

  const directOEM =
    uniqueValues([

      ...collectTireSizes(
        specs.oemSizes
      ),

      ...collectTireSizes(
        specs.oemSize
      ),

      ...collectTireSizes(
        specs.oemTireSizes
      ),

      ...collectTireSizes(
        specs.oemTireSize
      ),

      ...collectTireSizes(
        specs.oem_tire_size
      ),

      ...collectTireSizes(
        specs.tire_size_oem
      ),

      ...collectTireSizes(
        specs.tireSizeOEM
      )

    ])


  const directAlternative =
    uniqueValues([

      ...collectTireSizes(
        specs.alternateSizes
      ),

      ...collectTireSizes(
        specs.alternativeSizes
      ),

      ...collectTireSizes(
        specs.alternateTireSizes
      ),

      ...collectTireSizes(
        specs.alternate_tire_sizes
      ),

      ...collectTireSizes(
        specs.alternate_sizes
      ),

      ...collectTireSizes(
        specs.alternatives
      ),

      ...collectTireSizes(
        specs.alternate
      )

    ])


  const directSizes =
    uniqueValues([

      ...collectTireSizes(
        specs.sizes
      ),

      ...collectTireSizes(
        specs.tireSizes
      ),

      ...collectTireSizes(
        specs.compatibleSizes
      ),

      ...collectTireSizes(
        specs.compatibleTireSizes
      )

    ])


  // ====================================================
  // FITMENT RECORDS
  // ====================================================

  const fitmentSource =
    specs.fitments ??
    specs.fitment ??
    null


  const fitmentRecords =
    Array.isArray(
      fitmentSource
    )

      ? fitmentSource

      : fitmentSource
        ? [fitmentSource]
        : []


  const fitmentOEM =
    uniqueValues(

      fitmentRecords.flatMap(
        record => [

          ...collectTireSizes(
            record?.oemSizes
          ),

          ...collectTireSizes(
            record?.oemSize
          ),

          ...collectTireSizes(
            record?.oem_tire_size
          ),

          ...collectTireSizes(
            record?.oemTireSize
          ),

          ...collectTireSizes(
            record?.oemTireSizes
          ),

          ...collectTireSizes(
            record?.tire_size_oem
          ),

          ...collectTireSizes(
            record?.tireSizeOEM
          )

        ]
      )

    )


  const fitmentAlternative =
    uniqueValues(

      fitmentRecords.flatMap(
        record => [

          ...collectTireSizes(
            record?.alternateSizes
          ),

          ...collectTireSizes(
            record?.alternativeSizes
          ),

          ...collectTireSizes(
            record?.alternateTireSizes
          ),

          ...collectTireSizes(
            record?.alternate_tire_sizes
          ),

          ...collectTireSizes(
            record?.alternate_sizes
          ),

          ...collectTireSizes(
            record?.alternatives
          ),

          ...collectTireSizes(
            record?.alternate
          )

        ]
      )

    )


  const fitmentSizes =
    uniqueValues(

      fitmentRecords.flatMap(
        record => [

          ...collectTireSizes(
            record?.sizes
          ),

          ...collectTireSizes(
            record?.tireSizes
          ),

          ...collectTireSizes(
            record?.compatibleSizes
          ),

          ...collectTireSizes(
            record?.compatibleTireSizes
          ),

          ...collectTireSizes(
            record?.size
          ),

          ...collectTireSizes(
            record?.tireSize
          ),

          ...collectTireSizes(
            record?.tire_size
          )

        ]
      )

    )


  // ====================================================
  // NESTED TIRE SPECIFICATION
  // ====================================================

  const nestedTire =
    findNestedSpecification(

      specs,

      [

        'tire',
        'tires',

        'tireSpecification',
        'tireSpecifications',

        'oemTire',
        'oemTires',

        'tireSize',
        'tireSizes'

      ]

    )


  const nested =
    nestedTire &&
    nestedTire !== fitmentSource

      ? normalizeTire(
          nestedTire
        )

      : {

          width: null,
          profile: null,
          rim: null,

          size: null,

          oemSizes: [],
          alternativeSizes: [],
          alternateSizes: [],

          sizes: [],
          compatibleSizes: []

        }


  // ====================================================
  // FINAL OEM SIZES
  // ====================================================

  const oemSizes =
    uniqueValues([

      ...directOEM,

      ...fitmentOEM,

      ...nested.oemSizes

    ])


  // ====================================================
  // FINAL ALTERNATIVE SIZES
  // ====================================================

  const alternativeSizes =
    uniqueValues([

      ...directAlternative,

      ...fitmentAlternative,

      ...nested.alternativeSizes,

      ...nested.alternateSizes

    ])


  // ====================================================
  // FINAL COMPATIBLE SIZES
  // ====================================================

  const compatibleSizes =
    uniqueValues([

      ...oemSizes,

      ...alternativeSizes,

      ...directSizes,

      ...fitmentSizes,

      ...nested.sizes,

      ...nested.compatibleSizes

    ])


  // ====================================================
  // DIMENSIONS
  // ====================================================

  const width =
    nested.width ??
    firstValue(
      specs.width ??
      specs.tireWidth
    )


  const profile =
    nested.profile ??
    firstValue(
      specs.profile ??
      specs.aspectRatio ??
      specs.tireProfile
    )


  const rim =
    nested.rim ??
    firstValue(
      specs.rim ??
      specs.rimSize ??
      specs.wheelSize
    )


  const dimensionSize = [

    width,
    profile,
    rim

  ].every(
    value =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
  )

    ? `${width}/${profile}/${rim}`

    : null


  const size =
    nested.size ??
    firstValue(
      compatibleSizes
    ) ??
    dimensionSize ??
    null


  const finalSizes =
    uniqueValues([

      ...compatibleSizes,

      ...(dimensionSize
        ? [dimensionSize]
        : [])

    ])


  const result = {

    width:
      width ?? null,

    profile:
      profile ?? null,

    rim:
      rim ?? null,

    size,

    oemSizes,

    alternativeSizes,

    alternateSizes:
      alternativeSizes,

    sizes:
      finalSizes,

    compatibleSizes:
      finalSizes

  }


  console.log(
    '[OEMCompatibilityEngine] Resolved tire:',
    {
      oemSizes:
        result.oemSizes,

      alternativeSizes:
        result.alternativeSizes,

      compatibleSizes:
        result.compatibleSizes,

      fitmentRecords:
        fitmentRecords.length
    }
  )


  return result

}


// ======================================================
// RESOLVE BATTERY
// ======================================================

const resolveBattery = specs => {

  const value =
    findNestedSpecification(

      specs,

      [

        'battery',
        'batteries',
        'batterySpecification',
        'batterySpecifications',
        'batteryCapacity',
        'capacity',
        'capacities'

      ]

    )


  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {

    return normalizeBattery(
      value
    )

  }


  return normalizeBattery({

    capacity:
      value

  })

}


// ======================================================
// RESOLVE OIL
// ======================================================

const resolveOil = specs => {

  const value =
    findNestedSpecification(

      specs,

      [

        'oil',
        'oils',
        'oilSpecification',
        'oilSpecifications',
        'viscosity',
        'viscosities',
        'oilViscosity',
        'grade',
        'grades'

      ]

    )


  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {

    return normalizeOil(
      value
    )

  }


  return normalizeOil({

    viscosity:
      value

  })

}


// ======================================================
// BUILD RESULT
// ======================================================

const buildResult = (
  specs,
  context = {}
) => {

  const tire =
    resolveTire(
      specs
    )


  const battery =
    resolveBattery(
      specs
    )


  const oil =
    resolveOil(
      specs
    )


  const result = {

    make:
      specs?.make ??
      specs?.brand ??
      context.make ??
      null,

    brand:
      specs?.brand ??
      specs?.make ??
      context.make ??
      null,

    model:
      specs?.model ??
      specs?.modelName ??
      context.model ??
      null,

    modelName:
      specs?.modelName ??
      specs?.model ??
      context.model ??
      null,

    year:
      specs?.year ??
      context.year ??
      null,

    vehicleType:
      specs?.vehicleType ??
      context.vehicleType ??
      null,

    vehicle:
      specs?.vehicle ??
      null,

    tire,

    oemSizes:
      tire.oemSizes,

    alternativeSizes:
      tire.alternativeSizes,

    alternateSizes:
      tire.alternateSizes,

    compatibleSizes:
      tire.compatibleSizes,

    compatibleTireSizes:
      tire.compatibleSizes,

    battery,

    oil,

    compatibilityResolved:
      Boolean(
        tire.compatibleSizes.length ||
        battery.values.length ||
        oil.values.length
      ),

    availabilityChecked:
      false,

    source:
      specs?.source ??
      'unknown',

    raw:
      specs

  }


  console.log(
    '[OEMCompatibilityEngine] Final OEM result:',
    result
  )


  return result

}


// ======================================================
// ENGINE
// ======================================================

export default class OEMCompatibilityEngine {


  // ====================================================
  // SEARCH
  // ====================================================

  static async search({

    make,

    model,

    year,

    vehicleType

  } = {}) {

    if (
      !make ||
      !model
    ) {

      console.warn(
        '[OEMCompatibilityEngine] Missing make/model:',
        {
          make,
          model,
          year,
          vehicleType
        }
      )

      return null

    }


    try {

      console.log(
        '[OEMCompatibilityEngine] Searching specifications:',
        {
          make,
          model,
          year,
          vehicleType
        }
      )


      const specifications =
        await VehicleSpecificationProvider
          .getSpecifications({

            make,
            model,
            year,
            vehicleType

          })


      if (
        !specifications
      ) {

        console.warn(
          '[OEMCompatibilityEngine] No specifications returned.'
        )

        return null

      }


      return buildResult(
        specifications,
        {
          make,
          model,
          year,
          vehicleType
        }
      )

    }

    catch (error) {

      console.error(
        '[OEMCompatibilityEngine] Search failed:',
        error
      )

      return null

    }

  }


  // ====================================================
  // GET TIRE SPECIFICATION
  // ====================================================

  static async getTireSpecification(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.tire ??
      null
    )

  }


  // ====================================================
  // GET BATTERY SPECIFICATION
  // ====================================================

  static async getBatterySpecification(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.battery ??
      null
    )

  }


  // ====================================================
  // GET OIL SPECIFICATION
  // ====================================================

  static async getOilSpecification(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.oil ??
      null
    )

  }


  // ====================================================
  // GET OEM SIZES
  // ====================================================

  static async getOEMSizes(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.oemSizes ??
      []
    )

  }


  // ====================================================
  // GET ALTERNATIVE SIZES
  // ====================================================

  static async getAlternativeSizes(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.alternativeSizes ??
      []
    )

  }


  // ====================================================
  // GET COMPATIBLE TIRE SIZES
  // ====================================================

  static async getCompatibleTireSizes(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.compatibleTireSizes ??
      []
    )

  }


  // ====================================================
  // GET BATTERY
  // ====================================================

  static async getBattery(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.battery ??
      null
    )

  }


  // ====================================================
  // GET OIL
  // ====================================================

  static async getOil(
    context = {}
  ) {

    const result =
      await this.search(
        context
      )


    return (
      result?.oil ??
      null
    )

  }


  // ====================================================
  // RESOLVE
  // ====================================================

  static async resolve(
    context = {}
  ) {

    return this.search(
      context
    )

  }

}