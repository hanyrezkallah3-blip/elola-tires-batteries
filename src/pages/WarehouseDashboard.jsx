import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'

export default function WarehouseDashboard() {

  const navigate = useNavigate()

  const {
    currentUser,
    products,
    orders,
    users,
    getWarehouseStats,
    logout,
    transferProductQuantity
  } = useWebsiteStore()

  // ================= TRANSFER STATE =================

  const [selectedProduct, setSelectedProduct] = useState('')
  const [targetWarehouse, setTargetWarehouse] = useState('')
  const [quantity, setQuantity] = useState('')

  // ================= GUARD =================

  if (!currentUser || currentUser.role !== 'warehouse') {
    return (
      <div className="p-10 text-white text-2xl">
        غير مسموح بالدخول
      </div>
    )
  }

  // ================= FILTER =================

  const warehouseProducts = products.filter(
    (p) => p.warehouseId === currentUser.warehouseId
  )

  const warehouseOrders = orders.filter(
    (o) => o.warehouseId === currentUser.warehouseId
  )

  const warehouseUsers = users.filter(
    (u) =>
      u.role === 'warehouse' &&
      u.warehouseId !== currentUser.warehouseId
  )

  const stats = getWarehouseStats()

  // ================= TRANSFER =================

  const handleTransfer = () => {

    if (
      !selectedProduct ||
      !targetWarehouse ||
      !quantity
    ) {
      alert('يرجى إدخال جميع البيانات')
      return
    }

    transferProductQuantity({

      productId: selectedProduct,

      fromWarehouseId:
        currentUser.warehouseId,

      toWarehouseId:
        targetWarehouse,

      quantity: Number(quantity)

    })

    setSelectedProduct('')
    setTargetWarehouse('')
    setQuantity('')

    alert('✅ تم نقل المنتج بنجاح')
  }

  // ================= UI =================

  return (

    <div className="p-10 space-y-10 text-white">

      {/* ================= TOP BAR ================= */}

      <div className="flex flex-wrap gap-4 justify-between items-center">

        <div>

          <h1 className="text-5xl font-black text-yellow-400">
            🏬 لوحة المخزن
          </h1>

          <p className="text-gray-300 mt-2">
            مرحباً {currentUser.username}
          </p>

        </div>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="flex gap-4 flex-wrap">

          {/* 🔙 BACK */}
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 px-5 py-3 rounded-xl font-bold"
          >
            🏠 الرئيسية
          </button>

          {/* 📊 DASHBOARD */}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 px-5 py-3 rounded-xl font-bold"
          >
            📊 الداشبورد
          </button>

          {/* 🚪 LOGOUT */}
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="bg-red-600 px-5 py-3 rounded-xl font-bold"
          >
            تسجيل الخروج
          </button>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-blue-700 p-6 rounded-2xl">
          📦 المنتجات
          <div className="text-4xl font-black">
            {stats.products}
          </div>
        </div>

        <div className="bg-green-700 p-6 rounded-2xl">
          🛒 الطلبات
          <div className="text-4xl font-black">
            {stats.orders}
          </div>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-2xl">
          💰 المبيعات
          <div className="text-4xl font-black">
            {stats.sales}
          </div>
        </div>

      </div>

      {/* ================= TRANSFER PANEL ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl space-y-6">

        <h2 className="text-3xl font-bold text-yellow-400">
          🚚 نقل المنتجات بين المخازن
        </h2>

        {/* PRODUCT */}

        <select
          value={selectedProduct}
          onChange={(e) =>
            setSelectedProduct(e.target.value)
          }
          className="w-full p-4 rounded-xl text-black"
        >

          <option value="">
            اختر المنتج
          </option>

          {warehouseProducts.map((p) => (

            <option
              key={p.id}
              value={p.id}
            >
              {p.name} — المتوفر: {p.stock}
            </option>

          ))}

        </select>

        {/* TARGET WAREHOUSE */}

        <select
          value={targetWarehouse}
          onChange={(e) =>
            setTargetWarehouse(e.target.value)
          }
          className="w-full p-4 rounded-xl text-black"
        >

          <option value="">
            اختر المخزن الهدف
          </option>

          {warehouseUsers.map((w) => (

            <option
              key={w.id}
              value={w.warehouseId}
            >
              {w.warehouseName || w.username}
            </option>

          ))}

        </select>

        {/* QUANTITY */}

        <input
          type="number"
          placeholder="الكمية"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className="w-full p-4 rounded-xl text-black"
        />

        {/* BUTTON */}

        <button
          onClick={handleTransfer}
          className="
            bg-yellow-500
            hover:bg-yellow-600
            text-black
            px-8
            py-4
            rounded-2xl
            font-black
            text-xl
          "
        >
          🚚 تنفيذ النقل
        </button>

      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl">

        <h2 className="text-3xl font-bold mb-6">
          📦 منتجات المخزن
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {warehouseProducts.map((p) => (

            <div
              key={p.id}
              className="bg-slate-800 p-4 rounded-2xl"
            >

              <h3 className="text-xl font-bold">
                {p.name}
              </h3>

              <p className="text-yellow-400 font-black">
                المخزون: {p.stock}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* ================= ORDERS ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl">

        <h2 className="text-3xl font-bold mb-6">
          🛒 الطلبات
        </h2>

        <div className="space-y-4">

          {warehouseOrders.map((o) => (

            <div
              key={o.id}
              className="
                bg-slate-800
                p-4
                rounded-2xl
                flex
                justify-between
              "
            >

              <span>
                {o.status}
              </span>

              <span className="text-yellow-400 font-black">
                {o.total} جنيه
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}