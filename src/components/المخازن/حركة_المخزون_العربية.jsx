import { useState, useMemo } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'

export default function StockMovementArabic() {

  // ================= STORE =================

  const stockItems =
    useInventoryStore((s) => s.stockItems || [])

  const warehouses =
    useInventoryStore((s) => s.warehouses || [])

  const increaseStock =
    useInventoryStore((s) => s.increaseStock)

  const decreaseStock =
    useInventoryStore((s) => s.decreaseStock)

  const transferStock =
    useInventoryStore((s) => s.transferStock)

  // ================= STATES =================

  const [نوع_الحركة, setنوع_الحركة] = useState('add')
  const [المنتج, setالمنتج] = useState('')
  const [المخزن_من, setالمخزن_من] = useState('')
  const [المخزن_الى, setالمخزن_الى] = useState('')
  const [الكمية, setالكمية] = useState(0)
  const [ملاحظة, setملاحظة] = useState('')

  // ================= تنفيذ الحركة =================

  const تنفيذ_الحركة = () => {

    if (!المنتج || !الكمية || Number(الكمية) <= 0) {
      alert('ادخل البيانات كاملة')
      return
    }

    const payload = {
      itemId: المنتج,
      quantity: Number(الكمية),
      note: ملاحظة
    }

    // ================= ADD =================

    if (نوع_الحركة === 'add') {
      increaseStock(payload)
    }

    // ================= DEDUCT =================

    if (نوع_الحركة === 'deduct') {
      decreaseStock(payload)
    }

    // ================= TRANSFER =================

    if (نوع_الحركة === 'transfer') {

      if (!المخزن_من || !المخزن_الى) {
        alert('اختر المخازن')
        return
      }

      if (المخزن_من === المخزن_الى) {
        alert('لا يمكن التحويل إلى نفس المخزن')
        return
      }

      transferStock({
        itemId: المنتج,
        fromWarehouseId: المخزن_من,
        toWarehouseId: المخزن_الى,
        quantity: Number(الكمية)
      })
    }

    setالكمية(0)
    setملاحظة('')
  }

  // ================= FILTER MOVEMENTS =================

  const الحركات_اليومية = useMemo(() => {

    return stockItems.filter(
      (item) => item.updatedAt
    )

  }, [stockItems])

  // ================= UI =================

  return (

    <div className="p-8 bg-black text-white min-h-screen space-y-10">

      {/* ================= HEADER ================= */}

      <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-500 p-10 rounded-3xl">

        <h1 className="text-5xl font-black">
          🔄 حركة المخزون
        </h1>

        <p className="text-xl mt-3">
          إدارة دخول وخروج وتحويل المخزون بنظام ERP عربي
        </p>

      </div>

      {/* ================= SELECT TYPE ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl space-y-4">

        <h2 className="text-2xl font-black text-yellow-400">
          اختر نوع الحركة
        </h2>

        <select
          className="w-full p-4 text-black rounded-2xl"
          value={نوع_الحركة}
          onChange={(e) => setنوع_الحركة(e.target.value)}
        >

          <option value="add">
            ➕ إضافة مخزون
          </option>

          <option value="deduct">
            ➖ خصم مخزون
          </option>

          <option value="transfer">
            🔁 تحويل بين المخازن
          </option>

        </select>

      </div>

      {/* ================= PRODUCT ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl space-y-4">

        <h2 className="text-xl font-black text-cyan-400">
          المنتج
        </h2>

        <select
          className="w-full p-4 text-black rounded-2xl"
          value={المنتج}
          onChange={(e) => setالمنتج(e.target.value)}
        >

          <option value="">
            اختر المنتج
          </option>

          {stockItems.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >
              {item.productName}
            </option>

          ))}

        </select>

      </div>

      {/* ================= WAREHOUSES ================= */}

      {نوع_الحركة === 'transfer' && (

        <div className="grid grid-cols-2 gap-4">

          <select
            className="p-4 text-black rounded-2xl"
            value={المخزن_من}
            onChange={(e) =>
              setالمخزن_من(e.target.value)
            }
          >

            <option value="">
              من مخزن
            </option>

            {warehouses.map((w) => (

              <option
                key={w.id}
                value={w.id}
              >
                {w.name}
              </option>

            ))}

          </select>

          <select
            className="p-4 text-black rounded-2xl"
            value={المخزن_الى}
            onChange={(e) =>
              setالمخزن_الى(e.target.value)
            }
          >

            <option value="">
              إلى مخزن
            </option>

            {warehouses.map((w) => (

              <option
                key={w.id}
                value={w.id}
              >
                {w.name}
              </option>

            ))}

          </select>

        </div>

      )}

      {/* ================= QUANTITY ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl">

        <h2 className="text-xl font-black text-green-400">
          الكمية
        </h2>

        <input
          type="number"
          min="1"
          className="w-full p-4 text-black rounded-2xl mt-3"
          value={الكمية}
          onChange={(e) =>
            setالكمية(e.target.value)
          }
        />

      </div>

      {/* ================= NOTE ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl">

        <h2 className="text-xl font-black text-purple-400">
          ملاحظة
        </h2>

        <input
          className="w-full p-4 text-black rounded-2xl mt-3"
          value={ملاحظة}
          onChange={(e) =>
            setملاحظة(e.target.value)
          }
        />

      </div>

      {/* ================= BUTTON ================= */}

      <button
        onClick={تنفيذ_الحركة}
        className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl text-2xl"
      >
        تنفيذ الحركة
      </button>

      {/* ================= HISTORY ================= */}

      <div className="bg-slate-900 p-6 rounded-3xl">

        <h2 className="text-3xl font-black text-red-400 mb-5">
          📜 سجل الحركات
        </h2>

        <div className="space-y-3">

          {الحركات_اليومية.length === 0 && (

            <div className="text-gray-400">
              لا توجد حركات
            </div>

          )}

          {الحركات_اليومية.map((item) => (

            <div
              key={item.id}
              className="bg-black p-4 rounded-2xl"
            >

              <div className="font-bold">
                {item.productName}
              </div>

              <div className="text-gray-400 mt-2">
                الكمية: {item.quantity}
              </div>

              <div className="text-yellow-400 mt-2">
                {item.type}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}