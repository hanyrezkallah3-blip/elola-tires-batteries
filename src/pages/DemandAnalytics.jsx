import {
  useMemo
} from 'react'

import useMarketDemandStore
  from '../store/marketDemandStore'



// ======================================================
// EL OLA ERP
// Market Demand Analytics
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
// This page reads directly from marketDemandStore.
//
// It does NOT use:
// - DemandTelemetry
// - legacy DemandAnalytics
// - DemandBI
//
// Market Demand is independent from inventory.
//
// ======================================================



export default function DemandAnalytics() {

  // ====================================================
  // MARKET DEMAND STORE
  // ====================================================

  const demandEvents =
    useMarketDemandStore(
      state =>
        state.demandEvents || []
    )


  const getSummary =
    useMarketDemandStore(
      state =>
        state.getSummary
    )


  const getTopRequestedProducts =
    useMarketDemandStore(
      state =>
        state.getTopRequestedProducts
    )


  const getTopPurchasedProducts =
    useMarketDemandStore(
      state =>
        state.getTopPurchasedProducts
    )


  const getSupplyOpportunities =
    useMarketDemandStore(
      state =>
        state.getSupplyOpportunities
    )


  const getTopNotPurchasedProducts =
    useMarketDemandStore(
      state =>
        state.getTopNotPurchasedProducts
    )


  const getReasonAnalytics =
    useMarketDemandStore(
      state =>
        state.getReasonAnalytics
    )


  const getVehicleAnalytics =
    useMarketDemandStore(
      state =>
        state.getVehicleAnalytics
    )



  // ====================================================
  // SUMMARY
  // ====================================================

  const summary =
    useMemo(
      () => {

        try {

          return (
            getSummary?.() || {}
          )

        } catch (error) {

          console.error(
            '[MarketDemand] summary failed:',
            error
          )

          return {}

        }

      },
      [
        demandEvents,
        getSummary
      ]
    )



  // ====================================================
  // TOP REQUESTED
  // ====================================================

  const topRequested =
    useMemo(
      () => {

        try {

          return (
            getTopRequestedProducts?.(10) ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] requested products failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getTopRequestedProducts
      ]
    )



  // ====================================================
  // TOP PURCHASED
  // ====================================================

  const topPurchased =
    useMemo(
      () => {

        try {

          return (
            getTopPurchasedProducts?.(10) ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] purchased products failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getTopPurchasedProducts
      ]
    )



  // ====================================================
  // SUPPLY OPPORTUNITIES
  // ====================================================

  const supplyOpportunities =
    useMemo(
      () => {

        try {

          return (
            getSupplyOpportunities?.(10) ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] supply opportunities failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getSupplyOpportunities
      ]
    )



  // ====================================================
  // NOT PURCHASED
  // ====================================================

  const notPurchased =
    useMemo(
      () => {

        try {

          return (
            getTopNotPurchasedProducts?.(10) ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] not purchased failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getTopNotPurchasedProducts
      ]
    )



  // ====================================================
  // REASONS
  // ====================================================

  const reasons =
    useMemo(
      () => {

        try {

          return (
            getReasonAnalytics?.() ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] reasons failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getReasonAnalytics
      ]
    )



  // ====================================================
  // VEHICLE ANALYTICS
  // ====================================================

  const vehicles =
    useMemo(
      () => {

        try {

          return (
            getVehicleAnalytics?.() ||
            []
          )

        } catch (error) {

          console.error(
            '[MarketDemand] vehicle analytics failed:',
            error
          )

          return []

        }

      },
      [
        demandEvents,
        getVehicleAnalytics
      ]
    )



  // ====================================================
  // NORMALIZED SUMMARY
  // ====================================================
  //
  // These names now match marketDemandStore exactly.
  //
  // ====================================================

  const requestedCount =
    Number(
      summary?.totalRequests ??
      0
    )


  const viewedCount =
    Number(
      summary?.totalViews ??
      0
    )


  const addedCount =
    Number(
      summary?.totalAddedToCart ??
      0
    )


  const purchasedCount =
    Number(
      summary?.totalPurchased ??
      0
    )


  const unavailableCount =
    Number(
      summary?.totalUnavailableRequests ??
      0
    )


  const notPurchasedCount =
    Number(
      summary?.totalNotPurchased ??
      0
    )



  // ====================================================
  // CONVERSION
  // ====================================================

  const conversionRate =
    requestedCount > 0
      ? (
          purchasedCount /
          requestedCount
        ) * 100
      : 0



  const cartRate =
    requestedCount > 0
      ? (
          addedCount /
          requestedCount
        ) * 100
      : 0



  // ====================================================
  // TOTAL EVENTS
  // ====================================================

  const totalEvents =
    demandEvents.length



  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="
      p-8
      bg-black
      min-h-screen
      text-white
      space-y-8
    ">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div>

        <h1 className="
          text-4xl
          font-black
          text-yellow-400
        ">

          🧠 تحليل طلبات السوق

        </h1>


        <p className="
          text-gray-400
          mt-2
        ">

          تحليل حقيقي لسلوك العملاء والمنتجات المطلوبة
          والمبيعات والمنتجات غير المتوفرة وأسباب عدم الشراء.

        </p>

      </div>



      {/* ==================================================
          MAIN STATS
      ================================================== */}

      <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">


        <StatCard

          title="إجمالي الطلبات"

          value={
            requestedCount
          }

          subtitle="عدد المنتجات التي طلبها العملاء"

        />


        <StatCard

          title="تمت المشاهدة"

          value={
            viewedCount
          }

          subtitle="منتجات ظهرت للعملاء"

        />


        <StatCard

          title="تمت الإضافة للسلة"

          value={
            addedCount
          }

          subtitle={
            `${formatPercent(
              cartRate
            )} معدل الإضافة`
          }

        />


        <StatCard

          title="تم الشراء"

          value={
            purchasedCount
          }

          subtitle={
            `${formatPercent(
              conversionRate
            )} معدل التحويل`
          }

        />

      </div>



      {/* ==================================================
          SECONDARY STATS
      ================================================== */}

      <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">


        <StatCard

          title="غير متوفر"

          value={
            unavailableCount
          }

          subtitle="طلب على منتج غير متوفر"

        />


        <StatCard

          title="لم يتم الشراء"

          value={
            notPurchasedCount
          }

          subtitle="طلبات لم تتحول إلى شراء"

        />


        <StatCard

          title="معدل الشراء"

          value={
            formatPercent(
              conversionRate
            )
          }

          subtitle="Purchase Conversion"

        />


        <StatCard

          title="إجمالي الأحداث"

          value={
            totalEvents
          }

          subtitle="كل أحداث Market Demand المسجلة"

        />

      </div>



      {/* ==================================================
          TOP REQUESTED
      ================================================== */}

      <AnalyticsSection

        title="🔥 أكثر المنتجات طلبًا"

        emptyMessage="لا توجد طلبات مسجلة حتى الآن."

      >

        {
          topRequested.map(
            (item, index) => (

              <ProductRow

                key={
                  item.productId ||
                  item.sku ||
                  `requested-${index}`
                }

                rank={
                  index + 1
                }

                name={
                  getProductDisplayName(
                    item
                  )
                }

                value={
                  Number(
                    item.requested ??
                    0
                  )
                }

                label="طلب"

              />

            )
          )
        }

      </AnalyticsSection>



      {/* ==================================================
          TOP PURCHASED
      ================================================== */}

      <AnalyticsSection

        title="🛒 أكثر المنتجات شراءً"

        emptyMessage="لا توجد عمليات شراء مسجلة حتى الآن."

      >

        {
          topPurchased.map(
            (item, index) => (

              <ProductRow

                key={
                  item.productId ||
                  item.sku ||
                  `purchased-${index}`
                }

                rank={
                  index + 1
                }

                name={
                  getProductDisplayName(
                    item
                  )
                }

                value={
                  Number(
                    item.purchased ??
                    0
                  )
                }

                label="شراء"

              />

            )
          )
        }

      </AnalyticsSection>



      {/* ==================================================
          SUPPLY OPPORTUNITIES
      ================================================== */}

      <AnalyticsSection

        title="⚠️ فرص التوريد"

        emptyMessage="لا توجد فرص توريد مكتشفة حتى الآن."

      >

        {
          supplyOpportunities.map(
            (item, index) => (

              <div

                key={
                  item.productId ||
                  item.sku ||
                  `supply-${index}`
                }

                className="
                  bg-slate-800
                  p-5
                  rounded-2xl
                  mb-3
                  border
                  border-slate-700
                "

              >

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">


                  <div>

                    <div className="
                      text-lg
                      font-black
                    ">

                      {
                        getProductDisplayName(
                          item
                        )
                      }

                    </div>


                    <div className="
                      text-gray-400
                      text-sm
                      mt-1
                    ">

                      طلب مرتفع مقارنة بالتوفر

                    </div>

                  </div>



                  <div className="
                    text-right
                  ">

                    <div className="
                      text-2xl
                      font-black
                      text-yellow-400
                    ">

                      {
                        Number(
                          item.requested ??
                          0
                        )
                      }

                    </div>


                    <div className="
                      text-xs
                      text-gray-400
                    ">

                      طلب

                    </div>

                  </div>


                </div>

              </div>

            )
          )
        }

      </AnalyticsSection>



      {/* ==================================================
          NOT PURCHASED
      ================================================== */}

      <AnalyticsSection

        title="❌ منتجات طُلبت ولم تُشترَ"

        emptyMessage="لا توجد بيانات كافية عن عدم الشراء."

      >

        {
          notPurchased.map(
            (item, index) => (

              <ProductRow

                key={
                  item.productId ||
                  item.sku ||
                  `not-purchased-${index}`
                }

                rank={
                  index + 1
                }

                name={
                  getProductDisplayName(
                    item
                  )
                }

                value={
                  Number(
                    item.notPurchased ??
                    0
                  )
                }

                label="لم يُشترَ"

              />

            )
          )
        }

      </AnalyticsSection>



      {/* ==================================================
          CUSTOMER REASONS
      ================================================== */}

      <AnalyticsSection

        title="💬 أسباب عدم الشراء"

        emptyMessage="لم يسجل العملاء أسبابًا لعدم الشراء حتى الآن."

      >

        {
          Array.isArray(
            reasons
          )

            ? reasons.map(
                (item, index) => (

                  <div

                    key={
                      item.reason ||
                      index
                    }

                    className="
                      flex
                      items-center
                      justify-between
                      bg-slate-800
                      p-4
                      rounded-xl
                      mb-3
                    "

                  >

                    <div className="font-bold">

                      {
                        item.label ||
                        formatReason(
                          item.reason
                        )
                      }

                    </div>


                    <div className="
                      font-black
                      text-yellow-400
                    ">

                      {
                        Number(
                          item.count ??
                          0
                        )
                      }

                    </div>

                  </div>

                )
              )

            : Object.entries(
                reasons || {}
              ).map(
                (
                  [
                    reason,
                    value
                  ],
                  index
                ) => (

                  <div

                    key={
                      reason ||
                      index
                    }

                    className="
                      flex
                      items-center
                      justify-between
                      bg-slate-800
                      p-4
                      rounded-xl
                      mb-3
                    "

                  >

                    <div className="font-bold">

                      {
                        formatReason(
                          reason
                        )
                      }

                    </div>


                    <div className="
                      font-black
                      text-yellow-400
                    ">

                      {
                        typeof value === 'object'

                          ? Number(
                              value?.count ??
                              value?.total ??
                              0
                            )

                          : Number(
                              value || 0
                            )
                      }

                    </div>

                  </div>

                )
              )
        }

      </AnalyticsSection>



      {/* ==================================================
          VEHICLE DEMAND
      ================================================== */}

      <AnalyticsSection

        title="🚗 الطلب حسب المركبة"

        emptyMessage="لا توجد بيانات مركبات مرتبطة بالطلبات حتى الآن."

      >

        {
          vehicles.map(
            (item, index) => (

              <VehicleRow

                key={
                  `${item.vehicleType || ''}-${item.make || ''}-${item.model || ''}-${item.year || ''}-${index}`
                }

                item={
                  item
                }

              />

            )
          )
        }

      </AnalyticsSection>



      {/* ==================================================
          DATA DIAGNOSTIC
      ================================================== */}

      <div className="
        bg-slate-950
        border
        border-slate-800
        rounded-3xl
        p-5
      ">

        <div className="
          text-sm
          text-gray-500
        ">

          Market Demand Data

        </div>


        <div className="
          mt-2
          text-xs
          text-gray-600
          break-all
        ">

          {demandEvents.length} أحداث محفوظة محليًا

        </div>

      </div>


    </div>

  )

}



// ======================================================
// STAT CARD
// ======================================================

function StatCard({

  title,

  value,

  subtitle

}) {

  return (

    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      border
      border-slate-700
    ">


      <div className="
        text-gray-400
        mb-3
      ">

        {
          title
        }

      </div>


      <div className="
        text-4xl
        font-black
      ">

        {
          value
        }

      </div>


      {

        subtitle && (

          <div className="
            text-xs
            text-gray-500
            mt-3
          ">

            {
              subtitle
            }

          </div>

        )

      }


    </div>

  )

}



// ======================================================
// ANALYTICS SECTION
// ======================================================

function AnalyticsSection({

  title,

  emptyMessage,

  children

}) {

  const hasChildren =

    Array.isArray(
      children
    )

      ? children.length > 0

      : Boolean(
          children
        )


  return (

    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      border
      border-slate-800
    ">


      <h2 className="
        text-2xl
        font-black
        mb-5
      ">

        {
          title
        }

      </h2>


      {

        hasChildren

          ? children

          : (

            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              text-gray-500
              text-center
            ">

              {
                emptyMessage
              }

            </div>

          )

      }


    </div>

  )

}



// ======================================================
// PRODUCT ROW
// ======================================================

function ProductRow({

  rank,

  name,

  value,

  label

}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      gap-4
      bg-slate-800
      p-4
      rounded-xl
      mb-3
    ">


      <div className="
        flex
        items-center
        gap-4
      ">


        <div className="
          w-9
          h-9
          rounded-full
          bg-slate-700
          flex
          items-center
          justify-center
          font-black
        ">

          {
            rank
          }

        </div>


        <div className="font-bold">

          {
            name
          }

        </div>


      </div>


      <div className="
        text-right
      ">


        <div className="
          text-xl
          font-black
          text-yellow-400
        ">

          {
            value
          }

        </div>


        <div className="
          text-xs
          text-gray-500
        ">

          {
            label
          }

        </div>


      </div>


    </div>

  )

}



// ======================================================
// VEHICLE ROW
// ======================================================

function VehicleRow({

  item

}) {

  const vehicleType =
    item?.vehicleType ||
    ''


  const make =
    item?.make ||
    ''


  const model =
    item?.model ||
    ''


  const year =
    item?.year ||
    ''


  const vehicleName = [

    make,

    model,

    year

  ]
    .filter(Boolean)
    .join(' ') ||
    'مركبة غير محددة'



  return (

    <div className="
      bg-slate-800
      rounded-xl
      p-4
      mb-3
      flex
      items-center
      justify-between
      gap-4
    ">


      <div>

        <div className="font-bold">

          {
            vehicleName
          }

        </div>


        {

          vehicleType && (

            <div className="
              text-xs
              text-gray-500
              mt-1
            ">

              نوع المركبة:

              {' '}

              {
                vehicleType
              }

            </div>

          )

        }


      </div>


      <div className="
        text-right
      ">


        <div className="
          text-yellow-400
          font-black
          text-xl
        ">

          {
            Number(
              item?.requests ??
              0
            )
          }

        </div>


        <div className="
          text-xs
          text-gray-500
        ">

          طلب

        </div>


        {

          Number(
            item?.unavailableRequests ??
            0
          ) > 0 && (

            <div className="
              text-xs
              text-red-400
              mt-1
            ">

              غير متوفر:

              {' '}

              {
                Number(
                  item.unavailableRequests
                )
              }

            </div>

          )

        }


        {

          Number(
            item?.purchased ??
            0
          ) > 0 && (

            <div className="
              text-xs
              text-green-400
              mt-1
            ">

              شراء:

              {' '}

              {
                Number(
                  item.purchased
                )
              }

            </div>

          )

        }


      </div>


    </div>

  )

}



// ======================================================
// PRODUCT DISPLAY NAME
// ======================================================

function getProductDisplayName(
  item
) {

  if (
    !item
  ) {

    return 'منتج غير محدد'

  }


  const name =
    String(
      item.productName ??
      item.name ??
      item.title ??
      ''
    ).trim()



  if (
    name &&
    name !== 'منتج غير محدد'
  ) {

    return name

  }



  const size =
    String(
      item.size ??
      ''
    ).trim()



  if (
    size
  ) {

    return size

  }



  const sku =
    String(
      item.sku ??
      ''
    ).trim()



  if (
    sku
  ) {

    return sku

  }



  const productId =
    String(
      item.productId ??
      ''
    ).trim()



  if (
    productId
  ) {

    return productId

  }



  return 'منتج غير محدد'

}



// ======================================================
// FORMAT PERCENT
// ======================================================

function formatPercent(
  value
) {

  const number =
    Number(
      value
    )


  if (
    !Number.isFinite(
      number
    )
  ) {

    return '0.0%'

  }


  return (
    `${number.toFixed(1)}%`
  )

}



// ======================================================
// REASON LABEL
// ======================================================

function formatReason(
  reason
) {

  const labels = {

    price:
      'السعر غير مناسب',

    unavailable:
      'المنتج غير متوفر',

    not_needed:
      'لم أعد بحاجة إليه',

    alternative:
      'اخترت منتجًا آخر',

    other:
      'سبب آخر',

    out_of_stock:
      'المنتج غير متوفر',

    price_high:
      'السعر مرتفع',

    not_suitable:
      'المنتج غير مناسب',

    wrong_specification:
      'المواصفات غير مناسبة',

    wrong_brand:
      'أبحث عن ماركة أخرى',

    looking_for_alternative:
      'أبحث عن بديل',

    will_buy_later:
      'سأشتري لاحقًا',

    left_page:
      'غادر الصفحة',

    cart_abandoned:
      'ترك السلة بدون إتمام الطلب',

    checkout_abandoned:
      'بدأ الشراء ولم يكمله'

  }


  return (

    labels[
      reason
    ] ||

    reason ||

    'سبب غير محدد'

  )

}