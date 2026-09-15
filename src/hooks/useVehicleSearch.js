// ======================================================
// EL OLA ERP
// useVehicleSearch Hook
// ======================================================

import {
  useMemo,
  useRef,
  useState
} from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleSearchController
  from '../core/controllers/VehicleSearchController'

import VehicleAIEngine
  from '../core/engines/VehicleAIEngine'

import VehiclesDBLocalSource
  from '../core/vehicles/VehiclesDBLocalSource'

// ======================================================
// NORMALIZE
// ======================================================

const normalizeText = value => {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
    .replace(/\u0623|\u0625|\u0622/g, '\u0627')
    .replace(/\u0629/g, '\u0647')
    .replace(/\u0649/g, '\u064A')
    .replace(
      /[\u064B-\u065F\u0670]/g,
      ''
    )
    .replace(/\s+/g, ' ')
}

// ======================================================
// MULTILINGUAL VEHICLE ALIASES
// ======================================================

const VEHICLE_BRAND_ALIASES = {

  toyota: [
    'toyota',
    'طھظˆظٹظˆطھط§',
    'طھظٹظˆطھط§'
  ],

  lexus: [
    'lexus',
    'ظ„ظƒط²ط³',
    'ظ„ظƒط³ط³'
  ],

  honda: [
    'honda',
    'ظ‡ظˆظ†ط¯ط§'
  ],

  nissan: [
    'nissan',
    'ظ†ظٹط³ط§ظ†'
  ],

  infiniti: [
    'infiniti',
    'ط§ظ†ظپظٹظ†ظٹطھظٹ',
    'ط¥ظ†ظپظٹظ†ظٹطھظٹ'
  ],

  mazda: [
    'mazda',
    'ظ…ط§ط²ط¯ط§'
  ],

  mitsubishi: [
    'mitsubishi',
    'ظ…ظٹطھط³ظˆط¨ظٹط´ظٹ',
    'ظ…طھط³ظˆط¨ظٹط´ظٹ'
  ],

  subaru: [
    'subaru',
    'ط³ظˆط¨ط§ط±ظˆ'
  ],

  suzuki: [
    'suzuki',
    'ط³ظˆط²ظˆظƒظٹ'
  ],

  hyundai: [
    'hyundai',
    'ظ‡ظٹظˆظ†ط¯ط§ظٹ',
    'ظ‡ظˆظ†ط¯ط§ظٹ',
    'ظ‡ظٹظˆظ†ط¯ظٹ'
  ],

  kia: [
    'kia',
    'ظƒظٹط§'
  ],

  genesis: [
    'genesis',
    'ط¬ظٹظ†ظٹط³ط³',
    'ط¬ظٹظ†ظٹط³ظٹط²'
  ],

  ford: [
    'ford',
    'ظپظˆط±ط¯'
  ],

  lincoln: [
    'lincoln',
    'ظ„ظٹظ†ظƒظˆظ„ظ†'
  ],

  chevrolet: [
    'chevrolet',
    'ط´ظٹظپط±ظˆظ„ظٹظ‡',
    'ط´ظپط±ظˆظ„ظٹظ‡'
  ],

  gmc: [
    'gmc',
    'ط¬ظٹ ط§ظ… ط³ظٹ',
    'ط¬ظٹ ط¥ظ… ط³ظٹ'
  ],

  cadillac: [
    'cadillac',
    'ظƒط§ط¯ظٹظ„ط§ظƒ'
  ],

  buick: [
    'buick',
    'ط¨ظٹظˆظƒ'
  ],

  chrysler: [
    'chrysler',
    'ظƒط±ط§ظٹط³ظ„ط±'
  ],

  dodge: [
    'dodge',
    'ط¯ظˆط¯ط¬'
  ],

  jeep: [
    'jeep',
    'ط¬ظٹط¨'
  ],

  ram: [
    'ram',
    'ط±ط§ظ…'
  ],

  tesla: [
    'tesla',
    'طھط³ظ„ط§'
  ],

  volkswagen: [
    'volkswagen',
    'vw',
    'ظپظˆظ„ظƒط³ ظپط§ط¬ظ†',
    'ظپظˆظ„ظƒط³ظپط§ط¬ظ†'
  ],

  audi: [
    'audi',
    'ط§ظˆط¯ظٹ',
    'ط£ظˆط¯ظٹ'
  ],

  bmw: [
    'bmw',
    'ط¨ظٹ ط§ظ… ط¯ط¨ظ„ظٹظˆ',
    'ط¨ظٹ ط¥ظ… ط¯ط¨ظ„ظٹظˆ'
  ],

  'mercedes-benz': [
    'mercedes',
    'mercedes-benz',
    'ظ…ط±ط³ظٹط¯ط³',
    'ظ…ط±ط³ظٹط¯ط³ ط¨ظ†ط²'
  ],

  porsche: [
    'porsche',
    'ط¨ظˆط±ط´ظ‡'
  ],

  volvo: [
    'volvo',
    'ظپظˆظ„ظپظˆ'
  ],

  'land rover': [
    'land rover',
    'landrover',
    'ظ„ط§ظ†ط¯ ط±ظˆظپط±'
  ],

  jaguar: [
    'jaguar',
    'ط¬ط§ظƒظˆط§ط±'
  ],

  peugeot: [
    'peugeot',
    'ط¨ظٹط¬ظˆ'
  ],

  renault: [
    'renault',
    'ط±ظٹظ†ظˆ'
  ],

  citroen: [
    'citroen',
    'ط³ظٹطھط±ظˆظٹظ†'
  ],

  fiat: [
    'fiat',
    'ظپظٹط§طھ'
  ],

  'alfa romeo': [
    'alfa romeo',
    'ط§ظ„ظپط§ ط±ظˆظ…ظٹظˆ',
    'ط£ظ„ظپط§ ط±ظˆظ…ظٹظˆ'
  ],

  skoda: [
    'skoda',
    'ط³ظƒظˆط¯ط§'
  ],

  seat: [
    'seat',
    'ط³ظٹط§طھ'
  ],

  opel: [
    'opel',
    'ط§ظˆط¨ظ„',
    'ط£ظˆط¨ظ„'
  ],

  isuzu: [
    'isuzu',
    'ط§ظٹط³ظˆط²ظˆ',
    'ط¥ظٹط³ظˆط²ظˆ'
  ],

  hino: [
    'hino',
    'ظ‡ظٹظ†ظˆ'
  ]

}

