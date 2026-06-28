import { useMemo } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function GlobalERPDashboard() {

  // ================= GLOBAL STORE =================

  const orders = useWebsiteStore((s) => s.orders || [])
  const products = useWebsiteStore((s) => s.products || [])
  const wallets = useWebsiteStore((s) => s.wallets || [])
  const transfers = useWebsiteStore((s) => s.transfers || [])
  const users = useWebsiteStore((s) => s.users || [])

  // ================= CORE KPIs =================

  const totalSales = useMemo(
    () => orders.reduce((a, o) => a + Number(o.total || 0), 0),
    [orders]
  )

  const totalProducts = products.length
  const totalOrders = orders.length
  const totalUsers = users.length
  const totalTransfers = transfers.length

  const walletBalance = useMemo(
    () => wallets.reduce((a, w) => a + Number(w.balance || 0), 0),
    [wallets]
  )

  const profit = totalSales - walletBalance

  // ================= ERP HEALTH ENGINE =================

  const erpHealth = useMemo(() => {

    let score = 50

    // Sales strength
    if (totalSales > 1000000) score += 25
    else if (totalSales > 300000) score += 15
    else score += 5

    // System activity
    if (totalOrders > 100) score += 10
    if (totalTransfers > 50) score += 10

    // Profit health
    if (profit > 100000) score += 20
    else if (profit > 50000) score += 10
    else score -= 10

    return Math.max(0, Math.min(100, score))

  }, [totalSales, totalOrders, totalTransfers, profit])

  const status = useMemo(() => {

    if (erpHealth >= 80) return '🔥 نظام قوي جدًا'
    if (erpHealth >= 60) return '📈 نظام جيد'
    if (erpHealth >= 40) return '⚠️ يحتاج تحسين'
    return '❌ خطر في النظام'

  }, [erpHealth])

  // ================= AI INSIGHTS ENGINE =================

  const insights = useMemo(() => {

    const list = []

    if (totalSales > 500000)
      list.push('📈 الشركة في نمو قوي')

    if (walletBalance > profit)
      list.push('⚠️ المحافظ تستهلك الأرباح')

    if (totalOrders > 200)
      list.push('🔥 نشاط مبيعات عالي')

    if (totalTransfers > 50)
      list.push('🚚 حركة مخزون نشطة')

    if (products.length < 20)
      list.push('📦 المخزون يحتاج توسيع')

    if (list.length === 0)
      list.push('✅ النظام مستقر')

    return list

  }, [totalSales, walletBalance, profit, totalOrders, totalTransfers, products.length])

  // ================= UI =================

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 p-10 rounded-[40px]">

        <h1 className="text-5xl font-black">
          🌍 GLOBAL ERP SYSTEM
        </h1>

        <p className="text-white/70 text-xl mt-2">
          نظام إدارة موارد المؤسسة + AI + Real-Time Intelligence
        </p>

      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

        <Card title="💵 Sales" value={totalSales} />
        <Card title="📦 Products" value={totalProducts} />
        <Card title="🛒 Orders" value={totalOrders} />
        <Card title="👤 Users" value={totalUsers} />
        <Card title="🚚 Transfers" value={totalTransfers} />
        <Card title="💰 Profit" value={profit} />

      </div>

      {/* ERP HEALTH */}
      <div className="grid xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-8 rounded-[30px] border border-purple-600">

          <h2 className="text-3xl font-black text-purple-400">
            🧠 ERP Health Engine
          </h2>

          <div className="text-6xl font-black mt-6">
            {erpHealth}%
          </div>

          <div className="text-xl mt-3 text-white/70">
            الحالة: {status}
          </div>

        </div>

        {/* AI INSIGHTS */}
        <div className="bg-slate-900 p-8 rounded-[30px] border border-slate-700">

          <h2 className="text-3xl font-black mb-6">
            🤖 AI Insights
          </h2>

          <ul className="space-y-3 text-lg">

            {insights.map((i, index) => (
              <li key={index}>• {i}</li>
            ))}

          </ul>

        </div>

      </div>

      {/* REAL TIME SIMULATION */}
      <div className="bg-slate-900 p-8 rounded-[30px] border border-blue-600">

        <h2 className="text-3xl font-black text-blue-400 mb-6">
          ⚡ Live ERP Activity
        </h2>

        <div className="space-y-3 text-lg">

          <div>📊 إجمالي المبيعات: {totalSales.toLocaleString()} ج.م</div>
          <div>💰 الربح: {profit.toLocaleString()} ج.م</div>
          <div>💳 المحافظ: {walletBalance.toLocaleString()} ج.م</div>
          <div>📦 المنتجات: {totalProducts}</div>

        </div>

      </div>

    </div>
  )
}

// ================= CARD =================

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 p-5 rounded-[25px] border border-slate-700 text-center">
      <div className="text-gray-400 font-bold">{title}</div>
      <div className="text-3xl font-black mt-3 text-white">
        {Number(value).toLocaleString()}
      </div>
    </div>
  )
}