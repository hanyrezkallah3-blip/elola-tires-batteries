// ======================================================
// Elola ERP Enterprise
// Cart
//
// IMPORTANT:
// The cart uses the SAME warehouse source used by the
// website products and offers.
//
// Warehouse source:
// useWarehouseStore
//
// NEVER use inventoryStore.stockItems here for website
// sales because website products live inside:
// warehouse.products
//
// MARKET DEMAND:
// This component tracks the real customer journey:
//
// Cart opened / existing cart
// -> Checkout Started
// -> Purchase
// OR
// -> Cart Abandoned
//
// Technical vehicle/VehDB logic is NOT modified here.
// ======================================================

import {
  useMemo,
  useRef,
  useState
} from 'react'

import {
  useWebsiteStore
} from '../store/websiteStore'

import {
  useWarehouseStore
} from '../store/warehouseStore'

import useMarketDemandStore
  from '../store/marketDemandStore'


// ======================================================
// HELPERS
// ======================================================

const toNumber = (
  value,
  fallback = 0
) => {

  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : fallback

}


// ======================================================
// MARKET DEMAND CONTEXT
// ======================================================

const getItemSearchContext = (
  item
) => {

  if (!item) {
    return {}
  }


  return {

    vehicleType:
      item.vehicleType ||
      item.vehicle?.type ||
      '',

    make:
      item.make ||
      item.vehicle?.make ||
      '',

    model:
      item.model ||
      item.vehicle?.model ||
      '',

    year:
      item.year ||
      item.vehicle?.year ||
      '',

    searchType:
      item.searchType ||
      item.searchContext?.searchType ||
      'website',

    searchQuery:
      item.searchQuery ||
      item.searchContext?.searchQuery ||
      '',

    tireSize:
      item.tireSize ||
      item.searchContext?.tireSize ||
      '',

    batteryCapacity:
      item.batteryCapacity ||
      item.searchContext?.batteryCapacity ||
      '',

    oilViscosity:
      item.oilViscosity ||
      item.searchContext?.oilViscosity ||
      ''

  }

}


// ======================================================
// COMPONENT
// ======================================================

