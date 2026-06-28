import { useMemo } from 'react'
import { useWebsiteStore } from '../../store/websiteStore'

export default function FinanceCoreModule() {

  // ================= STORE =================

  const orders = useWebsiteStore(s => s.orders || [])
  const wallets = useWebsiteStore(s => s.wallets || [])
  const transfers = useWebsiteStore(s => s.transfers || [])
  const ledger = useWebsiteStore(s => s.ledger || [])
  const walletTransactions = useWebsiteStore(s => s.walletTransactions || [])

  const addLedgerEntry = useWebsiteStore(s => s.addLedgerEntry)
  const applyCashback = useWebsiteStore(s => s.applyCashback)

  // ================= FINANCIAL CORE =================

  const totalSales = useMemo(
    () => orders.reduce((a, o) => a + Number(o.total || 0), 0),
    [orders]
  )

  const walletBalance = useMemo(
    () => wallets.reduce((a, w) => a + Number(w.balance || 0), 0),
    [wallets]
  )

  const totalCashback = useMemo(
    () => wallets.reduce((a, w) => a + Number(w.totalCashback || 0), 0),
    [wallets]
  )

  const totalTransfers = transfers.length
  const totalTransactions = walletTransactions.length

  // ================= ERP FINANCIAL ENGINE =================

  const profit = totalSales - totalCashback
  const liabilities = walletBalance
  const cashFlow = profit - liabilities

  // ================= CREATE FINANCIAL ENTRY =================

  const createIncome = () => {

    addLedgerEntry({
      type: 'income',
      amount: totalSales,
      description: 'إجمالي المبيعات'
    })

    alert('💰 تم تسجيل الإيراد')
  }

  const createExpense = () => {

    addLedgerEntry({
      type: 'expense',
      amount: totalCashback,
      description: 'الكاش باك والمدفوعات'
    })

    alert('💸 تم تسجيل المصروف')
  }

  // ================= APPLY CASHBACK SYSTEM =================

  const runCashbackEngine = () => {

    orders.forEach(order => {

      if (order.customerPhone) {

        applyCashback(
          order.customerPhone,
          order.total
        )

      }

    })

    alert('🎁 تم تطبيق نظام الكاش باك')
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-700 to-blue-700 p-10 rounded-3xl">
        <h1 className="text-4xl font-black">
          💰 Finance ERP Core Module
        </h1>
        <p className="text-white/70 mt-2">
          نظام المحاسبة والربح والخسارة (SAP Finance Engine)
        </p>
      </div>

      {/* FINANCIAL KPIS */}
      <div className="grid md:grid-cols-4 gap-6">

        <Card title="💵 المبيعات" value={totalSales} color="green" />
        <Card title="💰 الربح" value={profit} color="emerald" />
        <Card title="💳 الالتزامات" value={liabilities} color="yellow" />
        <Card title="🏦 التدفق النقدي" value={cashFlow} color="purple" />

      </div>

      {/* ERP ACTIONS */}
      <div className="bg-slate-900 p-8 rounded-3xl space-y-5">

        <h2 className="text-3xl font-black text-yellow-400">
          ⚙ ERP Finance Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <button
            onClick={createIncome}
            className="bg-green-600 py-4 rounded-2xl font-black"
          >
            💰 تسجيل الإيرادات
          </button>

          <button
            onClick={createExpense}
            className="bg-red-600 py-4 rounded-2xl font-black"
          >
            💸 تسجيل المصروفات
          </button>

          <button
            onClick={runCashbackEngine}
            className="bg-yellow-500 text-black py-4 rounded-2xl font-black"
          >
            🎁 تشغيل الكاش باك
          </button>

        </div>

      </div>

      {/* LEDGER */}
      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-2xl font-black mb-5">
          📒 دفتر القيود المالية (Ledger)
        </h2>

        {ledger.length === 0 && (
          <div className="text-gray-500">
            لا توجد قيود مالية
          </div>
        )}

        <div className="space-y-4">

          {ledger.map(entry => (
            <div key={entry.id} className="bg-black p-4 rounded-xl border border-slate-700">

              <div className="flex justify-between">

                <div className="font-black text-yellow-400">
                  {entry.type === 'income' ? '📈 دخل' : '📉 مصروف'}
                </div>

                <div className="font-bold">
                  {Number(entry.amount).toLocaleString()} ج.م
                </div>

              </div>

              <div className="text-gray-400 mt-2">
                {entry.description}
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* TRANSACTIONS */}
      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-2xl font-black mb-5">
          🔄 العمليات المالية
        </h2>

        <div className="text-gray-300">
          عدد العمليات: {totalTransactions}
        </div>

        <div className="text-gray-300">
          التحويلات: {totalTransfers}
        </div>

      </div>

    </div>
  )
}

// ================= CARD =================

function Card({ title, value, color }) {

  const colors = {
    green: 'border-green-500 text-green-400',
    emerald: 'border-emerald-500 text-emerald-400',
    yellow: 'border-yellow-500 text-yellow-400',
    purple: 'border-purple-500 text-purple-400'
  }

  return (
    <div className={`bg-slate-900 p-6 rounded-2xl border ${colors[color]}`}>
      <div className="font-bold">{title}</div>
      <div className="text-3xl font-black mt-3">
        {Number(value).toLocaleString()}
      </div>
    </div>
  )
}