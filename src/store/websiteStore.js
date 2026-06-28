import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

  branch: ['branch_dashboard', 'products_view', 'orders_view'],
  shop: ['shop_dashboard', 'products_view', 'orders_view'],
  service: ['service_dashboard', 'products_view'],
  cashier: ['orders_view', 'orders_create']
}

// ================= OWNER =================

const defaultOwner = {
  id: 'owner',
  username: 'owner',
  password: 'owner123',
  role: 'owner',
  warehouseId: 'all',
  warehouseName: 'الإدارة الرئيسية',
  active: true,
  permissions: ['all'],
  financeAccess: true,
  walletAccess: true,
  createdAt: new Date().toISOString()
}

export const useWebsiteStore = create(
  persist(
    (set, get) => ({

      // ================= SYSTEM =================
      hydrated: true,
      setHydrated: (value) => set({ hydrated: value }),

      aiSystemEnabled: true,
      setAiSystemEnabled: (value) =>
        set({ aiSystemEnabled: Boolean(value) }),

      rolePermissions,

      // ================= AUTH =================
      currentUser: defaultOwner,
      setCurrentUser: (user) => set({ currentUser: user }),

      logout: () => set({ currentUser: defaultOwner }),
      // ================= AUTH =================

login: (username, password) => {

  const user = get().users.find(
    (u) =>
      u.username === username &&
      u.password === password &&
      u.active !== false
  )

  if (!user) return false

  set({
    currentUser: user
  })

  return true
},

logout: () =>
  set({
    currentUser: null
  }),

// ================= SYSTEM =================

maintenanceMode: false,

setMaintenanceMode: (value) =>
  set({
    maintenanceMode: Boolean(value)
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
    services: [
      {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...service
      },
      ...state.services
    ]
  })),

deleteService: (id) =>
  set((state) => ({
    services: state.services.filter(
      (s) => s.id !== id
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
    videos: [
      {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...video
      },
      ...state.videos
    ]
  })),

deleteVideo: (id) =>
  set((state) => ({
    videos: state.videos.filter(
      (v) => v.id !== id
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
        createdAt: new Date().toISOString(),
        ...wallet
      },
      ...state.wallets
    ]
  })),

// ================= AUDIT =================

auditLogs: [],

addAuditLog: (log) =>
  set((state) => ({
    auditLogs: [
      {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...log
      },
      ...state.auditLogs
    ]
  })),

// ================= ERP =================

erpMode: true,

setERPMode: (value) =>
  set({
    erpMode: Boolean(value)
  }),
      // ================= USERS =================
      users: [defaultOwner],

      setUsers: (users) =>
        set({ users: Array.isArray(users) ? users : [] }),

      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              id: generateId(),
              active: true,
              permissions: rolePermissions[user.role] || [],

              dataScope: 'own',
              allowedPages: [],
              hiddenButtons: [],

              canViewOwnOrdersOnly: true,
              canViewOwnTransfersOnly: true,
              canViewOwnSalesOnly: true,
              canViewOwnProductsOnly: true,

              financeAccess: false,
              walletAccess: false,

              createdAt: new Date().toISOString(),
              ...user
            }
          ]
        })),

      // ================= ORDERS (FIXED) =================
      orders: [],

      setOrders: (orders) =>
        set({ orders: Array.isArray(orders) ? orders : [] }),

      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              id: generateId(),
              status: 'طلب جديد',
              createdAt: new Date().toISOString(),
              ...order
            },
            ...state.orders
          ]
        })),

      // ❗ FIX: MISSING FUNCTIONS (سبب الشاشة السوداء)
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id)
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          )
        })),

      // ================= PRODUCTS =================
      products: [],
      setProducts: (products) =>
        set({ products: Array.isArray(products) ? products : [] }),

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { id: generateId(), ...product }
          ]
        })),

      // ================= TRANSFERS =================
      transfers: [],
      setTransfers: (t) =>
        set({ transfers: Array.isArray(t) ? t : [] }),

      addTransfer: (transfer) =>
        set((state) => ({
          transfers: [
            {
              id: generateId(),
              createdAt: new Date().toISOString(),
              ...transfer
            },
            ...state.transfers
          ]
        })),

      // ================= SLIDES =================
      slides: [],

      setSlides: (slides) =>
        set({ slides: Array.isArray(slides) ? slides : [] }),

      addSlide: (slide) =>
        set((state) => ({
          slides: [
            {
              id: generateId(),
              createdAt: new Date().toISOString(),
              ...slide
            },
            ...state.slides
          ]
        })),

      deleteSlide: (id) =>
        set((state) => ({
          slides: state.slides.filter((s) => s.id !== id)
        })),

      // ================= OFFERS =================
      offers: [],

      setOffers: (offers) =>
        set({ offers: Array.isArray(offers) ? offers : [] }),

      addOffer: (offer) =>
        set((state) => ({
          offers: [
            {
              id: generateId(),
              createdAt: new Date().toISOString(),
              ...offer
            },
            ...state.offers
          ]
        })),
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
    services: [
      {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...service
      },
      ...state.services
    ]
  })),

