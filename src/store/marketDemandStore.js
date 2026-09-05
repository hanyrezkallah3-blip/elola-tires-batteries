// ======================================================
// EL OLA ERP
// Market Demand Store
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Records and analyzes real consumer demand.
//
// IMPORTANT
// ------------------------------------------------------
// Market Demand is separate from:
// - Product Master
// - Inventory
// - Vehicle compatibility
//
// Compatibility is determined elsewhere.
// This store only records what the customer requested,
// viewed, added, purchased, abandoned, or reported.
//
// PRODUCT ATTRIBUTION
// ------------------------------------------------------
// Every product event is normalized from:
// - product
// - products[]
// - order.items
//
// This prevents "منتج غير محدد" when callers provide
// a products array.
//
// VEHICLE CONTEXT
// ------------------------------------------------------
// Vehicle context is stored with every event.
//
// Priority:
// 1. Explicit event searchContext.
// 2. Product searchContext.
// 3. Product vehicleSearchContext.
// 4. Order searchContext.
// 5. Order vehicleSearchContext.
// 6. Order vehicle fields.
// 7. Previous event from the same product/session.
//
// IMPORTANT FIX
// ------------------------------------------------------
// Vehicle context sources are MERGED field-by-field.
// Empty values from a lower-priority source are never
// allowed to overwrite valid vehicle information.
//
// Existing persisted demand events are preserved.
//
// ======================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'


// ======================================================
// NORMALIZE TEXT
// ======================================================

const normalizeText = value => {

  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
}


// ======================================================
// FIRST NON-EMPTY VALUE
// ======================================================

const firstValue = (...values) => {

  for (
    const value of values
  ) {

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {

      return value
    }
  }

  return ''
}


// ======================================================
// NORMALIZE PRODUCT
// ======================================================

const normalizeProduct = product => {

  if (!product) {
    return null
  }

  const id =
    product.id ??
    product.productId ??
    product.sku ??
    product.code ??
    null

  const name =
    product.name ??
    product.productName ??
    product.title ??
    product.description ??
    ''

  const brand =
    product.brand ??
    product.brandName ??
    ''

  const category =
    product.category ??
    product.type ??
    product.productType ??
    ''

  const price =
    product.offerPrice ??
    product.salePrice ??
    product.price ??
    0

  const quantity =
    product.quantity ??
    product.availableQuantity ??
    product.stock ??
    0

  const available =
    typeof product.isAvailable === 'boolean'
      ? product.isAvailable
      : typeof product.available === 'boolean'
        ? product.available
        : Number(quantity) > 0

  return {
    ...product,

    id,

    productId:
      product.productId ??
      product.id ??
      id,

    name:
      name || 'منتج',

    productName:
      product.productName ??
      name ??
      'منتج',

    brand,

    category,

    price,

    quantity,

    available,

    isAvailable:
      typeof product.isAvailable === 'boolean'
        ? product.isAvailable
        : available
  }
}


// ======================================================
// PRODUCT KEY
// ======================================================

const getProductKey = product => {

  if (!product) {
    return ''
  }

  const id =
    product.id ??
    product.productId ??
    product.sku ??
    product.code

  if (
    id !== null &&
    id !== undefined &&
    String(id).trim() !== ''
  ) {
    return String(id)
  }

  const name =
    product.name ??
    product.productName ??
    product.title ??
    ''

  return normalizeText(
    name
  )
}


// ======================================================
// PRODUCT COLLECTION
// ======================================================
//
// IMPORTANT FIX
// ------------------------------------------------------
// Some callers provide the same product in both:
//
//   products: [product]
//   product: product
//
// Previously both references were added, which caused
// duplicate events such as:
//
//   viewed → 2
//
// for a single product.
//
// We now add the explicit `product` only when it is not
// already represented inside `products[]`.
//
// This is intentionally limited to the duplicate
// product/product-array case and does NOT deduplicate
// legitimate repeated order items.
//
// ======================================================

const collectProducts = ({
  product,
  products,
  order
} = {}) => {

  const output = []

  if (
    Array.isArray(products)
  ) {

    output.push(
      ...products
    )
  }

  if (
    product
  ) {

    const productKey =
      getProductKey(
        product
      )

    const alreadyIncluded =
      productKey &&
      output.some(
        item =>
          getProductKey(
            item
          ) === productKey
      )

    if (
      !alreadyIncluded
    ) {

      output.push(
        product
      )
    }
  }

  if (
    output.length === 0 &&
    Array.isArray(order?.items)
  ) {

    output.push(
      ...order.items
    )
  }

  return output
    .filter(Boolean)
    .map(
      normalizeProduct
    )
    .filter(Boolean)
}


// ======================================================
// SEARCH CONTEXT
// ======================================================

const normalizeSearchContext = (
  searchContext = {}
) => {

  const context =
    searchContext || {}

  return {
    searchType:
      context.searchType ??
      '',

    searchQuery:
      context.searchQuery ??
      context.query ??
      '',

    vehicleType:
      context.vehicleType ??
      context.type ??
      '',

    make:
      context.make ??
      '',

    model:
      context.model ??
      context.modelFromSearch ??
      '',

    modelFromSearch:
      context.modelFromSearch ??
      context.model ??
      '',

    year:
      context.year ??
      '',

    tireSize:
      context.tireSize ??
      '',

    capacity:
      context.capacity ??
      '',

    viscosity:
      context.viscosity ??
      '',

    ...context
  }
}


