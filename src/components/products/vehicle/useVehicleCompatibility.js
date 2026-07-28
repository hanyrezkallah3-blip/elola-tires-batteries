import { useCallback, useMemo, useState } from 'react'

import {
  getBrands,
  getModels,
  getYears,
  getVehicleTypes
} from './vehicleHelpers'

const INITIAL_SELECTION = {

  vehicleType: '',

  brand: '',

  model: '',

  yearFrom: '',

  yearTo: ''

}

export default function useVehicleCompatibility({

  form,

  setForm

}) {

  const [selection, setSelection] =

    useState(INITIAL_SELECTION)

  const vehicleTypes =

    useMemo(

      () => getVehicleTypes(),

      []

    )

  const brands =

    useMemo(

      () =>

        getBrands(

          selection.vehicleType

        ),

      [

        selection.vehicleType

      ]

    )

  const models =

    useMemo(

      () =>

        getModels({

          vehicleType:

            selection.vehicleType,

          brand:

            selection.brand

        }),

      [

        selection.vehicleType,

        selection.brand

      ]

    )

  const years =

    useMemo(

      () => getYears(),

      []

    )

  const update =

    useCallback(

      (key, value) => {

        setSelection(prev => {

          const next = {

            ...prev,

            [key]: value

          }

          if (

            key === 'vehicleType'

          ) {

            next.brand = ''

            next.model = ''

          }

          if (

            key === 'brand'

          ) {

            next.model = ''

          }

          return next

        })

      },

      []

    )

  const addVehicle =

    useCallback(() => {

      if (

        !selection.brand ||

        !selection.model

      ) {

        return

      }

      const vehicle = {

        ...selection,

        yearFrom:

          Number(

            selection.yearFrom || 0

          ),

        yearTo:

          Number(

            selection.yearTo || 0

          )

      }

      setForm(prev => ({

        ...prev,

        compatibleVehicles: [

          ...(prev.compatibleVehicles || []),

          vehicle

        ]

      }))

      setSelection(

        INITIAL_SELECTION

      )

    }, [

      selection,

      setForm

    ])

  const removeVehicle =

    useCallback(

      index => {

        setForm(prev => ({

          ...prev,

          compatibleVehicles:

            (prev.compatibleVehicles || [])

              .filter(

                (_, i) =>

                  i !== index

              )

        }))

      },

      [

        setForm

      ]

    )

  return {

    selection,

    update,

    addVehicle,

    removeVehicle,

    vehicleTypes,

    brands,

    models,

    years,

    vehicles:

      form.compatibleVehicles || []

  }

}