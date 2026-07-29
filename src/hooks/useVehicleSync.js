// ======================================================
// EL OLA ERP
// Vehicle Sync Hook
// ======================================================

import { useEffect }

from 'react'

import VehicleSyncManager

from '../core/vehicles/VehicleSyncManager'

export default function useVehicleSync({

  vehicleType,

  brand,

  model

} = {}) {

  // ====================================================
  // INITIAL
  // ====================================================

  useEffect(() => {

    VehicleSyncManager.start()

  }, [])

  // ====================================================
  // BRANDS
  // ====================================================

  useEffect(() => {

    if (!vehicleType)

      return

    VehicleSyncManager.syncBrands(

      vehicleType

    )

  }, [vehicleType])

  // ====================================================
  // MODELS
  // ====================================================

  useEffect(() => {

    if (!brand)

      return

    VehicleSyncManager.syncModels({

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

      !brand ||

      !model

    )

      return

    VehicleSyncManager.syncYears({

      brand,

      model

    })

  }, [

    brand,

    model

  ])

}