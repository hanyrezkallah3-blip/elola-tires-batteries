import { useMemo, useState } from 'react'

export default function WalletUserCard({

  customer,

  onAddBalance,

  onDeductBalance,

  onOpenTransactions

}) {

  // ================= STATE =================

  const [amount, setAmount] =
    useState('')

  const [note, setNote] =
    useState('')

  // ================= DATA =================

  const walletBalance =
    Number(customer?.balance || 0)

  const totalCashback =
    Number(customer?.totalCashback || 0)

  const transactionsCount =
    Number(
      customer?.transactionsCount ||

      customer?.walletTransactions?.length ||

      0
    )

  const createdDate =
    customer?.createdAt

      ? new Date(
          customer.createdAt
        ).toLocaleDateString()

      : 'غير معروف'

  // ================= AI STATUS =================

  const walletStatus = useMemo(() => {

    if (walletBalance >= 10000) {

      return {

        label:
          'VIP',

        color:
          'bg-yellow-500 text-black',

        icon:
          '👑'

      }

    }

    if (walletBalance > 0) {

      return {

        label:
          'نشطة',

        color:
          'bg-green-600 text-white',

        icon:
          '✅'

      }

    }

    return {

      label:
        'فارغة',

      color:
        'bg-gray-700 text-white',

      icon:
        '⚪'

    }

  }, [walletBalance])

  // ================= HEALTH =================

  const healthColor = useMemo(() => {

    if (walletBalance >= 5000)
      return 'text-green-400'

    if (walletBalance >= 1000)
      return 'text-yellow-400'

    return 'text-red-400'

  }, [walletBalance])

  // ================= HANDLE ADD =================

  const handleAdd = () => {

    const value =
      Number(amount || 0)

    if (value <= 0) {

      alert(
        'أدخل مبلغ صحيح'
      )

      return

    }

    onAddBalance?.({

      phone:
        customer.phone,

      customerName:
        customer.customerName,

      amount: value,

      reason:
        note ||
        'إضافة رصيد',

      type:
        'manual_add'

    })

    setAmount('')
    setNote('')

  }

  // ================= HANDLE DEDUCT =================

  const handleDeduct = () => {

    const value =
      Number(amount || 0)

    if (value <= 0) {

      alert(
        'أدخل مبلغ صحيح'
      )

      return

    }

    if (
      value > walletBalance
    ) {

      alert(
        'الرصيد غير كافي'
      )

      return

    }

    onDeductBalance?.({

      phone:
        customer.phone,

      customerName:
        customer.customerName,

      amount: value,

      reason:
        note ||
        'خصم رصيد',

      type:
        'deduct'

    })

    setAmount('')
    setNote('')

  }

  // ================= UI =================

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700
      rounded-[38px]
      p-6
      shadow-2xl
      hover:border-yellow-500
      transition-all
      duration-300
      relative
      overflow-hidden
    ">

      {/* BG */}

      <div className="
        absolute
        -top-10
        -left-10
        text-[140px]
        opacity-5
        font-black
      ">

        💳

      </div>

      {/* HEADER */}

      <div className="
        relative
        z-10
        flex
        justify-between
        gap-4
        mb-7
        flex-wrap
      ">

        {/* USER */}

        <div>

          <h2 className="
            text-3xl
            font-black
            mb-2
          ">

            {
              customer.customerName ||

              customer.name ||

              'عميل'
            }

          </h2>

          <div className="
            text-gray-400
            text-lg
            mb-1
          ">

            📞
            {' '}
            {
              customer.phone ||

              'لا يوجد رقم'
            }

          </div>

          <div className="
            text-gray-500
            text-sm
          ">

            🗓 منذ:
            {' '}
            {createdDate}

          </div>

        </div>

        {/* STATUS */}

        <div className={`
          px-5
          py-3
          rounded-2xl
          font-black
          text-lg
          h-fit

          ${walletStatus.color}
        `}>

          {walletStatus.icon}
          {' '}
          {walletStatus.label}

        </div>

      </div>

      {/* BALANCE */}

      <div className="
        bg-black/40
        border
        border-slate-700
        rounded-[30px]
        p-6
        mb-6
      ">

        <div className="
          text-gray-400
          mb-3
        ">

          الرصيد الحالي

        </div>

        <div className={`
          text-5xl
          font-black
          mb-2

          ${healthColor}
        `}>

          {
            walletBalance.toLocaleString()
          }

        </div>

        <div className="
          text-gray-300
          text-lg
        ">

          جنيه مصري

        </div>

      </div>

      {/* STATS */}

      <div className="
        grid
        grid-cols-3
        gap-4
        mb-6
      ">

        {/* CASHBACK */}

        <div className="
          bg-yellow-500/10
          border
          border-yellow-500/30
          rounded-3xl
          p-4
          text-center
        ">

          <div className="
            text-4xl
            mb-2
          ">

            🎁

          </div>

          <div className="
            text-2xl
            font-black
            text-yellow-400
          ">

            {
              totalCashback.toLocaleString()
            }

          </div>

          <div className="
            text-gray-400
            text-sm
            mt-2
          ">

            كاش باك

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="
          bg-blue-500/10
          border
          border-blue-500/30
          rounded-3xl
          p-4
          text-center
        ">

          <div className="
            text-4xl
            mb-2
          ">

            📜

          </div>

          <div className="
            text-2xl
            font-black
            text-blue-400
          ">

            {
              transactionsCount.toLocaleString()
            }

          </div>

          <div className="
            text-gray-400
            text-sm
            mt-2
          ">

            العمليات

          </div>

        </div>

        {/* AI */}

        <div className="
          bg-purple-500/10
          border
          border-purple-500/30
          rounded-3xl
          p-4
          text-center
        ">

          <div className="
            text-4xl
            mb-2
          ">

            🤖

          </div>

          <div className="
            text-lg
            font-black
            text-purple-300
          ">

            {

              walletBalance > 5000

                ? 'عميل قوي'

                : walletBalance > 0

                  ? 'نشط'

                  : 'ضعيف'

            }

          </div>

          <div className="
            text-gray-400
            text-sm
            mt-2
          ">

            AI Status

          </div>

        </div>

      </div>

      {/* INPUTS */}

      <div className="
        space-y-4
        mb-6
      ">

        <input

          type="number"

          value={amount}

          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }

          placeholder="أدخل المبلغ"

          className="
            w-full
            p-4
            rounded-2xl
            bg-white
            text-black
            font-bold
            outline-none
          "
        />

        <input

          type="text"

          value={note}

          onChange={(e) =>
            setNote(
              e.target.value
            )
          }

          placeholder="ملاحظات العملية"

          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            border
            border-slate-700
            text-white
            outline-none
          "
        />

      </div>

      {/* BUTTONS */}

      <div className="
        grid
        grid-cols-3
        gap-4
      ">

        {/* ADD */}

        <button

          onClick={handleAdd}

          className="
            bg-green-600
            hover:bg-green-700
            py-4
            rounded-2xl
            font-black
            text-lg
            transition-all
          "
        >

          ➕ إضافة

        </button>

        {/* DEDUCT */}

        <button

          onClick={handleDeduct}

          className="
            bg-red-600
            hover:bg-red-700
            py-4
            rounded-2xl
            font-black
            text-lg
            transition-all
          "
        >

          ➖ خصم

        </button>

        {/* TRANSACTIONS */}

        <button

          onClick={() =>
            onOpenTransactions?.(
              customer
            )
          }

          className="
            bg-blue-600
            hover:bg-blue-700
            py-4
            rounded-2xl
            font-black
            text-lg
            transition-all
          "
        >

          📜 السجل

        </button>

      </div>

    </div>

  )

}