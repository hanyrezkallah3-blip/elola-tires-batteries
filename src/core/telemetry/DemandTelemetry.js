// ======================================================
// EL OLA ERP
// Demand Telemetry
// قراءة مؤشرات طلبات العملاء
// ======================================================

import { useDemandStore }
  from '../../store/demandStore'



class DemandTelemetry {



  static metrics() {


    const store =
      useDemandStore.getState()



    const searches =
      store.searches || []



    const missing =
      store.missingRequests || []



    const totalSearches =
      searches.length



    const successful =
      searches.filter(

        item =>
          item.found === true

      ).length



    const failed =
      searches.filter(

        item =>
          item.found === false

      ).length



    const totalProductsFound =

      searches.reduce(

        (sum,item)=>{


          return (

            sum +

            Number(
              item.productsFound?.tires || 0
            ) +

            Number(
              item.productsFound?.batteries || 0
            ) +

            Number(
              item.productsFound?.oils || 0
            )

          )


        },

        0

      )



    return {


      totalSearches,


      successful,


      failed,


      missingProducts:

        missing.length,


      averageProductsFound:


        totalSearches > 0

          ?

          (

            totalProductsFound /

            totalSearches

          ).toFixed(2)

          :

          0



    }


  }


}



export default DemandTelemetry