import { useMemo } from 'react'
import { useWarehouseStore } from '../../../store/warehouseStore'

export default function ProductWarehouseSection({

  form,

  setForm

}) {

  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )

  const activeWarehouses = useMemo(

    () =>

      warehouses.filter(

        warehouse =>

          warehouse.active !== false

      ),

    [warehouses]

  )

  return (

    <div

      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-4
      "

    >

      <h3

        className="
          text-2xl
          font-black
          text-yellow-400
        "

      >

        اختيار المخزن

      </h3>

      <select

        value={
          form.warehouseId || ''
        }

        onChange={(e) =>

          setForm(prev => ({

            ...prev,

            warehouseId:

              e.target.value,

            warehouseName:

              activeWarehouses.find(

                warehouse =>

                  warehouse.id === e.target.value

              )?.name || ''

          }))

        }

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      >

        <option value="">

          اختر المخزن

        </option>

        {

          activeWarehouses.map(

            warehouse => (

              <option

                key={
                  warehouse.id
                }

                value={
                  warehouse.id
                }

              >

                {

                  warehouse.name

                }

                {

                  warehouse.type

                    ?

                    ` (${warehouse.type})`

                    :

                    ''

                }

              </option>

            )

          )

        }

      </select>

      {

        activeWarehouses.length === 0 && (

          <div

            className="
              rounded-2xl
              bg-red-900/30
              border
              border-red-500
              p-4
              text-red-300
              font-bold
            "

          >

            لا يوجد أي مخزن مسجل.

            قم بإنشاء مخزن من صفحة

            <span className="text-yellow-400">

              {" "}Warehouses{" "}

            </span>

            أولاً.

          </div>

        )

      }

    </div>

  )

}