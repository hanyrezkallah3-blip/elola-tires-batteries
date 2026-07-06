// ======================================================
// Elola ERP Enterprise
// Cart Validation
// ======================================================

export function validateCustomer({

  customerName,

  phone,

  address

}) {

  if (

    !customerName?.trim()

  ) {

    return {

      success: false,

      message: 'يرجى إدخال اسم العميل'

    }

  }

  if (

    !phone?.trim()

  ) {

    return {

      success: false,

      message: 'يرجى إدخال رقم الهاتف'

    }

  }

  if (

    phone.trim().length < 11

  ) {

    return {

      success: false,

      message: 'رقم الهاتف غير صحيح'

    }

  }

  if (

    !address?.trim()

  ) {

    return {

      success: false,

      message: 'يرجى إدخال العنوان'

    }

  }

  return {

    success: true

  }

}

// ======================================================

export function validateCart(cart = []) {

  if (

    !Array.isArray(cart)

  ) {

    return {

      success: false,

      message: 'السلة غير صالحة'

    }

  }

  if (

    cart.length === 0

  ) {

    return {

      success: false,

      message: 'السلة فارغة'

    }

  }

  return {

    success: true

  }

}