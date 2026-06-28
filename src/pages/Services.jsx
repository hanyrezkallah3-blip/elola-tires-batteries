import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Services() {

  const {
    services = [],
    addService,
    deleteService
  } = useWebsiteStore()

  // ================= STATE =================

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [search, setSearch] = useState('')

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = (e) => {

    const file = e.target.files?.[0]

    if (!file) return

    // FIX IMAGE TYPES

    if (!file.type.startsWith('image/')) {

      alert('يرجى اختيار صورة فقط')

      return

    }

    const reader = new FileReader()

    reader.onload = () => {

      setImage(reader.result)

    }

    reader.onerror = () => {

      alert('حدث خطأ أثناء تحميل الصورة')

    }

    reader.readAsDataURL(file)

  }

  // ================= ADD SERVICE =================

  const handleAddService = () => {

    if (
      !title.trim() ||
      !description.trim() ||
      !image
    ) {

      alert('يرجى إدخال جميع البيانات')

      return

    }

    // FIX STORE ERROR

    if (typeof addService !== 'function') {

      alert('دالة إضافة الخدمات غير موجودة داخل WebsiteStore')

      return

    }

    addService({

      id: Date.now(),

      title: title.trim(),

      description: description.trim(),

      image,

      createdAt: new Date().toISOString()

    })

    setTitle('')
    setDescription('')
    setImage('')

    alert('✅ تم إضافة الخدمة بنجاح')

  }

  // ================= DELETE SERVICE =================

  const handleDelete = (id) => {

    if (typeof deleteService !== 'function') {

      alert('دالة حذف الخدمات غير موجودة داخل WebsiteStore')

      return

    }

    const confirmDelete = window.confirm(
      'هل تريد حذف الخدمة؟'
    )

    if (confirmDelete) {

      deleteService(id)

    }

  }

  // ================= FILTER =================

  const filteredServices = useMemo(() => {

    return [...services]

      .filter((service) =>

        service?.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

      .sort(

        (a, b) =>

          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)

      )

  }, [services, search])

  // ================= TOTALS =================

  const totalServices = services.length

  return (

    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-10">

      {/* TITLE */}

      <div className="mb-10">

        <h1
          className="
            text-4xl
            md:text-5xl
            font-extrabold
            text-blue-400
            mb-4
          "
        >
          🛠 إدارة الخدمات
        </h1>

        <p className="text-gray-400 text-lg">
          إدارة خدمات شركة العلا للإطارات والبطاريات
        </p>

      </div>

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
            bg-gradient-to-br
            from-blue-700
            to-blue-900
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            عدد الخدمات
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {totalServices}
          </p>

        </div>

        <div
          className="
            bg-gradient-to-br
            from-green-700
            to-green-900
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            آخر خدمة
          </h2>

          <p
            className="
              text-xl
              font-extrabold
              break-words
            "
          >
            {services.length > 0
              ? services[0]?.title
              : 'لا توجد خدمات'}
          </p>

        </div>

        <div
          className="
            bg-gradient-to-br
            from-yellow-400
            to-yellow-600
            text-black
            rounded-3xl
            p-8
            text-center
            shadow-2xl
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            خدمات جاهزة
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {services.length}
          </p>

        </div>

      </div>

      {/* FORM */}

      <div
        className="
          bg-slate-900
          p-6
          md:p-8
          rounded-3xl
          border
          border-blue-500
          shadow-2xl
          mb-12
        "
      >

        <h2
          className="
            text-3xl
            md:text-4xl
            font-extrabold
            text-yellow-400
            mb-8
          "
        >
          ➕ إضافة خدمة جديدة
        </h2>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="اسم الخدمة"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              outline-none
            "
          />

          <textarea
            placeholder="وصف الخدمة"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              h-40
              outline-none
            "
          />

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
              text-xl
            "
          />

          {/* PREVIEW */}

          {image && (

            <div className="relative">

              <img
                src={image}
                alt="preview"
                className="
                  w-full
                  h-[400px]
                  object-cover
                  rounded-3xl
                  border-4
                  border-blue-500
                  shadow-2xl
                "
              />

              <div
                className="
                  absolute
                  top-5
                  left-5
                  bg-blue-700
                  px-5
                  py-3
                  rounded-2xl
                  text-xl
                  font-bold
                "
              >
                معاينة الخدمة
              </div>

            </div>

          )}

          <button
            onClick={handleAddService}
            className="
              w-full
              bg-blue-700
              hover:bg-blue-800
              py-5
              rounded-3xl
              text-white
              text-2xl
              font-extrabold
              transition-all
              duration-300
            "
          >
            إضافة الخدمة
          </button>

        </div>

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
          placeholder="🔍 بحث باسم الخدمة..."
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
            outline-none
          "
        />

      </div>

      {/* EMPTY */}

      {filteredServices.length === 0 && (

        <div
          className="
            bg-slate-900
            rounded-3xl
            p-16
            text-center
            text-3xl
            text-gray-400
          "
        >
          لا توجد خدمات حالياً
        </div>

      )}

      {/* SERVICES LIST */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">

        {filteredServices.map((service, index) => (

          <div
            key={service.id}
            className="
              bg-slate-900
              rounded-3xl
              overflow-hidden
              border
              border-blue-500
              shadow-2xl
              hover:scale-[1.02]
              transition-all
              duration-300
            "
          >

            {/* IMAGE */}

            <div className="relative">

              <img
                src={service.image}
                alt={service.title}
                className="
                  w-full
                  h-72
                  object-cover
                  bg-black
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
                  border-blue-500
                "
              >
                #{index + 1}
              </div>

            </div>

            {/* CONTENT */}

            <div className="p-8">

              <h2
                className="
                  text-3xl
                  font-bold
                  mb-5
                  text-blue-300
                "
              >
                {service.title}
              </h2>

              <p
                className="
                  text-gray-300
                  text-lg
                  leading-loose
                  mb-6
                "
              >
                {service.description}
              </p>

              {/* DATE */}

              <div
                className="
                  bg-black
                  p-4
                  rounded-2xl
                  mb-6
                  border
                  border-yellow-400
                "
              >

                <p className="text-gray-400 mb-2">
                  تاريخ الإضافة:
                </p>

                <p className="text-yellow-400 font-bold">

                  {service.createdAt
                    ? new Date(
                        service.createdAt
                      ).toLocaleString()
                    : 'غير متوفر'}

                </p>

              </div>

              {/* ACTIONS */}

              <div className="space-y-4">

                <a
                  href={service.image}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    block
                    w-full
                    bg-green-700
                    hover:bg-green-800
                    py-4
                    rounded-2xl
                    text-center
                    text-xl
                    font-bold
                    transition-all
                  "
                >
                  عرض الصورة
                </a>

                <button
                  onClick={() =>
                    handleDelete(
                      service.id
                    )
                  }
                  className="
                    w-full
                    bg-red-600
                    hover:bg-red-700
                    py-4
                    rounded-2xl
                    text-xl
                    font-bold
                    transition-all
                  "
                >
                  حذف الخدمة
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}