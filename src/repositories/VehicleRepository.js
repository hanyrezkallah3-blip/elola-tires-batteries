// ======================================================
// EL OLA ERP
// Vehicle Repository
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Provides a stable vehicle contract to the application
// while the underlying vehicleDatabase uses:
//
// brand
//   └── models
//        ├── name
//        ├── years
//        └── tireSizes
//
// The repository converts that structure into the
// vehicle contract expected by the search layer:
//
// {
//   id,
//   type,
//   typeName,
//   make,
//   model,
//   year,
//   yearFrom,
//   yearTo,
//   tires,
//   tireSizes,
//   batteries,
//   oils
// }
//
// IMPORTANT
// ------------------------------------------------------
// This repository is LOCAL VEHICLE MEMORY.
// It does NOT call VehDB.
// It does NOT determine product price.
// It does NOT determine warehouse availability.
// It does NOT determine offers.
//
// Pricing and stock remain the responsibility of the
// existing product / warehouse / offer layers.
// ======================================================

import { vehicleDatabase } from '../data/vehicleDatabase'

// ======================================================
// NORMALIZE
// ======================================================

const normalizeText = value => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

const normalizeYear = value => {
  const year = Number(value)

  return Number.isFinite(year)
    ? year
    : null
}

// ======================================================
// BUILD VEHICLE RECORD
// ======================================================
//
// Converts one nested database model into one stable
// vehicle record.
//
// Example:
//
// Toyota
//   Corolla
//     years: [2018...2024]
//     tireSizes: [...]
//
// becomes:
//
// {
//   make: 'Toyota',
//   model: 'Corolla',
//   yearFrom: 2018,
//   yearTo: 2024,
//   tires: [...]
// }
// ======================================================

const buildVehicleRecord = (
  brandRecord,
  modelRecord,
  year = null
) => {
  if (!brandRecord || !modelRecord) {
    return null
  }

  const years = Array.isArray(modelRecord.years)
    ? modelRecord.years
      .map(normalizeYear)
      .filter(yearValue => yearValue !== null)
      .sort((a, b) => a - b)
    : []

  const tireSizes = Array.isArray(modelRecord.tireSizes)
    ? modelRecord.tireSizes
      .map(size => String(size ?? '').trim())
      .filter(Boolean)
    : []

  const yearFrom = years.length
    ? years[0]
    : null

  const yearTo = years.length
    ? years[years.length - 1]
    : null

  const normalizedRequestedYear = normalizeYear(year)

  return {
    id: `${brandRecord.brand}-${modelRecord.name}`,

    type: 'vehicle',

    typeName: 'Vehicle',

    make: brandRecord.brand,

    brand: brandRecord.brand,

    model: modelRecord.name,

    year: normalizedRequestedYear,

    yearFrom,

    yearTo,

    years,

    tires: [...tireSizes],

    tireSizes: [...tireSizes],

    // Keep these fields available for future local
    // vehicle fitment expansion without inventing data.
    batteries: Array.isArray(modelRecord.batteries)
      ? [...modelRecord.batteries]
      : [],

    oils: Array.isArray(modelRecord.oils)
      ? [...modelRecord.oils]
      : []
  }
}

// ======================================================
// GET ALL FLATTENED VEHICLES
// ======================================================
//
// One database model becomes one repository vehicle
// record. Year remains represented by years/yearFrom/
// yearTo so a single model can cover multiple years.
// ======================================================

const getFlattenedVehicles = () => {
  const vehicles = []

  if (!Array.isArray(vehicleDatabase)) {
    return vehicles
  }

  vehicleDatabase.forEach(brandRecord => {
    if (!brandRecord || !Array.isArray(brandRecord.models)) {
      return
    }

    brandRecord.models.forEach(modelRecord => {
      const vehicle = buildVehicleRecord(
        brandRecord,
        modelRecord
      )

      if (vehicle) {
        vehicles.push(vehicle)
      }
    })
  })

  return vehicles
}

// ======================================================
// REPOSITORY
// ======================================================

export default class VehicleRepository {

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static getVehicleTypes() {
    const vehicles = getFlattenedVehicles()

    if (!vehicles.length) {
      return []
    }

    return [
      {
        id: 'vehicle',
        name: 'Vehicle',
        image: ''
      }
    ]
  }

  // ====================================================
  // MANUFACTURERS
  // ====================================================

  static getManufacturers() {
    if (!Array.isArray(vehicleDatabase)) {
      return []
    }

    return [
      ...new Set(
        vehicleDatabase
          .map(vehicle => vehicle?.brand)
          .filter(Boolean)
      )
    ]
  }

