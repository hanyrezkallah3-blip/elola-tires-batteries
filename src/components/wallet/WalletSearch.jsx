export default function WalletSearch({

  search,
  setSearch

}) {

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const clearSearch = () => {
    setSearch('')
  }

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-[35px]
      p-6
      mb-10
      shadow-2xl
      overflow-hidden
      relative
    ">

      {/* BG EFFECT */}
      <div className="
        absolute
        inset-0
        opacity-5
        pointer-events-none
        text-[200px]
        flex
        items-center
        justify-center
        font-black
      ">
        🔎
      </div>

      {/* HEADER */}
      <div className="
        relative z-10 flex items-center justify-between gap-6 flex-wrap mb-6
      ">

        <div>

          <h2 className="
            text-3xl lg:text-4xl font-black text-yellow-400 mb-3
          ">
            البحث داخل المحافظ
          </h2>

          <p className="
            text-gray-400 text-lg
          ">
            ابحث باسم العميل أو الهاتف أو بيانات المحفظة
          </p>

        </div>

        <div className="
          w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30
          flex items-center justify-center text-4xl
        ">
          🔎
        </div>

      </div>

      {/* INPUT */}
      <div className="relative z-10">

        <input

          type="text"
          value={search}
          onChange={handleChange}

          placeholder="ابحث باسم العميل أو الهاتف..."

          className="
            w-full
            p-5
            pr-16
            rounded-3xl
            bg-black
            border
            border-slate-700
            text-white
            text-xl
            font-bold
            outline-none
            focus:border-yellow-500
            focus:ring-4
            focus:ring-yellow-500/20
            transition-all
          "
        />

        <div className="
          absolute top-1/2 right-5 -translate-y-1/2 text-2xl opacity-70
        ">
          🔍
        </div>

      </div>

      {/* SEARCH STATUS */}
      {search?.trim() && (

        <div className="
          relative z-10 mt-5 bg-black/40 border border-slate-700
          rounded-3xl p-4 flex justify-between items-center flex-wrap gap-4
        ">

          <div className="text-gray-300 font-bold">

            نتائج البحث عن:

            <span className="text-yellow-400 font-black mx-2">

              {search}

            </span>

          </div>

          <button

            type="button"

            onClick={clearSearch}

            className="
              bg-red-600 hover:bg-red-700
              px-5 py-2 rounded-2xl font-black
            "
          >

            ✖ مسح

          </button>

        </div>

      )}

    </div>

  )

}