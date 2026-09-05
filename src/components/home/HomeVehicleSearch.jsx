// ======================================================
// EL OLA ERP
// Home Vehicle Search
// ======================================================

import {
  useEffect,
  useRef,
  useState
} from 'react'

import useVehicleSearch
  from '../../hooks/useVehicleSearch'

import useMarketDemandStore
  from '../../store/marketDemandStore'

import VehicleSearchForm
  from './VehicleSearchForm'

import HomeSearchResults
  from './HomeSearchResults'



export default function HomeVehicleSearch({
  onAddToCart
}) {


  const [
    tab,
    setTab
  ] = useState('vehicle')


  const [
    searched,
    setSearched
  ] = useState(false)


  const {
    loading,
    results,
    form,
    setForm,
    vehicleTypes,
    brands,
    models,
    years,
    tireSearchError,
    search
  } = useVehicleSearch()



  // ====================================================
  // MARKET DEMAND
  // ====================================================

  const searchContextRef =
    useRef({
      searchType: 'vehicle',
      searchQuery: ''
    })



  // ====================================================
  // BUILD SEARCH CONTEXT
  // ====================================================

  const buildSearchContext =
    searchTab => {

      const currentForm =
        form || {}


      return {

        searchType:
          searchTab ||
          'vehicle',


        searchQuery:
          searchTab === 'vehicle'
            ? [
                currentForm.vehicleType ||
                  currentForm.type ||
                  '',

                currentForm.make ||
                  currentForm.brand ||
                  '',

                currentForm.model ||
                  '',

                currentForm.year ||
                  ''
              ]
                .filter(Boolean)
                .join(' ')


            : searchTab === 'tire'
              ? (
                  currentForm.tireSize ||
                  ''
                )


              : searchTab === 'battery'
                ? (
                    currentForm.capacity ||
                    ''
                  )


                : searchTab === 'oil'
                  ? (
                      currentForm.viscosity ||
                      ''
                    )


                  : '',


        vehicleType:
          currentForm.vehicleType ||
          currentForm.type ||
          '',


        make:
          currentForm.make ||
          currentForm.brand ||
          '',


        model:
          currentForm.model ||
          '',


        year:
          currentForm.year ||
          '',


        tireSize:
          currentForm.tireSize ||
          '',


        capacity:
          currentForm.capacity ||
          '',


        viscosity:
          currentForm.viscosity ||
          ''

      }

    }



  // ====================================================
  // NORMALIZE MARKET DEMAND PRODUCTS
  // ====================================================
  //
  // The search engine may return products using
  // different identity fields.
  //
  // Market Demand must always receive a stable:
  //
  // - id
  // - productId
  // - name
  // - productName
  //
  // ====================================================

  const normalizeDemandProduct =
    product => {

      if (
        !product ||
        typeof product !== 'object'
      ) {
        return null
      }


      const productId =
        product?.productId ??
        product?.id ??
        product?.sku ??
        product?.barcode ??
        ''


      const productName =
        product?.productName ||
        product?.name ||
        product?.title ||
        ''


      if (
        !String(productId).trim() &&
        !String(productName).trim()
      ) {
        return null
      }


      return {

        ...product,

        id:
          productId ||
          product?.id,

        productId:
          productId ||
          product?.id,

        name:
          productName,

        productName:
          productName

      }

    }



  // ====================================================
  // NORMALIZE SEARCH RESULTS
  // ====================================================

  const normalizeSearchResults =
    value => {

      if (
        Array.isArray(value)
      ) {
        return value
          .map(
            normalizeDemandProduct
          )
          .filter(Boolean)
      }


      if (
        value &&
        typeof value === 'object'
      ) {

        const arrays = [

          value.products,

          value.results,

          value.tires,

          value.batteries,

          value.oils,

          value.parts,

          value.vehicle

        ]


        return arrays
          .filter(
            Array.isArray
          )
          .flat()
          .map(
            normalizeDemandProduct
          )
          .filter(Boolean)

      }


      return []

    }



  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart =
    product => {

      if (
        typeof onAddToCart !==
        'function'
      ) {
        return
      }


      const normalizedProduct =
        normalizeDemandProduct(
          product
        )


      onAddToCart({

        ...product,

        ...(normalizedProduct || {}),

        id:
          product?.id ??
          product?.productId,

        name:
          product?.name ||
          product?.productName ||
          'منتج',

        price:
          product?.offerPrice ??
          product?.salePrice ??
          product?.price ??
          0,

        searchContext:
          searchContextRef.current

      })

    }



  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch =
    async searchTab => {

      const initialSearchContext =
        buildSearchContext(
          searchTab
        )


      searchContextRef.current =
        initialSearchContext


      setSearched(
        true
      )


      // ------------------------------------------------
      // EXECUTE THE REAL SEARCH FIRST
      // ------------------------------------------------
      //
      // IMPORTANT:
      // We must NOT record a product request before
      // knowing which products were actually returned.
      //
      // This prevents:
      //
      // "منتج غير محدد"
      //
      // from being counted as a requested product.
      //
      // ------------------------------------------------

      let searchResults = []


      let response = null


      try {

        response =
          await search(
            searchTab
          )


        searchResults =
          normalizeSearchResults(
            response
          )


        // ------------------------------------------------
        // FALLBACK:
        // Some versions of the hook update `results`
        // but do not return the array directly.
        // ------------------------------------------------

        if (
          searchResults.length === 0 &&
          Array.isArray(results)
        ) {

          searchResults =
            normalizeSearchResults(
              results
            )

        }


      } catch (error) {

        console.error(
          '[MarketDemand] search failed:',
          error
        )

        return

      }



      // ------------------------------------------------
      // IMPORTANT:
      // USE THE REAL AI SEARCH QUERY
      // ------------------------------------------------
      //
      // Vehicle Search may resolve the actual query
      // internally inside useVehicleSearch.
      //
      // Example:
      //
      // User form:
      // Toyota / Corolla / 2021
      //
      // Real AI query:
      // toyota corolla 2021
      //
      // The response contains the authoritative query.
      //
      // We must use it for Market Demand attribution.
      //
      // ------------------------------------------------

      if (
        searchTab === 'vehicle'
      ) {

        const realVehicleQuery =
          typeof response?.query === 'string'
            ? response.query.trim()
            : ''


        if (
          realVehicleQuery
        ) {

          searchContextRef.current = {

            ...searchContextRef.current,

            searchType:
              'vehicle',

            searchQuery:
              realVehicleQuery

          }


          console.log(
            '[MarketDemand] Vehicle search context resolved',
            {
              searchQuery:
                realVehicleQuery,

              searchContext:
                searchContextRef.current
            }
          )

        }

      }



      // ------------------------------------------------
      // MARKET DEMAND: REQUEST
      // ------------------------------------------------
      //
      // One search can return several products.
      // Every returned product is a real requested
      // product and must be counted independently.
      //
      // ------------------------------------------------

      try {

        const demandStore =
          useMarketDemandStore
            .getState()


        if (
          searchResults.length > 0
        ) {

          demandStore.recordRequest({

            query:
              searchContextRef.current.searchQuery,

            searchType:
              searchContextRef.current.searchType,

            searchContext:
              searchContextRef.current,

            products:
              searchResults,

            metadata: {

              source:
                'HomeVehicleSearch',

              resultCount:
                searchResults.length

            }

          })


          console.log(
            '[MarketDemand] Request recorded',
            {
              query:
                searchContextRef.current.searchQuery,

              products:
                searchResults

            }
          )

        } else {

          // --------------------------------------------
          // Search itself is still useful analytically,
          // but it is NOT attributed to a fake product.
          // --------------------------------------------

          console.log(
            '[MarketDemand] Search returned no products',
            {
              query:
                searchContextRef.current.searchQuery,

              searchType:
                searchContextRef.current.searchType
            }
          )

        }

      } catch (error) {

        console.error(
          '[MarketDemand] request tracking failed:',
          error
        )

      }

    }



  // ====================================================
  // MARKET DEMAND: VIEWED RESULTS
  // ====================================================
  //
  // IMPORTANT:
  //
  // The previous implementation checked:
  //
  // Array.isArray(results)
  //
  // but the component can receive different result
  // shapes depending on the active search path.
  //
  // We therefore normalize the actual result collection.
  //
  // ====================================================

  useEffect(() => {

    if (
      !searched ||
      loading
    ) {
      return
    }


    const visibleDemandResults =
      normalizeSearchResults(
        results
      )


    if (
      visibleDemandResults.length === 0
    ) {
      return
    }


    try {

      const demandStore =
        useMarketDemandStore
          .getState()


      visibleDemandResults.forEach(
        product => {

          demandStore.recordViewed({

            product,

            products: [
              product
            ],

            searchContext:
              searchContextRef.current,

            metadata: {

              source:
                'HomeVehicleSearch'

            }

          })

        }
      )


      console.log(
        '[MarketDemand] Viewed recorded',
        {
          count:
            visibleDemandResults.length,

          products:
            visibleDemandResults
        }
      )


    } catch (error) {

      console.error(
        '[MarketDemand] viewed tracking failed:',
        error
      )

    }

  }, [
    searched,
    loading,
    results
  ])



  // ====================================================
  // CHANGE TAB
  // ====================================================

  const changeTab =
    nextTab => {

      setTab(
        nextTab
      )

      setSearched(
        false
      )


      searchContextRef.current = {

        searchType:
          nextTab,

        searchQuery:
          ''

      }

    }



  // ====================================================
  // SEARCH RESULT TITLE
  // ====================================================

  const resultTitle = {

    vehicle:
      'المنتجات المناسبة للمركبة',

    tire:
      'الإطارات المناسبة للمقاس',

    battery:
      'البطاريات المناسبة',

    oil:
      'الزيوت المناسبة'

  }[
    tab
  ]



  // ====================================================
  // EMPTY MESSAGE
  // ====================================================

  const emptyMessage = {

    vehicle:
      'لا توجد منتجات متوافقة مع المركبة المحددة',

    tire:
      'لا توجد إطارات مطابقة للمقاس المحدد',

    battery:
      'لا توجد بطاريات مطابقة للسعة المحددة',

    oil:
      'لا توجد زيوت مطابقة للزوجة المحددة'

  }[
    tab
  ]



  // ====================================================
  // TABS
  // ====================================================

  const tabs = [

    {
      id:
        'vehicle',

      label:
        'حسب المركبة'
    },

    {
      id:
        'tire',

      label:
        'حسب مقاس الإطار'
    },

    {
      id:
        'battery',

      label:
        'حسب البطارية'
    },

    {
      id:
        'oil',

      label:
        'حسب الزيت'
    }

  ]



  // ====================================================
  // RENDER
  // ====================================================

  return (

    <section
      className="
        bg-slate-950
        py-12
        px-4
        border-y
        border-yellow-500
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >


        {/* ==================================================
            TITLE
        ================================================== */}

        <h2
          className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            text-yellow-400
          "
        >

          ابحث عن المنتج المناسب

        </h2>


        <p
          className="
            text-center
            text-gray-300
            mt-4
            mb-10
          "
        >

          اختر طريقة البحث للوصول إلى المنتج المناسب

        </p>



        {/* ==================================================
            SEARCH TABS
        ================================================== */}

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-8
          "
        >

          {
            tabs.map(
              tabItem => (

                <button
                  key={
                    tabItem.id
                  }

                  type="button"

                  onClick={() =>
                    changeTab(
                      tabItem.id
                    )
                  }

                  className={`
                    rounded-2xl
                    py-4
                    px-4
                    font-black
                    transition
                    border
                    ${
                      tab ===
                      tabItem.id

                        ? `
                          bg-yellow-500
                          text-black
                          border-yellow-400
                        `

                        : `
                          bg-slate-800
                          text-white
                          border-slate-700
                          hover:border-yellow-500
                        `
                    }
                  `}
                >

                  {
                    tabItem.label
                  }

                </button>

              )
            )
          }

        </div>



        {/* ==================================================
            SEARCH CONTAINER
        ================================================== */}

        <div
          className="
            bg-slate-900
            rounded-[30px]
            p-6
            md:p-8
            border
            border-slate-700
          "
        >


          {/* ==================================================
              VEHICLE SEARCH
          ================================================== */}

          {
            tab ===
            'vehicle' && (

              <div
                className="
                  max-w-5xl
                  mx-auto
                "
              >

                <div
                  className="
                    mb-6
                    text-center
                  "
                >

                  <div
                    className="
                      text-yellow-400
                      text-2xl
                      font-black
                    "
                  >

                    اختر المركبة

                  </div>


                  <div
                    className="
                      text-gray-400
                      mt-2
                    "
                  >

                    حدد نوع المركبة والماركة والموديل والسنة

                  </div>

                </div>


                <VehicleSearchForm

                  vehicleTypes={
                    vehicleTypes
                  }

                  brands={
                    brands
                  }

                  models={
                    models
                  }

                  years={
                    years
                  }

                  form={
                    form
                  }

                  setForm={
                    setForm
                  }

                  onSearch={() =>
                    handleSearch(
                      'vehicle'
                    )
                  }

                />

              </div>

            )
          }



          {/* ==================================================
              TIRE SEARCH
          ================================================== */}

          {
            tab ===
            'tire' && (

              <div
                className="
                  max-w-3xl
                  mx-auto
                  space-y-5
                "
              >

                <div>

                  <label
                    className="
                      block
                      text-white
                      font-black
                      text-lg
                      mb-3
                    "
                  >

                    مقاس الإطار المطلوب

                  </label>


                  <input
                    type="text"

                    value={
                      form.tireSize ||
                      ''
                    }

                    onChange={
                      e =>
                        setForm(
                          prev => ({

                            ...prev,

                            tireSize:
                              e.target.value

                          })
                        )
                    }

                    onKeyDown={
                      e => {

                        if (
                          e.key ===
                          'Enter'
                        ) {

                          handleSearch(
                            'tire'
                          )

                        }

                      }
                    }

                    placeholder="
                      مثال: 205/55/16 أو 1200/24
                    "

                    className="
                      w-full
                      p-5
                      rounded-2xl
                      bg-slate-800
                      border
                      border-slate-700
                      text-white
                      text-xl
                      font-bold
                      outline-none
                      focus:border-yellow-400
                    "
                  />

                </div>



                <div
                  className="
                    text-gray-400
                    text-sm
                    text-center
                    leading-8
                  "
                >

                  أمثلة:

                  <span
                    className="
                      text-yellow-400
                      font-bold
                      mx-1
                    "
                  >
                    205/55/16
                  </span>

                  أو

                  <span
                    className="
                      text-yellow-400
                      font-bold
                      mx-1
                    "
                  >
                    205*55*16
                  </span>

                  أو

                  <span
                    className="
                      text-yellow-400
                      font-bold
                      mx-1
                    "
                  >
                    1200/24
                  </span>

                </div>



                {
                  tireSearchError && (

                    <div
                      className="
                        bg-red-950
                        border
                        border-red-600
                        text-red-300
                        rounded-2xl
                        p-4
                        text-center
                        font-bold
                      "
                    >

                      {
                        tireSearchError
                      }

                    </div>

                  )
                }



                <button
                  type="button"

                  onClick={() =>
                    handleSearch(
                      'tire'
                    )
                  }

                  disabled={
                    loading
                  }

                  className="
                    w-full
                    rounded-2xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    disabled:opacity-50
                    text-black
                    py-5
                    font-black
                    text-xl
                    transition
                  "
                >

                  {
                    loading

                      ? 'جارٍ البحث...'

                      : '🔍 بحث عن الإطار'
                  }

                </button>

              </div>

            )
          }



          {/* ==================================================
              BATTERY SEARCH
          ================================================== */}

          {
            tab ===
            'battery' && (

              <div
                className="
                  max-w-3xl
                  mx-auto
                  space-y-5
                "
              >

                <div>

                  <label
                    className="
                      block
                      text-white
                      font-black
                      text-lg
                      mb-3
                    "
                  >

                    سعة البطارية المطلوبة

                  </label>


                  <input
                    type="text"

                    value={
                      form.capacity ||
                      ''
                    }

                    onChange={
                      e =>
                        setForm(
                          prev => ({

                            ...prev,

                            capacity:
                              e.target.value

                          })
                        )
                    }

                    onKeyDown={
                      e => {

                        if (
                          e.key ===
                          'Enter'
                        ) {

                          handleSearch(
                            'battery'
                          )

                        }

                      }
                    }

                    placeholder="
                      مثال: 70 أو 70Ah
                    "

                    className="
                      w-full
                      p-5
                      rounded-2xl
                      bg-slate-800
                      border
                      border-slate-700
                      text-white
                      text-xl
                      font-bold
                      outline-none
                      focus:border-yellow-400
                    "
                  />

                </div>



                <button
                  type="button"

                  onClick={() =>
                    handleSearch(
                      'battery'
                    )
                  }

                  disabled={
                    loading
                  }

                  className="
                    w-full
                    rounded-2xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    disabled:opacity-50
                    text-black
                    py-5
                    font-black
                    text-xl
                    transition
                  "
                >

                  {
                    loading

                      ? 'جارٍ البحث...'

                      : '🔍 بحث عن البطارية'
                  }

                </button>

              </div>

            )
          }



          {/* ==================================================
              OIL SEARCH
          ================================================== */}

          {
            tab ===
            'oil' && (

              <div
                className="
                  max-w-3xl
                  mx-auto
                  space-y-5
                "
              >

                <div>

                  <label
                    className="
                      block
                      text-white
                      font-black
                      text-lg
                      mb-3
                    "
                  >

                    لزوجة الزيت المطلوبة

                  </label>


                  <input
                    type="text"

                    value={
                      form.viscosity ||
                      ''
                    }

                    onChange={
                      e =>
                        setForm(
                          prev => ({

                            ...prev,

                            viscosity:
                              e.target.value

                          })
                        )
                    }

                    onKeyDown={
                      e => {

                        if (
                          e.key ===
                          'Enter'
                        ) {

                          handleSearch(
                            'oil'
                          )

                        }

                      }
                    }

                    placeholder="
                      مثال: 5W-30 أو 10W-40
                    "

                    className="
                      w-full
                      p-5
                      rounded-2xl
                      bg-slate-800
                      border
                      border-slate-700
                      text-white
                      text-xl
                      font-bold
                      outline-none
                      focus:border-yellow-400
                    "
                  />

                </div>



                <button
                  type="button"

                  onClick={() =>
                    handleSearch(
                      'oil'
                    )
                  }

                  disabled={
                    loading
                  }

                  className="
                    w-full
                    rounded-2xl
                    bg-yellow-500
                    hover:bg-yellow-400
                    disabled:opacity-50
                    text-black
                    py-5
                    font-black
                    text-xl
                    transition
                  "
                >

                  {
                    loading

                      ? 'جارٍ البحث...'

                      : '🔍 بحث عن الزيت'
                  }

                </button>

              </div>

            )
          }



          {/* ==================================================
              LOADING
          ================================================== */}

          {
            loading && (

              <div
                className="
                  mt-8
                  text-center
                  text-yellow-400
                  text-xl
                  font-black
                  py-6
                "
              >

                جارٍ البحث عن المنتجات المناسبة...

              </div>

            )
          }



          {/* ==================================================
              VEHICLE COMPATIBLE PRODUCTS AREA
          ================================================== */}

          {
            searched &&
            !loading &&
            tab ===
            'vehicle' && (

              <div
                className="
                  mt-10
                  pt-8
                  border-t
                  border-yellow-500/30
                "
              >

                <div
                  className="
                    mb-6
                    text-center
                  "
                >

                  <div
                    className="
                      text-yellow-400
                      text-3xl
                      font-black
                    "
                  >

                    المنتجات المتوافقة مع مركبتك

                  </div>


                  <div
                    className="
                      text-gray-400
                      mt-2
                    "
                  >

                    المنتجات التي تناسب المركبة التي قمت بتحديدها

                  </div>

                </div>



                <HomeSearchResults

                  title={
                    resultTitle
                  }

                  results={
                    Array.isArray(
                      results
                    )
                      ? results
                      : []
                  }

                  emptyMessage={
                    emptyMessage
                  }

                  onAddToCart={
                    handleAddToCart
                  }

                />

              </div>

            )
          }



          {/* ==================================================
              OTHER SEARCH RESULTS
          ================================================== */}

          {
            searched &&
            !loading &&
            tab !==
            'vehicle' && (

              <HomeSearchResults

                title={
                  resultTitle
                }

                results={
                  Array.isArray(
                    results
                  )
                    ? results
                    : []
                }

                emptyMessage={
                  emptyMessage
                }

                onAddToCart={
                  handleAddToCart
                }

              />

            )
          }


        </div>

      </div>

    </section>

  )

}