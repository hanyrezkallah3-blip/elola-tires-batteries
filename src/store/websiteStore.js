import { create } from 'zustand'

import { persist }
  from 'zustand/middleware'

const generateId = () =>
  Date.now() + Math.random()

export const useWebsiteStore = create(

  persist(

    (set, get) => ({

      // ================= COMPANY =================

      companyName:
        'شركة العلا للإطارات والبطاريات',

      logo: '',

      companyPhone: '',

      companyWhatsapp: '',

      companyAddress: '',

      companyFacebook: '',

      companyInstagram: '',

      companyYoutube: '',

      companyEmail: '',

      setCompanyName: (name) =>
        set({
          companyName: name
        }),

      setLogo: (logo) =>
        set({
          logo
        }),

      setCompanyPhone: (phone) =>
        set({
          companyPhone: phone
        }),

      setCompanyWhatsapp: (
        whatsapp
      ) =>
        set({
          companyWhatsapp:
            whatsapp
        }),

      setCompanyAddress: (
        address
      ) =>
        set({
          companyAddress:
            address
        }),

      setCompanyFacebook: (
        facebook
      ) =>
        set({
          companyFacebook:
            facebook
        }),

      setCompanyInstagram: (
        instagram
      ) =>
        set({
          companyInstagram:
            instagram
        }),

      setCompanyYoutube: (
        youtube
      ) =>
        set({
          companyYoutube:
            youtube
        }),

      setCompanyEmail: (
        email
      ) =>
        set({
          companyEmail: email
        }),

      // ================= SLIDES =================

      slides: [],

      addSlide: (slide) =>

        set((state) => ({

          slides: [

            ...state.slides,

            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...slide
            }

          ]

        })),

      deleteSlide: (id) =>

        set((state) => ({

          slides:
            state.slides.filter(

              (slide) =>
                slide.id !== id

            )

        })),

      // ================= PRODUCTS =================

      products: [],

      addProduct: (product) =>

        set((state) => ({

          products: [

            ...state.products,

            {

              id: generateId(),

              createdAt:
                new Date().toISOString(),

              updatedAt:
                new Date().toISOString(),

              stock:
                Number(
                  product.stock
                ) || 0,

              sold: 0,

              hidden: false,

              featured: false,

              category:
                product.category ||
                'عام',

              ...product

            }

          ]

        })),

      // ================= DELETE PRODUCT =================

      deleteProduct: (id) =>

        set((state) => ({

          products:
            state.products.filter(

              (product) =>
                product.id !== id

            )

        })),

      // ================= UPDATE PRODUCT STOCK =================

      updateProductStock: (
        id,
        quantity
      ) =>

        set((state) => ({

          products:
            state.products.map(

              (product) =>

                product.id === id

                  ? {

                      ...product,

                      stock:
                        Math.max(
                          0,
                          Number(
                            quantity
                          )
                        ),

                      updatedAt:
                        new Date().toISOString()

                    }

                  : product

            )

        })),

      // ================= TOGGLE PRODUCT =================

      toggleProductVisibility: (
        id
      ) =>

        set((state) => ({

          products:
            state.products.map(

              (product) =>

                product.id === id

                  ? {

                      ...product,

                      hidden:
                        !product.hidden

                    }

                  : product

            )

        })),

      // ================= FEATURE PRODUCT =================

      toggleFeaturedProduct: (
        id
      ) =>

        set((state) => ({

          products:
            state.products.map(

              (product) =>

                product.id === id

                  ? {

                      ...product,

                      featured:
                        !product.featured

                    }

                  : product

            )

        })),

      // ================= INCREASE SOLD =================

      increaseSold: (
        id,
        quantity = 1
      ) =>

        set((state) => ({

          products:
            state.products.map(

              (product) => {

                if (
                  product.id === id
                ) {

                  const currentStock =
                    Number(
                      product.stock || 0
                    )

                  const currentSold =
                    Number(
                      product.sold || 0
                    )

                  return {

                    ...product,

                    sold:
                      currentSold +
                      quantity,

                    stock:
                      Math.max(
                        0,
                        currentStock -
                          quantity
                      )

                  }

                }

                return product

              }

            )

        })),

      // ================= OFFERS =================

      offers: [],

      addOffer: (offer) =>

        set((state) => ({

          offers: [

            ...state.offers,

            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...offer
            }

          ]

        })),

      deleteOffer: (id) =>

        set((state) => ({

          offers:
            state.offers.filter(

              (offer) =>
                offer.id !== id

            )

        })),

      // ================= SERVICES =================

      services: [],

      addService: (service) =>

        set((state) => ({

          services: [

            ...state.services,

            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...service
            }

          ]

        })),

      deleteService: (id) =>

        set((state) => ({

          services:
            state.services.filter(

              (service) =>
                service.id !== id

            )

        })),

      // ================= VIDEOS =================

      videos: [],

      addVideo: (video) =>

        set((state) => ({

          videos: [

            ...state.videos,

            {
              id: generateId(),

              createdAt:
                new Date().toISOString(),

              ...video
            }

          ]

        })),

      deleteVideo: (id) =>

        set((state) => ({

          videos:
            state.videos.filter(

              (video) =>
                video.id !== id

            )

        })),

      // ================= CART =================

      cart: [],

      addToCart: (product) => {

        const currentProducts =
          get().products

        const foundProduct =
          currentProducts.find(

            (p) =>
              p.id === product.id

          )

        if (!foundProduct) {

          alert(
            'المنتج غير موجود'
          )

          return

        }

        if (
          foundProduct.hidden
        ) {

          alert(
            'المنتج غير متاح حالياً'
          )

          return

        }

        if (
          Number(
            foundProduct.stock || 0
          ) <= 0
        ) {

          alert(
            'المنتج غير متوفر حالياً'
          )

          return

        }

        const cartItems =
          get().cart.filter(

            (item) =>
              item.id === product.id

          )

        if (

          cartItems.length >=

          Number(
            foundProduct.stock
          )

        ) {

          alert(
            'لا توجد كمية كافية بالمخزن'
          )

          return

        }

        set((state) => ({

          cart: [

            ...state.cart,

            {

              cartId:
                generateId(),

              quantity: 1,

              ...product

            }

          ]

        }))

      },

      removeFromCart: (
        cartId
      ) =>

        set((state) => ({

          cart:
            state.cart.filter(

              (item) =>
                item.cartId !==
                cartId

            )

        })),

      clearCart: () =>

        set({
          cart: []
        }),

      // ================= ORDERS =================

      orders: [],

      addOrder: (order) => {

        const currentProducts =
          get().products

        let updatedProducts =
          [...currentProducts]

        let validItems = []

        for (const item of order.items) {

          const productIndex =
            updatedProducts.findIndex(

              (p) =>
                p.id === item.id

            )

          if (
            productIndex === -1
          )
            continue

          const product =
            updatedProducts[
              productIndex
            ]

          const currentStock =
            Number(
              product.stock || 0
            )

          if (currentStock <= 0)
            continue

          updatedProducts[
            productIndex
          ] = {

            ...product,

            sold:
              Number(
                product.sold || 0
              ) + 1,

            stock:
              Math.max(
                0,
                currentStock - 1
              )

          }

          validItems.push(item)

        }

        if (
          validItems.length === 0
        ) {

          alert(
            'لا توجد منتجات متاحة لإتمام الطلب'
          )

          return

        }

        const updatedOrder = {

          id: generateId(),

          status: 'طلب جديد',

          createdAt:
            new Date().toISOString(),

          ...order,

          items: validItems

        }

        set((state) => ({

          products:
            updatedProducts,

          orders: [

            ...state.orders,

            updatedOrder

          ],

          cart: []

        }))

        alert(
          'تم تسجيل الطلب بنجاح'
        )

      },

      // ================= DELETE ORDER =================

      deleteOrder: (id) =>

        set((state) => ({

          orders:
            state.orders.filter(

              (order) =>
                order.id !== id

            )

        })),

      // ================= ORDER STATUS =================

      updateOrderStatus: (
        id,
        status
      ) =>

        set((state) => ({

          orders:
            state.orders.map(

              (order) =>

                order.id === id

                  ? {

                      ...order,

                      status

                    }

                  : order

            )

        })),

      // ================= ANALYTICS =================

      getTotalSales: () => {

        const orders =
          get().orders

        return orders.reduce(

          (acc, order) =>

            acc +

            Number(
              order.total || 0
            ),

          0

        )

      },

      getTotalProductsSold:
        () => {

          const products =
            get().products

          return products.reduce(

            (acc, product) =>

              acc +

              Number(
                product.sold || 0
              ),

            0

          )

        },

      getLowStockProducts:
        () => {

          const products =
            get().products

          return products.filter(

            (product) =>

              Number(
                product.stock || 0
              ) <= 3

          )

        },

      // ================= TOP PRODUCT =================

      getTopProduct: () => {

        const products =
          get().products

        if (
          products.length === 0
        )
          return null

        return [...products].sort(

          (a, b) =>

            Number(
              b.sold || 0
            ) -

            Number(
              a.sold || 0
            )

        )[0]

      },

      // ================= TOTAL STOCK =================

      getTotalStock: () => {

        const products =
          get().products

        return products.reduce(

          (acc, product) =>

            acc +

            Number(
              product.stock || 0
            ),

          0

        )

      },

      // ================= TOTAL PRODUCTS =================

      getTotalProducts:
        () =>

          get().products.length,

      // ================= TOTAL ORDERS =================

      getTotalOrders:
        () =>

          get().orders.length

    }),

    {
      name: 'elola-storage'
    }

  )

)