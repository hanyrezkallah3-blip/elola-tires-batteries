import BaseRepository
  from './BaseRepository'


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
    .replace(/يَ|يُ|يِ|َ|ُ|ِ|ّ|ْ/g, '')
    .replace(/\s+/g, '')


// ======================================================
// NORMALIZE PRODUCT TYPE
// ======================================================

const normalizeProductType = value => {

  const type =
    normalizeText(value)

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

  return type
}


// ======================================================
// NORMALIZE OIL VISCOSITY
// ======================================================

const normalizeViscosity = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/–|—|−/g, '-')


// ======================================================
// PARSE TIRE SIZE
//
// Supports:
// 205/55/16
// 205*55*16
// 205/55R16
// 205 55 16
// 205-55-16
// ======================================================

const parseTireSize = value => {

  const text =
    String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/×/g, '*')
      .replace(/R/g, '/')
      .replace(/-/g, '/')
      .replace(/\*/g, '/')
      .replace(/\\/g, '/')
      .replace(/\s+/g, '')

  const match =
    text.match(
      /(\d{3})\/(\d{2})\/(\d{2}(?:\.\d+)?)/
    )

  if (!match) {
    return null
  }

  return {

    width:
      Number(match[1]),

    profile:
      Number(match[2]),

    rim:
      Number(match[3]),

    size:
      `${match[1]}/${match[2]}/${match[3]}`

  }

}


// ======================================================
// EXTRACT TIRE DATA
// ======================================================

const extractTireData = product => {

  const tire =
    product?.tire ||
    product?.tireData ||
    product?.tireSpecification ||
    product?.tireSpecifications ||
    product?.specifications?.tire ||
    product?.typeData?.tire ||
    {}


  let width =
    tire?.width ??
    tire?.sectionWidth ??
    product?.width ??
    product?.sectionWidth


  let profile =
    tire?.profile ??
    tire?.height ??
    tire?.aspectRatio ??
    product?.profile ??
    product?.aspectRatio


  let rim =
    tire?.rim ??
    tire?.rimSize ??
    tire?.wheelDiameter ??
    product?.rim ??
    product?.rimSize


  const directSizeCandidates = [

    tire?.size,
    tire?.tireSize,
    tire?.dimension,

    product?.tireSize,
    product?.size,
    product?.dimension,

    product?.name,
    product?.productName,
    product?.shortName,
    product?.title,
    product?.sku,
    product?.code,
    product?.barcode,

    product?.description

  ]


  let parsed = null


  for (
    const candidate of directSizeCandidates
  ) {

    parsed =
      parseTireSize(candidate)

    if (parsed) {
      break
    }

  }


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


  const normalizedWidth =
    Number(width)

  const normalizedProfile =
    Number(profile)

  const normalizedRim =
    Number(rim)


  const validWidth =
    Number.isFinite(normalizedWidth) &&
    normalizedWidth > 0


  const validProfile =
    Number.isFinite(normalizedProfile) &&
    normalizedProfile > 0


  const validRim =
    Number.isFinite(normalizedRim) &&
    normalizedRim > 0


  if (
    !validWidth &&
    !validProfile &&
    !validRim
  ) {
    return null
  }


  return {

    width:
      validWidth
        ? normalizedWidth
        : null,

    profile:
      validProfile
        ? normalizedProfile
        : null,

    rim:
      validRim
        ? normalizedRim
        : null,

    size:
      parsed?.size ||
      (
        validWidth &&
        validProfile &&
        validRim
          ? `${normalizedWidth}/${normalizedProfile}/${normalizedRim}`
          : ''
      )

  }

}


// ======================================================
// EXTRACT BATTERY DATA
// ======================================================

const extractBatteryData = product => {

  const battery =
    product?.battery ||
    product?.batteryData ||
    product?.batterySpecification ||
    product?.batterySpecifications ||
    product?.specifications?.battery ||
    product?.typeData?.battery ||
    {}


  const candidates = [

    battery?.capacity,
    battery?.ampereHour,
    battery?.ah,
    battery?.amp,
    battery?.ampHours,

    product?.capacity,
    product?.ampereHour,
    product?.ah,
    product?.amp,
    product?.ampHours,

    product?.model,
    product?.productName,
    product?.name

  ]


  return {

    capacity:
      candidates.find(
        value =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ''
      ) ?? ''

  }

}


// ======================================================
// EXTRACT OIL DATA
// ======================================================

const extractOilData = product => {

  const oil =
    product?.oil ||
    product?.oilData ||
    product?.oilSpecification ||
    product?.oilSpecifications ||
    product?.specifications?.oil ||
    product?.typeData?.oil ||
    {}


  const viscosity =
    oil?.viscosity ??
    oil?.grade ??
    product?.viscosity ??
    product?.grade ??
    product?.oilGrade ??
    product?.model ??
    product?.productName ??
    product?.name ??
    ''


  return {

    viscosity:
      String(viscosity ?? '').trim()

  }

}


// ======================================================
// NORMALIZE PRODUCT FOR TECHNICAL SEARCH
// ======================================================

const normalizeProductForCompatibility = product => {

  if (!product) {
    return null
  }


  const type =
    normalizeProductType(
      product?.type ||
      product?.category ||
      product?.productType
    )


  const tire =
    type === 'tire'
      ? extractTireData(product)
      : null


  const battery =
    type === 'battery'
      ? extractBatteryData(product)
      : null


  const oil =
    type === 'oil'
      ? extractOilData(product)
      : null


  return {

    ...product,

    type,

    tire,

    battery,

    oil,

    compatibilityCatalogReady: true

  }

}


