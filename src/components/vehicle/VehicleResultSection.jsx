// ======================================================
// EL OLA ERP
// Vehicle Result Section
// ======================================================

import VehicleProductCard
from './VehicleProductCard'

export default function VehicleResultSection({

  title,

  icon = '🚗',

  products = [],

  emptyMessage = 'لا توجد منتجات مطابقة.'

}) {

  return (

    <section>

      <div

        className="

          flex

          items-center

          gap-3

          mb-6

        "

      >

        <span className="text-3xl">

          {icon}

        </span>

        <h2

          className="

            text-2xl

            font-black

            text-yellow-400

          "

        >

          {title}

        </h2>

        <div

          className="

            ml-auto

            bg-slate-800

            px-4

            py-1

            rounded-full

            text-sm

            font-bold

          "

        >

          {products.length}

        </div>

      </div>

      {

        products.length === 0

        ?

        (

          <div

            className="

              bg-slate-800

              border

              border-slate-700

              rounded-3xl

              p-10

              text-center

              text-slate-400

            "

          >

            {emptyMessage}

          </div>

        )

        :

        (

          <div

            className="

              grid

              md:grid-cols-2

              xl:grid-cols-3

              gap-6

            "

          >

            {

              products.map(product => (

                <VehicleProductCard

                  key={product.id}

                  product={product}

                />

              ))

            }

          </div>

        )

      }

    </section>

  )

}