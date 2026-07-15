import React from 'react'

export default function CompatibilityResults({

  results = [],

  onAddToCart

}) {

  if (!results.length) {

    return (

      <div className="

        bg-slate-900

        border

        border-slate-700

        rounded-3xl

        p-10

        text-center

        text-gray-400

        text-xl

      ">

        لا توجد نتائج مطابقة.

      </div>

    )

  }

  return (

    <div className="

      grid

      grid-cols-1

      md:grid-cols-2

      xl:grid-cols-3

      gap-6

    ">

      {

        results.map(product => (

          <div

            key={product.id}

            className="

              bg-slate-900

              rounded-3xl

              overflow-hidden

              border

              border-slate-700

              hover:border-yellow-500

              transition-all

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

              <div className="

                text-2xl

                font-black

                mb-3

              ">

                {product.name}

              </div>

              {

                product.brand && (

                  <div className="text-gray-400 mb-2">

                    الماركة: {product.brand}

                  </div>

                )

              }

              {

                product.model && (

                  <div className="text-gray-400 mb-2">

                    الموديل: {product.model}

                  </div>

                )

              }

              {

                product.productionDate && (

                  <div className="text-gray-400 mb-2">

                    تاريخ الإنتاج: {product.productionDate}

                  </div>

                )

              }

              <div className="

                text-yellow-400

                text-3xl

                font-black

                mt-4

              ">

                {product.price} ج

              </div>

              <div className="

                mt-3

                text-green-400

                font-bold

              ">

                {

                  Number(product.stock || 0) > 0

                    ? '✔ متوفر'

                    : '❌ غير متوفر'

                }

              </div>

              <button

                type="button"

                onClick={() => onAddToCart(product)}

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

            </div>

          </div>

        ))

      }

    </div>

  )

}