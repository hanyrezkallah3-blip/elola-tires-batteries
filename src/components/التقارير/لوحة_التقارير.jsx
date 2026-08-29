import { useEffect } from 'react'
import { useOrderStore } from '../../store/orderStore'
import { useProductStore } from '../../store/productStore'
import { useWebsiteStore } from '../../store/websiteStore'
import { useReportsStore } from '../../store/التقارير_العربية'
import {
  تصدير_الى_PDF,
  تصدير_الى_Excel
} from '../../utils/تصدير_التقارير'

export default function ReportsDashboard() {

  const طلبات =
    useOrderStore((s) => s.orders || [])

  const منتجات =
    useProductStore((s) => s.products || [])

  const مخزون =
    useWebsiteStore((s) => s.stockItems || [])

  const التقارير =
    useReportsStore((s) => s.التقارير)

  const توليد =
    useReportsStore(
      (s) => s.توليد_التقارير
    )

  // ================= INIT =================

  useEffect(() => {

    توليد({
      طلبات,
      منتجات,
      مخزون
    })

  }, [طلبات, منتجات, مخزون, توليد])

  // ================= UI =================

  return (

    <div className="p-10 text-white space-y-10">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-900 to-yellow-500 p-10 rounded-3xl">

        <h1 className="text-5xl font-black">
          📊 لوحة التقارير
        </h1>

      </div>

      {/* BUTTONS */}

      <div className="flex gap-4">

        <button
          onClick={() =>
            تصدير_الى_PDF(
              'تقرير_المبيعات',
              التقارير
            )
          }
          className="bg-red-600 px-6 py-4 rounded-2xl font-black"
        >
          📄 PDF
        </button>

        <button
          onClick={() =>
            تصدير_الى_Excel(
              'تقرير_المبيعات',
              التقارير
            )
          }
          className="bg-green-600 px-6 py-4 rounded-2xl font-black"
        >
          📊 Excel
        </button>

      </div>

      {/* REPORTS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black text-yellow-400">
            📈 أفضل المنتجات
          </h2>

          {التقارير?.منتجات_الأكثر_مبيعاً?.map(
            (p, i) => (

              <div
                key={i}
                className="mt-3"
              >
                {p.name} - {p.sold}
              </div>

            )
          )}

        </div>

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black text-red-400">
            📉 أقل المنتجات
          </h2>

          {التقارير?.منتجات_الأقل_مبيعاً?.map(
            (p, i) => (

              <div
                key={i}
                className="mt-3"
              >
                {p.name} - {p.sold}
              </div>

            )
          )}

        </div>

      </div>

    </div>

  )
}