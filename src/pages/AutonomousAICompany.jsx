import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function AutonomousAICompany() {

  // ================= STORE =================

  const products =
    useWebsiteStore((s) => s.products || [])

  const orders =
    useWebsiteStore((s) => s.orders || [])

  const wallets =
    useWebsiteStore((s) => s.wallets || [])

  const transfers =
    useWebsiteStore((s) => s.transfers || [])

  const users =
    useWebsiteStore((s) => s.users || [])

  // ================= OWNER CONTROL =================

  // 🔥 المالك يستطيع تشغيل أو إيقاف الذكاء الاصطناعي

  const [aiEnabled, setAiEnabled] =
    useState(true)

  // ================= AI METRICS =================

  const totalSales = useMemo(() => {

    return orders.reduce(
      (acc, order) =>
        acc + Number(order.total || 0),
      0
    )

  }, [orders])

  const totalWallets = useMemo(() => {

    return wallets.reduce(
      (acc, wallet) =>
        acc + Number(wallet.balance || 0),
      0
    )

  }, [wallets])

  const totalOrders =
    orders.length

  const totalProducts =
    products.length

  const totalTransfers =
    transfers.length

  const totalUsers =
    users.length

  // ================= PROFITS =================

  const profit = useMemo(() => {

    return totalSales - totalWallets

  }, [totalSales, totalWallets])

  // ================= LOW STOCK =================

  const lowStock = useMemo(() => {

    return products.filter(
      (p) =>
        Number(p.stock || 0) <= 5
    )

  }, [products])

  // ================= BEST PRODUCT =================

  const bestProduct = useMemo(() => {

    if (!products.length) return null

    return [...products].sort(
      (a, b) =>
        Number(b.sold || 0) -
        Number(a.sold || 0)
    )[0]

  }, [products])

  // ================= AI SCORE =================

  const aiScore = useMemo(() => {

    let score = 50

    if (profit > 100000)
      score += 20

    if (totalSales > 300000)
      score += 15

    if (lowStock.length === 0)
      score += 15

    return Math.min(100, score)

  }, [profit, totalSales, lowStock.length])

  // ================= PREDICTIONS =================

  const nextMonthSales = useMemo(() => {

    return totalSales * 1.12

  }, [totalSales])

  // ================= AI DECISIONS =================

  const aiDecisions = useMemo(() => {

    // 🔥 إذا تم إيقاف النظام

    if (!aiEnabled) {

      return [
        '⛔ النظام الذكي متوقف',
        '👤 الإدارة اليدوية مفعلة',
        '🛠 جميع القرارات تتم بواسطة المالك'
      ]

    }

    // ================= ACTIVE AI =================

    const decisions = []

    if (lowStock.length > 0) {

      decisions.push(
        `📦 يوجد ${lowStock.length} منتج منخفض المخزون`
      )

    }

    if (profit > 100000) {

      decisions.push(
        '💰 الأرباح ممتازة'
      )

    }

    if (profit < 0) {

      decisions.push(
        '🚨 خطر مالي'
      )

    }

    if (totalSales > 500000) {

      decisions.push(
        '🏢 ينصح بفتح فرع جديد'
      )

    }

    if (totalWallets > profit * 0.5) {

      decisions.push(
        '⚠️ المحافظ تؤثر على السيولة'
      )

    }

    if (totalTransfers > 50) {

      decisions.push(
        '🚚 حركة مخزون قوية'
      )

    }

    if (decisions.length === 0) {

      decisions.push(
        '✅ الشركة تعمل بكفاءة ممتازة'
      )

    }

    return decisions

  }, [
    aiEnabled,
    lowStock.length,
    profit,
    totalSales,
    totalWallets,
    totalTransfers
  ])

  // ================= UI =================

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
      lg:p-10
      space-y-10
    ">

      {/* HEADER */}

      <div className="
        bg-gradient-to-r
        from-indigo-700
        via-purple-700
        to-pink-700
        p-10
        rounded-[40px]
        shadow-2xl
      ">

        <div className="
          flex
          justify-between
          flex-wrap
          gap-6
          items-center
        ">

          <div>

            <h1 className="
              text-5xl
              font-black
            ">

              🤖 Autonomous AI Company

            </h1>

            <p className="
              text-white/70
              text-xl
              mt-3
            ">

              شركة ذاتية الإدارة بالذكاء الاصطناعي

            </p>

          </div>

          {/* 🔥 OWNER CONTROL */}

          <div className="
            bg-black/40
            p-5
            rounded-3xl
            space-y-4
          ">

            <div className="
              text-xl
              font-black
            ">

              🎛 وضع الإدارة

            </div>

            <button

              onClick={() =>
                setAiEnabled(!aiEnabled)
              }

              className={`
                px-8
                py-4
                rounded-2xl
                font-black
                text-lg
                transition

                ${aiEnabled
                  ? 'bg-green-500 text-black hover:bg-green-400'
                  : 'bg-red-600 hover:bg-red-500'}
              `}
            >

              {aiEnabled
                ? '🤖 AI ACTIVE'
                : '👤 MANUAL MODE'}

            </button>

          </div>

        </div>

      </div>

      {/* KPI */}

      <div className="
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-6
        gap-5
      ">

        <Card
          title="💵 المبيعات"
          value={totalSales}
        />

        <Card
          title="📈 الأرباح"
          value={profit}
        />

        <Card
          title="📦 المنتجات"
          value={totalProducts}
        />

        <Card
          title="🛒 الطلبات"
          value={totalOrders}
        />

        <Card
          title="👤 المستخدمين"
          value={totalUsers}
        />

        <Card
          title="🧠 AI SCORE"
          value={aiScore}
        />

      </div>

      {/* AI ENGINE */}

      <div className="
        grid
        xl:grid-cols-2
        gap-6
      ">

        {/* AI DECISIONS */}

        <div className="
          bg-slate-900
          p-8
          rounded-[35px]
          border
          border-blue-600
        ">

          <h2 className="
            text-3xl
            font-black
            text-blue-400
            mb-6
          ">

            🤖 AI DECISION ENGINE

          </h2>

          <div className="space-y-4">

            {aiDecisions.map((decision, index) => (

              <div

                key={index}

                className="
                  bg-black/40
                  p-4
                  rounded-2xl
                  text-lg
                "
              >

                {decision}

              </div>

            ))}

          </div>

        </div>

        {/* PREDICTION */}

        <div className="
          bg-slate-900
          p-8
          rounded-[35px]
          border
          border-green-600
        ">

          <h2 className="
            text-3xl
            font-black
            text-green-400
            mb-6
          ">

            📊 AI PREDICTION ENGINE

          </h2>

          <div className="space-y-5 text-lg">

            <div>

              📈 مبيعات الشهر القادم:
              {' '}
              <span className="
                text-green-400
                font-black
              ">

                {nextMonthSales.toLocaleString()} ج.م

              </span>

            </div>

            <div>

              🏆 أفضل منتج:
              {' '}
              <span className="
                text-yellow-400
                font-black
              ">

                {bestProduct?.name || 'لا يوجد'}

              </span>

            </div>

            <div>

              📦 المنتجات منخفضة المخزون:
              {' '}
              <span className="
                text-red-400
                font-black
              ">

                {lowStock.length}

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* SYSTEM STATUS */}

      <div className="
        bg-slate-900
        p-8
        rounded-[35px]
        border
        border-slate-700
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
        ">

          🌍 حالة النظام

        </h2>

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        ">

          <StatusCard
            title="AI CEO"
            status={
              aiEnabled
                ? 'ACTIVE'
                : 'OFF'
            }
          />

          <StatusCard
            title="Finance AI"
            status={
              aiEnabled
                ? 'RUNNING'
                : 'MANUAL'
            }
          />

          <StatusCard
            title="Warehouse AI"
            status={
              aiEnabled
                ? 'OPTIMIZED'
                : 'DISABLED'
            }
          />

          <StatusCard
            title="Prediction Engine"
            status={
              aiEnabled
                ? 'ONLINE'
                : 'STOPPED'
            }
          />

        </div>

      </div>

    </div>

  )

}

// ================= KPI CARD =================

function Card({ title, value }) {

  return (

    <div className="
      bg-slate-900
      p-5
      rounded-[25px]
      border
      border-slate-700
      text-center
    ">

      <div className="
        text-gray-400
        font-bold
      ">

        {title}

      </div>

      <div className="
        text-3xl
        font-black
        mt-3
      ">

        {Number(value).toLocaleString()}

      </div>

    </div>

  )

}

// ================= STATUS CARD =================

function StatusCard({ title, status }) {

  return (

    <div className="
      bg-black
      border
      border-green-500
      p-5
      rounded-[25px]
      text-center
    ">

      <div className="text-gray-400">

        {title}

      </div>

      <div className="
        text-green-400
        text-2xl
        font-black
        mt-3
      ">

        {status}

      </div>

    </div>

  )

}