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



// ======================================================
// EVENT TYPES
// ======================================================

const EVENT_TYPES = {

  REQUESTED:
    'requested',

  VIEWED:
    'viewed',

  ADDED_TO_CART:
    'added_to_cart',

  CHECKOUT_STARTED:
    'checkout_started',

  PURCHASED:
    'purchased',

  FEEDBACK:
    'feedback'

}



// ======================================================
// SAFE ARRAY
// ======================================================

function toArray(
  value
) {

  if (
    Array.isArray(value)
  ) {

    return value

  }


  return []

}



// ======================================================
// PRODUCT COUNT
// ======================================================
//
// A REQUESTED or VIEWED event can contain multiple products.
// Therefore one event does not necessarily equal one product.
//
// ======================================================

function getEventProductCount(
  event
) {

  const products =
    toArray(
      event?.products
    )


  if (
    products.length > 0
  ) {

    return products.length

  }


  // ----------------------------------------------------
  // Some historical events may store a single product.
  // ----------------------------------------------------

  if (
    event?.product
  ) {

    return 1

  }


  return 0

}



// ======================================================
// MARKET DEMAND SUMMARY FROM RAW EVENTS
// ======================================================

function buildSummaryFromEvents(
  events
) {

  const safeEvents =
    toArray(
      events
    )


  const requestedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        EVENT_TYPES.REQUESTED
    )


  const viewedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        EVENT_TYPES.VIEWED
    )


  const addedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        EVENT_TYPES.ADDED_TO_CART
    )


  const purchasedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        EVENT_TYPES.PURCHASED
    )


  // ----------------------------------------------------
  // REQUESTED
  // ----------------------------------------------------

  const totalRequests =
    requestedEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        getEventProductCount(
          event
        ),
      0
    )


  // ----------------------------------------------------
  // VIEWED
  // ----------------------------------------------------

  const totalViews =
    viewedEvents.reduce(
      (
        total,
        event
      ) =>
        total +
        getEventProductCount(
          event
        ),
      0
    )


  // ----------------------------------------------------
  // ADDED TO CART
  // ----------------------------------------------------
  //
  // Each added_to_cart event represents one product action.
  //
  // If historical data contains products[] we count them.
  //
  // ----------------------------------------------------

  const totalAddedToCart =
    addedEvents.reduce(
      (
        total,
        event
      ) => {

        const count =
          getEventProductCount(
            event
          )

        return total +
          Math.max(
            1,
            count
          )

      },
      0
    )


  // ----------------------------------------------------
  // PURCHASED
  // ----------------------------------------------------

  const totalPurchased =
    purchasedEvents.reduce(
      (
        total,
        event
      ) => {

        const count =
          getEventProductCount(
            event
          )

        return total +
          Math.max(
            1,
            count
          )

      },
      0
    )


  // ----------------------------------------------------
  // UNAVAILABLE
  // ----------------------------------------------------
  //
  // Requested products that were explicitly unavailable.
  //
  // ----------------------------------------------------

  const totalUnavailableRequests =
    requestedEvents.reduce(
      (
        total,
        event
      ) => {

        const products =
          toArray(
            event?.products
          )


        if (
          products.length === 0
        ) {

          return total

        }


        return total +
          products.filter(
            product =>
              product?.available === false ||
              product?.isAvailable === false ||
              product?.inStock === false ||
              product?.stockAvailable === false ||
              product?.availability === 'unavailable' ||
              product?.availabilityStatus === 'unavailable' ||
              product?.status === 'unavailable'
          ).length

      },
      0
    )


  // ----------------------------------------------------
  // NOT PURCHASED
  // ----------------------------------------------------
  //
  // Historical dashboard semantics:
  //
  // viewed products that did not become purchases.
  //
  // This preserves the existing dashboard meaning:
  //
  // 8 viewed - 2 purchased = 6
  //
  // However, if viewed is lower than purchased, never
  // return a negative number.
  //
  // ----------------------------------------------------

  const notPurchased =
    Math.max(
      0,
      totalViews -
      totalPurchased
    )


  // ----------------------------------------------------
  // RATES
  // ----------------------------------------------------

  const purchaseConversion =
    totalRequests > 0

      ? (
          totalPurchased /
          totalRequests
        ) * 100

      : 0


  const addToCartRate =
    totalRequests > 0

      ? (
          totalAddedToCart /
          totalRequests
        ) * 100

      : 0


  return {

    totalRequests,

    requested:
      totalRequests,

    totalViews,

    viewed:
      totalViews,

    totalAddedToCart,

    addedToCart:
      totalAddedToCart,

    totalPurchased,

    purchased:
      totalPurchased,

    totalUnavailableRequests,

    unavailable:
      totalUnavailableRequests,

    notPurchased,

    totalNotPurchased:
      notPurchased,

    purchaseConversion,

    conversionRate:
      purchaseConversion,

    addToCartRate

  }

}



