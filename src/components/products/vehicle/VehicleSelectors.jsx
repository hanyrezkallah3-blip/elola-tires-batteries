export default function VehicleSelectors({

  selection,

  update,

  vehicleTypes,

  brands,

  models,

  years,

  onAdd

}) {

  return (

    <div className="space-y-6">

      <div className="grid lg:grid-cols-5 gap-4">

        <select

          value={selection.vehicleType}

          onChange={(e) =>

            update(

              'vehicleType',

              e.target.value

            )

          }

          className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

        >

          <option value="">

            نوع المركبة

          </option>

          {

            vehicleTypes.map(item => (

              <option

                key={item.id}

                value={item.id}

              >

                {item.name}

              </option>

            ))

          }

        </select>

        <select

          value={selection.brand}

          onChange={(e) =>

            update(

              'brand',

              e.target.value

            )

          }

          className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

        >

          <option value="">

            الشركة

          </option>

          {

            brands.map(item => (

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

          value={selection.model}

          onChange={(e) =>

            update(

              'model',

              e.target.value

            )

          }

          className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

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

          value={selection.yearFrom}

          onChange={(e) =>

            update(

              'yearFrom',

              e.target.value

            )

          }

          className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

        >

          <option value="">

            من سنة

          </option>

          {

            years.map(year => (

              <option

                key={year}

                value={year}

              >

                {year}

              </option>

            ))

          }

        </select>

        <select

          value={selection.yearTo}

          onChange={(e) =>

            update(

              'yearTo',

              e.target.value

            )

          }

          className="p-4 rounded-2xl bg-slate-900 border border-slate-700"

        >

          <option value="">

            إلى سنة

          </option>

          {

            years.map(year => (

              <option

                key={year}

                value={year}

              >

                {year}

              </option>

            ))

          }

        </select>

      </div>

      <div className="flex justify-end">

        <button

          type="button"

          onClick={onAdd}

          className="px-8 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-black font-black"

        >

          ➕ إضافة السيارة

        </button>

      </div>

    </div>

  )

}