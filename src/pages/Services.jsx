import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Services() {

  const {
    services,
    addService,
    deleteService
  } = useWebsiteStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [search, setSearch] = useState('')

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setImage(reader.result)

    }

    reader.readAsDataURL(file)

  }

  // ================= ADD SERVICE =================

  const handleAddService = () => {

    if (
      !title ||
      !description ||
      !image
    ) {

      alert('يرجى إدخال جميع البيانات')

      return

    }

    addService({

      title,

      description,

      image

    })

    setTitle('')
    setDescription('')
    setImage('')

    alert('تم إضافة الخدمة بنجاح')

  }

  // ================= DELETE SERVICE =================

  const handleDelete = (id) => {

    const confirmDelete = confirm(
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

        service.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

      .sort(

        (a, b) =>

          new Date(b.createdAt) -
          new Date(a.createdAt)

      )

  }, [services, search])

  // ================= TOTALS =================

  const totalServices = services.length

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* TITLE */}

      <h1
        className="
          text-5xl
          font-extrabold
          text-blue-400
          mb-10
        "
      >
        إدارة الخدمات
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
            rounded-3xl
            p-8
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
            bg-green-700
            rounded-3xl
            p-8
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
            آخر خدمة
          </h2>

          <p
            className="
              text-2xl
              font-extrabold
              break-words
            "
          >
            {services.length > 0
              ? services[
                  services.length - 1
                ]?.title
              : 'لا توجد خدمات'}
          </p>

        </div>

        <div
          className="
            bg-yellow-500
            text-black
            rounded-3xl
            p-8
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
          p-8
          rounded-3xl
          border
          border-blue-500
          shadow-2xl
          mb-12
        "
      >

        <h2
          className="
            text-4xl
            font-extrabold
            text-yellow-400
            mb-8
          "
        >
          إضافة خدمة جديدة
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

          {image && (

            <div className="relative">

              <img
                src={image}
                alt=""
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
          placeholder="بحث باسم الخدمة..."
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

      {filteredServices.length === 0 && (

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
          لا توجد خدمات حالياً
        </div>

      )}

      {/* SERVICES LIST */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

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
            "
          >

            {/* IMAGE */}

            <div className="relative">

              <img
                src={service.image}
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
                "
              >
                {service.title}
              </h2>

              <p
                className="
                  text-gray-300
                  text-xl
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