// ======================================================
// MODEL ALIASES
// ======================================================

const VEHICLE_MODEL_ALIASES = {

  corolla: [
    'corolla',
    'ظƒظˆط±ظˆظ„ط§'
  ],

  camry: [
    'camry',
    'ظƒط§ظ…ط±ظٹ',
    'ظƒط§ظ…ط±ظ‰'
  ],

  rav4: [
    'rav4',
    'rav 4',
    'rav-4',
    'ط±ط§ظپ 4',
    'ط±ط§ظپ4',
    'ط±ط§ظپ ظپظˆط±'
  ],

  elantra: [
    'elantra',
    'ط§ظ„ظ†طھط±ط§',
    'ط¥ظ„ظ†طھط±ط§',
    'ط§ظ„ط§ظ†طھط±ط§'
  ],

  tucson: [
    'tucson',
    'طھظˆط³ط§ظ†'
  ],

  cerato: [
    'cerato',
    'ط³ظٹط±ط§طھظˆ'
  ],

  sportage: [
    'sportage',
    'ط³ط¨ظˆط±طھط§ط¬',
    'ط³ط¨ظˆط±طھط¬'
  ],

  sunny: [
    'sunny',
    'طµظ†ظٹ',
    'ط³ظ†ظٹ',
    'طµظˆظ†ظ‰'
  ],

  qashqai: [
    'qashqai',
    'qash qai',
    'ظ‚ط´ظ‚ط§ظٹ',
    'ظ‚ط´ظ‚ط§ط¦ظٹ'
  ],

  lancer: [
    'lancer',
    'ظ„ط§ظ†ط³ط±'
  ],

  pajero: [
    'pajero',
    'ط¨ط§ط¬ظٹط±ظˆ'
  ]

}

// ======================================================
// STATIC BRAND â†’ MODEL AUTOCOMPLETE MAP
// ======================================================

const VEHICLE_AUTOCOMPLETE_MODELS = {

  toyota: [
    'corolla',
    'camry',
    'rav4'
  ],

  honda: [],

  nissan: [
    'sunny',
    'qashqai'
  ],

  hyundai: [
    'elantra',
    'tucson'
  ],

  kia: [
    'cerato',
    'sportage'
  ],

  mitsubishi: [
    'lancer',
    'pajero'
  ]

}

// ======================================================
// FORM HELPERS
// ======================================================

const getVehicleType = form => {

  return (
    form?.vehicleType ??
    form?.type ??
    ''
  )
}

const getBrand = form => {

  return (
    form?.brand ??
    form?.make ??
    form?.manufacturer ??
    ''
  )
}

const getModel = form => {

  return (
    form?.model ??
    form?.modelName ??
    ''
  )
}

const getYear = form => {

  return (
    form?.year ??
    form?.modelYear ??
    ''
  )
}

// ======================================================
// FREE TEXT VEHICLE QUERY
// ======================================================

const getVehicleQuery = form => {

  const candidates = [

    form?.query,
    form?.searchQuery,
    form?.searchText,
    form?.vehicleQuery,
    form?.vehicleSearch,
    form?.vehicleText,
    form?.text,
    form?.freeText,
    form?.input,
    form?.value

  ]

  for (
    const value of candidates
  ) {

    const text =
      String(
        value ?? ''
      ).trim()

    if (text) {
      return text
    }

  }

  return ''
}

// ======================================================
// TIRE SIZE PARSER
// ======================================================

const parseTireSize = value => {

  const input =
    String(
      value ?? ''
    )
      .trim()
      .replace(/\s+/g, '')
      .replace(/أ—/g, '*')
      .replace(/x/gi, '*')
      .replace(/-/g, '/')

  if (!input) {
    return null
  }

  // ----------------------------------------------------
  // 205/55/16
  // 205*55*16
  // ----------------------------------------------------

  const threePart =
    input.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )

  if (threePart) {

    return {

      width:
        threePart[1],

      profile:
        threePart[2],

      rim:
        threePart[3],

      format:
        'three-part'

    }

  }

  // ----------------------------------------------------
  // 1200/24
  // 1200*24
  // 24.9/24
  // ----------------------------------------------------

  const twoPart =
    input.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )

  if (twoPart) {

    return {

      width:
        twoPart[1],

      profile:
        '',

      rim:
        twoPart[2],

      format:
        'two-part'

    }

  }

  return null
}

// ======================================================
// FLATTEN SEARCH RESULTS
// ======================================================

