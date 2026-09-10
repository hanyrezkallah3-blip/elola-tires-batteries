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
// Multilingual Alias Resolution
//    ↓
// VehiclesDB Local Vehicle Resolution
//    ↓
// Resolve make
//    ↓
// Resolve model
//    ↓
// Resolve year
//    ↓
// VehicleEngine
//    ↓
// OEMCompatibilityEngine
//    ↓
// VehicleSpecificationProvider
//    ↓
// Technical product compatibility
//
// VEHICLE IDENTIFICATION PROVIDER PRIORITY
// -----------------------------------------------------
//
// 1. Multilingual aliases
// 2. VehiclesDB local catalog
// 3. NHTSA fallback
// 4. Local VehicleSearchIndex
//
// TECHNICAL FITMENT PROVIDER PRIORITY
// -----------------------------------------------------
//
// VehicleAIEngine does NOT resolve technical fitment
// directly.
//
// VehicleSpecificationProvider owns:
//
// 1. VehDB technical fitment when available
// 2. LocalTechnicalFitmentProvider fallback
// 3. CarQuery fallback
// 4. NHTSA fallback
//
// IMPORTANT
// -----------------------------------------------------
//
// VehicleAIEngine does NOT decide product availability.
//
// Warehouse stock, prices and availability are handled
// separately by the product/search layer.
//
// Compatibility and availability are separate concepts.
//
// =====================================================


// =====================================================
// IMPORTS
// =====================================================

import VehicleProvider
  from '../vehicles/VehicleProvider'

import VehiclesDBLocalSource
  from '../vehicles/VehiclesDBLocalSource'

import VehicleSearchIndex
  from '../search/VehicleSearchIndex'

import NHTSAProvider
  from '../vehicles/providers/NHTSAProvider'

import VehicleEngine
  from './VehicleEngine'


// =====================================================
// COMMON VEHICLE MAKE FALLBACK
// =====================================================

const COMMON_VEHICLE_MAKES = [

  'Toyota',
  'Lexus',
  'Honda',
  'Nissan',
  'Infiniti',
  'Mazda',
  'Mitsubishi',
  'Subaru',
  'Suzuki',
  'Hyundai',
  'Kia',
  'Genesis',
  'Ford',
  'Lincoln',
  'Chevrolet',
  'GMC',
  'Cadillac',
  'Buick',
  'Chrysler',
  'Dodge',
  'Jeep',
  'Ram',
  'Tesla',
  'Volkswagen',
  'Audi',
  'BMW',
  'Mercedes-Benz',
  'Mercedes',
  'Porsche',
  'Volvo',
  'Land Rover',
  'Range Rover',
  'Jaguar',
  'Peugeot',
  'Renault',
  'Citroen',
  'Fiat',
  'Alfa Romeo',
  'Skoda',
  'Seat',
  'Opel',
  'Isuzu',
  'Hino',
  'Maserati',
  'Bentley',
  'Rolls-Royce',
  'Ferrari',
  'Lamborghini',
  'McLaren'

]


// =====================================================
// MULTILINGUAL VEHICLE ALIASES
// =====================================================
//
// These aliases are only a resolution layer.
//
// INTERNAL/CANONICAL VALUE:
// English vehicle make/model.
//
// USER INPUT:
// Arabic, English, transliterated or localized text.
//
// This keeps the rest of Elola architecture unchanged.
//
// The registry can be extended without changing the
// vehicle search engine itself.
// =====================================================

