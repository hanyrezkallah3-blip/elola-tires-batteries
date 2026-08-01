import ProductForm
  from '../components/products/ProductForm'

import ProductsHeader
  from '../components/products/page/ProductsHeader'

import ProductsContent
  from '../components/products/page/ProductsContent'

import useProductsPage
  from '../hooks/products/useProductsPage'


export default function Products() {

  const {

    products,

    stats,

    loading,

    viewMode,

    search,

    setSearch,

    filter,

    setFilter,

    sortBy,

    setSortBy,

    currentPage,

    setCurrentPage,

    totalPages,

    paginatedProducts,

    filteredProducts,

    handleAddProduct,

    handleDelete,

    toggleProductVisibility,

  } = useProductsPage()


  return (

    <div
      className="
        p-6
        lg:p-10
        bg-black
        min-h-screen
        text-white
      "
    >

      <ProductsHeader />


      <ProductForm

        onAddProduct={
          handleAddProduct
        }

      />


      <ProductsContent

        stats={stats}

        productsCount={
          products.length
        }

        loading={loading}

        viewMode={viewMode}

        paginatedProducts={
          paginatedProducts
        }

        filteredProducts={
          filteredProducts
        }

        onDelete={
          handleDelete
        }

        onToggleVisibility={
          toggleProductVisibility
        }

        onUpdateStock={
          () => {}
        }

        search={search}

        setSearch={setSearch}

        filter={filter}

        setFilter={setFilter}

        sortBy={sortBy}

        setSortBy={setSortBy}

        currentPage={
          currentPage
        }

        totalPages={
          totalPages
        }

        setCurrentPage={
          setCurrentPage
        }

      />

    </div>

  )

}