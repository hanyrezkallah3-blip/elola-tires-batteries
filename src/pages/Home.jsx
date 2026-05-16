import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'
import Footer from '../components/Footer'
import Cart from '../components/Cart'

export default function Home() {

  const store = useWebsiteStore()

  const {
    slides,
    products,
    offers,
    services,
    videos,
    companyName,
    logo,
    addToCart,
    cart
  } = store

  const [currentSlide, setCurrentSlide] = useState(0)

  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {

    if (slides.length === 0) return

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>

        prev === slides.length - 1
          ? 0
          : prev + 1

      )

    }, 3000)

    return () => clearInterval(interval)

  }, [slides])

  return (

    <div className="bg-black min-h-screen text-white overflow-hidden">

      {/* DASHBOARD BUTTON */}

      <Link

        to="/"

        className="
          fixed
          top-6
          left-28
          z-50
          bg-blue-700
          hover:bg-blue-800
          text-white
          px-6
          py-4
          rounded-2xl
          text-xl
          font-extrabold
          shadow-2xl
          border-2
          border-yellow-400
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

        onClick={() =>
          setCartOpen(true)
        }

        className="
          fixed
          bottom-8
          left-8
          z-50
          bg-yellow-400
          hover:bg-yellow-500
          w-24
          h-24
          rounded-full
          shadow-2xl
          flex
          items-center
          justify-center
          text-5xl
          border-4
          border-white
          animate-bounce
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
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            text-lg
            font-extrabold
          "
        >
          {cart.length}
        </span>

      </button>

      {/* HEADER */}

      <div
        className="
          h-24
          bg-gradient-to-r
          from-blue-950
          via-blue-700
          to-yellow-500
          flex
          items-center
          justify-between
          px-8
          border-b-4
          border-yellow-400
        "
      >

        <div
          className="
            w-16
            h-16
            rounded-full
            overflow-hidden
            bg-white
            border-4
            border-yellow-400
          "
        >

          {logo && (

            <img
              src={logo}
              alt=""
              className="
                w-full
                h-full
                object-cover
              "
            />

          )}

        </div>

        <h1
          className="
            text-3xl
            md:text-5xl
            font-extrabold
            animate-pulse
            text-center
          "
        >
          {companyName || 'شركة العلا للإطارات والبطاريات'}
        </h1>

        <div className="w-16"></div>

      </div>

      {/* SLIDER */}

      <div className="relative h-[90vh] overflow-hidden">

        {slides.length > 0 ? (

          <img
            src={slides[currentSlide]?.image}
            alt=""
            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <div
            className="
              flex
              items-center
              justify-center
              h-full
              text-5xl
            "
          >
            لا توجد صور
          </div>

        )}

      </div>

      {/* PRODUCTS */}

      <section className="py-20 px-8 bg-slate-950">

        <h2
          className="
            text-5xl
            text-yellow-400
            font-extrabold
            text-center
            mb-14
          "
        >
          المنتجات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {products.map((product, index) => (

            <div
              key={index}
              className="
                bg-slate-900
                rounded-3xl
                overflow-hidden
                shadow-2xl
              "
            >

              <img
                src={product.image}
                alt=""
                className="
                  w-full
                  h-64
                  object-cover
                "
              />

              <div className="p-6">

                <h3
                  className="
                    text-2xl
                    font-bold
                    mb-4
                  "
                >
                  {product.name}
                </h3>

                <p
                  className="
                    text-yellow-400
                    text-3xl
                    font-extrabold
                    mb-6
                  "
                >
                  {product.price}
                </p>

                <button

                  onClick={() =>
                    addToCart(product)
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
                  "
                >
                  إضافة للسلة
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* OFFERS */}

      <section className="py-20 px-8 bg-black">

        <h2
          className="
            text-5xl
            text-red-500
            font-extrabold
            text-center
            mb-14
          "
        >
          العروض
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {offers.map((offer, index) => (

            <div
              key={index}
              className="
                bg-slate-900
                rounded-3xl
                overflow-hidden
              "
            >

              <img
                src={offer.image}
                alt=""
                className="
                  w-full
                  h-72
                  object-cover
                "
              />

              <div className="p-6">

                <h3
                  className="
                    text-3xl
                    font-extrabold
                  "
                >
                  {offer.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* SERVICES */}

      <section className="py-20 px-8 bg-slate-950">

        <h2
          className="
            text-5xl
            text-blue-400
            font-extrabold
            text-center
            mb-14
          "
        >
          الخدمات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {services.map((service, index) => (

            <div
              key={index}
              className="
                bg-slate-900
                rounded-3xl
                p-10
                text-center
              "
            >

              <h3
                className="
                  text-3xl
                  font-extrabold
                  mb-6
                "
              >
                {service.title}
              </h3>

              <p className="text-xl text-gray-300">

                {service.description}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* VIDEOS */}

      <section className="py-20 px-8 bg-black">

        <h2
          className="
            text-5xl
            text-purple-400
            font-extrabold
            text-center
            mb-14
          "
        >
          الفيديوهات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {videos.map((video, index) => (

            <div
              key={index}
              className="
                bg-slate-900
                rounded-3xl
                overflow-hidden
              "
            >

              <video
                src={video.video}
                controls
                className="
                  w-full
                  h-64
                  object-cover
                "
              />

            </div>

          ))}

        </div>

      </section>

      <Footer />

    </div>

  )

}