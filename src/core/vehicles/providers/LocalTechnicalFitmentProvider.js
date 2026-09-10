// ======================================================
// EL OLA ERP
// Local Technical Fitment Provider
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Provides local technical vehicle fitment data for:
// - Tires
// - Batteries
// - Oils
//
// IMPORTANT
// ------------------------------------------------------
// This is a LOCAL FALLBACK source.
// It is NOT treated as OEM / authoritative data.
//
// PRIMARY technical source:
// VehDB or another verified technical fitment provider.
//
// This provider exists so the application can still resolve
// technical requirements when the primary source is unavailable.
//
// SOURCE
// ------------------------------------------------------
// src/core/database/vehicleDatabase.js
//
// ======================================================

import vehicleDatabase from '../../database/vehicleDatabase'

// ======================================================
// NORMALIZE
// ======================================================

const normalizeText = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const normalizeNumber = value => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : null
}

// ======================================================
// TIRE NORMALIZATION
// ======================================================

const normalizeTire = tire => {
  if (!tire || typeof tire !== 'object') {
    return null
  }

  const width = normalizeNumber(tire.width)
  const profile = normalizeNumber(tire.profile)
  const rim = normalizeNumber(
    tire.rim ?? tire.rimSize ?? tire.diameter
  )

  if (
    width === null ||
    profile === null ||
    rim === null
  ) {
    return null
  }

  return {
    width,
    profile,
    rim,
    size: `${width}/${profile}R${rim}`
  }
}

// ======================================================
// BATTERY NORMALIZATION
// ======================================================

const normalizeBattery = battery => {
  if (!battery || typeof battery !== 'object') {
    return null
  }

  const capacity = normalizeNumber(
    battery.capacity ??
    battery.ah ??
    battery.ampHours
  )

  if (capacity === null) {
    return null
  }

  return {
    ...battery,
    capacity
  }
}

// ======================================================
// OIL NORMALIZATION
// ======================================================

const normalizeOil = oil => {
  if (!oil || typeof oil !== 'object') {
    return null
  }

  const viscosity = String(
    oil.viscosity ??
    oil.grade ??
    oil.viscosityGrade ??
    ''
  )
    .trim()
    .toUpperCase()

  if (!viscosity) {
    return null
  }

  return {
    ...oil,
    viscosity
  }
}

// ======================================================
// UNIQUE HELPERS
// ======================================================

const uniqueTires = tires => {
  const map = new Map()

  for (const tire of tires) {
    if (!tire?.size) {
      continue
    }

    map.set(tire.size, tire)
  }

  return Array.from(map.values())
}

const uniqueBatteries = batteries => {
  const map = new Map()

  for (const battery of batteries) {
    if (battery?.capacity === null || battery?.capacity === undefined) {
      continue
    }

    map.set(String(battery.capacity), battery)
  }

  return Array.from(map.values())
}

const uniqueOils = oils => {
  const map = new Map()

  for (const oil of oils) {
    if (!oil?.viscosity) {
      continue
    }

    map.set(oil.viscosity, oil)
  }

  return Array.from(map.values())
}

// ======================================================
// VEHICLE MATCH
// ======================================================

const findVehicleEntry = ({
  make,
  model,
  year
} = {}) => {
  const normalizedMake = normalizeText(make)
  const normalizedModel = normalizeText(model)

  const requestedYear =
    year === null ||
    year === undefined ||
    year === ''
      ? null
      : Number(year)

  if (!normalizedMake || !normalizedModel) {
    return null
  }

  if (!Array.isArray(vehicleDatabase)) {
    console.warn(
      '[LocalTechnicalFitmentProvider] vehicleDatabase is not an array'
    )

    return null
  }

  return (
    vehicleDatabase.find(entry => {
      if (!entry) {
        return false
      }

      const entryMake = normalizeText(entry.make)
      const entryModel = normalizeText(entry.model)

      if (
        entryMake !== normalizedMake ||
        entryModel !== normalizedModel
      ) {
        return false
      }

      if (
        requestedYear === null ||
        !Number.isFinite(requestedYear)
      ) {
        return true
      }

      const yearFrom = normalizeNumber(entry.yearFrom)
      const yearTo = normalizeNumber(entry.yearTo)

      if (
        yearFrom === null &&
        yearTo === null
      ) {
        return true
      }

      if (
        yearFrom !== null &&
        requestedYear < yearFrom
      ) {
        return false
      }

      if (
        yearTo !== null &&
        requestedYear > yearTo
      ) {
        return false
      }

      return true
    }) || null
  )
}

