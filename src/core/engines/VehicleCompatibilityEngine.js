// ======================================================
// EL OLA ERP
// Vehicle Compatibility Engine
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Central engine for explicit product ↔ vehicle
// compatibility.
//
// IMPORTANT
// ------------------------------------------------------
//
// This engine checks technical vehicle compatibility only.
//
// It does NOT check:
// - inventory
// - stock
// - warehouse availability
// - price
//
// A compatible product remains compatible even when it
// is not currently available in Elola.
//
// ======================================================


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
    .replace(
      /[\u064B-\u065F\u0670]/g,
      ''
    )
    .replace(/\s+/g, ' ')

}


// ======================================================
// COMPACT TEXT
// ======================================================

const compactText = value => {

  return normalizeText(
    value
  )
    .replace(
      /[\s_\-\/\\*×x]/gi,
      ''
    )

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
// GENERIC VALUE MATCH
// ======================================================

const valuesMatch = (
  actual,
  wanted
) => {

  const left =
    compactText(
      actual
    )


  const right =
    compactText(
      wanted
    )


  if (
    !left ||
    !right
  ) {

    return false

  }


  return (

    left === right ||

    left.includes(
      right
    ) ||

    right.includes(
      left
    )

  )

}


// ======================================================
// COLLECT COMPATIBILITY VALUES
// ======================================================
//
// Supports all compatibility structures used by Elola.
//
// ======================================================

const collectCompatibilityValues = product => {

  const values = []


  const add = value => {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {

      return

    }


    if (
      Array.isArray(value)
    ) {

      value.forEach(
        add
      )

      return

    }


    if (
      typeof value === 'object'
    ) {

      values.push(
        value
      )

      return

    }


    values.push(
      String(value)
    )

  }


  // ----------------------------------------------------
  // ROOT
  // ----------------------------------------------------

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


  // ----------------------------------------------------
  // COMPATIBILITY
  // ----------------------------------------------------

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


  // ----------------------------------------------------
  // SPECIFICATIONS
  // ----------------------------------------------------

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


  // ----------------------------------------------------
  // ATTRIBUTES
  // ----------------------------------------------------

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


  return values

}


// ======================================================
// VEHICLE STRING MATCH
// ======================================================

const vehicleStringMatches = (
  value,
  {
    make,
    model,
    year,
    vehicleType
  }
) => {

  const text =
    compactText(
      value
    )


  if (
    !text
  ) {

    return false

  }


  const requested = [

    vehicleType,

    make,

    model

  ]
    .filter(
      value =>
        value !== null &&
        value !== undefined &&
        value !== ''
    )
    .map(
      compactText
    )
    .filter(Boolean)


  if (
    requested.length === 0
  ) {

    return false

  }


  // ----------------------------------------------------
  // MAKE / MODEL / TYPE
  // ----------------------------------------------------

  const basicMatch =
    requested.every(
      item =>
        text.includes(
          item
        )
    )


  if (
    !basicMatch
  ) {

    return false

  }


  // ----------------------------------------------------
  // YEAR
  // ----------------------------------------------------

  if (
    year !== null &&
    year !== undefined &&
    year !== ''
  ) {

    const requestedYear =
      compactText(
        year
      )


    if (
      requestedYear &&
      !text.includes(
        requestedYear
      )
    ) {

      // A string compatibility value may describe a
      // range, therefore do not reject it solely because
      // the exact year is absent.
      //
      // Examples:
      // 2018-2022
      // 2018/2022
      // 2018 to 2022

      const yearNumber =
        numberValue(
          year
        )


      const range =
        String(
          value ?? ''
        ).match(
          /(\d{4})\s*[-\/]\s*(\d{4})/
        )


      if (
        yearNumber !== null &&
        range
      ) {

        const from =
          Number(
            range[1]
          )


        const to =
          Number(
            range[2]
          )


        if (
          yearNumber >= from &&
          yearNumber <= to
        ) {

          return true

        }

      }


      return false

    }

  }


  return true

}


// ======================================================
// VEHICLE OBJECT MATCH
// ======================================================

const vehicleObjectMatches = (
  vehicle,
  {
    make,
    model,
    year,
    vehicleType
  }
) => {

  if (
    !vehicle ||
    typeof vehicle !== 'object'
  ) {

    return false

  }


  // ----------------------------------------------------
  // TYPE
  // ----------------------------------------------------

  const vehicleTypeValue =

    vehicle?.vehicleType ??
    vehicle?.type ??
    vehicle?.category ??
    vehicle?.vehicleCategory ??
    ''


  if (
    vehicleType &&
    vehicleTypeValue
  ) {

    if (
      !valuesMatch(
        vehicleTypeValue,
        vehicleType
      )
    ) {

      return false

    }

  }


  // ----------------------------------------------------
  // MAKE / BRAND
  // ----------------------------------------------------

  const vehicleBrand =

    vehicle?.brand ??
    vehicle?.make ??
    vehicle?.manufacturer ??
    vehicle?.manufacturerName ??
    ''


  if (
    make &&
    vehicleBrand
  ) {

    if (
      !valuesMatch(
        vehicleBrand,
        make
      )
    ) {

      return false

    }

  }


  // ----------------------------------------------------
  // MODEL
  // ----------------------------------------------------

  const vehicleModel =

    vehicle?.model ??
    vehicle?.modelName ??
    vehicle?.vehicleModel ??
    ''


  if (
    model &&
    vehicleModel
  ) {

    if (
      !valuesMatch(
        vehicleModel,
        model
      )
    ) {

      return false

    }

  }


  // ----------------------------------------------------
  // YEAR
  // ----------------------------------------------------

  return matchYear({

    vehicle,

    year

  })

}


// ======================================================
// YEAR MATCH
// ======================================================

const matchYear = ({
  vehicle,
  year
}) => {

  if (
    year === null ||
    year === undefined ||
    year === ''
  ) {

    return true

  }


  const requestedYear =
    numberValue(
      year
    )


  if (
    requestedYear === null
  ) {

    return true

  }


  // ----------------------------------------------------
  // EXACT YEAR FIELDS
  // ----------------------------------------------------

  const exactYear =

    vehicle?.year ??
    vehicle?.modelYear ??
    vehicle?.vehicleYear


  if (
    exactYear !== null &&
    exactYear !== undefined &&
    exactYear !== ''
  ) {

    const exact =
      numberValue(
        exactYear
      )


    if (
      exact !== null
    ) {

      return (
        requestedYear ===
        exact
      )

    }

  }


  // ----------------------------------------------------
  // YEAR FROM / TO
  // ----------------------------------------------------

  const fromValue =

    vehicle?.yearFrom ??
    vehicle?.from ??
    vehicle?.startYear ??
    vehicle?.minYear


  const toValue =

    vehicle?.yearTo ??
    vehicle?.to ??
    vehicle?.endYear ??
    vehicle?.maxYear


  const from =
    numberValue(
      fromValue
    )


  const to =
    numberValue(
      toValue
    )


  if (
    from !== null ||
    to !== null
  ) {

    const minimum =
      from !== null
        ? from
        : requestedYear


    const maximum =
      to !== null
        ? to
        : requestedYear


    return (

      requestedYear >=
      minimum &&

      requestedYear <=
      maximum

    )

  }


  // ----------------------------------------------------
  // YEAR ARRAY
  // ----------------------------------------------------

  const years = [

    vehicle?.years,

    vehicle?.modelYears,

    vehicle?.supportedYears

  ]


  for (
    const value of years
  ) {

    if (
      !Array.isArray(value)
    ) {

      continue

    }


    const found =
      value.some(
        item =>
          numberValue(
            item
          ) ===
          requestedYear
      )


    if (
      found
    ) {

      return true

    }

  }


  // ----------------------------------------------------
  // NO YEAR INFORMATION
  // ----------------------------------------------------
  //
  // If the compatibility record contains make/model but
  // no year restriction, it remains compatible.
  //
  // ----------------------------------------------------

  return true

}


// ======================================================
// VEHICLE OBJECT / STRING MATCH
// ======================================================

const compatibilityValueMatches = (
  value,
  params
) => {

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {

    return vehicleStringMatches(
      value,
      params
    )

  }


  if (
    typeof value === 'object' &&
    value !== null
  ) {

    return vehicleObjectMatches(
      value,
      params
    )

  }


  return false

}


// ======================================================
// MATCH VEHICLE
// ======================================================

export class VehicleCompatibilityEngine {


  static matchVehicle({

    product,

    make,

    model,

    year,

    vehicleType

  }) {

    if (
      !product
    ) {

      return false

    }


    // --------------------------------------------------
    // COLLECT ALL COMPATIBILITY DATA
    // --------------------------------------------------

    const vehicles =
      collectCompatibilityValues(
        product
      )


    if (
      vehicles.length === 0
    ) {

      return false

    }


    // --------------------------------------------------
    // TEST EVERY COMPATIBILITY RECORD
    // --------------------------------------------------

    return vehicles.some(
      vehicle =>
        compatibilityValueMatches(
          vehicle,
          {
            make,
            model,
            year,
            vehicleType
          }
        )
    )

  }


  // ====================================================
  // FILTER PRODUCTS
  // ====================================================

  static filterProducts({

    products = [],

    type,

    make,

    model,

    year,

    vehicleType

  }) {

    const safeProducts =

      Array.isArray(
        products
      )

        ? products

        : []


    return safeProducts.filter(
      product => {

        if (
          type
        ) {

          const productType =
            normalizeText(
              product?.type ??
              product?.productType ??
              product?.category ??
              product?.categoryType ??
              product?.itemType ??
              product?.kind ??
              product?.productCategory ??
              ''
            )


          const wantedType =
            normalizeText(
              type
            )


          if (
            productType !==
            wantedType
          ) {

            return false

          }

        }


        return this.matchVehicle({

          product,

          make,

          model,

          year,

          vehicleType

        })

      }
    )

  }

}


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default VehicleCompatibilityEngine