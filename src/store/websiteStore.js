import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWebsiteStore = create(

  persist(

    (set) => ({

      // COMPANY

      companyName: 'شركة العلا للإطارات والبطاريات',

      logo: '',

      setCompanyName: (name) =>
        set({
          companyName: name
        }),

      setLogo: (logo) =>
        set({
          logo
        }),

      // SLIDES

      slides: [],

      addSlide: (slide) =>
        set((state) => ({
          slides: [...state.slides, slide]
        })),

      deleteSlide: (index) =>
        set((state) => ({
          slides: state.slides.filter(
            (_, i) => i !== index
          )
        })),

      // PRODUCTS

      products: [],

      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product]
        })),

      deleteProduct: (index) =>
        set((state) => ({
          products: state.products.filter(
            (_, i) => i !== index
          )
        })),

      // CART

      cart: [],

      addToCart: (product) =>
        set((state) => ({
          cart: [...state.cart, product]
        })),

      removeFromCart: (index) =>
        set((state) => ({
          cart: state.cart.filter(
            (_, i) => i !== index
          )
        })),

      clearCart: () =>
        set({
          cart: []
        }),

      // ORDERS

      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order]
        })),

      deleteOrder: (index) =>
        set((state) => ({
          orders: state.orders.filter(
            (_, i) => i !== index
          )
        })),

      // OFFERS

      offers: [],

      addOffer: (offer) =>
        set((state) => ({
          offers: [...state.offers, offer]
        })),

      deleteOffer: (index) =>
        set((state) => ({
          offers: state.offers.filter(
            (_, i) => i !== index
          )
        })),

      // SERVICES

      services: [],

      addService: (service) =>
        set((state) => ({
          services: [...state.services, service]
        })),

      deleteService: (index) =>
        set((state) => ({
          services: state.services.filter(
            (_, i) => i !== index
          )
        })),

      // VIDEOS

      videos: [],

      addVideo: (video) =>
        set((state) => ({
          videos: [...state.videos, video]
        })),

      deleteVideo: (index) =>
        set((state) => ({
          videos: state.videos.filter(
            (_, i) => i !== index
          )
        }))

    }),

    {
      name: 'elola-storage'
    }

  )

)