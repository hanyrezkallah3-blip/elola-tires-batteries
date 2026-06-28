import {
  memo,
  useState,
  useMemo
} from 'react'

export default memo(function ProductCard({

  product,

  onDelete,

  onToggleVisibility,

  onUpdateStock

}) {

  const [stockValue, setStockValue] =
    useState(product.stock || 0)

  // ================= VALUES =================

  const stock =
    Number(product.stock || 0)

  const sold =
    Number(product.sold || 0)

  const price =
    Number(product.price || 0)

  // ================= STOCK STATUS =================

  const stockStatus =
    useMemo(() => {

      if (stock <= 0) {

        return {

          text:
            'غير متوفر',

          color:
            'text-red-400',

          bg:
            'bg-red-500/10 border-red-500/30'

        }

      }

      if (stock <= 5) {

        return {

          text:
            'مخزون منخفض',

          color:
            'text-yellow-400',

          bg:
            'bg-yellow-500/10 border-yellow-500/30'

        }

      }

      return {

        text:
          'متوفر',

        color:
          'text-green-400',

        bg:
          'bg-green-500/10 border-green-500/30'

      }

    }, [stock])

  // ================= SAVE STOCK =================

  const handleSaveStock = () => {

    onUpdateStock(

      product.id,

      Number(stockValue || 0)

    )

  }

  // ================= UI =================

  return (

    <div className="
      group
      bg-slate-900
      rounded-[35px]
      overflow-hidden
      border
      border-slate-700
      shadow-2xl
      hover:border-yellow-400
      transition-all
      duration-300
      hover:-translate-y-1
    ">

      {/* IMAGE */}

      <div className="
        relative
        overflow-hidden
      ">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="
            w-full
            h-72
            object-cover
            transition-all
            duration-500
            group-hover:scale-105
          "
        />

        {/* OVERLAY */}

        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          via-black/10
          to-transparent
        " />

        {/* HIDDEN */}

        {

          product.hidden && (

            <div className="
              absolute
              top-4
              left-4
              bg-red-600
              text-white
              px-4
              py-2
              rounded-2xl
              font-black
              shadow-xl
              text-sm
            ">

              مخفي

            </div>

          )

        }

        {/* STATUS */}

        <div className={`
          absolute
          bottom-4
          right-4
          px-4
          py-2
          rounded-2xl
          border
          backdrop-blur-md
          text-sm
          font-black
          ${stockStatus.bg}
          ${stockStatus.color}
        `}>

          {stockStatus.text}

        </div>

      </div>

      {/* CONTENT */}

      <div className="
        p-6
        space-y-5
      ">

        {/* NAME */}

        <div>

          <h2 className="
            text-3xl
            font-extrabold
            leading-relaxed
            line-clamp-2
          ">

            {product.name}

          </h2>

        </div>

        {/* PRICE */}

        <div className="
          flex
          items-center
          justify-between
          gap-4
          flex-wrap
        ">

          <div>

            <div className="
              text-sm
              text-gray-400
              mb-1
            ">

              السعر

            </div>

            <div className="
              text-yellow-400
              text-4xl
              font-black
            ">

              {price.toLocaleString()}
              {' '}
              ج

            </div>

          </div>

          <div className="
            bg-black/40
            border
            border-slate-700
            px-4
            py-3
            rounded-2xl
            text-center
            min-w-[110px]
          ">

            <div className="
              text-sm
              text-gray-400
              mb-1
            ">

              المبيعات

            </div>

            <div className="
              text-2xl
              font-black
              text-green-400
            ">

              {sold}

            </div>

          </div>

        </div>

        {/* STOCK INFO */}

        <div className="
          grid
          grid-cols-2
          gap-4
        ">

          <div className="
            bg-black
            rounded-2xl
            p-4
            border
            border-slate-700
          ">

            <div className="
              text-sm
              text-gray-400
              mb-2
            ">

              المخزون

            </div>

            <div className={`
              text-3xl
              font-black
              ${stockStatus.color}
            `}>

              {stock}

            </div>

          </div>

          <div className="
            bg-black
            rounded-2xl
            p-4
            border
            border-slate-700
          ">

            <div className="
              text-sm
              text-gray-400
              mb-2
            ">

              الحالة

            </div>

            <div className={`
              text-lg
              font-black
              ${stockStatus.color}
            `}>

              {stockStatus.text}

            </div>

          </div>

        </div>

        {/* STOCK UPDATE */}

        <div className="
          bg-black
          rounded-3xl
          p-5
          border
          border-slate-700
          space-y-4
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          ">

            <div className="
              text-xl
              font-black
            ">

              تعديل المخزون

            </div>

            <div className="
              text-sm
              text-gray-400
            ">

              تحديث الكمية الحالية

            </div>

          </div>

          <input
            type="number"
            value={stockValue}
            onChange={(e) =>
              setStockValue(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              text-black
              text-xl
              font-bold
              outline-none
            "
          />

          <button

            type="button"

            onClick={handleSaveStock}

            className="
              w-full
              bg-blue-700
              hover:bg-blue-800
              py-4
              rounded-2xl
              font-black
              text-xl
              transition-all
              duration-300
            "
          >

            حفظ المخزون

          </button>

        </div>

        {/* ACTIONS */}

        <div className="
          grid
          grid-cols-1
          gap-4
        ">

          <button

            type="button"

            onClick={() =>

              onToggleVisibility(
                product.id
              )

            }

            className={`
              w-full
              py-4
              rounded-2xl
              font-black
              text-lg
              transition-all
              duration-300

              ${

                product.hidden

                  ? `
                    bg-green-700
                    hover:bg-green-800
                  `

                  : `
                    bg-slate-700
                    hover:bg-slate-800
                  `

              }
            `}
          >

            {

              product.hidden

                ? 'إظهار المنتج'

                : 'إخفاء المنتج'

            }

          </button>

          <button

            type="button"

            onClick={() =>
              onDelete(product.id)
            }

            className="
              w-full
              bg-red-600
              hover:bg-red-700
              py-4
              rounded-2xl
              font-black
              text-lg
              transition-all
              duration-300
            "
          >

            حذف المنتج

          </button>

        </div>

        {/* CREATED */}

        <div className="
          flex
          items-center
          justify-center
          pt-2
          text-sm
          text-gray-500
          border-t
          border-slate-800
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

    </div>

  )

})