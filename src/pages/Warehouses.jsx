import { useWebsiteStore } from '../store/websiteStore'

export default function Warehouses() {

  const {
    currentUser,
    getVisibleProducts,
    getVisibleOrders,
    getWarehouseStats
  } = useWebsiteStore()

  // ================= DATA =================

  const products = getVisibleProducts()
  const orders = getVisibleOrders()
  const stats = getWarehouseStats()

  // ================= حماية الدخول =================

  if (!currentUser) {
    return (
      <div className="p-10 text-white text-2xl">
        ⚠ يجب تسجيل الدخول أولاً
      </div>
    )
  }

  return (

    <div className="p-10 space-y-10 text-white">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-500 p-10 rounded-3xl shadow-2xl">

        <h1 className="text-5xl font-black mb-4">
          🏭 داشبورد المخزن
        </h1>

        <p className="text-2xl">
          مرحباً 👋 {currentUser.username}
        </p>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-700 p-6 rounded-3xl text-center">
          <div className="text-xl mb-2">📦 المنتجات</div>
          <div className="text-4xl font-black">
            {stats.products}
          </div>
        </div>

        <div className="bg-green-700 p-6 rounded-3xl text-center">
          <div className="text-xl mb-2">🛒 الطلبات</div>
          <div className="text-4xl font-black">
            {stats.orders}
          </div>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-3xl text-center">
          <div className="text-xl mb-2">💰 المبيعات</div>
          <div className="text-4xl font-black">
            {stats.sales}
          </div>
        </div>

        <div className="bg-purple-700 p-6 rounded-3xl text-center">
          <div className="text-xl mb-2">📊 الكمية المباعة</div>
          <div className="text-4xl font-black">
            {stats.sold}
          </div>
        </div>

      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-bold mb-6">
          📦 منتجات المخزن
        </h2>

        {products.length === 0 ? (

          <div className="text-gray-400 text-xl">
            لا توجد منتجات لهذا المخزن
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {products.map((p) => (

              <div
                key={p.id}
                className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl"
              >

                <img
                  src={p.image}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 space-y-2">

                  <h3 className="text-2xl font-bold">
                    {p.name}
                  </h3>

                  <div>💰 السعر: {p.price}</div>
                  <div>📦 المخزون: {p.stock}</div>
                  <div>🛒 المبيعات: {p.sold}</div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= ORDERS ================= */}

      <div className="bg-slate-900 p-8 rounded-3xl">

        <h2 className="text-3xl font-bold mb-6">
          🛒 طلبات المخزن
        </h2>

        {orders.length === 0 ? (

          <div className="text-gray-400 text-xl">
            لا توجد طلبات حتى الآن
          </div>

        ) : (

          <div className="space-y-4">

            {orders.map((o) => (

              <div
                key={o.id}
                className="bg-slate-800 p-5 rounded-2xl flex justify-between items-center"
              >

                <div>
                  <div className="font-bold text-xl">
                    طلب #{o.id}
                  </div>
                  <div className="text-gray-400">
                    {o.status}
                  </div>
                </div>

                <div className="text-green-400 font-bold text-xl">
                  {o.total || 0} ج
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}