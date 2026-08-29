// ======================================================
// EL OLA ERP
// Vehicle Compatibility Engine
// ======================================================

export class VehicleCompatibilityEngine {

  // ====================================================
  // NORMALIZE TEXT
  // ====================================================

  static normalizeText(value) {

    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ')

  }


  // ====================================================
  // NORMALIZE TYPE
  // ====================================================

  static normalizeType(value) {

    const normalized =
      this.normalizeText(
        value
      )


    const aliases = {

      tire:
        [
          'tire',
          'tires',
          'tyre',
          'tyres',
          'إطار',
          'اطار',
          'إطارات',
          'اطارات'
        ],

      battery:
        [
          'battery',
          'batteries',
          'بطارية',
          'بطاريات'
        ],

      oil:
        [
          'oil',
          'oils',
          'زيت',
          'زيوت'
        ]

    }


    for (
      const [
        type,
        values
      ] of Object.entries(
        aliases
      )
    ) {

      if (
        values.some(
          value =>
            this.normalizeText(
              value
            ) === normalized
        )
      ) {

        return type

      }

    }


    return normalized

  }


  // ====================================================
  // NORMALIZE YEAR
  // ====================================================

  static normalizeYear(value) {

    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {

      return null

    }


    const number =
      Number(
        value
      )


    return Number.isFinite(
      number
    )
      ? number
      : null

  }


  // ====================================================
  // GET COMPATIBLE VEHICLES
  // ====================================================

  static getCompatibleVehicles(
    product
  ) {

    const candidates = [

      product?.compatibleVehicles,

      product?.vehicleCompatibility,

      product?.vehicleCompatibilities,

      product?.vehicles,

      product?.compatibility?.vehicles,

      product?.compatibility?.compatibleVehicles,

      product?.specifications?.compatibleVehicles,

      product?.specifications?.vehicleCompatibility,

      product?.specifications?.vehicles,

      product?.attributes?.compatibleVehicles,

      product?.attributes?.vehicleCompatibility,

      product?.attributes?.vehicles,

      product?.tire?.compatibleVehicles,

      product?.tire?.vehicleCompatibility,

      product?.battery?.compatibleVehicles,

      product?.battery?.vehicleCompatibility,

      product?.oil?.compatibleVehicles,

      product?.oil?.vehicleCompatibility

    ]


    for (
      const value of candidates
    ) {

      if (
        Array.isArray(value)
      ) {

        return value

      }

    }


    return []

  }


  // ====================================================
  // CONVERT COMPATIBILITY ENTRY
  // ====================================================

  static normalizeCompatibilityVehicle(
    vehicle
  ) {

    // --------------------------------------------------
    // STRING
    // --------------------------------------------------

    if (
      typeof vehicle === 'string'
    ) {

      const value =
        vehicle.trim()


      if (!value) {

        return null

      }


      /*
       * دعم الصيغ النصية مثل:
       *
       * Toyota Corolla
       * Toyota Corolla 2020
       * Toyota | Corolla | 2020
       * Toyota, Corolla, 2020
       */

      const parts =
        value
          .split(
            /\||,|\/|;/ 
          )
          .map(
            part =>
              part.trim()
          )
          .filter(
            Boolean
          )


      if (
        parts.length >= 2
      ) {

        const year =
          parts
            .map(
              part =>
                this.normalizeYear(
                  part
                )
            )
            .find(
              value =>
                value !== null
            )


        const nonYearParts =
          parts.filter(
            part =>
              this.normalizeYear(
                part
              ) === null
          )


        return {

          make:
            nonYearParts[0] ||
            '',

          model:
            nonYearParts[1] ||
            '',

          year

        }

      }


      return {

        make:
          value,

        model:
          '',

        year:
          null

      }

    }


    // --------------------------------------------------
    // OBJECT
    // --------------------------------------------------

    if (
      vehicle &&
      typeof vehicle === 'object'
    ) {

      return {

        ...vehicle,

        vehicleType:
          vehicle.vehicleType ??
          vehicle.type ??
          vehicle.category ??
          vehicle.vehicleCategory ??
          '',

        make:
          vehicle.make ??
          vehicle.brand ??
          vehicle.manufacturer ??
          vehicle.makeName ??
          '',

        model:
          vehicle.model ??
          vehicle.modelName ??
          '',

        year:
          vehicle.year ??
          vehicle.modelYear ??
          vehicle.productionYear ??
          null,

        yearFrom:
          vehicle.yearFrom ??
          vehicle.from ??
          vehicle.startYear ??
          null,

        yearTo:
          vehicle.yearTo ??
          vehicle.to ??
          vehicle.endYear ??
          null

      }

    }


    return null

  }


  // ====================================================
  // GET VEHICLE FIELD
  // ====================================================

  static getVehicleField(
    vehicle,
    keys = []
  ) {

    for (
      const key of keys
    ) {

      const value =
        vehicle?.[key]


      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {

        return value

      }

    }


    return ''

  }


  // ====================================================
  // MATCH TEXT
  // ====================================================

  static matchText(
    requested,
    actual
  ) {

    const wanted =
      this.normalizeText(
        requested
      )


    const value =
      this.normalizeText(
        actual
      )


    /*
     * إذا لم يتم تحديد القيمة
     * لا تمنع التوافق.
     */

    if (!wanted) {

      return true

    }


    /*
     * إذا لم توجد القيمة في بيانات
     * التوافق فلا نعتبرها تطابقًا.
     */

    if (!value) {

      return false

    }


    if (
      wanted === value
    ) {

      return true

    }


    /*
     * دعم اختلافات بسيطة في الكتابة.
     */

    return (
      value.includes(wanted) ||
      wanted.includes(value)
    )

  }


