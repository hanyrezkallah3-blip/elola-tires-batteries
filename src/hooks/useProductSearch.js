// =====================================================
// EL OLA ERP
// useProductSearch Hook
// UI Access Layer
// =====================================================

import {
  useState,
  useCallback
} from 'react'

import SmartSearchEngine from "../core/engines/SmartSearchEngine"

import { useProductStore } from "../store/productStore"

export default function useProductSearch() {

  const products = useProductStore(
    state => state.products || []
  )

  const [results, setResults] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  // =====================================================
  // MAIN SEARCH
  // =====================================================

  const search = useCallback(

    async (
      query = '',
      options = {}
    ) => {

      try {

        setLoading(true)

        setError(null)

        const data = SmartSearchEngine.search(

          products,

          query,

          options

        )

        setResults(data)

        return data

      }

      catch (err) {

        console.error(

          'Smart Search Error:',

          err

        )

        setError(err)

        setResults([])

        return []

      }

      finally {

        setLoading(false)

      }

    },

    [products]

  )

  // =====================================================
  // TIRES SEARCH
  // =====================================================

  const searchTires = useCallback(

    async (size) => {

      try {

        setLoading(true)

        const data = SmartSearchEngine.searchTires(

          products,

          size

        )

        setResults(data)

        return data

      }

      catch (err) {

        setError(err)

        return []

      }

      finally {

        setLoading(false)

      }

    },

    [products]

  )

  // =====================================================
  // BATTERIES SEARCH
  // =====================================================

  const searchBatteries = useCallback(

    async (specification) => {

      try {

        setLoading(true)

        const data = SmartSearchEngine.searchBatteries(

          products,

          specification

        )

        setResults(data)

        return data

      }

      catch (err) {

        setError(err)

        return []

      }

      finally {

        setLoading(false)

      }

    },

    [products]

  )

  // =====================================================
  // CLEAR
  // =====================================================

  const clear = useCallback(() => {

    setResults([])

    setError(null)

  }, [])

  return {

    results,

    loading,

    error,

    search,

    searchTires,

    searchBatteries,

    clear

  }

}