import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => Date.now() + Math.random()

export const useWebsiteStore = create(
  persist(
    (set) => ({

      // ================= COMPANY =================

      companyName: 'شركة العلا للإطارات والبطاريات',
      logo: '',

      setCompanyName: (name) => set({ companyName: name }),
      setLogo: (logo) => set({ logo }),

      // ================= SLIDES =================

      slides: [],

      addSlide: (slide) =>
        set((state) => ({
          slides: [
            ...state.slides,
            { id: generateId(), ...slide }
          ]
        })),

      deleteSlide: (id) =>
        set((state) => ({
          slides: state.slides.filter(s => s.id !== id)
        })),

      // ================= PRODUCTS =================

      products: [],

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            { id: generateId(), ...product }
          ]
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        })),

      // ================= OFFERS =================

      offers: [],

      addOffer: (offer) =>
        set((state) => ({
          offers: [
            ...state.offers,
            { id: generateId(), ...offer }
          ]
        })),

      deleteOffer: (id) =>
        set((state) => ({
          offers: state.offers.filter(o => o.id !== id)
        })),

      // ================= SERVICES =================

      services: [],

      addService: (service) =>
        set((state) => ({
          services: [
            ...state.services,
            { id: generateId(), ...service }
          ]
        })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter(s => s.id !== id)
        })),

      // ================= VIDEOS =================

      videos: [],

      addVideo: (video) =>
        set((state) => ({
          videos: [
            ...state.videos,
            { id: generateId(), ...video }
          ]
        })),

      deleteVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter(v => v.id !== id)
        })),

      // ================= CART =================

      cart: [],

      addToCart: (product) =>
        set((state) => ({
          cart: [
            ...state.cart,
            { id: generateId(), ...product }
          ]
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        })),

      clearCart: () => set({ cart: [] }),

      // ================= ORDERS =================

      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            { id: generateId(), ...order }
          ]
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter(o => o.id !== id)
        }))

    }),

    {
      name: 'elola-storage'
    }
  )
)