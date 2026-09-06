// ======================================================
// EL OLA ERP
// Vehicle Search Form
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Free-text vehicle search input with vehicle brand
// autocomplete suggestions.
//
// IMPORTANT
// ------------------------------------------------------
// This component does NOT perform the vehicle search.
// It only manages the search input and suggestion UI.
//
// BRAND -> MODEL AUTOCOMPLETE
// ------------------------------------------------------
// When the user hovers over a vehicle brand, the models
// belonging to that brand are loaded and displayed.
//
// ======================================================

import {
  useEffect,
  useRef,
  useState
} from 'react'


// ======================================================
// HELPERS
// ======================================================

const getDisplayName = item => {

  if (
    typeof item === 'string' ||
    typeof item === 'number'
  ) {
    return String(item).trim()
  }

  if (!item || typeof item !== 'object') {
    return ''
  }

  /*
   * Vehicle providers do not always return the same
   * property name for a model.
   *
   * Support both generic and model-specific fields.
   */
  return String(
    item.name ??
    item.modelName ??
    item.model_name ??
    item.model ??
    item.vehicleModel ??
    item.vehicleModelName ??
    item.vehicle_model ??
    item.vehicle_model_name ??
    item.brand ??
    item.make ??
    item.label ??
    item.title ??
    ''
  ).trim()
}


// ======================================================
// COMPONENT
// ======================================================

