// =====================================================
// EL OLA ERP
// Vehicle AI Engine
// =====================================================
//
// RESPONSIBILITY
// -----------------------------------------------------
//
// AI-facing vehicle search engine.
//
// FLOW
// -----------------------------------------------------
//
// Free text
//    ↓
// VehicleSearchIndex
//    ↓
// Online Vehicle Resolution
//    ↓
// VehicleProvider
//    ↓
// make / model / year / vehicleType
//    ↓
// VehicleEngine
//    ↓
// OEMCompatibilityEngine
//    ↓
// Technical product compatibility
//
// IMPORTANT
// -----------------------------------------------------
//
// VehicleAIEngine does NOT decide product availability.
//
// Warehouse stock, prices and availability are handled
// separately by the product/search layer.
//
// IMPORTANT
// -----------------------------------------------------
//
// VehicleProvider is asynchronous.
//
// Therefore all vehicle resolution paths in this engine
// MUST await VehicleProvider.
//
// =====================================================


// =====================================================
// IMPORTS
// =====================================================

import VehicleProvider
  from '../vehicles/VehicleProvider'

import VehicleSearchIndex
  from '../search/VehicleSearchIndex'

import VehicleEngine
  from './VehicleEngine'


// =====================================================
// ENGINE
// =====================================================

export default class VehicleAIEngine {


  // =====================================================
  // NORMALIZE
  // =====================================================

  static normalize(text = '') {

    return String(
      text ?? ''
    )
      .toLowerCase()
      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  }


  // =====================================================
  // NORMALIZE TYPE
  // =====================================================

  static normalizeType(
    value = ''
  ) {

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


    if (
      [
        'suv',
        'suvs'
      ].includes(type)
    ) {

      return 'suv'

    }


    return type

  }


  // =====================================================
  // EXTRACT YEAR
  // =====================================================

  static extractYear(
    text = ''
  ) {

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


  // =====================================================
  // DATABASE
  // =====================================================

  static async getDatabase() {

    try {

      const database =
        await VehicleProvider.getAll()


      return Array.isArray(
        database
      )
        ? database
        : []

    }

    catch (error) {

      console.warn(
        '[VehicleAIEngine] Vehicle database read failed:',
        error
      )

      return []

    }

  }


  // =====================================================
  // VEHICLE FIELD
  // =====================================================

  static getVehicleField(
    vehicle,
    fields = []
  ) {

    if (
      !vehicle ||
      typeof vehicle !== 'object'
    ) {

      return ''

    }


    for (
      const field of fields
    ) {

      const value =
        vehicle?.[field]


      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ''
      ) {

        return value

      }

    }


    return ''

  }


  // =====================================================
  // GET VEHICLE MAKE
  // =====================================================

  static getVehicleMake(
    vehicle
  ) {

    const direct =
      this.getVehicleField(
        vehicle,
        [
          'make',
          'Make',
          'MAKE',
          'brand',
          'Brand',
          'manufacturer',
          'Manufacturer',
          'vehicleBrand',
          'vehicleMake',
          'makeName',
          'brandName',
          'manufacturerName'
        ]
      )


    if (
      direct
    ) {

      return direct

    }


    if (
      vehicle?.vehicle &&
      typeof vehicle.vehicle === 'object'
    ) {

      return this.getVehicleMake(
        vehicle.vehicle
      )

    }


    if (
      vehicle?.data &&
      typeof vehicle.data === 'object'
    ) {

      return this.getVehicleMake(
        vehicle.data
      )

    }


    if (
      vehicle?.result &&
      typeof vehicle.result === 'object'
    ) {

      return this.getVehicleMake(
        vehicle.result
      )

    }


    return ''

  }


  // =====================================================
  // GET VEHICLE MODEL
  // =====================================================

