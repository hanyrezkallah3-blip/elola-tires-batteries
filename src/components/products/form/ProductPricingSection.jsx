export default function ProductPricingSection({

  form,

  setForm

}) {

  // ======================================================
  // UPDATE NUMBER FIELD
  // ======================================================

  const update = (

    key,

    value

  ) => {

    setForm(prev => ({

      ...prev,

      [key]:
        value === ''
          ? 0
          : Number(value)

    }))

  }


  // ======================================================
  // WAREHOUSE ORIGINAL PRICE
  //
  // This price is READ ONLY.
  // It must never be changed while creating an offer.
  // ======================================================

  const originalPrice =
    Number(
      form.originalSalePrice ??
      form.warehouseSalePrice ??
      form.salePrice ??
      0
    )


  // ======================================================
  // OFFER PRICE
  //
  // This is the ONLY commercial price that can be changed
  // when creating an offer.
  // ======================================================

  const offerPrice =
    Number(
      form.offerPrice ??
      originalPrice ??
      0
    )


  // ======================================================
  // COST
  // ======================================================

  const purchasePrice =
    Number(
      form.purchasePrice || 0
    )


  const additionalCost =
    Number(
      form.additionalCost || 0
    )


  const totalCost =
    purchasePrice +
    additionalCost


  // ======================================================
  // PROFIT
  // ======================================================

  const profit =
    offerPrice -
    totalCost


  const profitMargin =
    totalCost > 0

      ? (
          profit /
          totalCost
        ) * 100

      : 0


  return (

    <div

      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-6
      "

    >

      <h3

        className="
          text-2xl
          font-black
          text-yellow-400
        "

      >

        الأسعار والتكاليف

      </h3>


      {/* ==================================================
          OFFER PRICE INFORMATION
      ================================================== */}

      <div

        className="
          bg-blue-900/30
          border
          border-blue-500
          rounded-2xl
          p-5
          space-y-3
        "

      >

        <div className="text-gray-300 font-bold">

          سعر المنتج في المخزن

        </div>

        <div className="text-3xl font-black text-white">

          {originalPrice.toFixed(2)}

        </div>

        <div className="text-sm text-gray-400">

          هذا هو السعر الأصلي للمنتج في المخزن
          ولن يتم تغييره عند إنشاء العرض.

        </div>

      </div>


      {/* ==================================================
          PRICES
      ================================================== */}

      <div

        className="
          grid
          md:grid-cols-2
          gap-5
        "

      >

        {/* ==================================================
            PURCHASE PRICE
        ================================================== */}

        <div>

          <label className="font-bold text-gray-300">

            سعر الشراء

          </label>

          <input

            type="number"

            value={
              form.purchasePrice ?? 0
            }

            onChange={(e) =>

              update(
                'purchasePrice',
                e.target.value
              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>


        {/* ==================================================
            ADDITIONAL COST
        ================================================== */}

        <div>

          <label className="font-bold text-gray-300">

            تكلفة إضافية

          </label>

          <input

            type="number"

            value={
              form.additionalCost || 0
            }

            onChange={(e) =>

              update(
                'additionalCost',
                e.target.value
              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>


        {/* ==================================================
            WAREHOUSE PRICE
        ================================================== */}

        <div>

          <label className="font-bold text-gray-300">

            سعر المنتج في المخزن

          </label>

          <input

            type="number"

            value={
              originalPrice
            }

            readOnly

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-gray-300
              text-black
              font-bold
              cursor-not-allowed
            "

          />

        </div>


        {/* ==================================================
            OFFER PRICE
        ================================================== */}

        <div>

          <label className="font-bold text-yellow-400">

            سعر العرض

          </label>

          <input

            type="number"

            min="0"

            max={
              originalPrice > 0
                ? originalPrice - 0.01
                : undefined
            }

            value={
              form.offerPrice ?? originalPrice
            }

            onChange={(e) => {

              const value =
                e.target.value === ''
                  ? 0
                  : Number(e.target.value)

              setForm(prev => ({

                ...prev,

                offerPrice:
                  value,

                // Keep salePrice synchronized
                // for older UI code, but the offer
                // logic uses offerPrice.
                salePrice:
                  value,

                discountPrice:
                  value

              }))

            }}

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-yellow-50
              text-black
              font-black
              text-xl
              border-2
              border-yellow-500
              focus:outline-none
              focus:ring-2
              focus:ring-yellow-400
            "

          />

          {

            originalPrice > 0 &&
            offerPrice > 0 &&
            offerPrice >= originalPrice && (

              <div className="text-red-400 font-bold mt-2">

                يجب أن يكون سعر العرض أقل من سعر المنتج
                في المخزن.

              </div>

            )

          }

          {

            originalPrice > 0 &&
            offerPrice > 0 &&
            offerPrice < originalPrice && (

              <div className="text-green-400 font-bold mt-2">

                ✓ سعر العرض أقل من سعر المخزن

              </div>

            )

          }

        </div>


        {/* ==================================================
            DISCOUNT PRICE
        ================================================== */}

        <div>

          <label className="font-bold text-gray-300">

            سعر الخصم

          </label>

          <input

            type="number"

            value={
              form.discountPrice ?? offerPrice
            }

            onChange={(e) =>

              update(
                'discountPrice',
                e.target.value
              )

            }

            className="
              w-full
              mt-2
              p-4
              rounded-2xl
              bg-white
              text-black
              font-bold
            "

          />

        </div>

      </div>


      {/* ==================================================
          CALCULATIONS
      ================================================== */}

      <div

        className="
          grid
          md:grid-cols-3
          gap-5
        "

      >

        {/* ==================================================
            TOTAL COST
        ================================================== */}

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            إجمالي التكلفة

          </div>

          <div className="text-3xl font-black text-yellow-400">

            {totalCost.toFixed(2)}

          </div>

        </div>


        {/* ==================================================
            PROFIT
        ================================================== */}

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            الربح من العرض

          </div>

          <div

            className="
              text-3xl
              font-black
              text-green-400
            "

          >

            {profit.toFixed(2)}

          </div>

        </div>


        {/* ==================================================
            PROFIT MARGIN
        ================================================== */}

        <div

          className="
            bg-slate-800
            rounded-2xl
            p-5
          "

        >

          <div className="text-gray-400">

            هامش الربح

          </div>

          <div

            className="
              text-3xl
              font-black
              text-cyan-400
            "

          >

            {profitMargin.toFixed(1)}%

          </div>

        </div>

      </div>

    </div>

  )

}