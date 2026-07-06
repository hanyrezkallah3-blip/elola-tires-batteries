// ======================================================
// Elola ERP Enterprise
// Cart Summary
// ======================================================

import { calculateCartTotal } from './CartHelpers'

export default function CartSummary({

  cart,

  clearCart

}) {

  const total =

    calculateCartTotal(cart)

  if (!cart.length)

    return null

  return (

    <div className="mt-6 bg-slate-900 rounded-xl p-5">

      <div className="flex justify-between items-center">

        <span className="text-lg font-bold">

          إجمالي الطلب

        </span>

        <span className="text-2xl font-black text-yellow-400">

          {total} جنيه

        </span>

      </div>

      <button

        type="button"

        onClick={clearCart}

        className="w-full mt-5 bg-red-700 hover:bg-red-800 transition rounded-lg py-3 font-bold"

      >

        إفراغ السلة

      </button>

    </div>

  )

}