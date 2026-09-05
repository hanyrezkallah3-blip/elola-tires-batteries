import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useInventoryStore } from './inventoryStore'
import { useWalletStore } from './walletStore'
import useMarketDemandStore from './marketDemandStore'
import appendListItemWithId from './helpers/appendListItemWithId'

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2)

// ================= ROLES =================

const rolePermissions = {
  owner: ['all'],

  warehouse: [
    'warehouse_dashboard',
    'products_view',
    'products_edit',
    'orders_view',
    'transfers_view',
    'transfers_create'
  ],

  branch: [
    'branch_dashboard',
    'products_view',
    'orders_view'
  ],

  shop: [
    'shop_dashboard',
    'products_view',
    'orders_view'
  ],

  service: [
    'service_dashboard',
    'products_view'
  ],

  cashier: [
    'orders_view',
    'orders_create'
  ]
}

export const useWebsiteStore = create(

  persist(

    (set, get) => ({

      // ================= SYSTEM =================

      hydrated: true,

      setHydrated: (value) =>
        set({
          hydrated: value
        }),

      aiSystemEnabled: true,

      setAiSystemEnabled: (value) =>
        set({
          aiSystemEnabled: Boolean(value)
        }),

      rolePermissions,

      maintenanceMode: false,

      setMaintenanceMode: (value) =>
        set({
          maintenanceMode: Boolean(value)
        }),

      // ================= HOME DISPLAY SETTINGS =================
      //
      // These settings control only what the customer sees
      // on the Home page.
      //
      // They do NOT change real inventory quantities.
      // They do NOT change offer availability.
      // They do NOT change cart stock validation.
      // They do NOT change warehouse data.
      //

      homeShowProductQuantity: false,

      setHomeShowProductQuantity: (value) =>
        set({
          homeShowProductQuantity:
            Boolean(value)
        }),

      homeShowProductWarehouse: false,

      setHomeShowProductWarehouse: (value) =>
        set({
          homeShowProductWarehouse:
            Boolean(value)
        }),

      homeShowOfferQuantity: false,

      setHomeShowOfferQuantity: (value) =>
        set({
          homeShowOfferQuantity:
            Boolean(value)
        }),

      homeShowOfferWarehouse: false,

      setHomeShowOfferWarehouse: (value) =>
        set({
          homeShowOfferWarehouse:
            Boolean(value)
        }),

      // ================= SERVICES =================

      services: [],

      setServices: (services) =>
        set({
          services:
            Array.isArray(services)
              ? services
              : []
        }),

      addService: (service) =>
        set((state) => ({
          services:
            appendListItemWithId(
              state.services,
              service
            )
        })),

      deleteService: (id) =>
        set((state) => ({
          services:
            state.services.filter(
              (s) =>
                s.id !== id
            )
        })),

      // ================= VIDEOS =================

      videos: [],

      setVideos: (videos) =>
        set({
          videos:
            Array.isArray(videos)
              ? videos
              : []
        }),

      addVideo: (video) =>
        set((state) => ({
          videos:
            appendListItemWithId(
              state.videos,
              video
            )
        })),

      deleteVideo: (id) =>
        set((state) => ({
          videos:
            state.videos.filter(
              (v) =>
                v.id !== id
            )
        })),

      // ================= PERMISSIONS =================

      permissions: [],

      setPermissions: (permissions) =>
        set({
          permissions:
            Array.isArray(permissions)
              ? permissions
              : []
        }),

      // ================= WALLETS =================

      wallets: [],

      setWallets: (wallets) =>
        set({
          wallets:
            Array.isArray(wallets)
              ? wallets
              : []
        }),

      addWallet: (wallet) =>
        set((state) => ({
          wallets: [
            {
              id: generateId(),

              balance: 0,

              totalCashback: 0,

              createdAt:
                new Date().toISOString(),

              ...wallet
            },

            ...state.wallets
          ]
        })),

      // ================= WALLET SETTINGS =================

      walletEnabled: true,

      setWalletEnabled: (value) =>
        set({
          walletEnabled:
            Boolean(value)
        }),

      cashbackPercentage: 0,

      setCashbackPercentage: (value) =>
        set({
          cashbackPercentage:
            Number(value) || 0
        }),

      walletTransactions: [],

      setWalletTransactions: (transactions) =>
        set({
          walletTransactions:
            Array.isArray(transactions)
              ? transactions
              : []
        }),

      addWalletTransaction: (transaction) =>
        set((state) => ({
          walletTransactions: [
            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...transaction
            },

            ...(state.walletTransactions || [])
          ]
        })),

      addWalletBalance: ({
        phone,
        customerName,
        amount,
        reason
      }) => {

        const wallets =
          [...get().wallets]

        const index =
          wallets.findIndex(
            (w) =>
              w.phone === phone
          )

        if (index === -1)
          return false

        wallets[index] = {
          ...wallets[index],

          balance:
            Number(
              wallets[index].balance || 0
            ) +
            Number(amount || 0)
        }

        set({
          wallets
        })

        get().addWalletTransaction({
          phone,
          customerName,

          amount:
            Number(amount || 0),

          type: 'add',

          reason:
            reason || 'إضافة رصيد'
        })

        return true
      },

      deductWalletBalance: ({
        phone,
        customerName,
        amount,
        reason
      }) => {

        const wallets =
          [...get().wallets]

        const index =
          wallets.findIndex(
            (w) =>
              w.phone === phone
          )

        if (index === -1)
          return false

        const balance =
          Number(
            wallets[index].balance || 0
          )

        if (
          balance <
          Number(amount || 0)
        ) {
          return false
        }

        wallets[index] = {
          ...wallets[index],

          balance:
            balance -
            Number(amount || 0)
        }

        set({
          wallets
        })

        get().addWalletTransaction({
          phone,
          customerName,

          amount:
            Number(amount || 0),

          type: 'deduct',

          reason:
            reason || 'خصم رصيد'
        })

        return true
      },

      deleteWallet: (phone) =>
        set((state) => ({
          wallets:
            state.wallets.filter(
              (wallet) =>
                wallet.phone !== phone
            )
        })),

      // ================= AUDIT =================

      auditLogs: [],

      addAuditLog: (log) =>
        set((state) => ({
          auditLogs: [
            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...log
            },

            ...state.auditLogs
          ]
        })),

      // ================= ERP =================

      erpMode: true,

      setERPMode: (value) =>
        set({
          erpMode:
            Boolean(value)
        }),

      // ================= USERS =================

      users: [],

      setUsers: (users) =>
        set({
          users:
            Array.isArray(users)
              ? users
              : []
        }),

      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              id: generateId(),

              active: true,

              permissions:
                rolePermissions[
                  user.role
                ] || [],

              dataScope: 'own',

              allowedPages: [],

              hiddenButtons: [],

              canViewOwnOrdersOnly: true,

              canViewOwnTransfersOnly: true,

              canViewOwnSalesOnly: true,

              canViewOwnProductsOnly: true,

              financeAccess: false,

              walletAccess: false,

              createdAt:
                new Date().toISOString(),

              ...user
            }
          ]
        })),

      // ================= ORDERS =================

      orders: [],

      setOrders: (orders) =>
        set({
          orders:
            Array.isArray(orders)
              ? orders
              : []
        }),

      addOrder: (order) =>

        set((state) => {

          const rate =

            Number(

              useWalletStore
                .getState()
                .cashbackPercentage || 0

            ) / 100

          const commission =

            Number(
              order.total || 0
            ) * rate

          const newOrder = {

            id: generateId(),

            status: 'طلب جديد',

            createdAt:
              new Date().toISOString(),

            ...order

          }

          // ================= MARKET DEMAND =================
          //
          // A successfully created order is a Purchase event.
          //
          // This tracking is intentionally isolated from
          // the order state itself so Market Demand analytics
          // cannot break the checkout/order flow.
          //
          // Technical vehicle compatibility remains completely
          // independent from inventory availability.
          //

          try {

            useMarketDemandStore
              .getState()
              .recordPurchase({

                order:
                  newOrder,

                products:
                  Array.isArray(
                    newOrder.items
                  )
                    ? newOrder.items
                    : [],

                searchContext:
                  newOrder.searchContext ||
                  newOrder.vehicleSearchContext ||
                  {

                    vehicleType:
                      newOrder.vehicleType ||
                      newOrder.vehicle?.type ||
                      '',

                    make:
                      newOrder.make ||
                      newOrder.vehicle?.make ||
                      '',

                    model:
                      newOrder.model ||
                      newOrder.vehicle?.model ||
                      '',

                    year:
                      newOrder.year ||
                      newOrder.vehicle?.year ||
                      '',

                    searchType:
                      newOrder.searchType ||
                      'website',

                    searchQuery:
                      newOrder.searchQuery ||
                      ''

                  }

              })

            console.log(
              '[MarketDemand] Purchase recorded',
              newOrder
            )

          } catch (error) {

            console.error(
              '[MarketDemand] purchase tracking failed:',
              error
            )

          }

          // ================= CASHBACK =================

          if (commission > 0) {

            useWalletStore
              .getState()
              .addWalletBalance({

                phone:
                  order.phone,

                customerName:
                  order.customerName,

                amount:
                  commission,

                reason:
                  'كاش باك من عملية شراء'

              })

          }

          return {

            orders: [

              newOrder,

              ...state.orders

            ]

          }

        }),

      deleteOrder: (orderId) =>

        set((state) => {

          const order =

            state.orders.find(

              (o) =>
                o.id === orderId

            )

          if (!order)
            return {}

          const inventory =
            useInventoryStore.getState()

          ;(order.items || []).forEach(

            (item) => {

              const stockItem =
                inventory.stockItems.find(

                  (s) =>

                    String(
                      s.productId
                    ) ===
                    String(
                      item.productId
                    )

                    ||

                    String(
                      s.productId
                    ) ===
                    String(
                      item.id
                    )

                )

              if (!stockItem)
                return

              inventory.increaseStock({

                itemId:
                  stockItem.id,

                quantity:
                  Number(
                    item.quantity || 1
                  ),

                note:
                  `مرتجع - حذف الطلب ${order.id}`

              })

              inventory.updateStockItem(

                stockItem.id,

                {

                  sold:

                    Math.max(

                      0,

                      Number(
                        stockItem.sold || 0
                      ) -

                      Number(
                        item.quantity || 1
                      )

                    )

                }

              )

            }

          )

          return {

            orders:

              state.orders.filter(

                (o) =>
                  o.id !== orderId

              )

          }

        }),

      // ================= PRODUCTS =================

      products: [],

      setProducts: (products) =>

        set({

          products:

            Array.isArray(products)
              ? products
              : []

        }),

      addProduct: (product) =>

        set((state) => ({

          products: [

            {

              id:
                generateId(),

              createdAt:
                new Date().toISOString(),

              ...product

            },

            ...state.products

          ]

        })),

      updateProduct: (
        id,
        data
      ) =>

        set((state) => ({

          products:

            state.products.map(

              (product) =>

                product.id === id

                  ? {

                      ...product,

                      ...data

                    }

                  : product

            )

        })),

      deleteProduct: (id) =>

        set((state) => ({

          products:

            state.products.filter(

              (product) =>

                product.id !== id

            )

        })),

      // ================= TRANSFERS =================

      transfers: [],

      setTransfers: (transfers) =>

        set({

          transfers:

            Array.isArray(transfers)
              ? transfers
              : []

        }),

      addTransfer: (transfer) =>

        set((state) => ({

          transfers:

            appendListItemWithId(

              state.transfers,

              transfer

            )

        })),

      deleteTransfer: (id) =>

        set((state) => ({

          transfers:

            state.transfers.filter(

              (transfer) =>

                transfer.id !== id

            )

        })),

      // ================= SLIDES =================

      slides: [],

      setSlides: (slides) =>

        set({

          slides:

            Array.isArray(slides)
              ? slides
              : []

        }),

      addSlide: (slide) =>

        set((state) => ({

          slides:

            appendListItemWithId(

              state.slides,

              slide

            )

        })),

      updateSlide: (
        id,
        data
      ) =>

        set((state) => ({

          slides:

            state.slides.map(

              (slide) =>

                slide.id === id

                  ? {

                      ...slide,

                      ...data

                    }

                  : slide

            )

        })),

      deleteSlide: (id) =>

        set((state) => ({

          slides:

            state.slides.filter(

              (slide) =>

                slide.id !== id

            )

        })),

      // ================= OFFERS =================

      offers: [],

      setOffers: (offers) =>

        set({

          offers:

            Array.isArray(offers)
              ? offers
              : []

        }),

      addOffer: (offer) =>

        set((state) => ({

          offers:

            appendListItemWithId(

              state.offers,

              offer

            )

        })),

      updateOffer: (
        id,
        data
      ) =>

        set((state) => ({

          offers:

            state.offers.map(

              (offer) =>

                offer.id === id

                  ? {

                      ...offer,

                      ...data

                    }

                  : offer

            )

        })),

      deleteOffer: (id) =>

        set((state) => ({

          offers:

            state.offers.filter(

              (offer) =>

                offer.id !== id

            )

        })),

      // ================= CART =================

      cart: [],

      addToCart: (item) =>

  set((state) => {

    const cart =
      [...state.cart]

    const index =
      cart.findIndex(

        (i) =>

          String(i.id) ===
          String(item.id)

      )


    // ==================================================
    // MARKET DEMAND CONTEXT
    //
    // Preserve the original search context that caused
    // this product to be added to the cart.
    // ==================================================

    const searchContext = {

      ...(item.searchContext || {}),

      searchType:
        item.searchContext?.searchType ||
        item.searchType ||
        'website',

      searchQuery:
        item.searchContext?.searchQuery ||
        item.searchQuery ||
        '',

      vehicleType:
        item.searchContext?.vehicleType ||
        item.vehicleType ||
        '',

      make:
        item.searchContext?.make ||
        item.make ||
        '',

      model:
        item.searchContext?.model ||
        item.model ||
        '',

      year:
        item.searchContext?.year ||
        item.year ||
        '',

      tireSize:
        item.searchContext?.tireSize ||
        item.tireSize ||
        '',

      capacity:
        item.searchContext?.capacity ||
        item.capacity ||
        '',

      viscosity:
        item.searchContext?.viscosity ||
        item.viscosity ||
        '',

      batteryCapacity:
        item.searchContext?.batteryCapacity ||
        item.batteryCapacity ||
        '',

      oilViscosity:
        item.searchContext?.oilViscosity ||
        item.oilViscosity ||
        ''

    }


    // ==================================================
    // EXISTING CART ITEM
    // ==================================================

    if (index !== -1) {

      const updatedItem = {

        ...cart[index],

        // Keep the original search context if it exists.
        // Otherwise use the context from this add operation.
        searchContext:
          Object.keys(
            cart[index].searchContext || {}
          ).length > 0

            ? cart[index].searchContext

            : searchContext,

        quantity:

          Number(
            cart[index].quantity || 1
          ) + 1

      }


      cart[index] =
        updatedItem


      // ==================================================
      // MARKET DEMAND
      // Record the actual ADD TO CART action.
      // ==================================================

      try {

        useMarketDemandStore
          .getState()
          .recordAddedToCart({

            products: [
              updatedItem
            ],

            searchContext:
              updatedItem.searchContext,

            metadata: {

              source:
                'websiteStore.addToCart',

              cartId:
                updatedItem.cartId,

              quantity:
                updatedItem.quantity,

              action:
                'quantity_increased'

            }

          })

        console.log(
          '[MarketDemand] Added to cart',
          updatedItem
        )

      } catch (error) {

        console.error(
          '[MarketDemand] add-to-cart tracking failed:',
          error
        )

      }


      return {
        cart
      }

    }


    // ==================================================
    // NEW CART ITEM
    // ==================================================

    const cartItem = {

      ...item,

      searchContext,

      // Keep these fields directly available as well.
      searchType:
        searchContext.searchType,

      searchQuery:
        searchContext.searchQuery,

      vehicleType:
        searchContext.vehicleType,

      make:
        searchContext.make,

      model:
        searchContext.model,

      year:
        searchContext.year,

      tireSize:
        searchContext.tireSize,

      capacity:
        searchContext.capacity,

      viscosity:
        searchContext.viscosity,

      quantity:
        1,

      cartId:
        generateId()

    }


    const updatedCart = [

      ...cart,

      cartItem

    ]


    // ==================================================
    // MARKET DEMAND
    // Record the actual ADD TO CART action.
    // ==================================================

    try {

      useMarketDemandStore
        .getState()
        .recordAddedToCart({

          products: [
            cartItem
          ],

          searchContext:
            cartItem.searchContext,

          metadata: {

            source:
              'websiteStore.addToCart',

            cartId:
              cartItem.cartId,

            quantity:
              cartItem.quantity,

            action:
              'new_item'

          }

        })

      console.log(
        '[MarketDemand] Added to cart',
        cartItem
      )

    } catch (error) {

      console.error(
        '[MarketDemand] add-to-cart tracking failed:',
        error
      )

    }


    return {

      cart:
        updatedCart

    }

  }),

      increaseCartQuantity: (cartId) =>

        set((state) => ({

          cart:

            state.cart.map(

              (item) =>

                item.cartId === cartId

                  ? {

                      ...item,

                      quantity:

                        Number(
                          item.quantity || 1
                        ) + 1

                    }

                  : item

            )

        })),

      decreaseCartQuantity: (cartId) =>

        set((state) => ({

          cart:

            state.cart

              .map(

                (item) =>

                  item.cartId === cartId

                    ? {

                        ...item,

                        quantity:

                          Number(
                            item.quantity || 1
                          ) - 1

                      }

                    : item

              )

              .filter(

                (item) =>

                  item.quantity > 0

              )

        })),

      removeFromCart: (cartId) =>

        set((state) => ({

          cart:

            state.cart.filter(

              (item) =>

                item.cartId !== cartId

            )

        })),

      clearCart: () =>

        set({

          cart: []

        }),

      // ================= COMPANY =================

      companyName:
        'شركة العلا للإطارات والبطاريات',

      setCompanyName: (
        companyName
      ) =>

        set({

          companyName

        }),

      logo: '',

      setLogo: (
        logo
      ) =>

        set({

          logo

        }),

      companyPhone: '',

      setCompanyPhone: (
        companyPhone
      ) =>

        set({

          companyPhone

        }),

      companyWhatsapp: '',

      setCompanyWhatsapp: (
        companyWhatsapp
      ) =>

        set({

          companyWhatsapp

        }),

      companyAddress: '',

      setCompanyAddress: (
        companyAddress
      ) =>

        set({

          companyAddress

        }),

      companyFacebook: '',

      setCompanyFacebook: (
        companyFacebook
      ) =>

        set({

          companyFacebook

        }),

      companyInstagram: '',

      setCompanyInstagram: (
        companyInstagram
      ) =>

        set({

          companyInstagram

        }),

      companyYoutube: '',

      setCompanyYoutube: (
        companyYoutube
      ) =>

        set({

          companyYoutube

        }),

      companyEmail: '',

      setCompanyEmail: (
        companyEmail
      ) =>

        set({

          companyEmail

        }),

      // ================= NOTIFICATIONS =================

      notifications: [],

      addNotification: (
        title,
        message
      ) =>

        set((state) => ({

          notifications: [

            {

              id:
                generateId(),

              title,

              message,

              createdAt:
                new Date().toISOString()

            },

            ...state.notifications

          ]

        })),

      // ================= WALLET SYSTEM =================

      walletEnabled: true,

      setWalletEnabled: (
        value
      ) =>

        set({

          walletEnabled:
            Boolean(value)

        }),

      cashbackPercentage: 0,

      setCashbackPercentage: (
        value
      ) =>

        set({

          cashbackPercentage:
            Number(value) || 0

        }),

      walletTransactions: [],

      addWalletTransaction: (
        transaction
      ) =>

        set((state) => ({

          walletTransactions: [

            {

              id:
                generateId(),

              createdAt:
                new Date().toISOString(),

              ...transaction

            },

            ...(state.walletTransactions || [])

          ]

        })),

      addWalletBalance: ({
        phone,
        customerName,
        amount,
        reason
      }) =>

        set((state) => {

          const wallets =
            [...state.wallets]

          const index =
            wallets.findIndex(
              (w) =>
                w.phone === phone
            )

          if (index === -1)
            return {}

          wallets[index] = {

            ...wallets[index],

            balance:
              Number(
                wallets[index].balance || 0
              ) +
              Number(amount || 0)

          }

          return {

            wallets,

            walletTransactions: [

              {

                id:
                  generateId(),

                phone,

                customerName,

                amount:
                  Number(amount || 0),

                type:
                  'add',

                reason,

                createdAt:
                  new Date().toISOString()

              },

              ...(state.walletTransactions || [])

            ]

          }

        }),

      deductWalletBalance: ({
        phone,
        customerName,
        amount,
        reason
      }) =>

        set((state) => {

          const wallets =
            [...state.wallets]

          const index =
            wallets.findIndex(
              (w) =>
                w.phone === phone
            )

          if (index === -1)
            return {}

          wallets[index] = {

            ...wallets[index],

            balance: Math.max(

              0,

              Number(
                wallets[index].balance || 0
              ) -
              Number(amount || 0)

            )

          }

          return {

            wallets,

            walletTransactions: [

              {

                id:
                  generateId(),

                phone,

                customerName,

                amount:
                  Number(amount || 0),

                type:
                  'deduct',

                reason,

                createdAt:
                  new Date().toISOString()

              },

              ...(state.walletTransactions || [])

            ]

          }

        }),

      deleteWallet: (
        phone
      ) =>

        set((state) => ({

          wallets:

            state.wallets.filter(

              (w) =>
                w.phone !== phone

            ),

          walletTransactions:

            (state.walletTransactions || [])
              .filter(

                (t) =>
                  t.phone !== phone

              )

        })),

    }),

    {

      name:
        'elola-store-v4-clean',

      partialize: (state) => ({

        users:
          state.users,

        products:
          state.products,

        orders:
          state.orders,

        transfers:
          state.transfers,

        slides:
          state.slides,

        offers:
          state.offers,

        services:
          state.services,

        videos:
          state.videos,

        wallets:
          state.wallets,

        walletTransactions:
          state.walletTransactions,

        walletEnabled:
          state.walletEnabled,

        cashbackPercentage:
          state.cashbackPercentage,

        permissions:
          state.permissions,

        notifications:
          state.notifications,

        companyName:
          state.companyName,

        logo:
          state.logo,

        companyPhone:
          state.companyPhone,

        companyWhatsapp:
          state.companyWhatsapp,

        companyAddress:
          state.companyAddress,

        companyFacebook:
          state.companyFacebook,

        companyInstagram:
          state.companyInstagram,

        companyYoutube:
          state.companyYoutube,

        companyEmail:
          state.companyEmail

      }),

      onRehydrateStorage:
        () => (state) => {

          if (state) {

            state.setHydrated(
              true
            )

          }

        }

    }

  )

)