import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useWebsiteStore }
  from '../store/websiteStore'

import Footer
  from '../components/Footer'

import Cart
  from '../components/Cart'

import CompatibilityEngine
  from '../core/engines/CompatibilityEngine'

import VehicleLookupService
  from '../core/services/VehicleLookupService'

import CompatibilityResults
  from '../components/home/CompatibilityResults'

import VehicleTypeCards
  from '../components/home/VehicleTypeCards'  

export default function Home() {

  const {

    slides = [],
    products = [],
    offers = [],
    services = [],
    videos = [],

    companyName,
    logo,
    companyPhone,
    companyWhatsapp,
    companyAddress,
    companyFacebook,
    companyInstagram,
    companyYoutube,
    companyEmail,

    addToCart,
    cart = [],

    hydrated

  } = useWebsiteStore()

  // ================= STATES =================

  const [currentSlide, setCurrentSlide] =
    useState(0)

  const [cartOpen, setCartOpen] =
    useState(false)

  const [mobileMenu, setMobileMenu] =
    useState(false)

  const [imageLoaded, setImageLoaded] =
    useState(false)

  // ================= SMART SEARCH =================

const [

  selectedCategory,

  setSelectedCategory

] = useState('')

const [

  selectedBrand,

  setSelectedBrand

] = useState('')

const [

  selectedModel,

  setSelectedModel

] = useState('')

const [

  selectedYear,

  setSelectedYear

] = useState('')

const [

  tireWidth,

  setTireWidth

] = useState('')

const [

  tireProfile,

  setTireProfile

] = useState('')

const [

  tireRim,

  setTireRim

] = useState('')

const [

  batteryCapacity,

  setBatteryCapacity

] = useState('')

const [

  searchResult,

  setSearchResult

] = useState(null)  

  // ================= FIX HYDRATION =================

  if (false && !hydrated) {

    return (

      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
        text-4xl
        font-black
      ">

        جاري تحميل الموقع...

      </div>

    )

  }

  // ================= FIX SLIDER =================

  useEffect(() => {

    if (!slides?.length) return

    if (cartOpen) return

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>

        prev >= slides.length - 1
          ? 0
          : prev + 1

      )

    }, 5000)

    return () => clearInterval(interval)

  }, [slides, cartOpen])

  // ================= FIX CURRENT SLIDE =================

  useEffect(() => {

    if (
      currentSlide >
      slides.length - 1
    ) {

      setCurrentSlide(0)

    }

  }, [slides, currentSlide])

  // ================= PRODUCTS =================

  const visibleProducts = useMemo(() => {

    return products.filter(
      (product) => !product.hidden
    )

  }, [products])

  // ================= VEHICLE DATABASE =================

const vehicleCategories =

  VehicleLookupService.getCategories()

const vehicleBrands =

  VehicleLookupService.getBrands(

    selectedCategory

  )

const vehicleModels =

  VehicleLookupService.getModels(

    selectedBrand

  )

const vehicleYears =

  VehicleLookupService.getYears({

    manufacturer:

      selectedBrand,

    model:

      selectedModel

  })

  // ================= SEARCH BY VEHICLE =================

const searchByVehicle = () => {

  const vehicle =

    CompatibilityEngine.byVehicle({

      make:

        selectedBrand,

      model:

        selectedModel,

      year:

        selectedYear

    })

  setSearchResult(vehicle)

}

// ================= SEARCH BY TIRE =================

const searchByTire = () => {

  const result =

    CompatibilityEngine.byTireSize({

      width:

        tireWidth,

      profile:

        tireProfile,

      rim:

        tireRim

    })

  setSearchResult(result)

}

// ================= SEARCH BY BATTERY =================

