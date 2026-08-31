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