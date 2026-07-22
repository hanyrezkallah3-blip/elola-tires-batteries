import { useUserStore } from "../store/userStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo } from 'react';

import AICommandCenter from
'../ai/AICommandCenter';

import { useWebsiteStore } from
'../store/websiteStore';

import { useInventoryStore } from
'../store/inventoryStore';

import { useAnalyticsStore } from
'../store/analyticsStore';

export default function ERPControlCenter() {

  const products =
  useProductStore(
    (s) => s.products || []
  );

  const orders =
  useOrderStore(
    (s) => s.orders || []
  );

  const notifications =
  useWebsiteStore(
    (s) => s.notifications || []
  );

  const users =
  useUserStore(
    (s) => s.users || []
  );

  const warehouses =
  useInventoryStore(
    (s) => s.warehouses || []
  );

  const stockItems =
  useInventoryStore(
    (s) => s.stockItems || []
  );

  const stockMovements =
  useInventoryStore(
    (s) => s.stockMovements || []
  );

  const erpSummary =
  useAnalyticsStore(
    (s) => s.erpSummary || {}
  );

  const status =
  useMemo(() => {

    return AICommandCenter.getStatus();

  }, []);

  const cards = [

  {
    title: 'المخازن',
    value: warehouses.length,
    color: 'bg-blue-700'
  },

  {
    title: 'المنتجات',
    value: products.length,
    color: 'bg-green-700'
  },

  {
    title: 'الطلبات',
    value: orders.length,
    color: 'bg-yellow-500 text-black'
  },

  {
    title: 'المستخدمون',
    value: users.length,
    color: 'bg-purple-700'
  },

  {
    title: 'الحركات المخزنية',
    value: stockMovements.length,
    color: 'bg-cyan-700'
  },

  {
    title: 'الإشعارات',
    value: notifications.length,
    color: 'bg-red-700'
  }];



  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
      lg:p-10
      space-y-8
    ">






      






      






      

      <div className="
        bg-gradient-to-r
        from-slate-950
        via-blue-900
        to-yellow-500
        p-8
        rounded-[40px]
        shadow-2xl
      ">







        







        







        

        <h1 className="
          text-5xl
          font-black
          text-white
        ">



          



          



          

          SAP ERP Control Center

        </h1>

        <p className="
          mt-4
          text-xl
          text-white/80
        ">



          



          



          

          مركز التحكم الذكي للنظام

        </p>

      </div>

      {/* AI STATUS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">





        





        





        

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
          border
          border-slate-700
        ">





          





          





          

          <div className="text-xl font-black">

            AI Command Center

          </div>

          <div className="
            mt-4
            text-3xl
            font-black
            text-green-400
          ">




            




            




            

            {status.running ?
            'RUNNING' :
            'STOPPED'}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
          border
          border-slate-700
        ">





          





          





          

          <div className="text-xl font-black">

            ERP Bridge

          </div>

          <div className="
            mt-4
            text-3xl
            font-black
            text-cyan-400
          ">




            




            




            

            {status.bridge ?
            'ACTIVE' :
            'OFF'}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
          border
          border-slate-700
        ">





          





          





          

          <div className="text-xl font-black">

            Auto Pilot

          </div>

          <div className="
            mt-4
            text-3xl
            font-black
            text-yellow-400
          ">




            




            




            

            {status.autoPilot ?
            'ACTIVE' :
            'OFF'}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
          border
          border-slate-700
        ">





          





          





          

          <div className="text-xl font-black">

            Warehouse AI

          </div>

          <div className="
            mt-4
            text-3xl
            font-black
            text-purple-400
          ">




            




            




            

            {status.warehouseAI ?
            'ACTIVE' :
            'OFF'}

          </div>

        </div>

      </div>

      {/* ERP STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">





        





        





        

        {cards.map((card, index) =>

        <div
          key={index}
          className={`
              ${card.color}
              p-8
              rounded-3xl
              shadow-2xl
            `}>
          

            <div className="
              text-2xl
              font-green
              mb-4
            ">



            



            



            

              {card.title}

            </div>

            <div className="
              text-5xl
              font-black
            ">


            


            


            

              {card.value}

            </div>

          </div>

        )}

      </div>

      {/* ERP SUMMARY */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-8
        border
        border-slate-700
      ">





        





        





        

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-yellow-400
        ">




          




          




          

          ERP Summary

        </h2>

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-6
        ">




          




          




          

          <div>
            <div>إجمالي المبيعات</div>
            <div className="text-3xl font-black">
              {erpSummary.totalSales || 0}
            </div>
          </div>

          <div>
            <div>إجمالي الأرباح</div>
            <div className="text-3xl font-black">
              {erpSummary.totalProfit || 0}
            </div>
          </div>

          <div>
            <div>Low Stock</div>
            <div className="text-3xl font-black text-red-400">
              {erpSummary.lowStock || 0}
            </div>
          </div>

          <div>
            <div>Critical Stock</div>
            <div className="text-3xl font-black text-red-600">
              {erpSummary.criticalStock || 0}
            </div>
          </div>

        </div>

      </div>

      {/* STOCK INFO */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-8
        border
        border-slate-700
      ">





        





        





        

        <h2 className="
          text-3xl
          font-black
          mb-8
        ">



          



          



          

          Inventory Overview

        </h2>

        <div className="
          text-2xl
          font-bold
        ">


          


          


          

          عدد الأصناف المخزنية:

          <span className="
            text-yellow-400
            mr-3
          ">


            


            


            

            {stockItems.length}

          </span>

        </div>

      </div>

    </div>);



}