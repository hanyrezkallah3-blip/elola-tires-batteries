// ======================================================
// EL OLA ERP
// Market Demand Store
// ======================================================
//
// PURPOSE
// ------------------------------------------------------
// Central store for real customer market-demand behavior.
//
// EVENT FLOW
// ------------------------------------------------------
// requested
// viewed
// added_to_cart
// checkout_started
// purchased
// feedback
//
// IMPORTANT
// ------------------------------------------------------
// Analytics are calculated from demandEvents.
// Existing events are NEVER cleared by analytics logic.
//
// IMPORTANT ANALYTICS RULE
// ------------------------------------------------------
// Analytics are product-based, not event-count based.
//
// A single REQUESTED event may contain many products.
// A VIEWED event normally contains one product.
// Therefore:
//   requested = sum of requested products
//   viewed = sum of viewed products
//   addedToCart = number of product add events
//   purchased = number of purchased product events
// ======================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ======================================================
// CONSTANTS
// ======================================================

export const MARKET_DEMAND_REASONS = [
  {
    value: 'price',
    label: 'السعر أعلى مما توقعت'
  },
  {
    value: 'unavailable',
    label: 'المنتج غير متوفر'
  },
  {
    value: 'not_suitable',
    label: 'المواصفات لا تناسبني'
  },
  {
    value: 'brand',
    label: 'أريد ماركة أخرى'
  },
  {
    value: 'alternative',
    label: 'وجدت منتجًا بديلًا'
  },
  {
    value: 'later',
    label: 'سأشتري لاحقًا'
  },
  {
    value: 'other',
    label: 'سبب آخر'
  }
]

export const MARKET_DEMAND_EVENT_TYPES = {
  REQUESTED: 'requested',
  VIEWED: 'viewed',
  ADDED_TO_CART: 'added_to_cart',
  CHECKOUT_STARTED: 'checkout_started',
  PURCHASED: 'purchased',
  FEEDBACK: 'feedback'
}

const DEMAND_VERSION = 3

// ======================================================
// HELPERS
// ======================================================

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

const toArray = value => {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (value) {
    return [value]
  }

  return []
}

const normalizeText = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()

const normalizeSearchValue = value =>
  normalizeText(value)
    .replace(/\s+/g, ' ')

const getProductId = product => {
  const id =
    product?.productId ??
    product?.id ??
    product?.sku ??
    product?.barcode ??
    ''

  return String(id).trim()
}

const getProductName = product =>
  product?.name ||
  product?.productName ||
  product?.title ||
  product?.tire?.size ||
  product?.tireSize ||
  product?.battery?.capacity ||
  product?.oil?.viscosity ||
  'منتج'

const getProductSku = product =>
  product?.sku ||
  product?.SKU ||
  product?.code ||
  ''

const getProductKey = product => {
  const id = getProductId(product)

  if (id) {
    return `id:${normalizeText(id)}`
  }

  const name = getProductName(product)

  return `name:${normalizeText(name)}`
}

const getProductDisplayName = product =>
  product?.productName ||
  product?.name ||
  product?.title ||
  product?.tire?.size ||
  product?.tireSize ||
  'منتج'

const getQuantity = product => {
  const quantity = Number(
    product?.availableQuantity ??
    product?.availability?.quantity ??
    product?.quantity ??
    product?.stock ??
    0
  )

  return Number.isFinite(quantity)
    ? Math.max(0, quantity)
    : 0
}

const resolveAvailability = product => {
  if (!product) {
    return {
      available: false,
      quantity: 0
    }
  }

  const quantity = getQuantity(product)

  const available =
    product?.available === true ||
    product?.isAvailable === true ||
    product?.availability?.available === true ||
    quantity > 0

  return {
    available,
    quantity
  }
}

// ======================================================
// EVENT PRODUCT EXTRACTION
// ======================================================

const getEventProducts = event => {
  const products = toArray(
    event?.products
  )

  if (products.length > 0) {
    return products
  }

  return toArray(
    event?.product
  )
}

// ======================================================
// SEARCH CONTEXT
// ======================================================

