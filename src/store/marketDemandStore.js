// ======================================================
// EL OLA ERP
// Market Demand Analytics Store
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
// Tracks consumer demand independently from inventory.
//
// IMPORTANT
// ------------------------------------------------------
// A product request is recorded whether the product is:
// 1. Available
// 2. Unavailable
//
// Demand is NOT the same as inventory.
// Demand is NOT the same as completed orders.
//
// EVENT FLOW
// ------------------------------------------------------
// requested
//      ↓
// viewed
//      ↓
// added_to_cart
//      ↓
// checkout_started
//      ↓
// purchased
//
// A request may also end as:
// not_added_to_cart
// cart_abandoned
// purchase_abandoned
// cancelled
//
// ======================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'


// ======================================================
// ID
// ======================================================

const generateId = () =>
  Date.now().toString() +
  Math.random()
    .toString(36)
    .slice(2)


// ======================================================
// NORMALIZE
// ======================================================

const normalizeText = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()


const normalizeProduct = product => {

  if (!product) {
    return {
      productId: '',
      productName: 'منتج غير محدد',
      type: '',
      brand: '',
      model: '',
      size: '',
      sku: ''
    }
  }

  return {
    productId:
      product.productId ??
      product.id ??
      product.selectedProductId ??
      product.selectedWarehouseProductId ??
      '',

    productName:
      product.productName ??
      product.name ??
      product.title ??
      product.productNameAr ??
      'منتج غير محدد',

    type:
      product.type ??
      product.category ??
      product.productType ??
      '',

    brand:
      product.brand ??
      product.manufacturer ??
      '',

    model:
      product.model ??
      '',

    size:
      product.size ??
      product.tire?.size ??
      product.tireSize ??
      product.capacity ??
      product.viscosity ??
      '',

    sku:
      product.sku ??
      product.code ??
      '',

    salePrice:
      Number(
        product.salePrice ??
        product.price ??
        0
      ) || 0,

    image:
      product.image ??
      product.imageUrl ??
      '',

    technicalRequirement:
      Boolean(
        product.technicalRequirement
      ),

    compatibilitySource:
      product.compatibilitySource ??
      '',

    isAvailable:
      Boolean(
        product.isAvailable ??
        product.available ??
        false
      ),

    availableQuantity:
      Number(
        product.availableQuantity ??
        product.quantity ??
        product.stock ??
        0
      ) || 0
  }
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

  CANCELLED:
    'cancelled',

  FEEDBACK:
    'feedback'
}


// ======================================================
// NO PURCHASE REASONS
// ======================================================

export const MARKET_DEMAND_REASONS = {

  OUT_OF_STOCK:
    'out_of_stock',

  PRICE_HIGH:
    'price_high',

  NOT_SUITABLE:
    'not_suitable',

  WRONG_SPECIFICATION:
    'wrong_specification',

  WRONG_BRAND:
    'wrong_brand',

  LOOKING_FOR_ALTERNATIVE:
    'looking_for_alternative',

  WILL_BUY_LATER:
    'will_buy_later',

  LEFT_PAGE:
    'left_page',

  CART_ABANDONED:
    'cart_abandoned',

  CHECKOUT_ABANDONED:
    'checkout_abandoned',

  OTHER:
    'other'
}


// ======================================================
// REASON LABELS
// ======================================================

export const MARKET_DEMAND_REASON_LABELS = {

  out_of_stock:
    'المنتج غير متوفر',

  price_high:
    'السعر مرتفع',

  not_suitable:
    'المنتج غير مناسب',

  wrong_specification:
    'المواصفات غير مناسبة',

  wrong_brand:
    'أبحث عن ماركة أخرى',

  looking_for_alternative:
    'أبحث عن بديل',

  will_buy_later:
    'سأشتري لاحقًا',

  left_page:
    'غادر الصفحة',

  cart_abandoned:
    'ترك السلة بدون إتمام الطلب',

  checkout_abandoned:
    'بدأ الشراء ولم يكمله',

  other:
    'سبب آخر'
}


// ======================================================
// STORE
// ======================================================

