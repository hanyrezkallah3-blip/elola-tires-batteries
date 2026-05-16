export default function Footer() {

  return (

    <footer
      className="
        bg-black
        border-t-4
        border-yellow-400
        py-16
        px-8
        text-white
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-12
        "
      >

        {/* COMPANY */}

        <div>

          <h2
            className="
              text-4xl
              font-extrabold
              text-yellow-400
              mb-6
            "
          >
            شركة العلا
          </h2>

          <p
            className="
              text-gray-300
              text-xl
              leading-loose
            "
          >
            أفضل شركة للإطارات والبطاريات
            وخدمات السيارات بأفضل الأسعار
            وأعلى جودة في مصر.
          </p>

        </div>

        {/* LINKS */}

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-blue-400
              mb-6
            "
          >
            روابط سريعة
          </h2>

          <div className="space-y-4 text-xl">

            <p>الرئيسية</p>

            <p>المنتجات</p>

            <p>العروض</p>

            <p>الخدمات</p>

            <p>تواصل معنا</p>

          </div>

        </div>

        {/* CONTACT */}

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-green-400
              mb-6
            "
          >
            معلومات التواصل
          </h2>

          <div className="space-y-4 text-xl">

            <p>📞 01000000000</p>

            <p>☎️ 023000000</p>

            <p>📍 الجيزة - مصر</p>

            <p>✉️ info@elola.com</p>

          </div>

          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noreferrer"
            className="
              inline-block
              mt-8
              bg-green-500
              hover:bg-green-600
              px-8
              py-4
              rounded-2xl
              text-2xl
              font-bold
              transition-all
              duration-300
            "
          >
            واتساب
          </a>

        </div>

      </div>

      {/* COPYRIGHT */}

      <div
        className="
          border-t
          border-gray-700
          mt-16
          pt-8
          text-center
          text-gray-400
          text-lg
        "
      >

        © 2026 شركة العلا للإطارات والبطاريات
        - جميع الحقوق محفوظة

      </div>

    </footer>

  )

}