const normalizeSearchContext = context => {
  const source = context || {}

  const vehicleType =
    source.vehicleType ||
    source.type ||
    ''

  const make =
    source.make ||
    source.brand ||
    ''

  const model =
    source.model ||
    ''

  const year =
    source.year ||
    ''

  const tireSize =
    source.tireSize ||
    source.size ||
    ''

  const capacity =
    source.capacity ||
    source.ampereHour ||
    source.ah ||
    ''

  const viscosity =
    source.viscosity ||
    source.grade ||
    ''

  const searchType =
    source.searchType ||
    source.type ||
    ''

  const searchQuery =
    source.searchQuery ??
    source.query ??
    ''

  return {
    searchType:
      String(searchType || '').trim(),

    searchQuery:
      String(searchQuery || '').trim(),

    vehicleType:
      String(vehicleType || '').trim(),

    make:
      String(make || '').trim(),

    model:
      String(model || '').trim(),

    year:
      String(year || '').trim(),

    tireSize:
      String(tireSize || '').trim(),

    capacity:
      String(capacity || '').trim(),

    viscosity:
      String(viscosity || '').trim(),

    ...source
  }
}

const mergeSearchContexts = (...contexts) => {
  const merged = {}

  contexts.forEach(context => {
    if (!context) {
      return
    }

    Object.entries(context).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ''
        ) {
          merged[key] = value
        }
      }
    )
  })

  return normalizeSearchContext(
    merged
  )
}

const hasVehicleContext = context => {
  if (!context) {
    return false
  }

  return Boolean(
    context.vehicleType ||
    context.make ||
    context.model ||
    context.year
  )
}

const buildVehicleContext = event => {
  const context =
    normalizeSearchContext(
      event?.searchContext || {}
    )

  return {
    vehicleType:
      event?.vehicleType ||
      context.vehicleType ||
      event?.type ||
      '',

    make:
      event?.make ||
      context.make ||
      '',

    model:
      event?.model ||
      context.model ||
      '',

    year:
      event?.year ||
      context.year ||
      ''
  }
}

// ======================================================
// EVENT PRODUCT COLLECTION
// ======================================================

const collectProducts = data => {
  const products = []

  const addProduct = product => {
    if (!product) {
      return
    }

    const key =
      getProductKey(product)

    if (
      products.some(
        existing =>
          getProductKey(existing) ===
          key
      )
    ) {
      return
    }

    products.push(product)
  }

  toArray(data?.products)
    .forEach(addProduct)

  toArray(data?.product)
    .forEach(addProduct)

  return products
}

// ======================================================
// EVENT CONTEXT RESOLUTION
// ======================================================

const resolveEventContext = ({
  event,
  product,
  events
}) => {
  const explicit =
    normalizeSearchContext(
      event?.searchContext || {}
    )

  if (
    explicit.searchQuery ||
    explicit.searchType ||
    hasVehicleContext(explicit)
  ) {
    return explicit
  }

  const productContext =
    normalizeSearchContext(
      product?.searchContext || {}
    )

  const eventVehicleContext =
    buildVehicleContext(event)

  if (
    Object.keys(productContext)
      .length > 0
  ) {
    return mergeSearchContexts(
      productContext,
      eventVehicleContext
    )
  }

  const orderContext =
    normalizeSearchContext(
      event?.order?.searchContext ||
      {}
    )

  if (
    Object.keys(orderContext)
      .length > 0
  ) {
    return mergeSearchContexts(
      orderContext,
      eventVehicleContext
    )
  }

  const productKey =
    getProductKey(product)

  if (
    Array.isArray(events) &&
    productKey
  ) {
    for (
      let index =
        events.length - 1;
      index >= 0;
      index -= 1
    ) {
      const previous =
        events[index]

      if (
        previous?.type !==
          MARKET_DEMAND_EVENT_TYPES.REQUESTED &&
        previous?.type !==
          MARKET_DEMAND_EVENT_TYPES.VIEWED
      ) {
        continue
      }

      const previousProducts =
        getEventProducts(previous)

      const matchingProduct =
        previousProducts.find(
          previousProduct =>
            getProductKey(
              previousProduct
            ) === productKey
        )

      if (matchingProduct) {
        return mergeSearchContexts(
          previous?.searchContext,
          matchingProduct?.searchContext
        )
      }
    }
  }

  return {}
}

// ======================================================
// PRODUCT NORMALIZATION
// ======================================================

const normalizeProduct = ({
  product,
  event,
  events
}) => {
  const availability =
    resolveAvailability(product)

  const searchContext =
    resolveEventContext({
      event,
      product,
      events
    })

  return {
    ...product,

    id:
      product?.id ??
      product?.productId ??
      getProductKey(product),

    productId:
      product?.productId ??
      product?.id ??
      null,

    name:
      getProductDisplayName(product),

    productName:
      getProductDisplayName(product),

    sku:
      getProductSku(product),

    productKey:
      getProductKey(product),

    available:
      availability.available,

    availableQuantity:
      availability.quantity,

    availability,

    searchContext
  }
}

