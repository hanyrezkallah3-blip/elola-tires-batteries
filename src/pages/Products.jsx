import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Products() {

  const {
    products,
    addProduct,
    deleteProduct,
    updateProductStock,
    toggleProductVisibility
  } = useWebsiteStore()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')

  const [search, setSearch] = useState('')

  const [filter, setFilter] = useState('all')

  // ================= IMAGE UPLOAD =================

  const handleImage = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setImage(reader.result)

    }

    reader.readAsDataURL(file)

  }

  // ================= ADD PRODUCT =================

  const handleAdd = () => {

    if (!name || !price || !image || !stock) {

      alert('يرجى إدخال جميع البيانات')

      return

    }

    addProduct({

      name,
      price,
      image,
      stock: Number(stock)

    })

    setName('')
    setPrice('')
    setStock('')
    setImage('')

    alert('تم إضافة المنتج بنجاح')

  }

  // ================= DELETE PRODUCT =================

  const handleDelete = (id) => {

    const confirmDelete = confirm(
      'هل تريد حذف المنتج؟'
    )

    if (confirmDelete) {

      deleteProduct(id)

    }

  }

  // ================= FILTER PRODUCTS =================

  const filteredProducts = useMemo(() => {

    let result = [...products]

    // SEARCH

    if (search.trim()) {

      result = result.filter((product) =>

        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

    }

    // FILTER

    if (filter === 'low') {

      result = result.filter(

        (product) =>

          Number(product.stock || 0) <= 5

      )

    }

    if (filter === 'hidden') {

      result = result.filter(

        (product) => product.hidden

      )

    }

    if (filter === 'available') {

      result = result.filter(

        (product) =>

          Number(product.stock || 0) > 0

      )

    }

    // SORT NEWEST

    result.sort(

      (a, b) =>

        new Date(b.createdAt) -
        new Date(a.createdAt)

    )

    return result

  }, [products, search, filter])

  // ================= TOTALS =================

  const totalStock = products.reduce(

    (acc, product) =>

      acc + Number(product.stock || 0),

    0

  )

  const totalSold = products.reduce(

    (acc, product) =>

      acc + Number(product.sold || 0),

    0

  )

  const hiddenProducts = products.filter(
    (product) => product.hidden
  ).length

  return (

    <div className="p-10 bg-black min-h-screen text-white">

      {/* TITLE */}

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-10
        "
      >
        إدارة المنتجات والمخزون
      </h1>

      {/* ANALYTICS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-8
          mb-12
        "
      >

        <div
          className="
            bg-blue-700
            p-8
            rounded-3xl
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-4
            "
          >
            عدد المنتجات
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {products.length}
          </p>

        </div>

        <div
          className="
            bg-green-700
            p-8
            rounded-3xl
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-4
            "
          >
            إجمالي المخزون
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {totalStock}
          </p>

        </div>

        <div
          className="
            bg-yellow-500
            text-black
            p-8
            rounded-3xl
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-4
            "
          >
            إجمالي المبيعات
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {totalSold}
          </p>

        </div>

        <div
          className="
            bg-red-700
            p-8
            rounded-3xl
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-4
            "
          >
            المنتجات المخفية
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {hiddenProducts}
          </p>

        </div>

      </div>

      {/* FORM */}

      <div
        className="
          bg-slate-900
          p-8
          rounded-3xl
          mb-12
          space-y-6
          border
          border-yellow-400
          shadow-2xl
        "
      >

        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            w-full
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        />

        <input
          type="text"
          placeholder="السعر"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="
            w-full
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        />

        <input
          type="number"
          placeholder="الكمية داخل المخزن"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          className="
            w-full
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="
            w-full
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        />

        {image && (

          <img
            src={image}
            alt=""
            className="
              w-full
              h-72
              object-cover
              rounded-3xl
            "
          />

        )}

        <button
          onClick={handleAdd}
          className="
            w-full
            bg-yellow-500
            hover:bg-yellow-600
            py-5
            rounded-3xl
            text-2xl
            font-extrabold
            text-black
          "
        >
          إضافة المنتج
        </button>

      </div>

      {/* SEARCH + FILTER */}

      <div
        className="
          bg-slate-900
          p-6
          rounded-3xl
          mb-12
          flex
          flex-col
          md:flex-row
          gap-5
        "
      >

        <input
          type="text"
          placeholder="بحث عن منتج..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            flex-1
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          className="
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
          "
        >

          <option value="all">
            جميع المنتجات
          </option>

          <option value="available">
            المتوفرة
          </option>

          <option value="low">
            القريبة من النفاد
          </option>

          <option value="hidden">
            المخفية
          </option>

        </select>

      </div>

      {/* PRODUCTS LIST */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {filteredProducts.map((product) => (

          <div
            key={product.id}
            className={`
              bg-slate-900
              rounded-3xl
              overflow-hidden
              shadow-2xl
              border
              ${product.hidden
                ? 'border-red-600 opacity-60'
                : 'border-yellow-400'
              }
            `}
          >

            <img
              src={product.image}
              alt=""
              className="
                w-full
                h-72
                object-cover
              "
            />

            <div className="p-6">

              <div className="flex justify-between items-center mb-4">

                <h2
                  className="
                    text-3xl
                    font-bold
                  "
                >
                  {product.name}
                </h2>

                {product.hidden && (

                  <div
                    className="
                      bg-red-700
                      px-4
                      py-2
                      rounded-2xl
                      text-sm
                      font-bold
                    "
                  >
                    مخفي
                  </div>

                )}

              </div>

              <p
                className="
                  text-yellow-400
                  text-4xl
                  font-extrabold
                  mb-4
                "
              >
                {product.price}
              </p>

              {/* STOCK */}

              <div className="space-y-4 mb-6">

                <div
                  className="
                    bg-black
                    p-4
                    rounded-2xl
                    text-xl
                    border
                    border-blue-700
                  "
                >
                  📦 المتبقي بالمخزن:

                  <span className="text-blue-400 font-bold mr-2">

                    {product.stock || 0}

                  </span>

                </div>

                <div
                  className="
                    bg-black
                    p-4
                    rounded-2xl
                    text-xl
                    border
                    border-green-700
                  "
                >
                  🛒 عدد المبيعات:

                  <span className="text-green-400 font-bold mr-2">

                    {product.sold || 0}

                  </span>

                </div>

                {(product.stock || 0) <= 5 &&
                  (product.stock || 0) > 0 && (

                  <div
                    className="
                      bg-red-700
                      p-4
                      rounded-2xl
                      text-center
                      font-bold
                      text-xl
                    "
                  >
                    ⚠ المنتج يقترب من النفاد
                  </div>

                )}

                {(product.stock || 0) === 0 && (

                  <div
                    className="
                      bg-red-900
                      p-4
                      rounded-2xl
                      text-center
                      font-bold
                      text-2xl
                    "
                  >
                    ❌ المنتج غير متوفر
                  </div>

                )}

              </div>

              {/* UPDATE STOCK */}

              <input
                type="number"
                placeholder="تعديل الكمية"
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-white
                  text-black
                  text-lg
                  mb-4
                "
                onBlur={(e) => {

                  if (e.target.value !== '') {

                    updateProductStock(

                      product.id,

                      Number(e.target.value)

                    )

                    alert('تم تحديث المخزون')

                  }

                }}
              />

              {/* CREATED DATE */}

              <div
                className="
                  text-gray-400
                  text-sm
                  mb-5
                  text-center
                "
              >
                تاريخ الإضافة:

                {' '}

                {new Date(
                  product.createdAt
                ).toLocaleDateString()}

              </div>

              {/* ACTIONS */}

              <div className="space-y-4">

                <button
                  onClick={() =>
                    toggleProductVisibility(
                      product.id
                    )
                  }
                  className={`
                    w-full
                    px-6
                    py-4
                    rounded-2xl
                    font-bold
                    text-xl
                    ${
                      product.hidden
                        ? 'bg-green-700 hover:bg-green-800'
                        : 'bg-gray-700 hover:bg-gray-800'
                    }
                  `}
                >
                  {product.hidden
                    ? 'إظهار المنتج'
                    : 'إخفاء المنتج'}
                </button>

                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  className="
                    w-full
                    bg-red-600
                    hover:bg-red-700
                    px-6
                    py-4
                    rounded-2xl
                    text-white
                    font-bold
                    text-xl
                  "
                >
                  حذف المنتج
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}