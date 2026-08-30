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
  validateStock
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
  // CUSTOMER STATE
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
  // CHECKOUT
  // ======================================================

  const checkout = async (

    orderData

  ) => {

    // ====================================================
    // CUSTOMER VALIDATION
    // ====================================================

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


    // ====================================================
    // CART VALIDATION
    // ====================================================

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


    // ====================================================
    // LOCAL STOCK VALIDATION
    // ====================================================

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

      // ==================================================
      // BUILD FINAL ORDER
      // ==================================================

      const finalOrder = {

        ...(orderData || {}),

        customerName:
          orderData?.customerName ||
          customerName,

        phone:
          orderData?.phone ||
          phone,

        address:
          orderData?.address ||
          address,

        items:
          orderData?.items ||
          cart,

        cart:
          orderData?.cart ||
          cart

      }


      // ==================================================
      // VALIDATE STOCK THROUGH SALES PIPELINE
      // ==================================================

      const validateOrderStock = async (

        order = {}

      ) => {

        const orderCart =

          Array.isArray(order.items)

            ? order.items

            : Array.isArray(order.cart)

              ? order.cart

              : cart


        return validateStock(

          orderCart

        )

      }


      // ==================================================
      // DECREASE STOCK THROUGH SALES PIPELINE
      // ==================================================

      const decreaseOrderStock = async (

        order = {}

      ) => {

        // ------------------------------------------------
        // IMPORTANT
        // ------------------------------------------------
        // SalesEngine calls this AFTER the order has been
        // successfully saved.
        //
        // We therefore perform the inventory update here
        // and DO NOT call updateInventory() afterwards.
        // ------------------------------------------------

        const orderCart =

          Array.isArray(order.items)

            ? order.items

            : Array.isArray(order.cart)

              ? order.cart

              : cart


        for (

          const cartItem of orderCart

        ) {

          const quantity =

            Number(

              cartItem.quantity || 1

            )


          if (

            !Number.isFinite(quantity) ||

            quantity <= 0

          ) {

            throw new Error(

              'كمية المنتج غير صحيحة'

            )

          }


          // ==============================================
          // FIND STOCK ITEM
          // ==============================================

          const stockItem =

            (

              stockItems || []

            ).find(item => {

              const stockProductId =

                String(

                  item.productId ||

                  item.id ||

                  ''

                )


              const cartProductId =

                String(

                  cartItem.productId ||

                  cartItem.id ||

                  ''

                )


              return (

                stockProductId ===

                cartProductId

              )

            })


          if (!stockItem) {

            throw new Error(

              `المخزون غير موجود للمنتج: ${
                cartItem.name ||
                cartItem.productName ||
                cartItem.productId ||
                cartItem.id ||
                ''
              }`

            )

          }


          // ==============================================
          // UPDATE EXISTING INVENTORY
          // ==============================================

          if (

            typeof decreaseStock ===

            'function'

          ) {

            await decreaseStock({

              itemId:
                stockItem.id,

              quantity,

              note:
                `بيع - الطلب ${
                  customerName
                }`

            })

          }


          // ==============================================
          // UPDATE LOCAL SOLD COUNTER
          // ==============================================

          if (

            typeof updateStockItem ===

            'function'

          ) {

            await updateStockItem(

              stockItem.id,

              {

                sold:

                  Number(

                    stockItem.sold || 0

                  ) +

                  quantity

              }

            )

          }

        }


        return {

          success: true

        }

      }


      // ==================================================
      // CHECKOUT SERVICE
      // ==================================================

      const result =

        await CheckoutService.checkout({

          order:
            finalOrder,

          validateStock:
            validateOrderStock,

          decreaseStock:
            decreaseOrderStock

        })


      // ==================================================
      // CHECKOUT FAILURE
      // ==================================================

      if (

        !result?.success

      ) {

        throw new Error(

          result?.message ||

          'فشل إتمام الطلب'

        )

      }


      // ==================================================
      // LOCAL ORDER STORE
      // ==================================================
      //
      // The Firestore order has already been created by
      // SalesEngine.
      //
      // We only synchronize the local store here.
      //
      // IMPORTANT:
      // We do NOT create the Firestore order again.
      //
      // ==================================================

      if (

        typeof addOrder ===

        'function'

      ) {

        await addOrder(

          {

            ...finalOrder,

            id:
              result?.data?.orderId ||

              finalOrder.id

          }

        )

      }


      // ==================================================
      // WHATSAPP
      // ==================================================

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


      // ==================================================
      // CLEAR CART
      // ==================================================

      clearCart()


      setCustomerName('')

      setPhone('')

      setAddress('')


      setOpen(false)


      // ==================================================
      // SUCCESS
      // ==================================================

      alert(

        'تم إرسال الطلب بنجاح'

      )

    }

    catch (error) {

      console.error(

        'useCartCheckout.checkout failed:',

        error

      )


      alert(

        error?.message ||

        'حدث خطأ أثناء إرسال الطلب'

      )

    }

    finally {

      setLoading(false)

    }

  }


  // ======================================================
  // RETURN
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