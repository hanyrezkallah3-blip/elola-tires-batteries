import { useState } from 'react'

export default function WalletDeductBalance({
  customer,
  onClose,
  onSubmit
}) {

  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = () => {

    const value = Number(amount || 0)

    if (value <= 0) {
      alert('أدخل مبلغ صحيح')
      return
    }

    onSubmit({
      amount: value,
      note
    })

  }

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-slate-900 p-8 rounded-3xl w-[95%] md:w-[500px]">

        <h2 className="text-3xl font-black text-red-400 mb-6">
          ➖ خصم رصيد
        </h2>

        <p className="text-gray-400 mb-6">
          {customer?.customerName}
        </p>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="المبلغ"
          className="w-full p-4 rounded-2xl text-black mb-4"
        />

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ملاحظة"
          className="w-full p-4 rounded-2xl text-black mb-6"
        />

        <div className="flex gap-3">

          <button
            onClick={handleSubmit}
            className="bg-red-600 flex-1 py-3 rounded-2xl font-black"
          >
            تأكيد الخصم
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 flex-1 py-3 rounded-2xl font-black"
          >
            إغلاق
          </button>

        </div>

      </div>

    </div>

  )

}