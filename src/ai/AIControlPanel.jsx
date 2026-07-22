import { useOrderStore } from "../store/orderStore";import { useMemo, useState } from 'react';

import { useAIWarehouseStore } from '../store/ذكاء_المخازن_الاربى';
import { useInventoryStore } from '../store/inventoryStore';

import { useAutoPilotStore } from '../store/autoPilotStore';

export default function AIControlPanel() {

  // ================= STORES =================

  const stockItems = useInventoryStore((s) => s.stockItems);
  const warehouses = useInventoryStore((s) => s.warehouses);
  const orders = useOrderStore((s) => s.orders);

  const autoPilot = useAutoPilotStore();
  const enabled = autoPilot.enabled;

  const AI = useAIWarehouseStore();

  // ================= STATES =================

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ================= RUN AI =================

  const runAI = async () => {

    setLoading(true);

    try {

      const report = AI.تقرير_ذكاء_المخازن({
        stockItems,
        orders,
        warehouses
      });

      setResult(report);

    } finally {

      setLoading(false);

    }

  };

  // ================= MEMO =================

  const summary = useMemo(() => {

    if (!result) return null;

    return result.ملخص;

  }, [result]);

  const stats = useMemo(() => {

    return {

      warehouses: warehouses?.length || 0,

      products: stockItems?.length || 0,

      orders: orders?.length || 0,

      autoPilot: enabled

    };

  }, [

  warehouses,

  stockItems,

  orders,

  enabled]

  );

  // ================= UI =================

  return (

    <div className="p-8 text-white space-y-10">

    <div className="grid md:grid-cols-4 gap-4">

      <div className="bg-slate-900 p-5 rounded-2xl">

        <div className="text-gray-400">

          المخازن

        </div>

        <div className="text-3xl font-black text-cyan-400">

          {stats.warehouses}

        </div>

      </div>

      <div className="bg-slate-900 p-5 rounded-2xl">

        <div className="text-gray-400">

          الأصناف

        </div>

        <div className="text-3xl font-black text-green-400">

          {stats.products}

        </div>

      </div>

      <div className="bg-slate-900 p-5 rounded-2xl">

        <div className="text-gray-400">

          الطلبات

        </div>

        <div className="text-3xl font-black text-yellow-400">

          {stats.orders}

        </div>

      </div>

      <div className="bg-slate-900 p-5 rounded-2xl">

        <div className="text-gray-400">

          Auto Pilot

        </div>

        <div className={`text-3xl font-black ${stats.autoPilot ? 'text-green-400' : 'text-red-400'}`}>

          {stats.autoPilot ? 'ON' : 'OFF'}

        </div>

      </div>

    </div>

    <div className="bg-gradient-to-r from-purple-900 to-blue-600 p-8 rounded-3xl">

  <h1 className="text-4xl font-black">
    🧠 AI Control Panel
  </h1>

  <p className="text-gray-300 mt-2">
    نظام اتخاذ القرار الذكي للمخازن
  </p>

</div>

      {/* AUTO PILOT */}

      <div className="bg-slate-900 p-6 rounded-2xl border border-green-500">

        <h2 className="text-2xl font-black">
          🤖 Auto Pilot
        </h2>

        <button

          onClick={() =>
          autoPilot.setEnabled(
            !enabled
          )
          }

          className="
            mt-4
            px-5
            py-3
            rounded-xl
            bg-green-600
            hover:bg-green-700
            font-black
          ">








          

          {enabled ?
          '🟢 مفعل' :
          '🔴 متوقف'
          }

        </button>

      </div>

      {/* CONTROL BUTTON */}

      <div className="flex gap-4">

        <button
          onClick={runAI}
          disabled={loading}
          className="
            bg-green-600
            hover:bg-green-700
            px-6
            py-4
            rounded-2xl
            font-black
            text-white
          ">








          

          {loading ?
          '⏳ AI يعمل...' :
          '🚀 تشغيل الذكاء الاصطناعي'
          }

        </button>

      </div>

      {/* SUMMARY */}

      {summary &&

      <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500 space-y-3">

          <h2 className="text-2xl font-black">
            📊 ملخص الذكاء
          </h2>

          <div>
            ⚠ منتجات خطرة: {summary.منتجات_خطرة}
          </div>

          <div className="text-yellow-400 font-bold">
            {summary.اقتراح}
          </div>

        </div>

      }

      {/* LOW STOCK ALERTS */}

      {result?.نقص?.length > 0 &&

      <div className="bg-red-900/30 border border-red-500 p-6 rounded-2xl">

          <h2 className="text-2xl font-black mb-4">
            ⚠ تنبيهات المخزون
          </h2>

          <div className="space-y-3">

            {result.نقص.map((item) =>

          <div
            key={item.productId}
            className="bg-slate-800 p-4 rounded-xl flex justify-between">
            

                <div>

                  <div className="font-bold">
                    {item.الاسم}
                  </div>

                  <div className="text-sm text-gray-400">
                    الأيام المتبقية: {item.ايام_متبقية}
                  </div>

                </div>

                <div
              className={`font-black ${
              item.خطر === 'HIGH' ?
              'text-red-400' :
              'text-green-400'}`
              }>
              

                  {item.خطر}

                </div>

              </div>

          )}

          </div>

        </div>

      }

      {/* TRANSFER SUGGESTIONS */}

      {result?.نقل?.length > 0 &&

      <div className="bg-blue-900/30 border border-blue-500 p-6 rounded-2xl">

          <h2 className="text-2xl font-black mb-4">
            🔁 اقتراحات النقل
          </h2>

          <div className="space-y-3">

            {result.نقل.map((t, index) =>

          <div
            key={index}
            className="bg-slate-800 p-4 rounded-xl">
            

                <div>
                  📦 المنتج: {t.productId}
                </div>

                <div>
                  🔄 من: {t.من}
                </div>

                <div>
                  📥 إلى: {t.الى}
                </div>

                <div className="text-yellow-400 font-bold">
                  🧠 السبب: {t.سبب}
                </div>

              </div>

          )}

          </div>

        </div>

      }

      {/* DEMAND ANALYSIS */}

      {result?.طلب?.length > 0 &&

      <div className="bg-slate-900 p-6 rounded-2xl border border-purple-500">

          <h2 className="text-2xl font-black mb-4">
            📈 تحليل الطلب
          </h2>

          <div className="space-y-2">

            {result.طلب.map((p) =>

          <div
            key={p.productId}
            className="flex justify-between">
            

                <div>
                  {p.productId}
                </div>

                <div
              className={
              p.اتجاه === 'HIGH' ?
              'text-red-400' :
              'text-gray-300'
              }>
              

                  {p.اتجاه}

                </div>

              </div>

          )}

          </div>

        </div>

      }

    </div>);



}