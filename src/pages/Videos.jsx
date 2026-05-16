import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Videos() {

  const {
    videos,
    addVideo,
    deleteVideo
  } = useWebsiteStore()

  const [title, setTitle] = useState('')
  const [video, setVideo] = useState('')

  // ================= VIDEO UPLOAD =================

  const handleVideoUpload = (e) => {

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setVideo(reader.result)
    }

    reader.readAsDataURL(file)
  }

  // ================= ADD VIDEO =================

  const handleAddVideo = () => {

    if (!title || !video) return

    addVideo({
      id: Date.now(),   // ⭐ مهم جداً
      title,
      video
    })

    setTitle('')
    setVideo('')
  }

  // ================= DELETE VIDEO =================

  const handleDelete = (id) => {
    deleteVideo(id)
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10">
        إدارة الفيديوهات
      </h1>

      {/* FORM */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-yellow-400 shadow-2xl mb-10">

        <input
          type="text"
          placeholder="عنوان الفيديو"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl mb-5"
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="w-full bg-white text-black p-4 rounded-2xl mb-6"
        />

        {video && (
          <video
            src={video}
            controls
            className="w-full rounded-3xl mb-6"
          />
        )}

        <button
          onClick={handleAddVideo}
          className="bg-blue-700 hover:bg-blue-800 px-8 py-4 rounded-2xl text-white font-bold text-xl"
        >
          إضافة الفيديو
        </button>

      </div>

      {/* VIDEOS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {videos.map((item) => (

          <div
            key={item.id}
            className="bg-slate-900 rounded-3xl overflow-hidden border border-blue-700 shadow-2xl"
          >

            <video
              src={item.video}
              controls
              className="w-full"
            />

            <div className="p-8">

              <h2 className="text-3xl font-bold mb-6">
                {item.title}
              </h2>

              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl"
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