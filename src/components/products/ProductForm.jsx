import {
  useCallback,
  useState
} from 'react'

export default function ProductForm({
  onAddProduct
}) {

  // ================= STATES =================

  const [name, setName] =
    useState('')

  const [price, setPrice] =
    useState('')

  const [stock, setStock] =
    useState('')

  const [image, setImage] =
    useState('')

  const [dragActive, setDragActive] =
    useState(false)

  // ================= IMAGE =================

  const handleFile =
    useCallback((file) => {

      if (!file) return

      // IMAGE VALIDATION

      if (
        !file.type.startsWith(
          'image/'
        )
      ) {

        alert(
          'يرجى اختيار صورة صحيحة'
        )

        return

      }

      // SIZE VALIDATION

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        alert(
          'حجم الصورة يجب أن يكون أقل من 5MB'
        )

        return

      }

      const reader =
        new FileReader()

      reader.onloadend = () => {

        setImage(
          reader.result
        )

      }

      reader.readAsDataURL(
        file
      )

    }, [])

  // ================= INPUT IMAGE =================

  const handleImage =
    useCallback((e) => {

      const file =
        e.target.files?.[0]

      handleFile(file)

    }, [handleFile])

  // ================= DRAG DROP =================

  const handleDrop =
    useCallback((e) => {

      e.preventDefault()

      setDragActive(false)

      const file =
        e.dataTransfer.files?.[0]

      handleFile(file)

    }, [handleFile])

  // ================= SUBMIT =================

  const handleSubmit =
    useCallback(() => {

      if (
        !name.trim() ||
        !price ||
        !stock ||
        !image
      ) {

        alert(
          'يرجى إدخال جميع البيانات'
        )

        return

      }

      if (
        Number(price) <= 0
      ) {

        alert(
          'السعر يجب أن يكون أكبر من صفر'
        )

        return

      }

      if (
        Number(stock) < 0
      ) {

        alert(
          'الكمية غير صحيحة'
        )

        return

      }

      onAddProduct({

        name:
          name.trim(),

        price:
          Number(price),

        stock:
          Number(stock),

        image

      })

      // RESET

      setName('')
      setPrice('')
      setStock('')
      setImage('')

      alert(
        '✅ تم إضافة المنتج بنجاح'
      )

    }, [

      name,
      price,
      stock,
      image,
      onAddProduct

    ])

  // ================= UI =================

  return (

    <div className="
      relative
      overflow-hidden
      bg-slate-900
      border
      border-yellow-400
      rounded-[40px]
      p-6
      lg:p-8
      mb-12
      shadow-2xl
    ">

      {/* BACKGROUND */}

      <div className="
        absolute
        top-0
        right-0
        w-72
        h-72
        bg-yellow-500/10
        blur-3xl
        rounded-full
      " />

      {/* HEADER */}

      <div className="
        relative
        flex
        items-center
        justify-between
        gap-4
        flex-wrap
        mb-10
      ">

        <div>

          <h2 className="
            text-4xl
            lg:text-5xl
            font-black
            text-yellow-400
            mb-3
          ">

            إضافة منتج جديد

          </h2>

          <p className="
            text-lg
            text-gray-300
          ">

            أضف المنتجات الجديدة للمخزون بسهولة

          </p>

        </div>

        <div className="
          bg-yellow-500
          text-black
          px-6
          py-3
          rounded-2xl
          font-black
          text-lg
          shadow-xl
        ">

          📦 إدارة المنتجات

        </div>

      </div>

      {/* FORM */}

      <div className="
        relative
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-8
      ">

        {/* LEFT */}

        <div className="
          space-y-6
        ">

          {/* NAME */}

          <div className="
            space-y-3
          ">

            <label className="
              text-xl
              font-black
            ">

              اسم المنتج

            </label>

            <input
              type="text"
              placeholder="مثال: إطار ميشلان"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
                w-full
                p-5
                rounded-3xl
                bg-white
                text-black
                text-xl
                font-bold
                outline-none
                border-4
                border-transparent
                focus:border-yellow-400
                transition-all
              "
            />

          </div>

          {/* PRICE */}

          <div className="
            space-y-3
          ">

            <label className="
              text-xl
              font-black
            ">

              السعر

            </label>

            <div className="
              relative
            ">

              <input
                type="number"
                placeholder="أدخل السعر"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                className="
                  w-full
                  p-5
                  rounded-3xl
                  bg-white
                  text-black
                  text-xl
                  font-bold
                  outline-none
                  border-4
                  border-transparent
                  focus:border-yellow-400
                  transition-all
                "
              />

              <div className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-black
                font-black
                text-xl
              ">

                ج

              </div>

            </div>

          </div>

          {/* STOCK */}

          <div className="
            space-y-3
          ">

            <label className="
              text-xl
              font-black
            ">

              الكمية بالمخزن

            </label>

            <input
              type="number"
              placeholder="أدخل الكمية"
              value={stock}
              onChange={(e) =>
                setStock(
                  e.target.value
                )
              }
              className="
                w-full
                p-5
                rounded-3xl
                bg-white
                text-black
                text-xl
                font-bold
                outline-none
                border-4
                border-transparent
                focus:border-yellow-400
                transition-all
              "
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="
          space-y-5
        ">

          {/* UPLOAD */}

          <div className="
            space-y-3
          ">

            <label className="
              text-xl
              font-black
            ">

              صورة المنتج

            </label>

            <div

              onDragOver={(e) => {

                e.preventDefault()

                setDragActive(true)

              }}

              onDragLeave={() =>
                setDragActive(false)
              }

              onDrop={handleDrop}

              className={`
                relative
                border-4
                border-dashed
                rounded-[35px]
                p-8
                transition-all
                duration-300
                text-center

                ${

                  dragActive

                    ? `
                      border-yellow-400
                      bg-yellow-500/10
                    `

                    : `
                      border-slate-600
                      bg-black/30
                    `

                }
              `}
            >

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="
                  absolute
                  inset-0
                  opacity-0
                  cursor-pointer
                "
              />

              <div className="
                text-6xl
                mb-5
              ">

                🖼️

              </div>

              <div className="
                text-2xl
                font-black
                mb-3
              ">

                اسحب الصورة هنا

              </div>

              <div className="
                text-gray-400
                text-lg
              ">

                أو اضغط لاختيار صورة

              </div>

              <div className="
                mt-4
                text-sm
                text-gray-500
              ">

                PNG / JPG / WEBP

              </div>

            </div>

          </div>

          {/* PREVIEW */}

          {

            image && (

              <div className="
                space-y-4
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">

                  <div className="
                    text-xl
                    font-black
                    text-green-400
                  ">

                    معاينة الصورة

                  </div>

                  <button

                    type="button"

                    onClick={() =>
                      setImage('')
                    }

                    className="
                      bg-red-600
                      hover:bg-red-700
                      px-5
                      py-2
                      rounded-2xl
                      font-black
                      transition-all
                    "
                  >

                    حذف الصورة

                  </button>

                </div>

                <div className="
                  overflow-hidden
                  rounded-[35px]
                  border-4
                  border-yellow-400
                  shadow-2xl
                ">

                  <img
                    src={image}
                    alt=""
                    className="
                      w-full
                      h-[350px]
                      object-cover
                    "
                  />

                </div>

              </div>

            )

          }

        </div>

      </div>

      {/* BUTTON */}

      <button

        type="button"

        onClick={handleSubmit}

        className="
          relative
          w-full
          mt-10
          bg-yellow-500
          hover:bg-yellow-600
          py-5
          rounded-[30px]
          text-2xl
          font-extrabold
          text-black
          transition-all
          duration-300
          shadow-2xl
          hover:scale-[1.01]
        "
      >

        ➕ إضافة المنتج

      </button>

    </div>

  )

}