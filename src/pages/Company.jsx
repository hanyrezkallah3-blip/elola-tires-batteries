import { useState, useEffect } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Company() {

  const {
    companyName,
    setCompanyName,
    logo,
    setLogo
  } = useWebsiteStore()

  const [name, setName] = useState(companyName || '')

  // 🔥 مهم: مزامنة لو store تغير
  useEffect(() => {
    setName(companyName || '')
  }, [companyName])

  const handleSaveName = () => {
    if (!name.trim()) return
    setCompanyName(name)
    alert('تم حفظ اسم الشركة')
  }

  const handleLogoUpload = (e) => {

    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setLogo(reader.result)
    }

    reader.readAsDataURL(file)
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10">
        إعدادات الشركة
      </h1>

      <div className="bg-slate-900 p-10 rounded-3xl border border-yellow-400 shadow-2xl">

        {/* COMPANY NAME */}
        <div className="mb-10">

          <label className="block text-2xl mb-4 font-bold">
            اسم الشركة
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسم الشركة"
            className="w-full p-5 rounded-2xl bg-white text-black text-xl outline-none"
          />

          <button
            onClick={handleSaveName}
            className="mt-5 bg-blue-700 hover:bg-blue-800 px-8 py-4 rounded-2xl text-xl font-bold"
          >
            حفظ اسم الشركة
          </button>

        </div>

        {/* LOGO */}
        <div>

          <label className="block text-2xl mb-4 font-bold">
            شعار الشركة
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full bg-white text-black p-4 rounded-2xl mb-8"
          />

          {logo && (

            <div className="flex justify-center">

              <img
                src={logo}
                alt="logo"
                className="
                  w-56 h-56 rounded-full object-cover
                  border-4 border-yellow-400
                  shadow-[0_0_40px_#facc15]
                "
              />

            </div>

          )}

        </div>

      </div>

    </div>

  )
}