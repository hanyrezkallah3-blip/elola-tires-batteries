// ======================================================
// EL OLA ERP
// VehDB Fitment Provider
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Resolve OEM and alternative tire fitment for a vehicle.
//
// FLOW
// ------------------------------------------------------
//
// Vehicle
//   ↓
// VehDBFitmentProvider
//   ↓
// OEM / Alternative Tire Sizes
//   ↓
// VehicleSpecificationProvider
//   ↓
// OEMCompatibilityEngine
//   ↓
// Product Matching
//
// IMPORTANT
// ------------------------------------------------------
//
// This provider:
// - DOES NOT read inventory
// - DOES NOT read product prices
// - DOES NOT decide product availability
// - DOES NOT create products
//
// It only resolves vehicle tire fitment.
//
// VehDB is optional.
// If VITE_VEHDB_API_KEY is missing, this provider
// safely returns null instead of fabricating data.
// ======================================================


// ======================================================
// CONSTANTS
// ======================================================

const BASE_URL =
  'https://api.vehdb.com/v1'


// ======================================================
// API KEY
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
// Use direct Vite env access.
// Do NOT use optional chaining here.
//
// Vite statically replaces:
//
// import.meta.env.VITE_VEHDB_API_KEY
//
// during the client build.
// ======================================================

const VEHDB_API_KEY =
  String(
    import.meta.env.VITE_VEHDB_API_KEY ?? ''
  ).trim()


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
// API KEY
// ======================================================

const getApiKey = () => {

  return VEHDB_API_KEY

}


// ======================================================
// SAFE REQUEST
// ======================================================

const requestJson = async (

  url

) => {

  const apiKey =
    getApiKey()


  // ====================================================
  // DIAGNOSTIC
  // ====================================================

  console.log(
    '[VehDB] API enabled:',
    Boolean(apiKey)
  )

  console.log(
    '[VehDB] API key length:',
    apiKey.length
  )


  if (!apiKey) {

    console.warn(
      '[VehDB] VITE_VEHDB_API_KEY is missing'
    )

    return null

  }


  console.log(
    '[VehDB] Request URL:',
    url
  )


  try {

    const response =
      await fetch(

        url,

        {

          method:
            'GET',

          headers: {

            Accept:
              'application/json',

            Authorization:
              `Bearer ${apiKey}`

          }

        }

      )


    // ==================================================
    // DIAGNOSTIC
    // ==================================================

    console.log(
      '[VehDB] HTTP status:',
      response.status,
      response.statusText
    )


    if (!response.ok) {

      console.warn(

        '[VehDB] HTTP request failed:',

        response.status,
        response.statusText

      )

      return null

    }


    const data =
      await response.json()


    // ==================================================
    // DIAGNOSTIC
    // ==================================================

    console.log(
      '[VehDB] Raw response:',
      data
    )


    return data

  }

  catch (error) {

    console.error(

      '[VehDB] Request failed:',

      error

    )

    return null

  }

}


// ======================================================
// COLLECT SIZE VALUES
// ======================================================

const collectSizes = value => {

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
      typeof item === 'string'
    ) {

      item
        .split(',')
        .forEach(
          part => {

            const size =
              String(part)
                .trim()

            if (size) {

              sizes.push(size)

            }

          }
        )

      return

    }


    if (
      typeof item === 'object'
    ) {

      Object.values(item)
        .forEach(add)

      return

    }


    sizes.push(
      String(item).trim()
    )

  }


  add(value)


  return sizes

}


// ======================================================
// DEDUPLICATE SIZES
// ======================================================

