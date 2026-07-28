import DemandAnalytics from '../analytics/DemandAnalytics'
import ProcurementAI from '../engines/ProcurementAI'
import VehicleRecommendationEngine from '../engines/VehicleRecommendationEngine'

export class DemandBI {

  static getDashboard() {

    return {

      analytics:

        DemandAnalytics.dashboard(),

      recommendations:

        VehicleRecommendationEngine.top(10),

      procurement:

        ProcurementAI.topSuggestions(10)

    }

  }

  static getOwnerSummary() {

    const analytics =

      DemandAnalytics.summary()

    return {

      totalSearches:

        analytics.totalSearches,

      successRate:

        analytics.successRate,

      missingSearches:

        analytics.missingSearches,

      topVehicles:

        VehicleRecommendationEngine.top(5),

      purchaseSuggestions:

        ProcurementAI.topSuggestions(5)

    }

  }

}

export default DemandBI