const VEHICLE_ALIASES = {

  makes: {

    Toyota: [
      'toyota',
      'تويوتا',
      'تيوتا'
    ],

    Lexus: [
      'lexus',
      'لكزس',
      'لكزس'
    ],

    Honda: [
      'honda',
      'هوندا'
    ],

    Nissan: [
      'nissan',
      'نيسان'
    ],

    Infiniti: [
      'infiniti',
      'انفينيتي',
      'إنفينيتي'
    ],

    Mazda: [
      'mazda',
      'مازدا'
    ],

    Mitsubishi: [
      'mitsubishi',
      'ميتسوبيشي',
      'متسوبيشي'
    ],

    Subaru: [
      'subaru',
      'سوبارو'
    ],

    Suzuki: [
      'suzuki',
      'سوزوكي'
    ],

    Hyundai: [
      'hyundai',
      'هيونداي',
      'هونداي',
      'هيوندي'
    ],

    Kia: [
      'kia',
      'كيا'
    ],

    Genesis: [
      'genesis',
      'جينيسيس',
      'جينيسس'
    ],

    Ford: [
      'ford',
      'فورد'
    ],

    Lincoln: [
      'lincoln',
      'لينكولن'
    ],

    Chevrolet: [
      'chevrolet',
      'chevy',
      'شيفروليه',
      'شفروليه'
    ],

    GMC: [
      'gmc',
      'جي ام سي',
      'جيمسي',
      'جي إم سي'
    ],

    Cadillac: [
      'cadillac',
      'كاديلاك'
    ],

    Buick: [
      'buick',
      'بويك'
    ],

    Chrysler: [
      'chrysler',
      'كرايسلر'
    ],

    Dodge: [
      'dodge',
      'دودج'
    ],

    Jeep: [
      'jeep',
      'جيب'
    ],

    Ram: [
      'ram',
      'رام'
    ],

    Tesla: [
      'tesla',
      'تسلا'
    ],

    Volkswagen: [
      'volkswagen',
      'vw',
      'فولكسفاجن',
      'فولكس واجن',
      'فولكس فاجن'
    ],

    Audi: [
      'audi',
      'اودي',
      'أودي'
    ],

    BMW: [
      'bmw',
      'بي ام دبليو',
      'بي إم دبليو'
    ],

    'Mercedes-Benz': [
      'mercedes benz',
      'mercedes-benz',
      'mercedes',
      'مرسيدس',
      'مرسيدس بنز'
    ],

    Mercedes: [
      'mercedes',
      'مرسيدس',
      'mercedes benz',
      'mercedes-benz',
      'مرسيدس بنز'
    ],

    Porsche: [
      'porsche',
      'بورشه',
      'بورش'
    ],

    Volvo: [
      'volvo',
      'فولفو'
    ],

    'Land Rover': [
      'land rover',
      'لاند روفر',
      'لاندروفر'
    ],

    'Range Rover': [
      'range rover',
      'رينج روفر',
      'رينجروفر'
    ],

    Jaguar: [
      'jaguar',
      'جاكوار'
    ],

    Peugeot: [
      'peugeot',
      'بيجو'
    ],

    Renault: [
      'renault',
      'رينو'
    ],

    Citroen: [
      'citroen',
      'سيتروين'
    ],

    Fiat: [
      'fiat',
      'فيات'
    ],

    'Alfa Romeo': [
      'alfa romeo',
      'الفا روميو',
      'ألفا روميو'
    ],

    Skoda: [
      'skoda',
      'سكودا'
    ],

    Seat: [
      'seat',
      'سيات'
    ],

    Opel: [
      'opel',
      'اوبل',
      'أوبل'
    ],

    Isuzu: [
      'isuzu',
      'ايسوزو',
      'إيسوزو'
    ],

    Hino: [
      'hino',
      'هينو'
    ],

    Maserati: [
      'maserati',
      'مازيراتي'
    ],

    Bentley: [
      'bentley',
      'بنتلي'
    ],

    'Rolls-Royce': [
      'rolls royce',
      'rolls-royce',
      'رولز رويس',
      'رولزرويس'
    ],

    Ferrari: [
      'ferrari',
      'فيراري'
    ],

    Lamborghini: [
      'lamborghini',
      'لامبورجيني',
      'لامبورغيني'
    ],

    McLaren: [
      'mclaren',
      'ماكلارين'
    ]

  },


  models: {

    Corolla: [
      'corolla',
      'كورولا'
    ],

    Camry: [
      'camry',
      'كامري',
      'كامرى'
    ],

    RAV4: [
      'rav4',
      'rav 4',
      'rav-4',
      'راف 4',
      'راف4',
      'راف فور'
    ],

    Elantra: [
      'elantra',
      'النترا',
      'إلنترا',
      'الانترا',
      'النترا'
    ],

    Tucson: [
      'tucson',
      'توسان'
    ],

    Cerato: [
      'cerato',
      'سيراتو'
    ],

    Sportage: [
      'sportage',
      'سبورتاج',
      'سبورتج'
    ],

    Sunny: [
      'sunny',
      'صني',
      'سني',
      'صونى'
    ],

    Qashqai: [
      'qashqai',
      'qash qai',
      'قشقاي',
      'قشقائي',
      'قشقاي'
    ],

    Lancer: [
      'lancer',
      'لانسر'
    ],

    Pajero: [
      'pajero',
      'باجيرو'
    ]

  }

}


// =====================================================
// ENGINE
// =====================================================

export default class VehicleAIEngine {


  // =====================================================
  // NORMALIZE
  // =====================================================

