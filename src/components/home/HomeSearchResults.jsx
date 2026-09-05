// ======================================================
// EL OLA ERP
// Home Search Results
// ======================================================

import {
  useState
} from 'react'

import useMarketDemandStore
  from '../../store/marketDemandStore'


// ======================================================
// NORMALIZE TYPE
// ======================================================

const normalizeType = value => {

  const type =
    String(value ?? '')
      .trim()
      .toLowerCase()

  if (
    [
      'tire',
      'tires',
      'tyre',
      'tyres',
      'اطار',
      'اطارات',
      'إطار',
      'إطارات'
    ].includes(type)
  ) {
    return 'tire'
  }

  if (
    [
      'battery',
      'batteries',
      'بطاريه',
      'بطاريات',
      'بطارية'
    ].includes(type)
  ) {
    return 'battery'
  }

  if (
    [
      'oil',
      'oils',
      'زيت',
      'زيوت'
    ].includes(type)
  ) {
    return 'oil'
  }

  return type
}


// ======================================================
// GET TIRE SIZE
// ======================================================

const getTireSize = product => {

  const tire =
    product?.tire ||
    product?.tireData ||
    product?.tireSpecification ||
    product?.tireSpecifications ||
    product?.specifications?.tire ||
    product?.attributes?.tire ||
    {}

  const width =
    tire?.width ??
    tire?.sectionWidth ??
    tire?.tireWidth ??
    product?.width ??
    ''

  const profile =
    tire?.profile ??
    tire?.height ??
    tire?.aspectRatio ??
    tire?.aspect ??
    product?.profile ??
    ''

  const rim =
    tire?.rim ??
    tire?.rimSize ??
    tire?.wheelDiameter ??
    tire?.diameter ??
    product?.rim ??
    ''

  const parts = [
    width,
    profile,
    rim
  ]
    .map(value =>
      String(value ?? '').trim()
    )
    .filter(Boolean)

  if (parts.length > 0) {
    return parts.join('/')
  }

  return (
    product?.tireSize ||
    product?.size ||
    product?.dimension ||
    ''
  )
}


// ======================================================
// GET BATTERY CAPACITY
// ======================================================

const getBatteryCapacity = product => {

  const battery =
    product?.battery ||
    product?.batteryData ||
    product?.batterySpecification ||
    product?.specifications?.battery ||
    product?.attributes?.battery ||
    {}

  return (
    battery?.capacity ??
    battery?.ampereHour ??
    battery?.ah ??
    battery?.amp ??
    battery?.ampHours ??
    product?.capacity ??
    product?.ampereHour ??
    product?.ah ??
    product?.amp ??
    product?.ampHours ??
    ''
  )
}


// ======================================================
// GET OIL VISCOSITY
// ======================================================

const getOilViscosity = product => {

  const oil =
    product?.oil ||
    product?.oilData ||
    product?.oilSpecification ||
    product?.specifications?.oil ||
    product?.attributes?.oil ||
    {}

  return (
    oil?.viscosity ??
    oil?.grade ??
    oil?.oilGrade ??
    product?.viscosity ??
    product?.grade ??
    product?.oilGrade ??
    ''
  )
}


// ======================================================
// GET PRODUCT TYPE
// ======================================================

const getProductType = product => {

  return normalizeType(
    product?.type ||
    product?.productType ||
    product?.category
  )
}


// ======================================================
// GET PRODUCT ID
// ======================================================

const getProductId = product => {

  return (
    product?.id ??
    product?.productId ??
    product?.sku ??
    ''
  )
}


// ======================================================
// RESULT CARD
// ======================================================

