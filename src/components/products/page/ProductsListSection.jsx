import ProductListCard
  from '../ProductListCard'

export default function ProductsListSection({

  products,

  onDelete,

  onToggleVisibility,

  onUpdateStock

}) {

  return (

    <div className="space-y-8">

      {
        products.map(product => (

          <ProductListCard

            key={product.id}

            product={product}

            onDelete={onDelete}

            onToggleVisibility={
              onToggleVisibility
            }

            onUpdateStock={
              onUpdateStock
            }

          />

        ))
      }

    </div>

  )

}