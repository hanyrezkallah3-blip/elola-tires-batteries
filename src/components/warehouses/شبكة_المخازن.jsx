import { useInventoryStore } from '../../store/inventoryStore'
import { useMemo } from 'react'

export default function شبكة_المخازن() {

  const warehouses =
    useInventoryStore((s) => s.warehouses)

  const stockItems =
    useInventoryStore((s) => s.stockItems)

  const stats = useMemo(() => {

    return warehouses.map((w) => {

      const items =
        stockItems.filter(
          (i) => i.warehouseId === w.id
        )

      const totalStock =
        items.reduce(
          (a, i) => a + Number(i.quantity),
          0
        )

      return {
        id: w.id,
        name: w.name,
        location: w.location,
        active: w.active,
        totalProducts: items.length,
        totalStock
      }

    })

  }, [warehouses, stockItems])

  return (

    <div className="p-8 text-white space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-900 to-green-600 p-8 rounded-3xl">

        <h1 className="text-4xl font-black">
          🏭 شبكة المخازن ERP
        </h1>

        <p className="text-gray-200 mt-2">
          عرض حي لكل المخازن وربطها بالنظام الموحد
        </p>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {stats.map((s) => (

          <div
            key={s.id}
            className="bg-slate-900 p-6 rounded-2xl border border-blue-500 hover:scale-105 transition"
          >

            <h2 className="text-2xl font-black">
              🏭 {s.name}
            </h2>

            <div className="mt-4 space-y-2">

              <div>
                📍 {s.location}
              </div>

              <div>
                📦 المنتجات: {s.totalProducts}
              </div>

              <div>
                📊 المخزون: {s.totalStock}
              </div>

              <div className={`
                font-black
                ${s.active ? 'text-green-400' : 'text-red-400'}
              `}>

                {s.active ? 'نشط' : 'متوقف'}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}