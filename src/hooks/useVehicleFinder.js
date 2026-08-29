// ======================================================
// EL OLA ERP
// Vehicle Finder Hook
// ======================================================

import {
  useEffect,
  useState
} from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleSearchController
  from '../controllers/VehicleSearchController'

import VehicleSearchTrackingService
  from '../services/VehicleSearchTrackingService'

import useVehicleSync
  from './useVehicleSync'


export default function useVehicleFinder() {

  // ====================================================
  // FORM STATE
  // ====================================================

  const [
    vehicleType,
    setVehicleType
  ] = useState('')

  const [
    make,
    setMake
  ] = useState('')

  const [
    model,
    setModel
  ] = useState('')

  const [
    year,
    setYear
  ] = useState('')


  // ====================================================
  // OPTIONS
  // ====================================================

  const [
    vehicleTypes,
    setVehicleTypes
  ] = useState([])

  const [
    makes,
    setMakes
  ] = useState([])

  const [
    models,
    setModels
  ] = useState([])

  const [
    years,
    setYears
  ] = useState([])


  // ====================================================
  // RESULT
  // ====================================================

  const [
    result,
    setResult
  ] = useState(null)


  const [
    loading,
    setLoading
  ] = useState(false)


  // ====================================================
  // VEHICLE SYNC
  // ====================================================

  useVehicleSync({

    vehicleType,

    brand:
      make,

    model

  })


  // ====================================================
  // LOAD VEHICLE TYPES
  // ====================================================

  useEffect(() => {

    let cancelled = false


    async function loadVehicleTypes() {

      try {

        const data =
          await VehicleProvider.getVehicleTypes()


        if (
          cancelled
        ) {

          return

        }


        setVehicleTypes(

          Array.isArray(data)
            ? data
            : []

        )

      }

      catch (error) {

        console.error(
          '[useVehicleFinder] vehicle types failed:',
          error
        )


        if (
          !cancelled
        ) {

          setVehicleTypes([])

        }

      }

    }


    loadVehicleTypes()


    return () => {

      cancelled = true

    }

  }, [])


  // ====================================================
  // LOAD BRANDS
  // ====================================================

  useEffect(() => {

    let cancelled = false


    async function loadBrands() {

      if (
        !vehicleType
      ) {

        setMakes([])

        setModels([])

        setYears([])

        setMake('')

        setModel('')

        setYear('')

        return

      }


      try {

        const data =
          await VehicleProvider.getBrands(
            vehicleType
          )


        if (
          cancelled
        ) {

          return

        }


        setMakes(

          Array.isArray(data)
            ? data
            : []

        )

      }

      catch (error) {

        console.error(
          '[useVehicleFinder] brands failed:',
          error
        )


        if (
          !cancelled
        ) {

          setMakes([])

        }

      }

    }


    loadBrands()


    return () => {

      cancelled = true

    }

  }, [
    vehicleType
  ])


  // ====================================================
  // LOAD MODELS
  // ====================================================

  useEffect(() => {

    let cancelled = false


    async function loadModels() {

      if (
        !vehicleType ||
        !make
      ) {

        setModels([])

        setYears([])

        setModel('')

        setYear('')

        return

      }


      try {

        const data =
          await VehicleProvider.getModels({

            vehicleType,

            brand:
              make

          })


        if (
          cancelled
        ) {

          return

        }


        setModels(

          Array.isArray(data)
            ? data
            : []

        )

      }

      catch (error) {

        console.error(
          '[useVehicleFinder] models failed:',
          error
        )


        if (
          !cancelled
        ) {

          setModels([])

        }

      }

    }


    loadModels()


    return () => {

      cancelled = true

    }

  }, [
    vehicleType,
    make
  ])


  // ====================================================
  // LOAD YEARS
  // ====================================================

  useEffect(() => {

    let cancelled = false


    async function loadYears() {

      if (
        !make ||
        !model
      ) {

        setYears([])

        setYear('')

        return

      }


      try {

        const data =
          await VehicleProvider.getYears({

            vehicleType,

            brand:
              make,

            model

          })


        if (
          cancelled
        ) {

          return

        }


        setYears(

          Array.isArray(data)
            ? data
            : []

        )

      }

      catch (error) {

        console.error(
          '[useVehicleFinder] years failed:',
          error
        )


        if (
          !cancelled
        ) {

          setYears([])

        }

      }

    }


    loadYears()


    return () => {

      cancelled = true

    }

  }, [
    vehicleType,
    make,
    model
  ])


  // ====================================================
  // SEARCH
  // ====================================================

  useEffect(() => {

    let cancelled = false


    async function performSearch() {

      if (
        !vehicleType ||
        !make ||
        !model ||
        !year
      ) {

        setResult(null)

        return

      }


      try {

        setLoading(true)


        // =================================================
        // IMPORTANT
        // =================================================
        // Do NOT read products directly from productStore.
        //
        // VehicleSearchController is the unified search
        // entry point and loads products from:
        //
        // ProductsRepository
        // WebsiteStore
        // WarehouseStore
        //
        // This keeps vehicle search connected to the
        // unified project data layer.
        // =================================================

        const data =
          await VehicleSearchController.searchVehicle({

            vehicleType,

            make,

            model,

            year

          })


        if (
          cancelled
        ) {

          return

        }


        const safeResult = {

          vehicle:
            data?.vehicle ||
            null,

          oem:
            data?.oem ||
            null,

          tires:
            Array.isArray(
              data?.tires
            )
              ? data.tires
              : [],

          batteries:
            Array.isArray(
              data?.batteries
            )
              ? data.batteries
              : [],

          oils:
            Array.isArray(
              data?.oils
            )
              ? data.oils
              : [],

          products:
            Array.isArray(
              data?.products
            )
              ? data.products
              : []

        }


        console.log(
          '[useVehicleFinder] search result:',
          safeResult
        )


        setResult(
          safeResult
        )

      }

      catch (error) {

        console.error(
          '[useVehicleFinder] search failed:',
          error
        )


        if (
          !cancelled
        ) {

          setResult(null)

        }

      }

      finally {

        if (
          !cancelled
        ) {

          setLoading(false)

        }

      }

    }


    performSearch()


    return () => {

      cancelled = true

    }

  }, [
    vehicleType,
    make,
    model,
    year
  ])


  // ====================================================
  // TRACK SEARCH
  // ====================================================

  useEffect(() => {

    if (
      !result
    ) {

      return

    }


    try {

      VehicleSearchTrackingService.track({

        vehicleType,

        make,

        model,

        year,

        vehicle:
          result.vehicle,

        tires:
          result.tires,

        batteries:
          result.batteries,

        oils:
          result.oils

      })

    }

    catch (error) {

      console.error(
        '[useVehicleFinder] tracking failed:',
        error
      )

    }

  }, [
    result,
    vehicleType,
    make,
    model,
    year
  ])


  // ====================================================
  // RETURN
  // ====================================================

  return {

    vehicleType,

    setVehicleType,

    make,

    setMake,

    model,

    setModel,

    year,

    setYear,

    vehicleTypes,

    makes,

    models,

    years,

    result,

    loading

  }

}