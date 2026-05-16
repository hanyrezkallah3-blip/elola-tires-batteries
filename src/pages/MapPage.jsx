export default function MapPage() {

  return (

    <div className="min-h-screen bg-black text-white p-10">

      {/* TITLE */}

      <h1 className="text-5xl font-black text-yellow-400 mb-10">
        إدارة الخريطة
      </h1>

      {/* CONTENT BOX */}

      <div className="bg-slate-900 rounded-3xl p-10 shadow-2xl border border-yellow-400">

        <h2 className="text-3xl font-bold mb-6">
          موقع الشركة على الخريطة
        </h2>

        {/* MAP PLACEHOLDER */}

        <div className="w-full h-[400px] bg-slate-800 rounded-3xl flex items-center justify-center text-gray-300 text-2xl">

          🗺️ سيتم إضافة Google Maps هنا لاحقاً

        </div>

        {/* INFO */}

        <p className="mt-6 text-gray-400 text-lg">
          يمكنك لاحقاً ربط هذه الصفحة بـ Google Maps API لتعديل الموقع أو تحديثه من لوحة التحكم.
        </p>

      </div>

    </div>

  )

}