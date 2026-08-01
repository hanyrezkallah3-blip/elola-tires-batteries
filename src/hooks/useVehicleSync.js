// ======================================================
// EL OLA ERP
// Vehicle Sync Hook
// ======================================================

import { useEffect } from 'react'

import VehicleSyncService
from '../core/vehicles/VehicleSyncService'

export default function useVehicleSync({

  vehicleType,

  brand,

  model

}) {

  // ====================================================
  // START
  // ====================================================

  useEffect(() => {

    VehicleSyncService.start()

    VehicleSyncService.syncVehicleTypes()

  }, [])

  // ====================================================
  // BRANDS
  // ====================================================

  useEffect(() => {

    if (!vehicleType)

      return

    VehicleSyncService.syncBrands(

      vehicleType

    )

  }, [

    vehicleType

  ])

  // ====================================================
  // MODELS
  // ====================================================

  useEffect(() => {

    if (

      !vehicleType ||

      !brand

    )

      return

    VehicleSyncService.syncModels({

      vehicleType,

      brand

    })

  }, [

    vehicleType,

    brand

  ])

  // ====================================================
  // YEARS
  // ====================================================

  useEffect(() => {

    if (

      !vehicleType ||

      !brand ||

      !model

    )

      return

    VehicleSyncService.syncYears({

      vehicleType,

      brand,

      model

    })

  }, [

    vehicleType,

    brand,

    model

  ])

}