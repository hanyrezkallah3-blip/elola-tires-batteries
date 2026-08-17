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
  //
  // IMPORTANT:
  // Warehouses are used internally only to calculate
  // product availability.
  //
  // Warehouse names, locations, purchase prices and
  // individual quantities are NEVER passed to HomeProducts.
  // ====================================================

  const warehouses =
    useWarehouseStore(
      state =>
        Array.isArray(state.warehouses)
          ? state.warehouses
          : []
    )


  // ====================================================
  // NORMALIZE WAREHOUSE PRODUCTS
  // ====================================================

  const warehouseProducts =
    useMemo(() => {

      return warehouses.flatMap(
        warehouse =>
          Array.isArray(warehouse?.products)
            ? warehouse.products.map(
                product => ({
                  ...product,

                  warehouseId:
                    warehouse?.id ?? null,

                  warehouseName:
                    warehouse?.name ?? ''

                })
              )
            : []
      )

    }, [warehouses])


  // ====================================================
  // BUILD PRODUCT AVAILABILITY INDEX
  //
  // The consumer does NOT receive warehouse details.
  //
  // We only calculate:
  //
  // available
  // totalQuantity
  //
  // internally.
  // ====================================================

  const availabilityByProduct =
    useMemo(() => {

      const availability =
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

          const current =
            availability.get(key) || 0

          availability.set(
            key,
            current +
              (
                Number.isFinite(quantity)
                  ? Math.max(quantity, 0)
                  : 0
              )
          )

        }
      )

      return availability

    }, [warehouseProducts])


  // ====================================================
  // ACTIVE OFFERS INDEX
  // ====================================================

  const activeOffersByProduct =
    useMemo(() => {

      const map =
        new Map()

      const now =
        new Date()

      offers.forEach(
        offer => {

          if (!offer || offer.active === false) {
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
          // DATE VALIDATION
          // --------------------------------------------

          if (offer.startDate) {

            const start =
              new Date(
                offer.startDate
              )

            if (
              !Number.isNaN(start.getTime()) &&
              now < start
            ) {
              return
            }

          }

          if (offer.endDate) {

            const end =
              new Date(
                offer.endDate
              )

            if (
              !Number.isNaN(end.getTime()) &&
              now > end
            ) {
              return
            }

          }

          const key =
            String(productId)

          const existing =
            map.get(key)

          /*
           * If more than one active offer exists,
           * use the first active offer registered
           * for the product.
           */
          if (!existing) {

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
  // PUBLIC PRODUCT VIEW
  //
  // This is the important boundary.
  //
  // HomeProducts receives only consumer-safe data.
  //
  // NEVER pass:
  // - warehouseName
  // - warehouseId
  // - purchasePrice
  // - warehouse quantity
  // - profit
  // ====================================================

  const visibleProducts =
    useMemo(() => {

      return products

        .filter(
          product =>
            product &&
            !product.hidden &&
            product.publishedToHome !== false
        )

        .map(
          product => {

            const productId =
              product.id ??
              product.productId

            const key =
              String(productId)

            const totalQuantity =
              availabilityByProduct.get(key) || 0

            const available =
              totalQuantity > 0

            const offer =
              activeOffersByProduct.get(key) ||
              null

            const salePrice =
              Number(
                product.salePrice ??
                product.price ??
                0
              )

            // ------------------------------------------
            // OFFER PRICE
            // ------------------------------------------

            let offerPrice =
              null

            let oldPrice =
              null

            if (offer) {

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
                  salePrice

              } else {

                const discount =
                  Number(
                    offer.discount ??
                    0
                  )

                if (
                  Number.isFinite(discount) &&
                  discount > 0 &&
                  discount < 100 &&
                  salePrice > 0
                ) {

                  offerPrice =
                    salePrice -
                    (
                      salePrice *
                      discount /
                      100
                    )

                  oldPrice =
                    salePrice

                }

              }

            }


            // ------------------------------------------
            // PUBLIC PRODUCT OBJECT
            // ------------------------------------------

            return {

              id:
                productId,

              name:
                product.name ||
                product.productName ||
                '',

              sku:
                product.sku ||
                '',

              barcode:
                product.barcode ||
                '',

              brand:
                product.brand ||
                '',

              model:
                product.model ||
                '',

              category:
                product.category ||
                '',

              description:
                product.description ||
                '',

              image:
                product.image ||
                '',

              type:
                product.type ||
                '',

              tire:
                product.tire ||
                null,

              battery:
                product.battery ||
                null,

              oil:
                product.oil ||
                null,

              specifications:
                product.specifications ||
                {},

              tags:
                Array.isArray(product.tags)
                  ? product.tags
                  : [],

              compatibleVehicles:
                Array.isArray(
                  product.compatibleVehicles
                )
                  ? product.compatibleVehicles
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
              //
              // Only boolean status is exposed.
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
                product.active !== false,

              hidden:
                Boolean(product.hidden),

              publishedToHome:
                product.publishedToHome !== false

            }

          }
        )

        .filter(
          product =>
            product.active &&
            !product.hidden
        )

    }, [
      products,
      availabilityByProduct,
      activeOffersByProduct
    ])


  // ====================================================
  // UI
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
          prev =>
            prev >=
            slides.length - 1
              ? 0
              : prev + 1
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
    (id) => {

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