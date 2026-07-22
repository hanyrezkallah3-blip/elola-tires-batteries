import { useUserStore } from "../store/userStore";import { useWalletStore } from "../store/walletStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo } from 'react';
import { useWebsiteStore } from '../store/websiteStore';
import ProtectedRoute from '../security/ProtectedRoute';

export default function SAPUltimateERP() {

  // ================= GLOBAL DATA =================

  const orders = useOrderStore((s) => s.orders || []);
  const products = useProductStore((s) => s.products || []);
  const wallets = useWalletStore((s) => s.wallets || []);
  const transfers = useWebsiteStore((s) => s.transfers || []);
  const users = useUserStore((s) => s.users || []);

  // ================= CORE ENGINE =================

  const sales = useMemo(
    () => orders.reduce((a, o) => a + Number(o.total || 0), 0),
    [orders]
  );

  const profit = useMemo(() => {
    const walletCost = wallets.reduce(
      (a, w) => a + Number(w.balance || 0),
      0
    );
    return sales - walletCost;
  }, [sales, wallets]);

  const stockValue = useMemo(
    () => products.reduce(
      (a, p) =>
      a +
      Number(p.stock || 0) *
      Number(p.price || 0),
      0
    ),
    [products]
  );

  const systemLoad =
  orders.length +
  transfers.length +
  products.length;

  // ================= AI CORE BRAIN =================

  const aiScore = useMemo(() => {

    let score = 60;

    if (sales > 500000) score += 20;else
    if (sales > 200000) score += 10;

    if (profit > 100000) score += 15;else
    if (profit > 50000) score += 8;

    if (systemLoad > 500) score += 10;

    if (wallets.length > 0 && profit > 0)
    score += 5;

    return Math.max(
      0,
      Math.min(100, score)
    );

  }, [
  sales,
  profit,
  systemLoad,
  wallets.length]
  );

  // ================= AI ENGINE =================

  const aiInsight = useMemo(() => {

    if (profit < 0)
    return '🚨 خطر: الشركة تخسر مال';

    if (
    sales > 300000 &&
    profit > 100000)

    return '🔥 أداء ممتاز - نمو قوي';

    if (
    wallets.length > 0 &&
    profit < sales * 0.3)

    return '⚠️ المحافظ تؤثر على الأرباح';

    return '✅ النظام مستقر';

  }, [
  profit,
  sales,
  wallets.length]
  );

  const predictionNextMonth = useMemo(
    () => sales * 1.15,
    [sales]
  );

  const warehouseEfficiency = useMemo(() => {

    if (transfers.length === 0)
    return 50;

    return Math.min(
      100,
      products.length / transfers.length * 10
    );

  }, [
  products.length,
  transfers.length]
  );

  return (

    <ProtectedRoute
      permission="sap_admin"
      role="owner"
      page="sap_ultimate">
      

      <div className="min-h-screen bg-black text-white p-6 lg:p-10 space-y-10">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 p-10 rounded-[40px]">

          <h1 className="text-5xl font-black">
            🏆 SAP AI Enterprise Ultimate
          </h1>

          <p className="text-white/70 text-xl mt-2">
            نظام إدارة مؤسسات عالمي مدعوم بالذكاء الاصطناعي
          </p>

        </div>

        {/* KPI GRID */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">

          <Card title="💵 Sales" value={sales} />
          <Card title="📈 Profit" value={profit} />
          <Card title="📦 Stock Value" value={stockValue} />
          <Card title="⚙️ System Load" value={systemLoad} />
          <Card title="🧠 AI Score" value={aiScore} />

        </div>

        {/* AI CORE */}

        <div className="grid xl:grid-cols-2 gap-6">

          <div className="bg-slate-900 p-8 rounded-[30px] border border-green-600">

            <h2 className="text-3xl font-black text-green-400">
              🤖 AI Core Brain
            </h2>

            <div className="text-2xl mt-6 font-bold">
              {aiInsight}
            </div>

            <div className="mt-4 text-white/70">
              تقييم النظام: {aiScore}%
            </div>

          </div>

          <div className="bg-slate-900 p-8 rounded-[30px] border border-blue-600">

            <h2 className="text-3xl font-black text-blue-400">
              📊 AI Forecast
            </h2>

            <div className="mt-6 space-y-3 text-lg">

              <div>
                📈 توقع المبيعات:
                {' '}
                {predictionNextMonth.toLocaleString()}
                {' '}
                ج.م
              </div>

              <div>
                🏭 كفاءة المخازن:
                {' '}
                {warehouseEfficiency.toFixed(1)}%
              </div>

            </div>

          </div>

        </div>

        {/* SYSTEM STATUS */}

        <div className="bg-slate-900 p-8 rounded-[30px] border border-slate-700">

          <h2 className="text-3xl font-black mb-6">
            🌐 Enterprise System Status
          </h2>

          <ul className="space-y-3 text-lg">

            <li>
              💵 إجمالي المبيعات:
              {' '}
              {sales.toLocaleString()}
              {' '}
              ج.م
            </li>

            <li>
              📈 الأرباح:
              {' '}
              {profit.toLocaleString()}
              {' '}
              ج.م
            </li>

            <li>
              📦 قيمة المخزون:
              {' '}
              {stockValue.toLocaleString()}
              {' '}
              ج.م
            </li>

            <li>
              ⚙️ حجم العمليات:
              {' '}
              {systemLoad}
            </li>

            <li>
              🧠 AI Engine:
              {' '}
              {aiScore}%
            </li>

          </ul>

        </div>

      </div>

    </ProtectedRoute>);


}

function Card({ title, value }) {

  return (
    <div className="bg-slate-900 p-5 rounded-[25px] border border-slate-700 text-center">

      <div className="text-gray-400 font-bold">
        {title}
      </div>

      <div className="text-3xl font-black mt-3 text-white">
        {Number(value).toLocaleString()}
      </div>

    </div>);


}