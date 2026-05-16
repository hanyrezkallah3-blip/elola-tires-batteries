import { useState } from 'react'
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

    if (!title || !price || !image) return

    addOffer({
      id: Date.now(),   // ⭐ مهم جداً
      title,
      price,
      image
    })

    setTitle('')
    setPrice('')
    setImage('')
  }

  // ================= DELETE OFFER =================

  const handleDelete = (id) => {
    deleteOffer(id)
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10">
        إدارة العروض
      </h1>

      {/* FORM */}
      <div className="bg-slate-900 p-8 rounded-3xl border border-yellow-400 shadow-2xl mb-10">

        <input
          type="text"
          placeholder="اسم العرض"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl mb-5"
        />

        <input
          type="text"
          placeholder="السعر أو الخصم"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl mb-5"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full bg-white text-black p-4 rounded-2xl mb-6"
        />

        {image && (
          <img
            src={image}
            alt=""
            className="w-full h-72 object-cover rounded-3xl mb-6"
          />
        )}

        <button
          onClick={handleAddOffer}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 rounded-2xl text-black font-bold text-xl"
        >
          إضافة العرض
        </button>

      </div>

      {/* OFFERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {offers.map((offer) => (

          <div
            key={offer.id}
            className="bg-slate-900 rounded-3xl overflow-hidden border border-yellow-400 shadow-2xl"
          >

            <img
              src={offer.image}
              alt=""
              className="w-full h-64 object-cover"
            />

            <div className="p-8">

              <h2 className="text-3xl font-bold mb-5">
                {offer.title}
              </h2>

              <p className="text-yellow-400 text-4xl font-extrabold mb-6">
                {offer.price}
              </p>

              <button
                onClick={() => handleDelete(offer.id)}
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