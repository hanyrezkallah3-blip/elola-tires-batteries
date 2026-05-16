import { useWebsiteStore } from '../store/websiteStore'

export default function Orders() {

  const {
    orders,
    deleteOrder
  } = useWebsiteStore()

  return (

    <div className="p-10 bg-black min-h-screen text-white">

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-12
        "
      >
        طلبات العملاء
      </h1>

      {orders.length === 0 ? (

        <div className="text-3xl text-center">

          لا توجد طلبات

        </div>

      ) : (

        <div className="space-y-10">

          {orders.map((order) => (

            <div
              key={order.id}
              className="
                bg-slate-900
                rounded-3xl
                p-8
                border
                border-yellow-400
              "
            >

              <div className="mb-8">

                <h2
                  className="
                    text-3xl
                    font-extrabold
                    text-yellow-400
                    mb-3
                  "
                >
                  {order.customerName}
                </h2>

                <p className="text-2xl">
                  📞 {order.phone}
                </p>

                <p className="text-gray-400 mt-2">
                  {order.date}
                </p>

                {order.address && (
                  <p className="text-gray-300 mt-2">
                    📍 {order.address}
                  </p>
                )}

                {order.total && (
                  <p className="text-yellow-400 text-2xl mt-2 font-bold">
                    الإجمالي: {order.total} جنيه
                  </p>
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {order.items.map((item, itemIndex) => (

                  <div
                    key={itemIndex}
                    className="
                      bg-black
                      rounded-3xl
                      overflow-hidden
                    "
                  >

                    <img
                      src={item.image}
                      alt=""
                      className="
                        w-full
                        h-52
                        object-cover
                      "
                    />

                    <div className="p-5">

                      <h3
                        className="
                          text-2xl
                          font-bold
                          mb-4
                        "
                      >
                        {item.name}
                      </h3>

                      <p
                        className="
                          text-yellow-400
                          text-3xl
                          font-extrabold
                        "
                      >
                        {item.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <button

                onClick={() =>
                  deleteOrder(order.id)
                }

                className="
                  mt-8
                  bg-red-600
                  hover:bg-red-700
                  px-8
                  py-4
                  rounded-2xl
                  text-2xl
                  font-bold
                "
              >
                حذف الطلب
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}