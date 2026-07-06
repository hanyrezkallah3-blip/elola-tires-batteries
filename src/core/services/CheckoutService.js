// ======================================================
// Elola ERP Enterprise
// Checkout Service
// ======================================================

import SalesEngine from '../engines/SalesEngine'

class CheckoutService {

  // ======================================================
  // CHECKOUT
  // ======================================================

  async checkout({

    order,

    validateStock,

    decreaseStock,

    addCashback,

    onSuccess,

    onError

  }) {

    return await SalesEngine.createOrder({

      order,

      validateStock,

      decreaseStock,

      addCashback,

      onSuccess,

      onError

    })

  }

}

export default new CheckoutService()