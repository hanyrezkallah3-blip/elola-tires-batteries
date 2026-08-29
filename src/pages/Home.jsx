import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useWebsiteStore } from '../store/websiteStore'

import Cart from '../components/Cart'

import HomeHeader from '../components/home/HomeHeader'
import HomeNavigation from '../components/home/HomeNavigation'
import HomeCompanyInfo from '../components/home/HomeCompanyInfo'
import HomeVehicleSearch from '../components/home/HomeVehicleSearch'
import HomeSlider from '../components/home/HomeSlider'
import HomeProducts from '../components/home/HomeProducts'
import HomeOffers from '../components/home/HomeOffers'
import HomeServices from '../components/home/HomeServices'
import HomeVideos from '../components/home/HomeVideos'
import HomeFooter from '../components/home/HomeFooter'

import { useWarehouseStore } from '../store/warehouseStore'


export default function Home() {

  // ====================================================
  // WEBSITE DATA
  // ====================================================

  const slides =
    useWebsiteStore(
      state => state.slides || []
    )

  const products =
    useWebsiteStore(
      state => state.products || []
    )

  const offers =
    useWebsiteStore(
      state => state.offers || []
    )

  const services =
    useWebsiteStore(
      state => state.services || []
    )

  const videos =
    useWebsiteStore(
      state => state.videos || []
    )


  // ====================================================
  // COMPANY DATA
  // ====================================================

  const companyName =
    useWebsiteStore(
      state => state.companyName
    )

  const logo =
    useWebsiteStore(
      state => state.logo
    )

  const companyPhone =
    useWebsiteStore(
      state => state.companyPhone
    )

  const companyWhatsapp =
    useWebsiteStore(
      state => state.companyWhatsapp
    )

  const companyAddress =
    useWebsiteStore(
      state => state.companyAddress
    )

  const companyFacebook =
    useWebsiteStore(
      state => state.companyFacebook
    )

  const companyInstagram =
    useWebsiteStore(
      state => state.companyInstagram
    )

  const companyYoutube =
    useWebsiteStore(
      state => state.companyYoutube
    )

  const companyEmail =
    useWebsiteStore(
      state => state.companyEmail
    )


  // ====================================================
  // CART
  // ====================================================

  const addToCart =
    useWebsiteStore(
      state => state.addToCart
    )

  const cart =
    useWebsiteStore(
      state => state.cart || []
    )

  const hydrated =
    useWebsiteStore(
      state => state.hydrated
    )


  // ====================================================
  // WAREHOUSES
  // ====================================================

  const warehouses =
    useWarehouseStore(
      state =>
        Array.isArray(state.warehouses)
          ? state.warehouses
          : []
    )


  // ====================================================
  // WAREHOUSE PRODUCTS
  //
  // Warehouses are the source of:
  // - Products available for sale
  // - Sale price when there is no active website offer
  // - Actual availability
  //
  // Internal warehouse information is never exposed
  // to the customer.
  // ====================================================

  const warehouseProducts =
    useMemo(() => {

      return warehouses.flatMap(
        warehouse => {

          if (
            !Array.isArray(
              warehouse?.products
            )
          ) {
            return []
          }

          return warehouse.products.map(
            product => ({

              ...product,

              warehouseId:
                warehouse?.id ?? null,

              warehouseName:
                warehouse?.name ?? ''

            })
          )

        }
      )

    }, [warehouses])


  // ====================================================
  // WAREHOUSE PRODUCT INDEX
  //
  // Same product can exist in multiple warehouses.
  //
  // The index keeps:
  // - One public product source
  // - Total quantity
  // - The first usable warehouse product as the
  //   base product data
  //
  // Warehouse-specific data remains internal.
  // ====================================================

  const warehouseProductIndex =
    useMemo(() => {

      const index =
        new Map()

      warehouseProducts.forEach(
        warehouseProduct => {

          const productId =
            warehouseProduct?.productId ??
            warehouseProduct?.id

          if (
            productId === null ||
            productId === undefined
          ) {
            return
          }

          const key =
            String(productId)

          const quantity =
            Number(
              warehouseProduct?.quantity ??
              warehouseProduct?.stock ??
              warehouseProduct?.availableQuantity ??
              0
            )

          const safeQuantity =
            Number.isFinite(quantity)
              ? Math.max(quantity, 0)
              : 0

          const existing =
            index.get(key)

          if (!existing) {

            index.set(
              key,
              {
                product:
                  warehouseProduct,

                totalQuantity:
                  safeQuantity
              }
            )

            return

          }

          existing.totalQuantity +=
            safeQuantity

        }
      )

      return index

    }, [warehouseProducts])


  // ====================================================
  // ACTIVE OFFERS INDEX
  // ====================================================

  const activeOffersByProduct =
    useMemo(() => {

      const map =
        new Map()

      const currentDate =
        new Date()

      offers.forEach(
        offer => {

          if (
            !offer ||
            offer.active === false
          ) {
            return
          }

          const productId =
            offer.productId

          if (
            productId === null ||
            productId === undefined
          ) {
            return
          }


          // --------------------------------------------
          // START DATE
          // --------------------------------------------

          if (offer.startDate) {

            const start =
              new Date(
                offer.startDate
              )

            if (
              !Number.isNaN(
                start.getTime()
              ) &&
              currentDate < start
            ) {
              return
            }

          }


          // --------------------------------------------
          // END DATE
          // --------------------------------------------

          if (offer.endDate) {

            const end =
              new Date(
                offer.endDate
              )

            if (
              !Number.isNaN(
                end.getTime()
              ) &&
              currentDate > end
            ) {
              return
            }

          }


          const key =
            String(productId)


          if (!map.has(key)) {

            map.set(
              key,
              offer
            )

          }

        }
      )

      return map

    }, [offers])


  // ====================================================
  // WEBSITE PRODUCT INDEX
  //
  // Website products are used ONLY as a reference for:
  // - Active offers
  //
  // The normal sale price remains the warehouse price.
  // ====================================================

  const websiteProductIndex =
    useMemo(() => {

      const map =
        new Map()

      products.forEach(
        product => {

          if (!product) {
            return
          }

          const productId =
            product.id ??
            product.productId

          if (
            productId === null ||
            productId === undefined
          ) {
            return
          }

          map.set(
            String(productId),
            product
          )

        }
      )

      return map

    }, [products])


  // ====================================================
  // PUBLIC PRODUCT VIEW
  //
  // SOURCE:
  //   Warehouse products
  //
  // PRICE:
  //   Warehouse salePrice normally
  //
  // ACTIVE WEBSITE OFFER:
  //   Website product salePrice becomes the old/base
  //   price and the website offer determines the final
  //   price.
  //
  // AVAILABILITY:
  //   Total stock across all warehouses.
  //
  // INTERNAL DATA NEVER EXPOSED:
  // - warehouseId
  // - warehouseName
  // - purchasePrice
  // - realCost
  // - warehouse quantities
  // - profit
  // ====================================================

  const visibleProducts =
    useMemo(() => {

      const result = []

      warehouseProductIndex.forEach(
        (
          warehouseEntry,
          key
        ) => {

          const warehouseProduct =
            warehouseEntry.product

          const totalQuantity =
            warehouseEntry.totalQuantity

          if (!warehouseProduct) {
            return
          }


          // ------------------------------------------
          // WEBSITE PRODUCT REFERENCE
          // ------------------------------------------

          const websiteProduct =
            websiteProductIndex.get(key) ||
            null


          // ------------------------------------------
          // ACTIVE OFFER
          // ------------------------------------------

          const offer =
            activeOffersByProduct.get(key) ||
            null


          // ------------------------------------------
          // BASE SALE PRICE
          //
          // Normally ALWAYS comes from warehouse.
          // ------------------------------------------

          let salePrice =
            Number(
              warehouseProduct.salePrice ??
              0
            )

          if (
            !Number.isFinite(
              salePrice
            )
          ) {
            salePrice = 0
          }


          // ------------------------------------------
          // OFFER PRICE
          // ------------------------------------------

          let offerPrice =
            null

          let oldPrice =
            null


          if (offer) {

            /*
             * When there is an active website offer,
             * the website product sale price becomes
             * the old/base price.
             *
             * This is the only case where the normal
             * warehouse sale price is replaced.
             */

            const websiteSalePrice =
              Number(
                websiteProduct?.salePrice ??
                websiteProduct?.price ??
                NaN
              )


            const offerBasePrice =
              Number.isFinite(
                websiteSalePrice
              )
                ? websiteSalePrice
                : salePrice


            const explicitOfferPrice =
              Number(
                offer.offerPrice ??
                offer.salePrice ??
                offer.newPrice ??
                NaN
              )


            if (
              Number.isFinite(
                explicitOfferPrice
              ) &&
              explicitOfferPrice >= 0
            ) {

              offerPrice =
                explicitOfferPrice

              oldPrice =
                offerBasePrice

            } else {

              const discount =
                Number(
                  offer.discount ??
                  0
                )

              if (
                Number.isFinite(
                  discount
                ) &&
                discount > 0 &&
                discount < 100 &&
                offerBasePrice > 0
              ) {

                offerPrice =
                  offerBasePrice -
                  (
                    offerBasePrice *
                    discount /
                    100
                  )

                oldPrice =
                  offerBasePrice

              }

            }

          }


          const available =
            totalQuantity > 0


          // ------------------------------------------
          // PUBLIC PRODUCT OBJECT
          // ------------------------------------------

          result.push({

            id:
              warehouseProduct.productId ??
              warehouseProduct.id,

            name:
              warehouseProduct.name ||
              warehouseProduct.productName ||
              '',

            sku:
              warehouseProduct.sku ||
              '',

            barcode:
              warehouseProduct.barcode ||
              '',

            brand:
              warehouseProduct.brand ||
              '',

            model:
              warehouseProduct.model ||
              '',

            category:
              warehouseProduct.category ||
              '',

            description:
              warehouseProduct.description ||
              '',

            image:
              warehouseProduct.image ||
              '',

            images:
              Array.isArray(
                warehouseProduct.images
              )
                ? warehouseProduct.images
                : [],

            type:
              warehouseProduct.type ||
              '',

            tire:
              warehouseProduct.tire ||
              null,

            battery:
              warehouseProduct.battery ||
              null,

            oil:
              warehouseProduct.oil ||
              null,

            specifications:
              warehouseProduct.specifications ||
              {},

            attributes:
              warehouseProduct.attributes ||
              {},

            tags:
              Array.isArray(
                warehouseProduct.tags
              )
                ? warehouseProduct.tags
                : [],

            compatibleVehicles:
              Array.isArray(
                warehouseProduct.compatibleVehicles
              )
                ? warehouseProduct.compatibleVehicles
                : [],


            // ----------------------------------------
            // CONSUMER PRICING
            // ----------------------------------------

            salePrice,

            offerPrice,

            oldPrice,

            hasOffer:
              Boolean(
                offer &&
                offerPrice !== null
              ),

            offerTitle:
              offer?.title ||
              '',

            offerDescription:
              offer?.description ||
              '',

            offerId:
              offer?.id ??
              null,


            // ----------------------------------------
            // CONSUMER AVAILABILITY
            // ----------------------------------------

            available,

            availability:
              available
                ? 'متوفر'
                : 'غير متوفر',


            // ----------------------------------------
            // UI FLAGS
            // ----------------------------------------

            active:
              warehouseProduct.active !== false,

            hidden:
              Boolean(
                warehouseProduct.hidden
              ),

            publishedToHome:
              warehouseProduct.publishedToHome ??
              warehouseProduct.publishToHome ??
              true

          })

        }
      )


      return result

        .filter(
          product =>
            product.active &&
            !product.hidden &&
            product.publishedToHome !== false
        )

    }, [
      warehouseProductIndex,
      websiteProductIndex,
      activeOffersByProduct
    ])


  // ====================================================
  // UI STATE
  // ====================================================

  const [
    currentSlide,
    setCurrentSlide
  ] = useState(0)

  const [
    cartOpen,
    setCartOpen
  ] = useState(false)

  const [
    mobileMenu,
    setMobileMenu
  ] = useState(false)

  const [
    imageLoaded,
    setImageLoaded
  ] = useState(false)


  // ====================================================
  // SLIDER
  // ====================================================

  useEffect(() => {

    if (
      !slides.length ||
      cartOpen
    ) {
      return
    }

    const timer =
      setInterval(() => {

        setCurrentSlide(
          previous =>
            previous >=
            slides.length - 1
              ? 0
              : previous + 1
        )

      }, 5000)

    return () =>
      clearInterval(timer)

  }, [
    slides,
    cartOpen
  ])


  useEffect(() => {

    if (
      currentSlide >=
      slides.length
    ) {

      setCurrentSlide(0)

    }

  }, [
    slides,
    currentSlide
  ])


  // ====================================================
  // SCROLL
  // ====================================================

  const scrollToSection =
    id => {

      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

    }


  // ====================================================
  // SOCIALS
  // ====================================================

  const socials = [

    {
      show:
        companyFacebook,

      title:
        'Facebook',

      value:
        companyFacebook,

      color:
        'bg-blue-700'
    },

    {
      show:
        companyInstagram,

      title:
        'Instagram',

      value:
        companyInstagram,

      color:
        'bg-pink-600'
    },

    {
      show:
        companyYoutube,

      title:
        'Youtube',

      value:
        companyYoutube,

      color:
        'bg-red-600'
    }

  ]


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        bg-black
        min-h-screen
        text-white
        overflow-x-hidden
      "
    >

      <Link
        to="/dashboard"
        className="
          fixed
          top-24
          left-0
          z-50
          bg-blue-700
          hover:bg-blue-800
          text-white
          px-5
          py-3
          rounded-2xl
          font-extrabold
          shadow-2xl
          border-2
          border-yellow-400
        "
      >
        لوحة التحكم
      </Link>


      <Cart
        open={cartOpen}
        setOpen={setCartOpen}
      />


      <HomeHeader
        companyName={companyName}
        logo={logo}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />


      <HomeNavigation
        mobileMenu={mobileMenu}
        scrollToSection={scrollToSection}
      />


      <HomeCompanyInfo
        companyPhone={companyPhone}
        companyWhatsapp={companyWhatsapp}
        companyAddress={companyAddress}
        companyEmail={companyEmail}
        socials={socials}
      />


      <HomeVehicleSearch
        onAddToCart={addToCart}
      />


      <HomeSlider
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />


      <HomeProducts
        products={visibleProducts}
        addToCart={addToCart}
      />


      <HomeOffers
        offers={offers}
        addToCart={addToCart}
      />


      <HomeServices
        services={services}
      />


      <HomeVideos
        videos={videos}
      />


      <div
        className="
          fixed
          bottom-6
          left-6
          z-50
        "
      >

        <button
          type="button"
          onClick={() =>
            setCartOpen(true)
          }
          className="
            relative
            bg-yellow-400
            hover:bg-yellow-500
            text-black
            w-20
            h-20
            rounded-full
            shadow-2xl
            text-4xl
            border-4
            border-white
            transition
          "
        >

          🛒

          <span
            className="
              absolute
              -top-2
              -right-2
              bg-red-600
              text-white
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              text-sm
              font-black
            "
          >
            {cart.length}
          </span>

        </button>

      </div>


      <HomeFooter
        companyName={companyName}
        companyPhone={companyPhone}
        companyWhatsapp={companyWhatsapp}
        companyAddress={companyAddress}
        companyEmail={companyEmail}
        companyFacebook={companyFacebook}
        companyInstagram={companyInstagram}
        companyYoutube={companyYoutube}
      />

    </div>

  )

}