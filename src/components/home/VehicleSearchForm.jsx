// ======================================================
// EL OLA ERP
// Vehicle Search Form
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Free-text vehicle search input with multilingual
// vehicle brand/model autocomplete suggestions.
//
// IMPORTANT
// ------------------------------------------------------
// This component does NOT perform the vehicle search.
// It only manages the search input and suggestion UI.
//
// BRAND -> MODEL AUTOCOMPLETE
// ------------------------------------------------------
// The autocomplete is intentionally UI-driven:
//
// - First character => show brand suggestions.
// - Arabic / English => supported.
// - Select brand => show model suggestions.
// - Hover brand => show its models.
// - Select model => populate the vehicle query.
// - Year input => stop autocomplete suggestions.
//
// MODEL AUTOCOMPLETE PROTECTION
// ------------------------------------------------------
// Model requests are guarded so that:
//
// 1. The same brand/query is not requested repeatedly.
// 2. Mouse movement between brands does not create a
//    request storm.
// 3. Focus does not trigger another model request.
// 4. Selecting a brand loads its models once.
// 5. After selecting a brand, models are displayed
//    directly below the search input.
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

const cleanText = value =>
  String(value ?? '')
    .trim()


// ======================================================
// NORMALIZE SEARCH TEXT
// ======================================================

const normalizeText = value => {

  return cleanText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
}


// ======================================================
// GET CANONICAL NAME
// ======================================================

const getCanonicalName = item => {

  if (
    typeof item === 'string' ||
    typeof item === 'number'
  ) {
    return cleanText(item)
  }

  if (
    !item ||
    typeof item !== 'object'
  ) {
    return ''
  }

  return cleanText(
    item.canonicalName ??
    item.canonical_name ??
    item.standardName ??
    item.standard_name ??
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
    item.value ??
    ''
  )
}


// ======================================================
// GET DISPLAY NAME
// ======================================================

const getDisplayName = item => {

  if (
    typeof item === 'string' ||
    typeof item === 'number'
  ) {
    return cleanText(item)
  }

  if (
    !item ||
    typeof item !== 'object'
  ) {
    return ''
  }

  return cleanText(
    item.displayName ??
    item.display_name ??
    item.localizedName ??
    item.localized_name ??
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
    item.value ??
    ''
  )
}


// ======================================================
// GET LOCALIZED NAMES
// ======================================================

const getLocalizedNames = item => {

  if (
    !item ||
    typeof item !== 'object'
  ) {
    return []
  }

  const values = [

    item.nameAr,
    item.nameAR,
    item.arabicName,
    item.arabic_name,
    item.labelAr,
    item.labelAR,
    item.titleAr,
    item.titleAR,

    item.nameEn,
    item.nameEN,
    item.englishName,
    item.english_name,
    item.labelEn,
    item.labelEN,
    item.titleEn,
    item.titleEN,

    item.nameFr,
    item.nameDe,
    item.nameEs,
    item.nameIt,
    item.nameTr,
    item.nameRu,
    item.nameZh,
    item.nameJa,
    item.nameKo,

    item.localizedName,
    item.localized_name,

    item.name,
    item.modelName,
    item.model_name,
    item.brand,
    item.make
  ]

  return [
    ...new Set(
      values
        .map(cleanText)
        .filter(Boolean)
    )
  ]
}


// ======================================================
// GET SEARCH ALIASES
// ======================================================

const getSearchAliases = item => {

  if (
    typeof item === 'string' ||
    typeof item === 'number'
  ) {
    return [
      cleanText(item)
    ].filter(Boolean)
  }

  if (
    !item ||
    typeof item !== 'object'
  ) {
    return []
  }

  const aliases = [

    item.alias,
    item.aliases,

    item.nameAr,
    item.nameAR,
    item.arabicName,
    item.arabic_name,

    item.nameEn,
    item.nameEN,
    item.englishName,
    item.english_name,

    item.labelAr,
    item.labelAR,

    item.labelEn,
    item.labelEN,

    item.titleAr,
    item.titleAR,

    item.titleEn,
    item.titleEN,

    item.localizedName,
    item.localized_name,

    item.name,
    item.modelName,
    item.model_name,
    item.model,
    item.brand,
    item.make
  ]

  const flattened = []

  aliases.forEach(value => {

    if (Array.isArray(value)) {

      value.forEach(alias => {

        const normalized =
          cleanText(alias)

        if (normalized) {
          flattened.push(normalized)
        }
      })

      return
    }

    const normalized =
      cleanText(value)

    if (normalized) {
      flattened.push(normalized)
    }
  })

  return [
    ...new Set(flattened)
  ]
}


