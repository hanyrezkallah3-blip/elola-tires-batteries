import BaseRepository
  from './BaseRepository'


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

      // مهم:
      // لا نخفي الخطأ داخل [].
      // نعيد النتيجة حتى يستطيع المستدعي
      // معرفة أن Firestore فشل فعلاً.

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


    console.log(
      'ALL PRODUCTS:',
      products
    )


    console.log(
      'BATTERY SEARCH CAPACITY:',
      capacity
    )


    const batteries =
      products.filter(
        product => {

          console.log(
            'CHECK PRODUCT:',
            product
          )


          return (

            String(
              product?.type ||
              ''
            ).toLowerCase()

            ===

            'battery'

          )

        }
      )


    console.log(
      'BATTERIES FOUND BEFORE CAPACITY:',
      batteries
    )


    return batteries.filter(
      product =>

        Number(
          product?.battery?.capacity
        )

        ===

        Number(
          capacity
        )

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
      product =>

        String(
          product?.type ||
          ''
        ).toLowerCase()

        ===

        'tire'

        &&

        Number(
          product?.tire?.width
        ) === Number(width)

        &&

        Number(
          product?.tire?.height
        ) === Number(profile)

        &&

        Number(
          product?.tire?.rim
        ) === Number(rim)

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


    return products.filter(
      product =>

        String(
          product?.type ||
          ''
        ).toLowerCase()

        ===

        'oil'

        &&

        String(
          product?.oil?.viscosity ||
          ''
        ).toLowerCase()

        ===

        String(
          viscosity || ''
        ).toLowerCase()

    )

  }

}


export default new ProductsRepository()