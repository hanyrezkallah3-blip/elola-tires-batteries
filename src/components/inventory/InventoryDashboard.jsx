import { useMemo } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'
import { useMultiWarehouseStore } from '../../store/المخازن_المتعددة'
import { useAIWarehouseStore } from '../../store/ذكاء_المخازن'

export default function InventoryDashboard() {

  // ================= STORES =================

  const warehouses =
    useInventoryStore((s) => s.warehouses)

  const stockItems =
    useInventoryStore((s) => s.stockItems)

  const getSummary =
    useInventoryStore((s) => s.getInventorySummary)

  const lowStock =
    useInventoryStore((s) => s.getLowStockItems)

  const aiReport =
    useAIWarehouseStore((s) => s.تقرير_ذكاء_المخازن)

  const multiAnalysis =
    useMultiWarehouseStore((s) => s.تحليل_المخازن)

  // ================= DATA =================

  const summary = useMemo(() => getSummary(), [stockItems])

  const warehousesAnalysis = useMemo(() => multiAnalysis(), [warehouses])

  const ai = useMemo(() => {

    return aiReport({
      stockItems,
      orders: [],
      warehouses
    })

  }, [stockItems, warehouses])

  // ================= UI =================

  return (

    <div className="p-8 text-white space-y-10">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-900 to-purple-700 p-8 rounded-3xl">

        <h1 className="text-4xl font-black">
          📦 لوحة تحكم المخزون الذكية
        </h1>

        <p className="text-gray-200 mt-2">
          نظام SAP ERP Inventory AI
        </p>

      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-slate-900 p-6 rounded-2xl border border-blue-500">
          <div>📦 المنتجات</div>
          <div className="text-3xl font-black mt-2">
            {summary.totalItems}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-green-500">
          <div>📊 الكمية الإجمالية</div>
          <div className="text-3xl font-black mt-2">
            {summary.totalQuantity}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-yellow-500">
          <div>💰 القيمة</div>
          <div className="text-3xl font-black mt-2">
            {summary.totalValue}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-red-500">
          <div>⚠ منخفض</div>
          <div className="text-3xl font-black mt-2">
            {summary.lowStockCount}
          </div>
        </div>

      </div>

      {/* AI INSIGHT */}

      <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500">

        <h2 className="text-2xl font-black">
          🤖 ذكاء المخزون
        </h2>

        <div className="mt-4 space-y-2">

          <div>
            ⚠ منتجات خطرة: {ai.ملخص.منتجات_خطرة}
          </div>

          <div className="text-green-400 font-bold">
            {ai.ملخص.اقتراح}
          </div>

        </div>

      </div>

      {/* LOW STOCK */}

      <div className="bg-slate-900 p-6 rounded-2xl">

        <h2 className="text-xl font-black mb-4">
          🔴 منتجات تحتاج إعادة طلب
        </h2>

        <div className="space-y-3">

          {lowStock().map((item) => (

            <div
              key={item.id}
              className="flex justify-between bg-slate-800 p-4 rounded-xl"
            >

              <div>
                {item.productName}
              </div>

              <div className="text-red-400 font-bold">
                {item.quantity} / {item.minQuantity}
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* WAREHOUSE STATUS */}

      <div className="bg-slate-900 p-6 rounded-2xl">

        <h2 className="text-xl font-black mb-4">
          🏭 حالة المخازن
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {warehousesAnalysis.map((w) => (

            <div
              key={w.warehouseId}
              className="bg-slate-800 p-4 rounded-xl"
            >

              <div className="text-lg font-black">
                {w.name}
              </div>

              <div className="mt-2 text-sm text-gray-300">
                📦 منتجات: {w.totalProducts}
              </div>

              <div className="text-sm text-gray-300">
                📊 مخزون: {w.totalStock}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}