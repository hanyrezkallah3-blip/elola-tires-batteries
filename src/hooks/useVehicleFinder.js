import {
  useEffect,
  useState
} from 'react'

import { useProductStore }
from '../store/productStore'

import VehicleProvider
from '../core/vehicles/VehicleProvider'

import VehicleEngine
from '../engines/VehicleEngine'

import VehicleSearchTrackingService
from '../services/VehicleSearchTrackingService'

import useVehicleSync
from './useVehicleSync'

export default function useVehicleFinder() {

  const products =
    useProductStore(
      s => s.products || []
    )

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

  const [
    result,
    setResult
  ] = useState(null)

  const [
    loading,
    setLoading
  ] = useState(false)

  useVehicleSync({

    vehicleType,

    brand: make,

    model

  })

  // ====================================================
  // TYPES
  // ====================================================

  useEffect(() => {

    loadVehicleTypes()

  }, [])

  async function loadVehicleTypes() {

    const data =

      await VehicleProvider.getVehicleTypes()

    setVehicleTypes(

      data || []

    )

  }

  // ====================================================
  // BRANDS
  // ====================================================

  useEffect(() => {

    if (!vehicleType) {

      setMakes([])

      setModels([])

      setYears([])

      setMake('')

      setModel('')

      setYear('')

      return

    }

    loadBrands()

  }, [

    vehicleType

  ])

  async function loadBrands() {

    const data =

      await VehicleProvider.getBrands(

        vehicleType

      )

    setMakes(

      data || []

    )

  }
    // ====================================================
  // MODELS
  // ====================================================

  useEffect(() => {

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

    loadModels()

  }, [

    vehicleType,

    make

  ])

  async function loadModels() {

    const data =

      await VehicleProvider.getModels({

        vehicleType,

        brand: make

      })

    setModels(

      data || []

    )

  }

  // ====================================================
  // YEARS
  // ====================================================

  useEffect(() => {

    if (

      !make ||

      !model

    ) {

      setYears([])

      setYear('')

      return

    }

    loadYears()

  }, [

    make,

    model

  ])

  async function loadYears() {

    const data =

      await VehicleProvider.getYears({

        vehicleType,

        brand: make,

        model

      })

    setYears(

      data || []

    )

  }

  // ====================================================
  // SEARCH
  // ====================================================

  useEffect(() => {

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

        const data =

          await VehicleEngine.search({

            vehicleType,

            make,

            model,

            year,

            products

          })

        setResult(data)

      }

      catch (error) {

        console.error(

          '[useVehicleFinder]',

          error

        )

        setResult(null)

      }

      finally {

        setLoading(false)

      }

    }

    performSearch()

  }, [

    vehicleType,

    make,

    model,

    year,

    products

  ])
    // ====================================================
  // TRACK SEARCH
  // ====================================================

  useEffect(() => {

    if (!result)

      return

    VehicleSearchTrackingService.track({

      vehicleType,

      make,

      model,

      year,

      vehicle: result.vehicle,

      tires: result.tires,

      batteries: result.batteries,

      oils: result.oils

    })

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