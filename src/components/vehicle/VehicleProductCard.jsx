// ======================================================
// EL OLA ERP
// Vehicle Product Card
// ======================================================

export default function VehicleProductCard({

  product,
  onClick,
  showStock = true,
  showPrice = true

}) {

  if (!product)

    return null

  const price =

    product.salePrice ??

    product.price ??

    0

  const stock =

    product.quantity ??

    product.stock ??

    0

  return (

    <article

      onClick={onClick}

      className="

        group

        bg-slate-800

        rounded-3xl

        overflow-hidden

        border

        border-slate-700

        hover:border-yellow-500

        hover:shadow-2xl

        hover:shadow-yellow-500/10

        transition-all

        duration-300

        cursor-pointer

      "

    >

      <div className="relative">

        {

          product.image ?

          (

            <img

              src={product.image}

              alt={product.name}

              className="

                w-full

                h-52

                object-cover

              "

            />

          )

          :

          (

            <div

              className="

                h-52

                flex

                items-center

                justify-center

                bg-slate-900

                text-6xl

              "

            >

              🚗

            </div>

          )

        }

        {

          product.brand &&

          <div

            className="

              absolute

              top-3

              left-3

              bg-yellow-500

              text-black

              text-xs

              font-black

              px-3

              py-1

              rounded-full

            "

          >

            {product.brand}

          </div>

        }

      </div>

      <div className="p-5 space-y-3">

        <h3

          className="

            text-xl

            font-black

            text-white

            line-clamp-2

          "

        >

          {product.name}

        </h3>

        {

          showPrice &&

          <div

            className="

              text-2xl

              font-black

              text-yellow-400

            "

          >

            {price}

            {' '}
            ج.م
          </div>

        }

        {

          product.productionDate &&

          <div

            className="

              text-sm

              text-slate-400

            "

          >

            الإنتاج:

            {' '}

            {product.productionDate}

          </div>

        }

        {

          showStock &&

          <div

            className="

              flex

              items-center

              justify-between

              pt-2

              border-t

              border-slate-700

            "

          >

            <span className="text-slate-400">

              المخزون

            </span>

            <span

              className={

                stock > 0

                ?

                "text-green-400 font-black"

                :

                "text-red-400 font-black"

              }

            >

              {stock}

            </span>

          </div>

        }

      </div>

    </article>

  )

}