// ======================================================
// EL OLA ERP
// Home Search Results
// ======================================================

export default function HomeSearchResults({

  title,

  results = [],

  emptyMessage = 'لا توجد نتائج',

  renderItem,

  onAddToCart

}) {

  // ====================================================
  // NORMALIZE RESULTS
  // ====================================================

  const safeResults =
    Array.isArray(results)
      ? results
      : []


  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (
    safeResults.length === 0
  ) {

    return (

      <div className="mt-8">

        <h3
          className="
            text-2xl
            font-black
            text-yellow-400
            mb-6
          "
        >
          {title}
        </h3>


        <div
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-2xl
            p-8
            text-center
            text-gray-400
          "
        >

          {emptyMessage}

        </div>

      </div>

    )

  }


  // ====================================================
  // RESULTS
  // ====================================================

  return (

    <div className="mt-8">

      <h3
        className="
          text-2xl
          font-black
          text-yellow-400
          mb-6
        "
      >

        {title}

      </h3>


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

              // ----------------------------------------
              // PREFERRED RENDERER
              // ----------------------------------------

              if (
                typeof renderItem ===
                'function'
              ) {

                return renderItem(
                  product,
                  index
                )

              }


              // ----------------------------------------
              // FALLBACK PRODUCT CARD
              // ----------------------------------------

              const productName =
                product?.name ||
                product?.productName ||
                'منتج'


              const price =
                product?.salePrice ??
                product?.price ??
                0


              const quantity =
                Number(
                  product?.availableQuantity ??
                  product?.quantity ??
                  product?.stock ??
                  0
                )


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
                    p-6
                  "
                >

                  {

                    product?.image && (

                      <img
                        src={product.image}
                        alt={productName}
                        className="
                          w-full
                          h-56
                          object-cover
                          rounded-2xl
                          mb-5
                        "
                      />

                    )

                  }


                  <div
                    className="
                      text-2xl
                      font-black
                      text-white
                    "
                  >

                    {productName}

                  </div>


                  {

                    product?.brand && (

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

                    product?.type && (

                      <div
                        className="
                          text-gray-400
                          mt-2
                        "
                      >

                        {product.type}

                      </div>

                    )

                  }


                  {

                    product?.tire && (

                      <div
                        className="
                          text-gray-300
                          mt-4
                        "
                      >

                        المقاس:

                        {' '}

                        {
                          product.tire.width ||
                          ''
                        }

                        {

                          product.tire.width &&
                          product.tire.height
                            ? '/'
                            : ''

                        }

                        {
                          product.tire.height ||
                          product.tire.profile ||
                          ''
                        }

                        {

                          (
                            product.tire.height ||
                            product.tire.profile
                          ) &&
                          product.tire.rim
                            ? '/'
                            : ''

                        }

                        {
                          product.tire.rim ||
                          ''
                        }

                      </div>

                    )

                  }


                  <div
                    className="
                      mt-5
                      text-yellow-400
                      text-3xl
                      font-black
                    "
                  >

                    {price}

                    {' '}

                    ج

                  </div>


                  <div
                    className={`
                      mt-3
                      font-black
                      ${
                        quantity > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    `}
                  >

                    {

                      quantity > 0

                        ? `✔ متوفر (${quantity})`

                        : '❌ غير متوفر'

                    }

                  </div>


                  {

                    typeof onAddToCart ===
                    'function' && (

                      <button
                        type="button"
                        disabled={
                          quantity <= 0
                        }
                        onClick={() =>
                          onAddToCart(
                            product
                          )
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
                        "
                      >

                        إضافة للسلة

                      </button>

                    )

                  }

                </div>

              )

            }

          )

        }

      </div>

    </div>

  )

}