export const useMarketDemandStore = create(

  persist(

    (set, get) => ({

      // ==================================================
      // DATA
      // ==================================================

      demandEvents: [],

      demandVersion: 1,


      // ==================================================
      // RECORD EVENT
      // ==================================================

      recordEvent: ({
        eventType,
        product,
        availability,
        searchContext = {},
        sessionId = '',
        customerId = '',
        orderId = '',
        quantity = 1,
        reason = '',
        metadata = {}
      } = {}) => {

        if (!eventType) {
          return null
        }

        const normalized =
          normalizeProduct(product)

        const event = {

          id:
            generateId(),

          eventType,

          createdAt:
            new Date().toISOString(),

          productId:
            normalized.productId,

          productName:
            normalized.productName,

          type:
            normalized.type,

          brand:
            normalized.brand,

          model:
            normalized.model,

          size:
            normalized.size,

          sku:
            normalized.sku,

          salePrice:
            normalized.salePrice,

          image:
            normalized.image,

          technicalRequirement:
            normalized.technicalRequirement,

          compatibilitySource:
            normalized.compatibilitySource,

          // ----------------------------------------------
          // AVAILABILITY AT EVENT TIME
          // ----------------------------------------------

          isAvailable:
            availability?.isAvailable ??
            normalized.isAvailable,

          availableQuantity:
            Number(
              availability?.availableQuantity ??
              normalized.availableQuantity ??
              0
            ) || 0,

          // ----------------------------------------------
          // CONTEXT
          // ----------------------------------------------

          vehicleType:
            searchContext.vehicleType ??
            '',

          make:
            searchContext.make ??
            '',

          modelFromSearch:
            searchContext.model ??
            '',

          year:
            searchContext.year ??
            '',

          searchType:
            searchContext.searchType ??
            searchContext.type ??
            '',

          searchQuery:
            searchContext.searchQuery ??
            searchContext.query ??
            '',

          // ----------------------------------------------
          // USER / ORDER
          // ----------------------------------------------

          sessionId,

          customerId,

          orderId,

          quantity:
            Math.max(
              1,
              Number(quantity) || 1
            ),

          reason,

          metadata
        }

        set(state => ({

          demandEvents: [
            event,
            ...(state.demandEvents || [])
          ]

        }))

        return event
      },


      // ==================================================
      // REQUESTED
      // ==================================================

      recordRequest: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.REQUESTED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          quantity,

          metadata
        })
      },


      // ==================================================
      // VIEWED
      // ==================================================

      recordViewed: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.VIEWED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          metadata
        })
      },


      // ==================================================
      // ADD TO CART
      // ==================================================

      recordAddedToCart: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.ADDED_TO_CART,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          quantity,

          metadata
        })
      },


      // ==================================================
      // CHECKOUT START
      // ==================================================

      recordCheckoutStarted: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.CHECKOUT_STARTED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          quantity,

          metadata
        })
      },


      // ==================================================
      // PURCHASE
      // ==================================================

      recordPurchase: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        orderId,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.PURCHASED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          orderId,

          quantity,

          metadata
        })
      },


      // ==================================================
      // NOT ADDED
      // ==================================================

      recordNotAddedToCart: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        reason = '',
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.NOT_ADDED_TO_CART,

          product,

          availability,

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
        availability,
        searchContext,
        sessionId,
        customerId,
        reason = MARKET_DEMAND_REASONS.CART_ABANDONED,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.CART_ABANDONED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          reason,

          quantity,

          metadata
        })
      },


      // ==================================================
      // PURCHASE ABANDONED
      // ==================================================

      recordPurchaseAbandoned: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        reason = MARKET_DEMAND_REASONS.CHECKOUT_ABANDONED,
        quantity = 1,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.PURCHASE_ABANDONED,

          product,

          availability,

          searchContext,

          sessionId,

          customerId,

          reason,

          quantity,

          metadata
        })
      },


      // ==================================================
      // FEEDBACK
      // ==================================================

      recordFeedback: ({
        product,
        availability,
        searchContext,
        sessionId,
        customerId,
        reason,
        metadata
      } = {}) => {

        return get().recordEvent({

          eventType:
            MARKET_DEMAND_EVENTS.FEEDBACK,

          product,

          availability,

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

        const normalizedId =
          String(productId ?? '')

        return (
          get().demandEvents || []
        ).filter(
          event =>
            String(
              event.productId ?? ''
            ) === normalizedId
        )
      },


      // ==================================================
      // AGGREGATED PRODUCT ANALYTICS
      // ==================================================

      getProductAnalytics: () => {

        const events =
          get().demandEvents || []

        const map =
          new Map()

        events.forEach(event => {

          const key =
            event.productId ||
            `name:${normalizeText(
              event.productName
            )}`

          if (!map.has(key)) {

            map.set(key, {

              productId:
                event.productId || '',

              productName:
                event.productName ||
                'منتج غير محدد',

              type:
                event.type || '',

              brand:
                event.brand || '',

              model:
                event.model || '',

              size:
                event.size || '',

              sku:
                event.sku || '',

              image:
                event.image || '',

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

              cancelled:
                0,

              unavailableRequests:
                0,

              availableRequests:
                0,

              totalRequestedQuantity:
                0,

              totalPurchasedQuantity:
                0,

              revenue:
                0,

              reasons: {},

              firstRequestedAt:
                null,

              lastRequestedAt:
                null
            })
          }

          const item =
            map.get(key)

          switch (event.eventType) {

            case MARKET_DEMAND_EVENTS.REQUESTED:

              item.requested += 1

              item.totalRequestedQuantity +=
                Number(event.quantity || 1)

              if (
                event.isAvailable
              ) {
                item.availableRequests += 1
              }
              else {
                item.unavailableRequests += 1
              }

              if (
                !item.firstRequestedAt ||
                event.createdAt <
                  item.firstRequestedAt
              ) {
                item.firstRequestedAt =
                  event.createdAt
              }

              if (
                !item.lastRequestedAt ||
                event.createdAt >
                  item.lastRequestedAt
              ) {
                item.lastRequestedAt =
                  event.createdAt
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

              item.totalPurchasedQuantity +=
                Number(event.quantity || 1)

              item.revenue +=
                Number(event.salePrice || 0) *
                Number(event.quantity || 1)

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


            case MARKET_DEMAND_EVENTS.CANCELLED:

              item.cancelled += 1

              break


            case MARKET_DEMAND_EVENTS.FEEDBACK:

              if (event.reason) {

                item.reasons[event.reason] =
                  Number(
                    item.reasons[event.reason] || 0
                  ) + 1
              }

              break

            default:

              break
          }

          if (
            event.reason
          ) {

            item.reasons[event.reason] =
              Number(
                item.reasons[event.reason] || 0
              ) + 1
          }

        })

        return Array
          .from(map.values())
          .map(item => ({

            ...item,

            cartConversionRate:
              item.requested > 0
                ? (
                    item.addedToCart /
                    item.requested
                  ) * 100
                : 0,

            purchaseConversionRate:
              item.requested > 0
                ? (
                    item.purchased /
                    item.requested
                  ) * 100
                : 0,

            cartToPurchaseRate:
              item.addedToCart > 0
                ? (
                    item.purchased /
                    item.addedToCart
                  ) * 100
                : 0,

            unavailableRate:
              item.requested > 0
                ? (
                    item.unavailableRequests /
                    item.requested
                  ) * 100
                : 0,

            notPurchased:
              Math.max(
                0,
                item.requested -
                item.purchased
              )
          }))
      },


      // ==================================================
      // SUMMARY
      // ==================================================

      getSummary: () => {

        const products =
          get().getProductAnalytics()

        return products.reduce(

          (summary, product) => {

            summary.totalProducts += 1

            summary.totalRequests +=
              product.requested

            summary.totalViews +=
              product.viewed

            summary.totalAddedToCart +=
              product.addedToCart

            summary.totalCheckoutStarted +=
              product.checkoutStarted

            summary.totalPurchased +=
              product.purchased

            summary.totalNotPurchased +=
              product.notPurchased

            summary.totalUnavailableRequests +=
              product.unavailableRequests

            summary.totalAvailableRequests +=
              product.availableRequests

            summary.totalRevenue +=
              product.revenue

            return summary

          },

          {
            totalProducts: 0,
            totalRequests: 0,
            totalViews: 0,
            totalAddedToCart: 0,
            totalCheckoutStarted: 0,
            totalPurchased: 0,
            totalNotPurchased: 0,
            totalUnavailableRequests: 0,
            totalAvailableRequests: 0,
            totalRevenue: 0
          }
        )
      },


      // ==================================================
      // TOP REQUESTED
      // ==================================================

      getTopRequestedProducts: limit => {

        const count =
          Number(limit) || 10

        return get()
          .getProductAnalytics()
          .sort(
            (a, b) =>
              b.requested -
              a.requested
          )
          .slice(0, count)
      },


      // ==================================================
      // TOP PURCHASED
      // ==================================================

      getTopPurchasedProducts: limit => {

        const count =
          Number(limit) || 10

        return get()
          .getProductAnalytics()
          .sort(
            (a, b) =>
              b.purchased -
              a.purchased
          )
          .slice(0, count)
      },


      // ==================================================
      // HIGH DEMAND / LOW AVAILABILITY
      // ==================================================

      getSupplyOpportunities: limit => {

        const count =
          Number(limit) || 10

        return get()
          .getProductAnalytics()
          .filter(
            product =>
              product.requested > 0 &&
              product.unavailableRequests > 0
          )
          .sort(
            (a, b) => {

              const scoreA =
                a.unavailableRequests *
                a.requested

              const scoreB =
                b.unavailableRequests *
                b.requested

              return scoreB - scoreA
            }
          )
          .slice(0, count)
      },


      // ==================================================
      // TOP NON PURCHASED
      // ==================================================

      getTopNotPurchasedProducts: limit => {

        const count =
          Number(limit) || 10

        return get()
          .getProductAnalytics()
          .filter(
            product =>
              product.notPurchased > 0
          )
          .sort(
            (a, b) =>
              b.notPurchased -
              a.notPurchased
          )
          .slice(0, count)
      },


      // ==================================================
      // REASONS ANALYTICS
      // ==================================================

      getReasonAnalytics: () => {

        const events =
          get().demandEvents || []

        const reasons = {}

        events
          .filter(
            event =>
              Boolean(event.reason)
          )
          .forEach(event => {

            const key =
              event.reason

            if (!reasons[key]) {

              reasons[key] = {

                reason:
                  key,

                label:
                  MARKET_DEMAND_REASON_LABELS[key] ??
                  key,

                count:
                  0
              }
            }

            reasons[key].count += 1
          })

        return Object
          .values(reasons)
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

        const events =
          get().demandEvents || []

        const map =
          new Map()

        events
          .filter(
            event =>
              event.eventType ===
              MARKET_DEMAND_EVENTS.REQUESTED
          )
          .forEach(event => {

            const key = [
              event.vehicleType,
              event.make,
              event.modelFromSearch,
              event.year
            ]
              .filter(Boolean)
              .join('|')

            if (!key) {
              return
            }

            if (!map.has(key)) {

              map.set(key, {

                vehicleType:
                  event.vehicleType,

                make:
                  event.make,

                model:
                  event.modelFromSearch,

                year:
                  event.year,

                requests:
                  0,

                unavailableRequests:
                  0,

                purchased:
                  0
              })
            }

            const item =
              map.get(key)

            item.requests += 1

            if (!event.isAvailable) {
              item.unavailableRequests += 1
            }
          })

        events
          .filter(
            event =>
              event.eventType ===
              MARKET_DEMAND_EVENTS.PURCHASED
          )
          .forEach(event => {

            const key = [
              event.vehicleType,
              event.make,
              event.modelFromSearch,
              event.year
            ]
              .filter(Boolean)
              .join('|')

            if (
              map.has(key)
            ) {
              map.get(key).purchased += 1
            }
          })

        return Array
          .from(map.values())
          .sort(
            (a, b) =>
              b.requests -
              a.requests
          )
      },


      // ==================================================
      // DATE FILTER
      // ==================================================

      getAnalyticsByDateRange: ({
        from,
        to
      } = {}) => {

        const start =
          from
            ? new Date(from).getTime()
            : null

        const end =
          to
            ? new Date(to).getTime()
            : null

        const filtered =
          (get().demandEvents || [])
            .filter(event => {

              const timestamp =
                new Date(
                  event.createdAt
                ).getTime()

              if (
                start !== null &&
                timestamp < start
              ) {
                return false
              }

              if (
                end !== null &&
                timestamp > end
              ) {
                return false
              }

              return true
            })

        return filtered
      },


      // ==================================================
      // CLEAR DATA
      // ==================================================

      clearDemandData: () => {

        set({
          demandEvents: []
        })
      },


      // ==================================================
      // EXPORT DATA
      // ==================================================

      exportDemandData: () => {

        return [
          ...(get().demandEvents || [])
        ]
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


export default useMarketDemandStore