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
//    - Returns OEM / alternative tire sizes when available.
//
// 2. Local Technical Fitment Provider
//    - Local technical fallback.
//    - Provides explicitly stored:
//        * Tire sizes
//        * Battery specifications
//        * Oil specifications
//
// 3. CarQuery
//    - Vehicle catalog fallback.
//
// 4. NHTSA
//    - Final vehicle catalog fallback.
//
// IMPORTANT
// ------------------------------------------------------
// VehDB is NOT an inventory source.
// VehDB is NOT a product source.
// VehDB only supplies vehicle technical data.
//
// Product availability is handled separately.
//
// IMPORTANT LOCAL DATABASE RULE
// ------------------------------------------------------
// LocalTechnicalFitmentProvider is a FALLBACK source.
// It exposes only technical fields actually stored in:
// src/core/database/vehicleDatabase.js
//
// It MUST NOT fabricate:
// - battery compatibility
// - oil compatibility
// - OEM / alternative tire classification
//
// Compatibility and availability remain separate.
//
// ======================================================


import VehDBFitmentProvider
  from './VehDBFitmentProvider'

import LocalTechnicalFitmentProvider
  from './LocalTechnicalFitmentProvider'

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

  return String(value)
    .trim()
}


const normalizeText = value => {

  return normalizeValue(value)
    .toLowerCase()
}


const normalizeArabic = value => {

  return normalizeText(value)
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
}


// ======================================================
// LOCAL RESULT NORMALIZATION
// ======================================================
//
// Keeps the provider contract stable regardless of the
// exact shape returned by LocalTechnicalFitmentProvider.
// ======================================================

const normalizeLocalResult = (
  result,
  {
    make,
    model,
    year,
    vehicleType
  } = {}
) => {

  if (
    !result ||
    typeof result !== 'object'
  ) {
    return null
  }


  const tireSizes = Array.isArray(
    result.tireSizes
  )
    ? result.tireSizes
    : (
        Array.isArray(result.sizes)
          ? result.sizes
          : (
              Array.isArray(result.compatibleSizes)
                ? result.compatibleSizes
                : []
            )
      )


  const batteries = Array.isArray(
    result.batteries
  )
    ? result.batteries
    : []


  const oils = Array.isArray(
    result.oils
  )
    ? result.oils
    : []


  return {

    ...result,

    make:
      result.make ||
      make ||
      '',

    brand:
      result.brand ||
      result.make ||
      make ||
      '',

    model:
      result.model ||
      model ||
      '',

    modelName:
      result.modelName ||
      result.model ||
      model ||
      '',

    year:
      result.year !== undefined &&
      result.year !== null &&
      result.year !== ''
        ? Number(result.year)
        : (
            year !== undefined &&
            year !== null &&
            year !== ''
              ? Number(year)
              : null
          ),

    vehicleType:
      vehicleType ||
      result.vehicleType ||
      null,

    tireSizes,

    sizes:
      Array.isArray(result.sizes)
        ? result.sizes
        : tireSizes,

    compatibleSizes:
      Array.isArray(result.compatibleSizes)
        ? result.compatibleSizes
        : tireSizes,

    compatibleTireSizes:
      Array.isArray(result.compatibleTireSizes)
        ? result.compatibleTireSizes
        : tireSizes,

    oemSizes:
      Array.isArray(result.oemSizes)
        ? result.oemSizes
        : [],

    alternativeSizes:
      Array.isArray(result.alternativeSizes)
        ? result.alternativeSizes
        : [],

    alternateSizes:
      Array.isArray(result.alternateSizes)
        ? result.alternateSizes
        : [],

    batteries,

    oils,

    compatibilityResolved:
      result.compatibilityResolved !== undefined
        ? Boolean(result.compatibilityResolved)
        : Boolean(
            tireSizes.length ||
            batteries.length ||
            oils.length
          ),

    availabilityChecked:
      result.availabilityChecked !== undefined
        ? Boolean(result.availabilityChecked)
        : false,

    source:
      result.source ||
      'local-technical',

    sourceType:
      result.sourceType ||
      'fallback'

  }
}


// ======================================================
// VEHDB RESULT NORMALIZATION
// ======================================================
//
// VehDB currently supplies tire fitment.
// We preserve its existing result and ensure the provider
// contract remains consistent.
// ======================================================

const normalizeVehDBResult = (
  result,
  {
    vehicleType
  } = {}
) => {

  if (
    !result ||
    typeof result !== 'object'
  ) {
    return null
  }


  const tireSizes =
    Array.isArray(result.tireSizes)
      ? result.tireSizes
      : (
          Array.isArray(result.sizes)
            ? result.sizes
            : (
                Array.isArray(result.compatibleSizes)
                  ? result.compatibleSizes
                  : []
              )
        )


  return {

    ...result,

    source:
      'vehdb',

    sourceType:
      'primary',

    vehicleType:
      vehicleType ||
      result.vehicleType ||
      null,

    tireSizes,

    sizes:
      Array.isArray(result.sizes)
        ? result.sizes
        : tireSizes,

    compatibleSizes:
      Array.isArray(result.compatibleSizes)
        ? result.compatibleSizes
        : tireSizes,

    compatibleTireSizes:
      Array.isArray(result.compatibleTireSizes)
        ? result.compatibleTireSizes
        : tireSizes,

    oemSizes:
      Array.isArray(result.oemSizes)
        ? result.oemSizes
        : [],

    alternativeSizes:
      Array.isArray(result.alternativeSizes)
        ? result.alternativeSizes
        : [],

    alternateSizes:
      Array.isArray(result.alternateSizes)
        ? result.alternateSizes
        : [],

    batteries:
      Array.isArray(result.batteries)
        ? result.batteries
        : [],

    oils:
      Array.isArray(result.oils)
        ? result.oils
        : [],

    compatibilityResolved:
      result.compatibilityResolved !== undefined
        ? Boolean(result.compatibilityResolved)
        : Boolean(tireSizes.length),

    availabilityChecked:
      false
  }
}