const searchByBattery = () => {

  const result =

    CompatibilityEngine.byBattery({

      capacity:

        batteryCapacity

    })

  setSearchResult(result)

}

  // ================= SCROLL =================

  const scrollToSection = (id) => {

    const element =
      document.getElementById(id)

    if (element) {

      element.scrollIntoView({

        behavior: 'smooth',
        block: 'start'

      })

    }

    setMobileMenu(false)

  }

  // ================= SOCIALS =================

  const socials = [

    {
      show: companyFacebook,
      title: 'Facebook',
      value: companyFacebook,
      color: 'bg-blue-700'
    },

    {
      show: companyInstagram,
      title: 'Instagram',
      value: companyInstagram,
      color: 'bg-pink-600'
    },

    {
      show: companyYoutube,
      title: 'Youtube',
      value: companyYoutube,
      color: 'bg-red-600'
    }

  ]

  return (

    <div className="
      bg-black
      min-h-screen
      text-white
      overflow-x-hidden
    ">

      {/* DASHBOARD */}

      <Link
        to="/dashboard"
        className="
          fixed
          top-25
          left-0
          z-50
          bg-blue-700
          hover:bg-blue-800
          text-white
          px-5
          py-3
          rounded-2xl
          text-sm
          md:text-lg
          font-extrabold
          shadow-2xl
          border-2
          border-yellow-400
          transition
        "
      >

        لوحة التحكم

      </Link>

      {/* CART */}

      <Cart
        open={cartOpen}
        setOpen={setCartOpen}
      />

      {/* FLOATING CART */}

      <button

        type="button"

        onClick={() =>
          setCartOpen(true)
        }

        className="
          fixed
          bottom-6
          left-6
          z-50
          bg-yellow-400
          hover:bg-yellow-500
          w-20
          h-20
          md:w-24
          md:h-24
          rounded-full
          shadow-2xl
          flex
          items-center
          justify-center
          text-4xl
          md:text-5xl
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
            font-extrabold
          "
        >

          {cart.length}

        </span>

      </button>

      {/* HEADER */}

      <header className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        border-b-4
        border-yellow-400
        px-4
        md:px-8
        py-5
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-4
        ">

          {/* LOGO */}

          <div className="
            w-16
            h-16
            md:w-20
            md:h-20
            rounded-full
            overflow-hidden
            bg-white
            border-4
            border-yellow-400
            shadow-xl
            shrink-0
          ">

            {

              logo ? (

                <img
                  src={logo}
                  alt="logo"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <div className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                  text-black
                  font-black
                ">

                  LOGO

                </div>

              )

            }

          </div>

          {/* TITLE */}

          <div className="flex-1 text-center">

            <h1 className="
              text-2xl
              md:text-5xl
              font-extrabold
              leading-tight
            ">

              {

                companyName ||

                'شركة العلا للإطارات والبطاريات'

              }

            </h1>

            <p className="
              text-sm
              md:text-lg
              mt-2
              text-white/90
            ">

              أفضل الإطارات والبطاريات والخدمات المتكاملة

            </p>

          </div>

          {/* MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="
              lg:hidden
              bg-black/30
              w-14
              h-14
              rounded-2xl
              text-3xl
              font-black
            "
          >

            ☰

          </button>

        </div>

      </header>

      {/* NAVIGATION */}

      <div className="
        sticky
        top-0
        z-40
        bg-slate-950/95
        backdrop-blur-md
        border-b
        border-yellow-500
      ">

        <div className={`
          px-4
          py-4

          ${mobileMenu
            ? 'block'
            : 'hidden lg:block'}
        `}>

          <div className="
            flex
            flex-col
            lg:flex-row
            flex-wrap
            justify-center
            gap-4
          ">

            <button
              type="button"
              onClick={() =>
                scrollToSection('slider')
              }
              className="
                bg-blue-700
                hover:bg-blue-800
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              الرئيسية
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection('products')
              }
              className="
                bg-yellow-500
                hover:bg-yellow-600
                text-black
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              المنتجات
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection('offers')
              }
              className="
                bg-red-600
                hover:bg-red-700
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              العروض
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection('services')
              }
              className="
                bg-cyan-600
                hover:bg-cyan-700
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              الخدمات
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection('videos')
              }
              className="
                bg-purple-600
                hover:bg-purple-700
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              الفيديوهات
            </button>

            <button
              type="button"
              onClick={() =>
                scrollToSection('footer')
              }
              className="
                bg-green-600
                hover:bg-green-700
                px-6
                py-3
                rounded-2xl
                font-bold
                transition
              "
            >
              تواصل معنا
            </button>

          </div>

        </div>

      </div>

      {/* COMPANY INFO */}

      <section className="
        bg-slate-950
        border-b
        border-yellow-500
        py-8
        px-4
        md:px-8
      ">

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        ">

          {

            companyPhone && (

              <div className="
                bg-slate-900
                p-5
                rounded-3xl
                text-lg
                font-bold
                border
                border-slate-700
              ">

                📞 الهاتف:
                {' '}
                {companyPhone}

              </div>

            )

          }

          {

            companyWhatsapp && (

              <div className="
                bg-green-700
                p-5
                rounded-3xl
                text-lg
                font-bold
              ">

                💬 واتساب:
                {' '}
                {companyWhatsapp}

              </div>

            )

          }

          {

            companyEmail && (

              <div className="
                bg-slate-900
                p-5
                rounded-3xl
                text-lg
                font-bold
                border
                border-slate-700
                break-all
              ">

                ✉ البريد:
                {' '}
                {companyEmail}

              </div>

            )

          }

          {

            companyAddress && (

              <div className="
                bg-slate-900
                p-5
                rounded-3xl
                text-lg
                font-bold
                border
                border-slate-700
              ">

                📍 العنوان:
                {' '}
                {companyAddress}

              </div>

            )

          }

        </div>

        {/* SOCIALS */}

        <div className="
          flex
          flex-wrap
          gap-4
          justify-center
          mt-8
        ">

          {

            socials
              .filter((s) => s.show)
              .map((social, index) => (

                <a
                  key={index}
                  href={social.value}
                  target="_blank"
                  rel="noreferrer"
                  className={`
                    ${social.color}
                    px-6
                    py-3
                    rounded-2xl
                    font-black
                    hover:scale-105
                    transition
                  `}
                >

                  {social.title}

                </a>

              ))

          }

        </div>

      </section>

      {/* =======================================================
    SMART VEHICLE SEARCH
======================================================= */}