const flattenSearchResults = (
  tab,
  data
) => {

  if (
    Array.isArray(data)
  ) {
    return data
  }

  if (
    !data ||
    typeof data !== 'object'
  ) {
    return []
  }

  if (
    tab === 'vehicle'
  ) {

    return [

      ...(
        Array.isArray(
          data.tires
        )
          ? data.tires
          : []
      ),

      ...(
        Array.isArray(
          data.batteries
        )
          ? data.batteries
          : []
      ),

      ...(
        Array.isArray(
          data.oils
        )
          ? data.oils
          : []
      ),

      ...(
        Array.isArray(
          data.parts
        )
          ? data.parts
          : []
      ),

      ...(
        Array.isArray(
          data.products
        )
          ? data.products
          : []
      )

    ]

  }

  if (
    tab === 'tire'
  ) {

    return Array.isArray(
      data.tires
    )
      ? data.tires
      : []

  }

  if (
    tab === 'battery'
  ) {

    return Array.isArray(
      data.batteries
    )
      ? data.batteries
      : []

  }

  if (
    tab === 'oil'
  ) {

    return Array.isArray(
      data.oils
    )
      ? data.oils
      : []

  }

  return []
}

// ======================================================
// DISPLAY NAME
// ======================================================

const getSuggestionName = item => {

  if (
    typeof item === 'string' ||
    typeof item === 'number'
  ) {

    return String(item)

  }

  if (
    !item ||
    typeof item !== 'object'
  ) {

    return ''

  }

  return String(

    item.name ??
    item.brandName ??
    item.brand_name ??
    item.modelName ??
    item.model_name ??
    item.model ??
    item.brand ??
    item.make ??
    item.label ??
    item.title ??
    ''

  ).trim()
}

// ======================================================
// CANONICAL BRAND
// ======================================================

const resolveCanonicalBrand = value => {

  const text =
    String(
      value ?? ''
    ).trim()

  if (!text) {
    return ''
  }

  try {

    const resolved =
      VehicleAIEngine
        .resolveCanonicalMake(
          text
        )

    if (
      resolved?.make
    ) {

      return resolved.make

    }

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] Brand canonicalization failed:',
      error
    )

  }

  const normalized =
    normalizeText(
      text
    )

  for (
    const [
      canonical,
      aliases
    ]
    of Object.entries(
      VEHICLE_BRAND_ALIASES
    )
  ) {

    if (

      normalizeText(
        canonical
      ) === normalized ||

      aliases.some(
        alias =>
          normalizeText(
            alias
          ) === normalized
      )

    ) {

      return canonical

    }

  }

  return text
}

// ======================================================
// CANONICAL MODEL
// ======================================================

const resolveCanonicalModel = (
  value,
  brand = ''
) => {

  const text =
    String(
      value ?? ''
    ).trim()

  if (!text) {
    return ''
  }

  try {

    const resolved =
      VehicleAIEngine
        .resolveCanonicalModel(
          text,
          brand
        )

    if (
      resolved?.model
    ) {

      return resolved.model

    }

    if (
      typeof resolved === 'string'
    ) {

      return resolved

    }

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] Model canonicalization failed:',
      error
    )

  }

  const normalized =
    normalizeText(
      text
    )

  for (
    const [
      canonical,
      aliases
    ]
    of Object.entries(
      VEHICLE_MODEL_ALIASES
    )
  ) {

    if (

      normalizeText(
        canonical
      ) === normalized ||

      aliases.some(
        alias =>
          normalizeText(
            alias
          ) === normalized
      )

    ) {

      return canonical

    }

  }

  return text
}

// ======================================================
// STATIC BRAND CATALOG
// ======================================================

const getStaticBrandCatalog = () => {

  return Object.entries(
    VEHICLE_BRAND_ALIASES
  ).map(
    ([
      canonical,
      aliases
    ]) => {

      return {

        name:
          canonical,

        canonicalName:
          canonical,

        aliases: [
          ...aliases
        ]

      }

    }
  )

}

// ======================================================
// STATIC MODEL CATALOG
// ======================================================

const getStaticModelCatalog = () => {

  return Object.entries(
    VEHICLE_MODEL_ALIASES
  ).map(
    ([
      canonical,
      aliases
    ]) => {

      return {

        name:
          canonical,

        canonicalName:
          canonical,

        aliases: [
          ...aliases
        ]

      }

    }
  )

}

// ======================================================
// GET ALL BRANDS SAFELY
// ======================================================

const getAllBrands = vehicleType => {

  const collected = []

  const addBrands = values => {

    if (
      !Array.isArray(values)
    ) {
      return
    }

    values.forEach(
      value => {

        const name =
          getSuggestionName(
            value
          )

        if (!name) {
          return
        }

        const canonical =
          value?.canonicalName ||
          resolveCanonicalBrand(
            name
          )

        const exists =
          collected.some(
            item =>
              normalizeText(
                item.canonicalName ||
                item.name
              ) ===
              normalizeText(
                canonical
              )
          )

        if (!exists) {

          collected.push({

            ...(
              typeof value === 'object'
                ? value
                : {}
            ),

            name,

            canonicalName:
              canonical

          })

        }

      }
    )

  }

  // ----------------------------------------------------
  // STATIC FIRST
  // ----------------------------------------------------

  addBrands(
    getStaticBrandCatalog()
  )

  // ----------------------------------------------------
  // PROVIDER
  // ----------------------------------------------------

  try {

    addBrands(
      VehicleProvider.getBrands(
        vehicleType
      )
    )

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] VehicleProvider.getBrands(type) failed:',
      error
    )

  }

  // ----------------------------------------------------
  // GLOBAL PROVIDER
  // ----------------------------------------------------

  try {

    addBrands(
      VehicleProvider.getBrands()
    )

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] VehicleProvider.getBrands() failed:',
      error
    )

  }

  return collected
}