// ======================================================
// EVENT CREATION
// ======================================================

const createDemandEvent = ({
  type,
  data,
  events
}) => {
  const products =
    collectProducts(data)

  const primaryProduct =
    products[0] || null

  const rawContext =
    data?.searchContext ||
    primaryProduct?.searchContext ||
    {}

  const searchContext =
    normalizeSearchContext(
      rawContext
    )

  const searchType =
    String(
      data?.searchType ??
      searchContext.searchType ??
      ''
    ).trim()

  const searchQuery =
    String(
      data?.query ??
      data?.searchQuery ??
      searchContext.searchQuery ??
      ''
    ).trim()

  const normalizedProducts =
    products.map(product =>
      normalizeProduct({
        product,
        event: {
          ...data,
          searchContext,
          searchType,
          searchQuery,
          type
        },
        events
      })
    )

  const primary =
    normalizedProducts[0] ||
    null

  const vehicleContext =
    buildVehicleContext({
      ...data,
      searchContext,
      type
    })

  return {
    id:
      data?.id ||
      generateId(),

    type,

    createdAt:
      data?.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    sessionId:
      data?.sessionId ||
      data?.metadata?.sessionId ||
      null,

    userId:
      data?.userId ||
      data?.metadata?.userId ||
      null,

    searchType,

    searchQuery,

    query:
      searchQuery,

    searchContext,

    vehicleType:
      data?.vehicleType ||
      vehicleContext.vehicleType ||
      '',

    make:
      data?.make ||
      vehicleContext.make ||
      '',

    model:
      data?.model ||
      vehicleContext.model ||
      '',

    modelFromSearch:
      data?.modelFromSearch ||
      vehicleContext.model ||
      '',

    year:
      data?.year ||
      vehicleContext.year ||
      '',

    availability:
      data?.availability ||
      primary?.availability ||
      null,

    products:
      normalizedProducts,

    product:
      primary,

    reason:
      data?.reason ||
      null,

    note:
      data?.note ||
      '',

    feedback:
      data?.feedback ||
      null,

    orderId:
      data?.orderId ||
      data?.order?.id ||
      null,

    metadata:
      data?.metadata ||
      {}
  }
}

// ======================================================
// DATE FILTER
// ======================================================

const filterEventsByRange = (
  events,
  range
) => {
  const list =
    Array.isArray(events)
      ? events
      : []

  if (
    !range ||
    range === 'all'
  ) {
    return list
  }

  const days =
    Number(range)

  if (
    !Number.isFinite(days) ||
    days <= 0
  ) {
    return list
  }

  const cutoff =
    Date.now() -
    days *
      24 *
      60 *
      60 *
      1000

  return list.filter(event => {
    const timestamp =
      new Date(
        event?.createdAt ||
        event?.updatedAt ||
        0
      ).getTime()

    return (
      Number.isFinite(timestamp) &&
      timestamp >= cutoff
    )
  })
}

// ======================================================
// PRODUCT ANALYTICS
// ======================================================