const uniqueSizes = sizes => {

  const seen =
    new Set()


  return sizes.filter(
    size => {

      const normalized =
        normalizeText(size)


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
// FIND DATA ARRAY
// ======================================================

const getDataArray = result => {

  if (
    Array.isArray(
      result?.data
    )
  ) {

    return result.data

  }


  if (
    Array.isArray(
      result?.results
    )
  ) {

    return result.results

  }


  if (
    Array.isArray(result)
  ) {

    return result

  }


  return []

}


// ======================================================
// NORMALIZE FITMENT RECORD
// ======================================================

const normalizeFitmentRecord = (

  item,

  vehicle

) => {

  if (
    !item ||
    typeof item !== 'object'
  ) {

    return null

  }


  const oemSizes =
    uniqueSizes(

      collectSizes(

        item?.tire_size_oem ??

        item?.oem_tire_size ??

        item?.oemSize ??

        item?.tireSizeOEM ??

        item?.tire_size

      )

    )


  const alternateSizes =
    uniqueSizes(

      collectSizes(

        item?.alternate_tire_sizes ??

        item?.alternateTireSizes ??

        item?.alternate_sizes ??

        item?.alternatives ??

        item?.alternate

      )

    )


  const allSizes =
    uniqueSizes([

      ...oemSizes,

      ...alternateSizes

    ])


  return {

    make:
      item?.make ??
      vehicle?.make ??
      null,

    brand:
      item?.make ??
      vehicle?.make ??
      null,

    model:
      item?.model ??
      vehicle?.model ??
      null,

    modelName:
      item?.model ??
      vehicle?.model ??
      null,

    year:
      item?.year ??
      vehicle?.year ??
      null,

    submodel:
      item?.submodel ??
      item?.trim ??
      item?.configuration ??
      null,

    oemSizes,

    alternateSizes,

    sizes:
      allSizes,

    raw:
      item

  }

}


// ======================================================
// PROVIDER
// ======================================================

export default class VehDBFitmentProvider {


  // ====================================================
  // ENABLED
  // ====================================================

  static isEnabled() {

    return Boolean(
      getApiKey()
    )

  }


  // ====================================================
  // FIND TIRE FITMENT
  // ====================================================

  static async findTireFitment({

    make,

    model,

    year

  } = {}) {

    console.log(
      '[VehDB] findTireFitment input:',
      {
        make,
        model,
        year
      }
    )


    if (
      !make ||
      !model
    ) {

      console.warn(
        '[VehDB] Missing make or model'
      )

      return null

    }


    if (
      !this.isEnabled()
    ) {

      console.warn(
        '[VehDB] Provider disabled because API key is missing'
      )

      return null

    }


    const params =
      new URLSearchParams()


    params.set(
      'make',
      String(make).trim()
    )


    params.set(
      'model',
      String(model).trim()
    )


    if (
      year
    ) {

      params.set(
        'year',
        String(year)
      )

    }


    const requestUrl =
      `${BASE_URL}/tire-sizes?${params.toString()}`


    console.log(
      '[VehDB] Tire fitment request:',
      requestUrl
    )


    const result =
      await requestJson(
        requestUrl
      )


    if (!result) {

      console.warn(
        '[VehDB] No response data'
      )

      return null

    }


    const records =
      getDataArray(result)


    // ==================================================
    // DIAGNOSTIC
    // ==================================================

    console.log(
      '[VehDB] Records count:',
      records.length
    )


    if (
      records.length === 0
    ) {

      console.warn(
        '[VehDB] Response contains no fitment records'
      )

      return null

    }


    const fitments =
      records

        .map(
          item =>
            normalizeFitmentRecord(

              item,

              {
                make,
                model,
                year
              }

            )
        )

        .filter(Boolean)


    console.log(
      '[VehDB] Normalized fitments:',
      fitments
    )


    if (
      fitments.length === 0
    ) {

      console.warn(
        '[VehDB] Could not normalize any fitment records'
      )

      return null

    }


    const oemSizes =
      uniqueSizes(

        fitments.flatMap(
          item =>
            item.oemSizes
        )

      )


    const alternateSizes =
      uniqueSizes(

        fitments.flatMap(
          item =>
            item.alternateSizes
        )

      )


    const sizes =
      uniqueSizes([

        ...oemSizes,

        ...alternateSizes

      ])


    // ==================================================
    // DIAGNOSTIC
    // ==================================================

    console.log(
      '[VehDB] OEM sizes:',
      oemSizes
    )

    console.log(
      '[VehDB] Alternate sizes:',
      alternateSizes
    )

    console.log(
      '[VehDB] Final sizes:',
      sizes
    )


    if (
      sizes.length === 0
    ) {

      console.warn(
        '[VehDB] Fitment records found but no tire sizes were extracted'
      )

      return null

    }


    const finalResult = {

      make,

      brand:
        make,

      model,

      modelName:
        model,

      year:
        year ?? null,

      oemSizes,

      alternateSizes,

      sizes,

      fitments,

      source:
        'vehdb',

      raw:
        result

    }


    // ==================================================
    // DIAGNOSTIC
    // ==================================================

    console.log(
      '[VehDB] FINAL FITMENT RESULT:',
      finalResult
    )


    return finalResult

  }


  // ====================================================
  // GET OEM SIZES
  // ====================================================

  static async getOEMSizes({

    make,

    model,

    year

  } = {}) {

    const result =
      await this.findTireFitment({

        make,

        model,

        year

      })


    return (

      result?.oemSizes ??

      []

    )

  }


  // ====================================================
  // GET ALTERNATIVE SIZES
  // ====================================================

  static async getAlternativeSizes({

    make,

    model,

    year

  } = {}) {

    const result =
      await this.findTireFitment({

        make,

        model,

        year

      })


    return (

      result?.alternateSizes ??

      []

    )

  }


  // ====================================================
  // GET COMPLETE FITMENT
  // ====================================================

  static async getSpecifications({

    make,

    model,

    year

  } = {}) {

    return this.findTireFitment({

      make,

      model,

      year

    })

  }

}