deleteService: (id) =>
  set((state) => ({
    services:
      state.services.filter(
        (s) => s.id !== id
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
    videos: [
      {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...video
      },
      ...state.videos
    ]
  })),

deleteVideo: (id) =>
  set((state) => ({
    videos:
      state.videos.filter(
        (v) => v.id !== id
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
        createdAt: new Date().toISOString(),
        ...wallet
      },
      ...state.wallets
    ]
  })),
       // ================= CART =================

cart: [],

addToCart: (item) =>
  set((state) => ({
    cart: [
      ...state.cart,
      {
        ...item,
        cartId: generateId()
      }
    ]
  })),

removeFromCart: (cartId) =>
  set((state) => ({
    cart: state.cart.filter(
      (item) => item.cartId !== cartId
    )
  })),

clearCart: () =>
  set({ cart: [] }),

// ================= OFFERS DELETE =================

deleteOffer: (id) =>
  set((state) => ({
    offers: state.offers.filter(
      (offer) => offer.id !== id
    )
  })),
            // ================= COMPANY =================

      companyName: 'شركة العلا للإطارات والبطاريات',
      setCompanyName: (companyName) =>
        set({ companyName }),

      logo: '',
      setLogo: (logo) =>
        set({ logo }),

      companyPhone: '',
      setCompanyPhone: (companyPhone) =>
        set({ companyPhone }),

      companyWhatsapp: '',
      setCompanyWhatsapp: (companyWhatsapp) =>
        set({ companyWhatsapp }),

      companyAddress: '',
      setCompanyAddress: (companyAddress) =>
        set({ companyAddress }),

      companyFacebook: '',
      setCompanyFacebook: (companyFacebook) =>
        set({ companyFacebook }),

      companyInstagram: '',
      setCompanyInstagram: (companyInstagram) =>
        set({ companyInstagram }),

      companyYoutube: '',
      setCompanyYoutube: (companyYoutube) =>
        set({ companyYoutube }),

      companyEmail: '',
      setCompanyEmail: (companyEmail) =>
        set({ companyEmail }),

      // ================= NOTIFICATIONS =================
      notifications: [],

      addNotification: (title, message) =>
        set((state) => ({
          notifications: [
            {
              id: generateId(),
              title,
              message,
              createdAt: new Date().toISOString()
            },
            ...state.notifications
          ]
        }))
    }),
{
  name: 'elola-store-v4-clean',

  partialize: (state) => ({

    currentUser: state.currentUser,

    users: state.users,

    products: state.products,

    orders: state.orders,

    transfers: state.transfers,

    slides: state.slides,

    offers: state.offers,

    services: state.services,

    videos: state.videos,

    wallets: state.wallets,

    permissions: state.permissions,

    companyName: state.companyName,

    logo: state.logo,

    companyPhone: state.companyPhone,

    companyWhatsapp: state.companyWhatsapp,

    companyAddress: state.companyAddress,

    companyFacebook: state.companyFacebook,

    companyInstagram: state.companyInstagram,

    companyYoutube: state.companyYoutube,

    companyEmail: state.companyEmail

  })

}
  )
)