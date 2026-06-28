export default function ProductSearchInfo({

  totalResults,

  search,

  filter

}) {

  const filterText = {

    all:
      'جميع المنتجات',

    available:
      'المنتجات المتوفرة',

    low:
      'المنتجات منخفضة المخزون',

    hidden:
      'المنتجات المخفية'

  }

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      p-6
      mb-10
      flex
      flex-col
      lg:flex-row
      items-start
      lg:items-center
      justify-between
      gap-5
      shadow-xl
    ">

      {/* RESULTS */}

      <div className="space-y-2">

        <h2 className="
          text-2xl
          font-black
          text-yellow-400
        ">

          نتائج المنتجات

        </h2>

        <p className="
          text-lg
          text-white/80
        ">

          عدد النتائج:
          {' '}
          <span className="
            font-black
            text-green-400
          ">

            {totalResults}

          </span>

        </p>

      </div>

      {/* ACTIVE FILTERS */}

      <div className="
        flex
        flex-wrap
        gap-3
      ">

        {

          search && (

            <div className="
              bg-blue-700
              px-5
              py-2
              rounded-2xl
              font-bold
            ">

              🔍
              {' '}
              {search}

            </div>

          )

        }

        <div className="
          bg-yellow-500
          text-black
          px-5
          py-2
          rounded-2xl
          font-black
        ">

          📦
          {' '}
          {

            filterText[
              filter
            ]

          }

        </div>

      </div>

    </div>

  )

}