import { useMemo } from 'react'

export default function WalletStats({
  totalWalletBalance,
  totalCashback,
  totalTransactions,
  customersWithBalance
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

      {/* TOTAL BALANCE */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
        <div className="text-gray-400 font-bold mb-2">
          💰 إجمالي المحافظ
        </div>
        <div className="text-3xl font-black text-green-400">
          {Number(totalWalletBalance || 0).toLocaleString()} ج.م
        </div>
      </div>

      {/* CASHBACK */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
        <div className="text-gray-400 font-bold mb-2">
          🎁 إجمالي الكاش باك
        </div>
        <div className="text-3xl font-black text-yellow-400">
          {Number(totalCashback || 0).toLocaleString()} ج.م
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
        <div className="text-gray-400 font-bold mb-2">
          🔄 عدد العمليات
        </div>
        <div className="text-3xl font-black text-blue-400">
          {totalTransactions || 0}
        </div>
      </div>

      {/* CUSTOMERS */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6">
        <div className="text-gray-400 font-bold mb-2">
          👥 عملاء لديهم رصيد
        </div>
        <div className="text-3xl font-black text-pink-400">
          {customersWithBalance || 0}
        </div>
      </div>

    </div>
  )
}