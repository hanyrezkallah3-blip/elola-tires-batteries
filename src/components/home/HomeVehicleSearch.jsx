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

    // ==================================================
    // VEHICLE AUTOCOMPLETE
    // ==================================================

    brandSuggestions,
    suggestVehicleBrands,
    clearBrandSuggestions,
    selectVehicleBrand,
    brandsLoading,

    // ==================================================
    // VEHICLE MODEL AUTOCOMPLETE
    // ==================================================

    modelSuggestions,
    suggestVehicleModels,
    clearVehicleModelSuggestions,
    modelsLoading,

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
  // FIRST NON EMPTY
  // ====================================================

  const firstNonEmpty =
    (...values) => {

      for (
        const value of values
      ) {

        if (
          value === null ||
          value === undefined
        ) {
          continue
        }


        if (
          typeof value === 'number'
        ) {

          if (
            Number.isFinite(
              value
            )
          ) {
            return value
          }

          continue

        }


        const normalized =
          String(
            value
          ).trim()


        if (
          normalized
        ) {
          return normalized
        }

      }


      return ''

    }



  // ====================================================
  // READ VEHICLE VALUE FROM SEARCH RESPONSE
  // ====================================================
  //
  // The AI/VehicleEngine response can expose vehicle
  // information through different layers.
  //
  // We intentionally check aliases instead of guessing
  // the vehicle type from the text query.
  //
  // ====================================================

  const resolveVehicleContextFromResponse =
    response => {

      if (
        !response ||
        typeof response !== 'object'
      ) {

        return {}

      }


      const candidates = [

        response,

        response.vehicle,

        response.vehicleData,

        response.vehicleInfo,

        response.vehicleContext,

        response.searchContext,

        response.resolvedVehicle,

        response.parsedVehicle,

        response.aiResponse,

        response.aiResponse?.vehicle,

        response.aiResponse?.vehicleData,

        response.aiResponse?.vehicleInfo,

        response.aiResponse?.vehicleContext,

        response.aiResponse?.searchContext,

        response.result,

        response.result?.vehicle,

        response.result?.vehicleData,

        response.result?.vehicleInfo,

        response.result?.vehicleContext,

        response.result?.searchContext

      ]
        .filter(
          value =>
            value &&
            typeof value === 'object'
        )


      let vehicleType = ''
      let make = ''
      let model = ''
      let year = ''


      for (
        const candidate of candidates
      ) {

        vehicleType =
          firstNonEmpty(

            vehicleType,

            candidate.vehicleType,

            candidate.vehicle_type,

            candidate.type,

            candidate.vehicleTypeName,

            candidate.vehicle_type_name

          )


        make =
          firstNonEmpty(

            make,

            candidate.make,

            candidate.brand,

            candidate.manufacturer,

            candidate.vehicleMake

          )


        model =
          firstNonEmpty(

            model,

            candidate.model,

            candidate.vehicleModel,

            candidate.modelName

          )


        year =
          firstNonEmpty(

            year,

            candidate.year,

            candidate.modelYear,

            candidate.vehicleYear

          )

      }


      return {

        vehicleType,

        make,

        model,

        year

      }

    }



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

      let searchResults = []


      let response = null


      try {

        response =
          await search(
            searchTab
          )


        // ------------------------------------------------
        // IMPORTANT:
        //
        // If search() returns an Array, that Array is the
        // authoritative result of THIS search.
        //
        // An empty Array is a valid result and MUST NOT
        // be replaced with the previous `results` state.
        //
        // This prevents stale products from a previous
        // search being recorded as Market Demand for the
        // current search.
        // ------------------------------------------------

        if (
          Array.isArray(response)
        ) {

          searchResults =
            normalizeSearchResults(
              response
            )

        } else {

          searchResults =
            normalizeSearchResults(
              response
            )


          // ------------------------------------------------
          // FALLBACK:
          //
          // Only use the existing `results` state when the
          // search function did not return an Array at all.
          //
          // This preserves compatibility with versions of
          // the hook that update `results` instead of
          // returning the array directly.
          // ------------------------------------------------

          if (
            searchResults.length === 0 &&
            !response &&
            Array.isArray(results)
          ) {

            searchResults =
              normalizeSearchResults(
                results
              )

          }

        }


      } catch (error) {

        console.error(
          '[MarketDemand] search failed:',
          error
        )

        return

      }



      // ==================================================
      // RESOLVE AUTHORITATIVE SEARCH CONTEXT
      // ==================================================
      //
      // For vehicle searches, the form is not necessarily
      // the final authoritative vehicle context.
      //
      // The AI/VehicleEngine can resolve:
      //
      // - vehicleType
      // - make
      // - model
      // - year
      //
      // from the actual search.
      //
      // We preserve the form values and only replace them
      // when the authoritative response contains a value.
      //
      // IMPORTANT:
      // We NEVER invent a vehicle type from the query.
      //
      // ==================================================

      if (
        searchTab === 'vehicle'
      ) {

        const resolvedVehicle =
          resolveVehicleContextFromResponse(
            response
          )


        const currentContext =
          searchContextRef.current || {}


        const resolvedVehicleType =
          firstNonEmpty(

            resolvedVehicle.vehicleType,

            currentContext.vehicleType

          )


        const resolvedMake =
          firstNonEmpty(

            resolvedVehicle.make,

            currentContext.make

          )


        const resolvedModel =
          firstNonEmpty(

            resolvedVehicle.model,

            currentContext.model

          )


        const resolvedYear =
          firstNonEmpty(

            resolvedVehicle.year,

            currentContext.year

          )


        const realVehicleQuery =
          typeof response?.query === 'string'
            ? response.query.trim()
            : ''


        searchContextRef.current = {

          ...currentContext,

          searchType:
            'vehicle',

          searchQuery:
            realVehicleQuery ||
            currentContext.searchQuery ||
            '',

          vehicleType:
            resolvedVehicleType,

          make:
            resolvedMake,

          model:
            resolvedModel,

          year:
            resolvedYear

        }


        console.log(
          '[MarketDemand] Vehicle search context resolved',
          {
            searchQuery:
              searchContextRef.current.searchQuery,

            vehicleType:
              searchContextRef.current.vehicleType,

            make:
              searchContextRef.current.make,

            model:
              searchContextRef.current.model,

            year:
              searchContextRef.current.year,

            searchContext:
              searchContextRef.current,

            responseVehicleContext:
              resolvedVehicle

          }
        )

      }



      // ------------------------------------------------
      // MARKET DEMAND: REQUEST
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

              searchType:
                searchContextRef.current.searchType,

              searchContext:
                searchContextRef.current,

              products:
                searchResults

            }
          )

        } else {

          console.log(
            '[MarketDemand] Search returned no products',
            {
              query:
                searchContextRef.current.searchQuery,

              searchType:
                searchContextRef.current.searchType,

              searchContext:
                searchContextRef.current
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
            visibleDemandResults,

          searchContext:
            searchContextRef.current

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


      // ------------------------------------------------
      // Clear vehicle brand autocomplete
      // ------------------------------------------------

      if (
        typeof clearBrandSuggestions ===
        'function'
      ) {

        clearBrandSuggestions()
      }


      // ------------------------------------------------
      // Clear vehicle model autocomplete
      // ------------------------------------------------

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {

        clearVehicleModelSuggestions()
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

                    ابدأ بكتابة الماركة أو الموديل أو السنة

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

                  // ==================================================
                  // VEHICLE BRAND AUTOCOMPLETE
                  // ==================================================

                  brandSuggestions={
                    brandSuggestions
                  }

                  suggestVehicleBrands={
                    suggestVehicleBrands
                  }

                  clearBrandSuggestions={
                    clearBrandSuggestions
                  }

                  selectVehicleBrand={
                    selectVehicleBrand
                  }

                  brandsLoading={
                    brandsLoading
                  }

                  // ==================================================
                  // VEHICLE MODEL AUTOCOMPLETE
                  // ==================================================

                  modelSuggestions={
                    modelSuggestions
                  }

                  suggestVehicleModels={
                    suggestVehicleModels
                  }

                  clearVehicleModelSuggestions={
                    clearVehicleModelSuggestions
                  }

                  modelsLoading={
                    modelsLoading
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