export default function VehicleSearchForm({
  form = {},
  setForm,
  onSearch,

  // ----------------------------------------------------
  // Brand autocomplete
  // ----------------------------------------------------

  brandSuggestions = [],

  suggestVehicleBrands,

  clearBrandSuggestions,

  selectVehicleBrand,

  brandsLoading = false,

  // ----------------------------------------------------
  // Model autocomplete
  // ----------------------------------------------------

  modelSuggestions = [],

  suggestVehicleModels,

  clearVehicleModelSuggestions,

  modelsLoading = false
}) {

  // ====================================================
  // STATE
  // ====================================================

  const [
    showSuggestions,
    setShowSuggestions
  ] = useState(false)

  const [
    hoveredBrandKey,
    setHoveredBrandKey
  ] = useState(null)

  /*
   * Keep the actual hovered brand object.
   *
   * This is important because form.brand is NOT changed
   * merely by hovering a suggestion.
   */
  const [
    hoveredBrand,
    setHoveredBrand
  ] = useState(null)


  // ====================================================
  // REFS
  // ====================================================

  const containerRef =
    useRef(null)

  const modelRequestTimerRef =
    useRef(null)


  // ====================================================
  // CURRENT QUERY
  // ====================================================

  const query =
    String(
      form?.vehicleQuery ??
      ''
    )


  // ====================================================
  // UPDATE QUERY
  // ====================================================

  const updateQuery = value => {

    setForm({
      ...form,

      vehicleType: '',

      brand: '',

      model: '',

      year: '',

      vehicleQuery: value
    })

    setHoveredBrandKey(null)

    setHoveredBrand(null)

    if (
      typeof clearVehicleModelSuggestions ===
      'function'
    ) {

      clearVehicleModelSuggestions()
    }

    if (
      String(value ?? '').trim()
    ) {

      setShowSuggestions(true)

    } else {

      setShowSuggestions(false)

      if (
        typeof clearBrandSuggestions ===
        'function'
      ) {

        clearBrandSuggestions()
      }
    }
  }


  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = async event => {

    const value =
      event.target.value

    updateQuery(value)

    const text =
      String(value ?? '').trim()

    if (
      text.length < 1
    ) {

      setShowSuggestions(false)

      return
    }

    if (
      typeof suggestVehicleBrands ===
      'function'
    ) {

      await suggestVehicleBrands(
        text
      )

      setShowSuggestions(true)
    }
  }


  // ====================================================
  // SELECT BRAND
  // ====================================================

  const handleSelectBrand =
    brand => {

      const brandName =
        getDisplayName(
          brand
        )

      if (!brandName) {
        return
      }

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {

        clearVehicleModelSuggestions()
      }

      setHoveredBrandKey(null)

      setHoveredBrand(null)

      if (
        typeof selectVehicleBrand ===
        'function'
      ) {

        selectVehicleBrand(
          brand
        )

      } else {

        setForm({
          ...form,

          brand:
            brandName,

          model: '',

          year: '',

          vehicleQuery:
            `${brandName} `
        })
      }

      setShowSuggestions(false)
    }


  // ====================================================
  // HOVER BRAND
  // ====================================================

  const handleBrandMouseEnter =
    async (
      brand,
      index
    ) => {

      const brandName =
        getDisplayName(
          brand
        )

      if (!brandName) {
        return
      }

      const brandKey =
        `${brandName}-${index}`

      /*
       * Store both the key and the actual brand object.
       */
      setHoveredBrandKey(
        brandKey
      )

      setHoveredBrand(
        brand
      )

      if (
        modelRequestTimerRef.current
      ) {

        clearTimeout(
          modelRequestTimerRef.current
        )
      }

      /*
       * Small delay prevents unnecessary API calls when
       * the mouse moves rapidly across several brands.
       */
      modelRequestTimerRef.current =
        setTimeout(
          async () => {

            if (
              typeof suggestVehicleModels ===
              'function'
            ) {

              await suggestVehicleModels(
                brand
              )
            }

          },
          120
        )
    }


  // ====================================================
  // LEAVE BRAND
  // ====================================================

  const handleBrandMouseLeave =
    () => {

      if (
        modelRequestTimerRef.current
      ) {

        clearTimeout(
          modelRequestTimerRef.current
        )

        modelRequestTimerRef.current =
          null
      }

      /*
       * Do NOT clear hoveredBrandKey here.
       *
       * The model panel is positioned next to the brand
       * row, so clearing the hover state here would cause
       * the panel to disappear while moving the mouse
       * toward the models.
       */
    }


  // ====================================================
  // SELECT MODEL
  // ====================================================

  const handleSelectModel =
    model => {

      const modelName =
        getDisplayName(
          model
        )

      if (!modelName) {
        return
      }

      /*
       * The hovered brand has priority because the user
       * selected this model from that brand's panel.
       *
       * form.brand may still be empty at this point.
       */
      const brandName =
        getDisplayName(
          hoveredBrand
        ) ||
        String(
          form?.brand ??
          ''
        ).trim()

      setForm({
        ...form,

        brand:
          brandName,

        model:
          modelName,

        year: '',

        vehicleQuery:
          `${brandName || query.trim()} ${modelName}`.trim()
      })

      setHoveredBrandKey(null)

      setHoveredBrand(null)

      setShowSuggestions(false)

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {

        clearVehicleModelSuggestions()
      }
    }


  // ====================================================
  // KEYBOARD NAVIGATION
  // ====================================================

  const handleKeyDown =
    event => {

      if (
        event.key === 'Escape'
      ) {

        setShowSuggestions(false)

        setHoveredBrandKey(null)

        setHoveredBrand(null)

        if (
          typeof clearBrandSuggestions ===
          'function'
        ) {

          clearBrandSuggestions()
        }

        if (
          typeof clearVehicleModelSuggestions ===
          'function'
        ) {

          clearVehicleModelSuggestions()
        }

        return
      }

      if (
        event.key === 'Enter'
      ) {

        /*
         * Enter keeps the existing search behavior.
         * We intentionally do not automatically select
         * a brand because the user may be entering a
         * complete AI query such as:
         *
         * Toyota Corolla 2021
         */

        setShowSuggestions(false)

        setHoveredBrandKey(null)

        setHoveredBrand(null)

        if (
          typeof onSearch ===
          'function'
        ) {

          onSearch()
        }
      }
    }


  // ====================================================
  // CLICK OUTSIDE
  // ====================================================

  useEffect(() => {

    const handleDocumentClick =
      event => {

        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {

          setShowSuggestions(false)

          setHoveredBrandKey(null)

          setHoveredBrand(null)
        }
      }

    document.addEventListener(
      'mousedown',
      handleDocumentClick
    )

    return () => {

      document.removeEventListener(
        'mousedown',
        handleDocumentClick
      )

      if (
        modelRequestTimerRef.current
      ) {

        clearTimeout(
          modelRequestTimerRef.current
        )

        modelRequestTimerRef.current =
          null
      }
    }

  }, [])


  // ====================================================
  // VISIBLE BRAND SUGGESTIONS
  // ====================================================

  const visibleSuggestions =
    Array.isArray(
      brandSuggestions
    )
      ? brandSuggestions
      : []


  // ====================================================
  // VISIBLE MODEL SUGGESTIONS
  // ====================================================

  const visibleModelSuggestions =
    Array.isArray(
      modelSuggestions
    )
      ? modelSuggestions
      : []


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >

      {/* ==================================================
          SEARCH INPUT
      ================================================== */}

      <div className="relative">

        <input
          type="text"

          value={query}

          onChange={handleChange}

          onKeyDown={handleKeyDown}

          onFocus={() => {

            if (
              query.trim()
            ) {

              setShowSuggestions(true)

              if (
                typeof suggestVehicleBrands ===
                'function'
              ) {

                suggestVehicleBrands(
                  query.trim()
                )
              }
            }

          }}

          placeholder="اكتب نوع السيارة أو الماركة أو الموديل أو السنة"

          autoComplete="off"

          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            text-right
            text-gray-900
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>


      {/* ==================================================
          BRAND AUTOCOMPLETE
      ================================================== */}

      {showSuggestions &&
        query.trim() &&
        (
          visibleSuggestions.length > 0 ||
          brandsLoading
        ) && (

        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            overflow-visible
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-xl
          "
          dir="ltr"
        >

          {/* ----------------------------------------------
              LOADING BRANDS
          ---------------------------------------------- */}

          {brandsLoading &&
            visibleSuggestions.length === 0 && (

            <div
              className="
                px-4
                py-3
                text-sm
                text-gray-500
                text-right
              "
              dir="rtl"
            >
              جاري تحميل ماركات السيارات...
            </div>
          )}


          {/* ----------------------------------------------
              BRAND SUGGESTIONS
          ---------------------------------------------- */}

          {visibleSuggestions.length > 0 && (

            <div className="max-h-72 overflow-y-auto">

              {visibleSuggestions.map(
                (brand, index) => {

                  const name =
                    getDisplayName(
                      brand
                    )

                  if (!name) {
                    return null
                  }

                  const brandKey =
                    `${name}-${index}`

                  const isHovered =
                    hoveredBrandKey ===
                    brandKey

                  return (
                    <div
                      key={brandKey}

                      className="
                        relative
                        border-b
                        border-gray-100
                        last:border-b-0
                      "

                      onMouseEnter={() =>
                        handleBrandMouseEnter(
                          brand,
                          index
                        )
                      }

                      onMouseLeave={
                        handleBrandMouseLeave
                      }
                    >

                      {/* --------------------------------
                          BRAND BUTTON
                      -------------------------------- */}

                      <button
                        type="button"

                        onMouseDown={event => {
                          /*
                           * Prevent input blur from closing
                           * the autocomplete before selection.
                           */
                          event.preventDefault()
                        }}

                        onClick={() =>
                          handleSelectBrand(
                            brand
                          )
                        }

                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          px-4
                          py-3
                          text-left
                          text-sm
                          text-gray-800
                          transition
                          hover:bg-gray-50
                        "
                      >

                        <span
                          className="
                            font-medium
                          "
                        >
                          {name}
                        </span>

                        <span
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-gray-400
                          "
                        >
                          <span>
                            موديلات
                          </span>

                          <span>
                            اختيار
                          </span>
                        </span>

                      </button>


                      {/* --------------------------------
                          MODEL PANEL
                      -------------------------------- */}

                      {isHovered && (

                        <div
                          className="
                            absolute
                            left-full
                            top-0
                            z-[60]
                            ml-0
                            w-64
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            shadow-xl
                          "
                          dir="ltr"
                          onMouseEnter={() => {

                            setHoveredBrandKey(
                              brandKey
                            )

                            setHoveredBrand(
                              brand
                            )
                          }}
                        >

                          {/* MODEL HEADER */}

                          <div
                            className="
                              border-b
                              border-gray-100
                              bg-gray-50
                              px-4
                              py-3
                            "
                            dir="rtl"
                          >

                            <div
                              className="
                                text-sm
                                font-semibold
                                text-gray-800
                              "
                            >
                              {name}
                            </div>

                            <div
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                            >
                              موديلات السيارة
                            </div>

                          </div>


                          {/* MODEL LOADING */}

                          {modelsLoading &&
                            visibleModelSuggestions.length === 0 && (

                            <div
                              className="
                                px-4
                                py-4
                                text-center
                                text-sm
                                text-gray-500
                              "
                              dir="rtl"
                            >
                              جاري تحميل الموديلات...
                            </div>
                          )}


                          {/* MODEL LIST */}

                          {!modelsLoading &&
                            visibleModelSuggestions.length > 0 && (

                            <div
                              className="
                                max-h-72
                                overflow-y-auto
                              "
                              dir="ltr"
                            >

                              {visibleModelSuggestions.map(
                                (
                                  model,
                                  modelIndex
                                ) => {

                                  const modelName =
                                    getDisplayName(
                                      model
                                    )

                                  if (!modelName) {
                                    return null
                                  }

                                  return (
                                    <button
                                      key={
                                        `${modelName}-${modelIndex}`
                                      }

                                      type="button"

                                      onMouseDown={event => {
                                        event.preventDefault()
                                      }}

                                      onClick={() =>
                                        handleSelectModel(
                                          model
                                        )
                                      }

                                      className="
                                        flex
                                        w-full
                                        items-center
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        text-gray-700
                                        transition
                                        hover:bg-blue-50
                                        hover:text-blue-700
                                      "
                                    >

                                      <span>
                                        {modelName}
                                      </span>

                                    </button>
                                  )
                                }
                              )}

                            </div>
                          )}


                          {/* NO MODELS */}

                          {!modelsLoading &&
                            visibleModelSuggestions.length === 0 && (

                            <div
                              className="
                                px-4
                                py-4
                                text-center
                                text-sm
                                text-gray-400
                              "
                              dir="rtl"
                            >
                              لا توجد موديلات متاحة لهذه الماركة
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  )
                }
              )}

            </div>
          )}

        </div>
      )}


      {/* ==================================================
          SEARCH BUTTON
      ================================================== */}

      <div className="mt-3 flex justify-end">

        <button
          type="button"

          onClick={() => {

            setShowSuggestions(false)

            setHoveredBrandKey(null)

            setHoveredBrand(null)

            if (
              typeof onSearch ===
              'function'
            ) {

              onSearch()
            }
          }}

          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          بحث
        </button>

      </div>

    </div>
  )
}