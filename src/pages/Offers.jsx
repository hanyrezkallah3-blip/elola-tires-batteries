import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Offers() {

  const {
    offers,
    addOffer,
    deleteOffer
  } = useWebsiteStore()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
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

  // ================= ADD OFFER =================

  const handleAddOffer = () => {

    if (!title || !price || !image) {

      alert('يرجى إدخال جميع البيانات')

      return

    }

    addOffer({

      title,

      price,

      image

    })

    setTitle('')
    setPrice('')
    setImage('')

    alert('تم إضافة العرض بنجاح')

  }

  // ================= DELETE OFFER =================

  const handleDelete = (id) => {

    const confirmDelete = confirm(
      'هل تريد حذف العرض؟'
    )

    if (confirmDelete) {

      deleteOffer(id)

    }

  }

  // ================= FILTER =================

  const filteredOffers = useMemo(() => {

    return [...offers]

      .filter((offer) =>

        offer.title
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

  }, [offers, search])

  // ================= TOTALS =================

  const totalOffers = offers.length

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* TITLE */}

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-10
        "
      >
        إدارة العروض
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
            bg-red-600
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
            عدد العروض
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {totalOffers}
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
            آخر عرض
          </h2>

          <p
            className="
              text-2xl
              font-extrabold
              break-words
            "
          >
            {offers.length > 0
              ? offers[
                  offers.length - 1
                ]?.title
              : 'لا توجد عروض'}
          </p>

        </div>

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
            عروض جاهزة
          </h2>

          <p
            className="
              text-6xl
              font-extrabold
            "
          >
            {offers.length}
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
          border-yellow-400
          shadow-2xl
          mb-12
        "
      >

        <h2
          className="
            text-4xl
            font-extrabold
            text-blue-400
            mb-8
          "
        >
          إضافة عرض جديد
        </h2>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="اسم العرض"
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

          <input
            type="text"
            placeholder="السعر أو الخصم"
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
                  border-yellow-400
                  shadow-2xl
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
                معاينة العرض
              </div>

            </div>

          )}

          <button
            onClick={handleAddOffer}
            className="
              w-full
              bg-yellow-500
              hover:bg-yellow-600
              py-5
              rounded-3xl
              text-black
              text-2xl
              font-extrabold
              transition-all
            "
          >
            إضافة العرض
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
          placeholder="بحث باسم العرض..."
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

      {filteredOffers.length === 0 && (

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
          لا توجد عروض حالياً
        </div>

      )}

      {/* OFFERS LIST */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {filteredOffers.map((offer, index) => (

          <div
            key={offer.id}
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
                src={offer.image}
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

            <div className="p-8">

              <h2
                className="
                  text-3xl
                  font-bold
                  mb-5
                "
              >
                {offer.title}
              </h2>

              <p
                className="
                  text-yellow-400
                  text-4xl
                  font-extrabold
                  mb-6
                "
              >
                {offer.price}
              </p>

              {/* CREATED DATE */}

              <div
                className="
                  bg-black
                  p-4
                  rounded-2xl
                  mb-6
                  border
                  border-blue-700
                "
              >

                <p className="text-gray-400 mb-2">
                  تاريخ الإضافة:
                </p>

                <p className="text-blue-400 font-bold">

                  {offer.createdAt
                    ? new Date(
                        offer.createdAt
                      ).toLocaleString()
                    : 'غير متوفر'}

                </p>

              </div>

              {/* ACTIONS */}

              <div className="space-y-4">

                <a
                  href={offer.image}
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
                    handleDelete(offer.id)
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
                  حذف العرض
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}