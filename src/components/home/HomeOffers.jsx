export default function HomeOffers({

  offers = [],

  addToCart

}) {

  return (

    <section
      id="offers"
      className="
        py-20
        px-4
        md:px-8
        bg-black
      "
    >

      <h2
        className="
          text-4xl
          md:text-6xl
          text-red-500
          font-extrabold
          text-center
          mb-14
        "
      >

        العروض

      </h2>

      {

        offers.length === 0

        ? (

          <div
            className="
              text-center
              text-3xl
              text-gray-500
            "
          >

            لا توجد عروض حالياً

          </div>

        )

        : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {

              offers.map(offer => (

                <div

                  key={offer.id}

                  className="
                    bg-slate-900
                    rounded-3xl
                    overflow-hidden
                    border
                    border-slate-700
                    shadow-xl
                    hover:-translate-y-1
                    transition-all
                  "

                >

                  {

                    offer.image && (

                      <div
                        className="
                          aspect-[4/3]
                          overflow-hidden
                        "
                      >

                        <img

                          src={offer.image}

                          alt={offer.title}

                          className="
                            w-full
                            h-full
                            object-cover
                            hover:scale-105
                            transition
                          "

                        />

                      </div>

                    )

                  }

                  <div className="p-6">

                    <h3
                      className="
                        text-2xl
                        font-black
                        mb-4
                      "
                    >

                      {offer.title}

                    </h3>

                    {

                      offer.price && (

                        <div
                          className="
                            text-yellow-400
                            text-3xl
                            font-black
                            mb-4
                          "
                        >

                          {offer.price}

                        </div>

                      )

                    }

                    {

                      offer.description && (

                        <p
                          className="
                            text-gray-300
                            leading-relaxed
                            mb-6
                          "
                        >

                          {offer.description}

                        </p>

                      )

                    }

                    <button

                      type="button"

                      onClick={() =>

                        addToCart({

                          id: `offer-${offer.id}`,

                          name: offer.title,

                          image: offer.image,

                          price: offer.price || 0,

                          stock: 9999,

                          isOffer: true

                        })

                      }

                      className="
                        w-full
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-black
                        py-4
                        rounded-2xl
                        font-black
                        transition
                      "

                    >

                      إضافة العرض للسلة

                    </button>

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </section>

  )

}