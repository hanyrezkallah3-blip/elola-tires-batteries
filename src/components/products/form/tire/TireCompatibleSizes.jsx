export default function TireCompatibleSizes({

  compatibleSizes

}) {


  if (

    !compatibleSizes ||

    compatibleSizes.length === 0

  )

    return null



  return (

    <div

      className="
        bg-slate-800
        rounded-3xl
        p-6
        space-y-5
      "

    >

      <h4

        className="
          text-xl
          font-black
          text-blue-400
        "

      >

        📏 المقاسات المتوافقة (AI)

      </h4>



      <div

        className="
          flex
          flex-wrap
          gap-3
        "

      >

        {

          compatibleSizes.map(

            (size, index) => (

              <span

                key={index}

                className="
                  bg-slate-700
                  px-5
                  py-3
                  rounded-2xl
                  font-black
                  text-lg
                "

              >

                {size}

              </span>

            )

          )

        }


      </div>
          </div>

  )

}