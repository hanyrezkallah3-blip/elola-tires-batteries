// ======================================================
// EL OLA ERP
// Vehicle Mapper
// ======================================================

export default class VehicleMapper {

  // ====================================================
  // TO NUMBER
  // ====================================================

  static toNumber(value, fallback = 0) {

    const number = Number(value)

    return Number.isFinite(number)
      ? number
      : fallback

  }

  // ====================================================
  // NORMALIZE TYPE
  // ====================================================

  static normalizeVehicleType(type = '') {

    const value = String(type)
      .toLowerCase()
      .trim()

    if (value.includes('truck'))
      return 'truck'

    if (value.includes('bus'))
      return 'bus'

    if (value.includes('motor'))
      return 'motorcycle'

    if (value.includes('suv'))
      return 'suv'

    if (value.includes('pickup'))
      return 'pickup'

    return 'car'

  }

  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  static mapVehicleTypes(items = []) {

  if (!Array.isArray(items))
    return []

  return items
    .filter(Boolean)
    .map(item => {

      if (typeof item === 'string') {

        return {

          id: item,

          name: item,

          image: ''

        }

      }

      return {

        id:

          item.id ||

          item.value ||

          item.type ||

          item.name ||

          crypto.randomUUID(),

        name:

          item.name ||

          item.label ||

          item.type ||

          '',

        image:

          item.image ||

          ''

      }

    })

}

  // ====================================================
  // BRANDS
  // ====================================================

  static mapBrands(items = []) {

  if (!Array.isArray(items))
    return []

  return items
    .filter(item => item && typeof item === 'object' || typeof item === 'string')
    .map(item => {

      if (typeof item === 'string') {

        return {

          id: item,

          name: item

        }

      }

      return {

        id:

          item?.id ||

          item?.make_id ||

          item?.make ||

          item?.name ||

          item?.make_display ||

          crypto.randomUUID(),

        name:

          item?.name ||

          item?.make_display ||

          item?.make ||

          ''

      }

    })

}
  // ====================================================
  // MODELS
  // ====================================================

  static mapModels(items = []) {

  if (!Array.isArray(items))
    return []

  return items
    .filter(item =>
      item &&
      (
        typeof item === 'object' ||
        typeof item === 'string'
      )
    )
    .map(item => {

      if (typeof item === 'string') {

        return {

          id: item,

          name: item

        }

      }

      return {

        id:

          item?.id ||

          item?.model_id ||

          item?.model ||

          item?.model_name ||

          item?.name ||

          crypto.randomUUID(),

        name:

          item?.name ||

          item?.model_name ||

          item?.model ||

          ''

      }

    })

}

  // ====================================================
  // YEARS
  // ====================================================

  static mapYears(items = []) {

    if (!Array.isArray(items))
      return []

    return items.map(item => {

      const value =

        typeof item === 'object'

          ? (

              item.year ??

              item.name ??

              item.id

            )

          : item

      return {

        id: String(value),

        name: String(value)

      }

    })

  }

  // ====================================================
  // CARQUERY
  // ====================================================

  static fromCarQuery(vehicle = {}) {

    const make =
      vehicle.make_display ||
      vehicle.make_name ||
      vehicle.model_make_display ||
      vehicle.model_make_id ||
      ''

    const model =
      vehicle.model_name ||
      vehicle.model_display ||
      ''

    const yearFrom =
      this.toNumber(
        vehicle.model_year ||
        vehicle.year_from ||
        vehicle.yearFrom,
        1980
      )

    const yearTo =
      this.toNumber(
        vehicle.year_to ||
        vehicle.yearTo,
        new Date().getFullYear()
      )

    const type =
      this.normalizeVehicleType(
        vehicle.vehicle_type ||
        vehicle.type
      )

    return {

      id:
        vehicle.model_id ||
        `${make}-${model}-${yearFrom}`,

      vehicleType: type,

      type,

      typeName: type,

      make,

      model,

      yearFrom,

      yearTo,

      source: 'carquery',

      raw: vehicle

    }

  }

  // ====================================================
  // NHTSA
  // ====================================================

  static fromNHTSA(vehicle = {}) {

    const make =
      vehicle.Make_Name || ''

    const model =
      vehicle.Model_Name || ''

    return {

      id:
        vehicle.Model_ID ||
        `${make}-${model}`,

      vehicleType: 'car',

      type: 'car',

      typeName: 'car',

      make,

      model,

      yearFrom: 1980,

      yearTo: new Date().getFullYear(),

      source: 'nhtsa',

      raw: vehicle

    }

  }

  // ====================================================
  // LOCAL
  // ====================================================

  static fromLocal(vehicle = {}) {

    return {

      ...vehicle,

      source: 'local'

    }

  }

  // ====================================================
  // ARRAY
  // ====================================================

  static mapArray(items = [], mapper) {

    if (!Array.isArray(items))
      return []

    return items.map(mapper)

  }

}