const buildProductAnalytics = events => {
  const productMap = new Map()

  const ensureProduct = (
    product,
    event
  ) => {
    const normalized =
      normalizeProduct({
        product,
        event,
        events
      })

    const key =
      normalized.productKey

    if (!productMap.has(key)) {
      productMap.set(key, {
        productKey: key,

        productId:
          normalized.productId,

        productName:
          normalized.productName,

        name:
          normalized.name,

        sku:
          normalized.sku,

        requested: 0,

        viewed: 0,

        addedToCart: 0,

        checkoutStarted: 0,

        purchased: 0,

        notPurchased: 0,

        availableRequests: 0,

        unavailableRequests: 0,

        feedbackCount: 0,

        reasons: {},

        vehicleContexts: []
      })
    }

    return productMap.get(key)
  }

  events.forEach(event => {
    const eventProducts =
      getEventProducts(event)

    eventProducts.forEach(
      product => {
        const item =
          ensureProduct(
            product,
            event
          )

        switch (event?.type) {
          case MARKET_DEMAND_EVENT_TYPES.REQUESTED:
            item.requested += 1
            break

          case MARKET_DEMAND_EVENT_TYPES.VIEWED:
            item.viewed += 1
            break

          case MARKET_DEMAND_EVENT_TYPES.ADDED_TO_CART:
            item.addedToCart += 1
            break

          case MARKET_DEMAND_EVENT_TYPES.CHECKOUT_STARTED:
            item.checkoutStarted += 1
            break

          case MARKET_DEMAND_EVENT_TYPES.PURCHASED:
            item.purchased += 1
            break

          case MARKET_DEMAND_EVENT_TYPES.FEEDBACK:
            item.feedbackCount += 1
            break

          default:
            break
        }

        const availability =
          resolveAvailability(product)

        if (
          availability.available
        ) {
          item.availableRequests += 1
        } else {
          item.unavailableRequests += 1
        }

        const context =
          resolveEventContext({
            event,
            product,
            events
          })

        if (
          hasVehicleContext(
            context
          )
        ) {
          const vehicleKey = [
            context.vehicleType,
            context.make,
            context.model,
            context.year
          ]
            .map(normalizeSearchValue)
            .join('|')

          if (
            !item.vehicleContexts.some(
              existing =>
                existing.key ===
                vehicleKey
            )
          ) {
            item.vehicleContexts.push({
              key: vehicleKey,

              vehicleType:
                context.vehicleType ||
                '',

              make:
                context.make ||
                '',

              model:
                context.model ||
                '',

              year:
                context.year ||
                '',

              searchQuery:
                context.searchQuery ||
                ''
            })
          }
        }

        if (
          event?.type ===
            MARKET_DEMAND_EVENT_TYPES.FEEDBACK &&
          event?.reason
        ) {
          item.reasons[
            event.reason
          ] =
            (
              item.reasons[
                event.reason
              ] || 0
            ) + 1
        }
      }
    )
  })

  return Array.from(
    productMap.values()
  )
    .map(item => {
      item.notPurchased =
        Math.max(
          0,
          item.requested -
            item.purchased
        )

      item.cartConversion =
        item.requested > 0
          ? Number(
              (
                item.addedToCart *
                100 /
                item.requested
              ).toFixed(2)
            )
          : 0

      item.purchaseConversion =
        item.requested > 0
          ? Number(
              (
                item.purchased *
                100 /
                item.requested
              ).toFixed(2)
            )
          : 0

      item.purchaseFromCart =
        item.addedToCart > 0
          ? Number(
              (
                item.purchased *
                100 /
                item.addedToCart
              ).toFixed(2)
            )
          : 0

      item.availabilityLossRate =
        item.requested > 0
          ? Number(
              (
                item.unavailableRequests *
                100 /
                item.requested
              ).toFixed(2)
            )
          : 0

      item.topReason =
        Object.entries(
          item.reasons
        )
          .sort(
            (a, b) =>
              b[1] -
              a[1]
          )[0]?.[0] ||
        null

      return item
    })
    .sort(
      (a, b) =>
        b.requested -
        a.requested
    )
}

// ======================================================
// REASON ANALYTICS
// ======================================================

const buildReasonAnalytics = events => {
  const reasonMap = new Map()

  events.forEach(event => {
    if (
      event?.type !==
      MARKET_DEMAND_EVENT_TYPES.FEEDBACK
    ) {
      return
    }

    const reason =
      event?.reason ||
      event?.feedback?.reason

    if (!reason) {
      return
    }

    if (!reasonMap.has(reason)) {
      reasonMap.set(reason, {
        reason,

        label:
          MARKET_DEMAND_REASONS.find(
            item =>
              item.value ===
              reason
          )?.label ||
          reason,

        count: 0,

        products: []
      })
    }

    const row =
      reasonMap.get(reason)

    row.count += 1

    const products =
      collectProducts(event)

    products.forEach(product => {
      const normalized =
        normalizeProduct({
          product,
          event,
          events
        })

      const productId =
        normalized.productId ||
        normalized.productKey

      const existing =
        row.products.find(
          item =>
            String(
              item.productId
            ) ===
            String(productId)
        )

      if (existing) {
        existing.count += 1
        return
      }

      row.products.push({
        productId,

        productName:
          normalized.productName,

        name:
          normalized.name,

        sku:
          normalized.sku,

        count: 1
      })
    })
  })

  return Array.from(
    reasonMap.values()
  )
    .map(row => ({
      ...row,

      products:
        row.products.sort(
          (a, b) =>
            b.count -
            a.count
        )
    }))
    .sort(
      (a, b) =>
        b.count -
        a.count
    )
}