<section
  className="
    bg-slate-950
    border-y
    border-yellow-500
    py-12
    px-4
    md:px-8
  "
>

  <div className="
    max-w-7xl
    mx-auto
  ">

    <h2 className="
      text-4xl
      font-black
      text-center
      text-yellow-400
      mb-4
    ">

      ابحث عن المنتج المناسب لسيارتك

    </h2>

    <p className="
      text-center
      text-gray-300
      mb-10
      text-lg
    ">

      اختر نوع المركبة ثم الشركة ثم الموديل للحصول على المنتجات المتوافقة

    </p>

    <div className="
      grid
      lg:grid-cols-4
      md:grid-cols-2
      gap-6
    ">

      <select
        value={selectedCategory}
        onChange={(e)=>
          setSelectedCategory(
            e.target.value
          )
        }
        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "
      >

        <option value="">

          نوع المركبة

        </option>

      </select>

      <select
        value={selectedBrand}
        onChange={(e)=>
          setSelectedBrand(
            e.target.value
          )
        }
        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "
      >

        <option value="">

          الشركة

        </option>

      </select>

      <select
        value={selectedModel}
        onChange={(e)=>
          setSelectedModel(
            e.target.value
          )
        }
        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "
      >

        <option value="">

          الموديل

        </option>

      </select>

      <select
        value={selectedYear}
        onChange={(e)=>
          setSelectedYear(
            e.target.value
          )
        }
        className="
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "
      >

        <option value="">

          سنة الصنع

        </option>

      </select>

    </div>

    <div className="
      flex
      justify-center
      mt-8
    ">

      <button

        type="button"

        onClick={searchByVehicle}

        className="
          bg-yellow-500
          hover:bg-yellow-600
          px-12
          py-4
          rounded-2xl
          text-black
          text-xl
          font-black
          transition
        "
      >

        بحث

      </button>

    </div>

  </div>

