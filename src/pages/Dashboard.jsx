import { useMemo, useEffect } from 'react'
import { useWebsiteStore } from '../store/websiteStore'
import { useAnalyticsStore } from '../store/analyticsStore'
import ERPController from '../erp/ERPController'
import حماية_الصفحة from '../security/حماية_الصفحة'

export default function Dashboard() {

  const {
    products = [],
    offers = [],
    videos = [],
    services = [],
    slides = [],
    orders = [],
    transfers = [],
    notifications = [],
    users = [],
    currentUser
  } = useWebsiteStore()

  const updateDashboardStats =
    useAnalyticsStore((s) => s.updateDashboardStats)

  const updateERPSummary =
    useAnalyticsStore((s) => s.updateERPSummary)

  // ================= ERP LIVE SYNC =================
    useEffect(() => {
    updateDashboardStats({
      orders,
      products,
      wallets: [],
      walletTransactions: []
    })

    // ERPController.syncAll()
  }, [orders, products, updateDashboardStats])

  // ================= TOTALS =================

  const totalSales = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + Number(p?.sold || 0),
      0
    )
  }, [products])

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (acc, o) => acc + Number(o?.total || 0),
      0
    )
  }, [orders])

  const totalStock = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + Number(p?.stock || 0),
      0
    )
  }, [products])

  const avgPrice = useMemo(() => {
    if (!products.length) return 0

    return (
      products.reduce(
        (acc, p) => acc + Number(p?.price || 0),
        0
      ) / products.length
    ).toFixed(2)
  }, [products])

  const cards = [
    { title: 'المنتجات', value: products.length, color: 'bg-blue-700' },
    { title: 'الطلبات', value: orders.length, color: 'bg-green-700' },
    { title: 'الأرباح', value: totalRevenue, color: 'bg-yellow-500 text-black' },
    { title: 'المخزون', value: totalStock, color: 'bg-purple-700' },
    { title: 'المبيعات', value: totalSales, color: 'bg-cyan-700' },
    { title: 'العروض', value: offers.length, color: 'bg-red-700' },
    { title: 'الخدمات', value: services.length, color: 'bg-indigo-700' },
    { title: 'الفيديوهات', value: videos.length, color: 'bg-pink-700' },
    { title: 'السلايدر', value: slides.length, color: 'bg-orange-500 text-black' },
    { title: 'متوسط السعر', value: avgPrice, color: 'bg-emerald-700' }
  ]

  return (
    <حماية_الصفحة requiredRole="owner" page="dashboard">

      <div className="p-6 lg:p-10 bg-black min-h-screen text-white space-y-10">

        <h1 className="
  text-3xl
  lg:text-5xl
  font-black
  text-yellow-400
  mt-12
  lg:mt-0
">
          📊 لوحة التحكم
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {cards.map((c, i) => (
            <div
  key={i}
  className={`
    ${c.color}
    rounded-3xl
    p-6
    min-h-[140px]
    flex
    flex-col
    justify-center
    items-center
    text-center
    shadow-xl
  `}
>
  <div className="text-xl font-bold mb-3">
    {c.title}
  </div>

  <div className="text-5xl font-black">
    {c.value}
  </div>
</div>
          ))}

        </div>

      </div>

    </حماية_الصفحة>
  )
}