import { useState } from 'react'

import { useWebsiteStore }
  from '../store/websiteStore'

export default function Cart({

  open,
  setOpen

}) {

  const {

    cart,
    removeFromCart,
    clearCart,
    addOrder,
    products

  } = useWebsiteStore()

  const [

    customerName,
    setCustomerName

  ] = useState('')

  const [

    phone,
    setPhone

  ] = useState('')

  const [

    address,
    setAddress

  ] = useState('')

  const [

    loading,
    setLoading

  ] = useState(false)

  if (!open) return null

  // ================= TOTAL =================

  const total = cart.reduce(

    (acc, item) => {

      const price = Number(

        String(item.price)
          .replace(/[^\d]/g, '')

      )

      return acc + price

    },

    0

  )

  // ================= STOCK VALIDATION =================

  const validateStock = () => {

    for (const item of cart) {

      const product = products.find(

        (p) => p.id === item.id

      )

      if (!product) {

        alert(

          `المنتج غير موجود: ${item.name}`

        )

        return false

      }

      if (

        Number(product.stock || 0) <= 0

      ) {

        alert(

          `المنتج غير متوفر بالمخزن: ${item.name}`

        )

        return false

      }

    }

    return true

  }

  // ================= PHONE VALIDATION =================

  const validatePhone = () => {

    if (phone.length < 11) {

      alert(

        'رقم الهاتف غير صحيح'

      )

      return false

    }

    return true

  }

  // ================= HANDLE ORDER =================

  const handleOrder = async () => {

    if (

      !customerName ||
      !phone ||
      !address ||
      cart.length === 0

    ) {

      alert(

        'يرجى إدخال جميع البيانات'

      )

      return

    }

    if (!validatePhone()) return

    if (!validateStock()) return

    setLoading(true)

    try {

      addOrder({

        customerName,

        phone,

        address,

        items: cart,

        total,

        date:
          new Date().toLocaleString(),

        status: 'طلب جديد'

      })

      clearCart()

      setCustomerName('')

      setPhone('')

      setAddress('')

      alert(

        'تم إرسال الطلب بنجاح'

      )

      setOpen(false)

    } catch (error) {

      console.log(error)

      alert(

        'حدث خطأ أثناء إرسال الطلب'

      )

    } finally {

      setLoading(false)

    }

  }

  // ================= CLOSE ON BACKDROP =================

  const handleBackdrop = (e) => {

    if (

      e.target.id === 'cart-backdrop'

    ) {

      setOpen(false)

    }

  }

  return (

    <div

      id="cart-backdrop"

      onClick={handleBackdrop}

      className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm
        z-50
        flex
        justify-end
      "
    >

      <div
        className="
          w-full
          md:w-[520px]
          h-screen
          bg-slate-950
          overflow-y-auto
          shadow-2xl
          p-6
          border-l-4
          border-yellow-400
          animate-[slideIn_.3s_ease]
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-8
          "
        >

          <h2
            className="
              text-4xl
              font-extrabold
              text-yellow-400
            "
          >
            سلة المشتريات
          </h2>

          <button

            onClick={() =>
              setOpen(false)
            }

            className="
              bg-red-600
              hover:bg-red-700
              px-4
              py-2
              rounded-xl
              text-white
              font-bold
            "
          >

            ✕

          </button>

        </div>

        {/* CUSTOMER */}

        <div
          className="
            space-y-5
            mb-8
          "
        >

          <input
            type="text"
            placeholder="اسم العميل"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

          <input
            type="text"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

          <textarea
            placeholder="العنوان بالتفصيل"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-white
              text-black
              text-xl
              h-32
              resize-none
            "
          />

        </div>

        {/* EMPTY */}

        {cart.length === 0 && (

          <div
            className="
              text-center
              text-3xl
              text-gray-300
              mt-20
            "
          >
            السلة فارغة
          </div>

        )}

        {/* ITEMS */}

        <div className="space-y-6">

          {cart.map((item) => {

            const product =
              products.find(

                (p) =>
                  p.id === item.id

              )

            const stock =
              product?.stock || 0

            return (

              <div
                key={item.cartId}
                className="
                  bg-slate-900
                  rounded-3xl
                  overflow-hidden
                  border
                  border-yellow-400
                  shadow-2xl
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
                      mb-4
                    "
                  >
                    {item.price}
                  </p>

                  {/* STOCK */}

                  <div
                    className="
                      bg-black
                      p-3
                      rounded-2xl
                      mb-5
                      text-lg
                      border
                      border-blue-700
                    "
                  >

                    📦 المتوفر بالمخزن:

                    <span
                      className="
                        text-blue-400
                        font-bold
                        mr-2
                      "
                    >
                      {stock}
                    </span>

                  </div>

                  {/* STOCK WARNING */}

                  {stock <= 0 && (

                    <div
                      className="
                        bg-red-700
                        p-3
                        rounded-2xl
                        text-center
                        font-bold
                        mb-5
                      "
                    >
                      المنتج غير متوفر حالياً
                    </div>

                  )}

                  {/* REMOVE */}

                  <button

                    onClick={() =>
                      removeFromCart(
                        item.cartId
                      )
                    }

                    className="
                      bg-red-600
                      hover:bg-red-700
                      px-5
                      py-3
                      rounded-2xl
                      text-white
                      font-bold
                    "
                  >

                    حذف

                  </button>

                </div>

              </div>

            )

          })}

        </div>

        {/* TOTAL */}

        {cart.length > 0 && (

          <div
            className="
              mt-8
              bg-yellow-400
              text-black
              rounded-3xl
              p-5
              text-center
              text-3xl
              font-extrabold
              shadow-2xl
            "
          >

            الإجمالي:
            {' '}
            {total}
            {' '}
            جنيه

          </div>

        )}

        {/* ACTIONS */}

        {cart.length > 0 && (

          <div
            className="
              space-y-5
              mt-10
            "
          >

            <button

              disabled={loading}

              onClick={handleOrder}

              className="
                w-full
                bg-green-600
                hover:bg-green-700
                py-5
                rounded-3xl
                text-2xl
                font-extrabold
                text-white
              "
            >

              {loading
                ? 'جاري إرسال الطلب...'
                : 'تأكيد الطلب'}

            </button>

            <button

              onClick={clearCart}

              className="
                w-full
                bg-red-700
                hover:bg-red-800
                py-5
                rounded-3xl
                text-2xl
                font-extrabold
                text-white
              "
            >

              تفريغ السلة

            </button>

          </div>

        )}

      </div>

    </div>

  )

}