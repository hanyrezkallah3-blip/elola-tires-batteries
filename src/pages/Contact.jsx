import { useState } from 'react'

export default function Contact() {

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const whatsappNumber = '201000000000'

  const handleWhatsapp = () => {

    const text = `
الاسم: ${name}
رقم الهاتف: ${phone}
الرسالة: ${message}
`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`

    window.open(url, '_blank')

  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1
        className="
          text-5xl
          font-extrabold
          text-green-400
          mb-10
          text-center
        "
      >
        تواصل معنا
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* CONTACT INFO */}

        <div
          className="
            bg-slate-900
            p-10
            rounded-3xl
            border
            border-green-500
            shadow-2xl
          "
        >

          <h2 className="text-4xl font-bold mb-8">

            معلومات الشركة

          </h2>

          <div className="space-y-6 text-2xl">

            <p>
              📞 01000000000
            </p>

            <p>
              ☎️ 023000000
            </p>

            <p>
              📍 الجيزة - مصر
            </p>

            <p>
              ✉️ info@elola.com
            </p>

          </div>

        </div>

        {/* FORM */}

        <div
          className="
            bg-slate-900
            p-10
            rounded-3xl
            border
            border-green-500
            shadow-2xl
          "
        >

          <input
            type="text"
            placeholder="الاسم"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              mb-5
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
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              mb-5
            "
          />

          <textarea
            placeholder="اكتب رسالتك"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="
              w-full
              h-48
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              mb-5
            "
          />

          <button
            onClick={handleWhatsapp}
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              py-5
              rounded-2xl
              text-2xl
              font-bold
            "
          >
            إرسال عبر واتساب
          </button>

        </div>

      </div>

      {/* FLOATING WHATSAPP */}

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="
          fixed
          bottom-8
          right-8
          bg-green-500
          hover:bg-green-600
          w-20
          h-20
          rounded-full
          flex
          items-center
          justify-center
          text-5xl
          shadow-[0_0_30px_#22c55e]
          z-50
        "
      >
        💬
      </a>

    </div>

  )

}