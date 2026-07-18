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

              visibleProducts.map(product => (

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

                  <div

                    className="
                      aspect-square
                      overflow-hidden
                    "

                  >

                    <img

                      src={product.image}

                      alt={product.name}

                      className="
                        w-full
                        h-full
                        object-cover
                        hover:scale-105
                        transition
                      "

                    />

                  </div>

                  <div className="p-5">

                    <h3

                      className="
                        text-xl
                        font-black
                        min-h-[60px]
                      "

                    >

                      {product.name}

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

                    <div

                      className="
                        mt-5
                        text-yellow-400
                        text-3xl
                        font-black
                      "

                    >

                      {product.price} ج

                    </div>

                    <button

                      type="button"

                      onClick={()=>

                        addToCart(product)

                      }

                      className="
                        w-full
                        mt-5
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-black
                        py-4
                        rounded-2xl
                        font-black
                        transition
                      "

                    >

                      إضافة للسلة

                    </button>

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </section>

  )

}