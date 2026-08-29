// ======================================================
// EL OLA ERP
// Vehicle AI Engine
// ======================================================

import VehicleProvider
  from '../vehicles/VehicleProvider'

import VehicleSearchIndex
  from '../search/VehicleSearchIndex'


export default class VehicleAIEngine {

  // ======================================================
  // NORMALIZE
  // ======================================================

  static normalize(text = '') {

    return String(text ?? '')

      .toLowerCase()

      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')

      .replace(/[\u064B-\u065F\u0670]/g, '')

      .trim()
  }


  // ======================================================
  // NORMALIZE TYPE
  // ======================================================

  static normalizeType(value = '') {

    const type =
      this.normalize(
        value
      )

    if (
      [
        'car',
        'cars',
        'سياره',
        'سيارات',
        'vehicle',
        'vehicles',
        'ملاكي'
      ].includes(type)
    ) {
      return 'car'
    }

    if (
      [
        'truck',
        'trucks',
        'شاحنه',
        'شاحنات',
        'نقل'
      ].includes(type)
    ) {
      return 'truck'
    }

    if (
      [
        'bus',
        'buses',
        'اتوبيس',
        'اتوبيسات',
        'حافله',
        'حافلات'
      ].includes(type)
    ) {
      return 'bus'
    }

    if (
      [
        'motorcycle',
        'motorcycles',
        'دراجه',
        'دراجات',
        'موتوسيكل',
        'موتوسيكلات'
      ].includes(type)
    ) {
      return 'motorcycle'
    }

    return type
  }


  // ======================================================
  // YEAR
  // ======================================================

  static extractYear(text = '') {

    const match =
      String(text)

        .match(
          /(19|20)\d{2}/
        )

    return match

      ? Number(
          match[0]
        )

      : null
  }


  // ======================================================
  // DATABASE
  // ======================================================

  static getDatabase() {

    return (
      VehicleProvider.getAll() ||
      []
    )
  }


  // ======================================================
  // FIND BEST MATCH
  // ======================================================

  static findBest(query) {

    const results =
      VehicleSearchIndex.search(
        query
      )

    return (
      results[0] ||
      null
    )
  }


  // ======================================================
  // PARSE
  // ======================================================

  static parse(text = '') {

    const query =
      this.normalize(
        text
      )

    if (!query) {
      return null
    }

    const year =
      this.extractYear(
        query
      )

    const vehicle =
      this.findBest(
        query
      )

    if (!vehicle) {
      return null
    }

    return {

      vehicle,

      vehicleType:
        vehicle.vehicleType ??
        vehicle.type,

      make:
        vehicle.make,

      model:
        vehicle.model,

      year:
        year ??
        vehicle.yearFrom
    }
  }


  // ======================================================
  // SUGGESTIONS
  // ======================================================

  static suggestions(text = '') {

    if (
      !String(text ?? '').trim()
    ) {
      return []
    }

    return (
      VehicleSearchIndex.search(
        text
      ) || []
    )
  }


  // ======================================================
  // GET PRODUCT COMPATIBLE VEHICLES
  // ======================================================

  static getCompatibleVehicles(
    product
  ) {

    const sources = [

      product?.compatibleVehicles,

      product?.compatibility?.compatibleVehicles,

      product?.specifications?.compatibleVehicles,

      product?.specification?.compatibleVehicles,

      product?.attributes?.compatibleVehicles

    ]

    for (
      const source of sources
    ) {

      if (
        Array.isArray(source) &&
        source.length > 0
      ) {

        return source
      }
    }

    return []
  }


  // ======================================================
  // VEHICLE FIELD
  // ======================================================

  static getVehicleField(
    vehicle,
    fields = []
  ) {

    for (
      const field of fields
    ) {

      const value =
        vehicle?.[field]

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
      ) {

        return value
      }
    }

