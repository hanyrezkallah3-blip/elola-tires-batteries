import { useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

export default function Cart({ open, setOpen }) {

  const {
    cart,
    removeFromCart,
    clearCart,
    addOrder
  } = useWebsiteStore()

  const [customerName, setCustomerName] = useState('')

  const [phone, setPhone] = useState('')

  const [address, setAddress] = useState('')

  if (!open) return null

  const total = cart.reduce((acc, item) => {

    const price = Number(
      String(item.price).replace(/[^\d]/g, '')
    )

    return acc + price

  }, 0)

  const handleOrder = () => {

    if (
      !customerName ||
      !phone ||
      !address ||
      cart.length === 0
    ) {

      alert('يرجى إدخال جميع البيانات')

      return

    }

    addOrder({

      customerName,

      phone,

      address,

      items: cart,

      total,

      date: new Date().toLocaleString()

    })

    clearCart()

    setCustomerName('')

    setPhone('')

    setAddress('')

    alert('تم إرسال الطلب بنجاح')

    setOpen(false)

  }

  return (

    <div
      className="
        fixed
        top-0
        right-0
        w-full
        md:w-[450px]
        h-screen
        bg-slate-950
        z-50
        overflow-y-auto
        shadow-2xl
        p-6
        border-l-4
        border-yellow-400
      "
    >

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

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

      <div className="space-y-5 mb-8">

        <input
          type="text"
          placeholder="اسم العميل"
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-white
            text-black
            text-xl
            outline-none
          "
        />

        <input
          type="text"
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-white
            text-black
            text-xl
            outline-none
          "
        />

        <textarea
          placeholder="العنوان بالتفصيل"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-white
            text-black
            text-xl
            h-32
            outline-none
          "
        />

      </div>

      {/* EMPTY */}

      {cart.length === 0 && (

        <div
          className="
            text-center
            text-3xl
            text-white
            mt-20
          "
        >
          السلة فارغة
        </div>

      )}

      {/* ITEMS */}

      <div className="space-y-6">

        {cart.map((item, index) => (

          <div
            key={index}
            className="
              bg-slate-900
              rounded-3xl
              overflow-hidden
              border
              border-yellow-400
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
                  mb-5
                "
              >
                {item.price}
              </p>

              <button
                onClick={() =>
                  removeFromCart(index)
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

        ))}

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
          "
        >
          الإجمالي: {total} جنيه
        </div>

      )}

      {/* ACTIONS */}

      {cart.length > 0 && (

        <div className="space-y-5 mt-10">

          <button
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
              transition-all
            "
          >
            تأكيد الطلب
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
              transition-all
            "
          >
            تفريغ السلة
          </button>

        </div>

      )}

    </div>

  )

}