import React from 'react'

function ProductCard({

  product,

  onAddToCart

}) {

  return (

    <div
      className="
        bg-slate-900
        rounded-3xl
        overflow-hidden
        border
        border-slate-700
      "
    >

      <img

        src={product.image}

        alt={product.name}

        className="
          w-full
          h-56
          object-cover
        "

      />

      <div className="p-6">

        <div
          className="
            text-2xl
            font-black
          "
        >

          {product.name}

        </div>

        {

          product.brand &&

          <div className="text-gray-400 mt-2">

            {product.brand}

          </div>

        }

        <div
          className="
            text-yellow-400
            text-3xl
            font-black
            mt-4
          "
        >

          {product.price} ج

        </div>

        <div
          className="
            mt-3
            font-bold
            text-green-400
          "
        >

          {

            Number(product.stock) > 0

            ?

            '✔ متوفر'

            :

            '❌ غير متوفر'

          }

        </div>

        {

          onAddToCart &&

          <button

            type="button"

            onClick={()=>

              onAddToCart(product)

            }

            className="
              w-full
              mt-6
              bg-yellow-500
              hover:bg-yellow-600
              rounded-2xl
              py-4
              text-black
              font-black
            "

          >

            إضافة إلى السلة

          </button>

        }

      </div>

    </div>

  )

}

function Section({

  title,

  products,

  onAddToCart

}) {

  if (!products?.length)

    return null

  return (

    <div className="space-y-6">

      <h2
        className="
          text-3xl
          font-black
          text-yellow-400
        "
      >

        {title}

      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {

          products.map(product=>

            <ProductCard

              key={product.id}

              product={product}

              onAddToCart={onAddToCart}

            />

          )

        }

      </div>

    </div>

  )

}

export default function CompatibilityResults({

  result,

  onAddToCart

}) {

  if (!result)

    return null

  const {

    vehicle,

    tires = [],

    batteries = [],

    oils = [],

    parts = []

  } = result

  return (

    <section
      className="
        max-w-7xl
        mx-auto
        mt-12
        space-y-10
      "
    >

      {

        vehicle &&

        <div
          className="
            bg-slate-900
            rounded-3xl
            p-8
            border
            border-yellow-500
          "
        >

          <div
            className="
              text-3xl
              font-black
              text-yellow-400
            "
          >

            السيارة المطابقة

          </div>

          <div className="mt-5 text-xl">

            {vehicle.make}

            {' '}

            {vehicle.model}

          </div>

          <div className="text-gray-300 mt-2">

            {vehicle.yearFrom}

            -

            {vehicle.yearTo}

          </div>

        </div>

      }

      <Section

        title="🚗 الإطارات المناسبة"

        products={tires}

        onAddToCart={onAddToCart}

      />

      <Section

        title="🔋 البطاريات المناسبة"

        products={batteries}

        onAddToCart={onAddToCart}

      />

      <Section

        title="🛢 الزيوت المناسبة"

        products={oils}

        onAddToCart={onAddToCart}

      />

      <Section

        title="🔧 قطع الغيار"

        products={parts}

        onAddToCart={onAddToCart}

      />

    </section>

  )

}