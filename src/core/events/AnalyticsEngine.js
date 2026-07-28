// ======================================================
// EL OLA ERP
// Analytics Engine
// ======================================================

import useEventStore from '../events/EventStore'
import EventTypes from '../events/EventTypes'

export class AnalyticsEngine {

  // ==================================================
  // EVENTS
  // ==================================================

  static events() {

    return useEventStore

      .getState()

      .events

  }

  static byType(type) {

    return this.events()

      .filter(

        event =>

          event.type === type

      )

  }

  // ==================================================
  // VEHICLE SEARCHES
  // ==================================================

  static vehicleSearches() {

    return this.byType(

      EventTypes.VEHICLE_SEARCH

    )

  }

  static successfulVehicleSearches() {

    return this.byType(

      EventTypes.VEHICLE_RESULT_FOUND

    )

  }

  static failedVehicleSearches() {

    return this.byType(

      EventTypes.VEHICLE_RESULT_NOT_FOUND

    )

  }

  // ==================================================
  // PRODUCTS
  // ==================================================

  static productViews() {

    return this.byType(

      EventTypes.PRODUCT_VIEW

    )

  }

  static productSearches() {

    return this.byType(

      EventTypes.PRODUCT_SEARCH

    )

  }

  // ==================================================
  // CART
  // ==================================================

  static cartAdds() {

    return this.byType(

      EventTypes.CART_ADD

    )

  }

  // ==================================================
  // ORDERS
  // ==================================================

  static orders() {

    return this.byType(

      EventTypes.ORDER_CREATED

    )

  }

  // ==================================================
  // COUNTS
  // ==================================================

  static count(type) {

    return this.byType(type)

      .length

  }

  // ==================================================
  // GROUP BY
  // ==================================================

  static groupBy(events, field) {

    const result = {}

    events.forEach(event => {

      const key =

        event[field]

      if (!key)

        return

      result[key] =

        (result[key] || 0) + 1

    })

    return result

  }

  // ==================================================
  // TOP
  // ==================================================

  static top(events, field) {

    return Object.entries(

      this.groupBy(

        events,

        field

      )

    )

      .sort(

        (a, b) =>

          b[1] - a[1]

      )

  }

}

export default AnalyticsEngine