// ======================================================
// MERGE SEARCH CONTEXTS
// ======================================================
//
// IMPORTANT
// ------------------------------------------------------
// Merges contexts field-by-field.
// A blank value from one source cannot erase a valid
// value from another source.
//
// Priority is from LEFT to RIGHT.
// The RIGHTMOST non-empty value wins.
//
// ======================================================

const mergeSearchContexts = (
  ...contexts
) => {

  const normalizedContexts =
    contexts
      .filter(Boolean)
      .map(
        normalizeSearchContext
      )


  const merged = {}


  for (
    const context
    of normalizedContexts
  ) {

    Object.entries(
      context
    )
      .forEach(
        ([key, value]) => {

          if (
            value === undefined ||
            value === null
          ) {
            return
          }

          if (
            typeof value === 'string' &&
            value.trim() === ''
          ) {
            return
          }

          if (
            Array.isArray(value) &&
            value.length === 0
          ) {
            return
          }

          merged[key] = value
        }
      )
  }


  return normalizeSearchContext(
    merged
  )
}


// ======================================================
// VEHICLE CONTEXT CHECK
// ======================================================

const hasVehicleContext = context => {

  if (!context) {
    return false
  }

  return Boolean(
    String(
      context.vehicleType ??
      ''
    ).trim() ||

    String(
      context.make ??
      ''
    ).trim() ||

    String(
      context.modelFromSearch ??
      context.model ??
      ''
    ).trim() ||

    String(
      context.year ??
      ''
    ).trim()
  )
}


// ======================================================
// VEHICLE CONTEXT
// ======================================================

const buildVehicleContext = context => {

  const normalized =
    normalizeSearchContext(
      context
    )

  return {

    vehicleType:
      normalized.vehicleType ??
      '',

    make:
      normalized.make ??
      '',

    model:
      firstValue(
        normalized.modelFromSearch,
        normalized.model
      ),

    modelFromSearch:
      firstValue(
        normalized.modelFromSearch,
        normalized.model
      ),

    year:
      normalized.year ??
      ''
  }
}


// ======================================================
// AVAILABILITY
// ======================================================

const resolveAvailability = (
  product,
  explicitAvailability
) => {

  if (
    typeof explicitAvailability === 'boolean'
  ) {
    return explicitAvailability
  }

  if (
    typeof explicitAvailability === 'string'
  ) {

    const value =
      normalizeText(
        explicitAvailability
      )

    if (
      [
        'available',
        'متوفر',
        'true',
        'yes'
      ].includes(value)
    ) {
      return true
    }

    if (
      [
        'unavailable',
        'غير متوفر',
        'false',
        'no'
      ].includes(value)
    ) {
      return false
    }
  }

  if (!product) {
    return false
  }

  if (
    typeof product.isAvailable === 'boolean'
  ) {
    return product.isAvailable
  }

  if (
    typeof product.available === 'boolean'
  ) {
    return product.available
  }

  if (
    product.availableQuantity !== undefined
  ) {
    return Number(
      product.availableQuantity
    ) > 0
  }

  if (
    product.quantity !== undefined
  ) {
    return Number(
      product.quantity
    ) > 0
  }

  if (
    product.stock !== undefined
  ) {
    return Number(
      product.stock
    ) > 0
  }

  return false
}


// ======================================================
// EVENT TYPES
// ======================================================

export const MARKET_DEMAND_EVENTS = {

  REQUESTED:
    'requested',

  VIEWED:
    'viewed',

  ADDED_TO_CART:
    'added_to_cart',

  CHECKOUT_STARTED:
    'checkout_started',

  PURCHASED:
    'purchased',

  NOT_ADDED_TO_CART:
    'not_added_to_cart',

  CART_ABANDONED:
    'cart_abandoned',

  PURCHASE_ABANDONED:
    'purchase_abandoned',

  FEEDBACK:
    'feedback'
}


// ======================================================
// REASONS
// ======================================================

export const MARKET_DEMAND_REASONS = {

  PRICE:
    'price',

  ALTERNATIVE:
    'alternative',

  NOT_NEEDED:
    'not_needed',

  UNAVAILABLE:
    'unavailable',

  SHIPPING:
    'shipping',

  PAYMENT:
    'payment',

  TRUST:
    'trust',

  WAITING:
    'waiting',

  OTHER:
    'other'
}


// ======================================================
// REASON LABELS
// ======================================================

export const MARKET_DEMAND_REASON_LABELS = {

  price:
    'السعر',

  alternative:
    'وجد بديلًا',

  not_needed:
    'لم يعد يحتاج المنتج',

  unavailable:
    'المنتج غير متوفر',

  shipping:
    'الشحن',

  payment:
    'الدفع',

  trust:
    'الثقة',

  waiting:
    'الانتظار',

  other:
    'سبب آخر'
}


// ======================================================
// EVENT ID
// ======================================================

const createEventId = () => {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2)
  )
}


