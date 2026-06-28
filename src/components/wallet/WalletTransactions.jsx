export default function WalletTransactions({

  transactions = [],

  selectedCustomer,

  onClose

}) {

  // ================= HELPERS =================

  const getTypeStyle = (
    type
  ) => {

    // CASHBACK

    if (
      type === 'cashback'
    ) {

      return {

        bg: 'bg-yellow-500/20',

        border:
          'border-yellow-500/40',

        text:
          'text-yellow-400',

        label:
          '🎁 مكافأة'

      }

    }

    // ADD

    if (
      type === 'manual_add'
    ) {

      return {

        bg: 'bg-green-500/20',

        border:
          'border-green-500/40',

        text:
          'text-green-400',

        label:
          '➕ إضافة'

      }

    }

    // DEDUCT

    return {

      bg: 'bg-red-500/20',

      border:
        'border-red-500/40',

      text:
        'text-red-400',

      label:
        '➖ خصم'

    }

  }

  // ================= FILTER =================

  const customerTransactions =
    selectedCustomer

      ? transactions.filter(

          (transaction) =>

            transaction.customerId ===
            selectedCustomer.id

        )

      : []

  // ================= HIDE =================

  if (!selectedCustomer)
    return null

  // ================= UI =================

  return (

    <div className="
      fixed
      inset-0
      z-50
      bg-black/80
      backdrop-blur-md
      overflow-y-auto
      p-4
    ">

      <div className="
        max-w-5xl
        mx-auto
        mt-10
        bg-slate-900
        border
        border-slate-700
        rounded-[40px]
        shadow-2xl
        overflow-hidden
      ">

        {/* HEADER */}

        <div className="
          bg-gradient-to-r
          from-blue-950
          via-blue-700
          to-yellow-500
          p-8
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          ">

            <div>

              <h2 className="
                text-4xl
                font-black
                mb-3
              ">

                سجل عمليات المحفظة

              </h2>

              <div className="
                text-xl
                text-white/90
              ">

                {

                  selectedCustomer.customerName ||

                  selectedCustomer.name ||

                  'عميل'

                }

              </div>

            </div>

            <button

              type="button"

              onClick={onClose}

              className="
                bg-red-600
                hover:bg-red-700
                px-6
                py-4
                rounded-3xl
                text-xl
                font-black
                transition-all
              "
            >

              ✖ إغلاق

            </button>

          </div>

        </div>

        {/* CONTENT */}

        <div className="
          p-6
          lg:p-8
        ">

          {

            customerTransactions.length === 0 ? (

              <div className="
                bg-black/40
                border
                border-slate-700
                rounded-[35px]
                p-16
                text-center
              ">

                <div className="
                  text-7xl
                  mb-6
                ">

                  📭

                </div>

                <div className="
                  text-3xl
                  font-black
                  mb-4
                ">

                  لا توجد عمليات

                </div>

                <div className="
                  text-xl
                  text-gray-400
                ">

                  لم يتم تسجيل أي
                  حركة داخل المحفظة

                </div>

              </div>

            ) : (

              <div className="
                space-y-5
              ">

                {

                  customerTransactions.map(
                    (
                      transaction
                    ) => {

                      const style =
                        getTypeStyle(
                          transaction.type
                        )

                      return (

                        <div

                          key={
                            transaction.id
                          }

                          className={`
                            rounded-[35px]
                            border
                            p-6
                            shadow-xl

                            ${style.bg}

                            ${style.border}
                          `}
                        >

                          {/* TOP */}

                          <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            flex-wrap
                            mb-5
                          ">

                            {/* TYPE */}

                            <div className={`
                              px-5
                              py-2
                              rounded-2xl
                              text-lg
                              font-black

                              ${style.bg}

                              ${style.text}
                            `}>

                              {
                                style.label
                              }

                            </div>

                            {/* DATE */}

                            <div className="
                              text-gray-300
                              text-lg
                              font-bold
                            ">

                              {

                                transaction.createdAt

                                  ? new Date(
                                      transaction.createdAt
                                    ).toLocaleString()

                                  : ''

                              }

                            </div>

                          </div>

                          {/* BODY */}

                          <div className="
                            grid
                            grid-cols-1
                            lg:grid-cols-3
                            gap-5
                          ">

                            {/* AMOUNT */}

                            <div className="
                              bg-black/40
                              border
                              border-slate-700
                              rounded-3xl
                              p-5
                            ">

                              <div className="
                                text-gray-400
                                mb-3
                              ">

                                قيمة العملية

                              </div>

                              <div className={`
                                text-4xl
                                font-black

                                ${style.text}
                              `}>

                                {

                                  Number(
                                    transaction.amount || 0
                                  ).toLocaleString()

                                }

                              </div>

                              <div className="
                                text-gray-300
                                mt-2
                              ">

                                ج.م

                              </div>

                            </div>

                            {/* BALANCE */}

                            <div className="
                              bg-black/40
                              border
                              border-slate-700
                              rounded-3xl
                              p-5
                            ">

                              <div className="
                                text-gray-400
                                mb-3
                              ">

                                الرصيد بعد العملية

                              </div>

                              <div className="
                                text-4xl
                                font-black
                                text-green-400
                              ">

                                {

                                  Number(
                                    transaction.balanceAfter || 0
                                  ).toLocaleString()

                                }

                              </div>

                              <div className="
                                text-gray-300
                                mt-2
                              ">

                                ج.م

                              </div>

                            </div>

                            {/* NOTE */}

                            <div className="
                              bg-black/40
                              border
                              border-slate-700
                              rounded-3xl
                              p-5
                            ">

                              <div className="
                                text-gray-400
                                mb-3
                              ">

                                ملاحظات

                              </div>

                              <div className="
                                text-xl
                                font-bold
                                leading-loose
                              ">

                                {

                                  transaction.note ||

                                  'لا توجد ملاحظات'

                                }

                              </div>

                            </div>

                          </div>

                        </div>

                      )

                    }

                  )

                }

              </div>

            )

          }

        </div>

      </div>

    </div>

  )

}