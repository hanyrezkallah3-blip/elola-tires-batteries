import {
  useState
} from 'react'

import ProductCard
  from './ProductCard'

import ProductListCard
  from './ProductListCard'

import ProductEmptyState
  from './ProductEmptyState'

export default function ProductsGrid({

  products,

  onDelete,

  onToggleVisibility,

  onUpdateStock

}) {

  // ================= VIEW MODE =================

  const [viewMode, setViewMode] =
    useState('grid')

  // ================= EMPTY =================

  if (
    products.length === 0
  ) {

    return (
      <ProductEmptyState />
    )

  }

  // ================= UI =================

  return (

    <div className="space-y-8">

      {/* TOP BAR */}

      <div className="
        flex
        items-center
        justify-between
        gap-5
        flex-wrap
        bg-slate-900
        border
        border-slate-700
        rounded-[30px]
        p-5
        shadow-2xl
      ">

        {/* INFO */}

        <div>

          <h2 className="
            text-3xl
            font-black
            text-yellow-400
            mb-2
          ">

            المنتجات المعروضة

          </h2>

          <p className="
            text-gray-300
            text-lg
          ">

            عدد المنتجات:
            {' '}

            <span className="
              font-black
              text-white
            ">

              {products.length}

            </span>

          </p>

        </div>

        {/* VIEW SWITCH */}

        <div className="
          flex
          items-center
          gap-4
        ">

          {/* GRID */}

          <button

            type="button"

            onClick={() =>
              setViewMode('grid')
            }

            className={`
              px-6
              py-4
              rounded-2xl
              font-black
              text-lg
              transition-all
              duration-300

              ${

                viewMode === 'grid'

                  ? `
                    bg-yellow-500
                    text-black
                  `

                  : `
                    bg-slate-800
                    hover:bg-slate-700
                    text-white
                  `

              }
            `}
          >

            ⬛ Grid

          </button>

          {/* LIST */}

          <button

            type="button"

            onClick={() =>
              setViewMode('list')
            }

            className={`
              px-6
              py-4
              rounded-2xl
              font-black
              text-lg
              transition-all
              duration-300

              ${

                viewMode === 'list'

                  ? `
                    bg-yellow-500
                    text-black
                  `

                  : `
                    bg-slate-800
                    hover:bg-slate-700
                    text-white
                  `

              }
            `}
          >

            📋 List

          </button>

        </div>

      </div>

      {/* GRID VIEW */}

      {

        viewMode === 'grid' && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            2xl:grid-cols-3
            gap-10
            animate-in
            fade-in
            duration-500
          ">

            {

              products.map(

                (product) => (

                  <ProductCard

                    key={product.id}

                    product={product}

                    onDelete={
                      onDelete
                    }

                    onToggleVisibility={
                      onToggleVisibility
                    }

                    onUpdateStock={
                      onUpdateStock
                    }

                  />

                )

              )

            }

          </div>

        )

      }

      {/* LIST VIEW */}

      {

        viewMode === 'list' && (

          <div className="
            flex
            flex-col
            gap-6
            animate-in
            fade-in
            duration-500
          ">

            {

              products.map(

                (product) => (

                  <ProductListCard

                    key={product.id}

                    product={product}

                    onDelete={
                      onDelete
                    }

                    onToggleVisibility={
                      onToggleVisibility
                    }

                    onUpdateStock={
                      onUpdateStock
                    }

                  />

                )

              )

            }

          </div>

        )

      }

    </div>

  )

}