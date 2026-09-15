// ======================================================
// Elola ERP Enterprise
// Home Offers
// ======================================================

import { useMemo } from 'react'
import { useWarehouseStore } from '../../store/warehouseStore'
import { useInventoryStore } from '../../store/inventoryStore'

// ======================================================
// NORMALIZE NUMBER
// ======================================================

const toNumber = (value, fallback = 0) => {

  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : fallback

}

// ======================================================
// GET PRODUCT ID
// ======================================================

const getProductId = (product) => {

  return (

    product?.productId ||

    product?.id ||

    ''

  )

}

// ======================================================
// FIND WAREHOUSE PRODUCT
// ======================================================

const findWarehouseProduct = (

  warehouses,

  offer

) => {

  const productId =
    offer?.productId ||
    offer?.product?.productId ||
    offer?.product?.id ||
    ''

  const warehouseId =
    offer?.warehouseId ||
    offer?.warehouse?.id ||
    ''

  const warehouseProductId =
    offer?.warehouseProductId ||
    offer?.selectedWarehouseProductId ||
    offer?.warehouseProduct?.id ||
    ''

  // ====================================================
  // FIRST: SPECIFIC WAREHOUSE
  // ====================================================

  if (warehouseId) {

    const warehouse =
      warehouses.find(

        warehouse =>

          String(
            warehouse.id
          ) ===
          String(
            warehouseId
          )

      )

    if (warehouse) {

      const product =
        (
          warehouse.products ||
          []
        ).find(

          item => {

            const itemProductId =
              getProductId(item)

            return (

              (
                productId &&
                String(
                  itemProductId
                ) ===
                String(
                  productId
                )
              )

              ||

              (
                warehouseProductId &&
                String(
                  item.id
                ) ===
                String(
                  warehouseProductId
                )
              )

            )

          }

        )

      if (product) {

        return {

          product,

          warehouse

        }

      }

    }

  }

  // ====================================================
  // SECOND: SEARCH ALL WAREHOUSES
  // ====================================================

  for (
    const warehouse
    of warehouses
  ) {

    const product =
      (
        warehouse.products ||
        []
      ).find(

        item => {

          const itemProductId =
            getProductId(item)

          return (

            (
              productId &&
              String(
                itemProductId
              ) ===
              String(
                productId
              )
            )

            ||

            (
              warehouseProductId &&
              String(
                item.id
              ) ===
              String(
                warehouseProductId
              )
            )

          )

        }

      )

    if (product) {

      return {

        product,

        warehouse

      }

    }

  }

  return null

}

// ======================================================
// FIND INVENTORY STOCK
// ======================================================

const findInventoryStock = (

  stockItems,

  offer,

  warehouseProduct

) => {

  const productId =
    offer?.productId ||
    offer?.product?.productId ||
    offer?.product?.id ||
    warehouseProduct?.productId ||
    warehouseProduct?.id ||
    ''

  const warehouseId =
    offer?.warehouseId ||
    warehouseProduct?.warehouseId ||
    ''

  const warehouseProductId =
    offer?.warehouseProductId ||
    offer?.selectedWarehouseProductId ||
    warehouseProduct?.id ||
    ''

  // ====================================================
  // SPECIFIC WAREHOUSE PRODUCT
  // ====================================================

  let result =
    stockItems.find(

      stock =>

        (
          warehouseId &&
          String(
            stock.warehouseId
          ) ===
          String(
            warehouseId
          )
        )

        &&

        (
          (
            productId &&
            String(
              stock.productId
            ) ===
            String(
              productId
            )
          )

          ||

          (
            warehouseProductId &&
            String(
              stock.id
            ) ===
            String(
              warehouseProductId
            )
          )

        )

    )

  if (result) {

    return result

  }

  // ====================================================
  // PRODUCT ID ONLY
  // ====================================================

  result =
    stockItems.find(

      stock =>

        productId &&

        String(
          stock.productId
        ) ===
        String(
          productId
        )

    )

  return result || null

}

// ======================================================
// COMPONENT
// ======================================================

