import { useMemo } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'

export default function ذكاء_المخزون_العربي() {

  // ================= STORE =================

  const stockItems =
    useInventoryStore((s) => s.stockItems)

  // ================= ANALYSIS =================

  const التحليل = useMemo(() => {

    const lowStock = []
    const critical = []
    const healthy = []

    let totalValue = 0

    stockItems.forEach((item) => {

      const stock = Number(item.quantity || 0)
      const min = Number(item.minQuantity || 5)
      const price = Number(item.price || 0)

      totalValue += stock * price

      // ================= CRITICAL =================

      if (stock === 0) {
        critical.push(item)
      }

      // ================= LOW STOCK =================

      else if (stock <= min) {
        lowStock.push(item)
      }

      // ================= HEALTHY =================

      else {
        healthy.push(item)
      }

    })

    return {

      lowStock,
      critical,
      healthy,
      totalValue

    }

  }, [stockItems])

  // ================= TOP ITEMS =================

  const الأكثر_استهلاكًا = useMemo(() => {

    return [...stockItems]
      .sort((a, b) =>
        Number(b.sold || 0) -
        Number(a.sold || 0)
      )
      .slice(0, 5)

  }, [stockItems])

  // ================= RECOMMENDATIONS =================

  const التوصيات = useMemo(() => {

    const list = []

    if (التحليل.critical.length > 0) {

      list.push(
        "⚠ يوجد منتجات نفذت تماماً ويجب إعادة توريدها فوراً"
      )

    }

    if (التحليل.lowStock.length > 0) {

      list.push(
        "📦 يوجد منتجات أوشكت على النفاذ"
      )

    }

    if (الأكثر_استهلاكًا.length > 0) {

      list.push(
        "🔥 ركّز على المنتجات الأعلى مبيعاً لزيادة المخزون"
      )

    }

    if (list.length === 0) {

      list.push(
        "✅ المخزون في حالة ممتازة"
      )

    }

    return list

  }, [التحليل, الأكثر_استهلاكًا])

  // ================= UI =================

  return (

    <div className="p-10 bg-black text-white min-h-screen space-y-10">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-purple-900 via-blue-800 to-yellow-500 p-10 rounded-3xl">

        <h1 className="text-5xl font-black">
          🧠 ذكاء المخزون
        </h1>

        <p className="text-xl mt-3">
          تحليل تلقائي + توصيات ذكية لإدارة المخازن
        </p>

      </div>

      {/* ================= KPI ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-red-700 p-6 rounded-3xl text-center">
          <div className="text-2xl">🚨 نفذ تماماً</div>
          <div className="text-5xl font-black mt-2">
            {التحليل.critical.length}
          </div>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-3xl text-center">
          <div className="text-2xl">⚠ منخفض</div>
          <div className="text-5xl font-black mt-2">
            {التحليل.lowStock.length}
          </div>
        </div>

        <div className="bg-green-600 p-6 rounded-3xl text-center">
          <div className="text-2xl">✅ جيد</div>
          <div className="text-5xl font-black mt-2">
            {التحليل.healthy.length}
          </div>
        </div>

      </div>

      {/* ================= VALUE ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl text-center">

        <h2 className="text-3xl font-black text-cyan-400">
          💰 إجمالي قيمة المخزون
        </h2>

        <div className="text-6xl font-black mt-5 text-yellow-400">

          {التحليل.totalValue.toLocaleString()} ج

        </div>

      </div>

      {/* ================= TOP PRODUCTS ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-black mb-6 text-purple-400">
          🔥 الأكثر مبيعاً
        </h2>

        <div className="space-y-4">

          {الأكثر_استهلاكًا.map((item) => (

            <div
              key={item.id}
              className="bg-black p-4 rounded-2xl flex justify-between"
            >

              <span className="font-bold">
                {item.productName}
              </span>

              <span className="text-green-400 font-black">
                {item.sold || 0} مبيعات
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* ================= RECOMMENDATIONS ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-black text-yellow-400 mb-6">
          🧠 توصيات ذكية
        </h2>

        <div className="space-y-4">

          {التوصيات.map((t, i) => (

            <div
              key={i}
              className="bg-black p-4 rounded-2xl text-xl"
            >
              {t}
            </div>

          ))}

        </div>

      </div>

    </div>

  )
}