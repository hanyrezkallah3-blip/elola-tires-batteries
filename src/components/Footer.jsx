import { Link } from 'react-router-dom'

import {
  useWebsiteStore
} from '../store/websiteStore'

export default function Footer() {

  const {

    companyName,

    companyPhone,

    companyWhatsapp,

    companyAddress,

    companyEmail,

    companyFacebook,

    companyInstagram,

    companyYoutube,

    logo

  } = useWebsiteStore()

  return (

    <footer
      className="
        bg-gradient-to-b
        from-black
        via-slate-950
        to-black
        border-t-4
        border-yellow-400
        py-20
        px-8
        text-white
      "
    >

      {/* TOP */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-14
          mb-16
        "
      >

        {/* COMPANY */}

        <div>

          <div className="flex items-center gap-5 mb-6">

            {logo && (

              <img
                src={logo}
                alt=""
                className="
                  w-20
                  h-20
                  rounded-full
                  object-cover
                  border-4
                  border-yellow-400
                  shadow-[0_0_25px_#facc15]
                "
              />

            )}

            <h2
              className="
                text-4xl
                font-extrabold
                text-yellow-400
              "
            >
              {companyName}
            </h2>

          </div>

          <p
            className="
              text-gray-300
              text-xl
              leading-loose
            "
          >
            أفضل شركة للإطارات والبطاريات
            وخدمات السيارات بأعلى جودة
            وأفضل الأسعار داخل مصر.
          </p>

        </div>

        {/* QUICK LINKS */}

        <div>

          <h2
            className="
              text-3xl
              font-extrabold
              text-blue-400
              mb-8
            "
          >
            روابط سريعة
          </h2>

          <div className="space-y-5 text-xl">

            <Link
              to="/home"
              className="
                block
                hover:text-yellow-400
                transition-all
              "
            >
              الرئيسية
            </Link>

            <a
              href="#products"
              className="
                block
                hover:text-yellow-400
                transition-all
              "
            >
              المنتجات
            </a>

            <a
              href="#offers"
              className="
                block
                hover:text-yellow-400
                transition-all
              "
            >
              العروض
            </a>

            <a
              href="#services"
              className="
                block
                hover:text-yellow-400
                transition-all
              "
            >
              الخدمات
            </a>

            <a
              href="#videos"
              className="
                block
                hover:text-yellow-400
                transition-all
              "
            >
              الفيديوهات
            </a>

          </div>

        </div>

        {/* CONTACT */}

        <div>

          <h2
            className="
              text-3xl
              font-extrabold
              text-green-400
              mb-8
            "
          >
            معلومات التواصل
          </h2>

          <div className="space-y-5 text-xl">

            <div
              className="
                bg-slate-900
                p-4
                rounded-2xl
                border
                border-slate-700
              "
            >
              📞

              {' '}

              {companyPhone ||
                '01000000000'}
            </div>

            <div
              className="
                bg-slate-900
                p-4
                rounded-2xl
                border
                border-slate-700
              "
            >
              📍

              {' '}

              {companyAddress ||
                'الجيزة - مصر'}
            </div>

            <div
              className="
                bg-slate-900
                p-4
                rounded-2xl
                border
                border-slate-700
                break-all
              "
            >
              ✉️

              {' '}

              {companyEmail ||
                'info@elola.com'}
            </div>

          </div>

        </div>

        {/* SOCIAL */}

        <div>

          <h2
            className="
              text-3xl
              font-extrabold
              text-purple-400
              mb-8
            "
          >
            السوشيال ميديا
          </h2>

          <div className="space-y-5">

            {companyWhatsapp && (

              <a
                href={`https://wa.me/${companyWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="
                  flex
                  items-center
                  justify-center
                  bg-green-600
                  hover:bg-green-700
                  py-4
                  rounded-2xl
                  text-xl
                  font-bold
                  transition-all
                "
              >
                واتساب
              </a>

            )}

            {companyFacebook && (

              <a
                href={companyFacebook}
                target="_blank"
                rel="noreferrer"
                className="
                  flex
                  items-center
                  justify-center
                  bg-blue-700
                  hover:bg-blue-800
                  py-4
                  rounded-2xl
                  text-xl
                  font-bold
                  transition-all
                "
              >
                فيسبوك
              </a>

            )}

            {companyInstagram && (

              <a
                href={companyInstagram}
                target="_blank"
                rel="noreferrer"
                className="
                  flex
                  items-center
                  justify-center
                  bg-pink-600
                  hover:bg-pink-700
                  py-4
                  rounded-2xl
                  text-xl
                  font-bold
                  transition-all
                "
              >
                انستجرام
              </a>

            )}

            {companyYoutube && (

              <a
                href={companyYoutube}
                target="_blank"
                rel="noreferrer"
                className="
                  flex
                  items-center
                  justify-center
                  bg-red-600
                  hover:bg-red-700
                  py-4
                  rounded-2xl
                  text-xl
                  font-bold
                  transition-all
                "
              >
                يوتيوب
              </a>

            )}

          </div>

        </div>

      </div>

      {/* COPYRIGHT */}

      <div
        className="
          border-t
          border-slate-800
          pt-8
          text-center
        "
      >

        <p
          className="
            text-gray-400
            text-xl
          "
        >
          © 2026

          {' '}

          {companyName}

          {' '}

          - جميع الحقوق محفوظة
        </p>

      </div>

    </footer>

  )

}