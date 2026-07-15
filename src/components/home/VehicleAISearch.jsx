import { useMemo, useState } from 'react'

import { useWebsiteStore } from '../../store/websiteStore'

import { vehicleDatabase } from '../../data/vehicleDatabase'

import VehicleEngine from '../../engines/VehicleEngine'

export default function VehicleAISearch() {

  const products =
    useWebsiteStore(
      s => s.products || []
    )

  const [text, setText] =
    useState('')

  const result = useMemo(() => {

    if (!text.trim())
      return null

    const lower =
      text.toLowerCase()

    const vehicle = vehicleDatabase.find(item => {

      return (

        lower.includes(
          item.make.toLowerCase()
        )

        &&

        lower.includes(
          item.model.toLowerCase()
        )

        &&

        lower.includes(
          String(item.yearFrom)
        )

        ||

        lower.includes(
          String(item.yearTo)
        )

      )

    })

    if (!vehicle)
      return null

    return VehicleEngine.search({

      make: vehicle.make,

      model: vehicle.model,

      year: vehicle.yearFrom,

      products

    })

  }, [

    text,

    products

  ])

  return (

    <section className="
      mt-12
      bg-slate-900
      border
      border-blue-500
      rounded-3xl
      p-8
    ">

      <h2 className="
        text-3xl
        font-black
        mb-3
      ">

        🤖 اسأل الذكاء الاصطناعي

      </h2>

      <p className="
        text-gray-400
        mb-6
      ">

        مثال:

        Toyota Corolla 2021

        أو

        هيونداي النترا 2023

      </p>

      <textarea

        value={text}

        onChange={e =>

          setText(

            e.target.value

          )

        }

        rows={4}

        placeholder="اكتب نوع السيارة..."

        className="
          w-full
          rounded-2xl
          p-5
          text-black
          font-bold
        "

      />

      {

        result && (

          <div className="

            mt-8

            space-y-8

          ">

            <Products

              title="الإطارات"

              products={result.tires}

            />

            <Products

              title="البطاريات"

              products={result.batteries}

            />

            <Products

              title="الزيوت"

              products={result.oils}

            />

          </div>

        )

      }

    </section>

  )

}

function Products({

  title,

  products

}) {

  return (

    <div>

      <h3 className="
        text-2xl
        font-black
        text-yellow-400
        mb-5
      ">

        {title}

      </h3>

      {

        products.length === 0

        ? (

          <div className="
            bg-slate-800
            rounded-2xl
            p-5
          ">

            لا توجد نتائج.

          </div>

        )

        : (

          <div className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            {

              products.map(product => (

                <div

                  key={product.id}

                  className="
                    bg-slate-800
                    rounded-2xl
                    p-5
                  "

                >

                  <div className="
                    text-xl
                    font-black
                  ">

                    {product.name}

                  </div>

                  <div className="mt-2">

                    السعر:

                    {

                      product.salePrice ??

                      product.price

                    }

                    ج.م

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  )

}