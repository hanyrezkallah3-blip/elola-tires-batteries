// ======================================================
// Elola ERP Enterprise
// Cart Item Card
// ======================================================

import {

  getItemPrice,

  getItemQuantity,

  calculateItemTotal,

  findStockItem

} from './CartHelpers'

export default function CartItemCard({

  item,

  stockItems,

  increaseCartQuantity,

  decreaseCartQuantity,

  removeFromCart

}) {

  const stockItem =

    findStockItem(

      stockItems,

      item

    )

  const quantity =

    getItemQuantity(item)

  const price =

    getItemPrice(item)

  const total =

    calculateItemTotal(item)

  return (

    <div className="bg-slate-900 p-4 rounded">

      <div className="text-xl font-bold">

        {item.name}

      </div>

      <div className="text-yellow-400 mt-2">

        سعر الوحدة:

        {price} جنيه

      </div>

      <div className="text-green-400">

        الإجمالي:

        {total} جنيه

      </div>

      <div className="text-blue-400">

        المخزون الحقيقي:

        {stockItem?.quantity || 0}

      </div>

      {

        (

          !stockItem ||

          stockItem.quantity < quantity

        ) && (

          <div className="text-red-500 font-bold mt-2">

            الكمية المطلوبة أكبر من المتاح

          </div>

        )

      }

      <div className="flex items-center gap-3 mt-4">

        <button

          type="button"

          onClick={() =>

            decreaseCartQuantity(

              item.cartId

            )

          }

          className="bg-red-600 w-10 h-10 rounded text-xl"

        >

          -

        </button>

        <div className="text-2xl font-bold w-10 text-center">

          {quantity}

        </div>

        <button

          type="button"

          onClick={() =>

            increaseCartQuantity(

              item.cartId

            )

          }

          className="bg-green-600 w-10 h-10 rounded text-xl"

        >

          +

        </button>

      </div>

      <button

        type="button"

        onClick={() =>

          removeFromCart(

            item.cartId

          )

        }

        className="mt-4 bg-red-700 px-4 py-2 rounded text-white"

      >

        حذف المنتج

      </button>

    </div>

  )

}