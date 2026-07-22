import { useUserStore } from "../store/userStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo } from 'react';


import { useInventoryStore } from '../store/inventoryStore';
import { useAnalyticsStore } from '../store/analyticsStore';

import ذكاء_المخزون_العربي from
'../components/المخازن/ذكاء_المخزون_العربي';

export default function لوحة_ERP_الرئيسية() {

  // ================= STORES =================

  const products =
  useProductStore((s) => s.products) || [];

  const orders =
  useOrderStore((s) => s.orders) || [];

  const users =
  useUserStore((s) => s.users) || [];

  const warehouses =
  useInventoryStore((s) => s.warehouses) || [];

  const stockItems =
  useInventoryStore((s) => s.stockItems) || [];

  const getInventorySummary =
  useInventoryStore((s) => s.getInventorySummary);

  const dashboardStats =
  useAnalyticsStore((s) => s.dashboardStats);

  const summary =
  getInventorySummary?.() || {
    totalItems: 0,
    totalQuantity: 0,
    totalValue: 0,
    lowStock: 0
  };

  // ================= ANALYTICS =================

  const التحليل_المركزي = useMemo(() => {

    const totalSales =
    (orders || []).reduce(
      (a, o) => a + Number(o.total || 0),
      0
    );

    const totalProfit =
    totalSales * 0.25;

    const lowStock =
    summary.lowStock;

    const criticalStock =
    (stockItems || []).filter(
      (i) => Number(i.quantity || 0) === 0
    ).length;

    return {
      totalSales,
      totalProfit,
      lowStock,
      criticalStock
    };

  }, [orders, stockItems, summary.lowStock]);

  // ================= UI =================

  return (

    <div className="p-10 bg-black text-white min-h-screen space-y-10">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-blue-900 via-purple-800 to-yellow-500 p-10 rounded-3xl">

        <h1 className="text-5xl font-black">
          🟦 لوحة ERP المركزية
        </h1>

        <p className="text-xl mt-3">
          نظام إدارة شامل لكل الشركة (مخازن + مبيعات + ذكاء اصطناعي)
        </p>

      </div>

      {/* ================= KPI ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-green-700 p-6 rounded-3xl text-center">
          <div className="text-xl">💰 المبيعات</div>
          <div className="text-4xl font-black">
            {تحليل_المركزي.totalSales}
          </div>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-3xl text-center">
          <div className="text-xl">📈 الأرباح</div>
          <div className="text-4xl font-black">
            {تحليل_المركزي.totalProfit}
          </div>
        </div>

        <div className="bg-red-700 p-6 rounded-3xl text-center">
          <div className="text-xl">🚨 نفاد المخزون</div>
          <div className="text-4xl font-black">
            {تحليل_المركزي.criticalStock}
          </div>
        </div>

        <div className="bg-blue-700 p-6 rounded-3xl text-center">
          <div className="text-xl">⚠ منخفض المخزون</div>
          <div className="text-4xl font-black">
            {تحليل_المركزي.lowStock}
          </div>
        </div>

      </div>

      {/* ================= SYSTEM OVERVIEW ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-3xl">
          <h2 className="text-2xl font-black mb-3">🏭 المخازن</h2>
          <div className="text-4xl font-black text-yellow-400">
            {warehouses.length}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl">
          <h2 className="text-2xl font-black mb-3">📦 المنتجات</h2>
          <div className="text-4xl font-black text-green-400">
            {products.length}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl">
          <h2 className="text-2xl font-black mb-3">👥 المستخدمين</h2>
          <div className="text-4xl font-black text-blue-400">
            {users.length}
          </div>
        </div>

      </div>

      {/* ================= AI MODULE ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-black text-purple-400 mb-6">
          🧠 الذكاء الاصطناعي للمخازن
        </h2>

        <ذكاء_المخزون_العربي />

      </div>

    </div>);


}