import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Slides() {

  const {
    slides,
    addSlide,
    deleteSlide
  } = useWebsiteStore()

  const [preview, setPreview] = useState('')

  const [search, setSearch] = useState('')

  // ================= UPLOAD IMAGE =================

  const handleImageUpload = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {

      setPreview(reader.result)

    }

  }

  // ================= ADD SLIDE =================

  const handleAddSlide = () => {

    if (!preview) {

      alert('يرجى اختيار صورة')

      return

    }

    addSlide({
      image: preview
    })

    setPreview('')

    alert('تم إضافة الصورة بنجاح')

  }

  // ================= DELETE SLIDE =================

  const handleDelete = (id) => {

    const confirmDelete = confirm(
      'هل تريد حذف الصورة؟'
    )

    if (confirmDelete) {

      deleteSlide(id)

    }

  }

  // ================= FILTER =================

  const filteredSlides = useMemo(() => {

    return [...slides]

      .filter((slide) =>

        slide.id
          ?.toString()
          .includes(search)

      )

      .sort(

        (a, b) =>

          new Date(b.createdAt) -
          new Date(a.createdAt)

      )

  }, [slides, search])

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
        إدارة السلايدر
      </h1>

      {/* ANALYTICS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
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
            عدد الصور
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {slides.length}
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
            آخر إضافة
          </h2>

          <p
            className="
              text-2xl
              font-extrabold
              break-words
            "
          >
            {slides.length > 0
              ? new Date(
                  slides[
                    slides.length - 1
                  ]?.createdAt
                ).toLocaleDateString()
              : 'لا توجد بيانات'}
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
            صور جاهزة للعرض
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {slides.length}
          </p>

        </div>

      </div>

      {/* UPLOAD AREA */}

      <div
        className="
          bg-slate-900
          p-8
          rounded-3xl
          mb-12
          border
          border-yellow-400
          shadow-2xl
        "
      >

        <h2
          className="
            text-4xl
            font-extrabold
            mb-8
            text-blue-400
          "
        >
          إضافة صورة جديدة
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="
            w-full
            bg-white
            text-black
            p-5
            rounded-2xl
            mb-8
            text-xl
          "
        />

        {preview && (

          <div className="relative">

            <img
              src={preview}
              alt=""
              className="
                w-full
                h-[450px]
                object-cover
                rounded-3xl
                border-4
                border-yellow-400
                shadow-2xl
                mb-8
              "
            />

            <div
              className="
                absolute
                top-5
                left-5
                bg-green-600
                px-5
                py-3
                rounded-2xl
                text-xl
                font-bold
              "
            >
              معاينة الصورة
            </div>

          </div>

        )}

        <button
          onClick={handleAddSlide}
          className="
            w-full
            bg-blue-700
            hover:bg-blue-800
            py-5
            rounded-3xl
            text-2xl
            font-extrabold
            transition-all
          "
        >
          إضافة الصورة للسلايدر
        </button>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-slate-900
          p-6
          rounded-3xl
          mb-12
        "
      >

        <input
          type="text"
          placeholder="بحث برقم الصورة..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
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

      </div>

      {/* EMPTY */}

      {filteredSlides.length === 0 && (

        <div
          className="
            bg-slate-900
            rounded-3xl
            p-16
            text-center
            text-4xl
            text-gray-400
          "
        >
          لا توجد صور حالياً
        </div>

      )}

      {/* SLIDES LIST */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {filteredSlides.map((slide, index) => (

          <div
            key={slide.id}
            className="
              bg-slate-900
              rounded-3xl
              overflow-hidden
              border
              border-yellow-400
              shadow-2xl
              hover:scale-[1.02]
              transition-all
            "
          >

            {/* IMAGE */}

            <div className="relative">

              <img
                src={slide.image}
                alt=""
                className="
                  w-full
                  h-72
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  top-4
                  right-4
                  bg-black/80
                  px-4
                  py-2
                  rounded-2xl
                  text-lg
                  font-bold
                  border
                  border-yellow-400
                "
              >
                #{index + 1}
              </div>

            </div>

            {/* CONTENT */}

            <div className="p-6">

              <div
                className="
                  bg-black
                  p-4
                  rounded-2xl
                  mb-5
                  border
                  border-blue-700
                "
              >

                <p className="text-lg text-gray-300 mb-2">
                  رقم الصورة:
                </p>

                <p className="text-blue-400 font-bold break-all">
                  {slide.id}
                </p>

              </div>

              <div
                className="
                  bg-black
                  p-4
                  rounded-2xl
                  mb-6
                  border
                  border-green-700
                "
              >

                <p className="text-lg text-gray-300 mb-2">
                  تاريخ الإضافة:
                </p>

                <p className="text-green-400 font-bold">
                  {slide.createdAt
                    ? new Date(
                        slide.createdAt
                      ).toLocaleString()
                    : 'غير متوفر'}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="space-y-4">

                <a
                  href={slide.image}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    block
                    w-full
                    bg-blue-700
                    hover:bg-blue-800
                    py-4
                    rounded-2xl
                    text-center
                    text-xl
                    font-bold
                  "
                >
                  عرض الصورة
                </a>

                <button
                  onClick={() =>
                    handleDelete(slide.id)
                  }
                  className="
                    w-full
                    bg-red-600
                    hover:bg-red-700
                    py-4
                    rounded-2xl
                    text-xl
                    font-bold
                  "
                >
                  حذف الصورة
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}