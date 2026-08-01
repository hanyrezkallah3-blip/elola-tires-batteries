import ProductsStats
  from '../ProductsStats'

import ProductsFilters
  from '../ProductsFilters'

import ProductSearchInfo
  from '../ProductSearchInfo'

import ProductsSort
  from '../ProductsSort'

import LowStockAlert
  from '../LowStockAlert'

import ProductGridSection
  from './ProductsGridSection'

import ProductsListSection
  from './ProductsListSection'

import ProductsPagination
  from '../ProductsPagination'


export default function ProductsContent({

  stats,

  productsCount,

  loading,

  viewMode,

  paginatedProducts,

  filteredProducts,

  onDelete,

  onToggleVisibility,

  onUpdateStock,

  search,

  setSearch,

  filter,

  setFilter,

  sortBy,

  setSortBy,

  currentPage,

  totalPages,

  setCurrentPage

}) {

  return (

    <>

      <ProductsStats

        productsCount={
          productsCount
        }

        totalStock={
          stats.totalStock
        }

        totalSold={
          stats.totalSold
        }

        hiddenProducts={
          stats.hiddenProducts
        }

      />


      <LowStockAlert

        lowStockProducts={
          stats.lowStockProducts
        }

      />


      <ProductsFilters

        search={search}

        setSearch={setSearch}

        filter={filter}

        setFilter={setFilter}

      />


      <ProductSearchInfo

        totalResults={
          filteredProducts.length
        }

        search={search}

        filter={filter}

      />


      <ProductsSort

        sortBy={sortBy}

        setSortBy={setSortBy}

      />


      {
        viewMode === 'grid' ?

        <ProductGridSection

          loading={loading}

          products={
            paginatedProducts
          }

          onDelete={onDelete}

          onToggleVisibility={
            onToggleVisibility
          }

          onUpdateStock={
            onUpdateStock
          }

        />

        :

        <ProductsListSection

          products={
            paginatedProducts
          }

          onDelete={onDelete}

          onToggleVisibility={
            onToggleVisibility
          }

          onUpdateStock={
            onUpdateStock
          }

        />

      }


      {
        totalPages > 1 &&

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

      }

    </>

  )

}