import { useState } from 'react'
import {
  NavLink,
  useNavigate,
  useLocation
} from 'react-router-dom'

import { useWebsiteStore } from '../store/websiteStore'

export default function DashboardLayout({ children }) {

  const navigate = useNavigate()
  const location = useLocation()

  const {
    products,
    orders,
    currentUser
  } = useWebsiteStore()

  const [menuOpen, setMenuOpen] = useState(false)

  // ================= LOW STOCK =================

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 5
  )

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem('auth')
    navigate('/login')
  }

  // ================= NAVIGATION HELPERS =================

  const goHome = () => navigate('/home')
  const goDashboard = () => navigate('/dashboard')
  const goBack = () => navigate(-1)

  // ================= LINKS =================

  const links = [

    {
      path: '/dashboard',
      title: 'الإحصائيات',
      icon: '📊'
    },

    {
      path: '/admin',
      title: 'لوحة التحكم',
      icon: '🛠'
    },

    {
      path: '/warehouse-admin',
      title: 'إدارة المخازن',
      icon: '🏭'
    },

    {
      path: '/home',
      title: 'الموقع الرئيسي',
      icon: '🏠'
    },

    {
      path: '/slides',
      title: 'السلايدر',
      icon: '🖼'
    },

    {
      path: '/products',
      title: 'المنتجات',
      icon: '📦'
    },

    {
      path: '/offers',
      title: 'العروض',
      icon: '🔥'
    },

    {
      path: '/services',
      title: 'الخدمات',
      icon: '🛠'
    },

    {
      path: '/videos',
      title: 'الفيديوهات',
      icon: '🎥'
    },

    {
      path: '/company',
      title: 'إعدادات الشركة',
      icon: '🏢'
    },

    {
      path: '/orders',
      title: 'طلبات العملاء',
      icon: '🛒'
    }

  ]

  // ================= FILTER WAREHOUSE LINKS =================

  const filteredLinks = links.filter(link => {

    if (link.path === '/warehouse-admin') {
      return currentUser?.role === 'owner'
    }

    return true
  })

  // ================= LINK STYLE =================

  const linkClass = ({ isActive }) => `
    flex items-center justify-between gap-3
    py-4 px-5 rounded-2xl text-lg font-bold
    transition-all duration-300

    ${
      isActive
        ? 'bg-yellow-500 text-black shadow-2xl scale-105'
        : 'bg-slate-800 hover:bg-yellow-500 hover:text-black hover:scale-105'
    }
  `

  return (

    <div className="flex min-h-screen bg-black text-white overflow-hidden">

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          fixed top-5 right-5 z-[100]
          lg:hidden bg-yellow-500 text-black
          w-16 h-16 rounded-2xl text-3xl font-black shadow-2xl
        "
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:relative top-0 right-0 z-50 h-screen w-[320px]
        bg-gradient-to-b from-blue-950 via-slate-950 to-black
        border-r-4 border-yellow-400 p-6 flex flex-col
        transition-all duration-500 overflow-y-auto
        ${menuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>

        {/* TOP */}
        <div className="mb-8">

          <div className="
            bg-black/40 rounded-3xl p-6 border border-yellow-400 text-center
          ">

            <h1 className="text-4xl font-extrabold text-yellow-400 animate-pulse mb-4">
              شركة العلا
            </h1>

            <p className="text-blue-300 text-lg">
              لوحة التحكم الرئيسية
            </p>

          </div>

          {/* 🔥 QUICK NAV BUTTONS */}
          <div className="flex gap-2 mt-4">

            <button
              onClick={goHome}
              className="flex-1 bg-blue-600 p-2 rounded-xl text-sm"
            >
              الموقع
            </button>

            <button
              onClick={goDashboard}
              className="flex-1 bg-green-600 p-2 rounded-xl text-sm"
            >
              داشبورد
            </button>

            <button
              onClick={goBack}
              className="flex-1 bg-gray-600 p-2 rounded-xl text-sm"
            >
              رجوع
            </button>

          </div>

        </div>

        {/* ANALYTICS */}
        <div className="space-y-5 mb-8">

          <div className="bg-green-700 rounded-3xl p-5 text-center shadow-2xl">
            <div className="text-xl mb-2">عدد الطلبات</div>
            <div className="text-5xl font-black">{orders.length}</div>
          </div>

          <div className="bg-red-700 rounded-3xl p-5 text-center shadow-2xl">
            <div className="text-xl mb-2">المنتجات القريبة من النفاد</div>
            <div className="text-5xl font-black">{lowStockProducts.length}</div>
          </div>

        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-4">

          {filteredLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              <span>{link.title}</span>
              <span className="text-2xl">{link.icon}</span>
            </NavLink>
          ))}

        </div>

        {/* LOW STOCK */}
        {lowStockProducts.length > 0 && (
          <div className="
            mt-10 bg-black/50 border border-red-500
            rounded-3xl p-5
          ">
            <h2 className="text-2xl font-black text-red-400 mb-5 text-center">
              تنبيه المخزون
            </h2>

            <div className="space-y-4">

              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900 rounded-2xl p-4 border border-red-500"
                >
                  <div className="text-lg font-bold mb-2">
                    {product.name}
                  </div>

                  <div className="text-red-400 font-black">
                    المتبقي: {product.stock}
                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            mt-10 bg-red-700 hover:bg-red-800
            py-4 rounded-2xl text-xl font-black
          "
        >
          تسجيل الخروج
        </button>

        {/* FOOTER */}
        <div className="mt-10 pt-6 text-center text-gray-500 text-sm">
          Elola Dashboard v3.0
        </div>

      </aside>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* CONTENT */}
      <main className="flex-1 bg-black overflow-auto p-4 lg:p-8">
        {children}
      </main>

    </div>
  )
}