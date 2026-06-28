export default function ProductsViewToggle({

  viewMode,

  setViewMode

}) {

  return (

    <div className="
      mb-10
      bg-slate-900
      border
      border-slate-700
      rounded-[35px]
      p-4
      shadow-2xl
      flex
      items-center
      justify-between
      flex-wrap
      gap-5
    ">

      {/* TITLE */}

      <div>

        <h2 className="
          text-2xl
          font-black
          text-yellow-400
          mb-1
        ">

          طريقة العرض

        </h2>

        <p className="
          text-gray-400
          text-lg
        ">

          اختر شكل عرض المنتجات

        </p>

      </div>

      {/* BUTTONS */}

      <div className="
        flex
        items-center
        gap-4
      ">

        {/* GRID */}

        <button

          type="button"

          onClick={() =>
            setViewMode('grid')
          }

          className={`
            px-6
            py-4
            rounded-2xl
            font-black
            text-lg
            transition-all
            border-2

            ${

              viewMode === 'grid'

                ? `
                  bg-yellow-500
                  text-black
                  border-yellow-500
                `

                : `
                  bg-black
                  text-white
                  border-slate-700
                  hover:border-yellow-500
                `

            }
          `}
        >

          ⬛ عرض شبكي

        </button>

        {/* LIST */}

        <button

          type="button"

          onClick={() =>
            setViewMode('list')
          }

          className={`
            px-6
            py-4
            rounded-2xl
            font-black
            text-lg
            transition-all
            border-2

            ${

              viewMode === 'list'

                ? `
                  bg-yellow-500
                  text-black
                  border-yellow-500
                `

                : `
                  bg-black
                  text-white
                  border-slate-700
                  hover:border-yellow-500
                `

            }
          `}
        >

          ☰ عرض قائمة

        </button>

      </div>

    </div>

  )

}