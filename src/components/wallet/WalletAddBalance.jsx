import { useState, useMemo } from 'react'

export default function WalletAddBalance({

  customer,
  onClose,
  onSubmit,
  operationType = 'add'

}) {

  // ================= GUARD =================

  if (!customer) return null

  // ================= STATES =================

  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const [selectedType, setSelectedType] = useState(
    operationType === 'deduct' ? 'deduct' : 'manual_add'
  )

  // ================= CURRENT BALANCE =================

  const currentBalance = useMemo(() => {

    return Number(
      customer?.balance ||
      customer?.walletBalance ||
      0
    )

  }, [customer])

  // ================= TYPE CONFIG =================

  const typeConfig = {

    manual_add: {
      label: '➕ إضافة رصيد',
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },

    cashback: {
      label: '🎁 مكافأة',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },

    deduct: {
      label: '➖ خصم رصيد',
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    }

  }

  // ================= HANDLER =================

  const handleSubmit = () => {

    const value = Number(amount || 0)

    if (value <= 0) {
      alert('⚠️ أدخل مبلغ صحيح')
      return
    }

    onSubmit?.({

      phone: customer?.phone,

      customerName:
        customer?.customerName ||
        customer?.name ||
        '',

      amount: value,

      type: selectedType,

      reason: note

    })

    setAmount('')
    setNote('')

    onClose?.()

  }

  const currentType = typeConfig[selectedType]

  // ================= UI =================

  return (

    <div className="
      fixed inset-0 z-50
      bg-black/80 backdrop-blur-md
      p-4 overflow-y-auto
    ">

      <div className="
        max-w-3xl mx-auto mt-10
        bg-slate-900
        border border-slate-700
        rounded-[40px]
        overflow-hidden
        shadow-2xl
      ">

        {/* HEADER */}

        <div className="
          bg-gradient-to-r
          from-green-700 via-emerald-600 to-yellow-500
          p-8
        ">

          <div className="flex justify-between flex-wrap gap-4">

            <div>

              <h2 className="text-4xl font-black mb-3">
                إدارة المحفظة
              </h2>

              <div className="text-xl text-white/90">
                {customer?.customerName || customer?.name || 'عميل'}
              </div>

            </div>

            <button
              onClick={onClose}
              className="
                bg-red-600 hover:bg-red-700
                px-6 py-4 rounded-3xl
                text-xl font-black
              "
            >
              ✖ إغلاق
            </button>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-6 lg:p-8 space-y-7">

          {/* BALANCE */}

          <div className="
            bg-black/40
            border border-green-500/30
            rounded-[35px]
            p-6
          ">

            <div className="text-gray-400 text-xl mb-3">
              الرصيد الحالي
            </div>

            <div className="text-5xl font-black text-green-400">
              {currentBalance.toLocaleString()}
              <span className="text-2xl mr-3">ج.م</span>
            </div>

          </div>

          {/* TYPE SWITCH */}

          <div className="grid grid-cols-3 gap-3">

            {Object.entries(typeConfig).map(([key, cfg]) => (

              <button

                key={key}

                onClick={() => setSelectedType(key)}

                className={`
                  p-4 rounded-2xl font-black
                  transition-all
                  ${
                    selectedType === key
                      ? cfg.bg + ' ' + cfg.color
                      : 'bg-slate-800 text-gray-300'
                  }
                `}
              >

                {cfg.label}

              </button>

            ))}

          </div>

          {/* AMOUNT */}

          <div>

            <label className="block text-2xl font-black mb-4">
              المبلغ
            </label>

            <input

              type="number"

              value={amount}

              onChange={(e) =>
                setAmount(e.target.value)
              }

              className="
                w-full p-5 rounded-3xl
                text-black text-2xl font-black
              "
              placeholder="أدخل المبلغ"
            />

          </div>

          {/* NOTE */}

          <div>

            <label className="block text-2xl font-black mb-4">
              ملاحظات
            </label>

            <textarea

              rows={4}

              value={note}

              onChange={(e) =>
                setNote(e.target.value)
              }

              className="
                w-full p-5 rounded-3xl
                text-black text-xl font-bold
                resize-none
              "

              placeholder="اكتب ملاحظة"
            />

          </div>

          {/* SUMMARY */}

          <div className="
            bg-black/40
            border border-slate-700
            rounded-[35px]
            p-6
          ">

            <div className="text-yellow-400 text-2xl font-black mb-5">
              ملخص العملية
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-slate-900 p-5 rounded-3xl">

                <div className="text-gray-400 mb-2">
                  النوع
                </div>

                <div className={`text-2xl font-black ${currentType.color}`}>
                  {currentType.label}
                </div>

              </div>

              <div className="bg-slate-900 p-5 rounded-3xl">

                <div className="text-gray-400 mb-2">
                  المبلغ
                </div>

                <div className="text-3xl font-black text-green-400">
                  {Number(amount || 0).toLocaleString()} ج.م
                </div>

              </div>

            </div>

          </div>

          {/* SUBMIT */}

          <button

            onClick={handleSubmit}

            className="
              w-full
              bg-green-600 hover:bg-green-700
              py-5 rounded-[35px]
              text-2xl font-black
              shadow-2xl
            "
          >

            💾 حفظ العملية

          </button>

        </div>

      </div>

    </div>

  )

}