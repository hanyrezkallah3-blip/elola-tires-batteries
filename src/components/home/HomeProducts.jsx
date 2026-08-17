export default function HomeProducts({

  products = [],

  addToCart

}) {

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