// ======================================================
// VEHICLE CONTEXT RESOLUTION
// ======================================================
//
// Priority:
// 1. Explicit context
// 2. Product context
// 3. Order context
// 4. Previous event for same product/session
//
// IMPORTANT
// ------------------------------------------------------
// Contexts are merged without allowing empty fields
// to overwrite valid values.
//
// ======================================================

const resolveEventContext = ({
  product,
  searchContext,
  order,
  existingEvents = [],
  sessionId
} = {}) => {

  const explicitContext =
    normalizeSearchContext(
      searchContext
    )


  const productSearchContext =
    normalizeSearchContext(
      product?.searchContext || {}
    )


  const productVehicleContext =
    normalizeSearchContext(
      product?.vehicleSearchContext || {}
    )


  const productContext =
    mergeSearchContexts(
      productSearchContext,
      productVehicleContext
    )


  const orderSearchContext =
    normalizeSearchContext(
      order?.searchContext || {}
    )


  const orderVehicleSearchContext =
    normalizeSearchContext(
      order?.vehicleSearchContext || {}
    )


  const orderVehicleFields =
    normalizeSearchContext({

      vehicleType:
        order?.vehicleType ??
        order?.vehicle?.type ??
        '',

      make:
        order?.make ??
        order?.vehicle?.make ??
        '',

      model:
        order?.model ??
        order?.vehicle?.model ??
        '',

      year:
        order?.year ??
        order?.vehicle?.year ??
        '',

      searchType:
        order?.searchType ??
        '',

      searchQuery:
        order?.searchQuery ??
        ''
    })


  // ----------------------------------------------------
  // EXPLICIT CONTEXT
  // ----------------------------------------------------

  if (
    hasVehicleContext(
      explicitContext
    )
  ) {

    return {
      context:
        mergeSearchContexts(
          productContext,
          explicitContext
        ),

      source:
        'explicit'
    }
  }


  // ----------------------------------------------------
  // PRODUCT CONTEXT
  // ----------------------------------------------------

  if (
    hasVehicleContext(
      productContext
    )
  ) {

    return {
      context:
        productContext,

      source:
        'product'
    }
  }


  // ----------------------------------------------------
  // ORDER CONTEXT
  // ----------------------------------------------------

  const orderContext =
    mergeSearchContexts(
      orderSearchContext,
      orderVehicleSearchContext,
      orderVehicleFields
    )


  if (
    hasVehicleContext(
      orderContext
    )
  ) {

    return {
      context:
        orderContext,

      source:
        'order'
    }
  }


  // ----------------------------------------------------
  // PREVIOUS EVENT
  // SAME PRODUCT + SAME SESSION
  // ----------------------------------------------------

  if (
    sessionId
  ) {

    const productKey =
      getProductKey(
        product
      )

    if (
      productKey
    ) {

      for (
        let index =
          existingEvents.length - 1;
        index >= 0;
        index -= 1
      ) {

        const previous =
          existingEvents[index]


        if (
          String(
            previous.sessionId ??
            ''
          ) !==
          String(
            sessionId
          )
        ) {
          continue
        }


        const previousKey =
          previous.productId
            ? String(
                previous.productId
              )
            : normalizeText(
                previous.productName
              )


        if (
          previousKey !==
          productKey
        ) {
          continue
        }


        const previousContext =
          normalizeSearchContext(
            previous.searchContext
          )


        if (
          hasVehicleContext(
            previousContext
          )
        ) {

          return {

            context:
              previousContext,

            source:
              'previous-session-event'
          }
        }
      }
    }
  }


  // ----------------------------------------------------
  // NO VEHICLE CONTEXT
  // ----------------------------------------------------

  return {

    context:
      explicitContext,

    source:
      'none'
  }
}


// ======================================================
// EVENT FACTORY
// ======================================================

const createDemandEvent = ({
  type,
  product,
  availability,
  searchContext,
  searchContextSource,
  sessionId,
  customerId,
  orderId,
  quantity,
  reason,
  metadata
}) => {

  const normalizedProduct =
    normalizeProduct(
      product
    )


  const context =
    normalizeSearchContext(
      searchContext
    )


  const vehicleContext =
    buildVehicleContext(
      context
    )


  return {

    id:
      createEventId(),

    type,

    timestamp:
      new Date().toISOString(),

    product:
      normalizedProduct,

    productId:
      normalizedProduct?.id ??
      normalizedProduct?.productId ??
      null,

    productName:
      normalizedProduct?.name ??
      normalizedProduct?.productName ??
      '',

    availability:
      resolveAvailability(
        normalizedProduct,
        availability
      ),

    quantity:
      Number(quantity) > 0
        ? Number(quantity)
        : 1,

    reason:
      reason ??
      null,

    searchContext:
      context,

    searchType:
      context.searchType,

    searchQuery:
      context.searchQuery,

    vehicleType:
      vehicleContext.vehicleType,

    make:
      vehicleContext.make,

    model:
      vehicleContext.model,

    modelFromSearch:
      vehicleContext.modelFromSearch,

    year:
      vehicleContext.year,

    tireSize:
      context.tireSize,

    capacity:
      context.capacity,

    viscosity:
      context.viscosity,

    sessionId:
      sessionId ??
      null,

    customerId:
      customerId ??
      null,

    orderId:
      orderId ??
      null,

    metadata: {

      ...(metadata || {}),

      vehicleContextSource:
        searchContextSource ??
        'none',

      hasVehicleContext:
        hasVehicleContext(
          context
        )
    }
  }
}