// ======================================================
// DISPLAY LABEL
// ======================================================

const getDisplayLabel = item => {

  if (
    !item ||
    typeof item !== 'object'
  ) {
    return getDisplayName(item)
  }

  const localizedNames =
    getLocalizedNames(item)

  const canonical =
    getCanonicalName(item)

  const uniqueNames = [
    ...new Set(
      [
        ...localizedNames,
        canonical
      ]
        .map(cleanText)
        .filter(Boolean)
    )
  ]

  if (
    uniqueNames.length <= 1
  ) {
    return uniqueNames[0] || ''
  }

  return uniqueNames.join(' / ')
}


// ======================================================
// MATCH QUERY
// ======================================================

const matchesQuery = (
  item,
  query
) => {

  const normalizedQuery =
    normalizeText(query)

  if (!normalizedQuery) {
    return true
  }

  const aliases =
    getSearchAliases(item)

  return aliases.some(alias => {

    const normalizedAlias =
      normalizeText(alias)

    return (
      normalizedAlias.includes(
        normalizedQuery
      ) ||
      normalizedQuery.includes(
        normalizedAlias
      )
    )
  })
}


// ======================================================
// CHECK WHETHER QUERY LOOKS LIKE A YEAR
// ======================================================

const isYearQuery = value => {

  const text =
    cleanText(value)

  return (
    /^\d{1,4}$/.test(text) &&
    text.length >= 1
  )
}


// ======================================================
// EXTRACT MODEL QUERY
// ======================================================
//
// Examples:
//
// Toyota c
// => c
//
// Toyota co
// => co
//
// هيونداي ال
// => ال
//
// Hyundai Elantra 2021
// => Elantra 2021
//
// ======================================================

const getModelQuery = (
  value,
  brand
) => {

  const text =
    cleanText(value)

  if (!text) {
    return ''
  }

  const brandName =
    cleanText(brand)

  if (!brandName) {
    return text
  }

  const normalizedText =
    normalizeText(text)

  const normalizedBrand =
    normalizeText(brandName)

  // ----------------------------------------------------
  // Exact canonical-brand prefix
  // ----------------------------------------------------

  if (
    normalizedBrand &&
    (
      normalizedText === normalizedBrand ||
      normalizedText.startsWith(
        `${normalizedBrand} `
      )
    )
  ) {

    const originalTokens =
      text.split(/\s+/)

    const brandTokens =
      brandName.split(/\s+/)

    if (
      originalTokens.length >
      brandTokens.length
    ) {

      return originalTokens
        .slice(brandTokens.length)
        .join(' ')
        .trim()
    }

    return ''
  }


  // ----------------------------------------------------
  // Arabic / English alias case
  // ----------------------------------------------------

  const tokens =
    text.split(/\s+/)

  if (
    tokens.length > 1
  ) {

    return tokens
      .slice(1)
      .join(' ')
      .trim()
  }

  return ''
}


// ======================================================
// COMPONENT
// ======================================================

