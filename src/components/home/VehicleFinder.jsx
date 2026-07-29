// ======================================================
// EL OLA ERP
// Vehicle Finder
// ======================================================

import useVehicleFinder
from '../../hooks/useVehicleFinder'

import VehicleSearchPanel
from '../vehicle/VehicleSearchPanel'

import VehicleResults
from '../vehicle/VehicleResults'

export default function VehicleFinder() {

  const {

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

    result

  } = useVehicleFinder()

  return (

    <section

      className="

        bg-slate-900

        rounded-3xl

        p-8

        shadow-2xl

        border

        border-yellow-500

      "

    >

      <h2

        className="

          text-4xl

          font-black

          mb-3

        "

      >

        🚗 اعرف المنتجات المناسبة لسيارتك

      </h2>

      <p

        className="

          text-gray-400

          mb-8

        "

      >

        اختر بيانات السيارة وسيعرض النظام المنتجات المناسبة والمتوفرة.

      </p>

      <VehicleSearchPanel

        vehicleType={vehicleType}

        setVehicleType={setVehicleType}

        make={make}

        setMake={setMake}

        model={model}

        setModel={setModel}

        year={year}

        setYear={setYear}

        vehicleTypes={vehicleTypes}

        makes={makes}

        models={models}

        years={years}

      />
            <VehicleResults

        result={result}

      />

    </section>

  )

}