// ======================================================
// VEHICLE ANALYTICS
// ======================================================

const buildVehicleAnalytics = events => {
  const vehicleMap = new Map()

  events.forEach(event => {
    const context =
      mergeSearchContexts(
        event?.searchContext,
        buildVehicleContext(event)
      )

    const hasVehicle =
      hasVehicleContext(
        context
      )

    if (!hasVehicle) {
      return
    }

    const vehicleKey = [
      context.vehicleType,
      context.make,
      context.model,
      context.year
    ]
      .map(normalizeSearchValue)
      .join('|')

    if (!vehicleMap.has(vehicleKey)) {
      vehicleMap.set(vehicleKey, {
        key: vehicleKey,

        vehicle:
          [
            context.make,
            context.model,
            context.year
          ]
            .filter(Boolean)
            .join(' ') ||
          'مركبة',

        vehicleType:
          context.vehicleType ||
          'car',

        make:
          context.make ||
          '',

        model:
          context.model ||
          '',

        year:
          context.year ||
          '',

        requested: 0,

        viewed: 0,

        addedToCart: 0,

        checkoutStarted: 0,

        purchased: 0
      })
    }

    const row =
      vehicleMap.get(
        vehicleKey
      )

    const eventProducts =
      getEventProducts(event)

    const productCount =
      eventProducts.length

    switch (event?.type) {
      case MARKET_DEMAND_EVENT_TYPES.REQUESTED:
        row.requested +=
          productCount
        break

      case MARKET_DEMAND_EVENT_TYPES.VIEWED:
        row.viewed +=
          productCount
        break

      case MARKET_DEMAND_EVENT_TYPES.ADDED_TO_CART:
        row.addedToCart +=
          Math.max(
            1,
            productCount
          )
        break

      case MARKET_DEMAND_EVENT_TYPES.CHECKOUT_STARTED:
        row.checkoutStarted +=
          Math.max(
            1,
            productCount
          )
        break

      case MARKET_DEMAND_EVENT_TYPES.PURCHASED:
        row.purchased +=
          Math.max(
            1,
            productCount
          )
        break

      default:
        break
    }
  })

  return Array.from(
    vehicleMap.values()
  )
    .map(row => ({
      ...row,

      notPurchased:
        Math.max(
          0,
          row.requested -
            row.purchased
        )
    }))
    .sort(
      (a, b) =>
        b.requested -
        a.requested
    )
}

// ======================================================
// MAIN ANALYTICS BUILDER
// ======================================================