export default function VehicleSearchForm({
  form = {},
  setForm,
  onSearch,

  brandSuggestions = [],
  suggestVehicleBrands,
  clearBrandSuggestions,
  selectVehicleBrand,
  brandsLoading = false,

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

  const [
    hoveredBrand,
    setHoveredBrand
  ] = useState(null)

  const [
    modelPanelPosition,
    setModelPanelPosition
  ] = useState(null)


  // ====================================================
  // REFS
  // ====================================================

  const containerRef =
    useRef(null)

  const modelRequestTimerRef =
    useRef(null)

  const modelAutocompleteTimerRef =
    useRef(null)

  // ----------------------------------------------------
  // NEW:
  // Keep the last model request identity.
  //
  // This prevents repeated requests for exactly the same
  // brand + query combination.
  // ----------------------------------------------------

  const lastModelRequestKeyRef =
    useRef('')

  // ----------------------------------------------------
  // NEW:
  // Keep the currently scheduled request identity.
  // ----------------------------------------------------

  const scheduledModelRequestKeyRef =
    useRef('')

  // ----------------------------------------------------
  // NEW:
  // Prevent duplicate hover requests.
  // ----------------------------------------------------

  const lastHoverBrandKeyRef =
    useRef('')


  // ====================================================
  // CURRENT QUERY
  // ====================================================

  const query =
    String(
      form?.vehicleQuery ?? ''
    )


  // ====================================================
  // CURRENT VEHICLE STATE
  // ====================================================

  const selectedBrand =
    cleanText(
      form?.brand
    )

  const selectedModel =
    cleanText(
      form?.model
    )


  // ====================================================
  // MODEL QUERY
  // ====================================================

  const modelQuery =
    getModelQuery(
      query,
      selectedBrand
    )


  // ====================================================
  // CLEAR MODEL REQUEST STATE
  // ====================================================

  const resetModelRequestState = () => {

    lastModelRequestKeyRef.current =
      ''

    scheduledModelRequestKeyRef.current =
      ''

    lastHoverBrandKeyRef.current =
      ''

    if (
      modelRequestTimerRef.current
    ) {

      clearTimeout(
        modelRequestTimerRef.current
      )

      modelRequestTimerRef.current =
        null
    }

    if (
      modelAutocompleteTimerRef.current
    ) {

      clearTimeout(
        modelAutocompleteTimerRef.current
      )

      modelAutocompleteTimerRef.current =
        null
    }
  }


  // ====================================================
  // REQUEST MODELS
  // ====================================================
  //
  // Centralized model-request function.
  //
  // All model autocomplete requests go through this
  // function so we can guarantee that the same request
  // is not fired repeatedly.
  //
  // ====================================================

  const requestModels = (
    brand,
    modelQueryValue = '',
    options = {}
  ) => {

    if (
      typeof suggestVehicleModels !==
      'function'
    ) {
      return
    }

    const brandName =
      getCanonicalName(
        brand
      )

    if (!brandName) {
      return
    }

    const normalizedBrand =
      normalizeText(
        brandName
      )

    const normalizedQuery =
      normalizeText(
        modelQueryValue
      )

    const requestKey =
      `${normalizedBrand}::${normalizedQuery}`

    // --------------------------------------------------
    // Duplicate protection
    // --------------------------------------------------

    if (
      !options.force &&
      (
        requestKey ===
        lastModelRequestKeyRef.current
      )
    ) {
      return
    }

    if (
      !options.force &&
      (
        requestKey ===
        scheduledModelRequestKeyRef.current
      )
    ) {
      return
    }

    // --------------------------------------------------
    // Cancel previous scheduled request
    // --------------------------------------------------

    if (
      modelAutocompleteTimerRef.current
    ) {

      clearTimeout(
        modelAutocompleteTimerRef.current
      )

      modelAutocompleteTimerRef.current =
        null
    }

    scheduledModelRequestKeyRef.current =
      requestKey

    const delay =
      options.immediate
        ? 0
        : 120

    modelAutocompleteTimerRef.current =
      setTimeout(() => {

        scheduledModelRequestKeyRef.current =
          ''

        lastModelRequestKeyRef.current =
          requestKey

        Promise
          .resolve(
            suggestVehicleModels(
              brandName,
              cleanText(
                modelQueryValue
              )
            )
          )
          .catch(error => {

            console.warn(
              '[VehicleSearchForm] Model autocomplete failed:',
              error
            )

          })
          .finally(() => {

            modelAutocompleteTimerRef.current =
              null
          })

      }, delay)
  }


  // ====================================================
  // QUERY UPDATE
  // ====================================================

  const updateQuery = value => {

    const text =
      cleanText(value)

    const currentBrand =
      cleanText(
        form?.brand
      )

    const currentModel =
      cleanText(
        form?.model
      )

    let nextBrand = ''
    let nextModel = ''
    let nextYear = ''

    // --------------------------------------------------
    // No selected brand
    // --------------------------------------------------

    if (!currentBrand) {

      nextBrand = ''
      nextModel = ''
    }

    // --------------------------------------------------
    // Selected brand exists
    // --------------------------------------------------

    else {

      const extractedModelQuery =
        getModelQuery(
          text,
          currentBrand
        )

      nextBrand =
        currentBrand

      
      const yearMatch =
        text.match(
          /(?:^|\s)((?:19|20)\d{2})\s*$/
        )

      if (
        currentModel &&
        yearMatch
      ) {
        nextModel =
          currentModel
        nextYear =
          yearMatch[1]
      } else if (
        currentModel &&
        normalizeText(
          extractedModelQuery
        ).startsWith(
          normalizeText(
            currentModel
          )
        )
      ) {

        nextModel =
          currentModel

      } else {

        nextModel = ''
      }
    }


    // --------------------------------------------------
    // Empty query
    // --------------------------------------------------

    if (!text) {

      nextBrand = ''
      nextModel = ''
      nextYear = ''
    }


    setForm({
      ...form,

      vehicleType: '',
      brand: nextBrand,
      model: nextModel,
      year: nextYear,
      vehicleQuery: value
    })

    setHoveredBrandKey(null)
    setHoveredBrand(null)
    setModelPanelPosition(null)


    // --------------------------------------------------
    // Empty query clears model suggestions.
    // --------------------------------------------------

    if (!text) {

      resetModelRequestState()

      setShowSuggestions(false)

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
    }
  }


  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = event => {

    const value =
      event.target.value

    const text =
      cleanText(value)

    const currentBrand =
      cleanText(
        form?.brand
      )

    const currentModel =
      cleanText(
        form?.model
      )

    updateQuery(value)

    if (!text) {
      return
    }


    // --------------------------------------------------
    // MODEL ALREADY SELECTED
    // --------------------------------------------------

    if (
      currentBrand &&
      currentModel
    ) {

      setShowSuggestions(false)

      return
    }


    // --------------------------------------------------
    // BRAND PHASE
    // --------------------------------------------------

    if (!currentBrand) {

      setShowSuggestions(true)

      if (
        typeof suggestVehicleBrands ===
        'function'
      ) {

        Promise
          .resolve(
            suggestVehicleBrands(
              text
            )
          )
          .catch(error => {

            console.warn(
              '[VehicleSearchForm] Brand autocomplete failed:',
              error
            )

          })
      }

      return
    }


    // --------------------------------------------------
    // MODEL PHASE
    // --------------------------------------------------

    const nextModelQuery =
      getModelQuery(
        text,
        currentBrand
      )


    // --------------------------------------------------
    // Year => stop autocomplete
    // --------------------------------------------------

    if (
      isYearQuery(
        nextModelQuery
      )
    ) {

      setShowSuggestions(false)

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {
        clearVehicleModelSuggestions()
      }

      return
    }


    setShowSuggestions(true)

    requestModels(
      currentBrand,
      nextModelQuery
    )
  }


  // ====================================================
  // SELECT BRAND
  // ====================================================

  const handleSelectBrand =
    brand => {

      const brandName =
        getCanonicalName(
          brand
        )

      if (!brandName) {
        return
      }


      // ------------------------------------------------
      // Clear old model state before loading the new
      // brand's models.
      // ------------------------------------------------

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {
        clearVehicleModelSuggestions()
      }

      lastModelRequestKeyRef.current =
        ''

      scheduledModelRequestKeyRef.current =
        ''

      lastHoverBrandKeyRef.current =
        ''


      setHoveredBrandKey(null)
      setHoveredBrand(null)
      setModelPanelPosition(null)


      // ------------------------------------------------
      // Update selected brand.
      // ------------------------------------------------

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

          vehicleType: '',
          brand: brandName,
          model: '',
          year: '',
          vehicleQuery:
            `${brandName} `
        })
      }


      // ------------------------------------------------
      // Keep suggestions open.
      // ------------------------------------------------

      setShowSuggestions(true)


      // ------------------------------------------------
      // IMPORTANT:
      // Request models exactly once for the selected
      // canonical brand.
      // ------------------------------------------------

      requestModels(
        brandName,
        '',
        {
          immediate: true,
          force: true
        }
      )
    }


  // ====================================================
  // HOVER BRAND
  // ====================================================

  const handleBrandMouseEnter =
    (
      brand,
      index,
      event
    ) => {

      const brandName =
        getCanonicalName(
          brand
        )

      if (!brandName) {
        return
      }

      const brandKey =
        `${normalizeText(
          brandName
        )}-${index}`


      // ------------------------------------------------
      // If this is already the hovered brand, do not
      // request its models again.
      // ------------------------------------------------

      if (
        lastHoverBrandKeyRef.current ===
        brandKey
      ) {

        setHoveredBrand(
          brand
        )

        return
      }


      lastHoverBrandKeyRef.current =
        brandKey


      const rect =
        event.currentTarget
          .getBoundingClientRect()

      const panelWidth = 288
      const gap = 8
      const viewportPadding = 8

      const preferredLeft =
        rect.left -
        panelWidth -
        gap

      const safeLeft =
        Math.max(
          viewportPadding,
          preferredLeft
        )

      const safeTop =
        Math.max(
          viewportPadding,
          Math.min(
            rect.top,
            window.innerHeight - 420
          )
        )


      setModelPanelPosition({
        top:
          safeTop,

        left:
          safeLeft
      })

      setHoveredBrandKey(
        brandKey
      )

      setHoveredBrand(
        brand
      )


      // ------------------------------------------------
      // Cancel previous hover request.
      // ------------------------------------------------

      if (
        modelRequestTimerRef.current
      ) {

        clearTimeout(
          modelRequestTimerRef.current
        )

        modelRequestTimerRef.current =
          null
      }


      // ------------------------------------------------
      // Request through centralized guarded function.
      // ------------------------------------------------

      modelRequestTimerRef.current =
        setTimeout(() => {

          requestModels(
            brandName,
            '',
            {
              immediate: true
            }
          )

          modelRequestTimerRef.current =
            null

        }, 80)
    }


  // ====================================================
  // LEAVE BRAND
  // ====================================================

  const handleBrandMouseLeave = () => {

    if (
      modelRequestTimerRef.current
    ) {

      clearTimeout(
        modelRequestTimerRef.current
      )

      modelRequestTimerRef.current =
        null
    }

    // Do not clear hoveredBrand here.
    //
    // The floating panel needs a chance to receive
    // mouse-enter when the pointer moves from the brand
    // to the panel.
  }


  // ====================================================
  // MODEL PANEL ENTER
  // ====================================================

  const handleModelPanelMouseEnter =
    () => {

      if (hoveredBrand) {

        setHoveredBrandKey(
          current =>
            current ||
            getCanonicalName(
              hoveredBrand
            )
        )
      }
    }


  // ====================================================
  // MODEL PANEL LEAVE
  // ====================================================

  const handleModelPanelMouseLeave =
    () => {

      setHoveredBrandKey(null)
      setHoveredBrand(null)
      setModelPanelPosition(null)

      lastHoverBrandKeyRef.current =
        ''

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {
        clearVehicleModelSuggestions()
      }
    }


  // ====================================================
  // SELECT MODEL
  // ====================================================

  const handleSelectModel =
    model => {

      const modelName =
        getCanonicalName(
          model
        )

      if (!modelName) {
        return
      }

      const brandName =
        cleanText(
          form?.brand
        ) ||
        getCanonicalName(
          hoveredBrand
        )


      setForm({
        ...form,

        vehicleType: '',
        brand: brandName,
        model: modelName,
        year: '',

        vehicleQuery:
          `${brandName || query.trim()} ${modelName}`
            .trim()
      })


      setHoveredBrandKey(null)
      setHoveredBrand(null)
      setModelPanelPosition(null)
      setShowSuggestions(false)

      lastHoverBrandKeyRef.current =
        ''

      lastModelRequestKeyRef.current =
        ''

      scheduledModelRequestKeyRef.current =
        ''

      if (
        typeof clearVehicleModelSuggestions ===
        'function'
      ) {
        clearVehicleModelSuggestions()
      }
    }


  // ====================================================
  // KEYBOARD
  // ====================================================

  const handleKeyDown =
    event => {

      if (
        event.key === 'Escape'
      ) {

        setShowSuggestions(false)
        setHoveredBrandKey(null)
        setHoveredBrand(null)
        setModelPanelPosition(null)

        resetModelRequestState()

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

        setShowSuggestions(false)
        setHoveredBrandKey(null)
        setHoveredBrand(null)
        setModelPanelPosition(null)

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
          setModelPanelPosition(null)

          lastHoverBrandKeyRef.current =
            ''
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
      }

      if (
        modelAutocompleteTimerRef.current
      ) {

        clearTimeout(
          modelAutocompleteTimerRef.current
        )
      }
    }

  }, [])


  // ====================================================
  // VISIBLE BRAND SUGGESTIONS
  // ====================================================

  const visibleSuggestions =
    !selectedBrand &&
    Array.isArray(brandSuggestions)
      ? brandSuggestions
          .filter(item =>
            getCanonicalName(item)
          )
          .filter(item =>
            matchesQuery(
              item,
              query
            )
          )
          .slice(0, 12)
      : []


  // ====================================================
  // VISIBLE MODEL SUGGESTIONS
  // ====================================================

  const visibleModelSuggestions =
    Array.isArray(modelSuggestions)
      ? [
          ...new Map(
            modelSuggestions
              .filter(item =>
                getCanonicalName(item)
              )
              .map(item => [
                normalizeText(
                  getCanonicalName(
                    item
                  )
                ),
                item
              ])
          ).values()
        ].slice(0, 30)
      : []


  // ====================================================
  // SHOW SELECTED-BRAND MODEL DROPDOWN
  // ====================================================
  //
  // This is the important UI fix.
  //
  // Previously the model list depended entirely on
  // hoveredBrand + modelPanelPosition.
  //
  // After selecting a brand, those values are cleared,
  // so the loaded models had nowhere to render.
  //
  // Now the selected brand gets its own dropdown.
  //
  // ====================================================

  const showSelectedBrandModels =
    Boolean(
      selectedBrand &&
      !selectedModel &&
      showSuggestions &&
      query.trim()
    )


  // ====================================================
  // DEBUG
  // ====================================================

  useEffect(() => {

    if (
      query.trim()
    ) {

      console.log(
        '[VehicleSearchForm] AUTOCOMPLETE STATE:',
        {
          query,
          selectedBrand,
          selectedModel,
          modelQuery,
          phase:
            selectedBrand
              ? (
                selectedModel
                  ? 'YEAR / SEARCH'
                  : 'MODEL'
              )
              : 'BRAND',

          brandSuggestions:
            visibleSuggestions.length,

          modelSuggestions:
            visibleModelSuggestions.length,

          modelsLoading,

          showSelectedBrandModels,

          hoveredBrand:
            getCanonicalName(
              hoveredBrand
            ) || null
        }
      )
    }

  }, [
    query,
    selectedBrand,
    selectedModel,
    modelQuery,
    visibleSuggestions.length,
    visibleModelSuggestions.length,
    brandsLoading,
    modelsLoading,
    showSelectedBrandModels,
    hoveredBrand
  ])


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      ref={containerRef}
      className="
        relative
        w-full
        rounded-3xl
        bg-white
        p-5
        md:p-6
        shadow-xl
      "
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

            const text =
              cleanText(query)

            if (!text) {
              return
            }


            // --------------------------------------------
            // Brand + model already selected.
            // --------------------------------------------

            if (
              selectedBrand &&
              selectedModel
            ) {

              setShowSuggestions(false)

              return
            }


            setShowSuggestions(true)


            // --------------------------------------------
            // BRAND PHASE
            // --------------------------------------------

            if (!selectedBrand) {

              if (
                typeof suggestVehicleBrands ===
                'function'
              ) {

                Promise
                  .resolve(
                    suggestVehicleBrands(
                      text
                    )
                  )
                  .catch(error => {

                    console.warn(
                      '[VehicleSearchForm] Brand autocomplete failed:',
                      error
                    )

                  })
              }

              return
            }


            // --------------------------------------------
            // MODEL PHASE
            // --------------------------------------------

            const nextModelQuery =
              getModelQuery(
                text,
                selectedBrand
              )


            if (
              isYearQuery(
                nextModelQuery
              )
            ) {

              setShowSuggestions(false)

              if (
                typeof clearVehicleModelSuggestions ===
                'function'
              ) {
                clearVehicleModelSuggestions()
              }

              return
            }

            // ------------------------------------------------
            // IMPORTANT:
            // Do NOT request models here.
            //
            // Requests are driven only by:
            // - model input change
            // - brand selection
            // - brand hover
            // ------------------------------------------------
          }}

          placeholder="اكتب نوع السيارة أو الماركة أو الموديل أو السنة"

          autoComplete="off"

          dir="auto"

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
            placeholder-gray-400
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

      {!selectedBrand &&
        showSuggestions &&
        query.trim() && (

        <div
          className="
            absolute
            left-5
            right-5
            top-[calc(100%-1.25rem)]
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
              LOADING
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
              BRANDS
          ---------------------------------------------- */}

          {visibleSuggestions.length > 0 && (

            <div
              className="
                max-h-72
                overflow-y-auto
                overflow-x-hidden
              "
            >

              {visibleSuggestions.map(
                (brand, index) => {

                  const canonicalName =
                    getCanonicalName(
                      brand
                    )

                  const displayName =
                    getDisplayLabel(
                      brand
                    )

                  const brandKey =
                    `${canonicalName}-${index}`

                  return (
                    <div
                      key={brandKey}

                      className="
                        border-b
                        border-gray-100
                        last:border-b-0
                      "

                      onMouseEnter={event =>
                        handleBrandMouseEnter(
                          brand,
                          index,
                          event
                        )
                      }

                      onMouseLeave={
                        handleBrandMouseLeave
                      }
                    >

                      <button
                        type="button"

                        onMouseDown={event =>
                          event.preventDefault()
                        }

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
                          gap-4
                          px-4
                          py-3
                          text-left
                          text-sm
                          text-gray-800
                          transition
                          hover:bg-gray-50
                        "
                      >

                        <span className="font-medium">
                          {displayName}
                        </span>

                        <span
                          className="
                            shrink-0
                            text-xs
                            text-gray-400
                          "
                        >
                          موديلات
                        </span>

                      </button>

                    </div>
                  )
                }
              )}

            </div>
          )}


          {/* ----------------------------------------------
              EMPTY RESULT
          ---------------------------------------------- */}

          {!brandsLoading &&
            visibleSuggestions.length === 0 && (

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
              لا توجد ماركات مطابقة
            </div>
          )}

        </div>
      )}


      {/* ==================================================
          SELECTED BRAND MODEL DROPDOWN
      ================================================== */}

      {showSelectedBrandModels && (

        <div
          className="
            absolute
            left-5
            right-5
            top-[calc(100%-1.25rem)]
            z-50
            mt-2
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-xl
          "
          dir="ltr"
        >

          {/* ----------------------------------------------
              HEADER
          ---------------------------------------------- */}

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
              {selectedBrand}
            </div>

            <div
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >
              اختر موديل السيارة
            </div>

          </div>


          {/* ----------------------------------------------
              LOADING
          ---------------------------------------------- */}

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


          {/* ----------------------------------------------
              MODELS
          ---------------------------------------------- */}

          {visibleModelSuggestions.length > 0 && (

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

                  const canonicalName =
                    getCanonicalName(
                      model
                    )

                  const displayName =
                    getDisplayLabel(
                      model
                    )

                  return (
                    <button
                      key={
                        `${normalizeText(
                          canonicalName
                        )}-${modelIndex}`
                      }

                      type="button"

                      onMouseDown={event =>
                        event.preventDefault()
                      }

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
                        {displayName}
                      </span>

                    </button>
                  )
                }
              )}

            </div>
          )}


          {/* ----------------------------------------------
              EMPTY
          ---------------------------------------------- */}

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


      {/* ==================================================
          FLOATING MODEL PANEL
      ================================================== */}

      {hoveredBrandKey &&
        hoveredBrand &&
        modelPanelPosition &&
        showSuggestions && (

        <div
          className="
            fixed
            z-[9999]
            w-72
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-2xl
          "

          style={{
            top:
              `${modelPanelPosition.top}px`,

            left:
              `${modelPanelPosition.left}px`
          }}

          dir="ltr"

          onMouseEnter={
            handleModelPanelMouseEnter
          }

          onMouseLeave={
            handleModelPanelMouseLeave
          }
        >

          {/* HEADER */}

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
              {getDisplayLabel(
                hoveredBrand
              )}
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


          {/* LOADING */}

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


          {/* MODELS */}

          {visibleModelSuggestions.length > 0 && (

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

                  const canonicalName =
                    getCanonicalName(
                      model
                    )

                  const displayName =
                    getDisplayLabel(
                      model
                    )

                  return (
                    <button
                      key={
                        `hover-${normalizeText(
                          canonicalName
                        )}-${modelIndex}`
                      }

                      type="button"

                      onMouseDown={event =>
                        event.preventDefault()
                      }

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
                        {displayName}
                      </span>

                    </button>
                  )
                }
              )}

            </div>
          )}


          {/* EMPTY */}

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
            setModelPanelPosition(null)

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
          "
        >
          بحث
        </button>

      </div>

    </div>
  )
}