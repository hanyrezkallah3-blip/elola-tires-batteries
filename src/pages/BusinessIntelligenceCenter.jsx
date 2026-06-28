import { useMemo } from 'react'

import BusinessIntelligenceEngine
  from '../ai/BusinessIntelligenceEngine'

export default function BusinessIntelligenceCenter() {

  const report =
    useMemo(() => {

      return BusinessIntelligenceEngine.generateReport()

    }, [])

  const topProducts =
    report?.topProducts || []

  const worstProducts =
    report?.worstProducts || []

  const purchaseSuggestions =
    report?.purchaseSuggestions || []

  const stockRisk =
    report?.stockRisk || []

  const warehouseProfit =
    report?.warehouseProfit || []

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
      lg:p-10
      space-y-8
    ">

      {/* HEADER */}

      <div className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        p-8
        rounded-[40px]
        shadow-2xl
      ">

        <h1 className="
          text-5xl
          font-black
        ">

          📈 Business Intelligence Center

        </h1>

        <p className="
          text-xl
          mt-4
          text-white/90
        ">

          مركز التحليلات الذكية والتوقعات

        </p>

      </div>

      {/* KPI */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        <div className="
          bg-green-700
          p-8
          rounded-3xl
        ">

          <div className="text-xl">

            المبيعات المتوقعة

          </div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">

            {report.forecastSales}

          </div>

        </div>

        <div className="
          bg-blue-700
          p-8
          rounded-3xl
        ">

          <div className="text-xl">

            أفضل المنتجات

          </div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">

            {topProducts.length}

          </div>

        </div>

        <div className="
          bg-red-700
          p-8
          rounded-3xl
        ">

          <div className="text-xl">

            مخاطر النفاد

          </div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">

            {stockRisk.length}

          </div>

        </div>

        <div className="
          bg-yellow-500
          text-black
          p-8
          rounded-3xl
        ">

          <div className="text-xl">

            أوامر الشراء

          </div>

          <div className="
            text-5xl
            font-black
            mt-4
          ">

            {purchaseSuggestions.length}

          </div>

        </div>

      </div>

      {/* TOP PRODUCTS */}

      <div className="
        bg-slate-900
        p-8
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-green-400
        ">

          🏆 أفضل المنتجات

        </h2>

        <div className="space-y-4">

          {topProducts.map((product) => (

            <div
              key={product.id}
              className="
                bg-slate-800
                p-5
                rounded-2xl
                flex
                justify-between
              "
            >

              <span>

                {product.name}

              </span>

              <span>

                {product.sold || 0}

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* WORST PRODUCTS */}

      <div className="
        bg-slate-900
        p-8
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-red-400
        ">

          📉 أضعف المنتجات

        </h2>

        <div className="space-y-4">

          {worstProducts.map((product) => (

            <div
              key={product.id}
              className="
                bg-slate-800
                p-5
                rounded-2xl
                flex
                justify-between
              "
            >

              <span>

                {product.name}

              </span>

              <span>

                {product.sold || 0}

              </span>

            </div>

          ))}

        </div>

      </div>

      {/* PURCHASE SUGGESTIONS */}

      <div className="
        bg-slate-900
        p-8
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-yellow-400
        ">

          🛒 اقتراحات الشراء

        </h2>

        <div className="space-y-4">

          {purchaseSuggestions.map((item) => (

            <div
              key={item.productId}
              className="
                bg-slate-800
                p-5
                rounded-2xl
              "
            >

              <div>

                {item.productName}

              </div>

              <div>

                المخزون الحالي:
                {item.currentStock}

              </div>

              <div>

                الكمية المقترحة:
                {item.suggestedOrder}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* STOCK RISK */}

      <div className="
        bg-slate-900
        p-8
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-red-500
        ">

          ⚠ المنتجات المعرضة للنفاد

        </h2>

        <div className="space-y-4">

          {stockRisk.map((item) => (

            <div
              key={item.id}
              className="
                bg-red-900/30
                border
                border-red-500
                p-5
                rounded-2xl
              "
            >

              {item.productName}

            </div>

          ))}

        </div>

      </div>

      {/* WAREHOUSE PROFIT */}

      <div className="
        bg-slate-900
        p-8
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-black
          mb-8
          text-cyan-400
        ">

          🏭 قيمة مخزون كل مخزن

        </h2>

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {warehouseProfit.map((warehouse) => (

            <div
              key={warehouse.warehouseId}
              className="
                bg-slate-800
                p-6
                rounded-3xl
              "
            >

              <div className="
                text-xl
                font-bold
              ">

                {warehouse.warehouseName}

              </div>

              <div className="
                text-4xl
                font-black
                text-yellow-400
                mt-4
              ">

                {warehouse.stockValue}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}