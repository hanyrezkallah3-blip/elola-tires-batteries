import { useEffect, useMemo, useState } from 'react'

export default function CashbackSettings({

  cashbackPercentage = 0,
  setCashbackPercentage = () => {},

  walletEnabled = true,
  setWalletEnabled = () => {},

  wallets = []

}) {

  // ================= STATE =================

  const [value, setValue] = useState(0)

  // ================= SYNC =================

  useEffect(() => {
    setValue(Number(cashbackPercentage || 0))
  }, [cashbackPercentage])

  // ================= TOTALS =================

  const totalWalletBalance = useMemo(() => {

    return (wallets || []).reduce(
      (acc, wallet) =>
        acc + Number(wallet.balance || 0),
      0
    )

  }, [wallets])

  const activeWallets = useMemo(() => {

    return (wallets || []).filter(
      (wallet) => Number(wallet.balance || 0) > 0
    ).length

  }, [wallets])

  // ================= SAVE =================

  const handleSave = () => {

    const percent = Number(value || 0)

    if (percent < 0 || percent > 100) {
      alert('⚠️ النسبة يجب أن تكون بين 0 و 100')
      return
    }

    setCashbackPercentage(percent)

    alert('✅ تم حفظ إعدادات الكاش باك بنجاح')

  }

  // ================= TOGGLE =================

  const toggleWallet = () => {
    setWalletEnabled(!walletEnabled)
  }

  // ================= UI =================

  return (

    <div className="
      bg-slate-900
      border
      border-yellow-500
      rounded-[35px]
      p-8
      mb-10
      shadow-2xl
    ">

      {/* HEADER */}
      <div className="
        flex justify-between items-center flex-wrap gap-5 mb-10
      ">

        <div>

          <h2 className="
            text-4xl font-black text-yellow-400 mb-3
          ">
            إعدادات المحافظ والكاش باك
          </h2>

          <p className="text-gray-300 text-lg">
            التحكم الكامل في نظام المكافآت
          </p>

        </div>

        <div className="
          bg-yellow-500 text-black px-6 py-3 rounded-3xl
          text-3xl font-black
        ">
          {cashbackPercentage || 0}%
        </div>

      </div>

      {/* STATS */}
      <div className="
        grid grid-cols-1 md:grid-cols-3 gap-5 mb-10
      ">

        <div className="bg-black/40 border border-slate-700 rounded-3xl p-6">
          <div className="text-gray-400 mb-3">حالة النظام</div>
          <div className={`text-3xl font-black ${
            walletEnabled ? 'text-green-400' : 'text-red-400'
          }`}>
            {walletEnabled ? 'مفعل' : 'متوقف'}
          </div>
        </div>

        <div className="bg-black/40 border border-slate-700 rounded-3xl p-6">
          <div className="text-gray-400 mb-3">إجمالي الرصيد</div>
          <div className="text-3xl font-black text-cyan-400">
            {totalWalletBalance.toLocaleString()} ج.م
          </div>
        </div>

        <div className="bg-black/40 border border-slate-700 rounded-3xl p-6">
          <div className="text-gray-400 mb-3">محافظ نشطة</div>
          <div className="text-3xl font-black text-yellow-400">
            {activeWallets}
          </div>
        </div>

      </div>

      {/* SETTINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* CASHBACK */}
        <div className="bg-black/40 border border-slate-700 rounded-[35px] p-7 space-y-6">

          <h3 className="text-3xl font-black text-yellow-400">
            نسبة الكاش باك
          </h3>

          <input

            type="number"
            min="0"
            max="100"

            value={value}

            onChange={(e) =>
              setValue(Number(e.target.value))
            }

            className="
              w-full p-5 rounded-3xl text-black
              text-3xl font-black border-4 border-yellow-400
            "
          />

          <button

            onClick={handleSave}

            className="
              w-full bg-yellow-500 hover:bg-yellow-600
              text-black py-5 rounded-3xl text-2xl font-black
            "
          >
            💾 حفظ
          </button>

        </div>

        {/* TOGGLE */}
        <div className="bg-black/40 border border-slate-700 rounded-[35px] p-7 flex flex-col justify-between">

          <div>

            <h3 className="text-3xl font-black text-green-400 mb-3">
              تشغيل النظام
            </h3>

            <p className="text-gray-400 text-lg">
              تفعيل أو إيقاف نظام المحافظ بالكامل
            </p>

          </div>

          <button

            onClick={toggleWallet}

            className={`mt-8 w-full py-5 rounded-3xl text-2xl font-black ${
              walletEnabled
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >

            {walletEnabled ? '⛔ إيقاف' : '✅ تشغيل'}

          </button>

        </div>

      </div>

      {/* EXAMPLE */}
      <div className="mt-10 bg-black/40 border border-slate-700 rounded-[35px] p-7">

        <h3 className="text-2xl font-black text-cyan-400 mb-5">
          مثال حساب الكاش باك
        </h3>

        <p className="text-gray-300 text-xl leading-loose">

          شراء بـ
          <span className="text-yellow-400 font-black mx-2">10,000</span>

          ونسبة

          <span className="text-green-400 font-black mx-2">
            {value || 0}%
          </span>

          =

          <span className="text-cyan-400 font-black mx-2">
            {(10000 * Number(value || 0)) / 100}
          </span>

          ج.م

        </p>

      </div>

    </div>

  )

}