    return ''
  }


  // ======================================================
  // YEAR MATCH
  // ======================================================

  static yearMatches(
    vehicle,
    requestedYear
  ) {

    const year =
      Number(
        requestedYear
      )

    if (
      !Number.isFinite(year)
    ) {
      return true
    }


    // --------------------------------------------------
    // SINGLE YEAR
    // --------------------------------------------------

    const singleYear =
      Number(
        this.getVehicleField(
          vehicle,
          [
            'year',
            'modelYear',
            'productionYear'
          ]
        )
      )

    if (
      Number.isFinite(
        singleYear
      )
    ) {

      return (
        year ===
        singleYear
      )
    }


    // --------------------------------------------------
    // YEAR RANGE
    // --------------------------------------------------

    const from =
      Number(
        this.getVehicleField(
          vehicle,
          [
            'yearFrom',
            'from',
            'startYear',
            'productionFrom'
          ]
        )
      )

    const to =
      Number(
        this.getVehicleField(
          vehicle,
          [
            'yearTo',
            'to',
            'endYear',
            'productionTo'
          ]
        )
      )


    if (
      Number.isFinite(from) &&
      Number.isFinite(to)
    ) {

      return (
        year >= from &&
        year <= to
      )
    }


    if (
      Number.isFinite(from)
    ) {

      return (
        year >= from
      )
    }


    if (
      Number.isFinite(to)
    ) {

      return (
        year <= to
      )
    }


    return true
  }


  // ======================================================
  // TEXT MATCH
  // ======================================================

  static fieldMatches(
    actual,
    requested
  ) {

    const wanted =
      this.normalize(
        requested
      )

    if (!wanted) {
      return true
    }


    const value =
      this.normalize(
        actual
      )

    if (!value) {
      return false
    }


    if (
      value === wanted
    ) {
      return true
    }


    return (
      value.includes(wanted) ||
      wanted.includes(value)
    )
  }


  // ======================================================
  // COMPATIBLE VEHICLE MATCH
  // ======================================================

  static compatibleVehicleMatches(
    compatibleVehicle,
    search
  ) {

    if (
      compatibleVehicle === null ||
      compatibleVehicle === undefined
    ) {
      return false
    }


    // ==================================================
    // STRING COMPATIBILITY
    // ==================================================

    if (
      typeof compatibleVehicle === 'string' ||
      typeof compatibleVehicle === 'number'
    ) {

      const text =
        this.normalize(
          compatibleVehicle
        )

      const make =
        this.normalize(
          search?.make
        )

      const model =
        this.normalize(
          search?.model
        )

      const type =
        this.normalize(
          search?.vehicleType
        )

      const requestedYear =
        Number(
          search?.year
        )


      if (
        type &&
        !text.includes(type)
      ) {
        return false
      }


      if (
        make &&
        !text.includes(make)
      ) {
        return false
      }


      if (
        model &&
        !text.includes(model)
      ) {
        return false
      }


      if (
        Number.isFinite(
          requestedYear
        ) &&
        !text.includes(
          String(
            requestedYear
          )
        )
      ) {

        // A string may contain only make/model
        // and therefore cannot prove a year.
        // Do not reject it solely because the year
        // is absent.
      }


      return true
    }


    // ==================================================
    // OBJECT COMPATIBILITY
    // ==================================================

    if (
      typeof compatibleVehicle !== 'object'
    ) {
      return false
    }


    const vehicleType =
      this.getVehicleField(
        compatibleVehicle,
        [
          'vehicleType',
          'type',
          'vehicle_type',
          'category'
        ]
      )


    const make =
      this.getVehicleField(
        compatibleVehicle,
        [
          'make',
          'brand',
          'manufacturer',
          'vehicleBrand'
        ]
      )


    const model =
      this.getVehicleField(
        compatibleVehicle,
        [
          'model',
          'modelName',
          'vehicleModel',
          'model_name'
        ]
      )


    // ==================================================
    // TYPE
    // ==================================================

    if (
      search?.vehicleType &&
      vehicleType
    ) {

      const requestedType =
        this.normalizeType(
          search.vehicleType
        )

      const actualType =
        this.normalizeType(
          vehicleType
        )

      if (
        requestedType &&
        actualType &&
        requestedType !==
        actualType
      ) {

        return false
      }
    }


    // ==================================================
    // MAKE
    // ==================================================

    if (
      search?.make &&
      make
    ) {

      if (
        !this.fieldMatches(
          make,
          search.make
        )
      ) {
        return false
      }
    }


    // ==================================================
    // MODEL
    // ==================================================

    if (
      search?.model &&
      model
    ) {

      if (
        !this.fieldMatches(
          model,
          search.model
        )
      ) {
        return false
      }
    }


    // ==================================================
    // YEAR
    // ==================================================

    if (
      search?.year
    ) {

      if (
        !this.yearMatches(
          compatibleVehicle,
          search.year
        )
      ) {
        return false
      }
    }


    return true
  }


  // ======================================================
  // PRODUCT MATCH
  // ======================================================

  static productMatchesVehicle(
    product,
    search
  ) {

    if (!product) {
      return false
    }


    const compatibleVehicles =
      this.getCompatibleVehicles(
        product
      )


    if (
      compatibleVehicles.length === 0
    ) {
      return false
    }


    return compatibleVehicles.some(
      compatibleVehicle =>
        this.compatibleVehicleMatches(
          compatibleVehicle,
          search
        )
    )
  }


  // ======================================================
  // SEARCH PRODUCTS BY VEHICLE
  // ======================================================

  static searchProductsByVehicle(
    params
  ) {

    const products =
      Array.isArray(
        params?.products
      )
        ? params.products
        : []


    const vehicleType =
      params?.vehicleType ??
      params?.type ??
      ''


    const make =
      params?.make ??
      params?.brand ??
      ''


    const model =
      params?.model ??
      ''


    const year =
      params?.year ??
      ''


    if (
      !vehicleType &&
      !make &&
      !model &&
      !year
    ) {
      return []
    }


    const search = {

      vehicleType,

      make,

      model,

      year
    }


    return products.filter(
      product =>
        this.productMatchesVehicle(
          product,
          search
        )
    )
  }


  // ======================================================
  // SEARCH
  // ======================================================

  static search(input = '') {

    // ====================================================
    // PRODUCT SEARCH MODE
    // ====================================================
    //
    // VehicleSearchController calls:
    //
    // VehicleEngine.search({
    //   vehicleType,
    //   make,
    //   model,
    //   year,
    //   products
    // })
    //
    // In this mode we MUST return products.
    // ====================================================

    if (
      input &&
      typeof input === 'object' &&
      !Array.isArray(input)
    ) {

      return this.searchProductsByVehicle(
        input
      )
    }


    // ====================================================
    // AI TEXT SEARCH MODE
    // ====================================================
    //
    // Preserve the previous behavior when another
    // part of the application sends a text query.
    // ====================================================

    const text =
      String(
        input ?? ''
      )


    const vehicle =
      this.parse(
        text
      )


    return {

      query:
        text,

      vehicle,

      suggestions:
        this.suggestions(
          text
        )

    }
  }
}
