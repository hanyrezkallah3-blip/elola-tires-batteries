import VehicleCompatibilityItem
  from './VehicleCompatibilityItem'

export default function VehicleCompatibilityList({

  vehicles,

  onRemove

}) {

  if (

    !vehicles ||

    vehicles.length === 0

  ) {

    return (

      <div
        className="
          p-6
          rounded-2xl
          border
          border-dashed
          border-slate-700
          text-center
          text-gray-400
        "
      >

        لا توجد سيارات مرتبطة بهذا المنتج.

      </div>

    )

  }

  return (

    <div className="space-y-4">

      {

        vehicles.map(

          (vehicle, index) => (

            <VehicleCompatibilityItem

              key={`${vehicle.brand}-${vehicle.model}-${index}`}

              vehicle={vehicle}

              index={index}

              onRemove={onRemove}

            />

          )

        )

      }

    </div>

  )

}