  // ====================================================
  // MATCH VEHICLE
  // ====================================================

  static matchVehicle({

    product,

    make,

    model,

    year,

    vehicleType

  }) {

    const vehicles =
      this.getCompatibleVehicles(
        product
      )


    // --------------------------------------------------
    // NO COMPATIBILITY DATA
    // --------------------------------------------------

    if (
      vehicles.length === 0
    ) {

      return false

    }


    return vehicles.some(
      vehicle => {

        const normalizedVehicle =
          this.normalizeCompatibilityVehicle(
            vehicle
          )


        if (
          !normalizedVehicle
        ) {

          return false

        }


        return this.isCompatible({

          vehicle:
            normalizedVehicle,

          make,

          model,

          year,

          vehicleType

        })

      }
    )

  }


  // ====================================================
  // CHECK COMPATIBILITY
  // ====================================================

  static isCompatible({

    vehicle,

    make,

    model,

    year,

    vehicleType

  }) {

    if (
      !vehicle ||
      typeof vehicle !== 'object'
    ) {

      return false

    }


    // ==================================================
    // VEHICLE TYPE
    // ==================================================

    const vehicleTypeValue =
      this.getVehicleField(

        vehicle,

        [

          'vehicleType',

          'type',

          'category',

          'vehicleCategory'

        ]

      )


    if (
      vehicleType &&
      vehicleTypeValue
    ) {

      const requestedType =
        this.normalizeType(
          vehicleType
        )


      const actualType =
        this.normalizeType(
          vehicleTypeValue
        )


      if (
        requestedType &&
        actualType &&
        requestedType !== actualType
      ) {

        return false

      }

    }


    // ==================================================
    // BRAND / MAKE
    // ==================================================

    const vehicleBrand =
      this.getVehicleField(

        vehicle,

        [

          'make',

          'brand',

          'manufacturer',

          'makeName'

        ]

      )


    if (
      make &&
      !this.matchText(
        make,
        vehicleBrand
      )
    ) {

      return false

    }


    // ==================================================
    // MODEL
    // ==================================================

    const vehicleModel =
      this.getVehicleField(

        vehicle,

        [

          'model',

          'modelName'

        ]

      )


    if (
      model &&
      !this.matchText(
        model,
        vehicleModel
      )
    ) {

      return false

    }


    // ==================================================
    // YEAR
    // ==================================================

    return this.matchYear({

      vehicle,

      year

    })

  }


  // ====================================================
  // YEAR
  // ====================================================

  static matchYear({

    vehicle,

    year

  }) {

    if (
      year === undefined ||
      year === null ||
      year === ''
    ) {

      return true

    }


    const requestedYear =
      this.normalizeYear(
        year
      )


    if (
      requestedYear === null
    ) {

      return false

    }


    // --------------------------------------------------
    // SINGLE YEAR
    // --------------------------------------------------

    const singleYear =
      this.normalizeYear(

        vehicle.year ??
        vehicle.modelYear ??
        vehicle.productionYear

      )


    if (
      singleYear !== null
    ) {

      return (
        requestedYear ===
        singleYear
      )

    }


    // --------------------------------------------------
    // YEAR RANGE
    // --------------------------------------------------

    const from =
      this.normalizeYear(

        vehicle.yearFrom ??
        vehicle.from ??
        vehicle.startYear

      )


    const to =
      this.normalizeYear(

        vehicle.yearTo ??
        vehicle.to ??
        vehicle.endYear

      )


    // --------------------------------------------------
    // ONLY FROM YEAR
    // --------------------------------------------------

    if (
      from !== null &&
      to === null
    ) {

      return (
        requestedYear >= from
      )

    }


    // --------------------------------------------------
    // ONLY TO YEAR
    // --------------------------------------------------

    if (
      from === null &&
      to !== null
    ) {

      return (
        requestedYear <= to
      )

    }


    // --------------------------------------------------
    // RANGE
    // --------------------------------------------------

    if (
      from !== null &&
      to !== null
    ) {

      return (

        requestedYear >= from &&

        requestedYear <= to

      )

    }


    /*
     * لا توجد سنة مخزنة في compatibility
     * لذلك لا نرفض المنتج بسبب السنة.
     */

    return true

  }


  // ====================================================
  // FILTER
  // ====================================================

  static filterProducts({

    products = [],

    type,

    make,

    model,

    year,

    vehicleType

  }) {

    if (
      !Array.isArray(products)
    ) {

      return []

    }


    const requestedType =
      this.normalizeType(
        type
      )


    return products.filter(
      product => {

        if (
          !product ||
          typeof product !== 'object'
        ) {

          return false

        }


        // ==============================================
        // TYPE
        // ==============================================

        const productType =
          this.normalizeType(

            product?.type ??
            product?.productType ??
            product?.category ??
            product?.productCategory

          )


        if (
          requestedType &&
          productType !==
          requestedType
        ) {

          return false

        }


        // ==============================================
        // VEHICLE
        // ==============================================

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


  // ====================================================
  // FILTER ALL
  // ====================================================

  static filterAll({

    products = [],

    make,

    model,

    year,

    vehicleType

  }) {

    return this.filterProducts({

      products,

      type: 'tire',

      make,

      model,

      year,

      vehicleType

    }).concat(

      this.filterProducts({

        products,

        type: 'battery',

        make,

        model,

        year,

        vehicleType

      })

    ).concat(

      this.filterProducts({

        products,

        type: 'oil',

        make,

        model,

        year,

        vehicleType

      })

    )

  }

}


export default VehicleCompatibilityEngine