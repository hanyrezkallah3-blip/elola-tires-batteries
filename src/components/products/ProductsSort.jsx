export default function ProductsSort({

  sortBy,

  setSortBy

}) {

  const sortButtons = [

    {
      id: 'newest',
      label: 'الأحدث',
      icon: '🆕'
    },

    {
      id: 'oldest',
      label: 'الأقدم',
      icon: '📦'
    },

    {
      id: 'priceHigh',
      label: 'الأعلى سعرًا',
      icon: '💰'
    },

    {
      id: 'priceLow',
      label: 'الأقل سعرًا',
      icon: '🏷️'
    },

    {
      id: 'stockHigh',
      label: 'الأعلى مخزونًا',
      icon: '📈'
    },

    {
      id: 'stockLow',
      label: 'الأقل مخزونًا',
      icon: '📉'
    }

  ]

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-[35px]
      p-6
      mb-10
      shadow-2xl
    ">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-6
      ">

        <div>

          <h2 className="
            text-3xl
            font-black
            text-yellow-400
            mb-2
          ">

            ترتيب المنتجات

          </h2>

          <p className="
            text-gray-300
            text-lg
          ">

            اختر أفضل طريقة لعرض المنتجات

          </p>

        </div>

        {/* CURRENT */}

        <div className="
          bg-black
          border
          border-yellow-500
          px-5
          py-3
          rounded-2xl
          text-lg
          font-black
          text-yellow-400
        ">

          الترتيب الحالي:
          {' '}

          {

            sortButtons.find(
              (item) =>
                item.id === sortBy
            )?.label

          }

        </div>

      </div>

      {/* BUTTONS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        gap-4
      ">

        {

          sortButtons.map((item) => (

            <button

              key={item.id}

              type="button"

              onClick={() =>
                setSortBy(item.id)
              }

              className={`
                p-5
                rounded-3xl
                border-2
                transition-all
                duration-300
                text-right
                hover:scale-[1.02]
                hover:shadow-2xl

                ${

                  sortBy === item.id

                    ? `
                      bg-yellow-500
                      border-yellow-400
                      text-black
                    `

                    : `
                      bg-black
                      border-slate-700
                      text-white
                      hover:border-yellow-500
                    `

                }
              `}
            >

              <div className="
                flex
                items-center
                gap-4
              ">

                <div className="
                  text-4xl
                ">

                  {item.icon}

                </div>

                <div>

                  <div className="
                    text-xl
                    font-black
                    mb-1
                  ">

                    {item.label}

                  </div>

                  <div className="
                    text-sm
                    opacity-80
                  ">

                    {

                      item.id === 'newest' &&
                      'عرض أحدث المنتجات أولًا'

                    }

                    {

                      item.id === 'oldest' &&
                      'عرض أقدم المنتجات أولًا'

                    }

                    {

                      item.id === 'priceHigh' &&
                      'المنتجات الأغلى سعرًا'

                    }

                    {

                      item.id === 'priceLow' &&
                      'المنتجات الأرخص سعرًا'

                    }

                    {

                      item.id === 'stockHigh' &&
                      'المنتجات الأعلى بالمخزون'

                    }

                    {

                      item.id === 'stockLow' &&
                      'المنتجات الأقل بالمخزون'

                    }

                  </div>

                </div>

              </div>

            </button>

          ))

        }

      </div>

    </div>

  )

}