  static getVehicleModel(
    vehicle
  ) {

    const direct =
      this.getVehicleField(
        vehicle,
        [
          'model',
          'Model',
          'MODEL',
          'modelName',
          'ModelName',
          'vehicleModel',
          'model_name',
          'vehicleModelName'
        ]
      )


    if (
      direct
    ) {

      return direct

    }


    if (
      vehicle?.vehicle &&
      typeof vehicle.vehicle === 'object'
    ) {

      return this.getVehicleModel(
        vehicle.vehicle
      )

    }


    if (
      vehicle?.data &&
      typeof vehicle.data === 'object'
    ) {

      return this.getVehicleModel(
        vehicle.data
      )

    }


    if (
      vehicle?.result &&
      typeof vehicle.result === 'object'
    ) {

      return this.getVehicleModel(
        vehicle.result
      )

    }


    return ''

  }


  // =====================================================
  // GET VEHICLE TYPE
  // =====================================================

  static getVehicleType(
    vehicle
  ) {

    const direct =
      this.getVehicleField(
        vehicle,
        [
          'vehicleType',
          'VehicleType',
          'type',
          'Type',
          'vehicle_type',
          'category',
          'bodyType'
        ]
      )


    if (
      direct
    ) {

      return this.normalizeType(
        direct
      )

    }


    if (
      vehicle?.vehicle &&
      typeof vehicle.vehicle === 'object'
    ) {

      const nested =
        this.getVehicleType(
          vehicle.vehicle
        )

      if (
        nested
      ) {

        return nested

      }

    }


    return 'car'

  }


  // =====================================================
  // GET VEHICLE YEAR
  // =====================================================

  static getVehicleYear(
    vehicle
  ) {

    const direct =
      this.getVehicleField(
        vehicle,
        [
          'year',
          'Year',
          'modelYear',
          'ModelYear',
          'modelyear',
          'productionYear',
          'ProductionYear',
          'yearFrom',
          'YearFrom',
          'yearTo',
          'YearTo'
        ]
      )


    if (
      direct !== ''
    ) {

      return direct

    }


    if (
      vehicle?.vehicle &&
      typeof vehicle.vehicle === 'object'
    ) {

      return this.getVehicleYear(
        vehicle.vehicle
      )

    }


    if (
      vehicle?.data &&
      typeof vehicle.data === 'object'
    ) {

      return this.getVehicleYear(
        vehicle.data
      )

    }


    if (
      vehicle?.result &&
      typeof vehicle.result === 'object'
    ) {

      return this.getVehicleYear(
        vehicle.result
      )

    }


    return ''

  }


  // =====================================================
  // NORMALIZE RESOLVED VEHICLE
  // =====================================================
  //
  // IMPORTANT:
  //
  // Online providers can return different object shapes.
  //
  // This method converts all supported shapes into the
  // stable Elola vehicle contract:
  //
  // {
  //   vehicleType,
  //   type,
  //   make,
  //   brand,
  //   model,
  //   modelName,
  //   year,
  //   yearFrom,
  //   yearTo,
  //   source
  // }
  //
  // =====================================================

