import {
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react'

import {
  useWebsiteStore
} from '../store/websiteStore'

import ProductForm
  from '../components/products/ProductForm'

import ProductsStats
  from '../components/products/ProductsStats'

import ProductsFilters
  from '../components/products/ProductsFilters'

import ProductsGrid
  from '../components/products/ProductsGrid'

import ProductsPagination
  from '../components/products/ProductsPagination'

import ProductsSkeleton
  from '../components/products/ProductsSkeleton'

import ProductSearchInfo
  from '../components/products/ProductSearchInfo'

import ProductsSort
  from '../components/products/ProductsSort'

import LowStockAlert
  from '../components/products/LowStockAlert'

import ProductListCard
  from '../components/products/ProductListCard'

export default function Products() {

  // ================= STORE =================

  const products =
    useWebsiteStore(
      (s) => s.products
    )

  const addProduct =
    useWebsiteStore(
      (s) => s.addProduct
    )

  const deleteProduct =
    useWebsiteStore(
      (s) => s.deleteProduct
    )

  const updateProductStock =
    useWebsiteStore(
      (s) =>
        s.updateProductStock
    )

  const toggleProductVisibility =
    useWebsiteStore(
      (s) =>
        s.toggleProductVisibility
    )

  // ================= STATES =================

  const [search, setSearch] =
    useState('')

  const [filter, setFilter] =
    useState('all')

  const [sortBy, setSortBy] =
    useState('newest')

  const [viewMode, setViewMode] =
    useState('grid')

  const [currentPage, setCurrentPage] =
    useState(1)

  const [loading, setLoading] =
    useState(true)

  // ================= LOADING =================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setLoading(false)

      }, 1200)

    return () =>
      clearTimeout(timer)

  }, [])

  // ================= PAGE RESET =================

  useEffect(() => {

    setCurrentPage(1)

  }, [

    search,
    filter,
    sortBy,
    viewMode

  ])

  // ================= ADD PRODUCT =================

  const handleAddProduct =
    useCallback((product) => {

      addProduct({

        ...product,

        sold: 0,

        hidden: false,

        createdAt:
          new Date().toISOString()

      })

    }, [addProduct])

  // ================= DELETE =================

  const handleDelete =
    useCallback((id) => {

      const ok =
        window.confirm(
          'هل تريد حذف المنتج؟'
        )

      if (!ok) return

      deleteProduct(id)

    }, [deleteProduct])

  // ================= FILTERED PRODUCTS =================

  const filteredProducts =
    useMemo(() => {

      let result =
        [...products]

      // SEARCH

      if (
        search.trim()
      ) {

        result =
          result.filter(

            (product) =>

              product.name
                ?.toLowerCase()
                .includes(

                  search.toLowerCase()

                )

          )

      }

      // LOW STOCK

      if (
        filter === 'low'
      ) {

        result =
          result.filter(

            (product) =>

              Number(
                product.stock || 0
              ) <= 5

          )

      }

      // HIDDEN

      if (
        filter === 'hidden'
      ) {

        result =
          result.filter(

            (product) =>
              product.hidden

          )

      }

      // AVAILABLE

      if (
        filter === 'available'
      ) {

        result =
          result.filter(

            (product) =>

              Number(
                product.stock || 0
              ) > 0

          )

      }

      // ================= SORT =================

      // NEWEST

      if (
        sortBy === 'newest'
      ) {

        result.sort(

          (a, b) =>

            new Date(
              b.createdAt || 0
            ) -

            new Date(
              a.createdAt || 0
            )

        )

      }

      // OLDEST

      if (
        sortBy === 'oldest'
      ) {

        result.sort(

          (a, b) =>

            new Date(
              a.createdAt || 0
            ) -

            new Date(
              b.createdAt || 0
            )

        )

      }

      // PRICE HIGH

      if (
        sortBy === 'priceHigh'
      ) {

        result.sort(

          (a, b) =>

            Number(
              b.price || 0
            ) -

            Number(
              a.price || 0
            )

        )

      }

      // PRICE LOW

      if (
        sortBy === 'priceLow'
      ) {

        result.sort(

          (a, b) =>

            Number(
              a.price || 0
            ) -

            Number(
              b.price || 0
            )

        )

      }

      // STOCK HIGH

      if (
        sortBy === 'stockHigh'
      ) {

        result.sort(

          (a, b) =>

            Number(
              b.stock || 0
            ) -

            Number(
              a.stock || 0
            )

        )

      }

      // STOCK LOW

      if (
        sortBy === 'stockLow'
      ) {

        result.sort(

          (a, b) =>

            Number(
              a.stock || 0
            ) -

            Number(
              b.stock || 0
            )

        )

      }

      return result

    }, [

      products,
      search,
      filter,
      sortBy

    ])

  // ================= PAGINATION =================

  const PRODUCTS_PER_PAGE = 6

  const totalPages =
    Math.ceil(

      filteredProducts.length /

      PRODUCTS_PER_PAGE

    )

  const paginatedProducts =
    filteredProducts.slice(

      (

        currentPage - 1

      ) *

      PRODUCTS_PER_PAGE,

      currentPage *

      PRODUCTS_PER_PAGE

    )

  // ================= TOTALS =================

  const totalStock =
    useMemo(() => {

      return products.reduce(

        (acc, product) =>

          acc +

          Number(
            product.stock || 0
          ),

        0

      )

    }, [products])

  const totalSold =
    useMemo(() => {

      return products.reduce(

        (acc, product) =>

          acc +

          Number(
            product.sold || 0
          ),

        0

      )

    }, [products])

  const hiddenProducts =
    useMemo(() => {

      return products.filter(

        (product) =>
          product.hidden

      ).length

    }, [products])

  // ================= LOW STOCK =================

  const lowStockProducts =
    useMemo(() => {

      return products.filter(

        (product) =>

          Number(
            product.stock || 0
          ) <= 5

      )

    }, [products])

  // ================= UI =================

  return (

    <div className="
      p-6
      lg:p-10
      bg-black
      min-h-screen
      text-white
    ">

      {/* HEADER */}

      <div className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        rounded-[40px]
        p-8
        lg:p-12
        mb-12
        shadow-2xl
      ">

        <h1 className="
          text-4xl
          lg:text-6xl
          font-black
          mb-4
        ">

          إدارة المنتجات والمخزون

        </h1>

        <p className="
          text-xl
          lg:text-2xl
          text-white/90
        ">

          إدارة كاملة للمنتجات والمبيعات والمخزون

        </p>

      </div>

      {/* STATS */}

      <ProductsStats

        productsCount={
          products.length
        }

        totalStock={
          totalStock
        }

        totalSold={
          totalSold
        }

        hiddenProducts={
          hiddenProducts
        }

      />

      {/* FORM */}

      <ProductForm
        onAddProduct={
          handleAddProduct
        }
      />

      {/* LOW STOCK ALERT */}

      <LowStockAlert

        lowStockProducts={
          lowStockProducts
        }

      />

      {/* FILTERS */}

      <ProductsFilters

        search={search}
        setSearch={setSearch}

        filter={filter}
        setFilter={setFilter}

      />

      {/* SEARCH INFO */}

      <ProductSearchInfo

        totalResults={
          filteredProducts.length
        }

        search={search}

        filter={filter}

      />

      {/* SORT + VIEW MODE */}

      <div className="
        flex
        flex-col
        xl:flex-row
        gap-6
        mb-10
      ">

        <div className="flex-1">

          <ProductsSort

            sortBy={sortBy}

            setSortBy={setSortBy}

          />

        </div>

        {/* VIEW MODE */}

        <div className="
          bg-slate-900
          border
          border-slate-700
          rounded-3xl
          p-6
          flex
          items-center
          gap-4
          shadow-2xl
        ">

          <button

            type="button"

            onClick={() =>
              setViewMode('grid')
            }

            className={`
              px-6
              py-4
              rounded-2xl
              text-xl
              font-black
              transition-all

              ${

                viewMode === 'grid'

                  ? `
                    bg-yellow-500
                    text-black
                  `

                  : `
                    bg-black
                    text-white
                    border
                    border-slate-700
                  `

              }
            `}
          >

            ⬜ Grid

          </button>

          <button

            type="button"

            onClick={() =>
              setViewMode('list')
            }

            className={`
              px-6
              py-4
              rounded-2xl
              text-xl
              font-black
              transition-all

              ${

                viewMode === 'list'

                  ? `
                    bg-yellow-500
                    text-black
                  `

                  : `
                    bg-black
                    text-white
                    border
                    border-slate-700
                  `

              }
            `}
          >

            ☰ List

          </button>

        </div>

      </div>

      {/* PRODUCTS */}

      {

        loading ? (

          <ProductsSkeleton />

        ) : (

          <>

            {

              viewMode === 'grid' ? (

                <ProductsGrid

                  products={
                    paginatedProducts
                  }

                  onDelete={
                    handleDelete
                  }

                  onToggleVisibility={
                    toggleProductVisibility
                  }

                  onUpdateStock={
                    updateProductStock
                  }

                />

              ) : (

                <div className="
                  space-y-8
                ">

                  {

                    paginatedProducts.map(

                      (product) => (

                        <ProductListCard

                          key={product.id}

                          product={product}

                          onDelete={
                            handleDelete
                          }

                          onToggleVisibility={
                            toggleProductVisibility
                          }

                          onUpdateStock={
                            updateProductStock
                          }

                        />

                      )

                    )

                  }

                </div>

              )

            }

          </>

        )

      }

      {/* PAGINATION */}

      {

        totalPages > 1 && (

          <ProductsPagination

            currentPage={
              currentPage
            }

            totalPages={
              totalPages
            }

            onPageChange={
              setCurrentPage
            }

          />

        )

      }

    </div>

  )

}