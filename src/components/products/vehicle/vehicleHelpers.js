import { vehicleDatabase } from '../../../data/vehicleDatabase'

export function getVehicleTypes() {

  const map = new Map()

  vehicleDatabase.forEach(vehicle => {

    const id =
      vehicle.type ||
      vehicle.vehicleType ||
      'car'

    const name =
      vehicle.typeName ||
      vehicle.vehicleTypeName ||
      id

    if (!map.has(id)) {

      map.set(id, {

        id,

        name

      })

    }

  })

  if (map.size === 0) {

    return [

      {

        id: 'car',

        name: 'سيارات'

      }

    ]

  }

  return [...map.values()]

}

export function getBrands(vehicleType) {

  return [

    ...new Set(

      vehicleDatabase

        .filter(vehicle =>

          !vehicleType ||

          vehicle.type === vehicleType ||

          vehicle.vehicleType === vehicleType

        )

        .map(vehicle => vehicle.make)

        .filter(Boolean)

    )

  ].sort()

}

export function getModels({

  vehicleType,

  brand

}) {

  return [

    ...new Set(

      vehicleDatabase

        .filter(vehicle =>

          (!vehicleType ||

            vehicle.type === vehicleType ||

            vehicle.vehicleType === vehicleType)

          &&

          (!brand ||

            vehicle.make === brand)

        )

        .map(vehicle => vehicle.model)

        .filter(Boolean)

    )

  ].sort()

}

export function getYears() {

  const years = []

  const currentYear =
    new Date().getFullYear() + 1

  for (

    let year = currentYear;

    year >= 1990;

    year--

  ) {

    years.push(year)

  }

  return years

}