</section>

      {/* SLIDER */}

      <section
        id="slider"
        className="
          relative
          h-[60vh]
          md:h-[90vh]
          overflow-hidden
          bg-black
        "
      >

        {

          slides.length > 0 ? (

            <>

              {!imageLoaded && (

                <div className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-black
                  bg-black
                  z-10
                ">

                  جاري تحميل الصورة...

                </div>

              )}

              <img
                src={slides[currentSlide]?.image}
                alt="slide"
                onLoad={() =>
                  setImageLoaded(true)
                }
                onError={() =>
                  setImageLoaded(false)
                }
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

              {/* OVERLAY */}

              <div className="
                absolute
                inset-0
                bg-black/40
              " />

              {/* TEXT */}

              <div className="
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-6
                z-20
              ">

                <h2 className="
                  text-4xl
                  md:text-7xl
                  font-black
                  mb-6
                ">

                  شركة العلا

                </h2>

                <p className="
                  text-xl
                  md:text-3xl
                  max-w-4xl
                  leading-relaxed
                ">

                  أفضل خدمات الإطارات والبطاريات
                  والصيانة بأعلى جودة

                </p>

              </div>

              {/* DOTS */}

              <div className="
                absolute
                bottom-6
                left-1/2
                -translate-x-1/2
                flex
                gap-3
                z-20
              ">

                {

                  slides.map((_, index) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentSlide(index)
                      }
                      className={`
                        w-4
                        h-4
                        rounded-full
                        transition

                        ${currentSlide === index

                          ? 'bg-yellow-400 scale-125'

                          : 'bg-white/50'

                        }
                      `}
                    />

                  ))

                }

              </div>

            </>

          ) : (

            <div className="
              flex
              items-center
              justify-center
              h-full
              text-3xl
              md:text-5xl
              font-black
            ">

              لا توجد صور حالياً

            </div>

          )

        }

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="
          py-20
          px-4
          md:px-8
          bg-slate-950
        "
      >

        <h2 className="
          text-4xl
          md:text-6xl
          text-yellow-400
          font-extrabold
          text-center
          mb-14
        ">

          المنتجات

        </h2>

        {

          visibleProducts.length === 0 ? (

            <div className="
              text-center
              text-3xl
              text-gray-400
            ">

              لا توجد منتجات حالياً

            </div>

          ) : (

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-10
            ">

              {

                visibleProducts.map((product) => (

                  <div
                    key={product.id}
                    className="
                      bg-slate-900
                      rounded-3xl
                      overflow-hidden
                      shadow-2xl
                      border
                      border-slate-800
                      hover:-translate-y-2
                      transition
                    "
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        h-72
                        object-cover
                      "
                    />

                    <div className="p-6">

                      <h3 className="
                        text-2xl
                        font-black
                        mb-4
                        min-h-[70px]
                      ">

                        {product.name}

                      </h3>

                      <p className="
                        text-yellow-400
                        text-4xl
                        font-extrabold
                      ">

                        {product.price} ج

                      </p>

                      <div className="
                        mt-4
                        text-lg
                        text-gray-300
                      ">

                        📦 المتوفر:
                        {' '}
                        {product.stock || 0}

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(product)
                        }
                        className="
                          w-full
                          mt-6
                          bg-yellow-500
                          hover:bg-yellow-600
                          py-4
                          rounded-2xl
                          text-black
                          text-xl
                          font-extrabold
                          transition
                        "
                      >

                        إضافة للسلة

                      </button>

                    </div>

                  </div>

                ))

              }

            </div>

          )

        }

      </section>

      {/* OFFERS */}

      <section
        id="offers"
        className="
          py-20
          px-4
          md:px-8
          bg-black
        "
      >

        <h2 className="
          text-4xl
          md:text-6xl
          text-red-500
          font-extrabold
          text-center
          mb-14
        ">

          العروض

        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-10
        ">

          {

            offers.map((offer) => (

              <div
                key={offer.id}
                className="
                  bg-slate-900
                  rounded-3xl
                  overflow-hidden
                  shadow-2xl
                "
              >

                <img
                  src={offer.image}
                  alt={offer.title}
                  className="
                    w-full
                    h-80
                    object-cover
                  "
                />

                <div className="p-6">

  <h3
    className="
      text-3xl
      font-extrabold
      mb-4
    "
  >
    {offer.title}
  </h3>

  {offer.price && (
    <div
      className="
        text-yellow-400
        text-4xl
        font-extrabold
        mb-4
      "
    >
      {offer.price}
    </div>
  )}

  {offer.description && (
    <p
      className="
        text-gray-300
        text-lg
        leading-relaxed
        mb-6
      "
    >
      {offer.description}
    </p>
  )}

  <button
    type="button"
    onClick={() =>
      addToCart({
        id: `offer-${offer.id}`,
        name: offer.title,
        price: offer.price || 0,
        image: offer.image,
        stock: 9999,
        isOffer: true
      })
    }
    className="
      w-full
      bg-yellow-500
      hover:bg-yellow-600
      py-4
      rounded-2xl
      text-black
      text-xl
      font-extrabold
      transition
    "
  >
    إضافة العرض للسلة
  </button>

</div>

              </div>

            ))

          }

        </div>

      </section>

      {/* SERVICES */}

      <section
        id="services"
        className="
          py-20
          px-4
          md:px-8
          bg-slate-950
        "
      >

        <h2 className="
          text-4xl
          md:text-6xl
          text-cyan-400
          font-extrabold
          text-center
          mb-14
        ">

          الخدمات

        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-10
        ">

          {

            services.map((service) => (

              <div
                key={service.id}
                className="
                  bg-slate-900
                  rounded-3xl
                  overflow-hidden
                  p-6
                  shadow-2xl
                "
              >

                {

                  (service.image || service.img) && (

                    <img
                      src={
                        service.image ||
                        service.img
                      }
                      alt={service.title}
                      className="
                        w-full
                        h-64
                        object-cover
                        rounded-2xl
                        mb-6
                      "
                    />

                  )

                }

                <h3 className="
                  text-3xl
                  font-extrabold
                  mb-4
                ">

                  {service.title}

                </h3>

                <p className="
                  text-xl
                  text-gray-300
                  leading-relaxed
                ">

                  {service.description}

                </p>

              </div>

            ))

          }

        </div>

      </section>

      {/* VIDEOS */}

      <section
        id="videos"
        className="
          py-20
          px-4
          md:px-8
          bg-black
        "
      >

        <h2 className="
          text-4xl
          md:text-6xl
          text-purple-400
          font-extrabold
          text-center
          mb-14
        ">

          الفيديوهات

        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-10
        ">

          {

            videos.map((video) => (

              <div
                key={video.id}
                className="
                  bg-slate-900
                  rounded-3xl
                  overflow-hidden
                  shadow-2xl
                "
              >

                <video
                  src={video.video}
                  controls
                  className="
                    w-full
                    h-72
                    object-cover
                  "
                />

              </div>

            ))

          }

        </div>

      </section>

      {/* FOOTER */}

      <div id="footer">

        <Footer />

      </div>

    </div>

  )

}