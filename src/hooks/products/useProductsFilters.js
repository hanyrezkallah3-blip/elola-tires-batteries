import { useMemo } from 'react'

import useProductSearch
  from '../useProductSearch'

export default function useProductsFilters({

  products,

  search,

  filter,

  sortBy

}) {

  const {

    results: smartResults

  } = useProductSearch()

  return useMemo(() => {

    let result = [...products]

    if (search.trim()) {

      result = smartResults

    }

    switch (filter) {

      case 'low':

        result = result.filter(

          product =>

            Number(product.stock || 0) <= 5

        )

        break

      case 'available':

        result = result.filter(

          product =>

            Number(product.stock || 0) > 0

        )

        break

      case 'hidden':

        result = result.filter(

          product => product.hidden

        )

        break

      default:

        break

    }

    const sorters = {

      newest: (a, b) =>

        new Date(b.createdAt || 0) -

        new Date(a.createdAt || 0),

      oldest: (a, b) =>

        new Date(a.createdAt || 0) -

        new Date(b.createdAt || 0),

      priceHigh: (a, b) =>

        Number(b.salePrice || b.price || 0) -

        Number(a.salePrice || a.price || 0),

      priceLow: (a, b) =>

        Number(a.salePrice || a.price || 0) -

        Number(b.salePrice || b.price || 0),

      stockHigh: (a, b) =>

        Number(b.stock || 0) -

        Number(a.stock || 0),

      stockLow: (a, b) =>

        Number(a.stock || 0) -

        Number(b.stock || 0)

    }

    if (sorters[sortBy]) {

      result.sort(

        sorters[sortBy]

      )

    }

    return result

  }, [

    products,

    search,

    smartResults,

    filter,

    sortBy

  ])

}