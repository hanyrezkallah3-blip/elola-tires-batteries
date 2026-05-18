import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () =>
  Date.now() + Math.random()

export const useWebsiteStore = create(

  persist(

    (set, get) => ({

      // ================= HYDRATION =================

      hydrated: false,

      setHydrated: (value) =>
        set({
          hydrated: value
        }),

      // ================= COMPANY =================

      companyName:
        'شركة العلا للإطارات والبطاريات',

      logo: '',

      companyPhone: '',

      companyWhatsapp: '',

      companyAddress: '',

      companyEmail: '',

      companyFacebook: '',

      companyInstagram: '',

      companyYoutube: '',

      // ================= COMPANY SETTERS =================

      setCompanyName: (name) =>
        set({
          companyName: name || ''
        }),

      setLogo: (logo) =>
        set({
          logo: logo || ''
        }),

      setCompanyPhone: (phone) =>
        set({
          companyPhone: phone || ''
        }),

      setCompanyWhatsapp: (whatsapp) =>
        set({
          companyWhatsapp: whatsapp || ''
        }),

      setCompanyAddress: (address) =>
        set({
          companyAddress: address || ''
        }),

      setCompanyEmail: (email) =>
        set({
          companyEmail: email || ''
        }),

      setCompanyFacebook: (facebook) =>
        set({
          companyFacebook: facebook || ''
        }),

      setCompanyInstagram: (instagram) =>
        set({
          companyInstagram: instagram || ''
        }),

      setCompanyYoutube: (youtube) =>
        set({
          companyYoutube: youtube || ''
        }),

      // ================= USERS =================

      users: [

        {
          id: 'owner',

          username: 'owner',

          password: 'owner123',

          role: 'owner',

          warehouseId: 'all',

          permissions: ['all']
        }

      ],

      currentUser: null,

      login: (username, password) => {

        const user = get().users.find(

          (u) =>

            u.username === username &&

            u.password === password

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

      getCurrentWarehouseId: () => {

        const user =
          get().currentUser

        if (!user) return null

        if (user.role === 'owner') {

          return 'all'

        }

        return user.warehouseId
      },

      // ================= STOCK HISTORY =================

      stockHistory: [],

      addStockHistory: (history) =>

        set((state) => ({

          stockHistory: [

            ...state.stockHistory,

            {

              id: generateId(),

              createdAt:
                new Date().toISOString(),

              warehouseId:
                get().getCurrentWarehouseId(),

              ...history

            }

          ]

        })),

      // ================= PRODUCTS =================

      products: [],

      addProduct: (product) => {

        const newProduct = {

          id: generateId(),

          name: product.name || '',

          price: product.price || '',

          image: product.image || '',

          stock:
            Number(product.stock) || 0,

          hidden:
            product.hidden || false,

          sold:
            Number(product.sold) || 0,

          warehouseId:
            get().getCurrentWarehouseId(),

          createdAt:
            new Date().toISOString()

        }

        get().addStockHistory({

          type: 'ADD_PRODUCT',

          action: 'إضافة منتج',

          productName:
            newProduct.name,

          quantity:
            newProduct.stock,

          fromWarehouse: '-',

          toWarehouse:
            newProduct.warehouseId

        })

        set((state) => ({

          products: [

            ...state.products,

            newProduct

          ]

        }))
      },

      updateProductStock: (
        productId,
        change
      ) => {

        const state = get()

        const product =
          state.products.find(
            (p) => p.id === productId
          )

        if (!product) return

        get().addStockHistory({

          type: 'UPDATE_STOCK',

          action: 'تعديل مخزون',

          productName:
            product.name,

          quantity: change,

          fromWarehouse:
            product.warehouseId,

          toWarehouse:
            product.warehouseId

        })

        set((state) => ({

          products:
            state.products.map((p) =>

              p.id === productId

                ? {

                    ...p,

                    stock: Math.max(

                      0,

                      (p.stock || 0) + change

                    )

                  }

                : p

            )

        }))
      },

      // ================= CART =================

      cart: [],

      addToCart: (product) =>

        set((state) => ({

          cart: [

            ...state.cart,

            {
              ...product,
              cartId: generateId()
            }

          ]

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

      // ================= ORDERS =================

      orders: [],

      addOrder: (order) =>

        set((state) => ({

          orders: [

            ...state.orders,

            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              status: 'جديد',

              ...order
            }

          ]

        })),

      // ================= WEBSITE CONTENT =================

      slides: [],

      offers: [],

      services: [],

      videos: [],

      // ================= SLIDES =================

      addSlide: (slide) =>

        set((state) => ({

          slides: [

            ...state.slides,

            {

              id: generateId(),

              image: slide.image || '',

              createdAt:
                new Date().toISOString()

            }

          ]

        })),

      deleteSlide: (id) =>

        set((state) => ({

          slides:
            state.slides.filter(
              (slide) => slide.id !== id
            )

        })),

      setSlides: (slides) =>
        set({
          slides: slides || []
        }),

      // ================= OFFERS =================

      addOffer: (offer) =>

        set((state) => ({

          offers: [

            ...state.offers,

            {

              id: generateId(),

              ...offer,

              createdAt:
                new Date().toISOString()

            }

          ]

        })),

      deleteOffer: (id) =>

        set((state) => ({

          offers:
            state.offers.filter(
              (offer) => offer.id !== id
            )

        })),

      setOffers: (offers) =>
        set({
          offers: offers || []
        }),

      // ================= SERVICES =================

      addService: (service) =>

        set((state) => ({

          services: [

            ...state.services,

            {

              id: generateId(),

              ...service,

              createdAt:
                new Date().toISOString()

            }

          ]

        })),

      deleteService: (id) =>

        set((state) => ({

          services:
            state.services.filter(
              (service) => service.id !== id
            )

        })),

      setServices: (services) =>
        set({
          services: services || []
        }),

      // ================= VIDEOS =================

      addVideo: (video) =>

        set((state) => ({

          videos: [

            ...state.videos,

            {

              id: generateId(),

              ...video,

              createdAt:
                new Date().toISOString()

            }

          ]

        })),

      deleteVideo: (id) =>

        set((state) => ({

          videos:
            state.videos.filter(
              (video) => video.id !== id
            )

        })),

      setVideos: (videos) =>
        set({
          videos: videos || []
        }),

      // ================= TRANSFERS =================

      transfers: [],

      transferProductQuantity: ({
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity
      }) => {

        const state = get()

        const product =
          state.products.find(

            (p) =>

              p.id === productId &&

              p.warehouseId ===
                fromWarehouseId

          )

        if (!product) {

          alert(
            '❌ المنتج غير موجود'
          )

          return
        }

        if (product.stock < quantity) {

          alert(
            '❌ الكمية غير متوفرة'
          )

          return
        }

        const updatedProducts =
          state.products.map((p) => {

            if (

              p.id === productId &&

              p.warehouseId ===
                fromWarehouseId

            ) {

              return {

                ...p,

                stock:
                  p.stock - quantity

              }
            }

            return p
          })

        const targetIndex =
          updatedProducts.findIndex(

            (p) =>

              p.name === product.name &&

              p.warehouseId ===
                toWarehouseId

          )

        if (targetIndex !== -1) {

          updatedProducts[targetIndex] = {

            ...updatedProducts[targetIndex],

            stock:

              updatedProducts[targetIndex]
                .stock + quantity

          }

        } else {

          updatedProducts.push({

            id: generateId(),

            name: product.name,

            price: product.price || '',

            image: product.image || '',

            stock: quantity,

            hidden:
              product.hidden || false,

            warehouseId:
              toWarehouseId,

            createdAt:
              new Date().toISOString()

          })

        }

        set((state) => ({

          products:
            updatedProducts,

          transfers: [

            ...state.transfers,

            {

              id: generateId(),

              productId,

              quantity,

              fromWarehouseId,

              toWarehouseId,

              createdAt:
                new Date().toISOString()

            }

          ]

        }))
      },

      // ================= ANALYTICS =================

      getWarehouseStats: () => {

        const products =
          get().products

        const orders =
          get().orders || []

        const totalSales =
          orders.reduce(

            (acc, o) =>

              acc +
              Number(o.total || 0),

            0

          )

        return {

          products:
            products.length,

          orders:
            orders.length,

          sales:
            totalSales

        }
      }

    }),

    {

      name: 'elola-storage',

      onRehydrateStorage: () => (state) => {

        if (state) {

          state.setHydrated(true)

        }

      }

    }

  )

)