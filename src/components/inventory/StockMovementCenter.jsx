import { useMemo, useState } from 'react'
import { useInventoryStore } from '../../store/inventoryStore'

export default function StockMovementCenter() {

  // ================= STORE =================

  const stockMovements =
    useInventoryStore(
      (s) => s.stockMovements
    )

  const warehouses =
    useInventoryStore(
      (s) => s.warehouses
    )

  const stockItems =
    useInventoryStore(
      (s) => s.stockItems
    )

  // ================= STATES =================

  const [filterType, setFilterType] =
    useState('all')

  const [search, setSearch] =
    useState('')

  const [warehouseFilter, setWarehouseFilter] =
    useState('all')

  // ================= FILTERED DATA =================

  const filteredMovements = useMemo(() => {

    let data =
      [...stockMovements]

    // ================= SEARCH =================

    if (search.trim()) {

      data = data.filter((m) =>
        m.productName
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )

    }

    // ================= TYPE FILTER =================

    if (filterType !== 'all') {

      data = data.filter(
        (m) => m.type === filterType
      )

    }

    // ================= WAREHOUSE FILTER =================

    if (warehouseFilter !== 'all') {

      data = data.filter(
        (m) =>
          m.warehouseId === warehouseFilter
      )

    }

    return data

  }, [
    stockMovements,
    search,
    filterType,
    warehouseFilter
  ])

  // ================= ANALYTICS =================

  const analytics = useMemo(() => {

    const total = stockMovements.length

    const additions =
      stockMovements.filter(
        (m) => m.type === 'add'
      ).length

    const deductions =
      stockMovements.filter(
        (m) => m.type === 'deduct'
      ).length

    const transfers =
      stockMovements.filter(
        (m) => m.type === 'transfer'
      ).length

    // most active product

    const productCount = {}

    stockMovements.forEach((m) => {

      productCount[m.productName] =
        (productCount[m.productName] || 0) + 1

    })

    const mostActiveProduct =
      Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])[0]

    return {

      total,
      additions,
      deductions,
      transfers,
      mostActiveProduct:
        mostActiveProduct
          ? mostActiveProduct[0]
          : 'لا يوجد'

    }

  }, [stockMovements])

  // ================= UI =================

  return (

    <div className="p-8 text-white space-y-8">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-900 via-purple-800 to-yellow-500 p-8 rounded-3xl">

        <h1 className="text-4xl font-black">
          📦 مركز حركة المخزون
        </h1>

        <p className="mt-2 text-xl">
          متابعة كاملة لكل حركة داخل النظام
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-slate-900 p-5 rounded-2xl text-center">
          <div>📊 إجمالي الحركات</div>
          <div className="text-3xl font-black">
            {analytics.total}
          </div>
        </div>

        <div className="bg-green-700 p-5 rounded-2xl text-center">
          <div>➕ إضافات</div>
          <div className="text-3xl font-black">
            {analytics.additions}
          </div>
        </div>

        <div className="bg-red-700 p-5 rounded-2xl text-center">
          <div>➖ خصومات</div>
          <div className="text-3xl font-black">
            {analytics.deductions}
          </div>
        </div>

        <div className="bg-yellow-500 text-black p-5 rounded-2xl text-center">
          <div>🔁 تحويلات</div>
          <div className="text-3xl font-black">
            {analytics.transfers}
          </div>
        </div>

      </div>

      {/* AI INSIGHT */}

      <div className="bg-slate-900 p-6 rounded-2xl">

        <h2 className="text-2xl font-black text-cyan-400">
          🧠 تحليل ذكي
        </h2>

        <p className="mt-3 text-xl">

          أكثر منتج حركة:

          <span className="text-yellow-400 font-black">
            {' '}
            {analytics.mostActiveProduct}
          </span>

        </p>

      </div>

      {/* FILTERS */}

      <div className="flex flex-col md:flex-row gap-4">

        <input

          placeholder="🔍 بحث عن منتج"

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="p-4 rounded-2xl text-black flex-1"

        />

        <select

          value={filterType}

          onChange={(e) =>
            setFilterType(e.target.value)
          }

          className="p-4 rounded-2xl text-black"
        >

          <option value="all">الكل</option>
          <option value="add">إضافة</option>
          <option value="deduct">خصم</option>
          <option value="transfer">تحويل</option>

        </select>

        <select

          value={warehouseFilter}

          onChange={(e) =>
            setWarehouseFilter(e.target.value)
          }

          className="p-4 rounded-2xl text-black"
        >

          <option value="all">كل المخازن</option>

          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}

        </select>

      </div>

      {/* TIMELINE */}

      <div className="space-y-4">

        {filteredMovements.length === 0 && (
          <div className="text-gray-400 text-xl">
            لا توجد حركات
          </div>
        )}

        {filteredMovements.map((m) => (

          <div

            key={m.id}

            className="bg-slate-900 p-5 rounded-2xl border border-slate-700"
          >

            <div className="flex justify-between">

              <div>

                <div className="font-black text-xl">
                  {m.productName}
                </div>

                <div className="text-gray-400">
                  {m.note}
                </div>

              </div>

              <div className={`
                font-black text-xl
                ${
                  m.type === 'add'
                    ? 'text-green-400'
                    : m.type === 'deduct'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }
              `}>

                {m.type === 'add'
                  ? '➕'
                  : m.type === 'deduct'
                  ? '➖'
                  : '🔁'
                }

                {' '}
                {m.quantity}

              </div>

            </div>

            <div className="text-gray-500 mt-2 text-sm">

              {new Date(m.createdAt).toLocaleString()}

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}