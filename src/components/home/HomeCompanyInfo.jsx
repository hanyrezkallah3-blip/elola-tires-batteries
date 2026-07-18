export default function HomeCompanyInfo({

  companyPhone,

  companyWhatsapp,

  companyAddress,

  companyEmail,

  socials = []

}) {

  return (

    <section
      className="
        bg-slate-950
        border-b
        border-yellow-500
        py-8
        px-4
        md:px-8
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        {

          companyPhone && (

            <div
              className="
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  font-black
                  mb-2
                "
              >

                الهاتف

              </div>

              <div
                className="
                  text-white
                  text-lg
                  font-bold
                "
              >

                {companyPhone}

              </div>

            </div>

          )

        }

        {

          companyWhatsapp && (

            <div
              className="
                bg-green-700
                rounded-3xl
                p-5
              "
            >

              <div
                className="
                  font-black
                  mb-2
                "
              >

                واتساب

              </div>

              <div
                className="
                  text-lg
                  font-bold
                "
              >

                {companyWhatsapp}

              </div>

            </div>

          )

        }

        {

          companyEmail && (

            <div
              className="
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  font-black
                  mb-2
                "
              >

                البريد الإلكتروني

              </div>

              <div
                className="
                  break-all
                  text-lg
                  font-bold
                "
              >

                {companyEmail}

              </div>

            </div>

          )

        }

        {

          companyAddress && (

            <div
              className="
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-5
              "
            >

              <div
                className="
                  text-yellow-400
                  font-black
                  mb-2
                "
              >

                العنوان

              </div>

              <div
                className="
                  text-lg
                  font-bold
                "
              >

                {companyAddress}

              </div>

            </div>

          )

        }

      </div>

      {

        socials.length > 0 && (

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-4
              mt-8
            "
          >

            {

              socials.map(

                (social, index) => (

                  <a

                    key={index}

                    href={social.value}

                    target="_blank"

                    rel="noreferrer"

                    className={`
                      ${social.color}
                      px-6
                      py-3
                      rounded-2xl
                      font-black
                      hover:scale-105
                      transition
                    `}

                  >

                    {social.title}

                  </a>

                )

              )

            }

          </div>

        )

      }

    </section>

  )

}