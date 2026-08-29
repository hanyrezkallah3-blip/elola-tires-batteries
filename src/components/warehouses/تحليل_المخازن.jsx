import { useMemo } from 'react'
import { استخدام_ذكاء_المخزون } from '../../ai/ذكاء_المخازن'

export default function WarehouseAnalysis() {

  const AI = استخدام_ذكاء_المخزون()

  const تقرير = useMemo(() => {

    return AI.تقرير_ذكي()

  }, [
    AI.تحليل_النقص,
    AI.اقتراح_نقل,
    AI.تحليل_المخازن
  ])

  const افضل = useMemo(() => {

    const stats = تقرير.مخازن
    if (!stats.length) return null

    return [...stats].sort(
      (a, b) =>
        b.totalStock - a.totalStock
    )[0]

  }, [تقرير])

  const اضعف = useMemo(() => {

    const stats = تقرير.مخازن
    if (!stats.length) return null

    return [...stats].sort(
      (a, b) =>
        a.totalStock - b.totalStock
    )[0]

  }, [تقرير])

  return (

    <div className="p-8 text-white space-y-10">

      {/* HEADER AI */}
      <div className="bg-gradient-to-r from-purple-900 to-cyan-600 p-8 rounded-3xl">

        <h1 className="text-4xl font-black">
          🧠 لوحة الذكاء الاصطناعي للمخازن
        </h1>

        <p className="text-gray-200 mt-2">
          تحليل لحظي + قرارات تلقائية + تنبؤ بالمخاطر
        </p>

      </div>

      {/* SUMMARY */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500">

        <h2 className="text-2xl font-black mb-4">
          📊 ملخص ذكي
        </h2>

        <div className="space-y-3">

          <div>
            🟢 أقوى مخزن: {افضل?.name}
          </div>

          <div>
            🔴 أضعف مخزن: {اضعف?.name}
          </div>

          <div>
            ⚠ منتجات خطرة: {تقرير.ملخص.منتجات_خطرة}
          </div>

          <div className="text-yellow-400 font-bold">
            {تقرير.ملخص.توصية}
          </div>

        </div>

      </div>

      {/* TRANSFER SUGGESTIONS */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-yellow-500">

        <h2 className="text-2xl font-black mb-4">
          🚚 اقتراحات النقل الذكي
        </h2>

        {تقرير.نقل.length === 0 ? (

          <div className="text-gray-400">
            لا توجد اقتراحات حالياً
          </div>

        ) : (

          تقرير.نقل.map((t, i) => (

            <div
              key={i}
              className="bg-slate-800 p-4 rounded-xl mb-2"
            >

              🔄 من {t.من} إلى {t.الى}
              <br />
              📦 المنتج: {t.productId}
              <br />
              📊 الكمية: {t.كمية}
              <br />
              💡 السبب: {t.سبب}

            </div>

          ))

        )}

      </div>

      {/* FULL WAREHOUSE ANALYSIS */}
      <div className="space-y-4">

        {تقرير.مخازن.map((w) => (

          <div
            key={w.warehouseId}
            className="bg-slate-800 p-5 rounded-2xl border border-slate-700"
          >

            <div className="text-2xl font-black">
              🏭 {w.name}
            </div>

            <div className="mt-3 space-y-2">

              <div>
                📦 المنتجات: {w.totalProducts}
              </div>

              <div>
                📊 المخزون: {w.totalStock}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}