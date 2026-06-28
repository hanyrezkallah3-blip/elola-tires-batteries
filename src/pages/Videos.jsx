import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Videos() {

  const {
    videos = [],
    addVideo,
    deleteVideo
  } = useWebsiteStore()

  const [title, setTitle] = useState('')
  const [video, setVideo] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // ================= VIDEO UPLOAD =================

  const handleVideoUpload = (e) => {

    const file = e.target.files?.[0]

    if (!file) return

    // IMPORTANT FIX
    // منع رفع فيديوهات ضخمة تسبب crash
    if (file.size > 100 * 1024 * 1024) {

      alert('حجم الفيديو كبير جداً (الحد الأقصى 100MB)')
      return

    }

    setLoading(true)

    const videoURL = URL.createObjectURL(file)

    setVideo(videoURL)

    setLoading(false)

  }

  // ================= ADD VIDEO =================

  const handleAddVideo = () => {

    if (!title || !video) {

      alert('يرجى إدخال جميع البيانات')
      return

    }

    addVideo({

      id: Date.now(),
      title,
      video,
      createdAt: new Date().toISOString()

    })

    setTitle('')
    setVideo('')

    alert('تم إضافة الفيديو بنجاح')

  }

  // ================= DELETE VIDEO =================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      'هل تريد حذف الفيديو؟'
    )

    if (confirmDelete) {

      deleteVideo(id)

    }

  }

  // ================= FILTER =================

  const filteredVideos = useMemo(() => {

    return [...videos]

      .filter((item) =>

        item?.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      )

      .sort(

        (a, b) =>

          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)

      )

  }, [videos, search])

  // ================= TOTAL =================

  const totalVideos = videos.length

  return (

    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-10">

      {/* TITLE */}

      <h1
        className="
          text-4xl
          md:text-5xl
          font-extrabold
          text-purple-400
          mb-10
        "
      >
        🎬 إدارة الفيديوهات
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
            bg-purple-700
            p-8
            rounded-3xl
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
            عدد الفيديوهات
          </h2>

          <p
            className="
              text-5xl
              font-extrabold
            "
          >
            {totalVideos}
          </p>

        </div>

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
              text-2xl
              font-bold
              mb-4
            "
          >
            آخر فيديو
          </h2>

          <p
            className="
              text-xl
              font-extrabold
              break-words
            "
          >
            {videos.length > 0
              ? videos[videos.length - 1]?.title
              : 'لا توجد فيديوهات'}
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
              text-2xl
              font-bold
              mb-4
            "
          >
            فيديوهات جاهزة
          </h2>

          <p
            className="
              text-5xl
              font-extrabold
            "
          >
            {videos.length}
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
          border-purple-500
          shadow-2xl
          mb-12
        "
      >

        <h2
          className="
            text-3xl
            font-extrabold
            text-yellow-400
            mb-8
          "
        >
          ➕ إضافة فيديو جديد
        </h2>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="عنوان الفيديو"
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

          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleVideoUpload}
            className="
              w-full
              bg-white
              text-black
              p-5
              rounded-2xl
              text-xl
            "
          />

          {loading && (

            <div className="text-center text-yellow-400 text-2xl">
              جاري تحميل الفيديو...
            </div>

          )}

          {/* PREVIEW */}

          {video && (

            <div className="relative">

              <video
                key={video}
                controls
                preload="metadata"
                controlsList="nodownload"
                className="
                  w-full
                  max-h-[500px]
                  rounded-3xl
                  border-4
                  border-purple-500
                  shadow-2xl
                  bg-black
                "
              >

                <source src={video} type="video/mp4" />

                متصفحك لا يدعم تشغيل الفيديو

              </video>

              <div
                className="
                  absolute
                  top-5
                  left-5
                  bg-purple-700
                  px-5
                  py-3
                  rounded-2xl
                  text-lg
                  font-bold
                "
              >
                معاينة الفيديو
              </div>

            </div>

          )}

          <button
            onClick={handleAddVideo}
            className="
              w-full
              bg-purple-700
              hover:bg-purple-800
              py-5
              rounded-3xl
              text-white
              text-2xl
              font-extrabold
              transition-all
            "
          >
            حفظ الفيديو
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
          placeholder="بحث بعنوان الفيديو..."
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

      {filteredVideos.length === 0 && (

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
          لا توجد فيديوهات حالياً
        </div>

      )}

      {/* VIDEOS LIST */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {filteredVideos.map((item, index) => (

          <div
            key={item.id}
            className="
              bg-slate-900
              rounded-3xl
              overflow-hidden
              border
              border-purple-500
              shadow-2xl
            "
          >

            {/* VIDEO */}

            <div className="relative bg-black">

              <video
                controls
                preload="metadata"
                controlsList="nodownload"
                className="
                  w-full
                  h-[350px]
                  bg-black
                "
              >

                <source
                  src={item.video}
                  type="video/mp4"
                />

                متصفحك لا يدعم تشغيل الفيديو

              </video>

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
                  border-purple-500
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
                  mb-6
                "
              >
                {item.title}
              </h2>

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

                  {item.createdAt
                    ? new Date(
                        item.createdAt
                      ).toLocaleString()
                    : 'غير متوفر'}

                </p>

              </div>

              {/* ACTIONS */}

              <div className="space-y-4">

                <a
                  href={item.video}
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
                  فتح الفيديو
                </a>

                <button
                  onClick={() =>
                    handleDelete(item.id)
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
                  حذف الفيديو
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}