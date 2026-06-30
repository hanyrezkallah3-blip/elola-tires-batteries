const resetOptions = [

  {
    id: 'orders',
    title: 'الطلبات',
    description: 'إعادة ضبط جميع الطلبات'
  },

  {
    id: 'inventory',
    title: 'المخزون',
    description: 'إعادة ضبط المخزون والحركات'
  },

  {
    id: 'wallets',
    title: 'المحافظ',
    description: 'إعادة ضبط المحافظ والمعاملات'
  },

  {
    id: 'reports',
    title: 'التقارير',
    description: 'إعادة إنشاء التقارير'
  },

  {
    id: 'system',
    title: 'إعادة ضبط كاملة',
    description: 'إعادة ضبط جميع بيانات النظام'
  }

]

export default function ResetCenter() {

  const handleReset = (option) => {

    alert(

      `سيتم تنفيذ إعادة ضبط: ${option.title}\n\n(سيتم ربطها بالنظام لاحقاً)`

    )

  }

  return (

    <div className="space-y-5">

      <h2 className="text-3xl font-black text-red-400">

        Reset Center

      </h2>

      <div className="grid gap-4">

        {

          resetOptions.map((option) => (

            <button

              key={option.id}

              type="button"

              onClick={() => handleReset(option)}

              className="
                bg-slate-900
                border
                border-slate-700
                rounded-3xl
                p-5
                text-right
                hover:border-red-500
                transition-all
              "

            >

              <div className="text-2xl font-black">

                {option.title}

              </div>

              <div className="text-gray-400 mt-2">

                {option.description}

              </div>

            </button>

          ))

        }

      </div>

    </div>

  )

}