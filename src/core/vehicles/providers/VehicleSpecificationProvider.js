// ======================================================
// EL OLA ERP
// Vehicle Specification Provider
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Central provider for vehicle technical specifications.
//
// PROVIDER ORDER
// ------------------------------------------------------
// 1. VehDB
//    - Primary vehicle tire-fitment source.
//    - Returns OEM tire sizes.
//    - Returns alternative tire sizes.
//
// 2. CarQuery
//    - Fallback vehicle source.
//
// 3. NHTSA
//    - Final fallback vehicle source.
//
// IMPORTANT
// ------------------------------------------------------
// VehDB is NOT an inventory source.
// VehDB is NOT a product source.
// VehDB only supplies vehicle technical data.
//
// Product availability is handled separately.
// ======================================================


import VehDBFitmentProvider
  from './VehDBFitmentProvider'

import CarQueryProvider
  from './CarQueryProvider'

import NHTSAProvider
  from './NHTSAProvider'


// ======================================================
// NORMALIZE
// ======================================================

const normalizeValue = value => {

  if (
    value === null ||
    value === undefined
  ) {
    return ''
  }

  return String(value).trim()
}


// ======================================================
// PROVIDER
// ======================================================

export default class VehicleSpecificationProvider {


  // ====================================================
  // GET SPECIFICATIONS
  // ====================================================

  static async getSpecifications({
    make,
    model,
    year,
    vehicleType
  } = {}) {

    const normalizedMake =
      normalizeValue(make)

    const normalizedModel =
      normalizeValue(model)

    const normalizedYear =
      normalizeValue(year)


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !normalizedMake ||
      !normalizedModel
    ) {

      console.warn(
        '[VehicleSpecificationProvider] Missing vehicle:',
        {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        }
      )

      return null
    }


    // ==================================================
    // 1. VEHDB
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Searching VehDB:',
        {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear,
          vehicleType
        }
      )


      // IMPORTANT
      // ------------------------------------------------
      // VehDBFitmentProvider exposes findTireFitment().
      // It does NOT expose getSpecifications().
      //
      // The previous call to:
      //
      // VehDBFitmentProvider.getSpecifications()
      //
      // caused a TypeError and forced execution into
      // the CarQuery fallback.
      // =================================================

      const vehdbResult =
        await VehDBFitmentProvider
          .findTireFitment({
            make: normalizedMake,
            model: normalizedModel,
            year: normalizedYear
          })


      // ==================================================
      // VEHDB SUCCESS
      // ==================================================

      if (
        vehdbResult
      ) {

        console.log(
          '[VehicleSpecificationProvider] VehDB fitment found:',
          {
            source:
              vehdbResult.source,

            make:
              vehdbResult.make,

            model:
              vehdbResult.model,

            year:
              vehdbResult.year,

            oemSizes:
              vehdbResult.oemSizes || [],

            alternateSizes:
              vehdbResult.alternateSizes || [],

            sizes:
              vehdbResult.sizes || [],

            fitments:
              vehdbResult.fitments || []
          }
        )


        return {

          ...vehdbResult,

          source:
            'vehdb',

          vehicleType:
            vehicleType || null

        }
      }


      // ==================================================
      // VEHDB NO DATA
      // ==================================================

      console.warn(
        '[VehicleSpecificationProvider] VehDB returned no fitment:',
        {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        }
      )

    } catch (error) {

      console.error(
        '[VehicleSpecificationProvider] VehDB failed:',
        error
      )

    }


    // ==================================================
    // 2. CARQUERY FALLBACK
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Trying CarQuery fallback:',
        {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        }
      )


      const carQueryResult =
        await CarQueryProvider.findVehicle({
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        })


      if (
        carQueryResult
      ) {

        console.log(
          '[VehicleSpecificationProvider] Using CarQuery fallback.'
        )


        return {

          ...carQueryResult,

          vehicleType:
            vehicleType || null,

          source:
            carQueryResult.source ||
            'carquery'

        }
      }


      console.warn(
        '[VehicleSpecificationProvider] CarQuery returned no vehicle.'
      )

    } catch (error) {

      console.warn(
        '[VehicleSpecificationProvider] CarQuery failed:',
        error
      )

    }


    // ==================================================
    // 3. NHTSA FALLBACK
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Trying NHTSA fallback:',
        {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        }
      )


      const nhtsaResult =
        await NHTSAProvider.findVehicle({
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear
        })


      if (
        nhtsaResult
      ) {

        console.log(
          '[VehicleSpecificationProvider] Using NHTSA fallback.'
        )


        return {

          ...nhtsaResult,

          vehicleType:
            vehicleType || null,

          source:
            nhtsaResult.source ||
            'nhtsa'

        }
      }


      console.warn(
        '[VehicleSpecificationProvider] NHTSA returned no vehicle.'
      )

    } catch (error) {

      console.warn(
        '[VehicleSpecificationProvider] NHTSA failed:',
        error
      )

    }


    // ==================================================
    // NOTHING FOUND
    // ==================================================

    console.warn(
      '[VehicleSpecificationProvider] No specification source returned data:',
      {
        make: normalizedMake,
        model: normalizedModel,
        year: normalizedYear
      }
    )


    return null
  }
}