import { useWebsiteStore } from '../store/websiteStore'

export default function Dashboard() {

  const {
    products,
    offers,
    videos,
    services,
    slides,
    orders
  } = useWebsiteStore()

  const cards = [

    {
      title: 'عدد المنتجات',
      value: products.length,
      color: 'bg-blue-700'
    },

    {
      title: 'عدد العروض',
      value: offers.length,
      color: 'bg-red-600'
    },

    {
      title: 'عدد الفيديوهات',
      value: videos.length,
      color: 'bg-purple-700'
    },

    {
      title: 'عدد الخدمات',
      value: services.length,
      color: 'bg-green-700'
    },

    {
      title: 'عدد صور السلايدر',
      value: slides.length,
      color: 'bg-yellow-500 text-black'
    },

    {
      title: 'عدد الطلبات',
      value: orders.length,
      color: 'bg-orange-500 text-black'
    }

  ]

  return (

    <div className="p-10 bg-black min-h-screen text-white">

      <h1
        className="
          text-5xl
          font-extrabold
          mb-12
          text-yellow-400
        "
      >
        لوحة التحكم الرئيسية
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
        "
      >

        {cards.map((card, index) => (

          <div
            key={index}
            className={`
              ${card.color}
              rounded-3xl
              p-10
              shadow-2xl
              text-center
            `}
          >

            <h2
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              {card.title}
            </h2>

            <p
              className="
                text-6xl
                font-extrabold
              "
            >
              {card.value}
            </p>

          </div>

        ))}

      </div>

    </div>

  )

}