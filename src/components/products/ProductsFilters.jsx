export default function ProductsFilters({

  search,
  setSearch,

  filter,
  setFilter

}) {

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      gap-5
      mb-14
    ">

      {/* SEARCH */}

      <input
        type="text"
        placeholder="بحث عن منتج..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="
          flex-1
          p-5
          rounded-2xl
          text-black
          text-xl
          font-bold
          shadow-xl
        "
      />

      {/* FILTER */}

      <select
        value={filter}
        onChange={(e) =>
          setFilter(
            e.target.value
          )
        }
        className="
          p-5
          rounded-2xl
          text-black
          text-xl
          font-bold
          min-w-[260px]
          shadow-xl
        "
      >

        <option value="all">
          جميع المنتجات
        </option>

        <option value="available">
          المتوفرة
        </option>

        <option value="low">
          منخفضة المخزون
        </option>

        <option value="hidden">
          المخفية
        </option>

      </select>

    </div>

  )

}