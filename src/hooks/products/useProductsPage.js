import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { useProductStore } from '../../store/productStore'
import { useInventoryStore } from '../../store/inventoryStore'

import useProductSearch
  from '../useProductSearch'

import useProductsActions
  from './useProductsActions'

import useProductsFilters
  from './useProductsFilters'

import useProductsStats
  from './useProductsStats'

export default function useProductsPage() {

  const products =
    useProductStore(
      state => state.products || []
    )

  const stockItems =
    useInventoryStore(
      state => state.stockItems || []
    )

  const {

    search: smartSearch,

    results: smartResults

  } = useProductSearch()

  const [

    search,

    setSearch

  ] = useState('')

  const [

    filter,

    setFilter

  ] = useState('all')

  const [

    sortBy,

    setSortBy

  ] = useState('newest')

  const [

    currentPage,

    setCurrentPage

  ] = useState(1)

  const [

    loading,

    setLoading

  ] = useState(true)

  const [

    viewMode,

    setViewMode

  ] = useState('grid')

  useEffect(() => {

    smartSearch(search)

  }, [

    search,

    smartSearch

  ])

  useEffect(() => {

    const timer =

      setTimeout(

        () => setLoading(false),

        800

      )

    return () => clearTimeout(timer)

  }, [])

  useEffect(() => {

    setCurrentPage(1)

  }, [

    search,

    filter,

    sortBy

  ])

  const filteredProducts =
    useProductsFilters({

      products,

      search,

      filter,

      sortBy,

      smartResults

    })

  const stats =
    useProductsStats({

      products,

      stockItems

    })

  const actions =
    useProductsActions()

  const perPage = 6

  const totalPages =
    Math.ceil(

      filteredProducts.length /

      perPage

    )

  const paginatedProducts =
    useMemo(() =>

      filteredProducts.slice(

        (currentPage - 1) * perPage,

        currentPage * perPage

      ),

    [

      filteredProducts,

      currentPage

    ])

  return {

    products,

    stockItems,

    stats,

    loading,

    viewMode,

    setViewMode,

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

    ...actions

  }

}