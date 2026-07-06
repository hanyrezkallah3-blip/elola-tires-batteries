// ======================================================
// Elola ERP Enterprise
// useCartCheckout
// ======================================================

import { useState } from 'react'

import CheckoutService from '../core/services/CheckoutService'

import {

  validateCustomer,

  validateCart

} from '../components/cart/CartValidation'

import {

  validateStock,

  updateInventory

} from '../components/cart/CartStock'

import {

  buildWhatsappMessage,

  sendWhatsapp

} from '../components/cart/CartWhatsapp'

export default function useCartCheckout({

  cart,

  stockItems,

  decreaseStock,

  updateStockItem,

  addOrder,

  clearCart,

  setOpen

}) {

  // ======================================================

  const [

    customerName,

    setCustomerName

  ] = useState('')

  const [

    phone,

    setPhone

  ] = useState('')

  const [

    address,

    setAddress

  ] = useState('')

  const [

    loading,

    setLoading

  ] = useState(false)

  // ======================================================

  const checkout = async (

    orderData

  ) => {

    const customerValidation =

      validateCustomer({

        customerName,

        phone,

        address

      })

    if (

      !customerValidation.success

    ) {

      alert(

        customerValidation.message

      )

      return

    }

    const cartValidation =

      validateCart(cart)

    if (

      !cartValidation.success

    ) {

      alert(

        cartValidation.message

      )

      return

    }

    const stockValidation =

      validateStock(cart)

    if (

      !stockValidation.success

    ) {

      alert(

        stockValidation.message

      )

      return

    }

    setLoading(true)

    try {

      const result =

        await CheckoutService.checkout({

          order: orderData

        })

      if (

        !result.success

      ) {

        throw new Error(

          result.message

        )

      }

      if (addOrder) {

        await addOrder(

          orderData

        )

      }

      updateInventory({

        cart,

        stockItems,

        decreaseStock,

        updateStockItem,

        customerName

      })

      const message =

        buildWhatsappMessage({

          customerName,

          phone,

          address,

          cart

        })

      sendWhatsapp({

        phoneNumber:

          '201022464897',

        message

      })

      clearCart()

      setCustomerName('')

      setPhone('')

      setAddress('')

      setOpen(false)

      alert(

        'تم إرسال الطلب بنجاح'

      )

    }

    catch (error) {

      console.error(error)

      alert(

        error.message ||

        'حدث خطأ أثناء إرسال الطلب'

      )

    }

    finally {

      setLoading(false)

    }

  }

  // ======================================================

  return {

    customerName,

    setCustomerName,

    phone,

    setPhone,

    address,

    setAddress,

    loading,

    checkout

  }

}