export default function ProductsFilters({

  search,
  setSearch,

  filter,
  setFilter

}) {

  return (

    <div
      className="
        flex
        flex-col
        lg:flex-row
        gap-5
        mb-14
      "
    >

      {/* SMART SEARCH */}

      <div className="flex-1">

        <input

          type="text"

          placeholder="بحث ذكي: اسم - ماركة - 205/55R16 - 70Ah - CCA - باركود - SKU"

          value={search}

          onChange={(e) =>

            setSearch(

              e.target.value

            )

          }

          className="
            w-full
            p-5
            rounded-2xl
            text-black
            text-xl
            font-bold
            shadow-xl
          "

        />

        <div className="text-xs text-gray-300 mt-2 px-2">

          أمثلة:
          Michelin،
          Bridgestone،
          Hankook،
          205/55R16،
          195/65R15،
          70Ah،
          80Ah،
          CCA،
          SKU،
          Barcode

        </div>

      </div>

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