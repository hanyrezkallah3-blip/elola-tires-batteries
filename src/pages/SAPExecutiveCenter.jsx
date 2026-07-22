import { useUserStore } from "../store/userStore";import { useWalletStore } from "../store/walletStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo } from 'react';

import PredictiveERP from
'../ai/PredictiveERP';

import BusinessIntelligenceEngine from
'../ai/BusinessIntelligenceEngine';

import SAPSupervisor from
'../ai/SAPSupervisor';




import { useInventoryStore } from
'../store/inventoryStore';

export default function SAPExecutiveCenter() {

  const products =
  useProductStore(
    (s) => s.products || []
  );

  const orders =
  useOrderStore(
    (s) => s.orders || []
  );

  const wallets =
  useWalletStore(
    (s) => s.wallets || []
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

  const predictive =
  useMemo(() => {

    return PredictiveERP.
    generatePredictiveReport();

  }, []);

  const business =
  useMemo(() => {

    return BusinessIntelligenceEngine.
    generateReport();

  }, []);

  const supervisor =
  useMemo(() => {

    return SAPSupervisor.run();

  }, []);

  const totalSales =
  orders.reduce(

    (acc, order) =>

    acc +
    Number(order.total || 0),

    0

  );

  const totalStockValue =
  stockItems.reduce(

    (acc, item) =>

    acc +

    Number(item.quantity || 0) *

    Number(item.price || 0),

    0

  );

  const totalWallets =
  wallets.reduce(

    (acc, wallet) =>

    acc +
    Number(wallet.balance || 0),

    0

  );

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
        from-slate-950
        via-blue-800
        to-yellow-500
        rounded-[40px]
        p-10
        shadow-2xl
      ">







        







        







        







        

        <h1 className="
          text-5xl
          font-black
        ">


          


          


          


          

          👑 SAP Executive Center

        </h1>

        <p className="
          mt-4
          text-xl
          text-white/90
        ">



          



          



          



          

          مركز الإدارة العليا والذكاء التنفيذي

        </p>

      </div>

      {/* KPI */}

      <div className="
        grid
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">




        




        




        




        

        <div className="
          bg-green-700
          p-8
          rounded-3xl
        ">



          



          



          



          

          <div>إجمالي المبيعات</div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">



            



            



            



            

            {totalSales}

          </div>

        </div>

        <div className="
          bg-blue-700
          p-8
          rounded-3xl
        ">



          



          



          



          

          <div>قيمة المخزون</div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">



            



            



            



            

            {Math.round(
              totalStockValue
            )}

          </div>

        </div>

        <div className="
          bg-purple-700
          p-8
          rounded-3xl
        ">



          



          



          



          

          <div>المحافظ</div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">



            



            



            



            

            {Math.round(
              totalWallets
            )}

          </div>

        </div>

        <div className="
          bg-yellow-500
          text-black
          p-8
          rounded-3xl
        ">




          




          




          




          

          <div>المستخدمون</div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">



            



            



            



            

            {users.length}

          </div>

        </div>

      </div>

      {/* ERP STATUS */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-8
      ">



        



        



        



        

        <h2 className="
          text-3xl
          font-black
          text-cyan-400
          mb-8
        ">




          




          




          




          

          🧠 SAP Supervisor

        </h2>

        <pre className="
          whitespace-pre-wrap
          text-green-400
        ">


          


          


          


          

          {JSON.stringify(
            supervisor,
            null,
            2
          )}

        </pre>

      </div>

      {/* PREDICTIVE */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-8
      ">



        



        



        



        

        <h2 className="
          text-3xl
          font-black
          text-yellow-400
          mb-8
        ">




          




          




          




          

          🔮 Predictive ERP

        </h2>

        <div className="
          grid
          xl:grid-cols-2
          gap-8
        ">



          



          



          



          

          <div className="
            bg-slate-800
            rounded-3xl
            p-6
          ">



            



            



            



            

            <div className="
              text-xl
              font-bold
            ">


              


              


              


              

              الإيراد المتوقع

            </div>

            <div className="
              text-5xl
              font-black
              mt-4
              text-green-400
            ">




              




              




              




              

              {predictive.monthlyRevenue}

            </div>

          </div>

          <div className="
            bg-slate-800
            rounded-3xl
            p-6
          ">



            



            



            



            

            <div className="
              text-xl
              font-bold
            ">


              


              


              


              

              المنتجات المتوقع نفادها

            </div>

            <div className="
              text-5xl
              font-black
              mt-4
              text-red-400
            ">




              




              




              




              

              {

              predictive.
              stockOutForecast?.
              filter(
                (item) =>
                item.daysRemaining <= 30
              ).
              length

              }

            </div>

          </div>

        </div>

      </div>

      {/* BI */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-8
      ">



        



        



        



        

        <h2 className="
          text-3xl
          font-black
          text-green-400
          mb-8
        ">




          




          




          




          

          📈 Business Intelligence

        </h2>

        <div className="
          grid
          xl:grid-cols-3
          gap-6
        ">



          



          



          



          

          <div className="
            bg-slate-800
            p-6
            rounded-3xl
          ">



            



            



            



            

            <div>

              أفضل المنتجات

            </div>

            <div className="
              text-4xl
              font-black
              mt-4
            ">



              



              



              



              

              {

              business.
              topProducts?.
              length || 0

              }

            </div>

          </div>

          <div className="
            bg-slate-800
            p-6
            rounded-3xl
          ">



            



            



            



            

            <div>

              اقتراحات شراء

            </div>

            <div className="
              text-4xl
              font-black
              mt-4
            ">



              



              



              



              

              {

              business.
              purchaseSuggestions?.
              length || 0

              }

            </div>

          </div>

          <div className="
            bg-slate-800
            p-6
            rounded-3xl
          ">



            



            



            



            

            <div>

              مخاطر المخزون

            </div>

            <div className="
              text-4xl
              font-black
              mt-4
            ">



              



              



              



              

              {

              business.
              stockRisk?.
              length || 0

              }

            </div>

          </div>

        </div>

      </div>

      {/* SYSTEM */}

      <div className="
        grid
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">




        




        




        




        

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
        ">



          



          



          



          

          🏭 المخازن

          <div className="
            text-4xl
            font-black
            mt-4
          ">



            



            



            



            

            {warehouses.length}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
        ">



          



          



          



          

          📦 الأصناف

          <div className="
            text-4xl
            font-black
            mt-4
          ">



            



            



            



            

            {products.length}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
        ">



          



          



          



          

          🛒 الطلبات

          <div className="
            text-4xl
            font-black
            mt-4
          ">



            



            



            



            

            {orders.length}

          </div>

        </div>

        <div className="
          bg-slate-900
          p-6
          rounded-3xl
        ">



          



          



          



          

          📋 المخزون

          <div className="
            text-4xl
            font-black
            mt-4
          ">



            



            



            



            

            {stockItems.length}

          </div>

        </div>

      </div>

    </div>);



}