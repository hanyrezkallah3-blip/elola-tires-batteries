export default function HomeVideos({

  videos = []

}) {

  return (

    <section

      id="videos"

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
          text-purple-400
          font-extrabold
          text-center
          mb-14
        "

      >

        الفيديوهات

      </h2>

      {

        videos.length === 0

        ? (

          <div

            className="
              text-center
              text-3xl
              text-gray-500
            "

          >

            لا توجد فيديوهات حالياً

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

              videos.map(video => (

                <div

                  key={video.id}

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

                  <div

                    className="
                      aspect-video
                      bg-black
                    "

                  >

                    <video

                      src={video.video}

                      controls

                      preload="metadata"

                      className="
                        w-full
                        h-full
                        object-cover
                      "

                    />

                  </div>

                  {

                    video.title && (

                      <div className="p-5">

                        <h3

                          className="
                            text-xl
                            font-black
                          "

                        >

                          {video.title}

                        </h3>

                      </div>

                    )

                  }

                </div>

              ))

            }

          </div>

        )

      }

    </section>

  )

}