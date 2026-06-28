import { memo, useState } from 'react'

export default memo(function ProductListCard({

  product,

  onDelete,

  onToggleVisibility,

  onUpdateStock

}) {

  // ================= STATES =================

  const [stockValue, setStockValue] =
    useState(product.stock || 0)

  // ================= STOCK COLOR =================

  const getStockColor = () => {

    const stock =
      Number(product.stock || 0)

    if (stock <= 0)
      return 'text-red-500'

    if (stock <= 5)
      return 'text-yellow-400'

    return 'text-green-400'

  }

  // ================= SAVE STOCK =================

  const handleSaveStock = () => {

    onUpdateStock(

      product.id,

      Number(stockValue || 0)

    )

  }

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-[35px]
      p-5
      shadow-2xl
      flex
      flex-col
      xl:flex-row
      gap-6
      hover:border-yellow-500
      hover:scale-[1.01]
      transition-all
      duration-300
      overflow-hidden
    ">

      {/* IMAGE */}

      <div className="
        xl:w-[320px]
        shrink-0
        relative
      ">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="
            w-full
            h-72
            xl:h-full
            object-cover
            rounded-3xl
          "
        />

        {

          product.hidden && (

            <div className="
              absolute
              top-4
              left-4
              bg-red-600
              px-5
              py-2
              rounded-2xl
              text-lg
              font-black
              shadow-2xl
            ">

              مخفي

            </div>

          )

        }

      </div>

      {/* CONTENT */}

      <div className="
        flex-1
        flex
        flex-col
        justify-between
        gap-6
      ">

        {/* TOP */}

        <div>

          <div className="
            flex
            items-center
            justify-between
            flex-wrap
            gap-4
            mb-5
          ">

            <h2 className="
              text-4xl
              font-black
              leading-relaxed
            ">

              {product.name}

            </h2>

            <div className="
              text-sm
              text-gray-400
              bg-black
              border
              border-slate-700
              px-4
              py-2
              rounded-2xl
            ">

              {

                product.createdAt

                  ? new Date(
                      product.createdAt
                    ).toLocaleDateString()

                  : ''

              }

            </div>

          </div>

          {/* INFO */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          ">

            {/* PRICE */}

            <div className="
              bg-black
              border
              border-slate-700
              rounded-2xl
              p-5
            ">

              <div className="
                text-gray-400
                mb-2
                text-lg
              ">

                السعر

              </div>

              <div className="
                text-3xl
                font-black
                text-yellow-400
              ">

                {

                  Number(
                    product.price || 0
                  ).toLocaleString()

                }

                {' '}
                ج.م

              </div>

            </div>

            {/* STOCK */}

            <div className="
              bg-black
              border
              border-slate-700
              rounded-2xl
              p-5
            ">

              <div className="
                text-gray-400
                mb-2
                text-lg
              ">

                المخزون

              </div>

              <div className={`
                text-3xl
                font-black
                ${getStockColor()}
              `}>

                {product.stock || 0}

              </div>

            </div>

            {/* SOLD */}

            <div className="
              bg-black
              border
              border-slate-700
              rounded-2xl
              p-5
            ">

              <div className="
                text-gray-400
                mb-2
                text-lg
              ">

                المبيعات

              </div>

              <div className="
                text-3xl
                font-black
                text-blue-400
              ">

                {product.sold || 0}

              </div>

            </div>

          </div>

        </div>

        {/* STOCK UPDATE */}

        <div className="
          bg-black
          border
          border-slate-700
          rounded-3xl
          p-5
          space-y-4
        ">

          <div className="
            text-2xl
            font-black
            text-yellow-400
          ">

            تعديل المخزون

          </div>

          <div className="
            flex
            flex-col
            lg:flex-row
            gap-4
          ">

            <input
              type="number"
              value={stockValue}
              onChange={(e) =>
                setStockValue(
                  e.target.value
                )
              }
              className="
                flex-1
                p-4
                rounded-2xl
                text-black
                text-xl
                font-bold
              "
            />

            <button

              type="button"

              onClick={handleSaveStock}

              className="
                bg-blue-700
                hover:bg-blue-800
                px-8
                py-4
                rounded-2xl
                text-xl
                font-black
                transition-all
              "
            >

              حفظ المخزون

            </button>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          <button

            type="button"

            onClick={() =>
              onToggleVisibility(
                product.id
              )
            }

            className="
              bg-yellow-500
              hover:bg-yellow-600
              text-black
              py-4
              rounded-2xl
              text-xl
              font-black
              transition-all
            "
          >

            👁️
            {' '}

            {

              product.hidden

                ? 'إظهار المنتج'

                : 'إخفاء المنتج'

            }

          </button>

          <button

            type="button"

            onClick={() =>

              onUpdateStock(
                product.id,
                Number(
                  product.stock || 0
                ) + 1
              )

            }

            className="
              bg-green-600
              hover:bg-green-700
              py-4
              rounded-2xl
              text-xl
              font-black
              transition-all
            "
          >

            ➕ إضافة مخزون

          </button>

          <button

            type="button"

            onClick={() =>
              onDelete(product.id)
            }

            className="
              bg-red-600
              hover:bg-red-700
              py-4
              rounded-2xl
              text-xl
              font-black
              transition-all
            "
          >

            🗑️ حذف المنتج

          </button>

        </div>

      </div>

    </div>

  )

})