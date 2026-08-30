// ======================================================
// EL OLA ERP
// Vehicle Specification Provider
// ======================================================
//
// PRIMARY SOURCE
// ------------------------------------------------------
// The project's own VehicleRepository is the authoritative
// source for vehicle OEM specifications.
//
// Supported:
// - Tire OEM sizes
// - Tire optional sizes
// - Battery specifications
// - Oil specifications
// - Vehicle years
//
// External providers are NOT required for local vehicle
// compatibility.
// ======================================================

import VehicleRepository
  from '../../../data/vehicles/VehicleRepository'


// ======================================================
// NORMALIZE
// ======================================================

const normalize = value =>

  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')


// ======================================================
// FIND VEHICLE
// ======================================================

const findLocalVehicle = ({

  make,

  model,

  year

}) => {

  if (
    !make ||
    !model
  ) {

    return null

  }


  const vehicles =

    VehicleRepository.getAllVehicles()


  const wantedMake =

    normalize(make)


  const wantedModel =

    normalize(model)


  const requestedYear =

    Number(year)


  return vehicles.find(vehicle => {

    const vehicleMake =

      normalize(
        vehicle?.brand ??
        vehicle?.make ??
        vehicle?.brandName ??
        ''
      )


    const vehicleModel =

      normalize(
        vehicle?.model ??
        vehicle?.modelName ??
        ''
      )


    if (
      vehicleMake !== wantedMake ||
      vehicleModel !== wantedModel
    ) {

      return false

    }


    // --------------------------------------------------
    // YEAR
    // --------------------------------------------------

    if (
      Number.isFinite(
        requestedYear
      )
    ) {

      if (
        Array.isArray(
          vehicle?.years
        ) &&
        vehicle.years.length > 0
      ) {

        return vehicle.years.includes(
          requestedYear
        )

      }


      const yearFrom =
        Number(
          vehicle?.yearFrom ??
          vehicle?.year_from ??
          vehicle?.startYear ??
          NaN
        )


      const yearTo =
        Number(
          vehicle?.yearTo ??
          vehicle?.year_to ??
          vehicle?.endYear ??
          NaN
        )


      if (
        Number.isFinite(yearFrom) &&
        Number.isFinite(yearTo)
      ) {

        return (
          requestedYear >= yearFrom &&
          requestedYear <= yearTo
        )

      }


      if (
        Number.isFinite(yearFrom)
      ) {

        return requestedYear >= yearFrom

      }


      if (
        Number.isFinite(yearTo)
      ) {

        return requestedYear <= yearTo

      }

    }


    return true

  }) || null

}


// ======================================================
// PROVIDER
// ======================================================

export default class VehicleSpecificationProvider {

  // ====================================================
  // OEM DATA
  // ====================================================

  static async getSpecifications({

    make,

    model,

    year

  }) {

    const vehicle =

      findLocalVehicle({

        make,

        model,

        year

      })


    if (!vehicle) {

      return null

    }


    return {

      ...vehicle,

      tire:
        vehicle?.tire ??
        null,

      battery:
        vehicle?.battery ??
        null,

      oil:
        vehicle?.oil ??
        null

    }

  }

}