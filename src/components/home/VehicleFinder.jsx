import { useMemo, useState } from 'react'

import { useWebsiteStore } from '../../store/websiteStore'

import { vehicleDatabase } from '../../data/vehicleDatabase'

import VehicleEngine from '../../engines/VehicleEngine'

export default function VehicleFinder() {

  const products =
    useWebsiteStore(
      s => s.products || []
    )

  const [make, setMake] =
    useState('')

  const [model, setModel] =
    useState('')

  const [year, setYear] =
    useState('')

  const makes = useMemo(() => {

    return [

      ...new Set(

        vehicleDatabase.map(

          vehicle => vehicle.make

        )

      )

    ]

  }, [])

  const models = useMemo(() => {

    return vehicleDatabase

      .filter(

        vehicle =>

          !make ||

          vehicle.make === make

      )

      .map(

        vehicle => vehicle.model

      )

      .filter(

        (value, index, array) =>

          array.indexOf(value) === index

      )

  }, [make])

  const years = useMemo(() => {

    const values = []

    for (

      let y = 2026;

      y >= 1990;

      y--

    ) {

      values.push(y)

    }

    return values

  }, [])

  const result = useMemo(() => {

    if (

      !make ||

      !model ||

      !year

    )

      return null

    return VehicleEngine.search({

      make,

      model,

      year,

      products

    })

  }, [

    make,

    model,

    year,

    products

  ])

  return (

    <section className="
      bg-slate-900
      rounded-3xl
      p-8
      shadow-2xl
      border
      border-yellow-500
    ">

      <h2 className="
        text-4xl
        font-black
        mb-3
      ">

        🚗 اعرف المنتجات المناسبة لسيارتك

      </h2>

      <p className="
        text-gray-400
        mb-8
      ">

        اختر بيانات السيارة وسيعرض النظام المنتجات المناسبة والمتوفرة.

      </p>

      <div className="
        grid
        lg:grid-cols-3
        gap-5
      ">

        <select

          value={make}

          onChange={e => {

            setMake(e.target.value)

            setModel('')

          }}

          className="
            p-4
            rounded-2xl
            text-black
          "

        >

          <option value="">

            الشركة

          </option>

          {

            makes.map(item => (

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))

          }

        </select>

        <select

          value={model}

          onChange={e =>

            setModel(

              e.target.value

            )

          }

          className="
            p-4
            rounded-2xl
            text-black
          "

        >

          <option value="">

            الموديل

          </option>

          {

            models.map(item => (

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))

          }

        </select>

        <select

          value={year}

          onChange={e =>

            setYear(

              e.target.value

            )

          }

          className="
            p-4
            rounded-2xl
            text-black
          "

        >

          <option value="">

            سنة الصنع

          </option>

          {

            years.map(item => (

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))

          }

        </select>

      </div>

      {

        result && (

          <div className="mt-10 space-y-8">

            <ResultSection

              title="الإطارات المناسبة"

              products={result.tires}

            />

            <ResultSection

              title="البطاريات المناسبة"

              products={result.batteries}

            />

            <ResultSection

              title="الزيوت المناسبة"

              products={result.oils}

            />

          </div>

        )

      }

    </section>

  )

}

function ResultSection({

  title,

  products

}) {

  return (

    <div>

      <h3 className="
        text-2xl
        font-black
        mb-5
        text-yellow-400
      ">

        {title}

      </h3>

      {

        products.length === 0 ? (

          <div className="
            bg-slate-800
            rounded-2xl
            p-5
          ">

            لا توجد منتجات مطابقة.

          </div>

        ) : (

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
                    border
                    border-slate-700
                  "

                >

                  {

                    product.image && (

                      <img

                        src={product.image}

                        alt={product.name}

                        className="
                          w-full
                          h-44
                          object-cover
                          rounded-xl
                          mb-4
                        "

                      />

                    )

                  }

                  <div className="
                    text-xl
                    font-black
                    mb-2
                  ">

                    {product.name}

                  </div>

                  <div>

                    السعر:

                    {

                      product.salePrice ??

                      product.price ??

                      0

                    }

                    ج.م

                  </div>

                  {

                    product.productionDate && (

                      <div>

                        تاريخ الإنتاج:

                        {product.productionDate}

                      </div>

                    )

                  }

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  )

}