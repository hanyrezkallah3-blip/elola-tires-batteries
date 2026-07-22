import { useWalletStore } from "../store/walletStore";import { useOrderStore } from "../store/orderStore";import { useMemo } from 'react';
import { useWebsiteStore } from '../store/websiteStore';

export default function AIFinancialERP() {

  // ================= STORE =================

  const orders = useOrderStore((s) => s.orders || []);
  const wallets = useWalletStore((s) => s.wallets || []);
  const transfers = useWebsiteStore((s) => s.transfers || []);

  // ================= CORE DATA =================

  const salesData = useMemo(() => {
    return orders.map((o, i) => ({
      index: i + 1,
      value: Number(o.total || 0)
    }));
  }, [orders]);

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
  const cashFlow = netProfit - walletBalance;

  // ================= AI PREDICTION ENGINE =================

  const predictedNextMonthSales = useMemo(() => {
    const growthRate = 0.12; // 12% AI assumed growth

    return totalSales * (1 + growthRate);
  }, [totalSales]);

  const predictedProfit = useMemo(() => {
    return netProfit * 1.1;
  }, [netProfit]);

  const riskLevel = useMemo(() => {

    if (cashFlow < 0) return '🔥 خطر عالي';
    if (netProfit < 50000) return '⚠️ خطر متوسط';
    if (totalSales < 100000) return '📉 نمو ضعيف';

    return '✅ آمن';

  }, [cashFlow, netProfit, totalSales]);

  // ================= INSIGHTS ENGINE =================

  const insights = useMemo(() => {

    const list = [];

    if (cashFlow < 0)
    list.push('🚨 السيولة سلبية - تحتاج تدخل مالي');

    if (walletBalance > netProfit)
    list.push('⚠️ المحافظ تستهلك الأرباح');

    if (totalSales > 200000)
    list.push('📈 الشركة في مرحلة نمو قوي');

    if (orders.length > 100)
    list.push('🔥 نشاط عالي في الطلبات');

    if (list.length === 0)
    list.push('✅ الأداء مستقر');

    return list;

  }, [cashFlow, walletBalance, netProfit, totalSales, orders.length]);

  // ================= UI =================

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-800 p-10 rounded-[40px]">

        <h1 className="text-5xl font-black">
          🤖 AI Financial ERP
        </h1>

        <p className="text-white/70 text-xl mt-2">
          نظام ذكاء مالي متقدم + توقعات + تحليل مخاطر
        </p>

      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Card title="💵 المبيعات" value={totalSales} />
        <Card title="📈 الربح" value={netProfit} />
        <Card title="💳 المحافظ" value={walletBalance} />
        <Card title="🏦 السيولة" value={cashFlow} />

      </div>

      {/* AI PREDICTIONS */}
      <div className="grid xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-8 rounded-[30px] border border-green-600">

          <h2 className="text-3xl font-black text-green-400">
            📊 توقعات AI
          </h2>

          <div className="mt-6 space-y-4 text-lg">

            <div>📈 مبيعات الشهر القادم: {predictedNextMonthSales.toLocaleString()} ج.م</div>
            <div>💰 الربح المتوقع: {predictedProfit.toLocaleString()} ج.م</div>

          </div>

        </div>

        <div className="bg-slate-900 p-8 rounded-[30px] border border-red-600">

          <h2 className="text-3xl font-black text-red-400">
            ⚠️ تحليل المخاطر
          </h2>

          <div className="mt-6 text-2xl font-black">
            {riskLevel}
          </div>

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="bg-slate-900 p-8 rounded-[30px] border border-slate-700">

        <h2 className="text-3xl font-black mb-6">
          🧠 AI Insights Engine
        </h2>

        <ul className="space-y-3 text-lg">

          {insights.map((item, i) =>
          <li key={i}>• {item}</li>
          )}

        </ul>

      </div>

      {/* SIMPLE CHART VISUALIZATION */}
      <div className="bg-slate-900 p-8 rounded-[30px]">

        <h2 className="text-3xl font-black text-blue-400 mb-6">
          📊 Sales Trend (AI Graph)
        </h2>

        <div className="space-y-2">

          {salesData.slice(-10).map((d, i) =>

          <div key={i} className="flex items-center gap-3">

              <div className="w-20 text-gray-400">
                {d.index}
              </div>

              <div
              className="bg-blue-500 h-4 rounded"
              style={{
                width: `${Math.min(d.value / 1000, 100)}%`
              }} />
            

              <div className="text-green-400 font-bold">
                {d.value.toLocaleString()}
              </div>

            </div>

          )}

        </div>

      </div>

    </div>);

}

// ================= CARD =================

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 p-6 rounded-[25px] border border-slate-700">
      <h3 className="text-xl font-bold text-gray-300">{title}</h3>
      <div className="text-4xl font-black mt-4 text-white">
        {Number(value).toLocaleString()}
      </div>
    </div>);

}