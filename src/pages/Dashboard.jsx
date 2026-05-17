import { useWebsiteStore } from '../store/websiteStore'

export default function Dashboard() {

  const {

    products,
    offers,
    videos,
    services,
    slides,
    orders,
    companyName

  } = useWebsiteStore()

  // ================= TOTAL SALES =================

  const totalSales = products.reduce(

    (acc, product) =>

      acc + Number(product.sold || 0),

    0

  )

  // ================= TOTAL REVENUE =================

  const totalRevenue = orders.reduce(

    (acc, order) =>

      acc + Number(order.total || 0),

    0

  )

  // ================= TOTAL STOCK =================

  const totalStock = products.reduce(

    (acc, product) =>

      acc + Number(product.stock || 0),

    0

  )

  // ================= AVERAGE PRICE =================

  const avgPrice =

    products.length > 0

      ? (

          products.reduce(

            (acc, p) =>

              acc +

              Number(

                String(p.price)
                  .replace(/[^\d]/g, '') || 0

              ),

            0

          ) / products.length

        ).toFixed(2)

      : 0

  // ================= LOW STOCK =================

  const lowStockProducts = products.filter(

    (product) =>

      Number(product.stock || 0) <= 5

  )

  // ================= OUT OF STOCK =================

  const outOfStockProducts = products.filter(

    (product) =>

      Number(product.stock || 0) <= 0

  )

  // ================= TOP PRODUCT =================

  const topProduct =

    products.length > 0

      ? [...products].sort(

          (a, b) =>

            Number(b.sold || 0) -
            Number(a.sold || 0)

        )[0]

      : null

  // ================= LAST ORDER =================

  const lastOrder =

    orders.length > 0

      ? [...orders].reverse()[0]

      : null

  // ================= DASHBOARD CARDS =================

  const cards = [

    {
      id: 'products',
      title: 'عدد المنتجات',
      value: products.length,
      color: 'bg-blue-700'
    },

    {
      id: 'offers',
      title: 'عدد العروض',
      value: offers.length,
      color: 'bg-red-600'
    },

    {
      id: 'videos',
      title: 'عدد الفيديوهات',
      value: videos.length,
      color: 'bg-purple-700'
    },

    {
      id: 'services',
      title: 'عدد الخدمات',
      value: services.length,
      color: 'bg-green-700'
    },

    {
      id: 'slides',
      title: 'عدد صور السلايدر',
      value: slides.length,
      color: 'bg-yellow-500 text-black'
    },

    {
      id: 'orders',
      title: 'عدد الطلبات',
      value: orders.length,
      color: 'bg-orange-500 text-black'
    },

    {
      id: 'sales',
      title: 'إجمالي المبيعات',
      value: totalSales,
      color: 'bg-emerald-700'
    },

    {
      id: 'revenue',
      title: 'إجمالي الأرباح',
      value: `${totalRevenue} ج`,
      color: 'bg-cyan-600'
    },

    {
      id: 'stock',
      title: 'إجمالي المخزون',
      value: totalStock,
      color: 'bg-indigo-700'
    },

    {
      id: 'avgPrice',
      title: 'متوسط السعر',
      value: avgPrice,
      color: 'bg-pink-600'
    },

    {
      id: 'low',
      title: 'قرب النفاد',
      value: lowStockProducts.length,
      color: 'bg-red-700'
    },

    {
      id: 'out',
      title: 'غير متوفر',
      value: outOfStockProducts.length,
      color: 'bg-gray-700'
    }

  ]

  return (

    <div className="p-10 bg-black min-h-screen text-white">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          mb-14
          gap-6
        "
      >

        <div>

          <h1
            className="
              text-5xl
              font-extrabold
              text-yellow-400
              mb-4
            "
          >
            لوحة التحكم الرئيسية
          </h1>

          <p
            className="
              text-2xl
              text-gray-400
            "
          >
            مرحباً بك في إدارة

            {' '}

            {companyName}
          </p>

        </div>

        <div
          className="
            bg-slate-900
            border
            border-yellow-400
            px-8
            py-5
            rounded-3xl
            shadow-2xl
          "
        >

          <div className="text-xl text-gray-400 mb-2">
            تاريخ اليوم
          </div>

          <div className="text-2xl font-extrabold">
            {new Date().toLocaleDateString()}
          </div>

        </div>

      </div>

      {/* CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-8
          mb-16
        "
      >

        {cards.map((card) => (

          <div
            key={card.id}
            className={`
              ${card.color}
              rounded-3xl
              p-10
              shadow-2xl
              text-center
              border
              border-white/10
              hover:scale-105
              transition-all
              duration-300
            `}
          >

            <h2
              className="
                text-2xl
                font-bold
                mb-6
              "
            >
              {card.title}
            </h2>

            <p
              className="
                text-5xl
                font-extrabold
                break-words
              "
            >
              {card.value}
            </p>

          </div>

        ))}

      </div>

      {/* TOP PRODUCT */}

      <div
        className="
          bg-slate-900
          rounded-3xl
          p-8
          mb-16
          border
          border-green-500
          shadow-2xl
        "
      >

        <h2
          className="
            text-4xl
            font-extrabold
            text-green-400
            mb-10
          "
        >
          المنتج الأكثر مبيعاً
        </h2>

        {topProduct ? (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-10
              items-center
            "
          >

            <img
              src={topProduct.image}
              alt=""
              className="
                w-full
                h-[350px]
                object-cover
                rounded-3xl
                border-4
                border-green-500
              "
            />

            <div>

              <h3
                className="
                  text-5xl
                  font-extrabold
                  mb-10
                "
              >
                {topProduct.name}
              </h3>

              <div className="space-y-5">

                <div
                  className="
                    bg-black
                    p-5
                    rounded-2xl
                    border
                    border-yellow-400
                    text-2xl
                  "
                >
                  💰 السعر:

                  <span className="text-yellow-400 font-bold mr-3">
                    {topProduct.price}
                  </span>

                </div>

                <div
                  className="
                    bg-black
                    p-5
                    rounded-2xl
                    border
                    border-green-500
                    text-2xl
                  "
                >
                  🛒 المبيعات:

                  <span className="text-green-400 font-bold mr-3">
                    {topProduct.sold || 0}
                  </span>

                </div>

                <div
                  className="
                    bg-black
                    p-5
                    rounded-2xl
                    border
                    border-blue-500
                    text-2xl
                  "
                >
                  📦 المخزون:

                  <span className="text-blue-400 font-bold mr-3">
                    {topProduct.stock || 0}
                  </span>

                </div>

              </div>

            </div>

          </div>

        ) : (

          <div className="text-3xl text-gray-400">
            لا توجد بيانات حالياً
          </div>

        )}

      </div>

      {/* LAST ORDER */}

      {lastOrder && (

        <div
          className="
            bg-slate-900
            rounded-3xl
            p-8
            mb-16
            border
            border-cyan-500
            shadow-2xl
          "
        >

          <h2
            className="
              text-4xl
              font-extrabold
              text-cyan-400
              mb-8
            "
          >
            آخر طلب تم استلامه
          </h2>

          <div className="space-y-5 text-2xl">

            <div>
              👤 العميل:

              <span className="text-yellow-400 mr-3">
                {lastOrder.customerName}
              </span>
            </div>

            <div>
              📞 الهاتف:

              <span className="text-green-400 mr-3">
                {lastOrder.phone}
              </span>
            </div>

            <div>
              💰 الإجمالي:

              <span className="text-cyan-400 mr-3">
                {lastOrder.total} ج
              </span>
            </div>

            <div>
              📦 عدد المنتجات:

              <span className="text-orange-400 mr-3">
                {lastOrder.items?.length || 0}
              </span>
            </div>

          </div>

        </div>

      )}

      {/* LOW STOCK */}

      <div
        className="
          bg-slate-900
          rounded-3xl
          p-8
          border
          border-red-500
          shadow-2xl
        "
      >

        <h2
          className="
            text-4xl
            font-extrabold
            text-red-400
            mb-10
          "
        >
          المنتجات القريبة من النفاد
        </h2>

        {lowStockProducts.length === 0 ? (

          <div
            className="
              bg-green-700
              text-white
              text-3xl
              text-center
              p-8
              rounded-3xl
            "
          >
            جميع المنتجات متوفرة
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-10
            "
          >

            {lowStockProducts.map((product) => (

              <div
                key={product.id}
                className="
                  bg-black
                  rounded-3xl
                  overflow-hidden
                  border
                  border-red-500
                  shadow-2xl
                "
              >

                <img
                  src={product.image}
                  alt=""
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />

                <div className="p-6">

                  <h3
                    className="
                      text-3xl
                      font-bold
                      mb-5
                    "
                  >
                    {product.name}
                  </h3>

                  <div className="space-y-4">

                    <div
                      className="
                        bg-slate-900
                        p-4
                        rounded-2xl
                        text-xl
                      "
                    >
                      📦 المتبقي:

                      <span className="text-red-400 font-bold mr-2">
                        {product.stock}
                      </span>

                    </div>

                    <div
                      className="
                        bg-slate-900
                        p-4
                        rounded-2xl
                        text-xl
                      "
                    >
                      🛒 المبيعات:

                      <span className="text-green-400 font-bold mr-2">
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

  )

}