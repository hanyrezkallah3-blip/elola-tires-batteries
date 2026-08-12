import { useUserStore } from "../store/userStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo, useState, useEffect } from 'react';

import {
  NavLink,
  useLocation,
  useNavigate } from
'react-router-dom';

import { useWebsiteStore } from '../store/websiteStore';

import { useERPBrain } from '../ai/ERPBrain';

export default function DashboardLayout({ children }) {

  useERPBrain();

  const navigate = useNavigate();
  const location = useLocation();

  // ================= STORE =================

  const currentUser =
  useUserStore((s) => s.currentUser);

  const logout =
  useUserStore((s) => s.logout);

  const notifications =
  useWebsiteStore((s) => s.notifications || []);

  const products =
  useProductStore((s) => s.products || []);

  const orders =
  useOrderStore((s) => s.orders || []);

  const transfers =
  useWebsiteStore((s) => s.transfers || []);

  // ================= SIDEBAR =================

  const [open, setOpen] = useState(false);

  // ================= USER =================

  const isOwner =
  currentUser?.role === 'owner';

  const isWarehouse =
  currentUser?.role === 'warehouse';

  const isBranch =
  currentUser?.role === 'branch';

  const isShop =
  currentUser?.role === 'shop';

  const username =
  currentUser?.username || 'مستخدم';

  const warehouseName =
  currentUser?.warehouseName || '';

const permissions =
  currentUser?.permissions || [];

  // ================= ERP AI STATUS =================

  const aiStatus = useMemo(() => {

    const totalSales =
    orders.reduce(
      (acc, o) =>
      acc + Number(o.total || 0),
      0
    );

    if (totalSales > 1000000)
    return {
      text: 'نشط بقوة',
      color: 'text-green-400'
    };

    if (totalSales > 200000)
    return {
      text: 'مستقر',
      color: 'text-yellow-400'
    };

    return {
      text: 'يحتاج تحسين',
      color: 'text-red-400'
    };

  }, [orders]);

  // ================= ROLE NAME =================

  const getRoleName = () => {

    if (isOwner)
    return '👑 مالك النظام';

    if (isWarehouse)
    return '🏭 إدارة مخزن';

    if (isBranch)
    return '🏢 إدارة فرع';

    if (isShop)
    return '🏪 إدارة معرض';

    return 'مستخدم';

  };

  // ================= PERMISSIONS =================

  const hasPermission = (permission) => {

    if (isOwner) return true;

    if (permissions.includes('all'))
    return true;

    return permissions.includes(permission);

  };

  // ================= ROUTE PROTECTION =================

  const allowedRoutes = useMemo(() => {

    return [

    '/dashboard',

    ...(hasPermission('bi') ?
    ['/bi'] :
    []),

    ...(hasPermission('ai') ?
    ['/ai'] :
    []),

    ...(hasPermission('products') ?
    ['/products'] :
    []),

    ...(hasPermission('orders') ?
    ['/orders'] :
    []),

    ...(hasPermission('offers') ?
    ['/offers'] :
    []),

    ...(hasPermission('services') ?
    ['/services'] :
    []),

    ...(hasPermission('videos') ?
    ['/videos'] :
    []),

    ...(isOwner ?
[
'/slides',
'/warehouses',
'/suppliers',
'/transfers',
'/users',
'/permissions',
'/finance',
'/wallets',
'/demand-analytics',
'/company',
'/home'
] :
[])];



  }, [currentUser]);

 // ================= AUTO BLOCK =================

useEffect(() => {

  if (!currentUser) {

    if (location.pathname !== '/login') {

      navigate('/login', {
        replace: true
      })

    }

    return
  }

  const currentPath =
    location.pathname

  const isWarehouseDetailsRoute =
    currentPath.startsWith('/warehouses/')

  const canAccessWarehouseDetails =
    isWarehouseDetailsRoute &&
    (
      isOwner ||
      (
        isWarehouse &&
        currentUser?.warehouseId ===
          currentPath.split('/')[2]
      )
    )

  if (
    currentPath !== '/dashboard' &&
    !allowedRoutes.includes(currentPath) &&
    !canAccessWarehouseDetails
  ) {

    navigate('/dashboard', {
      replace: true
    })

  }

}, [
  currentUser,
  location.pathname,
  allowedRoutes,
  isOwner,
  isWarehouse,
  navigate
])

  // ================= LINKS =================

  const links = useMemo(() => [

  {
    path: '/dashboard',
    title: '📊 لوحة التحكم',
    visible: true
  },
  
  {
  path: '/demand-analytics',
  title: '🧠 تحليل طلبات السوق',
  visible: isOwner
  },

  {
    path: '/bi',
    title: '📈 التحليلات الذكية',
    visible: hasPermission('bi')
  },

  {
    path: '/ai',
    title: '🤖 الذكاء الاصطناعي',
    visible: hasPermission('ai')
  },

  {
    path: '/finance',
    title: '💰 الإدارة المالية',
    visible: isOwner
  },

  {
    path: '/wallets',
    title: '💳 المحافظ',
    visible: isOwner
  },

  {
    path: '/products',
    title: '📦 إدارة المنتجات',
    visible: hasPermission('products')
  },

  {
    path: '/orders',
    title: '🛒 إدارة الطلبات',
    visible: hasPermission('orders')
  },

  {
    path: '/offers',
    title: '🏷 إدارة العروض',
    visible: hasPermission('offers')
  },

  {
    path: '/services',
    title: '🛠 إدارة الخدمات',
    visible: hasPermission('services')
  },

  {
    path: '/videos',
    title: '🎬 إدارة الفيديوهات',
    visible: hasPermission('videos')
  },

  {
    path: '/slides',
    title: '🖼 إدارة السلايدر',
    visible: isOwner
  },

  {
    path: '/warehouses',
    title: '🏭 إدارة المخازن',
    visible: isOwner
  },
  
  {
  path: '/suppliers',
  title: '🚚 الموردون',
  visible: isOwner
  },

  {
    path: '/transfers',
    title: '🚚 التحويلات',
    visible: isOwner
  },

  {
    path: '/users',
    title: '👥 المستخدمون',
    visible: isOwner
  },

  {
    path: '/permissions',
    title: '🔐 الصلاحيات',
    visible: isOwner
  },

  {
    path: '/company',
    title: '🏢 بيانات الشركة',
    visible: isOwner
  },

  {
    path: '/home',
    title: '🌍 الموقع الإلكتروني',
    visible: true
  }],

  [currentUser]);

  const filteredLinks = links;


  // ================= LOGOUT =================

  const handleLogout = () => {

    const ok =
    window.confirm(
      'هل تريد تسجيل الخروج؟'
    );

    if (!ok) return;

    logout();

    navigate('/login');

  };

  // ================= LINK STYLE =================

  const linkClass = ({ isActive }) => `

    flex
    items-center
    gap-3
    p-4
    rounded-2xl
    font-bold
    transition-all
    duration-300

    ${
  isActive ?

  'bg-yellow-500 text-black scale-[1.02] shadow-2xl' :

  `
          bg-slate-900
          hover:bg-yellow-500
          hover:text-black
          hover:translate-x-1
        `}

  `;


  // ================= TOTALS =================

  const totalProducts =
  products.length;

  const totalOrders =
  orders.length;

  const totalTransfers =
  transfers.length;

  // ================= UI =================

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      flex
      overflow-hidden
    ">

      {/* MOBILE OVERLAY */}

      {open &&

      <div
        onClick={() => setOpen(false)}
        className="
            lg:hidden
            fixed
            inset-0
            bg-black/80
            z-40
          " />

      }

      {/* MOBILE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
          lg:hidden
          fixed
          top-4
          left-4   
          z-50
          bg-yellow-500
          text-black
          w-14
          h-14
          rounded-2xl
          text-2xl
          font-black
          shadow-2xl
        ">

        ☰

      </button>

      {/* SIDEBAR */}

      <aside className={`

        fixed
        lg:static
        top-0
        right-0
        z-50
        h-screen
        w-[340px]

        bg-gradient-to-b
        from-slate-950
        to-black

        border-l-4
        border-yellow-500

        flex
        flex-col

        transition-all
        duration-300

        ${
      open ?
      'translate-x-0' :
      'translate-x-full lg:translate-x-0'}

      `
      }>

        {/* HEADER */}

        <div className="
          p-6
          border-b
          border-slate-800
          space-y-5
        ">

          <div className="text-center">

            <h1 className="
              text-4xl
              font-black
              text-yellow-400
            ">

              نظام ERP

            </h1>

            <div className="
              text-gray-400
              mt-2
              text-sm
            ">

              شركة العلا للإطارات والبطاريات

            </div>

          </div>

          {/* USER */}

          <div className="
            bg-slate-900
            rounded-3xl
            p-5
            border
            border-slate-800
            space-y-3
          ">

            <div className="
              text-2xl
              font-black
              text-yellow-400
            ">

              {username}

            </div>

            <div className="text-gray-300">

              {getRoleName()}

            </div>

            {!!warehouseName &&

            <div className="
                text-cyan-400
                font-bold
              ">

                📍 {warehouseName}

              </div>

            }

          </div>

          {/* AI STATUS */}

          <div className="
            bg-slate-900
            rounded-3xl
            p-5
            border
            border-slate-800
            space-y-3
          ">

            <div className="
              text-lg
              font-black
            ">

              🤖 حالة الذكاء الاصطناعي

            </div>

            <div className={`
              text-2xl
              font-black
              ${aiStatus.color}
            `}>

              {aiStatus.text}

            </div>

          </div>

          {/* QUICK STATS */}

          <div className="
            grid
            grid-cols-3
            gap-3
          ">

            <div className="
              bg-blue-700
              p-3
              rounded-2xl
              text-center
            ">

              <div className="text-xs">
                منتجات
              </div>

              <div className="
                text-xl
                font-black
              ">

                {totalProducts}

              </div>

            </div>

            <div className="
              bg-green-700
              p-3
              rounded-2xl
              text-center
            ">

              <div className="text-xs">
                طلبات
              </div>

              <div className="
                text-xl
                font-black
              ">

                {totalOrders}

              </div>

            </div>

            <div className="
              bg-purple-700
              p-3
              rounded-2xl
              text-center
            ">

              <div className="text-xs">
                تحويلات
              </div>

              <div className="
                text-xl
                font-black
              ">

                {totalTransfers}

              </div>

            </div>

          </div>

          {/* NOTIFICATIONS */}

          <div className="
            bg-slate-900
            p-4
            rounded-2xl
            flex
            justify-between
            items-center
          ">

            <span className="font-bold">

              🔔 الإشعارات

            </span>

            <span className="
              bg-red-600
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              font-black
            ">

              {notifications.length}

            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <div className="
          flex-1
          overflow-y-auto
          p-5
        ">

          <nav className="space-y-3">

            {filteredLinks.map((link) =>

            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
              onClick={() => setOpen(false)}>
              

                {link.title}

              </NavLink>

            )}

          </nav>

        </div>

        {/* FOOTER */}

        <div className="
          p-5
          border-t
          border-slate-800
          space-y-4
        ">

          <div className="
            bg-slate-900
            p-4
            rounded-2xl
            text-center
            text-sm
            text-gray-400
          ">

            الصفحة الحالية

            <div className="
              text-yellow-400
              mt-2
              font-bold
              break-all
            ">

              {location.pathname}

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              py-4
              rounded-2xl
              font-black
              transition
            ">

            🚪 تسجيل الخروج

          </button>

        </div>

      </aside>

      {/* CONTENT */}

      <main className="
        flex-1
        overflow-auto
        p-4
        lg:p-8
      ">

        <div className="
          max-w-[1900px]
          mx-auto
        ">

          {children ? children :

          <div className="
              bg-red-900/30
              border
              border-red-500
              p-10
              rounded-3xl
              text-center
              text-red-400
              text-2xl
              font-black
            ">

              ⚠ الصفحة غير متاحة

            </div>

          }

        </div>

      </main>

    </div>);



}