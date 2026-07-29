export default function VehicleProductCard({

  product

}) {

  return (

    <div
      className="
        bg-slate-800
        rounded-2xl
        p-5
        border
        border-slate-700
        hover:border-yellow-500
        transition-all
      "
    >

      {

        product.image &&

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

      }

      <div
        className="
          text-xl
          font-black
          mb-2
        "
      >

        {product.name}

      </div>

      <div className="text-yellow-400 font-bold">

        {

          product.salePrice ??

          product.price ??

          0

        }

        {' '}ج.م

      </div>

      {

        product.productionDate &&

        <div
          className="
            text-sm
            text-slate-400
            mt-2
          "
        >

          تاريخ الإنتاج

          {' : '}

          {product.productionDate}

        </div>

      }

    </div>

  )

}