const listeners = new Map()

export class DemandEventBus {

  static on(event, callback) {

    if (!listeners.has(event)) {

      listeners.set(event, [])

    }

    listeners.get(event).push(callback)

  }

  static off(event, callback) {

    if (!listeners.has(event))
      return

    listeners.set(

      event,

      listeners

        .get(event)

        .filter(item => item !== callback)

    )

  }

  static emit(event, payload) {

    if (!listeners.has(event))
      return

    listeners

      .get(event)

      .forEach(callback => {

        callback(payload)

      })

  }

  static clear(event) {

    if (!event) {

      listeners.clear()

      return

    }

    listeners.delete(event)

  }

}

export const DemandEvents = {

  SEARCH_RECORDED:

    'search-recorded',

  PRODUCT_FOUND:

    'product-found',

  PRODUCT_MISSING:

    'product-missing',

  PROCUREMENT_REQUIRED:

    'procurement-required',

  FORECAST_UPDATED:

    'forecast-updated'

}

export default DemandEventBus