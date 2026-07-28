import { useMemo, useState } from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleSearchController
  from '../core/controllers/VehicleSearchController'

export default function useVehicleSearch() {

  const [loading, setLoading] = useState(false)

  const [results, setResults] = useState([])

  const [form, setForm] = useState({

    vehicleType: '',

    brand: '',

    model: '',

    year: '',

    width: '',

    profile: '',

    rim: '',

    capacity: '',

    viscosity: ''

  })

  const vehicleTypes = useMemo(

  () => VehicleProvider.getVehicleTypes(),

  []

)

  const brands = useMemo(

  () =>

    VehicleProvider.getBrands(

      form.vehicleType

    ),

  [

    form.vehicleType

  ]

)

  const models = useMemo(

  () =>

    VehicleProvider.getModels({

      vehicleType: form.vehicleType,

      brand: form.brand

    }),

  [

    form.vehicleType,

    form.brand

  ]

)

  const years = useMemo(

  () =>

    VehicleProvider.getYears({

      brand: form.brand,

      model: form.model

    }),

  [

    form.brand,

    form.model

  ]

)

  const search = async (tab) => {

    setLoading(true)

    try {

      switch (tab) {

        case 'vehicle': {

          const response =

            await VehicleSearchController.searchVehicle({

              vehicleType: form.vehicleType,

              make: form.brand,

              model: form.model,

              year: form.year

            })

          setResults(

            response.products || []

          )

          break

        }

        case 'tire':

          setResults(

            await VehicleSearchController.searchTire({

              width: form.width,

              profile: form.profile,

              rim: form.rim

            })

          )

          break

        case 'battery':

          setResults(

            await VehicleSearchController.searchBattery({

              capacity: form.capacity

            })

          )

          break

        case 'oil':

          setResults(

            await VehicleSearchController.searchOil({

              viscosity: form.viscosity

            })

          )

          break

        default:

          setResults([])

      }

    }

    finally {

      setLoading(false)

    }

  }

  return {

    loading,

    results,

    form,

    setForm,

    vehicleTypes,

    brands,

    models,

    years,

    search

  }

}