  static normalizeResolvedVehicle(
    vehicle,
    fallback = {}
  ) {

    if (
      !vehicle ||
      typeof vehicle !== 'object'
    ) {

      return null

    }


    const nestedVehicle =
      vehicle?.vehicle &&
      typeof vehicle.vehicle === 'object'
        ? vehicle.vehicle
        : null


    const nestedData =
      vehicle?.data &&
      typeof vehicle.data === 'object'
        ? vehicle.data
        : null


    const nestedResult =
      vehicle?.result &&
      typeof vehicle.result === 'object'
        ? vehicle.result
        : null


    const candidates = [

      vehicle,

      nestedVehicle,

      nestedData,

      nestedResult

    ].filter(
      Boolean
    )


    let make = ''

    let model = ''

    let year = ''

    let vehicleType = ''


    for (
      const candidate of candidates
    ) {

      if (
        !make
      ) {

        make =
          this.getVehicleMake(
            candidate
          )

      }


      if (
        !model
      ) {

        model =
          this.getVehicleModel(
            candidate
          )

      }


      if (
        !year
      ) {

        year =
          this.getVehicleYear(
            candidate
          )

      }


      if (
        !vehicleType
      ) {

        vehicleType =
          this.getVehicleField(
            candidate,
            [
              'vehicleType',
              'VehicleType',
              'type',
              'Type',
              'vehicle_type',
              'category',
              'bodyType'
            ]
          )

      }

    }


    make =
      make ||
      fallback?.make ||
      fallback?.brand ||
      ''


    model =
      model ||
      fallback?.model ||
      fallback?.modelName ||
      ''


    year =
      year ||
      fallback?.year ||
      ''


    vehicleType =
      this.normalizeType(
        vehicleType ||
        fallback?.vehicleType ||
        fallback?.type ||
        'car'
      )


    const yearNumber =
      Number(
        year
      )


    const normalizedYear =
      Number.isFinite(
        yearNumber
      )
        ? yearNumber
        : year


    const yearFrom =
      this.getVehicleField(
        vehicle,
        [
          'yearFrom',
          'YearFrom',
          'from',
          'startYear',
          'productionFrom'
        ]
      ) ||
      fallback?.yearFrom ||
      (
        Number.isFinite(
          yearNumber
        )
          ? yearNumber
          : null
      )


    const yearTo =
      this.getVehicleField(
        vehicle,
        [
          'yearTo',
          'YearTo',
          'to',
          'endYear',
          'productionTo'
        ]
      ) ||
      fallback?.yearTo ||
      (
        Number.isFinite(
          yearNumber
        )
          ? yearNumber
          : null
      )


    const normalized = {

      ...vehicle,

      vehicleType,

      type:
        vehicle?.type ||
        vehicle?.Type ||
        vehicleType,

      make,

      brand:
        vehicle?.brand ||
        vehicle?.Brand ||
        make,

      manufacturer:
        vehicle?.manufacturer ||
        vehicle?.Manufacturer ||
        make,

      model,

      modelName:
        vehicle?.modelName ||
        vehicle?.ModelName ||
        model,

      year:
        normalizedYear,

      modelYear:
        vehicle?.modelYear ??
        vehicle?.ModelYear ??
        normalizedYear,

      yearFrom,

      yearTo,

      source:
        vehicle?.source ||
        vehicle?.Source ||
        fallback?.source ||
        'online'

    }


    console.log(
      '[VehicleAIEngine] NORMALIZED ONLINE VEHICLE',
      {
        original:
          vehicle,

        normalized
      }
    )


    return normalized

  }


  // =====================================================
  // GET VEHICLE SEARCH TEXT
  // =====================================================

  static getVehicleSearchText(
    vehicle
  ) {

    if (
      vehicle === null ||
      vehicle === undefined
    ) {

      return ''

    }


    if (
      typeof vehicle === 'string' ||
      typeof vehicle === 'number'
    ) {

      return this.normalize(
        vehicle
      )

    }


    const values = [

      this.getVehicleMake(
        vehicle
      ),

      this.getVehicleModel(
        vehicle
      ),

      this.getVehicleYear(
        vehicle
      ),

      this.getVehicleType(
        vehicle
      )

    ]


    return this.normalize(
      values
        .filter(
          value =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ''
        )
        .join(' ')
    )

  }


  // =====================================================
  // TOKENIZE
  // =====================================================

  static tokenize(
    text = ''
  ) {

    return this.normalize(
      text
    )
      .split(/\s+/)
      .map(
        token =>
          token.trim()
      )
      .filter(
        Boolean
      )

  }


  // =====================================================
  // YEAR MATCH
  // =====================================================

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


