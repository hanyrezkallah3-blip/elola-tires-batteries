import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Products() {

  const {
    products,
    addProduct,
    deleteProduct
  } = useWebsiteStore()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  // ================= IMAGE UPLOAD =================

  const handleImage = (e) => {

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setImage(reader.result)
    }

    reader.readAsDataURL(file)
  }

  // ================= ADD PRODUCT =================

  const handleAdd = () => {

    if (!name || !price || !image) return

    addProduct({
      id: Date.now(),   // ⭐ مهم جداً
      name,
      price,
      image
    })

    setName('')
    setPrice('')
    setImage('')
  }

  // ================= DELETE PRODUCT =================

  const handleDelete = (id) => {
    deleteProduct(id)
  }

  return (

    <div className="p-10 bg-black min-h-screen text-white">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10">
        إدارة المنتجات
      </h1>

      {/* FORM */}
      <div className="bg-slate-900 p-8 rounded-3xl mb-12 space-y-6">

        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl"
        />

        <input
          type="text"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full p-5 rounded-2xl bg-white text-black text-xl"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-yellow-500 hover:bg-yellow-600 py-5 rounded-3xl text-2xl font-extrabold text-black"
        >
          إضافة المنتج
        </button>

      </div>

      {/* PRODUCTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
          >

            <img
              src={product.image}
              alt=""
              className="w-full h-72 object-cover"
            />

            <div className="p-6">

              <h2 className="text-3xl font-bold mb-4">
                {product.name}
              </h2>

              <p className="text-yellow-400 text-4xl font-extrabold mb-6">
                {product.price}
              </p>

              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl text-white font-bold"
              >
                حذف المنتج
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}