// ======================================================
// PROVIDER
// ======================================================

export default class VehicleSpecificationProvider {


  // ====================================================
  // GET LOCAL SPECIFICATIONS
  // ====================================================
  //
  // Synchronous compatibility helper preserved for
  // existing callers.
  //
  // Uses the tested local technical provider.
  // ====================================================

  static getLocalSpecifications({

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


    if (
      !normalizedMake ||
      !normalizedModel
    ) {

      return null
    }


    try {

      const result =
        LocalTechnicalFitmentProvider
          .findFitmentSync({

            make:
              normalizedMake,

            model:
              normalizedModel,

            year:
              normalizedYear,

            vehicleType:
              vehicleType || null

          })


      return normalizeLocalResult(
        result,
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear,

          vehicleType:
            vehicleType || null
        }
      )

    } catch (error) {

      console.warn(
        '[VehicleSpecificationProvider] Local technical provider failed:',
        error
      )

      return null
    }
  }


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
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear
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
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear,

          vehicleType
        }
      )


      const vehdbResult =
        await VehDBFitmentProvider
          .findTireFitment({

            make:
              normalizedMake,

            model:
              normalizedModel,

            year:
              normalizedYear

          })


      // =================================================
      // VEHDB SUCCESS
      // =================================================

      if (
        vehdbResult
      ) {

        const normalizedResult =
          normalizeVehDBResult(
            vehdbResult,
            {
              vehicleType
            }
          )


        console.log(
          '[VehicleSpecificationProvider] VehDB fitment found:',
          {
            source:
              normalizedResult?.source,

            make:
              normalizedResult?.make,

            model:
              normalizedResult?.model,

            year:
              normalizedResult?.year,

            oemSizes:
              normalizedResult?.oemSizes ||
              [],

            alternateSizes:
              normalizedResult?.alternateSizes ||
              [],

            sizes:
              normalizedResult?.sizes ||
              [],

            fitments:
              normalizedResult?.fitments ||
              []
          }
        )


        return normalizedResult
      }


      // =================================================
      // VEHDB NO DATA
      // =================================================

      console.warn(
        '[VehicleSpecificationProvider] VehDB returned no fitment:',
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear
        }
      )

    } catch (error) {

      console.warn(
        '[VehicleSpecificationProvider] VehDB failed:',
        error
      )

    }


    // ==================================================
    // 2. LOCAL TECHNICAL FITMENT
    // ==================================================
    //
    // This is the tested fallback containing:
    // - tires
    // - batteries
    // - oils
    //
    // It does NOT inspect Elola inventory.
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Searching local technical fitment:',
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear,

          vehicleType
        }
      )


      const localResult =
        await LocalTechnicalFitmentProvider
          .getSpecifications({

            make:
              normalizedMake,

            model:
              normalizedModel,

            year:
              normalizedYear,

            vehicleType:
              vehicleType || null

          })


      const normalizedLocalResult =
        normalizeLocalResult(
          localResult,
          {
            make:
              normalizedMake,

            model:
              normalizedModel,

            year:
              normalizedYear,

            vehicleType:
              vehicleType || null
          }
        )


      if (
        normalizedLocalResult
      ) {

        console.log(
          '[VehicleSpecificationProvider] Local technical fitment found:',
          {
            source:
              normalizedLocalResult.source,

            sourceType:
              normalizedLocalResult.sourceType,

            make:
              normalizedLocalResult.make,

            model:
              normalizedLocalResult.model,

            year:
              normalizedLocalResult.year,

            tireSizes:
              normalizedLocalResult.tireSizes,

            batteries:
              normalizedLocalResult.batteries,

            oils:
              normalizedLocalResult.oils
          }
        )


        return normalizedLocalResult
      }


      console.warn(
        '[VehicleSpecificationProvider] Local technical database has no exact technical match:',
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear
        }
      )

    } catch (error) {

      console.warn(
        '[VehicleSpecificationProvider] Local technical fitment failed:',
        error
      )

    }


    // ==================================================
    // 3. CARQUERY FALLBACK
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Trying CarQuery fallback:',
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear
        }
      )


      const carQueryResult =
        await CarQueryProvider.findVehicle({

          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear

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
            vehicleType ||
            null,

          source:
            carQueryResult.source ||
            'carquery',

          availabilityChecked:
            false
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
    // 4. NHTSA FALLBACK
    // ==================================================

    try {

      console.log(
        '[VehicleSpecificationProvider] Trying NHTSA fallback:',
        {
          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear
        }
      )


      const nhtsaResult =
        await NHTSAProvider.findVehicle({

          make:
            normalizedMake,

          model:
            normalizedModel,

          year:
            normalizedYear

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
            vehicleType ||
            null,

          source:
            nhtsaResult.source ||
            'nhtsa',

          availabilityChecked:
            false
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
        make:
          normalizedMake,

        model:
          normalizedModel,

        year:
          normalizedYear
      }
    )


    return null
  }

}