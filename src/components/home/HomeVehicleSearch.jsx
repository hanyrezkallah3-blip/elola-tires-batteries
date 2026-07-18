import { useState } from 'react'

export default function HomeVehicleSearch({

  onSearchVehicle,

  onSearchTire,

  onSearchBattery,

  onSearchOil

}) {

  const [tab, setTab] = useState('vehicle')

  return (

    <section
      className="
        bg-slate-950
        py-12
        px-4
        border-y
        border-yellow-500
      "
    >

      <div className="max-w-7xl mx-auto">

        <h2
          className="
            text-4xl
            md:text-5xl
            font-black
            text-center
            text-yellow-400
          "
        >

          ابحث عن المنتج المناسب

        </h2>

        <p
          className="
            text-center
            text-gray-300
            mt-4
            mb-10
          "
        >

          يمكنك البحث بأكثر من طريقة

        </p>

        {/* TABS */}

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-4
            mb-10
          "
        >

          <button

            type="button"

            onClick={()=>

              setTab('vehicle')

            }

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab==='vehicle'

                ?

                'bg-yellow-500 text-black'

                :

                'bg-slate-800'

              }

            `}

          >

            حسب المركبة

          </button>

          <button

            type="button"

            onClick={()=>

              setTab('tire')

            }

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab==='tire'

                ?

                'bg-yellow-500 text-black'

                :

                'bg-slate-800'

              }

            `}

          >

            حسب مقاس الإطار

          </button>

          <button

            type="button"

            onClick={()=>

              setTab('battery')

            }

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab==='battery'

                ?

                'bg-yellow-500 text-black'

                :

                'bg-slate-800'

              }

            `}

          >

            حسب البطارية

          </button>

          <button

            type="button"

            onClick={()=>

              setTab('oil')

            }

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab==='oil'

                ?

                'bg-yellow-500 text-black'

                :

                'bg-slate-800'

              }

            `}

          >

            حسب الزيت

          </button>

        </div>

        <div
          className="
            bg-slate-900
            rounded-[30px]
            p-8
            border
            border-slate-700
          "
        >

          {

            tab==='vehicle'

            &&

            <div
              className="
                text-center
                text-xl
              "
            >

              هنا سيظهر اختيار

              نوع المركبة

              →

              الشركة

              →

              الموديل

              →

              السنة

            </div>

          }

          {

            tab==='tire'

            &&

            <div
              className="
                text-center
                text-xl
              "
            >

              هنا سيظهر البحث

              بالمقاس

            </div>

          }

          {

            tab==='battery'

            &&

            <div
              className="
                text-center
                text-xl
              "
            >

              هنا سيظهر البحث

              بالبطارية

            </div>

          }

          {

            tab==='oil'

            &&

            <div
              className="
                text-center
                text-xl
              "
            >

              هنا سيظهر البحث

              بالزيت

            </div>

          }

        </div>

      </div>

    </section>

  )

}