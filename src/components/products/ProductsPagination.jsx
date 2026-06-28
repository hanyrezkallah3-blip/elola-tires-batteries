export default function ProductsPagination({

  currentPage,

  totalPages,

  onPageChange

}) {

  // ================= HIDE =================

  if (
    totalPages <= 1
  ) {

    return null

  }

  // ================= PAGES =================

  const pages =
    Array.from(

      {
        length: totalPages
      },

      (_, index) =>
        index + 1

    )

  // ================= UI =================

  return (

    <div className="
      flex
      flex-wrap
      justify-center
      items-center
      gap-4
      mt-16
    ">

      {/* PREV */}

      <button

        type="button"

        disabled={
          currentPage === 1
        }

        onClick={() =>

          onPageChange(
            currentPage - 1
          )

        }

        className="
          px-6
          py-3
          rounded-2xl
          bg-slate-800
          hover:bg-slate-700
          disabled:opacity-40
          disabled:cursor-not-allowed
          text-xl
          font-black
          transition-all
        "
      >

        السابق

      </button>

      {/* PAGES */}

      {

        pages.map((page) => (

          <button

            key={page}

            type="button"

            onClick={() =>
              onPageChange(page)
            }

            className={`
              px-6
              py-3
              rounded-2xl
              text-xl
              font-black
              transition-all

              ${
                currentPage === page

                  ? `
                    bg-yellow-500
                    text-black
                    scale-110
                  `

                  : `
                    bg-slate-800
                    hover:bg-slate-700
                  `
              }
            `}
          >

            {page}

          </button>

        ))

      }

      {/* NEXT */}

      <button

        type="button"

        disabled={
          currentPage === totalPages
        }

        onClick={() =>

          onPageChange(
            currentPage + 1
          )

        }

        className="
          px-6
          py-3
          rounded-2xl
          bg-slate-800
          hover:bg-slate-700
          disabled:opacity-40
          disabled:cursor-not-allowed
          text-xl
          font-black
          transition-all
        "
      >

        التالي

      </button>

    </div>

  )

}