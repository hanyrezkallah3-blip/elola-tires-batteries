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
// It does NOT use the legacy DemandTelemetry system.
//
// Market Demand is independent from inventory availability.
// ======================================================

export default function DemandAnalytics() {

const {

events,

getSummary,

getTopRequestedProducts,

getTopPurchasedProducts,

getSupplyOpportunities,

getTopNotPurchasedProducts,

getReasonAnalytics,

getVehicleAnalytics

} =
useMarketDemandStore()

// ======================================================
// ANALYTICS
// ======================================================

const summary =
useMemo(
() => {

    try {

      return getSummary()

    } catch (error) {

      console.error(
        '[MarketDemand] summary failed:',
        error
      )

      return {}

    }

  },
  [
    events,
    getSummary
  ]
)

const topRequested =
useMemo(
() => {

    try {

      return getTopRequestedProducts(10)

    } catch (error) {

      console.error(
        '[MarketDemand] requested products failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getTopRequestedProducts
  ]
)


const topPurchased =
useMemo(
() => {

    try {

      return getTopPurchasedProducts(10)

    } catch (error) {

      console.error(
        '[MarketDemand] purchased products failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getTopPurchasedProducts
  ]
)


const supplyOpportunities =
useMemo(
() => {


    try {

      return getSupplyOpportunities(10)

    } catch (error) {

      console.error(
        '[MarketDemand] supply opportunities failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getSupplyOpportunities
  ]
)


const notPurchased =
useMemo(
() => {


    try {

      return getTopNotPurchasedProducts(10)

    } catch (error) {

      console.error(
        '[MarketDemand] not purchased failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getTopNotPurchasedProducts
  ]
)


const reasons =
useMemo(
() => {


    try {

      return getReasonAnalytics()

    } catch (error) {

      console.error(
        '[MarketDemand] reasons failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getReasonAnalytics
  ]
)


const vehicles =
useMemo(
() => {


    try {

      return getVehicleAnalytics()

    } catch (error) {

      console.error(
        '[MarketDemand] vehicle analytics failed:',
        error
      )

      return []

    }

  },
  [
    events,
    getVehicleAnalytics
  ]
)

// ======================================================
// NORMALIZATION HELPERS
// ======================================================

const requestedCount =
summary?.totalRequested ??
summary?.requests ??
0

const viewedCount =
summary?.totalViewed ??
summary?.viewed ??
0

const addedCount =
summary?.totalAddedToCart ??
summary?.addedToCart ??
0

const purchasedCount =
summary?.totalPurchased ??
summary?.purchased ??
0

const unavailableCount =
summary?.totalUnavailable ??
summary?.unavailable ??
0

const notPurchasedCount =
summary?.totalNotPurchased ??
summary?.notPurchased ??
0

const conversionRate =
summary?.purchaseConversionRate ??
summary?.conversionRate ??
0

const cartRate =
summary?.addToCartRate ??
summary?.cartConversionRate ??
0

const totalEvents =
events?.length || 0

// ======================================================
// RENDER
// ======================================================

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
        cartRate
          ? `${formatPercent(cartRate)} معدل الإضافة`
          : 'عمليات إضافة فعلية'
      }

    />


    <StatCard

      title="تم الشراء"

      value={
        purchasedCount
      }

      subtitle={
        conversionRate
          ? `${formatPercent(conversionRate)} معدل التحويل`
          : 'عمليات شراء فعلية'
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
        formatPercent(conversionRate)
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
              item.id ||
              item.productId ||
              index
            }

            rank={
              index + 1
            }

            name={
              item.name ||
              item.productName ||
              item.productId ||
              'منتج غير معروف'
            }

            value={
              item.count ??
              item.requests ??
              item.requested ??
              0
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
              item.id ||
              item.productId ||
              index
            }

            rank={
              index + 1
            }

            name={
              item.name ||
              item.productName ||
              item.productId ||
              'منتج غير معروف'
            }

            value={
              item.count ??
              item.purchases ??
              item.purchased ??
              0
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
              item.id ||
              item.productId ||
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

              <div>

                <div className="
                  text-lg
                  font-black
                ">

                  {
                    item.name ||
                    item.productName ||
                    item.productId ||
                    'منتج غير معروف'
                  }

                </div>


                <div className="
                  text-gray-400
                  text-sm
                  mt-1
                ">

                  {

                    item.reason ||
                    item.message ||
                    'طلب مرتفع مقارنة بالتوفر'

                  }

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
                    item.count ??
                    item.requests ??
                    item.demand ??
                    0
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
              item.id ||
              item.productId ||
              index
            }

            rank={
              index + 1
            }

            name={
              item.name ||
              item.productName ||
              item.productId ||
              'منتج غير معروف'
            }

            value={
              item.count ??
              item.notPurchased ??
              item.requests ??
              0
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

      Array.isArray(reasons)

        ? reasons.map(
            (item, index) => (

              <div

                key={
                  item.reason ||
                  item.id ||
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

                <div>

                  <div className="font-bold">

                    {
                      item.label ||
                      item.reasonLabel ||
                      item.reason ||
                      'سبب غير محدد'
                    }

                  </div>

                </div>


                <div className="
                  font-black
                  text-yellow-400
                ">

                  {
                    item.count ??
                    item.total ??
                    0
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
                      ? (
                        value.count ??
                        value.total ??
                        0
                      )
                      : value
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

      Array.isArray(vehicles)

        ? vehicles.map(
            (item, index) => (

              <VehicleRow

                key={
                  item.id ||
                  index
                }

                item={
                  item
                }

              />

            )
          )

        : Object.entries(
            vehicles || {}
          ).map(
            (
              [
                key,
                value
              ],
              index
            ) => (

              <VehicleRow

                key={
                  key ||
                  index
                }

                item={{
                  name: key,
                  count:
                    typeof value === 'object'
                      ? (
                        value.count ??
                        value.total ??
                        0
                      )
                      : value
                }}

              />

            )
          )

    }

  </AnalyticsSection>



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
Array.isArray(children)
? children.length > 0
: Boolean(children)

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

const context =
item?.vehicle ||
item?.vehicleContext ||
{}

const vehicleName =
item?.name ||
[
context?.make,
context?.model,
context?.year
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

      context?.make && (

        <div className="
          text-xs
          text-gray-500
          mt-1
        ">

          {
            context.make
          }

          {' '}

          {
            context.model
          }

          {' '}

          {
            context.year
          }

        </div>

      )

    }

  </div>


  <div className="
    text-yellow-400
    font-black
  ">

    {
      item?.count ??
      item?.requests ??
      item?.total ??
      0
    }

  </div>


</div>

)

}

// ======================================================
// FORMAT HELPERS
// ======================================================

function formatPercent(value) {

const number =
Number(value)

if (
!Number.isFinite(number)
) {

return '0%'

}

const normalized =
number <= 1
? number * 100
: number

return (
`${normalized.toFixed(1)}%`
)

}

// ======================================================
// REASON LABEL
// ======================================================

function formatReason(reason) {

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
  'سبب آخر'

}

return (
labels[reason] ||
reason ||
'سبب غير محدد'
)

}