// ======================================================
// STORE
// ======================================================

const useMarketDemandStore = create(

  persist(

    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      demandEvents: [],

      demandVersion: 3,


      // ==================================================
      // COMPATIBILITY ALIAS
      // ==================================================

      get events() {

        return get()
          .demandEvents
      },


      // ==================================================
      // INTERNAL MULTI-PRODUCT EVENT RECORDER
      // ==================================================

      recordProductsEvent: ({
        type,
        product,
        products,
        order,
        availability,
        searchContext,
        sessionId,
        customerId,
        orderId,
        quantity,
        reason,
        metadata
      } = {}) => {

        const items =
          collectProducts({
            product,
            products,
            order
          })


        if (
          items.length === 0
        ) {

          console.warn(
            '[MarketDemand] No real product supplied:',
            type
          )

          return []
        }


        const existingEvents =
          get().demandEvents


        const events =
          items.map(
            item => {

              const resolved =
                resolveEventContext({

                  product:
                    item,

                  searchContext,

                  order,

                  existingEvents,

                  sessionId
                })


              const itemContext =
                resolved.context


              return createDemandEvent({

                type,

                product:
                  item,

                availability:
                  availability ??
                  item.isAvailable ??
                  item.available,

                searchContext:
                  itemContext,

                searchContextSource:
                  resolved.source,

                sessionId,

                customerId,

                orderId:
                  orderId ??
                  order?.id ??
                  order?.orderId ??
                  null,

                quantity:
                  item.quantity ??
                  quantity ??
                  1,

                reason,

                metadata: {

                  ...(metadata || {}),

                  productSource:
                    'real-product'
                }
              })
            }
          )


        set(
          state => ({

            demandEvents: [

              ...state.demandEvents,

              ...events
            ]
          })
        )


        // ==================================================
        // DEBUG — ACTUAL STORED EVENT CONTEXT
        // ==================================================
        //
        // This does NOT modify event logic.
        // It only exposes the exact data that was stored.
        //
        // ==================================================

        events.forEach(
          event => {

            console.log(
              '[MarketDemand][DEBUG] EVENT STORED',
              {
                type:
                  event.type,

                productId:
                  event.productId,

                productName:
                  event.productName,

                searchType:
                  event.searchType,

                searchQuery:
                  event.searchQuery,

                vehicleType:
                  event.vehicleType,

                make:
                  event.make,

                model:
                  event.model,

                modelFromSearch:
                  event.modelFromSearch,

                year:
                  event.year,

                tireSize:
                  event.tireSize,

                capacity:
                  event.capacity,

                viscosity:
                  event.viscosity,

                hasVehicleContext:
                  event.metadata?.hasVehicleContext,

                vehicleContextSource:
                  event.metadata?.vehicleContextSource,

                sessionId:
                  event.sessionId,

                orderId:
                  event.orderId,

                eventId:
                  event.id
              }
            )
          }
        )


        return events
      },


      // ==================================================
      // GENERIC EVENT
      // ==================================================

      recordEvent: ({
        type,
        product,
        products,
        order,
        availability,
        searchContext,
        sessionId,
        customerId,
        orderId,
        quantity = 1,
        reason,
        metadata
      } = {}) => {

        return get()
          .recordProductsEvent({

            type,

            product,

            products,

            order,

            availability,

            searchContext,

            sessionId,

            customerId,

            orderId,

            quantity,

            reason,

            metadata
          })
      },


      // ==================================================
      // REQUEST
      // ==================================================

      recordRequest: ({
        product,
        products = [],
        availability,
        searchContext,
        sessionId,
        customerId,
        quantity = 1,
        metadata,
        query,
        searchType
      } = {}) => {

        const context =
          normalizeSearchContext({

            ...(searchContext || {}),

            searchQuery:
              searchContext?.searchQuery ??
              query ??
              '',

            searchType:
              searchContext?.searchType ??
              searchType ??
              ''
          })


        const events =
          get()
            .recordProductsEvent({

              type:
                MARKET_DEMAND_EVENTS.REQUESTED,

              product,

              products,

              availability,

              searchContext:
                context,

              sessionId,

              customerId,

              quantity,

              metadata
            })


        console.log(
          '[MarketDemand] Request recorded:',
          events.length
        )


        return events
      },


      // ==================================================
      // VIEWED
      // ==================================================

      recordViewed: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        metadata
      } = {}) => {

        const events =
          get()
            .recordProductsEvent({

              type:
                MARKET_DEMAND_EVENTS.VIEWED,

              product,

              products,

              searchContext,

              sessionId,

              customerId,

              metadata
            })


        console.log(
          '[MarketDemand] Viewed recorded:',
          events.length
        )


        return events
      },


      // ==================================================
      // ADDED TO CART
      // ==================================================

      recordAddedToCart: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        quantity = 1,
        metadata
      } = {}) => {

        const events =
          get()
            .recordProductsEvent({

              type:
                MARKET_DEMAND_EVENTS.ADDED_TO_CART,

              product,

              products,

              searchContext,

              sessionId,

              customerId,

              quantity,

              metadata
            })


        console.log(
          '[MarketDemand] Added to cart:',
          events.length
        )


        return events
      },


      // ==================================================
      // CHECKOUT STARTED
      // ==================================================

      recordCheckoutStarted: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        metadata
      } = {}) => {

        const events =
          get()
            .recordProductsEvent({

              type:
                MARKET_DEMAND_EVENTS.CHECKOUT_STARTED,

              product,

              products,

              searchContext,

              sessionId,

              customerId,

              metadata
            })


        console.log(
          '[MarketDemand] Checkout started:',
          events.length
        )


        return events
      },


      // ==================================================
      // PURCHASE
      // ==================================================

      recordPurchase: ({
        product,
        products = [],
        order,
        searchContext,
        sessionId,
        customerId,
        orderId,
        quantity,
        metadata
      } = {}) => {

        const orderItems =
          Array.isArray(
            products
          ) &&
          products.length > 0

            ? products

            : Array.isArray(
                order?.items
              )

              ? order.items

              : []


        const orderContext =
          mergeSearchContexts(

            order?.searchContext,

            order?.vehicleSearchContext,

            {
              vehicleType:
                order?.vehicleType ??
                order?.vehicle?.type ??
                '',

              make:
                order?.make ??
                order?.vehicle?.make ??
                '',

              model:
                order?.model ??
                order?.vehicle?.model ??
                '',

              modelFromSearch:
                order?.modelFromSearch ??
                order?.model ??
                order?.vehicle?.model ??
                '',

              year:
                order?.year ??
                order?.vehicle?.year ??
                '',

              searchType:
                order?.searchType ??
                '',

              searchQuery:
                order?.searchQuery ??
                ''
            },

            searchContext
          )


        const events =
          get()
            .recordProductsEvent({

              type:
                MARKET_DEMAND_EVENTS.PURCHASED,

              product,

              products:
                orderItems,

              order,

              searchContext:
                orderContext,

              sessionId,

              customerId,

              orderId:
                orderId ??
                order?.id ??
                order?.orderId ??
                null,

              quantity,

              metadata: {

                ...(metadata || {}),

                source:
                  metadata?.source ??
                  'order'
              }
            })


        console.log(
          '[MarketDemand] Purchase recorded:',
          events.length
        )


        return events
      },


      // ==================================================
      // NOT ADDED TO CART
      // ==================================================

      recordNotAddedToCart: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        reason,
        metadata
      } = {}) => {

        return get()
          .recordProductsEvent({

            type:
              MARKET_DEMAND_EVENTS.NOT_ADDED_TO_CART,

            product,

            products,

            searchContext,

            sessionId,

            customerId,

            reason,

            metadata
          })
      },


      // ==================================================
      // CART ABANDONED
      // ==================================================

      recordCartAbandoned: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        reason,
        metadata
      } = {}) => {

        return get()
          .recordProductsEvent({

            type:
              MARKET_DEMAND_EVENTS.CART_ABANDONED,

            product,

            products,

            searchContext,

            sessionId,

            customerId,

            reason,

            metadata
          })
      },


      // ==================================================
      // PURCHASE ABANDONED
      // ==================================================

      recordPurchaseAbandoned: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        reason,
        metadata
      } = {}) => {

        return get()
          .recordProductsEvent({

            type:
              MARKET_DEMAND_EVENTS.PURCHASE_ABANDONED,

            product,

            products,

            searchContext,

            sessionId,

            customerId,

            reason,

            metadata
          })
      },


      // ==================================================
      // CUSTOMER FEEDBACK
      // ==================================================

      recordFeedback: ({
        product,
        products = [],
        searchContext,
        sessionId,
        customerId,
        reason,
        metadata
      } = {}) => {

        if (
          !reason
        ) {
          return []
        }


        return get()
          .recordProductsEvent({

            type:
              MARKET_DEMAND_EVENTS.FEEDBACK,

            product,

            products,

            searchContext,

            sessionId,

            customerId,

            reason,

            metadata
          })
      },


      // ==================================================
      // PRODUCT EVENTS
      // ==================================================

      getProductEvents: productId => {

        const wanted =
          String(
            productId ?? ''
          )


        return get()
          .demandEvents
          .filter(
            event =>
              String(
                event.productId ?? ''
              ) === wanted
          )
      },


      // ==================================================
      // PRODUCT ANALYTICS
      // ==================================================

      getProductAnalytics: () => {

        const groups = {}


        for (
          const event
          of get().demandEvents
        ) {

          const key =
            event.productId
              ? String(
                  event.productId
                )
              : normalizeText(
                  event.productName
                )


          if (!key) {
            continue
          }


          if (!groups[key]) {

            groups[key] = {

              productId:
                event.productId ??
                null,

              productName:
                event.productName ||
                'منتج',

              requested:
                0,

              viewed:
                0,

              addedToCart:
                0,

              checkoutStarted:
                0,

              purchased:
                0,

              notAddedToCart:
                0,

              cartAbandoned:
                0,

              purchaseAbandoned:
                0,

              unavailableRequests:
                0,

              availableRequests:
                0,

              totalQuantityPurchased:
                0,

              revenue:
                0,

              reasons: {},

              vehicleContexts: {}
            }
          }


          const item =
            groups[key]


          switch (
            event.type
          ) {

            case MARKET_DEMAND_EVENTS.REQUESTED:

              item.requested += 1

              if (
                event.availability
              ) {

                item.availableRequests += 1

              } else {

                item.unavailableRequests += 1
              }

              break


            case MARKET_DEMAND_EVENTS.VIEWED:

              item.viewed += 1

              break


            case MARKET_DEMAND_EVENTS.ADDED_TO_CART:

              item.addedToCart += 1

              break


            case MARKET_DEMAND_EVENTS.CHECKOUT_STARTED:

              item.checkoutStarted += 1

              break


            case MARKET_DEMAND_EVENTS.PURCHASED:

              item.purchased += 1

              item.totalQuantityPurchased +=
                Number(
                  event.quantity || 1
                )

              item.revenue +=
                Number(
                  event.product?.price || 0
                ) *
                Number(
                  event.quantity || 1
                )

              break


            case MARKET_DEMAND_EVENTS.NOT_ADDED_TO_CART:

              item.notAddedToCart += 1

              break


            case MARKET_DEMAND_EVENTS.CART_ABANDONED:

              item.cartAbandoned += 1

              break


            case MARKET_DEMAND_EVENTS.PURCHASE_ABANDONED:

              item.purchaseAbandoned += 1

              break


            case MARKET_DEMAND_EVENTS.FEEDBACK:

              break


            default:

              break
          }


          if (
            event.reason
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


          const context =
            event.searchContext ||
            {}


          const vehicleKey =
            [
              context.vehicleType,
              context.make,
              context.modelFromSearch ||
                context.model,
              context.year
            ]
              .map(
                value =>
                  String(
                    value ?? ''
                  ).trim()
              )
              .filter(Boolean)
              .join(' ')


          if (
            vehicleKey
          ) {

            item.vehicleContexts[
              vehicleKey
            ] =
              (
                item.vehicleContexts[
                  vehicleKey
                ] || 0
              ) + 1
          }
        }


        return Object.values(
          groups
        )
          .map(
            item => ({

              ...item,

              purchaseConversionRate:
                item.requested > 0
                  ? (
                      item.purchased /
                      item.requested
                    ) * 100
                  : 0,

              addToCartRate:
                item.requested > 0
                  ? (
                      item.addedToCart /
                      item.requested
                    ) * 100
                  : 0,

              viewRate:
                item.requested > 0
                  ? (
                      item.viewed /
                      item.requested
                    ) * 100
                  : 0
            })
          )
      },


      // ==================================================
      // SUMMARY
      // ==================================================

      getSummary: () => {

        const events =
          get().demandEvents


        let totalRequests = 0
        let totalViews = 0
        let totalAddedToCart = 0
        let totalCheckoutStarted = 0
        let totalPurchased = 0
        let totalNotPurchased = 0
        let totalUnavailableRequests = 0
        let totalAvailableRequests = 0
        let totalRevenue = 0


        for (
          const event
          of events
        ) {

          switch (
            event.type
          ) {

            case MARKET_DEMAND_EVENTS.REQUESTED:

              totalRequests += 1

              if (
                event.availability
              ) {

                totalAvailableRequests += 1

              } else {

                totalUnavailableRequests += 1
              }

              break


            case MARKET_DEMAND_EVENTS.VIEWED:

              totalViews += 1

              break


            case MARKET_DEMAND_EVENTS.ADDED_TO_CART:

              totalAddedToCart += 1

              break


            case MARKET_DEMAND_EVENTS.CHECKOUT_STARTED:

              totalCheckoutStarted += 1

              break


            case MARKET_DEMAND_EVENTS.PURCHASED:

              totalPurchased += 1

              totalRevenue +=
                Number(
                  event.product?.price || 0
                ) *
                Number(
                  event.quantity || 1
                )

              break


            default:

              break
          }
        }


        totalNotPurchased =
          Math.max(
            0,
            totalRequests -
            totalPurchased
          )


        const totalProducts =
          get()
            .getProductAnalytics()
            .length


        const purchaseConversionRate =
          totalRequests > 0
            ? (
                totalPurchased /
                totalRequests
              ) * 100
            : 0


        const addToCartRate =
          totalRequests > 0
            ? (
                totalAddedToCart /
                totalRequests
              ) * 100
            : 0


        return {

          totalProducts,

          totalRequests,

          totalRequested:
            totalRequests,

          totalViews,

          totalViewed:
            totalViews,

          totalAddedToCart,

          totalCheckoutStarted,

          totalPurchased,

          totalNotPurchased,

          totalUnavailableRequests,

          totalUnavailable:
            totalUnavailableRequests,

          totalAvailableRequests,

          totalRevenue,

          purchaseConversionRate,

          conversionRate:
            purchaseConversionRate,

          addToCartRate,

          cartConversionRate:
            addToCartRate
        }
      },


      // ==================================================
      // TOP REQUESTED
      // ==================================================

      getTopRequestedProducts: (
        limit = 10
      ) => {

        return get()
          .getProductAnalytics()
          .sort(
            (a, b) =>
              b.requested -
              a.requested
          )
          .slice(
            0,
            limit
          )
      },


      // ==================================================
      // TOP PURCHASED
      // ==================================================

      getTopPurchasedProducts: (
        limit = 10
      ) => {

        return get()
          .getProductAnalytics()
          .sort(
            (a, b) =>
              b.purchased -
              a.purchased
          )
          .slice(
            0,
            limit
          )
      },


      // ==================================================
      // SUPPLY OPPORTUNITIES
      // ==================================================

      getSupplyOpportunities: (
        limit = 10
      ) => {

        return get()
          .getProductAnalytics()
          .filter(
            item =>
              item.requested > 0 &&
              (
                item.unavailableRequests > 0 ||
                item.purchased === 0
              )
          )
          .map(
            item => ({

              ...item,

              demandScore:
                item.requested +
                (
                  item.unavailableRequests *
                  2
                ) +
                (
                  item.purchased *
                  3
                ),

              supplyRisk:
                item.unavailableRequests >
                0
                  ? 'high'
                  : 'medium'
            })
          )
          .sort(
            (a, b) =>
              b.demandScore -
              a.demandScore
          )
          .slice(
            0,
            limit
          )
      },


      // ==================================================
      // TOP NOT PURCHASED
      // ==================================================

      getTopNotPurchasedProducts: (
        limit = 10
      ) => {

        return get()
          .getProductAnalytics()
          .map(
            item => ({

              ...item,

              notPurchased:
                Math.max(
                  0,
                  item.requested -
                  item.purchased
                )
            })
          )
          .filter(
            item =>
              item.notPurchased > 0
          )
          .sort(
            (a, b) =>
              b.notPurchased -
              a.notPurchased
          )
          .slice(
            0,
            limit
          )
      },


      // ==================================================
      // REASON ANALYTICS
      // ==================================================

      getReasonAnalytics: () => {

        const reasons = {}


        for (
          const event
          of get().demandEvents
        ) {

          if (
            !event.reason
          ) {
            continue
          }


          reasons[
            event.reason
          ] =
            (
              reasons[
                event.reason
              ] || 0
            ) + 1
        }


        return Object.entries(
          reasons
        )
          .map(
            ([reason, count]) => ({

              reason,

              label:
                MARKET_DEMAND_REASON_LABELS[
                  reason
                ] ||
                reason,

              count
            })
          )
          .sort(
            (a, b) =>
              b.count -
              a.count
          )
      },


      // ==================================================
      // VEHICLE ANALYTICS
      // ==================================================

      getVehicleAnalytics: () => {

        const vehicles = {}


        for (
          const event
          of get().demandEvents
        ) {

          const context =
            normalizeSearchContext(

              mergeSearchContexts(

                event.searchContext,

                {
                  vehicleType:
                    event.vehicleType,

                  make:
                    event.make,

                  model:
                    event.modelFromSearch ??
                    event.model,

                  modelFromSearch:
                    event.modelFromSearch ??
                    event.model,

                  year:
                    event.year
                }
              )
            )


          const vehicleType =
            String(
              context.vehicleType ??
              ''
            ).trim()


          const make =
            String(
              context.make ??
              ''
            ).trim()


          const model =
            String(
              context.modelFromSearch ??
              context.model ??
              ''
            ).trim()


          const year =
            String(
              context.year ??
              ''
            ).trim()


          const vehicleKey =
            [
              vehicleType,
              make,
              model,
              year
            ]
              .filter(Boolean)
              .join(' ')


          if (
            !vehicleKey
          ) {
            continue
          }


          if (
            !vehicles[
              vehicleKey
            ]
          ) {

            vehicles[
              vehicleKey
            ] = {

              vehicle:
                vehicleKey,

              vehicleType,

              make,

              model,

              year,

              requested:
                0,

              viewed:
                0,

              addedToCart:
                0,

              checkoutStarted:
                0,

              purchased:
                0,

              unavailable:
                0,

              notAddedToCart:
                0,

              cartAbandoned:
                0,

              purchaseAbandoned:
                0,

              products: {},

              productCount:
                0
            }
          }


          const item =
            vehicles[
              vehicleKey
            ]


          switch (
            event.type
          ) {

            case MARKET_DEMAND_EVENTS.REQUESTED:

              item.requested += 1

              if (
                !event.availability
              ) {

                item.unavailable += 1
              }

              break


            case MARKET_DEMAND_EVENTS.VIEWED:

              item.viewed += 1

              break


            case MARKET_DEMAND_EVENTS.ADDED_TO_CART:

              item.addedToCart += 1

              break


            case MARKET_DEMAND_EVENTS.CHECKOUT_STARTED:

              item.checkoutStarted += 1

              break


            case MARKET_DEMAND_EVENTS.PURCHASED:

              item.purchased += 1

              break


            case MARKET_DEMAND_EVENTS.NOT_ADDED_TO_CART:

              item.notAddedToCart += 1

              break


            case MARKET_DEMAND_EVENTS.CART_ABANDONED:

              item.cartAbandoned += 1

              break


            case MARKET_DEMAND_EVENTS.PURCHASE_ABANDONED:

              item.purchaseAbandoned += 1

              break


            default:

              break
          }


          // ----------------------------------------------
          // PRODUCTS FOR THIS VEHICLE
          // ----------------------------------------------

          const productKey =
            event.productId
              ? String(
                  event.productId
                )
              : normalizeText(
                  event.productName
                )


          if (
            productKey
          ) {

            if (
              !item.products[
                productKey
              ]
            ) {

              item.products[
                productKey
              ] = {

                productId:
                  event.productId ??
                  null,

                productName:
                  event.productName ||
                  'منتج',

                requested:
                  0,

                viewed:
                  0,

                addedToCart:
                  0,

                purchased:
                  0
              }
            }


            const product =
              item.products[
                productKey
              ]


            switch (
              event.type
            ) {

              case MARKET_DEMAND_EVENTS.REQUESTED:

                product.requested += 1

                break


              case MARKET_DEMAND_EVENTS.VIEWED:

                product.viewed += 1

                break


              case MARKET_DEMAND_EVENTS.ADDED_TO_CART:

                product.addedToCart += 1

                break


              case MARKET_DEMAND_EVENTS.PURCHASED:

                product.purchased += 1

                break


              default:

                break
            }
          }
        }


        return Object.values(
          vehicles
        )
          .map(
            item => {

              const products =
                Object.values(
                  item.products
                )
                  .map(
                    product => ({

                      ...product,

                      purchaseConversionRate:
                        product.requested > 0
                          ? (
                              product.purchased /
                              product.requested
                            ) * 100
                          : 0
                    })
                  )
                  .sort(
                    (a, b) =>
                      b.requested -
                      a.requested
                  )


              return {

                ...item,

                products,

                productCount:
                  products.length,

                purchaseConversionRate:
                  item.requested > 0
                    ? (
                        item.purchased /
                        item.requested
                      ) * 100
                    : 0,

                addToCartRate:
                  item.requested > 0
                    ? (
                        item.addedToCart /
                        item.requested
                      ) * 100
                    : 0
              }
            }
          )
          .sort(
            (a, b) =>
              b.requested -
              a.requested
          )
      },


      // ==================================================
      // DATE RANGE
      // ==================================================

      getAnalyticsByDateRange: (
        startDate,
        endDate
      ) => {

        const start =
          startDate
            ? new Date(
                startDate
              )
            : null


        const end =
          endDate
            ? new Date(
                endDate
              )
            : null


        const filtered =
          get()
            .demandEvents
            .filter(
              event => {

                const date =
                  new Date(
                    event.timestamp
                  )


                if (
                  start &&
                  date < start
                ) {
                  return false
                }


                if (
                  end &&
                  date > end
                ) {
                  return false
                }


                return true
              }
            )


        const analytics =
          get()
            .getProductAnalytics()


        return {

          events:
            filtered,

          totalEvents:
            filtered.length,

          products:
            Object.values(
              filtered.reduce(
                (
                  groups,
                  event
                ) => {

                  const key =
                    event.productId
                      ? String(
                          event.productId
                        )
                      : normalizeText(
                          event.productName
                        )


                  if (
                    !key
                  ) {
                    return groups
                  }


                  if (
                    !groups[key]
                  ) {

                    groups[key] = {

                      productId:
                        event.productId ??
                        null,

                      productName:
                        event.productName ||
                        'منتج',

                      requested:
                        0,

                      viewed:
                        0,

                      addedToCart:
                        0,

                      purchased:
                        0
                    }
                  }


                  switch (
                    event.type
                  ) {

                    case MARKET_DEMAND_EVENTS.REQUESTED:

                      groups[key]
                        .requested += 1

                      break


                    case MARKET_DEMAND_EVENTS.VIEWED:

                      groups[key]
                        .viewed += 1

                      break


                    case MARKET_DEMAND_EVENTS.ADDED_TO_CART:

                      groups[key]
                        .addedToCart += 1

                      break


                    case MARKET_DEMAND_EVENTS.PURCHASED:

                      groups[key]
                        .purchased += 1

                      break


                    default:

                      break
                  }


                  return groups
                },
                {}
              )
            ),

          summary: {

            requested:
              filtered.filter(
                e =>
                  e.type ===
                  MARKET_DEMAND_EVENTS.REQUESTED
              ).length,

            viewed:
              filtered.filter(
                e =>
                  e.type ===
                  MARKET_DEMAND_EVENTS.VIEWED
              ).length,

            addedToCart:
              filtered.filter(
                e =>
                  e.type ===
                  MARKET_DEMAND_EVENTS.ADDED_TO_CART
              ).length,

            purchased:
              filtered.filter(
                e =>
                  e.type ===
                  MARKET_DEMAND_EVENTS.PURCHASED
              ).length
          },

          analytics
        }
      },


      // ==================================================
      // CLEAR
      // ==================================================

      clearDemandData: () => {

        set({
          demandEvents: []
        })
      },


      // ==================================================
      // EXPORT
      // ==================================================

      exportDemandData: () => {

        return JSON.stringify(
          get().demandEvents,
          null,
          2
        )
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
        })
    }
  )
)


// ======================================================
// EXPORT
// ======================================================

export default useMarketDemandStore