const ResultCard = ({
  product,
  index,
  onAddToCart
}) => {

  const [
    feedbackOpen,
    setFeedbackOpen
  ] = useState(false)


  const [
    feedbackSent,
    setFeedbackSent
  ] = useState(false)


  const productName =
    product?.name ||
    product?.productName ||
    'منتج'


  const price =
    Number(
      product?.offerPrice ??
      product?.salePrice ??
      product?.price ??
      0
    )


  const oldPrice =
    Number(
      product?.oldPrice ??
      0
    )


  const quantity =
    Number(
      product?.availableQuantity ??
      product?.quantity ??
      product?.stock ??
      product?.availability?.quantity ??
      0
    )


  const type =
    getProductType(product)


  const tireSize =
    getTireSize(product)


  const batteryCapacity =
    getBatteryCapacity(product)


  const oilViscosity =
    getOilViscosity(product)


  const hasOffer =
    Boolean(
      product?.hasOffer ||
      product?.offerPrice != null
    )


  // ====================================================
  // CUSTOMER FEEDBACK
  // ====================================================

  const submitFeedback = reason => {

    if (!reason) {
      return
    }


    try {

      useMarketDemandStore
        .getState()
        .recordFeedback({

          product,

          reason,

          searchContext:
            product?.searchContext ||
            product?.vehicleSearchContext ||
            {},

          metadata: {
            source:
              'HomeSearchResults'
          }

        })


      setFeedbackSent(true)

      setFeedbackOpen(false)

    } catch (error) {

      console.error(
        '[MarketDemand] feedback tracking failed:',
        error
      )

    }

  }


  return (

    <div
      key={
        product?.id ||
        product?.productId ||
        index
      }
      className="
        bg-slate-900
        rounded-3xl
        overflow-hidden
        border
        border-slate-700
        shadow-xl
        flex
        flex-col
      "
    >

      {/* ==================================================
          PRODUCT IMAGE
      ================================================== */}

      {
        product?.image && (

          <div
            className="
              bg-slate-800
              p-4
            "
          >

            <img
              src={product.image}
              alt={productName}
              className="
                w-full
                h-56
                object-contain
                rounded-2xl
              "
            />

          </div>

        )
      }


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          p-6
          flex
          flex-col
          flex-1
        "
      >

        {/* PRODUCT NAME */}

        <div
          className="
            text-2xl
            font-black
            text-white
          "
        >
          {productName}
        </div>


        {/* BRAND */}

        {
          product?.brand && (

            <div
              className="
                text-gray-400
                mt-2
                font-bold
              "
            >
              الماركة: {product.brand}
            </div>

          )
        }


        {/* ==================================================
            TIRE RESULT
        ================================================== */}

        {
          type === 'tire' && (

            <div
              className="
                mt-5
                bg-slate-800
                border
                border-yellow-500/40
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  text-sm
                  font-black
                  mb-2
                "
              >
                الإطار المناسب
              </div>

              <div
                className="
                  text-white
                  text-3xl
                  font-black
                  tracking-wide
              "
              >
                {tireSize || 'مقاس غير محدد'}
              </div>

            </div>

          )
        }


        {/* ==================================================
            BATTERY RESULT
        ================================================== */}

        {
          type === 'battery' && (

            <div
              className="
                mt-5
                bg-slate-800
                border
                border-yellow-500/40
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  text-sm
                  font-black
                  mb-2
                "
              >
                البطارية المناسبة
              </div>

              <div
                className="
                  text-white
                  text-3xl
                  font-black
                "
              >
                {
                  batteryCapacity
                    ? `${batteryCapacity} Ah`
                    : 'سعة غير محددة'
                }
              </div>

            </div>

          )
        }


        {/* ==================================================
            OIL RESULT
        ================================================== */}

        {
          type === 'oil' && (

            <div
              className="
                mt-5
                bg-slate-800
                border
                border-yellow-500/40
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  text-sm
                  font-black
                  mb-2
                "
              >
                الزيت المناسب
              </div>

              <div
                className="
                  text-white
                  text-3xl
                  font-black
                "
              >
                {
                  oilViscosity ||
                  'لزوجة غير محددة'
                }
              </div>

            </div>

          )
        }


        {/* ==================================================
            VEHICLE / GENERAL RESULT
        ================================================== */}

        {
          type !== 'tire' &&
          type !== 'battery' &&
          type !== 'oil' && (

            <div
              className="
                mt-5
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  text-sm
                  font-black
                  mb-2
                "
              >
                المنتج المتوافق
              </div>

              {
                product?.model && (

                  <div
                    className="
                      text-gray-300
                      font-bold
                    "
                  >
                    الموديل: {product.model}
                  </div>

                )
              }

              {
                product?.description && (

                  <div
                    className="
                      text-gray-400
                      mt-2
                      leading-7
                    "
                  >
                    {product.description}
                  </div>

                )
              }

            </div>

          )
        }


        {/* ==================================================
            AVAILABILITY
        ================================================== */}

        <div
          className={`
            mt-5
            rounded-2xl
            p-4
            ${
              quantity > 0
                ? 'bg-green-950/40 border border-green-700/40'
                : 'bg-red-950/40 border border-red-700/40'
            }
          `}
        >

          <div
            className={`
              font-black
              text-lg
              ${
                quantity > 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }
            `}
          >

            {
              quantity > 0
                ? '✔ المنتج متوفر'
                : '❌ المنتج غير متوفر'
            }

          </div>


          <div
            className="
              text-gray-300
              mt-1
            "
          >
            الكمية المتاحة: {quantity}
          </div>

        </div>


        {/* ==================================================
            PRICE
        ================================================== */}

        <div
          className="
            mt-6
          "
        >

          {
            hasOffer &&
            oldPrice > 0 &&
            oldPrice > price && (

              <div
                className="
                  text-gray-500
                  line-through
                  text-lg
                  font-bold
                "
              >
                {oldPrice} ج
              </div>

            )
          }


          <div
            className="
              text-yellow-400
              text-3xl
              font-black
            "
          >
            {price} ج
          </div>

        </div>


        {/* ==================================================
            ADD TO CART
        ================================================== */}

        {
          typeof onAddToCart ===
          'function' && (

            <button
              type="button"
              disabled={
                quantity <= 0
              }
              onClick={() =>
                onAddToCart(product)
              }
              className="
                w-full
                mt-6
                bg-yellow-500
                hover:bg-yellow-400
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-black
                py-4
                rounded-2xl
                font-black
                text-lg
                transition
              "
            >
              إضافة للسلة
            </button>

          )
        }


        {/* ==================================================
            CUSTOMER FEEDBACK
        ================================================== */}

        {
          !feedbackSent ? (

            <div
              className="
                mt-4
              "
            >

              {
                !feedbackOpen ? (

                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackOpen(true)
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-700
                      text-gray-300
                      hover:border-yellow-500
                      hover:text-yellow-400
                      py-3
                      font-bold
                      transition
                    "
                  >
                    لم أقرر شراء هذا المنتج
                  </button>

                ) : (

                  <div
                    className="
                      bg-slate-800
                      border
                      border-slate-700
                      rounded-2xl
                      p-4
                    "
                  >

                    <div
                      className="
                        text-white
                        font-black
                        mb-3
                      "
                    >
                      ما السبب؟
                    </div>


                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          submitFeedback(
                            'price'
                          )
                        }
                        className="
                          text-right
                          px-4
                          py-3
                          rounded-xl
                          bg-slate-900
                          text-gray-300
                          hover:text-yellow-400
                          hover:border-yellow-500
                          border
                          border-slate-700
                        "
                      >
                        السعر غير مناسب
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          submitFeedback(
                            'unavailable'
                          )
                        }
                        className="
                          text-right
                          px-4
                          py-3
                          rounded-xl
                          bg-slate-900
                          text-gray-300
                          hover:text-yellow-400
                          border
                          border-slate-700
                        "
                      >
                        المنتج غير متوفر
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          submitFeedback(
                            'not_needed'
                          )
                        }
                        className="
                          text-right
                          px-4
                          py-3
                          rounded-xl
                          bg-slate-900
                          text-gray-300
                          hover:text-yellow-400
                          border
                          border-slate-700
                        "
                      >
                        لم أعد بحاجة إليه
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          submitFeedback(
                            'alternative'
                          )
                        }
                        className="
                          text-right
                          px-4
                          py-3
                          rounded-xl
                          bg-slate-900
                          text-gray-300
                          hover:text-yellow-400
                          border
                          border-slate-700
                        "
                      >
                        اخترت منتجًا آخر
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          submitFeedback(
                            'other'
                          )
                        }
                        className="
                          text-right
                          px-4
                          py-3
                          rounded-xl
                          bg-slate-900
                          text-gray-300
                          hover:text-yellow-400
                          border
                          border-slate-700
                        "
                      >
                        سبب آخر
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setFeedbackOpen(false)
                        }
                        className="
                          text-gray-500
                          hover:text-white
                          py-2
                          font-bold
                        "
                      >
                        إلغاء
                      </button>

                    </div>

                  </div>

                )
              }

            </div>

          ) : (

            <div
              className="
                mt-4
                text-center
                text-green-400
                font-bold
                py-3
              "
            >
              شكرًا، تم تسجيل رأيك.
            </div>

          )
        }

      </div>

    </div>

  )
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function HomeSearchResults({

  title = 'نتائج البحث',

  results = [],

  emptyMessage = 'لا توجد نتائج مطابقة',

  renderItem,

  onAddToCart

}) {

  const safeResults =
    Array.isArray(results)
      ? results
      : []


  return (

    <div
      className="
        mt-10
        w-full
      "
    >

      {/* ==================================================
          RESULT HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-3
          mb-6
        "
      >

        <h3
          className="
            text-3xl
            font-black
            text-yellow-400
          "
        >
          {title}
        </h3>


        {
          safeResults.length > 0 && (

            <div
              className="
                bg-yellow-500
                text-black
                px-5
                py-2
                rounded-full
                font-black
              "
            >
              {safeResults.length} نتيجة
            </div>

          )
        }

      </div>


      {/* ==================================================
          EMPTY
      ================================================== */}

      {
        safeResults.length === 0 ? (

          <div
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-3xl
              p-10
              text-center
            "
          >

            <div
              className="
                text-5xl
                mb-4
              "
            >
              🔍
            </div>

            <div
              className="
                text-xl
                font-black
                text-gray-300
              "
            >
              {emptyMessage}
            </div>

            <div
              className="
                text-gray-500
                mt-2
              "
            >
              جرّب تغيير بيانات البحث ثم أعد المحاولة
            </div>

          </div>

        ) : (

          /* ==================================================
             RESULTS GRID
          ================================================== */

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {
              safeResults.map(
                (product, index) => {

                  if (
                    typeof renderItem ===
                    'function'
                  ) {

                    return renderItem(
                      product,
                      index
                    )

                  }

                  return (

                    <ResultCard
                      key={
                        getProductId(product) ||
                        index
                      }
                      product={product}
                      index={index}
                      onAddToCart={
                        onAddToCart
                      }
                    />

                  )

                }
              )
            }

          </div>

        )

      }

    </div>

  )
}