const buildAnalytics = events => {
  const safeEvents =
    Array.isArray(events)
      ? events
      : []

  const requestedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.REQUESTED
    )

  const viewedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.VIEWED
    )

  const addedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.ADDED_TO_CART
    )

  const checkoutEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.CHECKOUT_STARTED
    )

  const purchasedEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.PURCHASED
    )

  const feedbackEvents =
    safeEvents.filter(
      event =>
        event?.type ===
        MARKET_DEMAND_EVENT_TYPES.FEEDBACK
    )

  // ----------------------------------------------------
  // PRODUCT ANALYTICS
  // ----------------------------------------------------

  const products =
    buildProductAnalytics(
      safeEvents
    )

  // ----------------------------------------------------
  // PRODUCT-BASED FUNNEL
  // ----------------------------------------------------
  //
  // REQUESTED:
  // Sum unique products inside requested events.
  //
  // VIEWED:
  // Sum products inside viewed events.
  //
  // ADDED TO CART:
  // One event normally represents one product.
  //
  // PURCHASED:
  // One event normally represents one purchased product.
  // ----------------------------------------------------

  const requested =
    requestedEvents.reduce(
      (total, event) =>
        total +
        getEventProducts(event).length,
      0
    )

  const viewed =
    viewedEvents.reduce(
      (total, event) =>
        total +
        getEventProducts(event).length,
      0
    )

  const addedToCart =
    addedEvents.reduce(
      (total, event) =>
        total +
        Math.max(
          1,
          getEventProducts(event)
            .length
        ),
      0
    )

  const checkoutStarted =
    checkoutEvents.reduce(
      (total, event) =>
        total +
        Math.max(
          1,
          getEventProducts(event)
            .length
        ),
      0
    )

  const purchased =
    purchasedEvents.reduce(
      (total, event) =>
        total +
        Math.max(
          1,
          getEventProducts(event)
            .length
        ),
      0
    )

  // ----------------------------------------------------
  // NOT PURCHASED
  // ----------------------------------------------------
  //
  // We use visible products as the funnel opportunity:
  //
  // viewed - purchased
  //
  // This is different from product-level
  // notPurchased, which is:
  //
  // requested - purchased
  // ----------------------------------------------------

  const notPurchased =
    Math.max(
      0,
      viewed -
        purchased
    )

  // ----------------------------------------------------
  // AVAILABILITY
  // ----------------------------------------------------

  let unavailable = 0

  requestedEvents.forEach(
    event => {
      const products =
        getEventProducts(event)

      if (
        products.length === 0
      ) {
        if (
          event?.availability &&
          event.availability.available ===
            false
        ) {
          unavailable += 1
        }

        return
      }

      products.forEach(product => {
        const availability =
          resolveAvailability(
            product
          )

        if (
          !availability.available
        ) {
          unavailable += 1
        }
      })
    }
  )

  // ----------------------------------------------------
  // REASONS
  // ----------------------------------------------------

  const reasonRows =
    buildReasonAnalytics(
      safeEvents
    )

  // ----------------------------------------------------
  // VEHICLES
  // ----------------------------------------------------

  const vehicleAnalytics =
    buildVehicleAnalytics(
      safeEvents
    )

  // ----------------------------------------------------
  // SUPPLY OPPORTUNITIES
  // ----------------------------------------------------

  const supplyOpportunities =
    products
      .filter(
        item =>
          item.requested >
          item.purchased
      )
      .map(item => ({
        ...item,

        opportunityScore:
          item.notPurchased +
          item.unavailableRequests *
            2
      }))
      .sort(
        (a, b) =>
          b.opportunityScore -
          a.opportunityScore
      )

  // ----------------------------------------------------
  // TOP REQUESTED
  // ----------------------------------------------------

  const topRequestedProducts =
    [...products]
      .sort(
        (a, b) =>
          b.requested -
          a.requested
      )
      .slice(0, 20)

  // ----------------------------------------------------
  // TOP PURCHASED
  // ----------------------------------------------------

  const topPurchasedProducts =
    [...products]
      .sort(
        (a, b) =>
          b.purchased -
          a.purchased ||
          b.requested -
          a.requested
      )
      .slice(0, 20)

  // ----------------------------------------------------
  // TOP NOT PURCHASED
  // ----------------------------------------------------

  const topNotPurchasedProducts =
    products
      .filter(
        item =>
          item.notPurchased >
          0
      )
      .sort(
        (a, b) =>
          b.notPurchased -
            a.notPurchased ||
          b.requested -
            a.requested
      )
      .slice(0, 20)

  // ----------------------------------------------------
  // CONVERSIONS
  // ----------------------------------------------------

  const addToCartRate =
    viewed > 0
      ? Number(
          (
            addedToCart *
            100 /
            viewed
          ).toFixed(2)
        )
      : 0

  const purchaseConversion =
    viewed > 0
      ? Number(
          (
            purchased *
            100 /
            viewed
          ).toFixed(2)
        )
      : 0

  const purchaseFromViewed =
    viewed > 0
      ? Number(
          (
            purchased *
            100 /
            viewed
          ).toFixed(2)
        )
      : 0

  const availabilityLossRate =
    requested > 0
      ? Number(
          (
            unavailable *
            100 /
            requested
          ).toFixed(2)
        )
      : 0

  return {
    // --------------------------------------------------
    // RAW EVENT TOTALS
    // --------------------------------------------------

    totalRequests:
      requested,

    totalViewed:
      viewed,

    totalAddedToCart:
      addedToCart,

    totalCheckoutStarted:
      checkoutStarted,

    totalPurchased:
      purchased,

    totalFeedback:
      feedbackEvents.length,

    totalEvents:
      safeEvents.length,

    // --------------------------------------------------
    // DASHBOARD ALIASES
    // --------------------------------------------------

    requested,

    viewed,

    addedToCart,

    checkoutStarted,

    purchased,

    notPurchased,

    unavailable,

    feedbackCount:
      feedbackEvents.length,

    // --------------------------------------------------
    // CONVERSION
    // --------------------------------------------------

    addToCartRate,

    purchaseConversion,

    purchaseFromViewed,

    availabilityLossRate,

    // --------------------------------------------------
    // COLLECTIONS
    // --------------------------------------------------

    products,

    topRequestedProducts,

    topPurchasedProducts,

    topNotPurchasedProducts,

    supplyOpportunities,

    reasonRows,

    vehicleAnalytics
  }
}

