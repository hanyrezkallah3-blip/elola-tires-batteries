export default function ProductsStats({

  productsCount,
  totalStock,
  totalSold,
  hiddenProducts

}) {

  const cards = [

    {

      id: 1,

      title: 'عدد المنتجات',

      value: productsCount,

      color: 'bg-blue-700'

    },

    {

      id: 2,

      title: 'إجمالي المخزون',

      value: totalStock,

      color: 'bg-green-700'

    },

    {

      id: 3,

      title: 'إجمالي المبيعات',

      value: totalSold,

      color:
        'bg-yellow-500 text-black'

    },

    {

      id: 4,

      title: 'المنتجات المخفية',

      value: hiddenProducts,

      color: 'bg-red-700'

    }

  ]

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-8
      mb-14
    ">

      {cards.map((card) => (

        <div

          key={card.id}

          className={`
            ${card.color}
            p-8
            rounded-[35px]
            text-center
            shadow-2xl
            hover:scale-[1.02]
            transition-all
            duration-300
          `}
        >

          <h2 className="
            text-2xl
            font-black
            mb-5
          ">

            {card.title}

          </h2>

          <div className="
            text-5xl
            font-extrabold
            break-words
          ">

            {card.value}

          </div>

        </div>

      ))}

    </div>

  )

}