// ======================================================
// FILTER BRAND SUGGESTIONS
// ======================================================

const filterBrandSuggestions = (
  query,
  vehicleType
) => {

  const text =
    normalizeText(
      query
    )

  if (!text) {
    return []
  }

  const brands =
    getAllBrands(
      vehicleType
    )

  const results = []

  brands.forEach(
    brand => {

      const name =
        getSuggestionName(
          brand
        )

      const normalizedName =
        normalizeText(
          name
        )

      const canonical =
        brand?.canonicalName ||
        resolveCanonicalBrand(
          name
        )

      const canonicalAliases =
        VEHICLE_BRAND_ALIASES[
          canonical
        ] || []

      const aliases = [

        ...canonicalAliases,

        ...(
          Array.isArray(
            brand?.aliases
          )
            ? brand.aliases
            : []
        )

      ]

      const matches =

        normalizedName.startsWith(
          text
        ) ||

        normalizedName.includes(
          text
        ) ||

        normalizeText(
          canonical
        ).startsWith(
          text
        ) ||

        aliases.some(
          alias => {

            const normalizedAlias =
              normalizeText(
                alias
              )

            return (

              normalizedAlias.startsWith(
                text
              ) ||

              normalizedAlias.includes(
                text
              )

            )

          }
        )

      if (matches) {

        results.push({

          ...brand,

          name,

          canonicalName:
            canonical

        })

      }

    }
  )

  // ----------------------------------------------------
  // ABSOLUTE STATIC FALLBACK
  // ----------------------------------------------------

  Object.entries(
    VEHICLE_BRAND_ALIASES
  ).forEach(
    ([
      canonical,
      aliases
    ]) => {

      const matches =

        normalizeText(
          canonical
        ).startsWith(
          text
        ) ||

        aliases.some(
          alias =>
            normalizeText(
              alias
            ).startsWith(
              text
            )
        )

      if (!matches) {
        return
      }

      const exists =
        results.some(
          item =>
            normalizeText(
              item.canonicalName ||
              item.name
            ) ===
            normalizeText(
              canonical
            )
        )

      if (!exists) {

        results.push({

          name:
            canonical,

          canonicalName:
            canonical,

          aliases: [
            ...aliases
          ]

        })

      }

    }
  )

  return results.slice(
    0,
    12
  )
}

// ======================================================
// GET AUTOCOMPLETE MODELS FOR BRAND
// ======================================================

const getAutocompleteModelsForBrand = (
  brand,
  vehicleType = ''
) => {

  if (!brand) {
    return []
  }

  const canonicalBrand =
    resolveCanonicalBrand(
      brand
    )

  const catalog = []
  const seen = new Set()

  const addModel = model => {

    const name =
      getSuggestionName(
        model
      )

    if (!name) {
      return
    }

    const canonicalName =
      model?.canonicalName ||
      name

    const key =
      normalizeText(
        canonicalName
      )

    if (
      !key ||
      seen.has(key)
    ) {
      return
    }

    seen.add(key)

    const aliases =
      Array.isArray(
        model?.aliases
      )
        ? model.aliases
        : (
            VEHICLE_MODEL_ALIASES[
              canonicalName
            ] || []
          )

    catalog.push({

      ...(
        model &&
        typeof model === 'object'
          ? model
          : {}
      ),

      name,

      canonicalName,

      aliases: [
        ...aliases
      ]

    })

  }

  // ==================================================
  // PRIMARY SOURCE
  // VehiclesDB LOCAL MODEL CATALOG
  // ==================================================

  try {

    const localModels =
      VehiclesDBLocalSource.getModels({

        vehicleType,

        brand:
          canonicalBrand

      })

    if (
      Array.isArray(
        localModels
      )
    ) {

      localModels.forEach(
        addModel
      )

    }

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] VehiclesDB local model catalog failed:',
      error
    )

  }

  // ==================================================
  // FALLBACK
  // Existing static autocomplete catalog
  // ==================================================

  if (
    catalog.length === 0
  ) {

    const modelKeys =
      VEHICLE_AUTOCOMPLETE_MODELS[
        canonicalBrand
      ] || []

    modelKeys.forEach(
      modelKey => {

        const aliases =
          VEHICLE_MODEL_ALIASES[
            modelKey
          ] || []

        addModel({

          name:
            modelKey,

          canonicalName:
            modelKey,

          aliases

        })

      }
    )

  }

  return catalog
}

// FILTER MODEL SUGGESTIONS
// ======================================================