import { useState } from 'react'
import useMarketDemandStore from '../../store/marketDemandStore'
export default function HomeOffers({

  offers = [],

  addToCart

}) {

  // ======================================================
  // REAL WAREHOUSES
  // ======================================================

  const warehouses =
    useWarehouseStore(

      state =>
        state.warehouses || []

    )

  // ======================================================
  // LEGACY / SECONDARY INVENTORY
  // ======================================================

  const stockItems =
    useInventoryStore(

      state =>
        state.stockItems || []

    )

  // ======================================================
  // VALID OFFERS
  // ======================================================

  const visibleOffers =
    useMemo(

      () => {

        if (
          !Array.isArray(
            offers
          )
        ) {

          return []

        }

        return offers.filter(

          offer => {

            if (!offer) {

              return false

            }

            if (
              offer.active === false
            ) {

              return false

            }

            const offerPrice =
              toNumber(

                offer.offerPrice ??

                offer.newPrice ??

                offer.salePrice ??

                offer.price,

                -1

              )

            return (
              offerPrice >= 0
            )

          }

        )

      },

      [offers]

    )

  // ======================================================
  // RENDER
  // ======================================================

  return (

    <section

      id="offers"

      className="
        py-20
        px-4
        md:px-8
        bg-black
      "

    >

      <h2

        className="
          text-4xl
          md:text-6xl
          text-red-500
          font-extrabold
          text-center
          mb-14
        "

      >

        العروض

      </h2>

      {

        visibleOffers.length === 0

          ? (

            <div

              className="
                text-center
                text-3xl
                text-gray-500
              "

            >

              لا توجد عروض حالياً

            </div>

          )

          : (

            <div

              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-8
              "

            >

              {

                visibleOffers.map(

                  offer => {

                    // ==================================================
                    // OFFER PRICE
                    // ==================================================

                    const offerPrice =
                      toNumber(

                        offer.offerPrice ??

                        offer.newPrice ??

                        offer.salePrice ??

                        offer.price,

                        0

                      )

                    // ==================================================
                    // WAREHOUSE PRODUCT
                    // ==================================================

                    const warehouseResult =
                      findWarehouseProduct(

                        warehouses,

                        offer

                      )

                    const warehouseProduct =
                      warehouseResult?.product ||
                      null

                    const warehouse =
                      warehouseResult?.warehouse ||
                      null

                    // ==================================================
                    // INVENTORY PRODUCT
                    // ==================================================

                    const inventoryProduct =
                      findInventoryStock(

                        stockItems,

                        offer,

                        warehouseProduct

                      )

                    // ==================================================
                    // PRODUCT IDENTITY
                    // ==================================================

                    const productId =

                      offer.productId ||

                      offer.product?.productId ||

                      offer.product?.id ||

                      warehouseProduct?.productId ||

                      warehouseProduct?.id ||

                      offer.id

                    // ==================================================
                    // WAREHOUSE PRODUCT ID
                    // ==================================================

                    const warehouseProductId =

                      offer.warehouseProductId ||

                      offer.selectedWarehouseProductId ||

                      warehouseProduct?.id ||

                      ''

                    // ==================================================
                    // REAL QUANTITY
                    //
                    // warehouseStore is the primary source because
                    // the offer is created from an existing
                    // warehouse product.
                    // ==================================================

                    const warehouseQuantity =

                      warehouseProduct
                        ? toNumber(
                            warehouseProduct.quantity,
                            0
                          )
                        : null

                    const inventoryQuantity =

                      inventoryProduct
                        ? toNumber(
                            inventoryProduct.quantity,
                            0
                          )
                        : null

                    const offerQuantity =

                      offer.quantity !== undefined

                        ? toNumber(
                            offer.quantity,
                            0
                          )

                        : null

                    const stockQuantity =

                      warehouseQuantity !== null

                        ? warehouseQuantity

                        : inventoryQuantity !== null

                          ? inventoryQuantity

                          : offerQuantity !== null

                            ? offerQuantity

                            : 0

                    const available =
                      stockQuantity > 0

                    // ==================================================
                    // OLD PRICE
                    // ==================================================

                    const oldPrice =

                      toNumber(

                        offer.oldPrice ??

                        offer.originalPrice ??

                        offer.previousPrice ??

                        offer.originalSalePrice ??

                        warehouseProduct?.salePrice ??

                        0,

                        0

                      )

                    // ==================================================
                    // BASIC INFO
                    // ==================================================

                    const image =

                      offer.image ||

                      offer.product?.image ||

                      warehouseProduct?.image ||

                      ''

                    const title =

                      offer.title ||

                      offer.product?.name ||

                      offer.product?.productName ||

                      warehouseProduct?.name ||

                      warehouseProduct?.productName ||

                      'عرض'

                    // ==================================================
                    // BRAND
                    // ==================================================

                    const brand =

                      offer.brand ||

                      offer.product?.brand ||

                      warehouseProduct?.brand ||

                      warehouseProduct?.battery?.brand ||

                      warehouseProduct?.typeData?.battery?.brand ||

                      ''

                    // ==================================================
                    // BATTERY DATA
                    // ==================================================

                    const batteryBrand =

                      offer.battery?.brand ||

                      offer.product?.battery?.brand ||

                      warehouseProduct?.battery?.brand ||

                      warehouseProduct?.typeData?.battery?.brand ||

                      ''


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
              'HomeOffers'
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
                    const displayBrand =

                      batteryBrand ||

                      brand

                    // ==================================================
                    // ADD TO CART
                    // ==================================================

                    const handleAddToCart = () => {

                      if (
                        typeof addToCart !==
                        'function'
                      ) {

                        return

                      }

                      if (!available) {

                        return

                      }

                      addToCart({

                        id:
                          productId,

                        productId:
                          productId,

                        warehouseId:
                          offer.warehouseId ||
                          warehouse?.id ||
                          warehouseProduct?.warehouseId ||
                          '',

                        warehouseProductId:
                          warehouseProductId,

                        selectedWarehouseProductId:
                          warehouseProductId,

                        warehouseName:
                          offer.warehouseName ||
                          warehouse?.name ||
                          warehouseProduct?.warehouseName ||
                          '',

                        name:
                          title,

                        productName:
                          warehouseProduct?.productName ||
                          offer.product?.productName ||
                          title,

                        image:

                          image,

                        brand:
                          displayBrand,

                        model:
                          offer.model ||
                          offer.product?.model ||
                          warehouseProduct?.model ||
                          '',

                        type:
                          offer.type ||
                          offer.product?.type ||
                          warehouseProduct?.type ||
                          '',

                        category:
                          offer.category ||
                          offer.product?.category ||
                          warehouseProduct?.category ||
                          '',

                        battery:
                          offer.battery ||
                          offer.product?.battery ||
                          warehouseProduct?.battery ||
                          {},

                        price:
                          offerPrice,

                        salePrice:
                          offerPrice,

                        offerPrice:
                          offerPrice,

                        oldPrice:
                          oldPrice > 0
                            ? oldPrice
                            : null,

                        quantity:
                          stockQuantity,

                        stock:
                          stockQuantity,

                        availableQuantity:
                          stockQuantity,

                        isOffer:
                          true,

                        offerId:
                          offer.id || null

                      })

                    }

                    return (

                      <div

                        key={

                          offer.id ||

                          `offer-${productId}`

                        }

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

                        {

                          image && (

                            <div

                              className="
                                aspect-[4/3]
                                overflow-hidden
                              "

                            >

                              <img

                                src={image}

                                alt={title}

                                className="
                                  w-full
                                  h-full
                                  object-cover
                                  hover:scale-105
                                  transition
                                "

                              />

                            </div>

                          )

                        }

                        <div className="p-6">

                          <h3

                            className="
                              text-2xl
                              font-black
                              mb-3
                            "

                          >

                            {title}

                          </h3>

                          {

                            displayBrand && (

                              <div

                                className="
                                  text-cyan-400
                                  font-bold
                                  mb-3
                                "

                              >

                                الماركة:

                                {' '}

                                {displayBrand}

                              </div>

                            )

                          }

                          {

                            warehouse?.name && (

                              <div

                                className="
                                  text-gray-400
                                  text-sm
                                  mb-3
                                "

                              >

                                المخزن:

                                {' '}

                                {warehouse.name}

                              </div>

                            )

                          }

                          {/* ============================================
                              PRICING
                              ============================================ */}

                          <div

                            className="
                              flex
                              items-center
                              gap-4
                              flex-wrap
                              mb-4
                            "

                          >

                            {

                              oldPrice > 0 &&

                              oldPrice >
                              offerPrice && (

                                <span

                                  className="
                                    text-gray-500
                                    text-xl
                                    line-through
                                  "

                                >

                                  {oldPrice}

                                </span>

                              )

                            }

                            <span

                              className="
                                text-yellow-400
                                text-3xl
                                font-black
                              "

                            >

                              {offerPrice}

                              {' '}

                              جنيه

                            </span>

                          </div>

                          {/* ============================================
                              STOCK
                              ============================================ */}

                          <div

                            className={

                              available

                                ? `
                                  text-green-400
                                  font-bold
                                  mb-5
                                `

                                : `
                                  text-red-500
                                  font-bold
                                  mb-5
                                `

                            }

                          >

                            {

                              available

                                ? (

                                  <>

                                    المتاح:

                                    {' '}

                                    {stockQuantity}

                                  </>

                                )

                                : (

                                  'غير متوفر حالياً'

                                )

                            }

                          </div>

                          {

                            offer.description && (

                              <p

                                className="
                                  text-gray-300
                                  leading-relaxed
                                  mb-6
                                "

                              >

                                {
                                  offer.description
                                }

                              </p>

                            )

                          }

                          {/* ============================================
                              ADD TO CART
                              ============================================ */}

                          <button

                            type="button"

                            disabled={
                              !available
                            }

                            onClick={
                              handleAddToCart
                            }

                            className={

                              available

                                ? `
                                  w-full
                                  bg-yellow-500
                                  hover:bg-yellow-600
                                  text-black
                                  py-4
                                  rounded-2xl
                                  font-black
                                  transition
                                `

                                : `
                                  w-full
                                  bg-gray-700
                                  text-gray-400
                                  py-4
                                  rounded-2xl
                                  font-black
                                  cursor-not-allowed
                                `

                            }

                          >

                            {

                              available

                                ? 'إضافة العرض للسلة'

                                : 'غير متوفر حالياً'

                            }

                          </button>
                          {
                            feedbackSentProductId ===
                              (
                                productId ??
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
                                    productId ??
                                    null
                                  )
                                ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFeedbackProductId(
                                        productId ??
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
                                            {
                                              ...offer,
                                              id:
                                                productId,
                                              productId:
                                                productId
                                            },
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
                                            {
                                              ...offer,
                                              id:
                                                productId,
                                              productId:
                                                productId
                                            },
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
                                            {
                                              ...offer,
                                              id:
                                                productId,
                                              productId:
                                                productId
                                            },
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
                                            {
                                              ...offer,
                                              id:
                                                productId,
                                              productId:
                                                productId
                                            },
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
                                            {
                                              ...offer,
                                              id:
                                                productId,
                                              productId:
                                                productId
                                            },
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