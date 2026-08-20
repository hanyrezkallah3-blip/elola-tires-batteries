import { useState } from 'react'

import useVehicleSearch
  from '../../hooks/useVehicleSearch'

import VehicleTypeCards
  from './VehicleTypeCards'

import VehicleSearchForm
  from './VehicleSearchForm'

import HomeSearchResults
  from './HomeSearchResults'


export default function HomeVehicleSearch({
  onAddToCart
}) {

  const [tab, setTab] =
    useState('vehicle')


  const {
    loading,
    results,
    form,
    setForm,
    vehicleTypes,
    brands,
    models,
    years,
    tireSearchError,
    search
  } = useVehicleSearch()


  // ====================================================
  // SEARCH HANDLER
  // ====================================================

  const handleSearch = () => {

    search(tab)

  }


  // ====================================================
  // ADD RESULT TO CART
  // ====================================================

  const handleAddToCart = (
    product
  ) => {

    if (
      typeof onAddToCart !==
      'function'
    ) {

      return

    }


    onAddToCart({

      ...product,

      id:
        product?.id ??
        product?.productId,

      name:
        product?.name ||
        product?.productName ||
        'منتج',

      price:
        product?.salePrice ??
        product?.price ??
        0

    })

  }


  // ====================================================
  // RESULT RENDERER
  // ====================================================

  const renderProduct = (
    product,
    index
  ) => {

    const productId =
      product?.id ??
      product?.productId ??
      index


    const productName =
      product?.name ||
      product?.productName ||
      'منتج'


    const price =
      Number(
        product?.salePrice ??
        product?.price ??
        0
      )


    const stock =
      Number(
        product?.availableQuantity ??
        product?.quantity ??
        product?.stock ??
        0
      )


    const available =
      product?.available === true ||
      stock > 0


    return (

      <div
        key={productId}
        className="
          bg-slate-900
          rounded-3xl
          overflow-hidden
          border
          border-slate-700
          p-6
        "
      >

        {/* IMAGE */}

        {product?.image ? (

          <img
            src={product.image}
            alt={productName}
            className="
              w-full
              h-56
              object-cover
              rounded-2xl
            "
          />

        ) : (

          <div
            className="
              w-full
              h-56
              rounded-2xl
              bg-slate-800
              flex
              items-center
              justify-center
              text-7xl
            "
          >
            {tab === 'battery'
              ? '🔋'
              : tab === 'oil'
                ? '🛢️'
                : '🛞'
            }
          </div>

        )}


        {/* PRODUCT NAME */}

        <div
          className="
            text-2xl
            font-black
            text-white
            mt-5
          "
        >
          {productName}
        </div>


        {/* BRAND */}

        {product?.brand && (

          <div
            className="
              text-gray-400
              mt-2
              font-bold
            "
          >
            {product.brand}
          </div>

        )}


        {/* PRODUCT TYPE */}

        {product?.type && (

          <div
            className="
              text-gray-400
              mt-2
            "
          >
            النوع: {product.type}
          </div>

        )}


        {/* TIRE */}

        {product?.tire && (

          <div
            className="
              mt-4
              bg-slate-800
              rounded-xl
              p-4
              text-gray-200
            "
          >

            <div className="font-black text-yellow-400 mb-2">
              مقاس الإطار
            </div>

            <div className="text-xl font-bold">

              {product.tire.width || ''}

              {product.tire.width && '/'}

              {
                product.tire.profile ??
                product.tire.height ??
                ''
              }

              {(
                product.tire.profile ||
                product.tire.height
              ) && '/'}

              {product.tire.rim || ''}

            </div>

          </div>

        )}


        {/* BATTERY */}

        {product?.battery && (

          <div
            className="
              mt-4
              bg-slate-800
              rounded-xl
              p-4
              text-gray-200
            "
          >

            <div className="font-black text-yellow-400">
              مواصفات البطارية
            </div>

            {product.battery.capacity && (

              <div className="mt-2">
                السعة: {product.battery.capacity}
              </div>

            )}

          </div>

        )}


        {/* OIL */}

        {product?.oil && (

          <div
            className="
              mt-4
              bg-slate-800
              rounded-xl
              p-4
              text-gray-200
            "
          >

            <div className="font-black text-yellow-400">
              مواصفات الزيت
            </div>

            {product.oil.viscosity && (

              <div className="mt-2">
                اللزوجة: {product.oil.viscosity}
              </div>

            )}

          </div>

        )}


        {/* PRICE */}

        <div
          className="
            text-yellow-400
            text-3xl
            mt-5
            font-black
          "
        >
          {price} ج
        </div>


        {/* AVAILABILITY */}

        <div
          className={`
            mt-4
            font-black
            ${
              available
                ? 'text-green-400'
                : 'text-red-400'
            }
          `}
        >
          {
            available
              ? '✔ متوفر'
              : '❌ غير متوفر'
          }
        </div>


        {/* ADD TO CART */}

        {typeof onAddToCart ===
          'function' && (

          <button
            type="button"
            onClick={() =>
              handleAddToCart(product)
            }
            className="
              w-full
              mt-6
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              py-4
              rounded-2xl
              font-black
              transition
            "
          >
            إضافة للسلة
          </button>

        )}

      </div>

    )

  }


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

        {/* TITLE */}

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
          ابحث عن الإطارات والبطاريات والزيوت والمركبات
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
            onClick={() =>
              setTab('vehicle')
            }
            className={`
              rounded-2xl
              py-4
              font-black
              transition
              ${
                tab === 'vehicle'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-slate-800 text-white'
              }
            `}
          >
            حسب المركبة
          </button>


          <button
            type="button"
            onClick={() =>
              setTab('tire')
            }
            className={`
              rounded-2xl
              py-4
              font-black
              transition
              ${
                tab === 'tire'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-slate-800 text-white'
              }
            `}
          >
            حسب مقاس الإطار
          </button>


          <button
            type="button"
            onClick={() =>
              setTab('battery')
            }
            className={`
              rounded-2xl
              py-4
              font-black
              transition
              ${
                tab === 'battery'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-slate-800 text-white'
              }
            `}
          >
            حسب البطارية
          </button>


          <button
            type="button"
            onClick={() =>
              setTab('oil')
            }
            className={`
              rounded-2xl
              py-4
              font-black
              transition
              ${
                tab === 'oil'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-slate-800 text-white'
              }
            `}
          >
            حسب الزيت
          </button>

        </div>


        {/* SEARCH BOX */}

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

          {/* VEHICLE */}

          {tab === 'vehicle' && (

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
                onSearch={() =>
                  search('vehicle')
                }
              />

            </>

          )}


          {/* TIRE */}

          {tab === 'tire' && (

            <div
              className="
                max-w-3xl
                mx-auto
                space-y-5
              "
            >

              <div>

                <label
                  className="
                    block
                    text-white
                    font-black
                    text-lg
                    mb-3
                  "
                >
                  مقاس الإطار
                </label>


                <input
                  type="text"
                  value={
                    form.tireSize || ''
                  }
                  onChange={(e) =>

                    setForm(prev => ({

                      ...prev,

                      tireSize:
                        e.target.value

                    }))

                  }
                  onKeyDown={(e) => {

                    if (
                      e.key === 'Enter'
                    ) {

                      search('tire')

                    }

                  }}
                  placeholder="مثال: 205/55/16 أو 1200/24"
                  className="
                    w-full
                    p-5
                    rounded-2xl
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    text-xl
                    font-bold
                    outline-none
                    focus:border-yellow-400
                  "
                />

              </div>


              <div
                className="
                  text-gray-400
                  text-sm
                  text-center
                "
              >
                الصيغ المقبولة:
                <span className="text-yellow-400 font-bold mx-1">
                  205/55/16
                </span>
                أو
                <span className="text-yellow-400 font-bold mx-1">
                  205*55*16
                </span>
                أو
                <span className="text-yellow-400 font-bold mx-1">
                  1200/24
                </span>
                أو
                <span className="text-yellow-400 font-bold mx-1">
                  1200*24
                </span>
              </div>


              {tireSearchError && (

                <div
                  className="
                    bg-red-950
                    border
                    border-red-600
                    text-red-300
                    rounded-2xl
                    p-4
                    text-center
                    font-bold
                  "
                >
                  {tireSearchError}
                </div>

              )}


              <button
                type="button"
                onClick={() =>
                  search('tire')
                }
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  bg-yellow-500
                  hover:bg-yellow-400
                  disabled:opacity-50
                  text-black
                  py-5
                  font-black
                  text-xl
                  transition
                "
              >
                {
                  loading
                    ? 'جارٍ البحث...'
                    : '🔍 بحث عن الإطار'
                }
              </button>

            </div>

          )}


          {/* BATTERY */}

          {tab === 'battery' && (

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >

              <input
                value={
                  form.capacity || ''
                }
                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    capacity:
                      e.target.value

                  }))

                }
                placeholder="سعة البطارية"
                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                  text-white
                "
              />


              <button
                type="button"
                onClick={() =>
                  search('battery')
                }
                disabled={loading}
                className="
                  rounded-2xl
                  bg-yellow-500
                  hover:bg-yellow-400
                  disabled:opacity-50
                  text-black
                  font-black
                "
              >
                🔍 بحث
              </button>

            </div>

          )}


          {/* OIL */}

          {tab === 'oil' && (

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >

              <input
                value={
                  form.viscosity || ''
                }
                onChange={(e) =>

                  setForm(prev => ({

                    ...prev,

                    viscosity:
                      e.target.value

                  }))

                }
                placeholder="لزوجة الزيت"
                className="
                  p-4
                  rounded-2xl
                  bg-slate-800
                  border
                  border-slate-700
                  text-white
                "
              />


              <button
                type="button"
                onClick={() =>
                  search('oil')
                }
                disabled={loading}
                className="
                  rounded-2xl
                  bg-yellow-500
                  hover:bg-yellow-400
                  disabled:opacity-50
                  text-black
                  font-black
                "
              >
                🔍 بحث
              </button>

            </div>

          )}


          {/* LOADING */}

          {loading && (

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

          )}


          {/* RESULTS */}

          <HomeSearchResults
            title="نتائج البحث"
            results={results}
            emptyMessage="لا توجد منتجات مطابقة"
            renderItem={renderProduct}
            onAddToCart={handleAddToCart}
          />

        </div>

      </div>

    </section>

  )

}