import DemandTelemetry
  from '../core/telemetry/DemandTelemetry'

import DemandForecastEngine
  from '../core/engines/DemandForecastEngine'
  


export default function DemandAnalytics() {


  const data =
    DemandTelemetry.metrics()


  const forecast =
    DemandForecastEngine.analyze()



  return (

    <div className="
      p-8
      bg-black
      min-h-screen
      text-white
      space-y-8
    ">


      <h1 className="
        text-4xl
        font-black
        text-yellow-400
      ">

        🧠 تحليل طلبات العملاء بالذكاء الاصطناعي

      </h1>



      <div className="
        grid
        md:grid-cols-4
        gap-5
      ">


        <StatCard

          title="إجمالي عمليات البحث"

          value={
            data.totalSearches
          }

        />


        <StatCard

          title="طلبات ناجحة"

          value={
            data.successful
          }

        />


        <StatCard

          title="منتجات غير متوفرة"

          value={
            data.failed
          }

        />


        <StatCard

          title="متوسط المنتجات"

          value={
            data.averageProductsFound
          }

        />


      </div>



      <div className="
        bg-slate-900
        rounded-3xl
        p-6
      ">


        <h2 className="
          text-2xl
          font-black
          mb-5
        ">

          📈 توقعات الشراء

        </h2>



        {

          forecast?.map(

            (item,index)=>(

              <div

                key={index}

                className="
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-3
                "

              >

                <div className="font-bold">

                  {item.name}

                </div>


                <div>

                  الطلب المتوقع:

                  {' '}

                  {item.score}

                </div>


              </div>

            )

          )

        }


      </div>


    </div>

  )

}



function StatCard({

  title,

  value

}) {


  return (

    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      border
      border-slate-700
    ">


      <div className="
        text-gray-400
        mb-3
      ">

        {title}

      </div>


      <div className="
        text-4xl
        font-black
      ">

        {value}

      </div>


    </div>

  )

}