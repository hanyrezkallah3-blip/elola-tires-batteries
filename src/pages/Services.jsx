import { useState } from 'react'
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

  const handleImageUpload = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setImage(reader.result)

    }

    reader.readAsDataURL(file)

  }

  const handleAddService = () => {

    if (!title || !description || !image) return

    addService({
      title,
      description,
      image
    })

    setTitle('')
    setDescription('')
    setImage('')
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-10
        "
      >
        إدارة الخدمات
      </h1>

      {/* FORM */}

      <div
        className="
          bg-slate-900
          p-8
          rounded-3xl
          border
          border-yellow-400
          shadow-2xl
          mb-10
        "
      >

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
            mb-5
          "
        />

        <textarea
          placeholder="وصف الخدمة"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="
            w-full
            p-5
            rounded-2xl
            bg-white
            text-black
            text-xl
            mb-5
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
            p-4
            rounded-2xl
            mb-6
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
              mb-6
            "
          />

        )}

        <button
          onClick={handleAddService}
          className="
            bg-blue-700
            hover:bg-blue-800
            px-8
            py-4
            rounded-2xl
            text-white
            font-bold
            text-xl
          "
        >
          إضافة الخدمة
        </button>

      </div>

      {/* SERVICES */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {services.map((service, index) => (

          <div
            key={index}
            className="
              bg-slate-900
              rounded-3xl
              overflow-hidden
              border
              border-blue-700
              shadow-2xl
            "
          >

            <img
              src={service.image}
              alt=""
              className="
                w-full
                h-64
                object-cover
              "
            />

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
                  mb-6
                "
              >
                {service.description}
              </p>

              <button
                onClick={() =>
                  deleteService(index)
                }
                className="
                  bg-red-600
                  hover:bg-red-700
                  px-6
                  py-3
                  rounded-2xl
                "
              >
                حذف
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}