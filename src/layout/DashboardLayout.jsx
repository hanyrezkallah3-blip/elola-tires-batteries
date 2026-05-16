import { Link } from 'react-router-dom'

export default function DashboardLayout({ children }) {

  return (

    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}

      <aside
        className="
          w-72
          bg-gradient-to-b
          from-blue-950
          via-slate-950
          to-black
          border-r-4
          border-yellow-400
          p-6
          flex
          flex-col
          gap-4
          shadow-2xl
        "
      >

        {/* LOGO */}

        <div className="text-center mb-8">

          <h1
            className="
              text-4xl
              font-extrabold
              text-yellow-400
              animate-pulse
              mb-3
            "
          >
            شركة العلا
          </h1>

          <p
            className="
              text-blue-300
              text-lg
            "
          >
            لوحة التحكم الرئيسية
          </p>

        </div>

        {/* LINKS */}

        <Link
          to="/home"
          className="
            bg-blue-700
            hover:bg-blue-800
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          الرئيسية
        </Link>

        <Link
          to="/slides"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          السلايدر
        </Link>

        <Link
          to="/products"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          المنتجات
        </Link>

        <Link
          to="/offers"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          العروض
        </Link>

        <Link
          to="/services"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          الخدمات
        </Link>

        <Link
          to="/videos"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          الفيديوهات
        </Link>

        <Link
          to="/company"
          className="
            bg-slate-800
            hover:bg-yellow-500
            hover:text-black
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            transition-all
          "
        >
          إعدادات الشركة
        </Link>

        <Link
          to="/orders"
          className="
            bg-yellow-500
            hover:bg-yellow-600
            py-4
            px-5
            rounded-2xl
            text-xl
            font-bold
            text-center
            text-black
            transition-all
          "
        >
          طلبات العملاء
        </Link>

      </aside>

      {/* CONTENT */}

      <main className="flex-1 bg-black overflow-auto">

        {children}

      </main>

    </div>

  )

}