// ======================================================
// STORE
// ======================================================

export const useMarketDemandStore =
  create(
    persist(
      (set, get) => ({
        // ------------------------------------------------
        // STATE
        // ------------------------------------------------

        demandVersion:
          DEMAND_VERSION,

        demandEvents: [],

        // ------------------------------------------------
        // INTERNAL EVENT APPENDER
        // ------------------------------------------------

        addDemandEvent: data => {
          const currentEvents =
            get().demandEvents || []

          const event =
            createDemandEvent({
              ...data,
              events:
                currentEvents
            })

          set({
            demandEvents: [
              ...currentEvents,
              event
            ]
          })

          return event
        },

        // ------------------------------------------------
        // REQUEST
        // ------------------------------------------------

        recordRequest: data => {
          const event =
            get().addDemandEvent({
              type:
                MARKET_DEMAND_EVENT_TYPES.REQUESTED,

              data
            })

          console.log(
            '[MarketDemand] Request recorded:',
            event?.products?.length ||
              1
          )

          return event
        },

        // ------------------------------------------------
        // VIEWED
        // ------------------------------------------------

        recordViewed: data => {
          const event =
            get().addDemandEvent({
              type:
                MARKET_DEMAND_EVENT_TYPES.VIEWED,

              data
            })

          console.log(
            '[MarketDemand] Viewed recorded:',
            event?.products?.length ||
              1
          )

          return event
        },

        // ------------------------------------------------
        // ADD TO CART
        // ------------------------------------------------

        recordAddedToCart:
          data => {
            const event =
              get().addDemandEvent({
                type:
                  MARKET_DEMAND_EVENT_TYPES.ADDED_TO_CART,

                data
              })

            console.log(
              '[MarketDemand] Added to cart recorded:',
              event
            )

            return event
          },

        // ------------------------------------------------
        // CHECKOUT
        // ------------------------------------------------

        recordCheckoutStarted:
          data => {
            const event =
              get().addDemandEvent({
                type:
                  MARKET_DEMAND_EVENT_TYPES.CHECKOUT_STARTED,

                data
              })

            console.log(
              '[MarketDemand] Checkout started recorded:',
              event
            )

            return event
          },

        // ------------------------------------------------
        // PURCHASE
        // ------------------------------------------------

        recordPurchase:
          data => {
            const event =
              get().addDemandEvent({
                type:
                  MARKET_DEMAND_EVENT_TYPES.PURCHASED,

                data
              })

            console.log(
              '[MarketDemand] Purchase recorded:',
              event
            )

            return event
          },

        // ------------------------------------------------
        // FEEDBACK
        // ------------------------------------------------

        recordFeedback:
          ({
            product,
            products,
            reason,
            note = '',
            searchContext,
            searchType,
            searchQuery,
            query,
            metadata = {},
            ...rest
          } = {}) => {
            const event =
              get().addDemandEvent({
                type:
                  MARKET_DEMAND_EVENT_TYPES.FEEDBACK,

                data: {
                  product,
                  products,

                  reason,

                  note,

                  searchContext,

                  searchType,

                  searchQuery,

                  query,

                  metadata,

                  feedback: {
                    reason,
                    note
                  },

                  ...rest
                }
              })

            console.log(
              '[MarketDemand] Feedback recorded:',
              event?.products?.length ||
                1
            )

            return event
          },

        // ------------------------------------------------
        // GENERIC SEARCH RESULTS
        // ------------------------------------------------

        recordSearchResults:
          ({
            results = [],
            searchType = '',
            searchQuery = '',
            query = '',
            searchContext = {},
            metadata = {}
          } = {}) => {
            if (
              !Array.isArray(
                results
              ) ||
              results.length === 0
            ) {
              return []
            }

            return results.map(
              product =>
                get().recordViewed({
                  product,

                  searchType,

                  searchQuery:
                    searchQuery ||
                    query,

                  query:
                    searchQuery ||
                    query,

                  searchContext,

                  metadata
                })
            )
          },

        // ------------------------------------------------
        // OLD API COMPATIBILITY
        // ------------------------------------------------

        markAddedToCart:
          product =>
            get().recordAddedToCart({
              product
            }),

        markPurchased:
          product =>
            get().recordPurchase({
              product
            }),

        // ------------------------------------------------
        // ANALYTICS
        // ------------------------------------------------

        getAnalytics: () =>
          buildAnalytics(
            get().demandEvents
          ),

        getSummary: () => {
          const analytics =
            buildAnalytics(
              get().demandEvents
            )

          return {
            totalOrders:
              analytics.totalRequests,

            totalRequested:
              analytics.totalRequests,

            totalViewed:
              analytics.totalViewed,

            totalAddedToCart:
              analytics.totalAddedToCart,

            totalPurchased:
              analytics.totalPurchased,

            notPurchased:
              analytics.notPurchased,

            unavailable:
              analytics.unavailable,

            totalEvents:
              analytics.totalEvents,

            purchaseConversion:
              analytics.purchaseConversion,

            addToCartRate:
              analytics.addToCartRate,

            availabilityLossRate:
              analytics.availabilityLossRate
          }
        },

        // ------------------------------------------------
        // PRODUCT ANALYTICS
        // ------------------------------------------------

        getProductAnalytics:
          () =>
            buildProductAnalytics(
              get().demandEvents
            ),

        // ------------------------------------------------
        // TOP REQUESTED
        // ------------------------------------------------

        getTopRequestedProducts:
          limit => {
            const products =
              buildProductAnalytics(
                get().demandEvents
              )

            return products
              .sort(
                (a, b) =>
                  b.requested -
                  a.requested
              )
              .slice(
                0,
                Number(limit) || 20
              )
          },

        // ------------------------------------------------
        // TOP PURCHASED
        // ------------------------------------------------

        getTopPurchasedProducts:
          limit => {
            const products =
              buildProductAnalytics(
                get().demandEvents
              )

            return products
              .sort(
                (a, b) =>
                  b.purchased -
                    a.purchased ||
                  b.requested -
                    a.requested
              )
              .slice(
                0,
                Number(limit) || 20
              )
          },

        // ------------------------------------------------
        // TOP NOT PURCHASED
        // ------------------------------------------------

        getTopNotPurchasedProducts:
          limit => {
            const products =
              buildProductAnalytics(
                get().demandEvents
              )

            return products
              .filter(
                item =>
                  item.notPurchased >
                  0
              )
              .sort(
                (a, b) =>
                  b.notPurchased -
                    a.notPurchased ||
                  b.requested -
                    a.requested
              )
              .slice(
                0,
                Number(limit) || 20
              )
          },

        // ------------------------------------------------
        // SUPPLY OPPORTUNITIES
        // ------------------------------------------------

        getSupplyOpportunities:
          limit => {
            const products =
              buildProductAnalytics(
                get().demandEvents
              )

            return products
              .filter(
                item =>
                  item.requested >
                  item.purchased
              )
              .map(item => ({
                ...item,

                opportunityScore:
                  item.notPurchased +
                  item.unavailableRequests *
                    2
              }))
              .sort(
                (a, b) =>
                  b.opportunityScore -
                  a.opportunityScore
              )
              .slice(
                0,
                Number(limit) || 20
              )
          },

        // ------------------------------------------------
        // REASONS
        // ------------------------------------------------

        getReasonAnalytics:
          () =>
            buildReasonAnalytics(
              get().demandEvents
            ),

        // ------------------------------------------------
        // VEHICLES
        // ------------------------------------------------

        getVehicleAnalytics:
          () =>
            buildVehicleAnalytics(
              get().demandEvents
            ),

        // ------------------------------------------------
        // DATE RANGE
        // ------------------------------------------------

        getDateRangeAnalytics:
          range => {
            const events =
              filterEventsByRange(
                get().demandEvents,
                range
              )

            return buildAnalytics(
              events
            )
          },

        // ------------------------------------------------
        // CLEAR
        // ------------------------------------------------
        //
        // Explicit administrative action only.
        // Analytics fixes NEVER call this.
        // ------------------------------------------------

        clearDemandEvents:
          () => {
            set({
              demandEvents: []
            })
          },

        clearRequests:
          () => {
            set({
              demandEvents: []
            })
          }
      }),

      {
        name:
          'elola-market-demand-v1',

        partialize:
          state => ({
            demandEvents:
              state.demandEvents,

            demandVersion:
              state.demandVersion
          }),

        onRehydrateStorage:
          () =>
          state => {
            if (!state) {
              return
            }

            if (
              !Array.isArray(
                state.demandEvents
              )
            ) {
              state.demandEvents = []
            }

            if (
              !state.demandVersion
            ) {
              state.demandVersion =
                DEMAND_VERSION
            }
          }
      }
    )
  )

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default useMarketDemandStore