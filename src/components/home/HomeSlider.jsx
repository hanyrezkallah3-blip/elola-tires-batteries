import { useEffect } from 'react'

export default function HomeSlider({

  slides = [],

  currentSlide,

  setCurrentSlide,

  imageLoaded,

  setImageLoaded,

  cartOpen

}) {

  // ================= AUTO PLAY =================

  useEffect(() => {

    if (!slides.length) return

    if (cartOpen) return

    const interval = setInterval(() => {

      setCurrentSlide(prev =>

        prev >= slides.length - 1

          ? 0

          : prev + 1

      )

    }, 5000)

    return () => clearInterval(interval)

  }, [

    slides,

    cartOpen,

    setCurrentSlide

  ])

  // ================= FIX INDEX =================

  useEffect(() => {

    if (

      currentSlide >

      slides.length - 1

    ) {

      setCurrentSlide(0)

    }

  }, [

    slides,

    currentSlide,

    setCurrentSlide

  ])

  // ================= UI =================

  return (

    <section

      id="slider"

      className="
        relative
        h-[55vh]
        md:h-[75vh]
        overflow-hidden
        bg-black
      "

    >

      {

        slides.length > 0

          ? (

            <>

              {

                !imageLoaded && (

                  <div

                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black
                      text-white
                      text-3xl
                      font-black
                      z-20
                    "

                  >

                    جاري تحميل الصورة...

                  </div>

                )

              }

              <img

                src={

                  slides[currentSlide]?.image

                }

                alt="slide"

                onLoad={()=>

                  setImageLoaded(true)

                }

                onError={()=>

                  setImageLoaded(false)

                }

                className="
                  w-full
                  h-full
                  object-cover
                "

              />

              <div

                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-black/20
                  via-black/30
                  to-black/60
                "

              />

              <div

                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  px-6
                  z-10
                "

              >

                <h2

                  className="
                    text-4xl
                    md:text-6xl
                    font-black
                    mb-5
                  "

                >

                  شركة العلا

                </h2>

                <p

                  className="
                    text-xl
                    md:text-2xl
                    max-w-4xl
                    text-white/90
                  "

                >

                  أفضل الإطارات والبطاريات
                  وخدمات السيارات

                </p>

              </div>

              <div

                className="
                  absolute
                  bottom-6
                  left-1/2
                  -translate-x-1/2
                  flex
                  gap-3
                  z-20
                "

              >

                {

                  slides.map((_, index)=>(

                    <button

                      key={index}

                      type="button"

                      onClick={()=>

                        setCurrentSlide(index)

                      }

                      className={`

                        w-4

                        h-4

                        rounded-full

                        transition-all

                        ${

                          currentSlide===index

                            ? 'bg-yellow-400 scale-125'

                            : 'bg-white/40'

                        }

                      `}

                    />

                  ))

                }

              </div>

            </>

          )

          : (

            <div

              className="
                h-full
                flex
                items-center
                justify-center
                text-3xl
                font-black
              "

            >

              لا توجد صور حالياً

            </div>

          )

      }

    </section>

  )

}