    const singleYear =
      Number(
        this.getVehicleField(
          vehicle,
          [
            'year',
            'Year',
            'modelYear',
            'ModelYear',
            'productionYear',
            'ProductionYear'
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


    const from =
      Number(
        this.getVehicleField(
          vehicle,
          [
            'yearFrom',
            'YearFrom',
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
            'YearTo',
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


  // =====================================================
  // FALLBACK DATABASE MATCH
  // =====================================================

  static async findBestFromDatabase(
    query
  ) {

    const database =
      await this.getDatabase()


    if (
      database.length === 0
    ) {

      return null

    }


    const normalizedQuery =
      this.normalize(
        query
      )


    const tokens =
      this.tokenize(
        normalizedQuery
      )


    const requestedYear =
      this.extractYear(
        normalizedQuery
      )


    let best =
      null


    let bestScore =
      0


    for (
      const vehicle of database
    ) {

      if (
        !vehicle ||
        typeof vehicle !== 'object'
      ) {

        continue

      }


      const make =
        this.normalize(
          this.getVehicleMake(
            vehicle
          )
        )


      const model =
        this.normalize(
          this.getVehicleModel(
            vehicle
          )
        )


      if (
        !make &&
        !model
      ) {

        continue

      }


      const searchableText =
        this.getVehicleSearchText(
          vehicle
        )


      let score =
        0


      if (
        make &&
        normalizedQuery.includes(
          make
        )
      ) {

        score += 50

      }


      if (
        model &&
        normalizedQuery.includes(
          model
        )
      ) {

        score += 50

      }


      for (
        const token of tokens
      ) {

        if (
          token.length < 2
        ) {

          continue

        }


        if (
          searchableText.includes(
            token
          )
        ) {

          score += 5

        }

      }


      if (
        requestedYear &&
        this.yearMatches(
          vehicle,
          requestedYear
        )
      ) {

        score += 40

      }


      const hasMake =
        Boolean(
          make &&
          normalizedQuery.includes(
            make
          )
        )


      const hasModel =
        Boolean(
          model &&
          normalizedQuery.includes(
            model
          )
        )


      if (
        !hasMake &&
        !hasModel
      ) {

        continue

      }


      if (
        score >
        bestScore
      ) {

        bestScore =
          score

        best =
          vehicle

      }

    }


    if (
      best
    ) {

      console.log(
        '[VehicleAIEngine] DATABASE FALLBACK MATCH',
        {
          query,
          score:
            bestScore,
          vehicle:
            best
        }
      )

    }


    return best

  }


  // =====================================================
  // MATCH TEXT AGAINST VEHICLE
  // =====================================================

  static vehicleTextMatches(
    vehicle,
    query
  ) {

    const normalizedQuery =
      this.normalize(
        query
      )


    const make =
      this.normalize(
        this.getVehicleMake(
          vehicle
        )
      )


    const model =
      this.normalize(
        this.getVehicleModel(
          vehicle
        )
      )


    if (
      !make &&
      !model
    ) {

      return false

    }


    const makeMatch =
      Boolean(
        make &&
        (
          normalizedQuery.includes(
            make
          ) ||
          make.includes(
            normalizedQuery
          )
        )
      )


    const modelMatch =
      Boolean(
        model &&
        (
          normalizedQuery.includes(
            model
          ) ||
          model.includes(
            normalizedQuery
          )
        )
      )


    return (
      makeMatch &&
      modelMatch
    )

  }


  // =====================================================
  // FIND MAKE FROM ONLINE CATALOG
  // =====================================================

  static async findOnlineMake(
    query,
    vehicleType = 'car'
  ) {

    try {

      const brands =
        await VehicleProvider.getBrands(
          vehicleType
        )


      if (
        !Array.isArray(brands) ||
        brands.length === 0
      ) {

        console.warn(
          '[VehicleAIEngine] Online brand catalog is empty.'
        )

        return null

      }


      const normalizedQuery =
        this.normalize(
          query
        )


      let exact =
        null


      let partial =
        null


      for (
        const brand of brands
      ) {

        const name =
          this.normalize(
            this.getVehicleField(
              brand,
              [
                'name',
                'Name',
                'label',
                'Label',
                'brand',
                'Brand',
                'make',
                'Make'
              ]
            )
          )


        if (!name) {

          continue

        }


        if (
          normalizedQuery === name ||
          normalizedQuery.includes(
            ` ${name} `
          ) ||
          normalizedQuery.startsWith(
            `${name} `
          )
        ) {

          exact =
            brand

          break

        }


        if (
          normalizedQuery.includes(
            name
          ) ||
          name.includes(
            normalizedQuery
          )
        ) {

          partial =
            brand

        }

      }


      const match =
        exact ||
        partial


      if (
        match
      ) {

        console.log(
          '[VehicleAIEngine] ONLINE MAKE MATCH',
          {
            query,
            make:
              match
          }
        )

      }


      return match || null

    }
    catch (error) {

      console.warn(
        '[VehicleAIEngine] Online make lookup failed:',
        error
      )

      return null

    }

  }


  // =====================================================
  // FIND ONLINE VEHICLE
  // =====================================================

  static async findBestOnline(
    query
  ) {

    const normalizedQuery =
      this.normalize(
        query
      )


    if (!normalizedQuery) {

      return null

    }


    const requestedYear =
      this.extractYear(
        normalizedQuery
      )


    const vehicleType =
      'car'


    console.log(
      '[VehicleAIEngine] ONLINE RESOLUTION START',
      {
        query,
        year:
          requestedYear,
        vehicleType
      }
    )


    const brand =
      await this.findOnlineMake(
        normalizedQuery,
        vehicleType
      )


    if (!brand) {

      console.warn(
        '[VehicleAIEngine] ONLINE MAKE NOT FOUND',
        {
          query
        }
      )

      return null

    }


    const make =
      this.getVehicleField(
        brand,
        [
          'name',
          'Name',
          'label',
          'Label',
          'brand',
          'Brand',
          'make',
          'Make'
        ]
      )


    if (!make) {

      return null

    }


    const tokens =
      this.tokenize(
        normalizedQuery
      )


    const makeToken =
      this.normalize(
        make
      )


    const modelTokens =
      tokens.filter(
        token => {

          if (
            token ===
            makeToken
          ) {

            return false

          }


          if (
            requestedYear &&
            token ===
              String(requestedYear)
          ) {

            return false

          }


          return token.length >= 2

        }
      )


    // ===================================================
    // MODEL CATALOG
    // ===================================================

    try {

      const models =
        await VehicleProvider.getModels({

          brand:
            make,

          year:
            requestedYear || undefined,

          vehicleType

        })


      if (
        Array.isArray(models) &&
        models.length > 0
      ) {

        let best =
          null


        let bestScore =
          0


        for (
          const candidate of models
        ) {

          const candidateModel =
            this.normalize(
              this.getVehicleModel(
                candidate
              )
            )


          if (!candidateModel) {

            continue

          }


          let score =
            0


          if (
            normalizedQuery.includes(
              candidateModel
            )
          ) {

            score += 100

          }


          for (
            const token of modelTokens
          ) {

            if (
              candidateModel.includes(
                token
              ) ||
              token.includes(
                candidateModel
              )
            ) {

              score += 20

            }

          }


          if (
            requestedYear &&
            this.yearMatches(
              candidate,
              requestedYear
            )
          ) {

            score += 30

          }


          if (
            score >
            bestScore
          ) {

            bestScore =
              score

            best =
              candidate

          }

        }


        if (
          best
        ) {

          const bestModel =
            this.getVehicleModel(
              best
            )


          console.log(
            '[VehicleAIEngine] ONLINE MODEL MATCH',
            {
              query,
              make,
              model:
                bestModel,
              year:
                requestedYear,
              score:
                bestScore
            }
          )


          const resolved =
            await VehicleProvider.findVehicle({

              vehicleType,

              make,

              model:
                bestModel,

              year:
                requestedYear || undefined

            })


          if (
            resolved
          ) {

            return this.normalizeResolvedVehicle(
              resolved,
              {
                vehicleType,
                make,
                model:
                  bestModel,
                year:
                  requestedYear,
                source:
                  'online'
              }
            )

          }


          return this.normalizeResolvedVehicle(
            best,
            {
              vehicleType,
              make,
              model:
                bestModel,
              year:
                requestedYear,
              source:
                'online'
            }
          )

        }

      }

    }
    catch (error) {

      console.warn(
        '[VehicleAIEngine] Online model catalog lookup failed:',
        error
      )

    }


    // ===================================================
    // DIRECT VEHICLE LOOKUP
    // ===================================================

    const guessedModel =
      modelTokens.join(' ').trim()


    if (
      guessedModel
    ) {

      try {

        const resolved =
          await VehicleProvider.findVehicle({

            vehicleType,

            make,

            model:
              guessedModel,

            year:
              requestedYear || undefined

          })


        if (
          resolved
        ) {

          console.log(
            '[VehicleAIEngine] ONLINE VEHICLE DIRECT MATCH',
            resolved
          )


          const normalized =
            this.normalizeResolvedVehicle(
              resolved,
              {
                vehicleType,
                make,
                model:
                  guessedModel,
                year:
                  requestedYear,
                source:
                  'online'
              }
            )


          console.log(
            '[VehicleAIEngine] ONLINE DIRECT MATCH NORMALIZED',
            normalized
          )


          return normalized

        }

      }
      catch (error) {

        console.warn(
          '[VehicleAIEngine] Online direct vehicle lookup failed:',
          error
        )

      }

    }


    console.warn(
      '[VehicleAIEngine] ONLINE RESOLUTION FAILED',
      {
        query,
        make,
        guessedModel,
        year:
          requestedYear
      }
    )


    return null

  }


  // =====================================================
  // FIND BEST MATCH
  // =====================================================

  static async findBest(
    query
  ) {

    // ---------------------------------------------------
    // Online resolution is the primary path for free text.
    // ---------------------------------------------------

    const onlineVehicle =
      await this.findBestOnline(
        query
      )


    if (
      onlineVehicle
    ) {

      return onlineVehicle

    }


    // ---------------------------------------------------
    // Search index fallback.
    // ---------------------------------------------------

    try {

      const results =
        await VehicleSearchIndex.search(
          query
        )


      if (
        Array.isArray(results) &&
        results.length > 0
      ) {

        console.log(
          '[VehicleAIEngine] INDEX MATCH',
          {
            query,
            result:
              results[0]
          }
        )


        return this.normalizeResolvedVehicle(
          results[0],
          {
            source:
              'index'
          }
        )

      }

    }
    catch (error) {

      console.warn(
        '[VehicleAIEngine] Vehicle index search failed:',
        error
      )

    }


    // ---------------------------------------------------
    // Local database fallback.
    // ---------------------------------------------------

    return this.findBestFromDatabase(
      query
    )

  }


  // =====================================================
  // PARSE VEHICLE TEXT
  // =====================================================

  static async parse(
    text = ''
  ) {

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


    console.log(
      '[VehicleAIEngine] PARSE START',
      {
        originalText:
          text,

        normalizedQuery:
          query,

        extractedYear:
          year
      }
    )


    const vehicle =
      await this.findBest(
        query
      )


    if (!vehicle) {

      console.warn(
        '[VehicleAIEngine] PARSE FAILED - VEHICLE NOT FOUND',
        {
          query
        }
      )

      return null

    }


    // ===================================================
    // IMPORTANT:
    //
    // Normalize once more immediately before extracting
    // make/model/year.
    // ===================================================

    const normalizedVehicle =
      this.normalizeResolvedVehicle(
        vehicle,
        {
          year,
          source:
            vehicle?.source ||
            'online'
        }
      )


    const vehicleType =
      this.getVehicleType(
        normalizedVehicle
      )


    const make =
      this.getVehicleMake(
        normalizedVehicle
      )


    const model =
      this.getVehicleModel(
        normalizedVehicle
      )


    const vehicleYear =
      this.getVehicleYear(
        normalizedVehicle
      )


    const resolvedYear =
      year ??
      vehicleYear ??
      ''


    const parsed = {

      vehicle:
        normalizedVehicle,

      vehicleType:
        vehicleType ||
        'car',

      make:
        make ||
        '',

      model:
        model ||
        '',

      year:
        resolvedYear

    }


    console.log(
      '[VehicleAIEngine] PARSE RESULT',
      parsed
    )


    if (
      !parsed.make ||
      !parsed.model
    ) {

      console.error(
        '[VehicleAIEngine] PARSE RESULT MISSING MAKE OR MODEL',
        {
          parsed,
          rawVehicle:
            vehicle,
          normalizedVehicle
        }
      )

    }


    return parsed

  }


  // =====================================================
  // SUGGESTIONS
  // =====================================================

  static async suggestions(
    text = ''
  ) {

    const query =
      String(
        text ?? ''
      ).trim()


    if (!query) {

      return []

    }


    try {

      const results =
        await VehicleSearchIndex.search(
          query
        )


      return Array.isArray(
        results
      )
        ? results
        : []

    }
    catch (error) {

      console.warn(
        '[VehicleAIEngine] Suggestions failed:',
        error
      )

      return []

    }

  }


  // =====================================================
  // GET COMPATIBLE VEHICLES
  // =====================================================

  static getCompatibleVehicles(
    product
  ) {

    if (!product) {

      return []

    }


    const sources = [

      product?.compatibleVehicles,

      product?.compatibility
        ?.compatibleVehicles,

      product?.specifications
        ?.compatibleVehicles,

      product?.specification
        ?.compatibleVehicles,

      product?.attributes
        ?.compatibleVehicles

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


  // =====================================================
  // TEXT MATCH
  // =====================================================

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


    return (
      value === wanted ||
      value.includes(wanted) ||
      wanted.includes(value)
    )

  }


  // =====================================================
  // LEGACY COMPATIBLE VEHICLE MATCH
  // =====================================================

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


      return true

    }


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
          'VehicleType',
          'type',
          'Type',
          'vehicle_type',
          'category'
        ]
      )


    const make =
      this.getVehicleField(
        compatibleVehicle,
        [
          'make',
          'Make',
          'brand',
          'Brand',
          'manufacturer',
          'Manufacturer',
          'vehicleBrand'
        ]
      )


    const model =
      this.getVehicleField(
        compatibleVehicle,
        [
          'model',
          'Model',
          'modelName',
          'ModelName',
          'vehicleModel',
          'model_name'
        ]
      )


    if (
      search?.vehicleType &&
      vehicleType
    ) {

      if (
        this.normalizeType(
          vehicleType
        ) !==
        this.normalizeType(
          search.vehicleType
        )
      ) {

        return false

      }

    }


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


    if (
      search?.year &&
      !this.yearMatches(
        compatibleVehicle,
        search.year
      )
    ) {

      return false

    }


    return true

  }


  // =====================================================
  // LEGACY PRODUCT MATCH
  // =====================================================

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


  // =====================================================
  // RESOLVE TEXT QUERY
  // =====================================================

  static async resolveTextQuery(
    text,
    products = []
  ) {

    const query =
      String(
        text ?? ''
      ).trim()


    if (!query) {

      return {

        query,

        vehicle:
          null,

        suggestions:
          [],

        result:
          null,

        products:
          []

      }

    }


    console.log(
      '[VehicleAIEngine] RESOLVE TEXT QUERY',
      {
        query,
        productsCount:
          Array.isArray(products)
            ? products.length
            : 0
      }
    )


    const parsed =
      await this.parse(
        query
      )


    const suggestions =
      await this.suggestions(
        query
      )


    if (!parsed) {

      return {

        query,

        vehicle:
          null,

        suggestions,

        result:
          null,

        products:
          []

      }

    }


    const safeProducts =
      Array.isArray(
        products
      )
        ? products
        : []


    try {

      console.log(
        '[VehicleAIEngine] CALLING VehicleEngine',
        {
          vehicleType:
            parsed.vehicleType,

          make:
            parsed.make,

          model:
            parsed.model,

          year:
            parsed.year,

          productsCount:
            safeProducts.length
        }
      )


      const result =
        await VehicleEngine.search({

          vehicleType:
            parsed.vehicleType ||
            'car',

          make:
            parsed.make,

          model:
            parsed.model,

          year:
            parsed.year,

          products:
            safeProducts

        })


      console.log(
        '[VehicleAIEngine] VehicleEngine RESULT',
        result
      )


      return {

        query,

        vehicle:
          parsed,

        suggestions,

        result,

        products:
          Array.isArray(
            result?.products
          )
            ? result.products
            : []

      }

    }
    catch (error) {

      console.error(
        '[VehicleAIEngine] VehicleEngine text search failed:',
        error
      )


      return {

        query,

        vehicle:
          parsed,

        suggestions,

        result:
          null,

        products:
          []

      }

    }

  }


  // =====================================================
  // SEARCH PRODUCTS BY VEHICLE
  // =====================================================

  static async searchProductsByVehicle(
    params = {}
  ) {

    const products =
      Array.isArray(
        params?.products
      )
        ? params.products
        : []


    let vehicleType =
      params?.vehicleType ??
      params?.type ??
      ''


    let make =
      params?.make ??
      params?.brand ??
      ''


    let model =
      params?.model ??
      ''


    let year =
      params?.year ??
      ''


    const query =
      String(
        params?.query ??
        params?.vehicleQuery ??
        ''
      ).trim()


    if (
      query &&
      (
        !make ||
        !model
      )
    ) {

      const parsed =
        await this.parse(
          query
        )


      if (parsed) {

        vehicleType =
          vehicleType ||
          parsed.vehicleType ||
          'car'

        make =
          make ||
          parsed.make

        model =
          model ||
          parsed.model

        year =
          year ||
          parsed.year

      }

    }


    if (
      !vehicleType &&
      !make &&
      !model &&
      !year
    ) {

      return []

    }


    try {

      const result =
        await VehicleEngine.search({

          vehicleType,

          make,

          model,

          year,

          products

        })


      if (
        result &&
        typeof result === 'object' &&
        Array.isArray(
          result.products
        )
      ) {

        return result.products

      }


      if (
        Array.isArray(result)
      ) {

        return result

      }


      return []

    }
    catch (error) {

      console.warn(
        '[VehicleAIEngine] VehicleEngine search failed:',
        error
      )


      return []

    }

  }


  // =====================================================
  // SEARCH
  // =====================================================

  static async search(
    input = ''
  ) {

    // ===================================================
    // OBJECT MODE
    // ===================================================

    if (
      input &&
      typeof input === 'object' &&
      !Array.isArray(input)
    ) {

      const query =
        String(
          input?.query ??
          input?.vehicleQuery ??
          ''
        ).trim()


      // -------------------------------------------------
      // FREE TEXT OBJECT
      // -------------------------------------------------

      if (query) {

        const resolved =
          await this.resolveTextQuery(
            query,
            input?.products
          )


        return {

          query,

          vehicle:
            resolved.vehicle,

          suggestions:
            resolved.suggestions,

          result:
            resolved.result,

          products:
            resolved.products

        }

      }


      // -------------------------------------------------
      // STRUCTURED OBJECT
      // -------------------------------------------------

      const products =
        await this.searchProductsByVehicle(
          input
        )


      try {

        const vehicleType =
          input?.vehicleType ??
          input?.type ??
          ''


        const make =
          input?.make ??
          input?.brand ??
          ''


        const model =
          input?.model ??
          ''


        const year =
          input?.year ??
          ''


        const engineResult =
          await VehicleEngine.search({

            vehicleType,

            make,

            model,

            year,

            products:
              Array.isArray(
                input?.products
              )
                ? input.products
                : []

          })


        return {

          ...engineResult,

          products:
            Array.isArray(
              engineResult?.products
            )
              ? engineResult.products
              : products

        }

      }
      catch (error) {

        console.warn(
          '[VehicleAIEngine] Structured VehicleEngine result failed:',
          error
        )


        return {

          vehicle:
            null,

          oem:
            null,

          tires:
            [],

          batteries:
            [],

          oils:
            [],

          products

        }

      }

    }


    // ===================================================
    // TEXT MODE
    // ===================================================

    const text =
      String(
        input ?? ''
      ).trim()


    if (!text) {

      return {

        query:
          '',

        vehicle:
          null,

        suggestions:
          [],

        result:
          null,

        products:
          []

      }

    }


    return this.resolveTextQuery(
      text,
      []
    )

  }

}