const filterModelSuggestions = (
  query,
  vehicleType,
  brand
) => {

  const models =
    getAutocompleteModelsForBrand(
      brand,
      vehicleType
    )

  const text =
    normalizeText(
      String(
        query ?? ''
      ).trim()
    )

  if (!text) {

    return models.slice(
      0,
      20
    )

  }

  const results = []

  models.forEach(
    model => {

      const name =
        getSuggestionName(
          model
        )

      const normalizedName =
        normalizeText(
          name
        )

      const canonical =
        model?.canonicalName ||
        resolveCanonicalModel(
          name,
          brand
        )

      const aliases =
        Array.isArray(
          VEHICLE_MODEL_ALIASES[
            canonical
          ]
        )
          ? VEHICLE_MODEL_ALIASES[
              canonical
            ]
          : []

      const modelSearchValues = [
        name,
        canonical,
        model?.model,
        model?.modelName,
        model?.name,
        model?.displayName,
        model?.arabicName,
        model?.nameAr,
        model?.modelAr,
        model?.modelNameAr,
        model?.label
      ]

      const searchValues = [
        ...modelSearchValues,
        ...aliases
      ]
        .filter(
          value =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ''
        )
        .map(
          value =>
            normalizeText(
              String(value)
            )
        )

      const matches =
        searchValues.some(
          value =>
            value.startsWith(text) ||
            value.includes(text)
        )

      if (matches) {

        results.push({

          ...model,

          name,

          canonicalName:
            canonical

        })

      }

    }
  )

  return results.slice(
    0,
    20
  )
}

// ======================================================
// PARSE VEHICLE FROM FREE TEXT
// ======================================================

const parseVehicleText = async query => {

  const text =
    String(
      query ?? ''
    ).trim()

  if (!text) {
    return null
  }

  console.log(
    '[useVehicleSearch] AI SEARCH:',
    text
  )

  let parsed = null

  try {

    parsed =
      await VehicleAIEngine.parse(
        text
      )

  }
  catch (error) {

    console.warn(
      '[useVehicleSearch] AI parse failed:',
      error
    )

    return null
  }

  if (!parsed) {

    console.warn(
      '[useVehicleSearch] AI vehicle not found:',
      text
    )

    return null
  }

  const vehicleType =
    parsed.vehicleType ||
    parsed.vehicle?.vehicleType ||
    parsed.vehicle?.type ||
    'car'

  const make =
    parsed.make ||
    parsed.vehicle?.make ||
    parsed.vehicle?.brand ||
    parsed.vehicle?.manufacturer ||
    ''

  const model =
    parsed.model ||
    parsed.vehicle?.model ||
    parsed.vehicle?.modelName ||
    ''

  const year =
    parsed.year ||
    parsed.vehicle?.year ||
    parsed.vehicle?.modelYear ||
    parsed.vehicle?.yearFrom ||
    ''

  const normalized = {

    vehicleType,
    make,
    model,
    year

  }

  console.log(
    '[useVehicleSearch] AI PARSED:',
    normalized
  )

  if (
    !make ||
    !model
  ) {

    console.warn(
      '[useVehicleSearch] AI parsed vehicle is incomplete:',
      normalized
    )

    return null
  }

  return normalized
}

// ======================================================
// SEARCH VEHICLE PRODUCTS
// ======================================================

const searchVehicleProducts = async vehicle => {

  if (
    !vehicle?.make ||
    !vehicle?.model
  ) {
    return []
  }

  try {

    const response =
      await VehicleSearchController
        .searchVehicle({

          vehicleType:
            vehicle.vehicleType ||
            'car',

          make:
            vehicle.make,

          model:
            vehicle.model,

          year:
            vehicle.year || ''

        })

    // --------------------------------------------------
    // VEHICLE SEARCH RESULT CONTRACT
    // --------------------------------------------------
    //
    // VehicleSearchController is the authoritative source
    // for vehicle compatibility results.
    //
    // response.products already contains:
    //
    // 1. Available Elola products
    // 2. Technical tire requirements
    // 3. Technical battery requirements
    // 4. Technical oil requirements
    //
    // Technical compatibility MUST NOT depend on inventory.
    // --------------------------------------------------

    const products =
      Array.isArray(
        response?.products
      )
        ? response.products
        : []

    console.log(
      '[useVehicleSearch] VEHICLE RESULTS:',
      products.length
    )

    console.log(
      '[useVehicleSearch] VEHICLE RESULT CONTRACT:',
      JSON.stringify(
        {
          total:
            products.length,

          available:
            products.filter(
              product =>
                !(
                  product?.technicalRequirement === true ||
                  product?.technicalCompatibility === true
                )
            ).length,

          technical:
            products.filter(
              product =>
                product?.technicalRequirement === true ||
                product?.technicalCompatibility === true
            ).length,

          technicalTypes:
            [
              ...new Set(
                products
                  .map(
                    product =>
                      product?.technicalRequirementType
                  )
                  .filter(Boolean)
              )
            ],

          items:
            products.map(
              product => ({
                id: product?.id,
                name: product?.name,
                type: product?.type,
                technicalRequirement:
                  product?.technicalRequirement,
                technicalCompatibility:
                  product?.technicalCompatibility,
                technicalRequirementType:
                  product?.technicalRequirementType,
                technicalBatteryCapacity:
                  product?.technicalBatteryCapacity,
                technicalOilViscosity:
                  product?.technicalOilViscosity,
                tireSize:
                  product?.tireSize,
                size:
                  product?.size,
                quantity:
                  product?.quantity,
                price:
                  product?.price
              })
            )
        },
        null,
        2
      )
    )

    return products

  }
  catch (error) {

    console.error(
      '[useVehicleSearch] vehicle product search failed:',
      error
    )

    return []
  }
}

// ======================================================
// AI VEHICLE SEARCH
// ======================================================

const searchVehicleAI = async query => {

  const vehicle =
    await parseVehicleText(
      query
    )

  if (!vehicle) {
    return []
  }

  return searchVehicleProducts(
    vehicle
  )
}

