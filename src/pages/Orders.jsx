import { useMemo } from 'react'

import { useWebsiteStore }
  from '../store/websiteStore'

export default function Orders() {

  const {
    orders,
    deleteOrder,
    updateOrderStatus,
    currentUser
  } = useWebsiteStore()

  // ================= SECURITY FILTER =================

  const visibleOrders = useMemo(() => {

    if (currentUser?.role === 'owner') {
      return orders
    }

    // كل مستخدم يرى طلباته فقط
    return orders.filter(order =>
      order.createdBy === currentUser?.username
    )

  }, [orders, currentUser])

  // ================= MEMOIZED DATA =================

  const totalRevenue = useMemo(() => {

    return visibleOrders.reduce(

      (acc, order) =>
        acc + Number(order.total || 0),

      0

    )

  }, [visibleOrders])

  const newOrdersCount = useMemo(() => {

    return visibleOrders.filter(
      (o) => o.status === 'طلب جديد'
    ).length

  }, [visibleOrders])

  // ================= DELETE =================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      'هل تريد حذف الطلب؟'
    )

    if (!confirmDelete) return

    deleteOrder(id)
  }

  return (

    <div className="min-h-screen bg-black text-white p-10">

      {/* TITLE */}

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-10
        "
      >
        إدارة الطلبات
      </h1>

      {/* ANALYTICS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
          mb-12
        "
      >

        <div className="
            bg-blue-700
            p-8
            rounded-3xl
            text-center
          "
        >

          <h2 className="text-3xl font-bold mb-4">
            عدد الطلبات
          </h2>

          <p className="text-6xl font-extrabold">
            {visibleOrders.length}
          </p>

        </div>

        <div className="
            bg-green-700
            p-8
            rounded-3xl
            text-center
          "
        >

          <h2 className="text-3xl font-bold mb-4">
            إجمالي الأرباح
          </h2>

          <p className="text-5xl font-extrabold">
            {totalRevenue} ج
          </p>

        </div>

        <div className="
            bg-yellow-500
            text-black
            p-8
            rounded-3xl
            text-center
          "
        >

          <h2 className="text-3xl font-bold mb-4">
            الطلبات الجديدة
          </h2>

          <p className="text-6xl font-extrabold">
            {newOrdersCount}
          </p>

        </div>

      </div>

      {/* EMPTY */}

      {visibleOrders.length === 0 && (

        <div className="
            text-center
            text-4xl
            text-gray-400
            mt-20
          "
        >
          لا توجد طلبات حالياً
        </div>

      )}

      {/* ORDERS */}

      <div className="space-y-10">

        {visibleOrders.map((order) => (

          <div
            key={order.id}
            className="
              bg-slate-900
              rounded-3xl
              p-8
              border
              border-yellow-400
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div className="
                flex
                flex-col
                md:flex-row
                md:justify-between
                gap-6
                mb-8
              "
            >

              <div className="space-y-3">

                <h2 className="text-4xl font-extrabold">
                  {order.customerName}
                </h2>

                <p className="text-2xl text-gray-300">
                  📞 {order.phone}
                </p>

                <p className="text-xl text-gray-400">
                  📍 {order.address}
                </p>

              </div>

              <div className="space-y-4">

                <div className="
                    bg-black
                    border
                    border-green-600
                    px-6
                    py-4
                    rounded-2xl
                    text-2xl
                  "
                >

                  💰 الإجمالي:

                  <span className="text-green-400 font-bold mr-2">
                    {order.total} ج
                  </span>

                </div>

                <div className="
                    bg-black
                    border
                    border-blue-600
                    px-6
                    py-4
                    rounded-2xl
                    text-xl
                  "
                >
                  📅 {order.date}
                </div>

              </div>

            </div>

            {/* STATUS */}

            <div className="mb-8">

              <select

                value={order.status || 'طلب جديد'}

                onChange={(e) =>
                  updateOrderStatus(
                    order.id,
                    e.target.value
                  )
                }

                className="
                  bg-white
                  text-black
                  p-4
                  rounded-2xl
                  text-xl
                  font-bold
                "
              >

                <option value="طلب جديد">طلب جديد</option>
                <option value="جاري التجهيز">جاري التجهيز</option>
                <option value="تم الشحن">تم الشحن</option>
                <option value="تم التسليم">تم التسليم</option>
                <option value="ملغي">ملغي</option>

              </select>

            </div>

            {/* ITEMS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

              {(order.items || []).map((item) => (

                <div
                  key={item.cartId || item.id}
                  className="
                    bg-black
                    rounded-3xl
                    overflow-hidden
                    border
                    border-yellow-400
                  "
                >

                  {!!item.image && (
                    <img
                      src={item.image}
                      alt={item.name || ''}
                      loading="lazy"
                      className="w-full h-56 object-cover"
                    />
                  )}

                  <div className="p-5">

                    <h3 className="text-2xl font-bold mb-4">
                      {item.name}
                    </h3>

                    <p className="text-yellow-400 text-3xl font-extrabold">
                      {item.price}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* DELETE */}

            <button
              type="button"
              onClick={() => handleDelete(order.id)}
              className="
                bg-red-600
                hover:bg-red-700
                px-8
                py-4
                rounded-2xl
                text-xl
                font-bold
              "
            >
              حذف الطلب
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}