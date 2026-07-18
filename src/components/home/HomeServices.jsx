export default function HomeServices({

  services = []

}) {

  return (

    <section

      id="services"

      className="
        py-20
        px-4
        md:px-8
        bg-slate-950
      "

    >

      <h2

        className="
          text-4xl
          md:text-6xl
          text-cyan-400
          font-extrabold
          text-center
          mb-14
        "

      >

        الخدمات

      </h2>

      {

        services.length === 0

        ? (

          <div

            className="
              text-center
              text-3xl
              text-gray-500
            "

          >

            لا توجد خدمات حالياً

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

              services.map(service => (

                <div

                  key={service.id}

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

                    (service.image || service.img)

                    &&

                    (

                      <div

                        className="
                          aspect-[4/3]
                          overflow-hidden
                        "

                      >

                        <img

                          src={

                            service.image ||

                            service.img

                          }

                          alt={service.title}

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

                      {service.title}

                    </h3>

                    <p

                      className="
                        text-gray-300
                        leading-relaxed
                      "

                    >

                      {service.description}

                    </p>

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