// ======================================================
// SPECIFICATION BUILDER
// ======================================================

const buildSpecifications = (
  entry,
  {
    make,
    model,
    year,
    vehicleType
  } = {}
) => {
  if (!entry) {
    return null
  }

  const tires = Array.isArray(entry.tires)
    ? entry.tires
        .map(normalizeTire)
        .filter(Boolean)
    : []

  const batteries = Array.isArray(entry.batteries)
    ? entry.batteries
        .map(normalizeBattery)
        .filter(Boolean)
    : []

  const oils = Array.isArray(entry.oils)
    ? entry.oils
        .map(normalizeOil)
        .filter(Boolean)
    : []

  const uniqueTireValues = uniqueTires(tires)
  const uniqueBatteryValues = uniqueBatteries(batteries)
  const uniqueOilValues = uniqueOils(oils)

  const tireSizes = uniqueTireValues.map(
    tire => tire.size
  )

  return {
    source: 'local-technical',
    sourceType: 'fallback',

    make: entry.make ?? make ?? '',
    brand: entry.make ?? make ?? '',

    model: entry.model ?? model ?? '',
    modelName: entry.model ?? model ?? '',

    year:
      year === null ||
      year === undefined ||
      year === ''
        ? null
        : Number(year),

    yearFrom: entry.yearFrom ?? null,
    yearTo: entry.yearTo ?? null,

    vehicleType: vehicleType ?? null,

    tires: uniqueTireValues,
    tireSizes,

    oemSizes: tireSizes,
    alternativeSizes: [],
    alternateSizes: [],

    compatibleSizes: tireSizes,
    compatibleTireSizes: tireSizes,

    batteries: uniqueBatteryValues,

    oils: uniqueOilValues,

    compatibilityResolved: true,
    availabilityChecked: false,

    raw: {
      ...entry
    }
  }
}

// ======================================================
// PROVIDER
// ======================================================

const LocalTechnicalFitmentProvider = {

  // ====================================================
  // FIND FITMENT
  // ====================================================

  findFitment: async ({
    make,
    model,
    year,
    vehicleType
  } = {}) => {
    console.log(
      '[LocalTechnicalFitmentProvider] Searching local technical database:',
      {
        make,
        model,
        year,
        vehicleType
      }
    )

    const entry = findVehicleEntry({
      make,
      model,
      year
    })

    if (!entry) {
      console.log(
        '[LocalTechnicalFitmentProvider] No technical fitment found:',
        {
          make,
          model,
          year
        }
      )

      return null
    }

    const result = buildSpecifications(
      entry,
      {
        make,
        model,
        year,
        vehicleType
      }
    )

    console.log(
      '[LocalTechnicalFitmentProvider] Technical fitment found:',
      {
        make: result.make,
        model: result.model,
        year: result.year,
        tires: result.tireSizes.length,
        batteries: result.batteries.length,
        oils: result.oils.length
      }
    )

    return result
  },

  // ====================================================
  // ALIAS
  // ====================================================

  getSpecifications: async params =>
    LocalTechnicalFitmentProvider.findFitment(params),

  // ====================================================
  // SYNC LOOKUP
  // ====================================================

  findFitmentSync: params => {
    const entry = findVehicleEntry(params)

    if (!entry) {
      return null
    }

    return buildSpecifications(
      entry,
      params
    )
  },

  // ====================================================
  // DATABASE ACCESS
  // ====================================================

  getAll: () => {
    if (!Array.isArray(vehicleDatabase)) {
      return []
    }

    return vehicleDatabase
      .map(entry =>
        buildSpecifications(entry, {
          make: entry?.make,
          model: entry?.model,
          vehicleType: null
        })
      )
      .filter(Boolean)
  },

  // ====================================================
  // CLEAR
  // ====================================================

  clearCache: () => {
    // No cache used by this local provider.
  }
}

export default LocalTechnicalFitmentProvider