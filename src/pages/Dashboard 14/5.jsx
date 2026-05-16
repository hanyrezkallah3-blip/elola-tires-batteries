export default function Dashboard() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-black text-blue-900 mb-2">

          لوحة التحكم الرئيسية

        </h1>

        <p className="text-gray-600 text-lg">

          مرحباً بك في لوحة تحكم شركة العلا للإطارات والبطاريات

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl p-8 shadow-xl">

          <h2 className="text-gray-500 text-lg mb-4">

            عدد المنتجات

          </h2>

          <p className="text-5xl font-black text-blue-700">

            0

          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">

          <h2 className="text-gray-500 text-lg mb-4">

            عدد العروض

          </h2>

          <p className="text-5xl font-black text-yellow-500">

            0

          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">

          <h2 className="text-gray-500 text-lg mb-4">

            عدد الفيديوهات

          </h2>

          <p className="text-5xl font-black text-red-600">

            0

          </p>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">

          <h2 className="text-gray-500 text-lg mb-4">

            عدد المخازن

          </h2>

          <p className="text-5xl font-black text-green-700">

            0

          </p>

        </div>

      </div>

      <div className="bg-white rounded-3xl p-10 shadow-xl">

        <h2 className="text-3xl font-black text-blue-900 mb-6">

          حالة النظام

        </h2>

        <div className="space-y-4 text-lg">

          <p>

            ✅ لوحة التحكم تعمل بشكل سليم

          </p>

          <p>

            ✅ الصفحات مرتبطة بنظام Routes

          </p>

          <p>

            ✅ المشروع جاهز لتطوير المنتجات والسلايدر

          </p>

        </div>

      </div>

    </div>

  )

}