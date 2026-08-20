import { useMemo, useState } from 'react'

import VehicleProvider
  from '../core/vehicles/VehicleProvider'

import VehicleSearchController
  from '../core/controllers/VehicleSearchController'


// ======================================================
// TIRE SIZE PARSER
// ======================================================

const parseTireSize = (value) => {

  const input =
    String(value || '')
      .trim()
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/x/gi, '*')


  if (!input)
    return null


  // ====================================================
  // 205/55/16
  // 205*55*16
  // ====================================================

  const threePartMatch =
    input.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )


  if (threePartMatch) {

    return {

      width:
        threePartMatch[1],

      profile:
        threePartMatch[2],

      rim:
        threePartMatch[3],

      format:
        'three-part'

    }

  }


  // ====================================================
  // 1200/24
  // 1200*24
  // ====================================================

  const twoPartMatch =
    input.match(
      /^(\d+(?:\.\d+)?)[/*](\d+(?:\.\d+)?)$/
    )


  if (twoPartMatch) {

    return {

      width:
        twoPartMatch[1],

      profile:
        '',

      rim:
        twoPartMatch[2],

      format:
        'two-part'

    }

  }


  return null

}


// ======================================================
// NORMALIZE RESULTS
//
// IMPORTANT:
//
// results is ALWAYS an ARRAY.
//
// This matches HomeVehicleSearch.jsx
// and HomeSearchResults.jsx.
//
// ======================================================

const normalizeSearchResults = (
  data
) => {

  if (
    Array.isArray(data)
  ) {

    return data

  }


  // Some controllers may return:
  //
  // { products: [...] }

  if (
    Array.isArray(
      data?.products
    )
  ) {

    return data.products

  }


  // Some vehicle searches may return
  // categorized data.

  if (
    Array.isArray(
      data?.tires
    )
  ) {

    return data.tires

  }


  if (
    Array.isArray(
      data?.batteries
    )
  ) {

    return data.batteries

  }


  if (
    Array.isArray(
      data?.oils
    )
  ) {

    return data.oils

  }


  if (
    Array.isArray(
      data?.parts
    )
  ) {

    return data.parts

  }


  return []

}


// ======================================================
// HOOK
// ======================================================

export default function useVehicleSearch() {

  const [loading, setLoading] =
    useState(false)


  // IMPORTANT:
  //
  // Results are ALWAYS an array.
  //

  const [results, setResults] =
    useState([])


  const [tireSearchError, setTireSearchError] =
    useState('')


  const [form, setForm] =
    useState({

      vehicleType: '',

      brand: '',

      model: '',

      year: '',

      tireSize: '',

      capacity: '',

      viscosity: ''

    })


  // ====================================================
  // VEHICLE TYPES
  // ====================================================

  const vehicleTypes =
    useMemo(

      () =>
        VehicleProvider.getVehicleTypes(),

      []

    )


  // ====================================================
  // BRANDS
  // ====================================================

  const brands =
    useMemo(

      () =>
        VehicleProvider.getBrands(
          form.vehicleType
        ),

      [
        form.vehicleType
      ]

    )


  // ====================================================
  // MODELS
  // ====================================================

  const models =
    useMemo(

      () =>
        VehicleProvider.getModels({

          vehicleType:
            form.vehicleType,

          brand:
            form.brand

        }),

      [
        form.vehicleType,

        form.brand

      ]

    )


  // ====================================================
  // YEARS
  // ====================================================

  const years =
    useMemo(

      () =>
        VehicleProvider.getYears({

          brand:
            form.brand,

          model:
            form.model

        }),

      [
        form.brand,

        form.model

      ]

    )


  // ====================================================
  // SEARCH
  // ====================================================

  const search =
    async (tab) => {

      setLoading(true)


      if (
        tab === 'tire'
      ) {

        setTireSearchError('')

      }


      try {

        // ==============================================
        // VEHICLE
        // ==============================================

        if (
          tab === 'vehicle'
        ) {

          const response =
            await VehicleSearchController.searchVehicle({

              vehicleType:
                form.vehicleType,

              make:
                form.brand,

              model:
                form.model,

              year:
                form.year

            })


          const vehicleResults =
            normalizeSearchResults(
              response
            )


          console.log(
            '[useVehicleSearch] Vehicle results:',
            vehicleResults
          )


          setResults(
            vehicleResults
          )


          return

        }


        // ==============================================
        // TIRE
        // ==============================================

        if (
          tab === 'tire'
        ) {

          const parsed =
            parseTireSize(
              form.tireSize
            )


          if (!parsed) {

            setResults([])

            setTireSearchError(
              'اكتب مقاس الإطار بهذا الشكل: 205/55/16 أو 1200/24'
            )

            return

          }


          console.log(
            '[useVehicleSearch] Parsed tire size:',
            parsed
          )


          const tireResults =
            await VehicleSearchController.searchTire({

              width:
                parsed.width,

              profile:
                parsed.profile,

              rim:
                parsed.rim,

              format:
                parsed.format

            })


          const normalizedResults =
            normalizeSearchResults(
              tireResults
            )


          console.log(
            '[useVehicleSearch] Tire results:',
            normalizedResults
          )


          setResults(
            normalizedResults
          )


          return

        }


        // ==============================================
        // BATTERY
        // ==============================================

        if (
          tab === 'battery'
        ) {

          const batteryResults =
            await VehicleSearchController.searchBattery({

              capacity:
                form.capacity

            })


          const normalizedResults =
            normalizeSearchResults(
              batteryResults
            )


          console.log(
            '[useVehicleSearch] Battery results:',
            normalizedResults
          )


          setResults(
            normalizedResults
          )


          return

        }


        // ==============================================
        // OIL
        // ==============================================

        if (
          tab === 'oil'
        ) {

          const oilResults =
            await VehicleSearchController.searchOil({

              viscosity:
                form.viscosity

            })


          const normalizedResults =
            normalizeSearchResults(
              oilResults
            )


          console.log(
            '[useVehicleSearch] Oil results:',
            normalizedResults
          )


          setResults(
            normalizedResults
          )


          return

        }


        // ==============================================
        // UNKNOWN TAB
        // ==============================================

        setResults([])

      }

      catch (error) {

        console.error(
          '[useVehicleSearch] Search failed:',
          error
        )


        setResults([])

      }

      finally {

        setLoading(false)

      }

    }


  // ====================================================
  // RETURN
  // ====================================================

  return {

    loading,

    results,

    form,

    setForm,

    vehicleTypes,

    brands,

    models,

    years,

    tireSearchError,

    search

  }

}