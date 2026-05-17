import { useState, useEffect } from 'react'

import { useWebsiteStore }
  from '../store/websiteStore'

export default function Company() {

  const {

    companyName,
    setCompanyName,

    logo,
    setLogo,

    companyPhone,
    setCompanyPhone,

    companyWhatsapp,
    setCompanyWhatsapp,

    companyAddress,
    setCompanyAddress,

    companyFacebook,
    setCompanyFacebook,

    companyInstagram,
    setCompanyInstagram,

    companyYoutube,
    setCompanyYoutube,

    companyEmail,
    setCompanyEmail

  } = useWebsiteStore()

  // ================= STATES =================

  const [name, setName] =
    useState(companyName || '')

  const [phone, setPhone] =
    useState(companyPhone || '')

  const [whatsapp, setWhatsapp] =
    useState(companyWhatsapp || '')

  const [address, setAddress] =
    useState(companyAddress || '')

  const [facebook, setFacebook] =
    useState(companyFacebook || '')

  const [instagram, setInstagram] =
    useState(companyInstagram || '')

  const [youtube, setYoutube] =
    useState(companyYoutube || '')

  const [email, setEmail] =
    useState(companyEmail || '')

  // ================= SYNC =================

  useEffect(() => {

    setName(companyName || '')

    setPhone(companyPhone || '')

    setWhatsapp(
      companyWhatsapp || ''
    )

    setAddress(
      companyAddress || ''
    )

    setFacebook(
      companyFacebook || ''
    )

    setInstagram(
      companyInstagram || ''
    )

    setYoutube(
      companyYoutube || ''
    )

    setEmail(
      companyEmail || ''
    )

  }, [

    companyName,
    companyPhone,
    companyWhatsapp,
    companyAddress,
    companyFacebook,
    companyInstagram,
    companyYoutube,
    companyEmail

  ])

  // ================= SAVE =================

  const handleSave = () => {

    if (!name.trim()) {

      alert(
        'يرجى إدخال اسم الشركة'
      )

      return

    }

    setCompanyName(name)

    setCompanyPhone(phone)

    setCompanyWhatsapp(
      whatsapp
    )

    setCompanyAddress(
      address
    )

    setCompanyFacebook(
      facebook
    )

    setCompanyInstagram(
      instagram
    )

    setCompanyYoutube(
      youtube
    )

    setCompanyEmail(email)

    alert(
      'تم حفظ بيانات الشركة'
    )

  }

  // ================= LOGO =================

  const handleLogoUpload = (e) => {

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {

      setLogo(reader.result)

    }

    reader.readAsDataURL(file)

  }

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
        p-10
      "
    >

      {/* TITLE */}

      <h1
        className="
          text-5xl
          font-extrabold
          text-yellow-400
          mb-10
        "
      >
        إعدادات الشركة
      </h1>

      {/* CONTAINER */}

      <div
        className="
          bg-slate-900
          p-10
          rounded-3xl
          border
          border-yellow-400
          shadow-2xl
          space-y-10
        "
      >

        {/* COMPANY NAME */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            اسم الشركة
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="اسم الشركة"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* PHONE */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            رقم الهاتف
          </label>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="رقم الهاتف"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* WHATSAPP */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            رقم الواتساب
          </label>

          <input
            type="text"
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(
                e.target.value
              )
            }
            placeholder="رقم الواتساب"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* EMAIL */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            البريد الإلكتروني
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="البريد الإلكتروني"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* ADDRESS */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            عنوان الشركة
          </label>

          <textarea
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            placeholder="العنوان"
            className="
              w-full
              h-40
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
              resize-none
            "
          />

        </div>

        {/* FACEBOOK */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            رابط فيسبوك
          </label>

          <input
            type="text"
            value={facebook}
            onChange={(e) =>
              setFacebook(
                e.target.value
              )
            }
            placeholder="رابط فيسبوك"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* INSTAGRAM */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            رابط انستجرام
          </label>

          <input
            type="text"
            value={instagram}
            onChange={(e) =>
              setInstagram(
                e.target.value
              )
            }
            placeholder="رابط انستجرام"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* YOUTUBE */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            رابط يوتيوب
          </label>

          <input
            type="text"
            value={youtube}
            onChange={(e) =>
              setYoutube(
                e.target.value
              )
            }
            placeholder="رابط يوتيوب"
            className="
              w-full
              p-5
              rounded-2xl
              bg-white
              text-black
              text-xl
            "
          />

        </div>

        {/* LOGO */}

        <div>

          <label
            className="
              block
              text-2xl
              mb-4
              font-bold
            "
          >
            شعار الشركة
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleLogoUpload
            }
            className="
              w-full
              bg-white
              text-black
              p-4
              rounded-2xl
              mb-8
            "
          />

          {logo && (

            <div
              className="
                flex
                justify-center
              "
            >

              <img
                src={logo}
                alt="logo"
                className="
                  w-56
                  h-56
                  rounded-full
                  object-cover
                  border-4
                  border-yellow-400
                  shadow-[0_0_40px_#facc15]
                "
              />

            </div>

          )}

        </div>

        {/* SAVE */}

        <button

          onClick={handleSave}

          className="
            w-full
            bg-yellow-500
            hover:bg-yellow-600
            py-5
            rounded-3xl
            text-2xl
            font-extrabold
            text-black
          "
        >

          حفظ جميع البيانات

        </button>

      </div>

    </div>

  )

}