export default function LowStockAlert({

  lowStockProducts

}) {

  // ================= EMPTY =================

  if (
    lowStockProducts.length === 0
  ) {

    return (

      <div className="
        mb-10
        bg-emerald-950
        border
        border-emerald-500
        rounded-[35px]
        p-8
        shadow-2xl
        flex
        flex-col
        lg:flex-row
        items-center
        justify-between
        gap-5
      ">

        <div>

          <h2 className="
            text-3xl
            font-black
            text-emerald-400
            mb-2
          ">

            ✅ المخزون ممتاز

          </h2>

          <p className="
            text-lg
            text-emerald-100
          ">

            لا توجد منتجات منخفضة المخزون حاليًا

          </p>

        </div>

        <div className="
          text-6xl
        ">

          📦

        </div>

      </div>

    )

  }

  // ================= UI =================

  return (

    <div className="
      mb-10
      bg-gradient-to-br
      from-red-950
      via-black
      to-red-900
      border
      border-red-500
      rounded-[35px]
      p-6
      shadow-2xl
      relative
      overflow-hidden
    ">

      {/* GLOW */}

      <div className="
        absolute
        top-0
        right-0
        w-72
        h-72
        bg-red-500/10
        blur-3xl
        rounded-full
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10
        flex
        items-center
        justify-between
        flex-wrap
        gap-4
        mb-8
      ">

        <div>

          <h2 className="
            text-3xl
            lg:text-4xl
            font-black
            text-red-400
            mb-2
          ">

            ⚠️ منتجات منخفضة المخزون

          </h2>

          <p className="
            text-red-100
            text-lg
          ">

            يجب إعادة تعبئة هذه المنتجات قريبًا

          </p>

        </div>

        <div className="
          bg-red-500
          text-white
          px-6
          py-3
          rounded-3xl
          font-black
          text-xl
          shadow-xl
        ">

          {lowStockProducts.length}
          {' '}
          منتجات

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="
        relative
        z-10
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {

          lowStockProducts.map((product) => (

            <div

              key={product.id}

              className="
                bg-black/40
                backdrop-blur-md
                border
                border-red-500/40
                rounded-[30px]
                p-5
                flex
                items-center
                gap-5
                hover:scale-[1.02]
                transition-all
                duration-300
                shadow-xl
              "
            >

              {/* IMAGE */}

              <div className="
                relative
              ">

                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-24
                    h-24
                    rounded-2xl
                    object-cover
                    border-2
                    border-red-500
                    shadow-lg
                  "
                />

                <div className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  font-black
                  px-2
                  py-1
                  rounded-full
                ">

                  منخفض

                </div>

              </div>

              {/* INFO */}

              <div className="
                flex-1
                min-w-0
              ">

                <h3 className="
                  text-2xl
                  font-black
                  truncate
                  mb-2
                ">

                  {product.name}

                </h3>

                <div className="
                  flex
                  flex-wrap
                  gap-3
                ">

                  <div className="
                    bg-red-500/20
                    border
                    border-red-500/30
                    px-4
                    py-2
                    rounded-2xl
                    text-red-200
                    text-sm
                    font-bold
                  ">

                    الكمية:
                    {' '}
                    {product.stock}

                  </div>

                  <div className="
                    bg-yellow-500/20
                    border
                    border-yellow-500/30
                    px-4
                    py-2
                    rounded-2xl
                    text-yellow-300
                    text-sm
                    font-bold
                  ">

                    المبيعات:
                    {' '}
                    {product.sold || 0}

                  </div>

                </div>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  )

}