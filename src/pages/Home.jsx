import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'
import Footer from '../components/Footer'
import Cart from '../components/Cart'

export default function Home() {

  const {

    slides,
    products,
    offers,
    services,
    videos,

    // COMPANY

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
    cart

  } = useWebsiteStore()

  const [currentSlide, setCurrentSlide] =
    useState(0)

  const [cartOpen, setCartOpen] =
    useState(false)

  // ================= SLIDER =================

  useEffect(() => {

    if (!slides?.length) return

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>

        prev === slides.length - 1
          ? 0
          : prev + 1

      )

    }, 3000)

    return () => clearInterval(interval)

  }, [slides])

  // ================= PRODUCTS =================

  const visibleProducts =
    products.filter(
      (product) => !product.hidden
    )

  // ================= SCROLL FUNCTION =================

  const scrollToSection = (id) => {

    const element =
      document.getElementById(id)

    if (element) {

      element.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      })

    }

  }

  return (

    <div className="
      bg-black
      min-h-screen
      text-white
      overflow-hidden
    ">

      {/* DASHBOARD BUTTON */}

      <Link
        to="/dashboard"
        className="
          fixed
          top-7
          left-2
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

      <div className="
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
      ">

        <div className="
          w-16
          h-16
          rounded-full
          overflow-hidden
          bg-white
          border-4
          border-yellow-400
        ">

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

        <h1 className="
          text-3xl
          md:text-5xl
          font-extrabold
          animate-pulse
          text-center
        ">
          {

            companyName ||

            'شركة العلا للإطارات والبطاريات'

          }
        </h1>

        <div className="w-16"></div>

      </div>

      {/* QUICK NAVIGATION */}

      <div className="
        sticky
        top-0
        z-40
        bg-slate-950/95
        backdrop-blur-md
        border-b
        border-yellow-500
        py-4
        px-4
      ">

        <div className="
          flex
          flex-wrap
          justify-center
          gap-4
        ">

          <button
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
              transition-all
            "
          >
            الرئيسية
          </button>

          <button
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
              transition-all
            "
          >
            المنتجات
          </button>

          <button
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
              transition-all
            "
          >
            العروض
          </button>

          <button
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
              transition-all
            "
          >
            الخدمات
          </button>

          <button
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
              transition-all
            "
          >
            الفيديوهات
          </button>

          <button
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
              transition-all
            "
          >
            تواصل معنا
          </button>

        </div>

      </div>

      {/* COMPANY INFO */}

      <div className="
        bg-slate-950
        border-b
        border-yellow-500
        py-6
        px-8
      ">

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          text-lg
        ">

          {companyPhone && (

            <div className="
              bg-slate-900
              p-4
              rounded-2xl
            ">
              📞 الهاتف:
              {' '}
              {companyPhone}
            </div>

          )}

          {companyWhatsapp && (

            <div className="
              bg-slate-900
              p-4
              rounded-2xl
            ">
              💬 واتساب:
              {' '}
              {companyWhatsapp}
            </div>

          )}

          {companyEmail && (

            <div className="
              bg-slate-900
              p-4
              rounded-2xl
            ">
              ✉ البريد:
              {' '}
              {companyEmail}
            </div>

          )}

          {companyAddress && (

            <div className="
              bg-slate-900
              p-4
              rounded-2xl
            ">
              📍 العنوان:
              {' '}
              {companyAddress}
            </div>

          )}

          {companyFacebook && (

            <a
              href={companyFacebook}
              target="_blank"
              rel="noreferrer"
              className="
                bg-blue-700
                hover:bg-blue-800
                p-4
                rounded-2xl
                transition-all
              "
            >
              🔵 Facebook
            </a>

          )}

          {companyInstagram && (

            <a
              href={companyInstagram}
              target="_blank"
              rel="noreferrer"
              className="
                bg-pink-600
                hover:bg-pink-700
                p-4
                rounded-2xl
                transition-all
              "
            >
              📸 Instagram
            </a>

          )}

          {companyYoutube && (

            <a
              href={companyYoutube}
              target="_blank"
              rel="noreferrer"
              className="
                bg-red-600
                hover:bg-red-700
                p-4
                rounded-2xl
                transition-all
              "
            >
              ▶ YouTube
            </a>

          )}

        </div>

      </div>

      {/* SLIDER */}

      <section
        id="slider"
        className="
          relative
          h-[90vh]
          overflow-hidden
        "
      >

        {slides.length > 0 ? (

          <img
            src={
              slides[currentSlide]?.image
            }
            alt=""
            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <div className="
            flex
            items-center
            justify-center
            h-full
            text-5xl
          ">
            لا توجد صور
          </div>

        )}

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="
          py-20
          px-8
          bg-slate-950
        "
      >

        <h2 className="
          text-5xl
          text-yellow-400
          font-extrabold
          text-center
          mb-14
        ">
          المنتجات
        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-10
        ">

          {visibleProducts.map((product) => (

            <div
              key={product.id}
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

                <h3 className="
                  text-2xl
                  font-bold
                  mb-4
                ">
                  {product.name}
                </h3>

                <p className="
                  text-yellow-400
                  text-3xl
                  font-extrabold
                ">
                  {product.price}
                </p>

                <button

                  onClick={() =>
                    addToCart(product)
                  }

                  className="
                    w-full
                    mt-4
                    bg-yellow-500
                    hover:bg-yellow-600
                    py-4
                    rounded-2xl
                    text-black
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

      <section
        id="offers"
        className="
          py-20
          px-8
          bg-black
        "
      >

        <h2 className="
          text-5xl
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
          md:grid-cols-3
          gap-10
        ">

          {offers.map((offer) => (

            <div
              key={offer.id}
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

                <h3 className="
                  text-3xl
                  font-extrabold
                ">
                  {offer.title}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* SERVICES */}

      <section
        id="services"
        className="
          py-20
          px-8
          bg-slate-950
        "
      >

        <h2 className="
          text-5xl
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
          md:grid-cols-3
          gap-10
        ">

          {services.map((service) => (

            <div
              key={service.id}
              className="
                bg-slate-900
                rounded-3xl
                overflow-hidden
                p-6
              "
            >

              {(service.image ||
                service.img) && (

                <img
                  src={
                    service.image ||
                    service.img
                  }
                  alt=""
                  className="
                    w-full
                    h-56
                    object-cover
                    rounded-2xl
                    mb-6
                  "
                />

              )}

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
              ">
                {service.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* VIDEOS */}

      <section
        id="videos"
        className="
          py-20
          px-8
          bg-black
        "
      >

        <h2 className="
          text-5xl
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
          md:grid-cols-3
          gap-10
        ">

          {videos.map((video) => (

            <div
              key={video.id}
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

      {/* FOOTER WRAPPER */}

      <div id="footer">

        <Footer />

      </div>

    </div>

  )

}