// ======================================================
// MAIN COMPONENT
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
  //
  // IMPORTANT:
  // Do NOT depend on store getSummary field aliases here.
  //
  // The dashboard derives its global funnel directly from
  // the actual persisted Market Demand events.
  //
  // ====================================================

  const summary =
    useMemo(
      () => {

        try {

          return buildSummaryFromEvents(
            demandEvents
          )

        } catch (error) {

          console.error(
            '[MarketDemand] summary failed:',
            error
          )

          return {

            totalRequests: 0,

            requested: 0,

            totalViews: 0,

            viewed: 0,

            totalAddedToCart: 0,

            addedToCart: 0,

            totalPurchased: 0,

            purchased: 0,

            totalUnavailableRequests: 0,

            unavailable: 0,

            notPurchased: 0,

            totalNotPurchased: 0,

            purchaseConversion: 0,

            conversionRate: 0,

            addToCartRate: 0

          }

        }

      },
      [
        demandEvents
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

          const analytics =
            getVehicleAnalytics?.() ||
            []


          if (
            !Array.isArray(
              analytics
            )
          ) {

            return []

          }


          return analytics.map(
            item => {

              if (
                !item
              ) {

                return item

              }


              const vehicleType =
                firstNonEmpty(

                  item.vehicleType,

                  item.vehicle_type,

                  item.type,

                  item.vehicle?.vehicleType,

                  item.vehicle?.vehicle_type,

                  item.vehicle?.type,

                  item.searchContext?.vehicleType,

                  item.searchContext?.vehicle_type,

                  item.searchContext?.type

                )


              const make =
                firstNonEmpty(

                  item.make,

                  item.brand,

                  item.manufacturer,

                  item.vehicle?.make,

                  item.vehicle?.brand,

                  item.vehicle?.manufacturer,

                  item.searchContext?.make,

                  item.searchContext?.brand,

                  item.searchContext?.manufacturer

                )


              const model =
                firstNonEmpty(

                  item.model,

                  item.modelFromSearch,

                  item.vehicle?.model,

                  item.vehicle?.modelName,

                  item.searchContext?.model,

                  item.searchContext?.modelFromSearch

                )


              const year =
                firstNonEmpty(

                  item.year,

                  item.modelYear,

                  item.model_year,

                  item.vehicle?.year,

                  item.vehicle?.modelYear,

                  item.vehicle?.model_year,

                  item.searchContext?.year,

                  item.searchContext?.modelYear,

                  item.searchContext?.model_year

                )


              return {

                ...item,

                vehicleType,

                make,

                model,

                year

              }

            }
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

  const requestedCount =
    Number(
      summary?.totalRequests ??
      summary?.requested ??
      0
    )


  const viewedCount =
    Number(
      summary?.totalViews ??
      summary?.viewed ??
      0
    )


  const addedCount =
    Number(
      summary?.totalAddedToCart ??
      summary?.addedToCart ??
      0
    )


  const purchasedCount =
    Number(
      summary?.totalPurchased ??
      summary?.purchased ??
      0
    )


  const unavailableCount =
    Number(
      summary?.totalUnavailableRequests ??
      summary?.unavailable ??
      0
    )


  const notPurchasedCount =
    Number(
      summary?.totalNotPurchased ??
      summary?.notPurchased ??
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
          value={requestedCount}
          subtitle="عدد المنتجات التي طلبها العملاء"
        />


        <StatCard
          title="تمت المشاهدة"
          value={viewedCount}
          subtitle="منتجات ظهرت للعملاء"
        />


        <StatCard
          title="تمت الإضافة للسلة"
          value={addedCount}
          subtitle={`${formatPercent(cartRate)} معدل الإضافة`}
        />


        <StatCard
          title="تم الشراء"
          value={purchasedCount}
          subtitle={`${formatPercent(conversionRate)} معدل التحويل`}
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
          value={unavailableCount}
          subtitle="طلب على منتج غير متوفر"
        />


        <StatCard
          title="لم يتم الشراء"
          value={notPurchasedCount}
          subtitle="طلبات لم تتحول إلى شراء"
        />


        <StatCard
          title="معدل الشراء"
          value={formatPercent(conversionRate)}
          subtitle="Purchase Conversion"
        />


        <StatCard
          title="إجمالي الأحداث"
          value={totalEvents}
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
                (item, index) => {

                  const reasonProducts =
                    Array.isArray(
                      item?.products
                    )
                      ? item.products
                      : []


                  return (

                    <div
                      key={
                        item.reason ||
                        index
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

                        <div className="
                          font-bold
                          text-lg
                        ">

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
                          text-xl
                        ">

                          {
                            Number(
                              item.count ??
                              0
                            )
                          }

                        </div>

                      </div>


                      {
                        reasonProducts.length > 0 && (

                          <div className="
                            mt-4
                            pt-4
                            border-t
                            border-slate-700
                          ">

                            <div className="
                              text-xs
                              text-gray-500
                              mb-3
                            ">

                              المنتجات المرتبطة بهذا السبب

                            </div>


                            <div className="
                              space-y-2
                            ">

                              {
                                reasonProducts.map(
                                  (
                                    product,
                                    productIndex
                                  ) => (

                                    <div
                                      key={
                                        product.productId ||
                                        product.id ||
                                        product.sku ||
                                        `reason-product-${index}-${productIndex}`
                                      }

                                      className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        bg-slate-900
                                        rounded-xl
                                        px-4
                                        py-3
                                      "
                                    >

                                      <div className="
                                        flex
                                        items-center
                                        gap-3
                                      ">

                                        <div className="
                                          w-8
                                          h-8
                                          rounded-lg
                                          bg-slate-700
                                          flex
                                          items-center
                                          justify-center
                                          text-xs
                                          font-black
                                        ">

                                          {
                                            productIndex + 1
                                          }

                                        </div>


                                        <div>

                                          <div className="
                                            font-bold
                                            text-white
                                          ">

                                            {
                                              getProductDisplayName(
                                                product
                                              )
                                            }

                                          </div>


                                          {
                                            (
                                              product.productId ||
                                              product.sku
                                            ) && (

                                              <div className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                              ">

                                                {
                                                  product.productId ||
                                                  product.sku
                                                }

                                              </div>

                                            )
                                          }

                                        </div>

                                      </div>


                                      <div className="
                                        text-right
                                      ">

                                        <div className="
                                          text-yellow-400
                                          font-black
                                        ">

                                          {
                                            Number(
                                              product.count ??
                                              product.total ??
                                              0
                                            )
                                          }

                                        </div>


                                        <div className="
                                          text-xs
                                          text-gray-500
                                        ">

                                          حالة رفض

                                        </div>

                                      </div>

                                    </div>

                                  )
                                )
                              }

                            </div>

                          </div>

                        )
                      }


                      {
                        reasonProducts.length === 0 && (

                          <div className="
                            mt-3
                            text-xs
                            text-gray-500
                          ">

                            لا توجد بيانات منتج مرتبطة بهذا السبب.

                          </div>

                        )
                      }

                    </div>

                  )

                }
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
                      bg-slate-800
                      p-4
                      rounded-xl
                      mb-3
                    "
                  >

                    <div className="
                      flex
                      items-center
                      justify-between
                    ">

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
                  `${item.vehicleType || 'unknown'}-${item.make || ''}-${item.model || ''}-${item.year || ''}-${index}`
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
    firstNonEmpty(

      item?.vehicleType,

      item?.vehicle_type,

      item?.type,

      item?.vehicle?.vehicleType,

      item?.vehicle?.vehicle_type,

      item?.vehicle?.type,

      item?.searchContext?.vehicleType,

      item?.searchContext?.vehicle_type,

      item?.searchContext?.type

    )


  const make =
    firstNonEmpty(

      item?.make,

      item?.brand,

      item?.manufacturer,

      item?.vehicle?.make,

      item?.vehicle?.brand,

      item?.vehicle?.manufacturer,

      item?.searchContext?.make,

      item?.searchContext?.brand,

      item?.searchContext?.manufacturer

    )


  const model =
    firstNonEmpty(

      item?.model,

      item?.modelFromSearch,

      item?.vehicle?.model,

      item?.vehicle?.modelName,

      item?.searchContext?.model,

      item?.searchContext?.modelFromSearch

    )


  const year =
    firstNonEmpty(

      item?.year,

      item?.modelYear,

      item?.model_year,

      item?.vehicle?.year,

      item?.vehicle?.modelYear,

      item?.vehicle?.model_year,

      item?.searchContext?.year,

      item?.searchContext?.modelYear,

      item?.searchContext?.model_year

    )


  const vehicleName = [

    make,

    model,

    year

  ]
    .filter(Boolean)
    .join(' ') ||

    'مركبة غير محددة'


  const displayedVehicleType =
    vehicleType ||
    'غير محدد'


  const requests =
    Number(

      item?.requested ??
      item?.requests ??
      item?.requestCount ??
      0

    )


  const unavailableRequests =
    Number(

      item?.unavailable ??
      item?.unavailableRequests ??
      item?.unavailableRequestsCount ??
      0

    )


  const purchased =
    Number(

      item?.purchased ??
      item?.purchases ??
      item?.purchaseCount ??
      0

    )


  return (

    <div className="
      bg-slate-800
      rounded-2xl
      p-5
      mb-3
      border
      border-slate-700
    ">

      <div className="
        grid
        md:grid-cols-[1.2fr_1.2fr_1.2fr_0.8fr]
        gap-4
        items-center
      ">


        <div>

          <div className="
            text-xs
            text-gray-500
            mb-1
          ">

            المركبة

          </div>


          <div className="
            font-black
            text-lg
          ">

            {
              vehicleName
            }

          </div>

        </div>



        <div>

          <div className="
            text-xs
            text-gray-500
            mb-1
          ">

            نوع المركبة

          </div>


          <div className="
            inline-flex
            items-center
            rounded-xl
            px-3
            py-2
            bg-yellow-400
            text-black
            font-black
            text-base
          ">

            {
              displayedVehicleType
            }

          </div>

        </div>



        <div>

          <div className="
            text-xs
            text-gray-500
            mb-1
          ">

            الماركة / الموديل / السنة

          </div>


          <div className="
            text-sm
            text-gray-300
          ">

            {
              [
                make,
                model,
                year
              ]
                .filter(Boolean)
                .join(' / ') ||

              'غير محدد'
            }

          </div>

        </div>



        <div className="
          text-right
        ">

          <div className="
            text-xs
            text-gray-500
            mb-1
          ">

            الطلبات

          </div>


          <div className="
            text-yellow-400
            font-black
            text-2xl
          ">

            {
              requests
            }

          </div>


          <div className="
            text-xs
            text-gray-500
          ">

            طلب

          </div>


          {
            unavailableRequests > 0 && (

              <div className="
                text-xs
                text-red-400
                mt-2
              ">

                غير متوفر:

                {' '}

                {
                  unavailableRequests
                }

              </div>

            )
          }


          {
            purchased > 0 && (

              <div className="
                text-xs
                text-green-400
                mt-1
              ">

                شراء:

                {' '}

                {
                  purchased
                }

              </div>

            )
          }

        </div>


      </div>

    </div>

  )

}



// ======================================================
// FIRST NON EMPTY
// ======================================================

function firstNonEmpty(
  ...values
) {

  for (
    const value of values
  ) {

    if (
      value === null ||
      value === undefined
    ) {

      continue

    }


    if (
      typeof value === 'number'
    ) {

      if (
        Number.isFinite(
          value
        )
      ) {

        return value

      }

      continue

    }


    if (
      typeof value === 'object'
    ) {

      continue

    }


    const normalized =
      String(
        value
      ).trim()


    if (
      normalized
    ) {

      return normalized

    }

  }


  return ''

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