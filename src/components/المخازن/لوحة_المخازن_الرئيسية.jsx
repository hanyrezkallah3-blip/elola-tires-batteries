import { useState, useMemo } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'

export default function لوحة_المخازن_الرئيسية() {

  // ================= STORE =================

  const warehouses =
    useInventoryStore((s) => s.warehouses)

  const stockItems =
    useInventoryStore((s) => s.stockItems)

  const addWarehouse =
    useInventoryStore((s) => s.addWarehouse)

  const getLowStockItems =
    useInventoryStore((s) => s.getLowStockItems)

  // ================= STATES =================

  const [اسم_المخزن, setاسم_المخزن] = useState('')
  const [الموقع, setالموقع] = useState('')
  const [المدير, setالمدير] = useState('')

  // ================= إضافة مخزن =================

  const إضافة_مخزن = () => {

    if (!اسم_المخزن) return alert('ادخل اسم المخزن')

    addWarehouse({

      name: اسم_المخزن,
      location: الموقع,
      manager: المدير,
      active: true

    })

    setاسم_المخزن('')
    setالموقع('')
    setالمدير('')

  }

  // ================= تحليل المخزون =================

  const إجمالي_المخزون = useMemo(() => {

    return stockItems.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    )

  }, [stockItems])

  const قيمة_المخزون = useMemo(() => {

    return stockItems.reduce(
      (acc, item) =>
        acc + (Number(item.quantity || 0) * Number(item.price || 0)),
      0
    )

  }, [stockItems])

  const منخفض_المخزون = getLowStockItems()

  // ================= UI =================

  return (

    <div className="p-8 text-white space-y-10 bg-black min-h-screen">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-500 p-10 rounded-3xl shadow-2xl">

        <h1 className="text-5xl font-black mb-3">
          🏭 لوحة المخازن الرئيسية
        </h1>

        <p className="text-xl">
          إدارة كاملة للمخازن والمخزون بنظام ERP عربي
        </p>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-700 p-6 rounded-3xl text-center">
          <div className="text-xl">📦 إجمالي المخزون</div>
          <div className="text-4xl font-black">{إجمالي_المخزون}</div>
        </div>

        <div className="bg-green-700 p-6 rounded-3xl text-center">
          <div className="text-xl">💰 قيمة المخزون</div>
          <div className="text-4xl font-black">{قيمة_المخزون}</div>
        </div>

        <div className="bg-red-700 p-6 rounded-3xl text-center">
          <div className="text-xl">⚠ منخفض المخزون</div>
          <div className="text-4xl font-black">{منخفض_المخزون.length}</div>
        </div>

      </div>

      {/* ================= إضافة مخزن ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl space-y-4">

        <h2 className="text-3xl font-black text-yellow-400">
          ➕ إضافة مخزن جديد
        </h2>

        <input
          className="w-full p-4 rounded-2xl text-black"
          placeholder="اسم المخزن"
          value={اسم_المخزن}
          onChange={(e) => setاسم_المخزن(e.target.value)}
        />

        <input
          className="w-full p-4 rounded-2xl text-black"
          placeholder="الموقع"
          value={الموقع}
          onChange={(e) => setالموقع(e.target.value)}
        />

        <input
          className="w-full p-4 rounded-2xl text-black"
          placeholder="المدير"
          value={المدير}
          onChange={(e) => setالمدير(e.target.value)}
        />

        <button
          onClick={إضافة_مخزن}
          className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl"
        >
          إضافة المخزن
        </button>

      </div>

      {/* ================= المخازن ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-black mb-6 text-cyan-400">
          🏬 المخازن
        </h2>

        {warehouses.length === 0 ? (
          <div className="text-gray-400">
            لا توجد مخازن
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {warehouses.map((w) => (

              <div
                key={w.id}
                className="bg-black p-6 rounded-3xl border border-blue-600"
              >

                <h3 className="text-2xl font-black text-yellow-400">
                  {w.name}
                </h3>

                <div className="mt-3 text-gray-300">
                  📍 {w.location}
                </div>

                <div className="mt-2 text-gray-300">
                  👨‍💼 {w.manager}
                </div>

                <div className="mt-4 text-green-400 font-bold">
                  الحالة: {w.active ? 'نشط' : 'غير نشط'}
                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* ================= منخفض المخزون ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-black text-red-400 mb-5">
          ⚠ تنبيهات المخزون
        </h2>

        {منخفض_المخزون.length === 0 ? (
          <div className="text-gray-400">
            لا يوجد مخزون منخفض
          </div>
        ) : (
          <div className="space-y-3">

            {منخفض_المخزون.map((item) => (

              <div
                key={item.id}
                className="bg-black p-4 rounded-2xl flex justify-between"
              >

                <span>{item.productName}</span>

                <span className="text-red-400 font-black">
                  {item.quantity}
                </span>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>

  )
}