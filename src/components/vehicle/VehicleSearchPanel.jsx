// ======================================================
// EL OLA ERP
// Vehicle Search Panel
// ======================================================

import SmartVehicleSearch
from './SmartVehicleSearch'

export default function VehicleSearchPanel({

  vehicleType,
  setVehicleType,

  make,
  setMake,

  model,
  setModel,

  year,
  setYear,

  vehicleTypes = [],
  makes = [],
  models = [],
  years = []

}) {

  function handleSmartSelect(vehicle) {

    setVehicleType(

      vehicle.vehicleType || ''

    )

    setMake(

      vehicle.make || ''

    )

    setModel(

      vehicle.model || ''

    )

    setYear(

      String(

        vehicle.year || ''

      )

    )

  }

  return (

    <div

      className="

        bg-slate-800

        rounded-3xl

        p-6

        border

        border-slate-700

        mb-8

        space-y-6

      "

    >

      {/* =====================================================
          SMART SEARCH
      ====================================================== */}

      <SmartVehicleSearch

        onSelect={

          handleSmartSelect

        }

      />

      <div

        className="

          flex

          items-center

          gap-3

        "

      >

        <div className="h-px flex-1 bg-slate-700" />

        <span

          className="

            text-xs

            text-slate-400

            uppercase

            tracking-widest

          "

        >

          أو اختر يدوياً

        </span>

        <div className="h-px flex-1 bg-slate-700" />

      </div>

      {/* =====================================================
          MANUAL SEARCH
      ====================================================== */}

      <div

        className="

          grid

          lg:grid-cols-4

          gap-5

        "

      >

        <select

          value={vehicleType}

          onChange={e =>

            setVehicleType(

              e.target.value

            )

          }

          className="

            p-4

            rounded-2xl

            bg-slate-900

            border

            border-slate-700

            text-white

          "

        >

          <option value="">

            نوع المركبة

          </option>

          {

            vehicleTypes.map(type => (

              <option

                key={type.id}

                value={type.id}

              >

                {type.name}

              </option>

            ))

          }

        </select>

        <select

          value={make}

          onChange={e =>

            setMake(

              e.target.value

            )

          }

          className="

            p-4

            rounded-2xl

            bg-slate-900

            border

            border-slate-700

            text-white

          "

        >

          <option value="">

            الشركة المصنعة

          </option>

          {

            makes.map(item => (

              <option

                key={item.id}

                value={item.name}

              >

                {item.name}

              </option>

            ))

          }

        </select>

        <select

          value={model}

          onChange={e =>

            setModel(

              e.target.value

            )

          }

          className="

            p-4

            rounded-2xl

            bg-slate-900

            border

            border-slate-700

            text-white

          "

        >

          <option value="">

            الموديل

          </option>

          {

            models.map(item => (

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))

          }

        </select>

        <select

          value={year}

          onChange={e =>

            setYear(

              e.target.value

            )

          }

          className="

            p-4

            rounded-2xl

            bg-slate-900

            border

            border-slate-700

            text-white

          "

        >

          <option value="">

            سنة الصنع

          </option>

          {

            years.map(item => (

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))

          }

        </select>

      </div>

    </div>

  )

}