// ======================================================
// REPOSITORY
// ======================================================

class ProductsRepository
  extends BaseRepository {


  constructor() {

    super('products')

  }


  // ==================================================
  // GET ALL PRODUCTS
  // ==================================================

  async getAll() {

    const result =
      await super.getAll()


    console.log(
      'PRODUCTS FIRESTORE RESULT:',
      result
    )


    if (
      result?.success === false
    ) {

      console.error(
        'PRODUCTS FIRESTORE ERROR:',
        result?.message,
        result?.errors
      )

      return result

    }


    const data =
      Array.isArray(result?.data)
        ? result.data
        : []


    return {

      success: true,

      data,

      message:
        result?.message || '',

      errors:
        Array.isArray(result?.errors)
          ? result.errors
          : []

    }

  }


  // ==================================================
  // GET ALL PRODUCTS DATA ONLY
  //
  // This is the technical product catalog.
  //
  // IMPORTANT:
  // This function does NOT use warehouse availability
  // as a compatibility condition.
  // ==================================================

  async getAllData() {

    const result =
      await this.getAll()


    if (
      result?.success === false
    ) {

      return []

    }


    const products =
      Array.isArray(result?.data)
        ? result.data
        : []


    const normalizedProducts =
      products
        .map(
          normalizeProductForCompatibility
        )
        .filter(Boolean)


    console.log(
      '[ProductsRepository] TECHNICAL PRODUCT CATALOG:',
      {
        rawCount:
          products.length,

        normalizedCount:
          normalizedProducts.length,

        products:
          normalizedProducts.map(
            product => ({

              id:
                product?.id,

              name:
                product?.name ||
                product?.productName,

              type:
                product?.type,

              tire:
                product?.tire,

              battery:
                product?.battery,

              oil:
                product?.oil

            })
          )

      }
    )


    return normalizedProducts

  }


  // ==================================================
  // GET TECHNICAL CATALOG
  //
  // Explicit name for vehicle compatibility code.
  // ==================================================

  async getCompatibilityCatalog() {

    return this.getAllData()

  }


  // ==================================================
  // FIND BATTERIES
  // ==================================================

  async findBatteries({

    capacity

  }) {

    const result =
      await this.getAll()


    if (
      result?.success === false
    ) {

      console.error(
        'BATTERY SEARCH FIRESTORE ERROR:',
        result.message,
        result.errors
      )

      return []

    }


    const products =
      Array.isArray(
        result?.data
      )
        ? result.data
        : []


    const requested =
      normalizeText(
        capacity
      )


    return products.filter(
      product => {

        if (
          normalizeProductType(
            product?.type
          ) !== 'battery'
        ) {
          return false
        }


        const battery =
          extractBatteryData(
            product
          )


        const candidates = [

          battery?.capacity,

          product?.battery?.capacity,

          product?.battery?.ampereHour,

          product?.battery?.ah,

          product?.battery?.amp,

          product?.battery?.ampHours,

          product?.capacity,

          product?.ampereHour,

          product?.ah,

          product?.amp,

          product?.ampHours,

          product?.model

        ]


        return candidates.some(
          value =>
            normalizeText(
              value
            ) === requested
        )

      }
    )

  }


  // ==================================================
  // FIND TIRES BY SIZE
  // ==================================================

  async findTiresBySize({

    width,
    profile,
    rim

  }) {

    const result =
      await this.getAll()


    if (
      result?.success === false
    ) {

      console.error(
        'TIRE SEARCH FIRESTORE ERROR:',
        result.message,
        result.errors
      )

      return []

    }


    const products =
      Array.isArray(
        result?.data
      )
        ? result.data
        : []


    return products.filter(
      product => {

        if (
          normalizeProductType(
            product?.type
          ) !== 'tire'
        ) {
          return false
        }


        const tire =
          extractTireData(
            product
          )


        return (

          Number(
            tire?.width
          ) ===
          Number(width)

          &&

          Number(
            tire?.profile
          ) ===
          Number(profile)

          &&

          Number(
            tire?.rim
          ) ===
          Number(rim)

        )

      }
    )

  }


  // ==================================================
  // FIND OILS
  // ==================================================

  async findOils({

    viscosity

  }) {

    const result =
      await this.getAll()


    if (
      result?.success === false
    ) {

      console.error(
        'OIL SEARCH FIRESTORE ERROR:',
        result.message,
        result.errors
      )

      return []

    }


    const products =
      Array.isArray(
        result?.data
      )
        ? result.data
        : []


    const requested =
      normalizeViscosity(
        viscosity
      )


    if (
      !requested
    ) {
      return []
    }


    const oils =
      products.filter(
        product =>
          normalizeProductType(
            product?.type
          ) === 'oil'
      )


    console.log(
      'OIL PRODUCTS FOUND:',
      oils
    )


    const matched =
      oils.filter(
        product => {

          const oil =
            extractOilData(
              product
            )


          const candidates = [

            oil?.viscosity,

            product?.oil?.viscosity,

            product?.oil?.grade,

            product?.viscosity,

            product?.grade,

            product?.oilGrade,

            product?.model,

            product?.productName,

            product?.name

          ]


          const match =
            candidates.some(
              value =>
                normalizeViscosity(
                  value
                ) === requested
            )


          console.log(
            'OIL CHECK:',
            {

              id:
                product?.id,

              name:
                product?.name,

              type:
                product?.type,

              requested,

              candidates,

              match

            }
          )


          return match

        }
      )


    console.log(
      'OIL SEARCH MATCHES:',
      matched
    )


    return matched

  }

}


export default new ProductsRepository()