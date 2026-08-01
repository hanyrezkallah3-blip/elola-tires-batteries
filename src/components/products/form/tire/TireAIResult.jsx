export default function TireAIResult({

  tireAI

}) {


  if (!tireAI)

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
          text-green-400
        "

      >

        🤖 بيانات الإطار بالذكاء الاصطناعي

      </h4>



      <div

        className="
          grid
          md:grid-cols-2
          gap-5
        "

      >

        <div>

          <span className="text-gray-400">

            المقاس

          </span>

          <p className="font-bold">

            {

              tireAI.size

            }

          </p>

        </div>



        <div>

          <span className="text-gray-400">

            الاستخدام

          </span>

          <p className="font-bold">

            {

              tireAI.usage

            }

          </p>

        </div>
                <div>

          <span className="text-gray-400">

            الفئة

          </span>

          <p className="font-bold">

            {

              tireAI.category

            }

          </p>

        </div>



        <div>

          <span className="text-gray-400">

            نوع التصنيع

          </span>

          <p className="font-bold">

            {

              tireAI.tubeless

                ?

                'Tubeless'

                :

                'Tube Type'

            }

          </p>

        </div>



      </div>


    </div>

  )

}