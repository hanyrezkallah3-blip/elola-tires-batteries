import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'
import { useNavigate } from 'react-router-dom'

export default function WarehouseAdminPanel() {

  const navigate = useNavigate()

  const {
    users,
    products,
    orders,
    transfers
  } = useWebsiteStore()

  // ================= FILTER =================

  const [selectedWarehouse, setSelectedWarehouse] =
    useState('all')

  // ================= WAREHOUSES =================

  const warehouses = users.filter(
    (u) => u.role === 'warehouse'
  )

  // ================= GLOBAL STATS =================

  const totalProducts = products.length

  const totalOrders = orders.length

  const totalSales = orders.reduce(
    (acc, o) => acc + Number(o.total || 0),
    0
  )

  // ================= FILTERED TRANSFERS =================

  const filteredTransfers =
    selectedWarehouse === 'all'

      ? transfers

      : transfers.filter(
          (t) =>
            t.fromWarehouseId === selectedWarehouse ||
            t.toWarehouseId === selectedWarehouse
        )

  // ================= HELPERS =================

  const getWarehouseName = (warehouseId) => {

    const warehouse = warehouses.find(
      (w) => w.warehouseId === warehouseId
    )

    return (
      warehouse?.warehouseName ||
      warehouse?.username ||
      warehouseId
    )
  }

  // ================= RENDER =================

  return (

    <div className="p-10 space-y-10 text-white">

      {/* ================= TOP BAR ================= */}

      <div className="flex flex-wrap gap-4 justify-between items-center">

        <div>

          <h1 className="text-5xl font-black text-yellow-400">
            🏭 إدارة المخازن
          </h1>

          <p className="text-gray-300 mt-2">
            متابعة المخازن وحركة المنتجات
          </p>

        </div>

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => navigate('/dashboard')}
            className="
              bg-blue-600
              hover:bg-blue-700
              px-6
              py-3
              rounded-2xl
              font-bold
            "
          >
            📊 الداشبورد
          </button>

          <button
            onClick={() => navigate('/home')}
            className="
              bg-green-600
              hover:bg-green-700
              px-6
              py-3
              rounded-2xl
              font-bold
            "
          >
            🏠 الموقع الرئيسي
          </button>

        </div>

      </div>

      {/* ================= GLOBAL STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-700 p-6 rounded-3xl">

          <div className="text-xl mb-3">
            📦 المنتجات الكلية
          </div>

          <div className="text-5xl font-black">
            {totalProducts}
          </div>

        </div>

        <div className="bg-green-700 p-6 rounded-3xl">

          <div className="text-xl mb-3">
            🛒 الطلبات الكلية
          </div>

          <div className="text-5xl font-black">
            {totalOrders}
          </div>

        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-3xl">

          <div className="text-xl mb-3">
            💰 إجمالي المبيعات
          </div>

          <div className="text-5xl font-black">
            {totalSales}
          </div>

        </div>

      </div>

      {/* ================= WAREHOUSES ================= */}

      <div className="space-y-6">

        <h2 className="text-4xl font-black text-yellow-400">
          🏬 المخازن
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {warehouses.map((w) => {

            const warehouseProducts =
              products.filter(
                (p) =>
                  p.warehouseId === w.warehouseId
              )

            const warehouseOrders =
              orders.filter(
                (o) =>
                  o.warehouseId === w.warehouseId
              )

            const warehouseSales =
              warehouseOrders.reduce(
                (acc, o) =>
                  acc + Number(o.total || 0),
                0
              )

            return (

              <div
                key={w.id}
                className="
                  bg-slate-900
                  p-6
                  rounded-3xl
                  border
                  border-yellow-500
                  space-y-4
                "
              >

                <div className="flex justify-between items-center">

                  <h3 className="text-3xl font-black text-yellow-400">
                    🏭 {w.username}
                  </h3>

                  <span className="
                    bg-blue-700
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                  ">
                    {w.warehouseName || 'مخزن'}
                  </span>

                </div>

                <div className="space-y-2 text-lg">

                  <div>
                    📦 المنتجات:
                    {' '}
                    {warehouseProducts.length}
                  </div>

                  <div>
                    🛒 الطلبات:
                    {' '}
                    {warehouseOrders.length}
                  </div>

                  <div>
                    💰 المبيعات:
                    {' '}
                    {warehouseSales}
                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

      {/* ================= TRANSFER FILTER ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl space-y-6">

        <div className="flex flex-wrap justify-between gap-4 items-center">

          <h2 className="text-4xl font-black text-yellow-400">
            🚚 سجل نقل المنتجات
          </h2>

          <select
            value={selectedWarehouse}
            onChange={(e) =>
              setSelectedWarehouse(e.target.value)
            }
            className="
              text-black
              px-4
              py-3
              rounded-xl
              min-w-[250px]
            "
          >

            <option value="all">
              جميع المخازن
            </option>

            {warehouses.map((w) => (

              <option
                key={w.id}
                value={w.warehouseId}
              >
                {w.warehouseName || w.username}
              </option>

            ))}

          </select>

        </div>

        {/* ================= TRANSFERS ================= */}

        <div className="space-y-4">

          {filteredTransfers.length === 0 && (

            <div className="
              bg-slate-800
              p-6
              rounded-2xl
              text-center
              text-gray-400
            ">

              لا توجد عمليات نقل

            </div>

          )}

          {filteredTransfers.map((transfer) => (

            <div
              key={transfer.id}
              className="
                bg-slate-800
                rounded-2xl
                p-5
                border
                border-slate-700
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
              "
            >

              <div className="space-y-2">

                <div className="text-2xl font-bold text-yellow-400">

                  🚚 نقل منتج

                </div>

                <div>

                  من:
                  {' '}
                  <span className="text-blue-400 font-bold">
                    {getWarehouseName(
                      transfer.fromWarehouseId
                    )}
                  </span>

                </div>

                <div>

                  إلى:
                  {' '}
                  <span className="text-green-400 font-bold">
                    {getWarehouseName(
                      transfer.toWarehouseId
                    )}
                  </span>

                </div>

              </div>

              <div className="space-y-2">

                <div className="text-xl">
                  📦 الكمية:
                  {' '}
                  <span className="font-black text-yellow-400">
                    {transfer.quantity}
                  </span>
                </div>

                <div className="text-gray-400 text-sm">

                  {new Date(
                    transfer.date
                  ).toLocaleString()}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= ALERTS ================= */}

      <div className="bg-red-700 p-6 rounded-3xl">

        <h2 className="text-3xl font-black mb-6">
          ⚠ تنبيهات النظام
        </h2>

        <div className="space-y-3 text-lg">

          <div>
            🔴 متابعة المنتجات منخفضة المخزون
          </div>

          <div>
            🔴 مراجعة عمليات النقل اليومية
          </div>

          <div>
            🔴 متابعة الطلبات المتأخرة
          </div>

        </div>

      </div>

    </div>

  )

}