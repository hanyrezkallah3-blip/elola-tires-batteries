// ======================================================
// Elola ERP Enterprise
// Cart Items
// ======================================================

import CartItemCard from './CartItemCard'

export default function CartItems({

  cart,

  stockItems,

  increaseCartQuantity,

  decreaseCartQuantity,

  removeFromCart

}) {

  if (!cart.length) {

    return (

      <div className="mt-6 text-center text-gray-400">

        السلة فارغة

      </div>

    )

  }

  return (

    <div className="mt-6 space-y-4">

      {

        cart.map(

          item => (

            <CartItemCard

              key={item.cartId}

              item={item}

              stockItems={stockItems}

              increaseCartQuantity={

                increaseCartQuantity

              }

              decreaseCartQuantity={

                decreaseCartQuantity

              }

              removeFromCart={

                removeFromCart

              }

            />

          )

        )

      }

    </div>

  )

}