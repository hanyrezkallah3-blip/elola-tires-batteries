import { useState } from 'react'

import useVehicleSearch
  from '../../hooks/useVehicleSearch'

import VehicleTypeCards
  from './VehicleTypeCards'

import VehicleSearchForm
  from './VehicleSearchForm'

import HomeSearchResults
  from './HomeSearchResults'


export default function HomeVehicleSearch() {


  const [tab, setTab] = useState('vehicle')


  const {

    loading,

    results,

    form,

    setForm,

    vehicleTypes,

    brands,

    models,

    years,

    search

  } = useVehicleSearch()



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

            onClick={() => setTab('vehicle')}

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab === 'vehicle'

                  ? 'bg-yellow-500 text-black'

                  : 'bg-slate-800'

              }

            `}

          >

            حسب المركبة

          </button>


          <button

            type="button"

            onClick={() => setTab('tire')}

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab === 'tire'

                  ? 'bg-yellow-500 text-black'

                  : 'bg-slate-800'

              }

            `}

          >

            حسب مقاس الإطار

          </button>


          <button

            type="button"

            onClick={() => setTab('battery')}

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab === 'battery'

                  ? 'bg-yellow-500 text-black'

                  : 'bg-slate-800'

              }

            `}

          >

            حسب البطارية

          </button>


          <button

            type="button"

            onClick={() => setTab('oil')}

            className={`

              rounded-2xl

              py-4

              font-black

              transition

              ${

                tab === 'oil'

                  ? 'bg-yellow-500 text-black'

                  : 'bg-slate-800'

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
            space-y-8
          "

        >


          {

            tab === 'vehicle'

            &&

            <>

              <VehicleTypeCards

                types={vehicleTypes}

                selected={form.vehicleType}

                onSelect={(vehicleType) =>

                  setForm(prev => ({

                    ...prev,

                    vehicleType,

                    brand: '',

                    model: '',

                    year: ''

                  }))

                }

              />


              <VehicleSearchForm

                vehicleTypes={vehicleTypes}

                brands={brands}

                models={models}

                years={years}

                form={form}

                setForm={setForm}

                onSearch={search}

              />

            </>

          }



          {

            tab === 'tire'

            &&

            <div

              className="
                grid
                md:grid-cols-4
                gap-4
              "

            >

              <input

                value={form.width || ''}

                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    width: e.target.value

                  }))

                }

                placeholder="عرض الإطار"

                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                "

              />


              <input

                value={form.profile || ''}

                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    profile: e.target.value

                  }))

                }

                placeholder="الارتفاع"

                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                "

              />


              <input

                value={form.rim || ''}

                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    rim: e.target.value

                  }))

                }

                placeholder="مقاس الجنط"

                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                "

              />


              <button

                type="button"

                onClick={search}

                className="
                  rounded-2xl
                  bg-yellow-500
                  text-black
                  font-black
                "

              >

                🔍 بحث

              </button>


            </div>

          }



          {

            tab === 'battery'

            &&

            <div

              className="
                grid
                md:grid-cols-2
                gap-4
              "

            >

              <input

                value={form.capacity || ''}

                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    capacity: e.target.value

                  }))

                }

                placeholder="سعة البطارية"

                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                "

              />


              <button

                type="button"

                onClick={search}

                className="
                  rounded-2xl
                  bg-yellow-500
                  text-black
                  font-black
                "

              >

                🔍 بحث

              </button>


            </div>

          }



          {

            tab === 'oil'

            &&

            <div

              className="
                grid
                md:grid-cols-2
                gap-4
              "

            >

              <input

                value={form.viscosity || ''}

                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    viscosity: e.target.value

                  }))

                }

                placeholder="لزوجة الزيت"

                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                "

              />


              <button

                type="button"

                onClick={search}

                className="
                  rounded-2xl
                  bg-yellow-500
                  text-black
                  font-black
                "

              >

                🔍 بحث

              </button>


            </div>

          }
                    {

            loading &&

            <div

              className="
                text-center
                text-yellow-400
                text-xl
                font-black
              "

            >

              جارٍ البحث...

            </div>

          }



          <HomeSearchResults

            title="نتائج البحث"

            results={results}

            emptyMessage="لا توجد منتجات مطابقة"

            renderItem={(product)=>(

              <div

                key={product.id}

                className="
                  bg-slate-800
                  rounded-2xl
                  p-5
                  border
                  border-slate-700
                "

              >

                <div className="font-black text-xl">

                  {product.name}

                </div>


                <div className="text-gray-400 mt-2">

                  {product.brand}

                </div>


                <div className="text-yellow-400 text-2xl mt-4">

                  {product.salePrice ?? product.price} ج

                </div>


              </div>

            )}

          />


        </div>


      </div>


    </section>

  )

}