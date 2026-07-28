// ======================================================
// EL OLA ERP
// Event Engine
// ======================================================

import useEventStore from './EventStore'
import EventTypes from './EventTypes'

export class EventEngine {

  // ==================================================
  // GENERIC
  // ==================================================

  static emit(type, payload = {}) {

    useEventStore
      .getState()
      .addEvent({

        type,

        ...payload

      })

  }

  // ==================================================
  // VEHICLES
  // ==================================================

  static vehicleSearch(data) {

    this.emit(

      EventTypes.VEHICLE_SEARCH,

      data

    )

  }

  static vehicleFound(data) {

    this.emit(

      EventTypes.VEHICLE_RESULT_FOUND,

      data

    )

  }

  static vehicleNotFound(data) {

    this.emit(

      EventTypes.VEHICLE_RESULT_NOT_FOUND,

      data

    )

  }

  // ==================================================
  // PRODUCTS
  // ==================================================

  static productView(data) {

    this.emit(

      EventTypes.PRODUCT_VIEW,

      data

    )

  }

  static productSearch(data) {

    this.emit(

      EventTypes.PRODUCT_SEARCH,

      data

    )

  }

  static productCreated(data) {

    this.emit(

      EventTypes.PRODUCT_CREATED,

      data

    )

  }

  static productUpdated(data) {

    this.emit(

      EventTypes.PRODUCT_UPDATED,

      data

    )

  }

  static productDeleted(data) {

    this.emit(

      EventTypes.PRODUCT_DELETED,

      data

    )

  }

  // ==================================================
  // CART
  // ==================================================

  static cartAdd(data) {

    this.emit(

      EventTypes.CART_ADD,

      data

    )

  }

  static cartRemove(data) {

    this.emit(

      EventTypes.CART_REMOVE,

      data

    )

  }

  static cartClear(data = {}) {

    this.emit(

      EventTypes.CART_CLEAR,

      data

    )

  }

  // ==================================================
  // ORDERS
  // ==================================================

  static orderCreated(data) {

    this.emit(

      EventTypes.ORDER_CREATED,

      data

    )

  }

  static orderCompleted(data) {

    this.emit(

      EventTypes.ORDER_COMPLETED,

      data

    )

  }

  static orderCancelled(data) {

    this.emit(

      EventTypes.ORDER_CANCELLED,

      data

    )

  }

}
export default EventEngine