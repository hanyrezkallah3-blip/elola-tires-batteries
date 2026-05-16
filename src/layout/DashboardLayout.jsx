import { NavLink } from 'react-router-dom'

export default function DashboardLayout({ children }) {

  const linkClass = ({ isActive }) =>
    `
      py-4 px-5 rounded-2xl text-xl font-bold text-center transition-all
      ${
        isActive
          ? 'bg-yellow-500 text-black'
          : 'bg-slate-800 hover:bg-yellow-500 hover:text-black'
      }
    `

  return (

    <div className="flex min-h-screen bg-black text-white">

      {/* SIDEBAR */}
      <aside className="
        w-72 bg-gradient-to-b from-blue-950 via-slate-950 to-black
        border-r-4 border-yellow-400 p-6 flex flex-col gap-4 shadow-2xl
      ">

        {/* LOGO */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-yellow-400 animate-pulse mb-3">
            شركة العلا
          </h1>

          <p className="text-blue-300 text-lg">
            لوحة التحكم الرئيسية
          </p>

        </div>

        {/* LINKS */}

        <NavLink to="/home" className={linkClass}>
          الرئيسية
        </NavLink>

        <NavLink to="/slides" className={linkClass}>
          السلايدر
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          المنتجات
        </NavLink>

        <NavLink to="/offers" className={linkClass}>
          العروض
        </NavLink>

        <NavLink to="/services" className={linkClass}>
          الخدمات
        </NavLink>

        <NavLink to="/videos" className={linkClass}>
          الفيديوهات
        </NavLink>

        <NavLink to="/company" className={linkClass}>
          إعدادات الشركة
        </NavLink>

        <NavLink to="/orders" className={linkClass}>
          طلبات العملاء
        </NavLink>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-black overflow-auto">
        {children}
      </main>

    </div>

  )
}