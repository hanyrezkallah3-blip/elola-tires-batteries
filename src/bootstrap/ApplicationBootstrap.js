// ======================================================
// EL OLA ERP
// Application Bootstrap
// ======================================================

import ERPController
from '../erp/ERPController'

import VehicleBootstrap
from './VehicleBootstrap'

export default class ApplicationBootstrap {

  static initialized = false

  static async initialize() {

    if (this.initialized)

      return

    this.initialized = true

    try {

      if (ERPController?.init) {

        ERPController.init()

      }

      await VehicleBootstrap.initialize()

    }

    catch (error) {

      console.error(

        '[ApplicationBootstrap]',

        error

      )

    }

  }

}