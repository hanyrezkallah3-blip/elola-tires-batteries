export default function ProductsSkeleton() {

  const items =
    Array.from({
      length: 6
    })

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-10
      animate-pulse
    ">

      {

        items.map((_, index) => (

          <div

            key={index}

            className="
              bg-slate-900
              rounded-[35px]
              overflow-hidden
              border
              border-slate-800
              shadow-2xl
              relative
            "
          >

            {/* SHIMMER EFFECT */}

            <div className="
              absolute
              inset-0
              -translate-x-full
              animate-[shimmer_2s_infinite]
              bg-gradient-to-r
              from-transparent
              via-white/5
              to-transparent
            " />

            {/* IMAGE */}

            <div className="
              w-full
              h-72
              bg-slate-800
            " />

            {/* CONTENT */}

            <div className="
              p-6
              space-y-5
            ">

              {/* BADGES */}

              <div className="
                flex
                gap-3
              ">

                <div className="
                  h-10
                  w-28
                  rounded-2xl
                  bg-slate-800
                " />

                <div className="
                  h-10
                  w-24
                  rounded-2xl
                  bg-slate-800
                " />

              </div>

              {/* TITLE */}

              <div className="
                h-8
                rounded-xl
                bg-slate-800
                w-3/4
              " />

              {/* SUBTITLE */}

              <div className="
                h-5
                rounded-xl
                bg-slate-800
                w-1/2
              " />

              {/* PRICE */}

              <div className="
                h-14
                rounded-2xl
                bg-slate-800
                w-full
              " />

              {/* STOCK */}

              <div className="
                h-16
                rounded-2xl
                bg-slate-800
                w-full
              " />

              {/* SOLD */}

              <div className="
                h-16
                rounded-2xl
                bg-slate-800
                w-full
              " />

              {/* INPUT */}

              <div className="
                h-14
                rounded-2xl
                bg-slate-800
                w-full
              " />

              {/* BUTTONS */}

              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <div className="
                  h-14
                  rounded-2xl
                  bg-slate-800
                  w-full
                " />

                <div className="
                  h-14
                  rounded-2xl
                  bg-slate-800
                  w-full
                " />

              </div>

            </div>

          </div>

        ))

      }

    </div>

  )

}