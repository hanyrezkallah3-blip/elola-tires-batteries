// ======================================================
// EL OLA ERP
// Demand Forecast Engine
// تحليل طلبات العملاء والتنبؤ بالاحتياج
// ======================================================

import { useDemandStore }
  from '../../store/demandStore'



class DemandForecastEngine {


  static analyze() {


    const {

      searches = [],

      missingRequests = []

    } = useDemandStore.getState()



    const demand = {}



    searches.forEach(item => {


      const key =

        `${item.make} ${item.model}`



      if (!demand[key]) {


        demand[key] = {

          name: key,

          score: 0,

          searches: 0,

          missing: 0

        }


      }



      demand[key].searches++

      demand[key].score++



    })




    missingRequests.forEach(item => {


      const key =

        `${item.make} ${item.model}`



      if (!demand[key]) {


        demand[key] = {


          name: key,

          score: 0,

          searches: 0,

          missing: 0

        }


      }



      demand[key].missing++


      // المنتجات غير المتوفرة لها وزن أعلى

      demand[key].score += 5



    })




    return Object.values(demand)

      .sort(

        (a,b) =>

          b.score - a.score

      )

      .slice(0,20)


  }


}



export default DemandForecastEngine