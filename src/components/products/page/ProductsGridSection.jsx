import ProductsGrid
  from '../ProductsGrid'

import ProductsSkeleton
  from '../ProductsSkeleton'

export default function ProductsGridSection({

  loading,

  products,

  onDelete,

  onToggleVisibility,

  onUpdateStock

}) {

  if (loading) {

    return <ProductsSkeleton />

  }

  return (

    <ProductsGrid

      products={products}

      onDelete={onDelete}

      onToggleVisibility={
        onToggleVisibility
      }

      onUpdateStock={
        onUpdateStock
      }

    />

  )

}