  // ====================================================
  // BRANDS
  // ====================================================

  static getBrands(vehicleType = '') {
    // Current local database contains passenger vehicle
    // data and does not require a type filter.
    //
    // Keep the parameter for compatibility with the
    // existing service contract.

    return this.getManufacturers()
  }

  // ====================================================
  // MODELS
  // ====================================================

  static getModels({
    vehicleType = '',
    brand = ''
  } = {}) {
    if (!brand || !Array.isArray(vehicleDatabase)) {
      return []
    }

    const normalizedBrand = normalizeText(brand)

    const brandRecord = vehicleDatabase.find(
      item =>
        normalizeText(item?.brand) === normalizedBrand
    )

    if (!brandRecord || !Array.isArray(brandRecord.models)) {
      return []
    }

    return [
      ...new Set(
        brandRecord.models
          .map(model => model?.name)
          .filter(Boolean)
      )
    ]
  }

  // ====================================================
  // YEARS
  // ====================================================

  static getYears({
    brand,
    model
  } = {}) {
    if (!brand || !model) {
      return []
    }

    const normalizedBrand = normalizeText(brand)
    const normalizedModel = normalizeText(model)

    const brandRecord = vehicleDatabase.find(
      item =>
        normalizeText(item?.brand) === normalizedBrand
    )

    if (!brandRecord || !Array.isArray(brandRecord.models)) {
      return []
    }

    const modelRecord = brandRecord.models.find(
      item =>
        normalizeText(item?.name) === normalizedModel
    )

    if (!modelRecord || !Array.isArray(modelRecord.years)) {
      return []
    }

    return [
      ...new Set(
        modelRecord.years
          .map(normalizeYear)
          .filter(year => year !== null)
      )
    ].sort((a, b) => a - b)
  }

  // ====================================================
  // FIND LOCAL VEHICLE
  // ====================================================
  //
  // THIS IS THE IMPORTANT PART.
  //
  // A vehicle is considered FOUND when:
  //
  // make + model + requested year
  //
  // exist in local vehicleDatabase.
  //
  // Tire fitment availability is NOT used as the
  // condition for finding the vehicle.
  //
  // Therefore:
  //
  // LOCAL VEHICLE FOUND
  //      ↓
  //      NO VehDB fallback
  //
  // LOCAL VEHICLE NOT FOUND
  //      ↓
  //      VehDB may be used by the controller
  // ====================================================

  static findVehicle({
    make,
    model,
    year
  } = {}) {
    if (!make || !model) {
      return null
    }

    const normalizedMake = normalizeText(make)
    const normalizedModel = normalizeText(model)
    const requestedYear = normalizeYear(year)

    if (requestedYear === null) {
      return null
    }

    if (!Array.isArray(vehicleDatabase)) {
      return null
    }

    const brandRecord = vehicleDatabase.find(
      item =>
        normalizeText(item?.brand) === normalizedMake
    )

    if (!brandRecord || !Array.isArray(brandRecord.models)) {
      return null
    }

    const modelRecord = brandRecord.models.find(
      item =>
        normalizeText(item?.name) === normalizedModel
    )

    if (!modelRecord || !Array.isArray(modelRecord.years)) {
      return null
    }

    const years = modelRecord.years
      .map(normalizeYear)
      .filter(value => value !== null)

    const yearExists = years.includes(requestedYear)

    if (!yearExists) {
      return null
    }

    return buildVehicleRecord(
      brandRecord,
      modelRecord,
      requestedYear
    )
  }

  // ====================================================
  // SEARCH
  // ====================================================

  static search(params = {}) {
    const vehicle = this.findVehicle(params)

    if (!vehicle) {
      return null
    }

    return {
      vehicle,

      tires: Array.isArray(vehicle.tires)
        ? [...vehicle.tires]
        : [],

      batteries: Array.isArray(vehicle.batteries)
        ? [...vehicle.batteries]
        : [],

      oils: Array.isArray(vehicle.oils)
        ? [...vehicle.oils]
        : []
    }
  }

  // ====================================================
  // GET ALL
  // ====================================================
  //
  // Returns the flattened local vehicle contract.
  // This is intentional: consumers should not have to
  // understand the nested structure of vehicleDatabase.
  // ====================================================

  static getAll() {
    return getFlattenedVehicles()
  }

  // ====================================================
  // GET VEHICLE BY ID
  // ====================================================

  static getVehicleById(id) {
    if (!id) {
      return null
    }

    const normalizedId = normalizeText(id)

    return (
      getFlattenedVehicles().find(
        vehicle =>
          normalizeText(vehicle.id) === normalizedId
      ) || null
    )
  }
}