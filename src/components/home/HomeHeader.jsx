import { Link } from 'react-router-dom'

export default function HomeHeader({

  companyName,

  logo,

  mobileMenu,

  setMobileMenu

}) {

  return (

    <header
      className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        border-b-4
        border-yellow-400
        px-4
        md:px-8
        py-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        {/* LOGO */}

        <div
          className="
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
          "
        >

          {

            logo

              ? (

                <img
                  src={logo}
                  alt="logo"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              )

              : (

                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    text-black
                    font-black
                  "
                >

                  LOGO

                </div>

              )

          }

        </div>

        {/* TITLE */}

        <div className="flex-1 text-center">

          <h1
            className="
              text-2xl
              md:text-5xl
              font-extrabold
              leading-tight
            "
          >

            {

              companyName ||

              'شركة العلا للإطارات والبطاريات'

            }

          </h1>

          <p
            className="
              text-sm
              md:text-lg
              mt-2
              text-white/90
            "
          >

            أفضل الإطارات والبطاريات والخدمات المتكاملة

          </p>

        </div>

        {/* DASHBOARD */}

        <Link

          to="/dashboard"

          className="
            hidden
            lg:flex
            bg-black/30
            hover:bg-black/50
            px-5
            py-3
            rounded-2xl
            font-black
            transition
          "

        >

          لوحة التحكم

        </Link>

        {/* MOBILE MENU */}

        <button

          type="button"

          onClick={()=>

            setMobileMenu(

              !mobileMenu

            )

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

  )

}