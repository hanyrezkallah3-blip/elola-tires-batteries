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


    return {

      success: true,

      data:
        Array.isArray(
          result?.data
        )
          ? result.data
          : [],

      message:
        result?.message || '',

      errors:
        Array.isArray(
          result?.errors
        )
          ? result.errors
          : []

    }

  }


  // ==================================================
  // GET ALL PRODUCTS DATA ONLY
  // ==================================================

  async getAllData() {

    const result =
      await this.getAll()


    if (
      result?.success === false
    ) {

      return []

    }


    return Array.isArray(
      result?.data
    )
      ? result.data
      : []

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


        const candidates = [

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
          product?.tire ||
          product?.tireData ||
          product?.tireSpecification ||
          product?.tireSpecifications ||
          {}


        return (

          Number(
            tire?.width ??
            product?.width
          ) ===
          Number(width)

          &&

          Number(
            tire?.height ??
            tire?.profile ??
            product?.profile
          ) ===
          Number(profile)

          &&

          Number(
            tire?.rim ??
            tire?.rimSize ??
            product?.rim
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

          const candidates = [

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