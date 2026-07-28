// ======================================================
// EL OLA ERP
// Business Intelligence Engine
// ======================================================

import AnalyticsEngine from '../analytics/AnalyticsEngine'

export class BIEngine {

  // ==================================================
  // MOST REQUESTED BRANDS
  // ==================================================

  static topBrands(limit = 10) {

    return AnalyticsEngine

      .top(

        AnalyticsEngine.vehicleSearches(),

        'brand'

      )

      .slice(0, limit)

  }

  // ==================================================
  // MOST REQUESTED MODELS
  // ==================================================

  static topModels(limit = 10) {

    return AnalyticsEngine

      .top(

        AnalyticsEngine.vehicleSearches(),

        'model'

      )

      .slice(0, limit)

  }

  // ==================================================
  // FAILED SEARCHES
  // ==================================================

  static failedModels(limit = 10) {

    return AnalyticsEngine

      .top(

        AnalyticsEngine.failedVehicleSearches(),

        'model'

      )

      .slice(0, limit)

  }

  // ==================================================
  // MOST VIEWED PRODUCTS
  // ==================================================

  static mostViewedProducts(limit = 10) {

    return AnalyticsEngine

      .top(

        AnalyticsEngine.productViews(),

        'productId'

      )

      .slice(0, limit)

  }

  // ==================================================
  // MOST ADDED TO CART
  // ==================================================

  static mostAddedToCart(limit = 10) {

    return AnalyticsEngine

      .top(

        AnalyticsEngine.cartAdds(),

        'productId'

      )

      .slice(0, limit)

  }

  // ==================================================
  // SUMMARY
  // ==================================================

  static summary() {

    return {

      searches:

        AnalyticsEngine

          .vehicleSearches()

          .length,

      failed:

        AnalyticsEngine

          .failedVehicleSearches()

          .length,

      successful:

        AnalyticsEngine

          .successfulVehicleSearches()

          .length,

      orders:

        AnalyticsEngine

          .orders()

          .length

    }

  }

}

export default BIEngine