export default function VehicleCompatibilityItem({

  vehicle,

  index,

  onRemove

}) {

  const yearText =

    vehicle.yearFrom && vehicle.yearTo

      ? `${vehicle.yearFrom} - ${vehicle.yearTo}`

      : vehicle.yearFrom ||

        vehicle.yearTo ||

        'جميع السنوات'

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        p-4
        rounded-2xl
        bg-slate-800
        border
        border-slate-700
      "
    >

      <div className="space-y-1">

        <div className="font-black text-white">

          {vehicle.brand}

          {' '}

          {vehicle.model}

        </div>

        <div className="text-sm text-gray-400">

          {

            vehicle.vehicleType ||

            'car'

          }

          {' • '}

          {yearText}

        </div>

      </div>

      <button

        type="button"

        onClick={() =>

          onRemove(index)

        }

        className="
          px-4
          py-2
          rounded-xl
          bg-red-600
          hover:bg-red-700
          text-white
          font-black
        "

      >

        🗑 حذف

      </button>

    </div>

  )

}