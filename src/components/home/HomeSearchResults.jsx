export default function HomeSearchResults({

  title,

  results = [],

  renderItem,

  emptyMessage = 'لا توجد نتائج'

}) {

  return (

    <div className="mt-8">

      <h3
        className="
          text-2xl
          font-black
          text-yellow-400
          mb-6
        "
      >

        {title}

      </h3>

      {

        results.length === 0

        ? (

          <div
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-2xl
              p-8
              text-center
              text-gray-400
            "
          >

            {emptyMessage}

          </div>

        )

        : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {

              results.map(renderItem)

            }

          </div>

        )

      }

    </div>

  )

}