import useVehicleCompatibility
  from './useVehicleCompatibility'

import VehicleSelectors
  from './VehicleSelectors'

import VehicleCompatibilityList
  from './VehicleCompatibilityList'

export default function ProductVehicleCompatibility({

  form,

  setForm

}) {

  const {

    selection,

    update,

    addVehicle,

    removeVehicle,

    vehicleTypes,

    brands,

    models,

    years,

    vehicles

  } = useVehicleCompatibility({

    form,

    setForm

  })

  return (

    <section
      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-8
        space-y-8
      "
    >

      <div>

        <h2
          className="
            text-3xl
            font-black
            text-yellow-400
          "
        >

          🚗 السيارات المتوافقة

        </h2>

        <p className="text-gray-400 mt-2">

          اربط المنتج بأي عدد من المركبات
          ليظهر تلقائياً داخل نظام البحث.

        </p>

      </div>

      <VehicleSelectors

        selection={selection}

        update={update}

        vehicleTypes={vehicleTypes}

        brands={brands}

        models={models}

        years={years}

        onAdd={addVehicle}

      />

      <VehicleCompatibilityList

        vehicles={vehicles}

        onRemove={removeVehicle}

      />

    </section>

  )

}