import DashboardLayout from '../layout/DashboardLayout'
import { useWebsiteStore } from '../store/websiteStore'

export default function Admin() {

  const {
    products,
    offers,
    videos,
    services,
    slides,
    orders,
    currentUser
  } = useWebsiteStore()

  // ================= WAREHOUSE FILTER =================

  const isOwner = currentUser?.role === 'owner'

  const filterByWarehouse = (items) => {

    if (isOwner) return items

    return items.filter(
      (item) =>
        !item.warehouseId ||
        item.warehouseId === currentUser?.id
    )
  }

  const myProducts = filterByWarehouse(products)
  const myOffers = filterByWarehouse(offers)
  const myVideos = filterByWarehouse(videos)
  const myServices = filterByWarehouse(services)
  const mySlides = filterByWarehouse(slides)
  const myOrders = filterByWarehouse(orders)

  // ================= TOTAL SALES =================

  const totalSales = myOrders.reduce(
    (acc, order) =>
      acc + Number(order.total || 0),
    0
  )

  // ================= TOTAL SOLD PRODUCTS =================

  const totalSoldProducts = myProducts.reduce(
    (acc, product) =>
      acc + Number(product.sold || 0),
    0
  )

  // ================= LOW STOCK =================

  const lowStockProducts = myProducts.filter(
    (product) =>
      Number(product.stock || 0) <= 5
  )

  // ================= TOP PRODUCT =================

  const topProduct = [...myProducts].sort(
    (a, b) =>
      Number(b.sold || 0) -
      Number(a.sold || 0)
  )[0]

  // ================= DASHBOARD CARDS =================

  const cards = [
    {
      id: 1,
      title: 'عدد المنتجات',
      value: myProducts.length,
      color: 'bg-blue-700'
    },
    {
      id: 2,
      title: 'عدد الطلبات',
      value: myOrders.length,
      color: 'bg-green-700'
    },
    {
      id: 3,
      title: 'العروض',
      value: myOffers.length,
      color: 'bg-red-700'
    },
    {
      id: 4,
      title: 'الفيديوهات',
      value: myVideos.length,
      color: 'bg-purple-700'
    },
    {
      id: 5,
      title: 'الخدمات',
      value: myServices.length,
      color: 'bg-cyan-700'
    },
    {
      id: 6,
      title: 'صور السلايدر',
      value: mySlides.length,
      color: 'bg-yellow-500 text-black'
    },
    {
      id: 7,
      title: 'إجمالي الأرباح',
      value: `${totalSales} ج`,
      color: 'bg-emerald-600'
    },
    {
      id: 8,
      title: 'إجمالي المبيعات',
      value: totalSoldProducts,
      color: 'bg-orange-500 text-black'
    }
  ]

  return (

    <DashboardLayout>

      <div className="space-y-10">

        {/* PAGE TITLE */}

        <div className="
          bg-gradient-to-r
          from-blue-950
          via-blue-700
          to-yellow-500
          rounded-3xl
          p-10
          shadow-2xl
          text-white
        ">

          <h1 className="text-5xl font-black mb-4">
            لوحة التحكم الرئيسية
          </h1>

          <p className="text-2xl text-white/90">
            {isOwner
              ? 'مرحباً بك يا مالك النظام'
              : `مرحباً بك داخل مخزن: ${currentUser?.username}`}
          </p>

        </div>

        {/* DASHBOARD CARDS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-8
        ">

          {cards.map((card) => (

            <div
              key={card.id}
              className={`${card.color} rounded-3xl p-8 shadow-2xl`}
            >

              <h2 className="text-2xl font-bold mb-6">
                {card.title}
              </h2>

              <div className="text-6xl font-extrabold break-words">
                {card.value}
              </div>

            </div>

          ))}

        </div>

        {/* TOP PRODUCT */}

        <div className="bg-white rounded-3xl p-10 shadow-2xl">

          <h2 className="text-4xl font-black text-green-700 mb-10">
            المنتج الأكثر مبيعاً
          </h2>

          {topProduct ? (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              <img
                src={topProduct.image}
                alt=""
                className="w-full h-[400px] object-cover rounded-3xl"
              />

              <div className="space-y-6">

                <h3 className="text-5xl font-black text-blue-950">
                  {topProduct.name}
                </h3>

                <div className="bg-slate-100 p-5 rounded-2xl text-2xl font-bold">
                  💰 السعر:
                  <span className="text-yellow-600 mr-3">
                    {topProduct.price}
                  </span>
                </div>

                <div className="bg-slate-100 p-5 rounded-2xl text-2xl font-bold">
                  🛒 عدد المبيعات:
                  <span className="text-green-700 mr-3">
                    {topProduct.sold || 0}
                  </span>
                </div>

                <div className="bg-slate-100 p-5 rounded-2xl text-2xl font-bold">
                  📦 المتبقي بالمخزن:
                  <span className="text-blue-700 mr-3">
                    {topProduct.stock || 0}
                  </span>
                </div>

              </div>

            </div>

          ) : (

            <div className="text-3xl text-gray-500">
              لا توجد بيانات مبيعات حتى الآن
            </div>

          )}

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-3xl p-10 shadow-2xl">

          <h2 className="text-4xl font-black text-red-700 mb-10">
            المنتجات القريبة من النفاد
          </h2>

          {lowStockProducts.length === 0 ? (

            <div className="bg-green-700 text-white p-8 rounded-3xl text-center text-3xl font-bold">
              جميع المنتجات متوفرة
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {lowStockProducts.map((product) => (

                <div
                  key={product.id}
                  className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-red-500"
                >

                  <img
                    src={product.image}
                    alt=""
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-6">

                    <h3 className="text-3xl font-black text-blue-950 mb-5">
                      {product.name}
                    </h3>

                    <div className="space-y-4">

                      <div className="bg-white p-4 rounded-2xl text-xl font-bold">
                        📦 المتبقي:
                        <span className="text-red-600 mr-2">
                          {product.stock}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl text-xl font-bold">
                        🛒 المبيعات:
                        <span className="text-green-700 mr-2">
                          {product.sold || 0}
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>

  )

}