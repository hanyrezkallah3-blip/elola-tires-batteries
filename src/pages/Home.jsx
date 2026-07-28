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

    const timer = setInterval(() => {

      setCurrentSlide(prev =>

        prev >= slides.length - 1

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

      currentSlide >= slides.length

    ) {

      setCurrentSlide(0)

    }

  }, [

    slides,

    currentSlide

  ])

  // ====================================================
  // PRODUCTS
  // ====================================================

  const visibleProducts = useMemo(

    () =>

      products.filter(

        product =>

          !product.hidden

      ),

    [

      products

    ]

  )

    // ====================================================
  // SCROLL
  // ====================================================

  const scrollToSection = (id) => {

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

        currentSlide={

          currentSlide

        }

        setCurrentSlide={

          setCurrentSlide

        }

        imageLoaded={

          imageLoaded

        }

        setImageLoaded={

          setImageLoaded

        }

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