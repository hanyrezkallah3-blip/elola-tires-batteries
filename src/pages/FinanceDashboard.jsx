import { useWalletStore } from "../store/walletStore";import { useOrderStore } from "../store/orderStore"; // ملف: pages/FinanceDashboard.jsx

import { useMemo } from 'react';
import { useWebsiteStore } from '../store/websiteStore';
import ProtectedRoute from '../security/ProtectedRoute';

export default function FinanceDashboard() {

  const orders = useOrderStore((s) => s.orders || []);
  const wallets = useWalletStore((s) => s.wallets || []);
  const transfers = useWebsiteStore((s) => s.transfers || []);
  const walletTransactions = useWalletStore((s) => s.walletTransactions || []);

  // ================= CORE =================

  const totalSales = useMemo(
    () => orders.reduce((a, o) => a + Number(o.total || 0), 0),
    [orders]
  );

  const walletBalance = useMemo(
    () => wallets.reduce((a, w) => a + Number(w.balance || 0), 0),
    [wallets]
  );

  const totalCashback = useMemo(
    () => wallets.reduce((a, w) => a + Number(w.totalCashback || 0), 0),
    [wallets]
  );

  const netProfit = totalSales - totalCashback;
  const realCashFlow = netProfit - walletBalance;

  // ================= HEALTH =================

  const healthScore = useMemo(() => {

    let score = 50;

    if (totalSales > 1000000) score += 25;else
    if (totalSales > 300000) score += 15;else
    score += 5;

    if (netProfit > 200000) score += 20;else
    if (netProfit > 50000) score += 10;else
    score -= 10;

    if (realCashFlow > 0) score += 15;else
    score -= 20;

    return Math.max(0, Math.min(100, score));

  }, [totalSales, netProfit, realCashFlow]);

  const status =
  healthScore >= 80 ? '🔥 قوية جدًا' :
  healthScore >= 60 ? '📈 جيدة' :
  healthScore >= 40 ? '⚠️ متوسطة' :
  '❌ ضعيفة';

  // ================= UI =================

  return (

    <ProtectedRoute
      permission="finance_access"
      role="owner"
      page="finance">
      

      <div className="min-h-screen bg-black text-white p-10 space-y-10">

        <h1 className="text-5xl font-black text-green-400">
          💰 Finance Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Card title="💵 المبيعات" value={totalSales} />
          <Card title="📈 الربح" value={netProfit} />
          <Card title="💳 المحافظ" value={walletBalance} />
          <Card title="⚡ السيولة" value={realCashFlow} />

        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-green-600">

          <h2 className="text-3xl font-black text-green-400">
            🤖 الحالة المالية
          </h2>

          <div className="text-6xl font-black mt-6">
            {healthScore}%
          </div>

          <p className="text-xl text-white/70 mt-3">
            {status}
          </p>

        </div>

      </div>

    </ProtectedRoute>);


}

// ================= CARD =================

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
      <div className="text-gray-400">{title}</div>
      <div className="text-4xl font-black mt-3">
        {Number(value).toLocaleString()}
      </div>
    </div>);

}