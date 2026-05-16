import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Slides() {

  const {
    slides,
    addSlide,
    deleteSlide
  } = useWebsiteStore()

  const [preview, setPreview] = useState('')

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

    if (!preview) return

    addSlide({
      image: preview
    })

    setPreview('')
  }

  // ================= DELETE SLIDE =================

  const handleDelete = (id) => {
    deleteSlide(id)
  }

  return (

    <div className="p-10 text-white">

      <h1 className="text-5xl font-bold mb-10">
        إدارة السلايدر
      </h1>

      {/* UPLOAD AREA */}
      <div className="bg-slate-900 p-6 rounded-3xl mb-10">

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full bg-white text-black p-4 rounded-2xl mb-6"
        />

        {preview && (
          <img
            src={preview}
            alt=""
            className="w-full h-72 object-cover rounded-2xl mb-6"
          />
        )}

        <button
          onClick={handleAddSlide}
          className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-2xl"
        >
          إضافة الصورة للسلايدر
        </button>

      </div>

      {/* SLIDES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {slides.map((slide) => (

          <div
            key={slide.id}
            className="bg-slate-900 rounded-3xl overflow-hidden"
          >

            <img
              src={slide.image}
              alt=""
              className="w-full h-64 object-cover"
            />

            <div className="p-5">

              <button
                onClick={() => handleDelete(slide.id)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl"
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