// ======================================================
// HOOK
// ======================================================

export default function useVehicleSearch() {

  const [
    loading,
    setLoading
  ] = useState(false)

  const [
    results,
    setResults
  ] = useState([])

  const [
    tireSearchError,
    setTireSearchError
  ] = useState('')

  const [
    form,
    setForm
  ] = useState({

    vehicleType: '',
    brand: '',
    make: '',
    model: '',
    year: '',
    tireSize: '',
    width: '',
    profile: '',
    rim: '',
    capacity: '',
    viscosity: ''

  })

  // ====================================================
  // AUTOCOMPLETE STATE
  // ====================================================

  const [
    brandSuggestions,
    setBrandSuggestions
  ] = useState([])

  const [
    modelSuggestions,
    setModelSuggestions
  ] = useState([])

  const [
    brandsLoading,
    setBrandsLoading
  ] = useState(false)

  const [
    modelsLoading,
    setModelsLoading
  ] = useState(false)

  // ====================================================
  // AUTOCOMPLETE COOLDOWN
  // ====================================================

  const modelAutocompleteCooldownRef =
    useRef(0)

  const suppressModelAutocomplete =
    milliseconds => {

      modelAutocompleteCooldownRef.current =
        Date.now() + milliseconds

    }

  const isModelAutocompleteSuppressed =
    () => {

      return (

        Date.now() <
        modelAutocompleteCooldownRef.current

      )

    }

  // ====================================================
  // MODEL AUTOCOMPLETE DEDUPLICATION
  // ====================================================

  const modelAutocompleteKeyRef =
    useRef('')

  // ----------------------------------------------------
  // Cache the actual computed result.
  //
  // This is important because the form can clear the
  // visible model suggestions while the same autocomplete
  // request is still logically active.
  //
  // The cache lets us restore the exact same result without
  // recalculating or logging the same request again.
  // ----------------------------------------------------

  const modelAutocompleteResultsRef =
    useRef([])

  const resetModelAutocompleteKey =
    () => {

      modelAutocompleteKeyRef.current =
        ''

      modelAutocompleteResultsRef.current =
        []

    }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  const vehicleTypes =
    useMemo(
      () =>
        VehicleProvider
          .getVehicleTypes(),
      []
    )

  // ====================================================
  // BRANDS
  // ====================================================

  const brands =
    useMemo(
      () =>
        VehicleProvider
          .getBrands(
            getVehicleType(
              form
            )
          ),
      [
        form.vehicleType,
        form.type
      ]
    )

  // ====================================================
  // MODELS
  // ====================================================

  const models =
    useMemo(
      () =>
        getAutocompleteModelsForBrand(
          getBrand(
            form
          ),
          getVehicleType(
            form
          )
        ),
      [
        form.brand,
        form.make
      ]
    )

  // ====================================================
  // YEARS
  // ====================================================

  const years =
    useMemo(
      () =>
        VehicleProvider
          .getYears({

            brand:
              getBrand(
                form
              ),

            model:
              getModel(
                form
              )

          }),
      [
        form.brand,
        form.make,
        form.model
      ]
    )

  // ====================================================
  // SUGGEST VEHICLE BRANDS
  // ====================================================

  const suggestVehicleBrands =
    query => {

      const text =
        String(
          query ?? ''
        ).trim()

      console.log(
        '[useVehicleSearch] AUTOCOMPLETE BRAND INPUT:',
        text
      )

      if (!text) {

        setBrandSuggestions([])

        return []

      }

      setBrandsLoading(true)

      try {

        const suggestions =
          filterBrandSuggestions(
            text,
            getVehicleType(
              form
            )
          )

        console.log(
          '[useVehicleSearch] BRAND SUGGESTIONS:',
          {

            query:
              text,

            count:
              suggestions.length,

            suggestions

          }
        )

        setBrandSuggestions(
          suggestions
        )

        return suggestions

      }
      catch (error) {

        console.error(
          '[useVehicleSearch] Brand suggestions failed:',
          error
        )

        setBrandSuggestions([])

        return []

      }
      finally {

        setBrandsLoading(false)

      }

    }

  // ====================================================
  // CLEAR BRAND SUGGESTIONS
  // ====================================================

  const clearBrandSuggestions =
    () => {

      setBrandSuggestions([])

    }

  // ====================================================
  // SELECT VEHICLE BRAND
  // ====================================================

  const selectVehicleBrand =
    brand => {

      const rawBrand =
        getSuggestionName(
          brand
        )

      if (!rawBrand) {
        return
      }

      const canonicalBrand =
        brand?.canonicalName ||
        resolveCanonicalBrand(
          rawBrand
        )

      console.log(
        '[useVehicleSearch] BRAND SELECTED:',
        {

          rawBrand,
          canonicalBrand

        }
      )

      // A different brand starts a new autocomplete cycle.

      resetModelAutocompleteKey()

      modelAutocompleteCooldownRef.current =
        0

      setForm(
        previous => ({

          ...previous,

          brand:
            canonicalBrand,

          make:
            canonicalBrand,

          model:
            '',

          year:
            '',

          vehicleQuery:
            `${canonicalBrand} `

        })
      )

      setBrandSuggestions([])
      setModelSuggestions([])

      return canonicalBrand
    }

  // ====================================================
  // SUGGEST VEHICLE MODELS
  // ====================================================

  const suggestVehicleModels =
    (
      brand,
      query = ''
    ) => {

      // ------------------------------------------------
      // POST-SEARCH COOLDOWN
      // ------------------------------------------------

      if (
        isModelAutocompleteSuppressed()
      ) {

        console.log(
          '[useVehicleSearch] MODEL AUTOCOMPLETE SUPPRESSED AFTER SEARCH'
        )

        return []

      }

      const rawBrand =
        getSuggestionName(
          brand
        )

      if (!rawBrand) {

        setModelSuggestions([])

        return []

      }

      const canonicalBrand =
        brand?.canonicalName ||
        resolveCanonicalBrand(
          rawBrand
        )

      const normalizedQuery =
        normalizeText(
          query
        )

      const vehicleType =
        normalizeText(
          getVehicleType(
            form
          )
        )

      // ------------------------------------------------
      // STABLE AUTOCOMPLETE KEY
      // ------------------------------------------------

      const autocompleteKey =
        [

          vehicleType,

          normalizeText(
            canonicalBrand
          ),

          normalizedQuery

        ].join('|')

      // ------------------------------------------------
      // DUPLICATE REQUEST GUARD
      // ------------------------------------------------

      if (
        modelAutocompleteKeyRef.current ===
        autocompleteKey
      ) {

        // The same logical request has already been
        // calculated. Do not run the filter again and do
        // not emit another autocomplete log.
        //
        // If the UI state was cleared meanwhile, restore
        // the cached result.

        const cachedResults =
          modelAutocompleteResultsRef.current

        if (
          cachedResults.length > 0 &&
          modelSuggestions.length === 0
        ) {

          setModelSuggestions(
            cachedResults
          )

        }

        return cachedResults

      }

      // ------------------------------------------------
      // NEW AUTOCOMPLETE REQUEST
      // ------------------------------------------------

      modelAutocompleteKeyRef.current =
        autocompleteKey

      console.log(
        '[useVehicleSearch] AUTOCOMPLETE MODEL QUERY:',
        {

          brand:
            rawBrand,

          canonicalBrand,

          query

        }
      )

      setModelsLoading(true)

      try {

        const suggestions =
          filterModelSuggestions(
            query,
            getVehicleType(
              form
            ),
            canonicalBrand
          )

        console.log(
          '[useVehicleSearch] MODEL SUGGESTIONS:',
          {

            brand:
              canonicalBrand,

            query,

            count:
              suggestions.length,

            suggestions

          }
        )

        // Store the real result before updating React state.

        modelAutocompleteResultsRef.current =
          suggestions

        setModelSuggestions(
          suggestions
        )

        return suggestions

      }
      catch (error) {

        console.error(
          '[useVehicleSearch] Model suggestions failed:',
          error
        )

        modelAutocompleteResultsRef.current =
          []

        setModelSuggestions([])

        return []

      }
      finally {

        setModelsLoading(false)

      }

    }

  // ====================================================
  // CLEAR MODEL SUGGESTIONS
  // ====================================================

  // IMPORTANT:
  //
  // DO NOT reset modelAutocompleteKeyRef here.
  //
  // VehicleSearchForm calls this while updating the model
  // input. Resetting the key here was the direct cause of
  // repeated autocomplete calls.
  //
  // The cached result and key remain valid until a genuinely
  // new autocomplete cycle begins.

  const clearVehicleModelSuggestions =
    () => {

      setModelSuggestions([])

    }

  // ====================================================
  // SELECT VEHICLE MODEL
  // ====================================================

  const selectVehicleModel =
    model => {

      const rawModel =
        getSuggestionName(
          model
        )

      if (!rawModel) {
        return
      }

      const canonicalModel =
        model?.canonicalName ||
        resolveCanonicalModel(
          rawModel,
          getBrand(
            form
          )
        )

      console.log(
        '[useVehicleSearch] MODEL SELECTED:',
        {

          rawModel,
          canonicalModel

        }
      )

      // New model selection starts a new cycle.

      resetModelAutocompleteKey()

      modelAutocompleteCooldownRef.current =
        0

      setForm(
        previous => ({

          ...previous,

          model:
            canonicalModel,

          vehicleQuery:
            `${getBrand(previous)} ${canonicalModel}`.trim()

        })
      )

      setModelSuggestions([])

      return canonicalModel
    }

  // ====================================================
  // STRUCTURED VEHICLE SEARCH
  // ====================================================

  const searchVehicle =
    async () => {

      const vehicleType =
        getVehicleType(
          form
        )

      const make =
        getBrand(
          form
        )

      const model =
        getModel(
          form
        )

      const year =
        getYear(
          form
        )

      console.log(
        '[useVehicleSearch] VEHICLE SEARCH INPUT:',
        {

          vehicleType,
          make,
          model,
          year

        }
      )

      // --------------------------------------------------
      // NORMAL STRUCTURED SEARCH
      // --------------------------------------------------

      if (
        make &&
        model
      ) {

        const products =
          await searchVehicleProducts({

            vehicleType,
            make,
            model,
            year

          })

        setResults(
          products
        )

        resetModelAutocompleteKey()

        suppressModelAutocomplete(
          1200
        )

        return products

      }

      // --------------------------------------------------
      // FREE TEXT FALLBACK
      // --------------------------------------------------

      const freeText =
        getVehicleQuery(
          form
        )

      if (freeText) {

        console.log(
          '[useVehicleSearch] Structured fields empty; using free-text vehicle search:',
          freeText
        )

        const products =
          await searchVehicleAI(
            freeText
          )

        setResults(
          products
        )

        resetModelAutocompleteKey()

        suppressModelAutocomplete(
          1200
        )

        return products

      }

      // --------------------------------------------------
      // NOTHING TO SEARCH
      // --------------------------------------------------

      console.warn(
        '[useVehicleSearch] Missing make/model and no vehicle text query:',
        {

          vehicleType,
          make,
          model,
          year,
          form

        }
      )

      setResults([])

      resetModelAutocompleteKey()

      suppressModelAutocomplete(
        500
      )

      return []

    }

  // ====================================================
  // TIRE SEARCH
  // ====================================================

  const searchTire =
    async () => {

      let parsed =
        parseTireSize(
          form.tireSize
        )

      if (
        !parsed &&
        form.width &&
        form.rim
      ) {

        parsed = {

          width:
            form.width,

          profile:
            form.profile ||
            '',

          rim:
            form.rim,

          format:
            form.profile
              ? 'three-part'
              : 'two-part'

        }

      }

      if (!parsed) {

        setResults([])

        setTireSearchError(
          'ط§ظƒطھط¨ ظ…ظ‚ط§ط³ ط§ظ„ط¥ط·ط§ط± ط¨ظ‡ط°ط§ ط§ظ„ط´ظƒظ„: 205/55/16 ط£ظˆ 205*55*16 ط£ظˆ 1200/24'
        )

        return []

      }

      const tireResults =
        await VehicleSearchController
          .searchTire({

            width:
              parsed.width,

            profile:
              parsed.profile,

            rim:
              parsed.rim,

            format:
              parsed.format

          })

      const flattened =
        flattenSearchResults(
          'tire',
          tireResults
        )

      setResults(
        flattened
      )

      return flattened

    }

  // ====================================================
  // BATTERY SEARCH
  // ====================================================

  const searchBattery =
    async () => {

      const batteryResults =
        await VehicleSearchController
          .searchBattery({

            capacity:
              form.capacity

          })

      const flattened =
        flattenSearchResults(
          'battery',
          batteryResults
        )

      setResults(
        flattened
      )

      return flattened

    }

  // ====================================================
  // OIL SEARCH
  // ====================================================

  const searchOil =
    async () => {

      const oilResults =
        await VehicleSearchController
          .searchOil({

            viscosity:
              form.viscosity

          })

      const flattened =
        flattenSearchResults(
          'oil',
          oilResults
        )

      setResults(
        flattened
      )

      return flattened

    }

  // ====================================================
  // MAIN SEARCH
  // ====================================================

  const search =
    async tab => {

      setLoading(true)

      if (
        tab === 'tire'
      ) {

        setTireSearchError('')

      }

      // ------------------------------------------------
      // Close autocomplete immediately when the user
      // explicitly starts a search.
      // ------------------------------------------------

      setBrandSuggestions([])

      resetModelAutocompleteKey()

      setModelSuggestions([])

      try {

        switch (tab) {

          case 'vehicle':

            return await searchVehicle()

          case 'tire':

            return await searchTire()

          case 'battery':

            return await searchBattery()

          case 'oil':

            return await searchOil()

          default:

            setResults([])

            return []

        }

      }
      catch (error) {

        console.error(
          '[useVehicleSearch] Search failed:',
          error
        )

        setResults([])

        return []

      }
      finally {

        // ------------------------------------------------
        // Keep model autocomplete closed briefly after
        // vehicle search.
        // ------------------------------------------------

        if (
          tab === 'vehicle'
        ) {

          resetModelAutocompleteKey()

          suppressModelAutocomplete(
            1200
          )

        }

        setLoading(false)

      }

    }

  // ====================================================
  // AI SEARCH
  // ====================================================

  const searchAI =
    async query => {

      setLoading(true)

      setBrandSuggestions([])

      resetModelAutocompleteKey()

      setModelSuggestions([])

      try {

        const products =
          await searchVehicleAI(
            query
          )

        setResults(

          Array.isArray(
            products
          )
            ? products
            : []

        )

        resetModelAutocompleteKey()

        suppressModelAutocomplete(
          1200
        )

        return Array.isArray(
          products
        )
          ? products
          : []

      }
      catch (error) {

        console.error(
          '[useVehicleSearch] searchAI failed:',
          error
        )

        setResults([])

        return []

      }
      finally {

        resetModelAutocompleteKey()

        suppressModelAutocomplete(
          1200
        )

        setLoading(false)

      }

    }

  // ====================================================
  // RETURN
  // ====================================================

  return {

    // --------------------------------------------------
    // Search state
    // --------------------------------------------------

    loading,

    results,

    form,

    setForm,

    // --------------------------------------------------
    // Vehicle data
    // --------------------------------------------------

    vehicleTypes,

    brands,

    models,

    years,

    // --------------------------------------------------
    // Vehicle autocomplete
    // --------------------------------------------------

    brandSuggestions,

    suggestVehicleBrands,

    clearBrandSuggestions,

    selectVehicleBrand,

    brandsLoading,

    modelSuggestions,

    modelsSuggestions:
      modelSuggestions,

    suggestVehicleModels,

    clearVehicleModelSuggestions,

    selectVehicleModel,

    modelsLoading,

    // --------------------------------------------------
    // Search errors
    // --------------------------------------------------

    tireSearchError,

    // --------------------------------------------------
    // Search functions
    // --------------------------------------------------

    search,

    searchAI

  }

}