  static normalize(
    text = ''
  ) {

    return String(
      text ?? ''
    )
      .toLowerCase()
      .replace(
        /أ|إ|آ/g,
        'ا'
      )
      .replace(
        /ة/g,
        'ه'
      )
      .replace(
        /ى/g,
        'ي'
      )
      .replace(
        /ؤ/g,
        'و'
      )
      .replace(
        /ئ/g,
        'ي'
      )
      .replace(
        /ـ/g,
        ''
      )
      .replace(
        /[\u064B-\u065F\u0670]/g,
        ''
      )
      .replace(
        /[\u2010-\u2015]/g,
        '-'
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
  }


  // =====================================================
  // GET ALIAS VALUES
  // =====================================================

  static getAliasValues(
    item,
    type = ''
  ) {

    const aliases = []


    if (
      typeof item === 'string' ||
      typeof item === 'number'
    ) {

      aliases.push(
        String(item)
      )
    }


    if (
      item &&
      typeof item === 'object'
    ) {

      const fields = [

        'aliases',
        'alias',
        'localizedNames',
        'localizedName',
        'translations',
        'translation',
        'names',

        'nameAr',
        'arabicName',
        'arabic_name',
        'arName',
        'nameArabic',

        'nameEn',
        'englishName',
        'english_name',
        'enName',
        'nameEnglish',

        'modelNameAr',
        'arabicModelName',

        'makeNameAr',
        'arabicMakeName',

        'labelAr',
        'arabicLabel'

      ]


      for (
        const field
        of fields
      ) {

        const value =
          item?.[field]


        if (
          Array.isArray(value)
        ) {

          aliases.push(
            ...value
          )

          continue
        }


        if (
          value &&
          typeof value === 'object'
        ) {

          aliases.push(
            ...Object.values(
              value
            )
          )

          continue
        }


        if (
          value !== null &&
          value !== undefined &&
          String(value).trim()
        ) {

          aliases.push(
            String(value)
          )
        }
      }
    }


    if (
      type === 'make'
    ) {

      const canonical =
        this.getVehicleField(
          item,
          [
            'make',
            'brand',
            'manufacturer',
            'name',
            'label',
            'value',
            'makeName',
            'brandName'
          ]
        )


      if (canonical) {

        aliases.push(
          ...(
            VEHICLE_ALIASES.makes[
              String(canonical).trim()
            ] || []
          )
        )
      }
    }


    if (
      type === 'model'
    ) {

      const canonical =
        this.getVehicleField(
          item,
          [
            'model',
            'modelName',
            'name',
            'label',
            'value'
          ]
        )


      if (canonical) {

        aliases.push(
          ...(
            VEHICLE_ALIASES.models[
              String(canonical).trim()
            ] || []
          )
        )
      }
    }


    return [
      ...new Set(
        aliases
          .filter(
            value =>
              value !== null &&
              value !== undefined
          )
          .map(
            value =>
              String(value).trim()
          )
          .filter(Boolean)
      )
    ]
  }


  // =====================================================
  // CANONICAL MAKE FROM ALIAS
  // =====================================================

  static resolveCanonicalMake(
    text = ''
  ) {

    const query =
      this.normalize(
        text
      )


    if (!query) {
      return null
    }


    let best = null
    let bestScore = 0


    for (
      const [canonical, aliases]
      of Object.entries(
        VEHICLE_ALIASES.makes
      )
    ) {

      const values = [
        canonical,
        ...aliases
      ]


      for (
        const alias
        of values
      ) {

        const normalizedAlias =
          this.normalize(
            alias
          )


        if (!normalizedAlias) {
          continue
        }


        const fullScore =
          this.matchScore(
            normalizedAlias,
            query
          )


        if (
          fullScore > bestScore
        ) {

          bestScore =
            fullScore

          best = {

            make:
              canonical,

            brand:
              canonical,

            manufacturer:
              canonical,

            matchedAlias:
              alias,

            score:
              fullScore,

            source:
              'multilingual-alias'

          }
        }


        const queryTokens =
          this.tokenize(
            query
          )


        for (
          const token
          of queryTokens
        ) {

          if (
            /^(19|20)\d{2}$/.test(
              token
            )
          ) {
            continue
          }


          const tokenScore =
            this.matchScore(
              normalizedAlias,
              token
            )


          if (
            tokenScore > bestScore
          ) {

            bestScore =
              tokenScore

            best = {

              make:
                canonical,

              brand:
                canonical,

              manufacturer:
                canonical,

              matchedAlias:
                alias,

              score:
                tokenScore,

              source:
                'multilingual-alias'

            }
          }
        }
      }
    }


    if (
      best &&
      bestScore >= 70
    ) {

      return best
    }


    return null
  }


  // =====================================================
  // CANONICAL MODEL FROM ALIAS
  // =====================================================

  static resolveCanonicalModel(
    text = '',
    make = ''
  ) {

    const query =
      this.normalize(
        text
      )


    const normalizedMake =
      this.normalize(
        make
      )


    if (
      !query
    ) {
      return null
    }


    let best = null
    let bestScore = 0


    for (
      const [canonical, aliases]
      of Object.entries(
        VEHICLE_ALIASES.models
      )
    ) {

      const values = [
        canonical,
        ...aliases
      ]


      for (
        const alias
        of values
      ) {

        const normalizedAlias =
          this.normalize(
            alias
          )


        if (!normalizedAlias) {
          continue
        }


        let score =
          this.matchScore(
            normalizedAlias,
            query
          )


        const queryWithoutYear =
          query.replace(
            /(19|20)\d{2}/g,
            ' '
          )


        score =
          Math.max(
            score,
            this.matchScore(
              normalizedAlias,
              queryWithoutYear
            )
          )


        const tokens =
          this.tokenize(
            queryWithoutYear
          )


        for (
          const token
          of tokens
        ) {

          if (
            normalizedMake &&
            token === normalizedMake
          ) {
            continue
          }


          const tokenScore =
            this.matchScore(
              normalizedAlias,
              token
            )


          score =
            Math.max(
              score,
              tokenScore
            )
        }


        if (
          score > bestScore
        ) {

          bestScore =
            score

          best = {

            model:
              canonical,

            modelName:
              canonical,

            matchedAlias:
              alias,

            score,

            source:
              'multilingual-alias'

          }
        }
      }
    }


    if (
      best &&
      bestScore >= 70
    ) {

      return best
    }


    return null
  }


  // =====================================================
  // RESOLVE MAKE FROM LOCAL ALIASES
  // =====================================================

  static resolveMakeFromLocalAliases(
    text = ''
  ) {

    const resolved =
      this.resolveCanonicalMake(
        text
      )


    if (!resolved) {
      return null
    }


    return {

      ...resolved,

      source:
        'multilingual-alias'

    }
  }


  // =====================================================
  // RESOLVE MODEL FROM LOCAL ALIASES
  // =====================================================
  //
  // IMPORTANT:
  //
  // This function no longer reads the old
  // ../../data/vehicleDatabase structure.
  //
  // It only resolves the canonical multilingual alias.
  // Actual model validation is performed against the
  // VehiclesDB local catalog asynchronously.
  //
  // =====================================================

  static resolveLocalModelAlias(
    query,
    make,
    year = null,
    vehicleType = 'car'
  ) {

    const canonical =
      this.resolveCanonicalModel(
        query,
        make
      )


    if (!canonical) {
      return null
    }


    return {

      make:
        make,

      brand:
        make,

      manufacturer:
        make,

      model:
        canonical.model,

      modelName:
        canonical.model,

      year:
        Number.isFinite(
          Number(year)
        )
          ? Number(year)
          : '',

      years:
        [],

      vehicleType,

      tireSizes:
        [],

      source:
        'multilingual-alias',

      score:
        canonical.score,

      matchedAlias:
        canonical.matchedAlias

    }
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
        'سيارة',
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
        'شاحنة',
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
        'أتوبيس',
        'أتوبيسات',
        'حافله',
        'حافلات',
        'حافلة'
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
        'دراجة',
        'موتوسيكل',
        'موتوسيكلات'
      ].includes(type)
    ) {

      return 'motorcycle'
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

      return (
        await VehicleProvider.getAll()
      ) || []

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] Vehicle database read failed:',
        error
      )

      return []
    }
  }


  // =====================================================
  // FIND BEST MATCH
  // =====================================================

  static async findBest(
    query
  ) {

    try {

      const results =
        await VehicleSearchIndex.search(
          query
        )


      return (
        Array.isArray(results)
          ? results[0]
          : null
      ) || null

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] Vehicle index search failed:',
        error
      )

      return null
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
  // MATCH SCORE
  // =====================================================

  static matchScore(
    actual,
    requested
  ) {

    const a =
      this.normalize(
        actual
      )

    const b =
      this.normalize(
        requested
      )


    if (
      !a ||
      !b
    ) {

      return 0
    }


    if (
      a === b
    ) {

      return 100
    }


    if (
      a.replace(/\s+/g, '') ===
      b.replace(/\s+/g, '')
    ) {

      return 96
    }


    if (
      a.includes(b)
    ) {

      return 88
    }


    if (
      b.includes(a)
    ) {

      return 82
    }


    const aTokens =
      a.split(' ').filter(Boolean)

    const bTokens =
      b.split(' ').filter(Boolean)


    if (
      aTokens.length === 0 ||
      bTokens.length === 0
    ) {

      return 0
    }


    const matched =
      bTokens.filter(
        token =>
          aTokens.some(
            actualToken =>
              actualToken === token ||
              actualToken.includes(token) ||
              token.includes(actualToken)
          )
      ).length


    if (
      matched === bTokens.length
    ) {

      return 76
    }


    return (
      matched /
      bTokens.length
    ) * 60
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
      .split(
        /[\s,،;؛|/]+/
      )
      .filter(
        Boolean
      )
  }


  // =====================================================
  // GET REQUESTED VEHICLE TYPE
  // =====================================================

  static getRequestedVehicleType(
    text = ''
  ) {

    const query =
      this.normalize(
        text
      )


    const tokens =
      this.tokenize(
        query
      )


    for (
      const token
      of tokens
    ) {

      const type =
        this.normalizeType(
          token
        )


      if (
        [
          'car',
          'truck',
          'bus',
          'motorcycle'
        ].includes(type)
      ) {

        return type
      }
    }


    return 'car'
  }


  // =====================================================
  // RESOLVE MAKE FROM VEHDB
  // =====================================================
  //
  // Historical method name is preserved so existing
  // callers do not break.
  //
  // IMPORTANT:
  // It no longer calls VehDB.
  //
  // Vehicle identification is local-first through
  // VehiclesDBLocalSource, followed by NHTSA.
  //
  // Technical VehDB fitment is handled later by
  // VehicleSpecificationProvider.
  //
  // =====================================================

  static async resolveMakeFromVehDB(
    text = ''
  ) {

    const query =
      this.normalize(
        text
      )


    if (!query) {

      return null
    }


    const vehicleType =
      this.getRequestedVehicleType(
        query
      )


    // ===================================================
    // 0. MULTILINGUAL ALIAS
    // ===================================================

    const localAliasResolved =
      this.resolveMakeFromLocalAliases(
        query
      )


    if (localAliasResolved) {

      console.log(
        '[VehicleAIEngine] Multilingual make resolved:',
        {
          query,
          make:
            localAliasResolved.make,
          matchedAlias:
            localAliasResolved.matchedAlias,
          score:
            localAliasResolved.score
        }
      )

      return localAliasResolved
    }


    // ===================================================
    // 1. VEHICLESDB LOCAL CATALOG
    // ===================================================

    try {

      const brands =
        await VehiclesDBLocalSource.getBrands(
          vehicleType
        )


      if (
        Array.isArray(brands) &&
        brands.length > 0
      ) {

        const resolved =
          this.resolveMakeFromBrandList(
            query,
            brands
          )


        if (resolved) {

          console.log(
            '[VehicleAIEngine] VehiclesDB local make resolved:',
            {
              query,
              make:
                resolved.make,
              score:
                resolved.score
            }
          )

          return {

            ...resolved,

            source:
              'vehiclesdb'

          }
        }
      }

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] VehiclesDB local make resolution failed:',
        error
      )
    }


    // ===================================================
    // 2. NHTSA FALLBACK
    // ===================================================

    try {

      const nhtsaBrands =
        await this.getNHTSABrands(
          vehicleType
        )


      if (
        Array.isArray(nhtsaBrands) &&
        nhtsaBrands.length > 0
      ) {

        const resolved =
          this.resolveMakeFromBrandList(
            query,
            nhtsaBrands
          )


        if (resolved) {

          console.log(
            '[VehicleAIEngine] NHTSA make resolved:',
            {
              query,
              make:
                resolved.make,
              score:
                resolved.score
            }
          )

          return {

            ...resolved,

            source:
              'nhtsa'

          }
        }
      }

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] NHTSA make fallback failed:',
        error
      )
    }


    // ===================================================
    // 3. COMMON MAKE FALLBACK
    // ===================================================

    const commonResolved =
      this.resolveMakeFromBrandList(
        query,
        COMMON_VEHICLE_MAKES.map(
          name => ({

            name,

            make:
              name,

            brand:
              name,

            manufacturer:
              name,

            source:
              'common-fallback'

          })
        )
      )


    if (commonResolved) {

      console.log(
        '[VehicleAIEngine] Common make fallback resolved:',
        {
          query,
          make:
            commonResolved.make,
          score:
            commonResolved.score
        }
      )

      return {

        ...commonResolved,

        source:
          'common-fallback'

      }
    }


    console.warn(
      '[VehicleAIEngine] No vehicle make resolved:',
      query
    )


    return null
  }


  // =====================================================
  // GET NHTSA BRANDS
  // =====================================================

  static async getNHTSABrands(
    vehicleType = 'car'
  ) {

    const normalizedType =
      this.normalizeType(
        vehicleType
      )


    const types = [

      normalizedType,

      'car',

      'truck',

      'motorcycle',

      'bus'

    ]


    const uniqueTypes = [
      ...new Set(
        types
          .map(
            type =>
              this.normalizeType(
                type
              )
          )
          .filter(Boolean)
      )
    ]


    const allBrands = []


    for (
      const type
      of uniqueTypes
    ) {

      try {

        const brands =
          await NHTSAProvider.getBrands(
            type
          )


        if (
          Array.isArray(brands) &&
          brands.length
        ) {

          allBrands.push(
            ...brands
          )
        }

      }
      catch (
        error
      ) {

        console.warn(
          '[VehicleAIEngine] NHTSA brand request failed:',
          {
            type,
            error
          }
        )
      }
    }


    const result = []

    const seen =
      new Set()


    for (
      const brand
      of allBrands
    ) {

      const name =
        this.getVehicleField(
          brand,
          [
            'make',
            'brand',
            'manufacturer',
            'name',
            'label',
            'value',
            'makeName',
            'brandName'
          ]
        )


      if (!name) {
        continue
      }


      const key =
        this.normalize(
          name
        )


      if (
        !key ||
        seen.has(key)
      ) {
        continue
      }


      seen.add(key)


      result.push({

        ...(
          typeof brand === 'object'
            ? brand
            : {}
        ),

        name:
          String(name).trim(),

        make:
          String(name).trim(),

        brand:
          String(name).trim(),

        manufacturer:
          String(name).trim(),

        source:
          'nhtsa'

      })
    }


    return result
  }


  // =====================================================
  // RESOLVE MAKE FROM BRAND LIST
  // =====================================================

  static resolveMakeFromBrandList(
    query,
    brands = []
  ) {

    if (
      !Array.isArray(brands) ||
      brands.length === 0
    ) {

      return null
    }


    let best =
      null

    let bestScore =
      0


    for (
      const brand
      of brands
    ) {

      const name =
        this.getVehicleField(
          brand,
          [
            'make',
            'brand',
            'manufacturer',
            'name',
            'label',
            'value',
            'makeName',
            'brandName'
          ]
        )


      if (!name) {
        continue
      }


      const aliases =
        this.getAliasValues(
          brand,
          'make'
        )


      const candidates = [
        name,
        ...aliases
      ]


      for (
        const candidate
        of candidates
      ) {

        const score =
          this.matchScore(
            candidate,
            query
          )


        if (
          score > bestScore
        ) {

          bestScore =
            score

          best = {

            ...(
              typeof brand === 'object'
                ? brand
                : {}
            ),

            make:
              name,

            brand:
              name,

            manufacturer:
              name,

            matchedAlias:
              candidate,

            score

          }
        }
      }
    }


    const tokens =
      this.tokenize(
        query
      )


    for (
      const token
      of tokens
    ) {

      if (
        /^(19|20)\d{2}$/.test(
          token
        )
      ) {
        continue
      }


      for (
        const brand
        of brands
      ) {

        const name =
          this.getVehicleField(
            brand,
            [
              'make',
              'brand',
              'manufacturer',
              'name',
              'label',
              'value',
              'makeName',
              'brandName'
            ]
          )


        if (!name) {
          continue
        }


        const aliases =
          this.getAliasValues(
            brand,
            'make'
          )


        const candidates = [
          name,
          ...aliases
        ]


        for (
          const candidate
          of candidates
        ) {

          const score =
            this.matchScore(
              candidate,
              token
            )


          if (
            score > bestScore
          ) {

            bestScore =
              score

            best = {

              ...(
                typeof brand === 'object'
                  ? brand
                  : {}
              ),

              make:
                name,

              brand:
                name,

              manufacturer:
                name,

              matchedAlias:
                candidate,

              score

            }
          }
        }
      }
    }


    if (
      best &&
      bestScore >= 70
    ) {

      return best
    }


    return null
  }


  // =====================================================
  // LOCAL VEHICLE DATABASE MODEL RESOLUTION
  // =====================================================
  //
  // Historical method name is preserved.
  //
  // The old ../../data/vehicleDatabase structure has
  // been completely removed from this function.
  //
  // VehiclesDBLocalSource is the source of truth for
  // vehicle make/model catalog identification.
  //
  // =====================================================

  static async resolveModelFromLocalDatabase(
    query,
    make,
    year = null,
    vehicleType = 'car'
  ) {

    const normalizedMake =
      this.normalize(
        make
      )


    const normalizedQuery =
      this.normalize(
        query
      )


    if (
      !normalizedMake ||
      !normalizedQuery
    ) {

      return null
    }


    try {

      const models =
        await VehiclesDBLocalSource.getModels({

          brand:
            make,

          vehicleType:
            this.normalizeType(
              vehicleType
            )

        })


      if (
        !Array.isArray(models) ||
        models.length === 0
      ) {

        return null
      }


      const resolved =
        this.resolveModelFromList(
          query,
          make,
          models
        )


      if (!resolved) {

        return null
      }


      const canonicalModel =
        this.resolveCanonicalModel(
          query,
          make
        )


      const finalModel =
        canonicalModel?.model ||
        resolved.model


      const result = {

        ...resolved,

        make:
          make,

        brand:
          make,

        manufacturer:
          make,

        model:
          finalModel,

        modelName:
          finalModel,

        year:
          Number.isFinite(
            Number(year)
          )
            ? Number(year)
            : '',

        vehicleType:
          this.normalizeType(
            vehicleType
          ),

        source:
          'vehiclesdb'

      }


      console.log(
        '[VehicleAIEngine] VehiclesDB local model resolved:',
        {
          make:
            result.make,
          model:
            result.model,
          year:
            result.year,
          matchedAlias:
            result.matchedAlias,
          score:
            result.score
        }
      )


      return result

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] VehiclesDB local model resolution failed:',
        {
          make,
          error
        }
      )

      return null
    }
  }


  // =====================================================
  // RESOLVE MODEL FROM VEHDB
  // =====================================================
  //
  // Historical method name is preserved.
  //
  // IMPORTANT:
  //
  // No VehDB model API call is made here.
  //
  // VehiclesDBLocalSource is intentionally checked before
  // NHTSA so vehicle identification does not consume the
  // exhausted VehDB quota.
  //
  // Technical VehDB fitment remains owned by
  // VehicleSpecificationProvider.
  //
  // =====================================================

  static async resolveModelFromVehDB(
    text = '',
    make = '',
    vehicleType = 'car'
  ) {

    const query =
      this.normalize(
        text
      )


    const normalizedMake =
      this.normalize(
        make
      )


    if (
      !query ||
      !normalizedMake
    ) {

      return null
    }


    const year =
      this.extractYear(
        query
      )


    // ===================================================
    // 0. VEHICLESDB LOCAL CATALOG
    // ===================================================

    const localResolved =
      await this.resolveModelFromLocalDatabase(
        query,
        make,
        year,
        vehicleType
      )


    if (localResolved) {

      return localResolved
    }


    // ===================================================
    // 1. MULTILINGUAL MODEL ALIAS
    // ===================================================

    const localAliasResolved =
      this.resolveLocalModelAlias(
        query,
        make,
        year,
        vehicleType
      )


    if (localAliasResolved) {

      console.log(
        '[VehicleAIEngine] Multilingual model alias resolved:',
        {
          make:
            localAliasResolved.make,
          model:
            localAliasResolved.model,
          matchedAlias:
            localAliasResolved.matchedAlias,
          year:
            localAliasResolved.year
        }
      )

      return localAliasResolved
    }


    // ===================================================
    // 2. NHTSA FALLBACK
    // ===================================================

    try {

      const models =
        await NHTSAProvider.getModels({

          make:
            make,

          brand:
            make,

          year:
            year,

          vehicleType:
            vehicleType

        })


      if (
        Array.isArray(models) &&
        models.length > 0
      ) {

        const resolved =
          this.resolveModelFromList(
            query,
            make,
            models
          )


        if (resolved) {

          console.log(
            '[VehicleAIEngine] NHTSA model resolved:',
            {
              make,
              model:
                resolved.model,
              score:
                resolved.score
            }
          )

          return {

            ...resolved,

            source:
              'nhtsa',

            year:
              Number.isFinite(
                Number(year)
              )
                ? Number(year)
                : (
                    resolved?.year ??
                    ''
                  ),

            vehicleType:
              this.normalizeType(
                vehicleType
              )

          }
        }
      }

    }
    catch (
      error
    ) {

      console.warn(
        '[VehicleAIEngine] NHTSA model resolution failed:',
        {
          make,
          error
        }
      )
    }


    return null
  }


  // =====================================================
  // RESOLVE MODEL FROM LIST
  // =====================================================

  static resolveModelFromList(
    query,
    make,
    models = []
  ) {

    if (
      !Array.isArray(models) ||
      models.length === 0
    ) {

      return null
    }


    const queryWithoutYear =
      query.replace(
        /(19|20)\d{2}/g,
        ' '
      )


    const normalizedMake =
      this.normalize(
        make
      )


    const tokens =
      this.tokenize(
        queryWithoutYear
      )
      .filter(
        token =>
          token !==
          normalizedMake
      )


    let best =
      null

    let bestScore =
      0


    for (
      const model
      of models
    ) {

      const name =
        this.getVehicleField(
          model,
          [
            'model',
            'modelName',
            'name',
            'label',
            'value'
          ]
        )


      if (!name) {
        continue
      }


      const aliases =
        this.getAliasValues(
          model,
          'model'
        )


      const candidates = [
        name,
        ...aliases
      ]


      let score =
        0

      let matchedAlias =
        name


      for (
        const candidate
        of candidates
      ) {

        let candidateScore =
          this.matchScore(
            candidate,
            queryWithoutYear
          )


        candidateScore =
          Math.max(
            candidateScore,
            this.matchScore(
              candidate,
              query
            )
          )


        for (
          const token
          of tokens
        ) {

          const tokenScore =
            this.matchScore(
              candidate,
              token
            )


          candidateScore =
            Math.max(
              candidateScore,
              tokenScore
            )
        }


        if (
          candidateScore > score
        ) {

          score =
            candidateScore

          matchedAlias =
            candidate
        }
      }


      if (
        score > bestScore
      ) {

        bestScore =
          score

        best = {

          ...(
            typeof model === 'object'
              ? model
              : {}
          ),

          make,

          brand:
            make,

          model:
            name,

          modelName:
            name,

          matchedAlias,

          score

        }
      }
    }


    if (
      best &&
      bestScore >= 70
    ) {

      return best
    }


    return null
  }


  // =====================================================
  // RESOLVE VEHICLE DIRECTLY
  // =====================================================
  //
  // Historical method name is preserved.
  //
  // VehicleAIEngine identifies the vehicle only.
  //
  // Technical fitment is intentionally NOT fetched here.
  //
  // VehicleEngine -> OEMCompatibilityEngine ->
  // VehicleSpecificationProvider owns that responsibility.
  //
  // =====================================================

  static async resolveVehicleFromVehDB(
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


    const vehicleType =
      this.getRequestedVehicleType(
        query
      )


    // ---------------------------------------------------
    // MAKE
    // ---------------------------------------------------

    const makeRecord =
      await this.resolveMakeFromVehDB(
        query
      )


    if (!makeRecord) {

      return null
    }


    const make =
      this.getVehicleField(
        makeRecord,
        [
          'make',
          'brand',
          'manufacturer',
          'name',
          'label',
          'value'
        ]
      )


    if (!make) {

      return null
    }


    // ---------------------------------------------------
    // MODEL
    // ---------------------------------------------------

    const modelRecord =
      await this.resolveModelFromVehDB(
        query,
        make,
        vehicleType
      )


    if (!modelRecord) {

      return null
    }


    const model =
      this.getVehicleField(
        modelRecord,
        [
          'model',
          'modelName',
          'name',
          'label',
          'value'
        ]
      )


    if (!model) {

      return null
    }


    // ---------------------------------------------------
    // VEHICLE OBJECT
    // ---------------------------------------------------
    //
    // No VehDB fitment request here.
    //
    // This prevents duplicate technical provider logic
    // and prevents consuming VehDB quota from the AI
    // identification layer.
    //
    // ---------------------------------------------------

    const source =
      modelRecord?.source ||
      makeRecord?.source ||
      'vehiclesdb'


    return {

      vehicle: {

        ...(
          typeof modelRecord === 'object'
            ? modelRecord
            : {}
        ),

        make,

        brand:
          make,

        manufacturer:
          make,

        model,

        modelName:
          model,

        year:
          Number.isFinite(year)
            ? year
            : (
                modelRecord?.year ??
                modelRecord?.modelYear ??
                ''
              ),

        vehicleType:
          vehicleType,

        type:
          vehicleType,

        source

      },

      fitment:
        null

    }
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


    // ===================================================
    // 1. LOCAL VEHICLE IDENTIFICATION
    //    + NHTSA FALLBACK
    // ===================================================

    const resolved =
      await this.resolveVehicleFromVehDB(
        query
      )


    if (
      resolved?.vehicle
    ) {

      const vehicle =
        resolved.vehicle


      return {

        vehicle,

        vehicleType:
          this.normalizeType(
            vehicle?.vehicleType ??
            vehicle?.type ??
            'car'
          ),

        make:
          vehicle?.make ??
          vehicle?.brand ??
          vehicle?.manufacturer ??
          '',

        model:
          vehicle?.model ??
          vehicle?.modelName ??
          '',

        year:
          year ??
          vehicle?.year ??
          vehicle?.modelYear ??
          vehicle?.yearFrom ??
          '',

        fitment:
          resolved.fitment ??
          null

      }
    }


    // ===================================================
    // 2. LOCAL INDEX FALLBACK
    // ===================================================

    const vehicle =
      await this.findBest(
        query
      )


    if (!vehicle) {

      console.warn(
        '[VehicleAIEngine] Vehicle not found in local or fallback sources:',
        query
      )

      return null
    }


    const vehicleType =
      this.normalizeType(
        vehicle?.vehicleType ??
        vehicle?.type ??
        vehicle?.category ??
        'car'
      )


    const make =
      vehicle?.make ??
      vehicle?.brand ??
      vehicle?.manufacturer ??
      ''


    const model =
      vehicle?.model ??
      vehicle?.modelName ??
      vehicle?.vehicleModel ??
      ''


    const resolvedYear =
      year ??
      vehicle?.year ??
      vehicle?.modelYear ??
      vehicle?.yearFrom ??
      ''


    if (
      !make ||
      !model
    ) {

      console.warn(
        '[VehicleAIEngine] Vehicle fallback match is incomplete:',
        {
          query,
          make,
          model,
          year:
            resolvedYear,
          vehicle
        }
      )

      return null
    }


    return {

      vehicle,

      vehicleType,

      make,

      model,

      year:
        resolvedYear,

      fitment:
        null

    }
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
    catch (
      error
    ) {

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
  //
  // LEGACY BACKWARD COMPATIBILITY ONLY.
  //
  // This is NOT the primary technical compatibility
  // mechanism for vehicle search.
  //
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
      const source
      of sources
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

      const actualCanonicalMake =
        this.resolveCanonicalMake(
          make
        )?.make


      const requestedCanonicalMake =
        this.resolveCanonicalMake(
          search.make
        )?.make


      if (
        !this.fieldMatches(
          make,
          search.make
        ) &&
        (
          !actualCanonicalMake ||
          !requestedCanonicalMake ||
          actualCanonicalMake !== requestedCanonicalMake
        )
      ) {

        return false
      }
    }


    if (
      search?.model &&
      model
    ) {

      const canonicalActual =
        this.resolveCanonicalModel(
          model,
          make
        )?.model


      const canonicalRequested =
        this.resolveCanonicalModel(
          search.model,
          search.make
        )?.model


      if (
        !this.fieldMatches(
          model,
          search.model
        ) &&
        (
          !canonicalActual ||
          !canonicalRequested ||
          canonicalActual !== canonicalRequested
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
    catch (
      error
    ) {

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


    // ---------------------------------------------------
    // Multilingual structured input normalization.
    // ---------------------------------------------------

    if (make) {

      const canonicalMake =
        this.resolveCanonicalMake(
          make
        )


      if (canonicalMake) {

        make =
          canonicalMake.make
      }
    }


    if (model) {

      const canonicalModel =
        this.resolveCanonicalModel(
          model,
          make
        )


      if (canonicalModel) {

        model =
          canonicalModel.model
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
    catch (
      error
    ) {

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


      const products =
        await this.searchProductsByVehicle(
          input
        )


      try {

        let vehicleType =
          input?.vehicleType ??
          input?.type ??
          ''


        let make =
          input?.make ??
          input?.brand ??
          ''


        let model =
          input?.model ??
          ''


        const year =
          input?.year ??
          ''


        if (make) {

          const canonicalMake =
            this.resolveCanonicalMake(
              make
            )


          if (canonicalMake) {

            make =
              canonicalMake.make
          }
        }


        if (model) {

          const canonicalModel =
            this.resolveCanonicalModel(
              model,
              make
            )


          if (canonicalModel) {

            model =
              canonicalModel.model
          }
        }


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
      catch (
        error
      ) {

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