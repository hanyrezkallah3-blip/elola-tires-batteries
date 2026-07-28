import VehicleDemandEngine from '../core/engines/VehicleDemandEngine'
import VehicleRecommendationEngine from '../core/engines/VehicleRecommendationEngine'
import ProcurementAI from '../core/engines/ProcurementAI'

import DemandEventBus, {
  DemandEvents
} from '../core/events/DemandEventBus'

import { useDemandStore } 
  from '../store/demandStore'



class VehicleSearchTrackingService {



  static track({

    make,

    model,

    year,

    vehicle,

    tires = [],

    batteries = [],

    oils = []

  }) {


    const found =

      (

        tires.length +

        batteries.length +

        oils.length

      ) > 0



    useDemandStore
      .getState()
      .addSearch({

        make,

        model,

        year,

        vehicleId:

          vehicle?.id || null,


        found,


        productsFound:

          {

            tires:

              tires.length,


            batteries:

              batteries.length,


            oils:

              oils.length

          }

      })



    // تسجيل المنتجات غير المتوفرة

    if (!found) {


      useDemandStore
        .getState()
        .addMissingRequest({

          make,

          model,

          year,


          reason:

            'لم توجد منتجات مناسبة للسيارة'


        })

    }


  }


}


export default VehicleSearchTrackingService

export default class VehicleSearchTrackingService {

  static track({

    make,

    model,

    year,

    vehicle,

    tires = [],

    batteries = [],

    oils = []

  }) {

    const products = [

      ...tires,

      ...batteries,

      ...oils

    ]

    const record = {

      make,

      model,

      year,

      found:

        products.length > 0,

      productsCount:

        products.length,

      tireSize:

        vehicle?.tires?.[0]

          ? `${vehicle.tires[0].width}/${vehicle.tires[0].profile}R${vehicle.tires[0].rim}`

          : '',

      batteryCapacity:

        vehicle?.batteries?.[0]?.capacity || '',

      oilViscosity:

        vehicle?.oils?.[0]?.viscosity || ''

    }

    VehicleDemandEngine.record(

      record

    )

    VehicleRecommendationEngine.learn(

      record

    )

    ProcurementAI.learn(

      record

    )

    DemandEventBus.emit(

      DemandEvents.SEARCH_RECORDED,

      record

    )

    if (record.found) {

      DemandEventBus.emit(

        DemandEvents.PRODUCT_FOUND,

        record

      )

    } else {

      DemandEventBus.emit(

        DemandEvents.PRODUCT_MISSING,

        record

      )

      DemandEventBus.emit(

        DemandEvents.PROCUREMENT_REQUIRED,

        record

      )

    }

    return record

  }

}