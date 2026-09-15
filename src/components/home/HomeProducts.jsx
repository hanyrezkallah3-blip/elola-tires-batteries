import { useState } from 'react'
import useMarketDemandStore from '../../store/marketDemandStore'
export default function HomeProducts({

  products = [],

  addToCart

}) {


  const [
    feedbackProductId,
    setFeedbackProductId
  ] = useState(null)

  const [
    feedbackSentProductId,
    setFeedbackSentProductId
  ] = useState(null)

  const submitFeedback = (
    product,
    reason
  ) => {
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
              'HomeProducts'
          }
        })

      setFeedbackSentProductId(
        product?.id ??
        product?.productId ??
        null
      )

      setFeedbackProductId(null)

    } catch (error) {
      console.error(
        '[MarketDemand] feedback tracking failed:',
        error
      )
    }
  }
  const visibleProducts =
    products.filter(
      product =>
        !product.hidden
    )


  return (

    <section
      id="products"
      className="
        py-20
        px-4
        md:px-8
        bg-slate-950
      "
    >

      <h2
        className="
          text-4xl
          md:text-6xl
          text-yellow-400
          font-extrabold
          text-center
          mb-14
        "
      >

        المنتجات

      </h2>


      {

        visibleProducts.length === 0

          ?

          (

            <div
              className="
                text-center
                text-3xl
                text-gray-400
              "
            >

              لا توجد منتجات حالياً

            </div>

          )

          :

          (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-8
              "
            >

              {

                visibleProducts.map(
                  product => {

                    const salePrice =
                      Number(
                        product.salePrice ??
                        product.price ??
                        0
                      )


                    const hasOffer =
                      Boolean(
                        product.hasOffer &&
                        product.offerPrice !== null &&
                        product.offerPrice !== undefined
                      )


                    const offerPrice =
                      hasOffer
                        ? Number(
                            product.offerPrice
                          )
                        : null


                    const oldPrice =
                      hasOffer
                        ? Number(
                            product.oldPrice ??
                            salePrice
                          )
                        : null


                    const available =
                      product.available === true


                    const displayPrice =
                      hasOffer
                        ? offerPrice
                        : salePrice


                    return (

                      <div
                        key={product.id}
                        className="
                          bg-slate-900
                          rounded-3xl
                          overflow-hidden
                          border
                          border-slate-700
                          shadow-xl
                          hover:-translate-y-1
                          transition-all
                        "
                      >

                        {/* ================= IMAGE ================= */}

                        <div
                          className="
                            relative
                            aspect-square
                            overflow-hidden
                          "
                        >

                          <img
                            src={
                              product.image ||
                              'https://via.placeholder.com/500x500'
                            }
                            alt={
                              product.name ||
                              product.productName ||
                              ''
                            }
                            className="
                              w-full
                              h-full
                              object-cover
                              hover:scale-105
                              transition
                            "
                          />


                          {/* ================= OFFER BADGE ================= */}

                          {
                            hasOffer && (

                              <div
                                className="
                                  absolute
                                  top-4
                                  right-4
                                  bg-red-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-2xl
                                  font-black
                                  shadow-xl
                                "
                              >

                                عرض

                              </div>

                            )
                          }


                          {/* ================= AVAILABILITY ================= */}

                          <div
                            className={`
                              absolute
                              bottom-4
                              left-4
                              px-4
                              py-2
                              rounded-2xl
                              font-black
                              shadow-xl
                              ${
                                available
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                              }
                            `}
                          >

                            {
                              available
                                ? 'متوفر'
                                : 'غير متوفر'
                            }

                          </div>

                        </div>


                        {/* ================= CONTENT ================= */}

                        <div className="p-5">

                          <h3
                            className="
                              text-xl
                              font-black
                              min-h-[60px]
                            "
                          >

                            {
                              product.name ||
                              product.productName ||
                              ''
                            }

                          </h3>


                          {
                            product.brand && (

                              <div
                                className="
                                  text-gray-400
                                  mt-2
                                "
                              >

                                {product.brand}

                              </div>

                            )
                          }


                          {
                            product.model && (

                              <div
                                className="
                                  text-gray-500
                                "
                              >

                                {product.model}

                              </div>

                            )
                          }


                          {/* ================= OFFER ================= */}

                          {
                            hasOffer && (

                              <div
                                className="
                                  mt-5
                                  bg-red-950
                                  border
                                  border-red-700
                                  rounded-2xl
                                  p-4
                                "
                              >

                                <div
                                  className="
                                    text-gray-400
                                    text-sm
                                    line-through
                                  "
                                >

                                  السعر القديم:{' '}

                                  {
                                    Number.isFinite(
                                      oldPrice
                                    )
                                      ? oldPrice.toLocaleString()
                                      : salePrice.toLocaleString()
                                  }

                                  {' '}ج

                                </div>


                                <div
                                  className="
                                    text-red-400
                                    text-3xl
                                    font-black
                                    mt-1
                                  "
                                >

                                  سعر العرض:{' '}

                                  {
                                    Number.isFinite(
                                      offerPrice
                                    )
                                      ? offerPrice.toLocaleString()
                                      : salePrice.toLocaleString()
                                  }

                                  {' '}ج

                                </div>

                              </div>

                            )
                          }


                          {/* ================= NORMAL PRICE ================= */}

                          {
                            !hasOffer && (

                              <div
                                className="
                                  mt-5
                                  text-yellow-400
                                  text-3xl
                                  font-black
                                "
                              >

                                {
                                  salePrice.toLocaleString()
                                }

                                {' '}

                                ج

                              </div>

                            )
                          }


                          {/* ================= OFFER DESCRIPTION ================= */}

                          {
                            hasOffer &&
                            product.offerDescription && (

                              <div
                                className="
                                  mt-4
                                  bg-black/40
                                  border
                                  border-slate-700
                                  p-4
                                  rounded-2xl
                                  text-gray-300
                                "
                              >

                                {
                                  product.offerDescription
                                }

                              </div>

                            )
                          }


                          {/* ================= CART ================= */}

                          <button
                            type="button"
                            disabled={!available}
                            onClick={() => {

                              if (!available) {
                                return
                              }


                              addToCart({

                                ...product,

                                price:
                                  displayPrice,

                                salePrice:
                                  displayPrice,

                                originalSalePrice:
                                  salePrice,

                                isOffer:
                                  hasOffer,

                                offerPrice:
                                  hasOffer
                                    ? offerPrice
                                    : null

                              })

                            }}
                            className={`
                              w-full
                              mt-5
                              py-4
                              rounded-2xl
                              font-black
                              transition

                              ${
                                available
                                  ? `
                                    bg-yellow-500
                                    hover:bg-yellow-600
                                    text-black
                                  `
                                  : `
                                    bg-gray-700
                                    text-gray-400
                                    cursor-not-allowed
                                  `
                              }
                            `}
                          >

                            {
                              available
                                ? 'إضافة للسلة'
                                : 'غير متوفر'
                            }

                          </button>
                          {
                            feedbackSentProductId ===
                              (
                                product?.id ??
                                product?.productId ??
                                null
                              )
                              ? (
                                <div
                                  className="
                                    w-full
                                    mt-4
                                    py-3
                                    px-4
                                    rounded-2xl
                                    bg-emerald-900/40
                                    border
                                    border-emerald-700
                                    text-emerald-300
                                    text-center
                                    font-bold
                                  "
                                >
                                  {'\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0633\u0628\u0628 \u0639\u062f\u0645 \u0627\u0644\u0634\u0631\u0627\u0621'}
                                </div>
                              )
                              : feedbackProductId !==
                                  (
                                    product?.id ??
                                    product?.productId ??
                                    null
                                  )
                                ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFeedbackProductId(
                                        product?.id ??
                                        product?.productId ??
                                        null
                                      )
                                    }}
                                    className="
                                      w-full
                                      mt-4
                                      py-3
                                      rounded-2xl
                                      border
                                      border-yellow-500/60
                                      text-yellow-400
                                      font-bold
                                      hover:bg-yellow-500
                                      hover:text-black
                                      transition
                                    "
                                  >
                                    {'\u0644\u0645 \u0623\u0642\u0631\u0631 \u0634\u0631\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u0645\u0646\u062a\u062c'}
                                  </button>
                                )
                                : (
                                  <div
                                    className="
                                      mt-4
                                      p-4
                                      rounded-2xl
                                      bg-slate-800
                                      border
                                      border-slate-700
                                    "
                                  >
                                    <div
                                      className="
                                        text-white
                                        font-bold
                                        mb-3
                                        text-center
                                      "
                                    >
                                      {'\u0645\u0627 \u0627\u0644\u0633\u0628\u0628\u061f'}
                                    </div>

                                    <div className="grid gap-2">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          submitFeedback(
                                            product,
                                            'price'
                                          )
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          bg-slate-700
                                          hover:bg-yellow-500
                                          hover:text-black
                                          text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0627\u0644\u0633\u0639\u0631 \u063a\u064a\u0631 \u0645\u0646\u0627\u0633\u0628'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          submitFeedback(
                                            product,
                                            'unavailable'
                                          )
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          bg-slate-700
                                          hover:bg-yellow-500
                                          hover:text-black
                                          text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0627\u0644\u0645\u0646\u062a\u062c \u063a\u064a\u0631 \u0645\u062a\u0648\u0641\u0631'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          submitFeedback(
                                            product,
                                            'not_needed'
                                          )
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          bg-slate-700
                                          hover:bg-yellow-500
                                          hover:text-black
                                          text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0644\u0645 \u0623\u0639\u062f \u0628\u062d\u0627\u062c\u0629 \u0625\u0644\u064a\u0647'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          submitFeedback(
                                            product,
                                            'alternative'
                                          )
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          bg-slate-700
                                          hover:bg-yellow-500
                                          hover:text-black
                                          text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0627\u062e\u062a\u0631\u062a \u0645\u0646\u062a\u062c\u064b\u0627 \u0622\u062e\u0631'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          submitFeedback(
                                            product,
                                            'other'
                                          )
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          bg-slate-700
                                          hover:bg-yellow-500
                                          hover:text-black
                                          text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0633\u0628\u0628 \u0622\u062e\u0631'}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFeedbackProductId(null)
                                        }
                                        className="
                                          w-full
                                          py-2
                                          rounded-xl
                                          text-slate-300
                                          hover:text-white
                                          font-bold
                                          transition
                                        "
                                      >
                                        {'\u0625\u0644\u063a\u0627\u0621'}
                                      </button>

                                    </div>
                                  </div>
                                )
                          }


                        </div>

                      </div>

                    )

                  }
                )

              }

            </div>

          )

      }

    </section>

  )

}