export default function Cart({
  open,
  setOpen
}) {

  // ====================================================
  // WEBSITE STORE
  // ====================================================

  const cart =
    useWebsiteStore(
      state =>
        Array.isArray(state.cart)
          ? state.cart
          : []
    )

  const removeFromCart =
    useWebsiteStore(
      state =>
        state.removeFromCart
    )

  const clearCart =
    useWebsiteStore(
      state =>
        state.clearCart
    )

  const addOrder =
    useWebsiteStore(
      state =>
        state.addOrder
    )

  const increaseCartQuantity =
    useWebsiteStore(
      state =>
        state.increaseCartQuantity
    )

  const decreaseCartQuantity =
    useWebsiteStore(
      state =>
        state.decreaseCartQuantity
    )


  // ====================================================
  // REAL WAREHOUSE STORE
  // ====================================================

  const warehouses =
    useWarehouseStore(
      state =>
        Array.isArray(state.warehouses)
          ? state.warehouses
          : []
    )

  const processInventoryTransaction =
    useWarehouseStore(
      state =>
        state.processInventoryTransaction
    )


  // ====================================================
  // CUSTOMER FORM
  // ====================================================

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


  // ====================================================
  // MARKET DEMAND SESSION FLAGS
  // ====================================================

  const checkoutStartedRef =
    useRef(false)

  const purchaseCompletedRef =
    useRef(false)


  // ====================================================
  // SAFE CART
  // ====================================================

  const safeCart =
    useMemo(

      () =>
        Array.isArray(cart)
          ? cart
          : [],

      [cart]

    )


  // ====================================================
  // RESET PURCHASE FLAG AFTER CART BECOMES EMPTY
  //
  // This allows the next shopping session to be tracked
  // normally.
  // ====================================================

  if (
    safeCart.length === 0 &&
    purchaseCompletedRef.current
  ) {

    purchaseCompletedRef.current =
      false

    checkoutStartedRef.current =
      false

  }


  // ====================================================
  // MARKET DEMAND
  // CHECKOUT START
  // ====================================================

  const trackCheckoutStarted = () => {

    if (
      checkoutStartedRef.current
    ) {

      return

    }


    if (
      safeCart.length === 0
    ) {

      return

    }


    try {

      useMarketDemandStore
        .getState()
        .recordCheckoutStarted({

          products:
            safeCart,

          searchContext:
            safeCart.length === 1

              ? getItemSearchContext(
                  safeCart[0]
                )

              : {
                  searchType:
                    'website-cart',

                  searchQuery:
                    '',

                  vehicleType:
                    '',

                  make:
                    '',

                  model:
                    '',

                  year:
                    ''
                },

          metadata: {

            source:
              'Cart',

            cartSize:
              safeCart.length,

            cartTotal:
              safeCart.reduce(

                (
                  accumulator,
                  item
                ) => {

                  const price =
                    toNumber(
                      item.offerPrice ??
                      item.salePrice ??
                      item.price ??
                      0
                    )

                  const quantity =
                    toNumber(
                      item.quantity,
                      1
                    )

                  return (
                    accumulator +
                    price * quantity
                  )

                },

                0

              )

          }

        })


      checkoutStartedRef.current =
        true


      console.info(
        '[MarketDemand] Checkout started',
        {
          products:
            safeCart.length
        }
      )

    }

    catch (
      error
    ) {

      console.error(
        '[MarketDemand] checkout tracking failed:',
        error
      )

    }

  }


  // ====================================================
  // MARKET DEMAND
  // CART ABANDONED
  //
  // This is recorded only when the customer leaves the
  // cart while products are still present and a purchase
  // has not completed.
  // ====================================================

  const trackCartAbandoned = (
    source = 'Cart'
  ) => {

    if (
      safeCart.length === 0
    ) {

      return

    }


    if (
      purchaseCompletedRef.current
    ) {

      return

    }


    try {

      useMarketDemandStore
        .getState()
        .recordCartAbandoned({

          products:
            safeCart,

          searchContext:
            safeCart.length === 1

              ? getItemSearchContext(
                  safeCart[0]
                )

              : {
                  searchType:
                    'website-cart',

                  searchQuery:
                    '',

                  vehicleType:
                    '',

                  make:
                    '',

                  model:
                    '',

                  year:
                    ''
                },

          metadata: {

            source,

            cartSize:
              safeCart.length

          }

        })


      console.info(
        '[MarketDemand] Cart abandoned',
        {
          source,
          products:
            safeCart.length
        }
      )

    }

    catch (
      error
    ) {

      console.error(
        '[MarketDemand] cart abandonment tracking failed:',
        error
      )

    }

  }


  // ====================================================
  // FIND REAL WAREHOUSE PRODUCT
  //
  // Priority:
  //
  // 1. sourceProductId
  // 2. productId
  // 3. id
  //
  // And first search inside the selected warehouse.
  // ====================================================

  const findWarehouseProduct = (
    item
  ) => {

    if (!item) {
      return null
    }


    const ids = [

      item.sourceProductId,

      item.productId,

      item.id

    ]
      .filter(
        value =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ''
      )
      .map(
        value =>
          String(value)
      )


    const uniqueIds =
      [...new Set(ids)]


    if (
      uniqueIds.length === 0
    ) {

      return null

    }


    const matchesProduct = (
      product
    ) => {

      if (!product) {
        return false
      }

      const productIds = [

        product.productId,

        product.id

      ]
        .filter(
          value =>
            value !== undefined &&
            value !== null
        )
        .map(
          value =>
            String(value)
        )

      return productIds.some(
        id =>
          uniqueIds.includes(id)
      )

    }


    // ==================================================
    // FIRST: SELECTED WAREHOUSE
    // ==================================================

    if (item.warehouseId) {

      const warehouse =
        warehouses.find(

          warehouse =>
            String(
              warehouse.id
            ) ===
            String(
              item.warehouseId
            )

        )


      const product =
        warehouse?.products?.find(
          matchesProduct
        )


      if (product) {

        return {

          ...product,

          warehouseId:
            warehouse.id,

          warehouseName:
            warehouse.name || '',

          realProductId:
            product.productId ||
            product.id,

          quantity:
            toNumber(
              product.quantity,
              0
            )

        }

      }

    }


    // ==================================================
    // SECOND: ALL WAREHOUSES
    // ==================================================

    for (
      const warehouse
      of warehouses
    ) {

      const product =
        Array.isArray(
          warehouse.products
        )
          ? warehouse.products.find(
              matchesProduct
            )
          : null


      if (product) {

        return {

          ...product,

          warehouseId:
            warehouse.id,

          warehouseName:
            warehouse.name || '',

          realProductId:
            product.productId ||
            product.id,

          quantity:
            toNumber(
              product.quantity,
              0
            )

        }

      }

    }


    return null

  }


  // ====================================================
  // GET CART ITEM STOCK
  // ====================================================

  const getCartStock = (
    item
  ) => {

    const warehouseProduct =
      findWarehouseProduct(item)

    if (!warehouseProduct) {

      return {

        exists: false,

        quantity: 0,

        product: null

      }

    }


    return {

      exists: true,

      quantity:
        toNumber(
          warehouseProduct.quantity,
          0
        ),

      product:
        warehouseProduct

    }

  }


  // ====================================================
  // TOTAL
  // ====================================================

  const total =
    safeCart.reduce(

      (
        accumulator,
        item
      ) => {

        const price =
          toNumber(
            item.offerPrice ??
            item.salePrice ??
            item.price ??
            0
          )

        const quantity =
          toNumber(
            item.quantity,
            1
          )

        return (
          accumulator +
          price * quantity
        )

      },

      0

    )


  // ====================================================
  // STOCK VALIDATION
  // ====================================================

  const validateStock = () => {

    for (
      const item
      of safeCart
    ) {

      const stock =
        getCartStock(item)


      if (!stock.exists) {

        alert(

          `المنتج "${

            item.name ||

            item.productName ||

            'المنتج'

          }" غير موجود في المخزن`

        )

        return false

      }


      const available =
        Number(
          stock.quantity || 0
        )

      const required =
        Number(
          item.quantity || 1
        )


      if (
        required <= 0
      ) {

        alert(
          `كمية المنتج "${item.name}" غير صحيحة`
        )

        return false

      }


      if (
        required >
        available
      ) {

        alert(

          `المنتج "${

            item.name ||

            item.productName ||

            'المنتج'

          }"\n\n` +

          `الكمية المطلوبة: ${required}\n` +

          `الكمية المتاحة: ${available}`

        )

        return false

      }

    }


    return true

  }


  // ====================================================
  // PHONE VALIDATION
  // ====================================================

  const validatePhone = () => {

    if (
      phone.trim().length < 11
    ) {

      alert(
        'رقم الهاتف غير صحيح'
      )

      return false

    }

    return true

  }


  // ====================================================
  // INCREASE CART QUANTITY
  //
  // NEVER allow cart quantity to exceed the REAL
  // warehouse quantity.
  // ====================================================

  const handleIncrease = (
    item
  ) => {

    const stock =
      getCartStock(item)


    const available =
      Number(
        stock.quantity || 0
      )

    const current =
      Number(
        item.quantity || 1
      )


    if (
      !stock.exists
    ) {

      alert(
        'المنتج غير موجود في المخزن'
      )

      return

    }


    if (
      current >= available
    ) {

      alert(
        `لا يمكن زيادة الكمية. المتاح في المخزن: ${available}`
      )

      return

    }


    increaseCartQuantity(
      item.cartId
    )

  }


  // ====================================================
  // DECREASE CART QUANTITY
  // ====================================================

  const handleDecrease = (
    item
  ) => {

    decreaseCartQuantity(
      item.cartId
    )

  }


  // ====================================================
  // ORDER
  // ====================================================

  const handleOrder = async (
    event
  ) => {

    event.preventDefault()
    event.stopPropagation()


    if (

      !customerName.trim()

      ||

      !phone.trim()

      ||

      !address.trim()

      ||

      safeCart.length === 0

    ) {

      alert(
        'يرجى إدخال جميع البيانات'
      )

      return

    }


    if (
      !validatePhone()
    ) {

      return

    }


    if (
      !validateStock()
    ) {

      return

    }


    // ================================================
    // MARKET DEMAND
    //
    // Customer has reached the actual checkout/order
    // confirmation stage.
    // ================================================

    trackCheckoutStarted()


    setLoading(true)


    try {

      // ================================================
      // PREPARE REAL WAREHOUSE PRODUCTS
      //
      // We resolve everything BEFORE changing stock.
      // ================================================

      const resolvedItems =
        safeCart.map(

          cartItem => {

            const stock =
              getCartStock(
                cartItem
              )

            return {

              cartItem,

              stock

            }

          }

        )


      // ================================================
      // FINAL VALIDATION
      // ================================================

      for (
        const resolved
        of resolvedItems
      ) {

        if (
          !resolved.stock.exists
        ) {

          throw new Error(

            `المنتج "${

              resolved.cartItem.name ||

              resolved.cartItem.productName ||

              'المنتج'

            }" غير موجود في المخزن`

          )

        }


        const required =
          Number(
            resolved.cartItem.quantity || 1
          )

        const available =
          Number(
            resolved.stock.quantity || 0
          )


        if (
          required >
          available
        ) {

          throw new Error(

            `المنتج "${

              resolved.cartItem.name ||

              resolved.cartItem.productName ||

              'المنتج'

            }"\n` +

            `المطلوب: ${required}\n` +

            `المتاح: ${available}`

          )

        }

      }


      // ================================================
      // DEDUCT REAL WAREHOUSE STOCK
      //
      // The warehouse store is the source of truth.
      // ================================================

      const transactions = []


      for (
        const resolved
        of resolvedItems
      ) {

        const cartItem =
          resolved.cartItem

        const warehouseProduct =
          resolved.stock.product


        const warehouseId =
          warehouseProduct.warehouseId ||
          cartItem.warehouseId


        const realProductId =
          warehouseProduct.productId ||
          warehouseProduct.id ||
          cartItem.sourceProductId ||
          cartItem.productId ||
          cartItem.id


        const quantity =
          Number(
            cartItem.quantity || 1
          )


        if (
          !warehouseId ||
          !realProductId
        ) {

          throw new Error(

            `تعذر تحديد المخزن الحقيقي للمنتج "${

              cartItem.name ||

              cartItem.productName ||

              'المنتج'

            }"`

          )

        }


        const result =
          processInventoryTransaction(

            warehouseId,

            realProductId,

            'out',

            quantity,

            {

              source:
                'website',

              reference:
                `WEB-${Date.now()}`,

              notes:
                `بيع من الموقع - ${customerName.trim()}`,

              salePrice:
                toNumber(
                  cartItem.offerPrice ??
                  cartItem.salePrice ??
                  cartItem.price ??
                  0
                )

            }

          )


        if (
          !result?.success
        ) {

          throw new Error(

            result?.message ||

            `فشل خصم مخزون المنتج "${

              cartItem.name ||

              cartItem.productName ||

              'المنتج'

            }"`

          )

        }


        transactions.push({

          cartItem,

          warehouseId,

          productId:
            realProductId,

          quantity,

          newQuantity:
            result.newQuantity

        })

      }


      // ================================================
      // MARKET DEMAND SEARCH CONTEXT
      //
      // Preserve the search context that originally led
      // to the products entering the cart.
      // ================================================

      const primarySearchContext =
        safeCart.length === 1

          ? getItemSearchContext(
              safeCart[0]
            )

          : {

              searchType:
                'website-cart',

              searchQuery:
                '',

              vehicleType:
                '',

              make:
                '',

              model:
                '',

              year:
                ''

            }


      // ================================================
      // CREATE ORDER
      // ================================================

      const orderData = {

        customerName:
          customerName.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        items:
          safeCart.map(
            item => ({

              ...item,

              sourceProductId:
                item.sourceProductId ||
                item.productId ||
                item.id,

              warehouseId:
                item.warehouseId ||

                resolvedItems.find(
                  resolved =>
                    resolved.cartItem.cartId ===
                    item.cartId
                )?.stock?.product?.warehouseId

            })
          ),

        total,

        warehouseId:
          safeCart[0]?.warehouseId ||
          transactions[0]?.warehouseId ||
          '',

        // ============================================
        // MARKET DEMAND CONTEXT
        // ============================================

        searchContext:
          primarySearchContext,

        vehicleSearchContext:
          primarySearchContext,

        createdBy:
          'website',

        paymentMethod:
          'cash',

        date:
          new Date().toLocaleString(),

        status:
          'طلب جديد'

      }


      // ================================================
      // CREATE ORDER
      //
      // websiteStore.addOrder is responsible for the
      // actual order persistence and purchase tracking.
      // ================================================

      const orderResult =
        addOrder(
          orderData
        )


      // ================================================
      // MARKET DEMAND
      //
      // The Cart itself does not create a second
      // PURCHASE event here.
      //
      // websiteStore.addOrder is the single source for
      // purchase tracking, preventing duplicate purchase
      // events.
      // ================================================

      purchaseCompletedRef.current =
        true


      // ================================================
      // WHATSAPP MESSAGE
      // ================================================

      const message = `

📦 طلب جديد

الاسم:
${customerName}

الهاتف:
${phone}

العنوان:
${address}

----------------

${transactions.map(
  transaction => {

    const item =
      transaction.cartItem

    return `

${item.name || item.productName || 'منتج'}

الكمية:
${transaction.quantity}

المخزن:
${item.warehouseName || transaction.warehouseId}

المتبقي بعد البيع:
${transaction.newQuantity}

سعر الوحدة:
${toNumber(
  item.offerPrice ??
  item.salePrice ??
  item.price ??
  0
)} جنيه

`

  }
).join('\n')}

----------------

الإجمالي:

${total} جنيه

`


      window.open(

        `https://wa.me/201022464897?text=${encodeURIComponent(
          message
        )}`,

        '_blank'

      )


      // ================================================
      // CLEAR
      // ================================================

      clearCart()

      setCustomerName('')
      setPhone('')
      setAddress('')


      alert(
        'تم إرسال الطلب بنجاح وتم خصم الكمية من المخزن الحقيقي'
      )


      setOpen(false)

    }

    catch (
      error
    ) {

      // ================================================
      // IMPORTANT
      //
      // If order processing fails, we DO NOT mark the
      // journey as purchased.
      // ================================================

      purchaseCompletedRef.current =
        false


      console.error(
        'Cart Order Error:',
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


  // ====================================================
  // BACKDROP
  // ====================================================

  const handleBackdrop = (
    event
  ) => {

    if (
      event.target.id ===
      'cart-backdrop'
    ) {

      trackCartAbandoned(
        'Cart Backdrop'
      )

      setOpen(false)

    }

  }


  // ====================================================
  // CLOSED
  // ====================================================

  if (!open) {

    return null

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div

      id="cart-backdrop"

      onClick={
        handleBackdrop
      }

      className="
        fixed
        inset-0
        bg-black/70
        z-50
        flex
        justify-end
      "

    >

      <div

        onClick={
          event =>
            event.stopPropagation()
        }

        className="
          w-full
          md:w-[520px]
          h-screen
          bg-slate-950
          overflow-y-auto
          p-6
        "

      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            justify-between
            mb-6
          "
        >

          <h2
            className="
              text-3xl
              text-yellow-400
              font-bold
            "
          >

            سلة المشتريات

          </h2>


          <button

            type="button"

            onClick={() => {

              trackCartAbandoned(
                'Cart Close Button'
              )

              setOpen(false)

            }}

            className="
              bg-red-600
              px-3
              py-2
              rounded
            "

          >

            ✕

          </button>

        </div>


        {/* ==================================================
            CUSTOMER FORM
        ================================================== */}

        <form

          onSubmit={
            handleOrder
          }

          className="
            space-y-4
          "

        >

          <input

            value={
              customerName
            }

            onChange={
              event =>
                setCustomerName(
                  event.target.value
                )
            }

            placeholder="اسم العميل"

            className="
              w-full
              p-3
              rounded
              bg-white
              text-black
            "

          />


          <input

            value={
              phone
            }

            onChange={
              event =>
                setPhone(
                  event.target.value
                )
            }

            placeholder="رقم الهاتف"

            className="
              w-full
              p-3
              rounded
              bg-white
              text-black
            "

          />


          <textarea

            value={
              address
            }

            onChange={
              event =>
                setAddress(
                  event.target.value
                )
            }

            placeholder="العنوان"

            className="
              w-full
              p-3
              rounded
              bg-white
              text-black
              h-24
            "

          />


          <button

            type="submit"

            disabled={
              loading
            }

            className="
              w-full
              bg-yellow-500
              py-3
              font-bold
              rounded
              disabled:opacity-50
            "

          >

            {

              loading

                ? 'جاري التنفيذ...'

                : 'تأكيد الطلب'

            }

          </button>

        </form>


        {/* ==================================================
            ITEMS
        ================================================== */}

        <div
          className="
            mt-6
            space-y-4
          "
        >

          {
            safeCart.map(
              item => {

                const stock =
                  getCartStock(
                    item
                  )


                const quantity =
                  Number(
                    item.quantity || 1
                  )


                const price =
                  toNumber(

                    item.offerPrice ??
                    item.salePrice ??
                    item.price ??
                    0

                  )


                const available =
                  Number(
                    stock.quantity || 0
                  )


                const unavailable =
                  !stock.exists ||
                  quantity >
                  available


                const displayBrand =
                  item.brand ||
                  stock.product?.brand ||
                  ''


                return (

                  <div

                    key={
                      item.cartId ||
                      `${item.productId || item.id}`
                    }

                    className="
                      bg-slate-900
                      p-4
                      rounded
                    "

                  >

                    {/* NAME */}

                    <div
                      className="
                        text-xl
                        font-bold
                      "
                    >

                      {
                        item.name ||
                        item.productName ||
                        'منتج'
                      }

                    </div>


                    {/* BRAND */}

                    {
                      displayBrand && (

                        <div
                          className="
                            text-gray-300
                            mt-2
                          "
                        >

                          الماركة:

                          {' '}

                          <span
                            className="
                              text-white
                              font-bold
                            "
                          >

                            {
                              displayBrand
                            }

                          </span>

                        </div>

                      )
                    }


                    {/* OFFER */}

                    {
                      item.isOffer && (

                        <div
                          className="
                            text-yellow-400
                            font-bold
                            mt-2
                          "
                        >

                          عرض

                        </div>

                      )
                    }


                    {/* PRICE */}

                    <div
                      className="
                        text-yellow-400
                        mt-2
                      "
                    >

                      سعر الوحدة:

                      {' '}

                      {price}

                      {' '}

                      جنيه

                    </div>


                    {/* TOTAL */}

                    <div
                      className="
                        text-green-400
                      "
                    >

                      الإجمالي:

                      {' '}

                      {price * quantity}

                      {' '}

                      جنيه

                    </div>


                    {/* REAL WAREHOUSE */}

                    <div
                      className="
                        text-blue-400
                        mt-2
                      "
                    >

                      المخزن:

                      {' '}

                      {
                        stock.product?.warehouseName ||
                        item.warehouseName ||
                        item.warehouseId ||
                        'غير محدد'
                      }

                    </div>


                    {/* REAL STOCK */}

                    <div
                      className={`
                        mt-1
                        font-bold
                        ${
                          unavailable
                            ? 'text-red-500'
                            : 'text-green-400'
                        }
                      `}
                    >

                      المخزون الحقيقي:

                      {' '}

                      {available}

                    </div>


                    {/* WARNING */}

                    {
                      unavailable && (

                        <div
                          className="
                            text-red-500
                            font-bold
                            mt-2
                          "
                        >

                          {
                            !stock.exists

                              ? 'لم يتم العثور على المنتج في المخزن المحدد'

                              : 'الكمية المطلوبة أكبر من المتاح'
                          }

                        </div>

                      )
                    }


                    {/* QUANTITY */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-4
                      "
                    >

                      <button

                        type="button"

                        onClick={() =>
                          handleDecrease(
                            item
                          )
                        }

                        disabled={
                          quantity <= 1
                        }

                        className="
                          bg-red-600
                          w-10
                          h-10
                          rounded
                          text-xl
                          disabled:opacity-40
                        "

                      >

                        -

                      </button>


                      <div
                        className="
                          text-2xl
                          font-bold
                          w-10
                          text-center
                        "
                      >

                        {quantity}

                      </div>


                      <button

                        type="button"

                        onClick={() =>
                          handleIncrease(
                            item
                          )
                        }

                        disabled={
                          quantity >=
                          available ||
                          !stock.exists
                        }

                        className="
                          bg-green-600
                          w-10
                          h-10
                          rounded
                          text-xl
                          disabled:opacity-40
                        "

                      >

                        +

                      </button>

                    </div>


                    {/* REMOVE */}

                    <button

                      type="button"

                      onClick={() =>
                        removeFromCart(
                          item.cartId
                        )
                      }

                      className="
                        mt-4
                        bg-red-700
                        px-4
                        py-2
                        rounded
                        text-white
                      "

                    >

                      حذف المنتج

                    </button>

                  </div>

                )

              }
            )

          }

        </div>


        {/* ==================================================
            CART TOTAL
        ================================================== */}

        {
          safeCart.length > 0 && (

            <div
              className="
                mt-6
                border-t
                border-slate-700
                pt-5
                text-2xl
                font-black
                text-yellow-400
              "
            >

              إجمالي السلة:

              {' '}

              {total}

              {' '}

              جنيه

            </div>

          )
        }

      </div>

    </div>

  )

}