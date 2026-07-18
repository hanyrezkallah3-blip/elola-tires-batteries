export default function HomeNavigation({

  mobileMenu,

  scrollToSection

}) {

  const items = [

    {

      id: 'slider',

      title: 'الرئيسية',

      className: `
        bg-blue-700
        hover:bg-blue-800
      `

    },

    {

      id: 'products',

      title: 'المنتجات',

      className: `
        bg-yellow-500
        hover:bg-yellow-600
        text-black
      `

    },

    {

      id: 'offers',

      title: 'العروض',

      className: `
        bg-red-600
        hover:bg-red-700
      `

    },

    {

      id: 'services',

      title: 'الخدمات',

      className: `
        bg-cyan-600
        hover:bg-cyan-700
      `

    },

    {

      id: 'videos',

      title: 'الفيديوهات',

      className: `
        bg-purple-600
        hover:bg-purple-700
      `

    },

    {

      id: 'footer',

      title: 'تواصل معنا',

      className: `
        bg-green-600
        hover:bg-green-700
      `

    }

  ]

  return (

    <div
      className="
        sticky
        top-0
        z-40
        bg-slate-950/95
        backdrop-blur-md
        border-b
        border-yellow-500
      "
    >

      <div
        className={`
          px-4
          py-4

          ${

            mobileMenu

              ? 'block'

              : 'hidden lg:block'

          }

        `}
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            flex-wrap
            justify-center
            gap-4
          "
        >

          {

            items.map(item => (

              <button

                key={item.id}

                type="button"

                onClick={() =>

                  scrollToSection(

                    item.id

                  )

                }

                className={`

                  ${item.className}

                  px-6

                  py-3

                  rounded-2xl

                  font-bold

                  transition

                `}

              >

                {item.title}

              </button>

            ))

          }

        </div>

      </div>

    </div>

  )

}