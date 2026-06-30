// ======================================================
// Elola ERP Enterprise
// ERP Core Service
// ======================================================

import { erpEventBus } from './ERPEventBus'

import { ERP_EVENTS } from '../constants/events'

class ERPService {

  emit(event, payload = {}) {

    erpEventBus.emit(

      event,

      payload

    )

  }

  on(event, callback) {

    erpEventBus.on(

      event,

      callback

    )

  }

  off(event, callback) {

    erpEventBus.off(

      event,

      callback

    )

  }

  orderCreated(order) {

    this.emit(

      ERP_EVENTS.ORDER_CREATED,

      order

    )

  }

  orderUpdated(order) {

    this.emit(

      ERP_EVENTS.ORDER_UPDATED,

      order

    )

  }

  orderDeleted(order) {

    this.emit(

      ERP_EVENTS.ORDER_DELETED,

      order

    )

  }

}

export const erpService =

  new ERPService()