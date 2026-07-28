import CompatibilityResults
  from './CompatibilityResults'

export default function HomeSearchResults({

  title,

  results = [],

  emptyMessage = 'لا توجد نتائج',

  onAddToCart

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

          <CompatibilityResults

            results={results}

            onAddToCart={onAddToCart}

          />

        )

      }

    </div>

  )

}