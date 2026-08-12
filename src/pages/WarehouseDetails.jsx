import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useWarehouseStore } from '../store/warehouseStore'
import { useUserStore } from '../store/userStore'

export default function WarehouseDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  // ==================================================
  // USER
  // ==================================================

  const currentUser = useUserStore(
    state => state.currentUser
  )

  // ==================================================
  // WAREHOUSE STORE
  // ==================================================

  const warehouses = useWarehouseStore(
    state => state.warehouses || []
  )

  const processInventoryTransaction =
    useWarehouseStore(
      state =>
        state.processInventoryTransaction
    )

  // ==================================================
  // WAREHOUSE
  // ==================================================

  const warehouse = useMemo(() => {

    return (
      warehouses.find(
        item =>
          String(item.id) === String(id)
      ) || null
    )

  }, [warehouses, id])

  // ==================================================
  // ACCESS
  // ==================================================

  const isOwner =
    currentUser?.role === 'owner'

  const isWarehouseUser =
    currentUser?.role === 'warehouse'

  const hasAccess =
    isOwner ||
    (
      isWarehouseUser &&
      String(
        currentUser?.warehouseId || ''
      ) === String(id)
    )

  // ==================================================
  // TRANSACTION STATE
  // ==================================================

  const [
    transactionProductId,
    setTransactionProductId
  ] = useState('')

  const [
    transactionType,
    setTransactionType
  ] = useState('in')

  const [
    transactionQuantity,
    setTransactionQuantity
  ] = useState('')

  const [
    transactionNotes,
    setTransactionNotes
  ] = useState('')

  const [
    transactionError,
    setTransactionError
  ] = useState('')

  const [
    transactionSuccess,
    setTransactionSuccess
  ] = useState('')

  const [
    processingTransaction,
    setProcessingTransaction
  ] = useState(false)

  // ==================================================
  // REPORT STATE
  // ==================================================

  const [
    reportPeriod,
    setReportPeriod
  ] = useState('monthly')

  // ==================================================
  // PRODUCTS
  // ==================================================

  const products = useMemo(() => {

    return warehouse?.products || []

  }, [warehouse])

  // ==================================================
  // TOTAL QUANTITY
  // ==================================================

  const totalQuantity = useMemo(() => {

    return products.reduce(
      (sum, product) =>
        sum +
        Number(
          product.quantity || 0
        ),
      0
    )

  }, [products])

  // ==================================================
  // TOTAL VALUE
  // ==================================================

  const totalValue = useMemo(() => {

    return products.reduce(
      (sum, product) =>
        sum +
        (
          Number(
            product.quantity || 0
          ) *
          Number(
            product.purchasePrice || 0
          )
        ),
      0
    )

  }, [products])

  // ==================================================
  // TRANSACTIONS
  // ==================================================

  const transactions = useMemo(() => {

    return warehouse?.transactions || []

  }, [warehouse])

  // ==================================================
  // TOTAL IN
  // ==================================================

  const totalIn = useMemo(() => {

    return transactions
      .filter(
        transaction =>
          transaction.type === 'in'
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.quantity || 0
          ),
        0
      )

  }, [transactions])

  // ==================================================
  // TOTAL OUT
  // ==================================================

  const totalOut = useMemo(() => {

    return transactions
      .filter(
        transaction =>
          transaction.type === 'out'
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.quantity || 0
          ),
        0
      )

  }, [transactions])

  // ==================================================
  // CURRENT BALANCE
  // ==================================================

  const transactionBalance =
    totalIn - totalOut

  // ==================================================
  // REPORT RANGE
  // ==================================================

  const reportRange = useMemo(() => {

    const now = new Date()

    const start = new Date(now)

    if (reportPeriod === 'daily') {

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    if (reportPeriod === 'weekly') {

      const day =
        start.getDay()

      const diff =
        day === 0
          ? 6
          : day - 1

      start.setDate(
        start.getDate() - diff
      )

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    if (reportPeriod === 'monthly') {

      start.setDate(1)

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    if (reportPeriod === 'quarterly') {

      const quarterStartMonth =
        Math.floor(
          now.getMonth() / 3
        ) * 3

      start.setMonth(
        quarterStartMonth,
        1
      )

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    if (reportPeriod === 'half-yearly') {

      const halfStartMonth =
        now.getMonth() < 6
          ? 0
          : 6

      start.setMonth(
        halfStartMonth,
        1
      )

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    if (reportPeriod === 'yearly') {

      start.setMonth(
        0,
        1
      )

      start.setHours(
        0,
        0,
        0,
        0
      )

    }

    return {
      start,
      end: now
    }

  }, [reportPeriod])

  // ==================================================
  // REPORT TRANSACTIONS
  // ==================================================

  const reportTransactions = useMemo(() => {

    return transactions.filter(
      transaction => {

        if (!transaction.createdAt) {
          return false
        }

        const date =
          new Date(
            transaction.createdAt
          )

        return (
          date >= reportRange.start &&
          date <= reportRange.end
        )

      }
    )

  }, [
    transactions,
    reportRange
  ])

  // ==================================================
  // REPORT TOTALS
  // ==================================================

  const reportIn = useMemo(() => {

    return reportTransactions
      .filter(
        transaction =>
          transaction.type === 'in'
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.quantity || 0
          ),
        0
      )

  }, [reportTransactions])

  const reportOut = useMemo(() => {

    return reportTransactions
      .filter(
        transaction =>
          transaction.type === 'out'
      )
      .reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.quantity || 0
          ),
        0
      )

  }, [reportTransactions])

  const reportBalance =
    reportIn - reportOut

  // ==================================================
  // REPORT NAME
  // ==================================================

  const reportPeriodName = {

    daily: 'يومي',

    weekly: 'أسبوعي',

    monthly: 'شهري',

    quarterly: 'ربع سنوي',

    'half-yearly':
      'نصف سنوي',

    yearly: 'سنوي'

  }[reportPeriod]

  // ==================================================
  // TRANSACTION SUBMIT
  // ==================================================

  const submitTransaction = () => {

    setTransactionError('')
    setTransactionSuccess('')

    if (!transactionProductId) {

      setTransactionError(
        '⚠ يرجى اختيار المنتج'
      )

      return
    }

    const quantity =
      Number(
        transactionQuantity
      )

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {

      setTransactionError(
        '⚠ يرجى إدخال كمية صحيحة'
      )

      return
    }

    const product =
      products.find(
        item =>
          String(
            item.productId ||
            item.id
          ) ===
          String(
            transactionProductId
          )
      )

    if (!product) {

      setTransactionError(
        '⚠ المنتج غير موجود في المخزن'
      )

      return
    }

    const currentQuantity =
      Number(
        product.quantity || 0
      )

    if (
      transactionType === 'out' &&
      quantity > currentQuantity
    ) {

      setTransactionError(
        '⚠ الكمية المطلوبة أكبر من المخزون المتاح'
      )

      return
    }

    setProcessingTransaction(true)

    try {

      const unitPrice =
        transactionType === 'in'
          ? Number(
              product.purchasePrice || 0
            )
          : Number(
              product.salePrice || 0
            )

      const result =
        processInventoryTransaction(
          id,
          transactionProductId,
          transactionType,
          quantity,
          {
            unitPrice,

            purchasePrice:
              Number(
                product.purchasePrice || 0
              ),

            salePrice:
              Number(
                product.salePrice || 0
              ),

            userId:
              currentUser?.id || '',

            userName:
              currentUser?.name ||
              currentUser?.username ||
              currentUser?.email ||
              '',

            notes:
              transactionNotes.trim(),

            source:
              'warehouse_details'
          }
        )

      if (!result?.success) {

        setTransactionError(
          `⚠ ${
            result?.message ||
            'فشل تسجيل الحركة'
          }`
        )

        return
      }

      setTransactionSuccess(
        transactionType === 'in'
          ? `✅ تم تسجيل الوارد بنجاح. الكمية الجديدة: ${result.newQuantity}`
          : `✅ تم تسجيل الصادر بنجاح. الكمية الجديدة: ${result.newQuantity}`
      )

      setTransactionQuantity('')

      setTransactionNotes('')

      setTransactionProductId('')

    } catch (error) {

      console.error(
        'Inventory Transaction Error:',
        error
      )

      setTransactionError(
        '⚠ حدث خطأ أثناء تسجيل الحركة'
      )

    } finally {

      setProcessingTransaction(false)

    }

  }

  // ==================================================
  // PRINT REPORT
  // ==================================================

  const printReport = () => {

    window.print()

  }

  // ==================================================
  // INVALID WAREHOUSE
  // ==================================================

  if (!warehouse) {

    return (

      <div className="
        min-h-screen
        bg-slate-950
        text-white
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          max-w-xl
          w-full
          bg-slate-900
          rounded-3xl
          p-8
          text-center
          border
          border-red-500/30
        ">

          <div className="
            text-6xl
            mb-6
          ">
            ⚠️
          </div>

          <h1 className="
            text-3xl
            font-black
            text-red-400
            mb-4
          ">
            المخزن غير موجود
          </h1>

          <p className="
            text-gray-400
            mb-8
          ">
            لم يتم العثور على المخزن المطلوب.
          </p>

          <button
            onClick={() =>
              navigate('/warehouses')
            }
            className="
              bg-yellow-500
              text-black
              px-8
              py-4
              rounded-2xl
              font-black
            "
          >
            العودة إلى المخازن
          </button>

        </div>

      </div>

    )

  }

  // ==================================================
  // ACCESS DENIED
  // ==================================================

  if (!hasAccess) {

    return (

      <div className="
        min-h-screen
        bg-slate-950
        text-white
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          max-w-xl
          w-full
          bg-slate-900
          rounded-3xl
          p-8
          text-center
          border
          border-red-500/30
        ">

          <div className="
            text-6xl
            mb-6
          ">
            🔒
          </div>

          <h1 className="
            text-3xl
            font-black
            text-red-400
            mb-4
          ">
            غير مسموح بالوصول
          </h1>

          <p className="
            text-gray-400
            mb-8
          ">
            لا تملك صلاحية الوصول إلى هذا المخزن.
          </p>

          <button
            onClick={() =>
              navigate(
                isWarehouseUser
                  ? '/warehouse-dashboard'
                  : '/warehouses'
              )
            }
            className="
              bg-yellow-500
              text-black
              px-8
              py-4
              rounded-2xl
              font-black
            "
          >
            العودة
          </button>

        </div>

      </div>

    )

  }

  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-4
      md:p-6
    ">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="
        bg-gradient-to-r
        from-blue-950
        via-blue-700
        to-yellow-500
        rounded-[40px]
        p-8
        mb-8
      ">

        <button
          onClick={() =>
            navigate(
              isWarehouseUser
                ? '/warehouse-dashboard'
                : '/warehouses'
            )
          }
          className="
            mb-6
            bg-black/40
            hover:bg-black/60
            px-5
            py-3
            rounded-2xl
            font-black
          "
        >
          ← العودة
        </button>

        <h1 className="
          text-4xl
          lg:text-5xl
          font-black
        ">
          {warehouse.name}
        </h1>

        <p className="
          mt-3
          font-bold
          text-lg
        ">
          إدارة وتشغيل المخزن
        </p>

      </div>

      {/* ==================================================
          BASIC INFORMATION
      ================================================== */}

      <div className="
        grid
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-8
      ">

        <InfoCard
          label="نوع المخزن"
          value={
            warehouse.type === 'main'
              ? 'مخزن رئيسي'
              : warehouse.type === 'branch'
                ? 'فرع'
                : warehouse.type === 'showroom'
                  ? 'معرض'
                  : warehouse.type === 'service'
                    ? 'مركز خدمة'
                    : warehouse.type ||
                      'مخزن'
          }
          valueClass="text-yellow-400"
        />

        <InfoCard
          label="الموقع"
          value={
            warehouse.location ||
            'غير محدد'
          }
        />

        <InfoCard
          label="المسؤول"
          value={
            warehouse.manager ||
            'غير محدد'
          }
        />

        <InfoCard
          label="الهاتف"
          value={
            warehouse.phone ||
            'غير محدد'
          }
        />

      </div>

      {/* ==================================================
          LOGIN INFORMATION
      ================================================== */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-6
        mb-8
        border
        border-yellow-500/40
      ">

        <h2 className="
          text-3xl
          font-black
          text-yellow-400
          mb-6
        ">
          🔐 بيانات دخول مسؤول المخزن
        </h2>

        <div className="
          grid
          md:grid-cols-2
          gap-6
        ">

          <InfoBox
            label="اسم المستخدم"
            value={
              warehouse.username ||
              'لم يتم تعيينه'
            }
          />

          <InfoBox
            label="كلمة المرور"
            value={
              warehouse.password ||
              'لم يتم تعيينها'
            }
          />

        </div>

      </div>

      {/* ==================================================
          STOCK SUMMARY
      ================================================== */}

      <div className="
        grid
        md:grid-cols-2
        xl:grid-cols-5
        gap-6
        mb-8
      ">

        <SummaryCard
          label="عدد المنتجات"
          value={products.length}
          className="text-blue-400"
          border="border-blue-500/30"
        />

        <SummaryCard
          label="الرصيد الحالي"
          value={totalQuantity}
          className="text-green-400"
          border="border-green-500/30"
        />

        <SummaryCard
          label="إجمالي الوارد"
          value={`+${totalIn}`}
          className="text-green-400"
          border="border-green-500/30"
        />

        <SummaryCard
          label="إجمالي الصادر"
          value={`-${totalOut}`}
          className="text-red-400"
          border="border-red-500/30"
        />

        <SummaryCard
          label="قيمة المخزون"
          value={`${totalValue.toLocaleString('ar-EG')} ج`}
          className="text-yellow-400"
          border="border-yellow-500/30"
        />

      </div>

      {/* ==================================================
          INVENTORY TRANSACTION
      ================================================== */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-6
        mb-8
        border
        border-blue-500/30
      ">

        <h2 className="
          text-3xl
          font-black
          text-yellow-400
          mb-6
        ">
          📦 تسجيل حركة مخزون
        </h2>

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-4
        ">

          <select
            value={transactionProductId}
            onChange={e => {

              setTransactionProductId(
                e.target.value
              )

              setTransactionError('')
              setTransactionSuccess('')

            }}
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              font-bold
              border
              border-slate-700
            "
          >

            <option value="">
              اختر المنتج
            </option>

            {products.map(product => {

              const productId =
                product.productId ||
                product.id

              return (

                <option
                  key={productId}
                  value={productId}
                >
                  {
                    product.productName ||
                    product.name ||
                    'منتج'
                  }

                  {' — '}

                  المخزون:

                  {' '}

                  {
                    Number(
                      product.quantity || 0
                    )
                  }

                </option>

              )

            })}

          </select>

          <select
            value={transactionType}
            onChange={e => {

              setTransactionType(
                e.target.value
              )

              setTransactionError('')
              setTransactionSuccess('')

            }}
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              font-bold
              border
              border-slate-700
            "
          >

            <option value="in">
              ⬆️ وارد
            </option>

            <option value="out">
              ⬇️ صادر
            </option>

          </select>

          <input
            type="number"
            min="1"
            value={transactionQuantity}
            onChange={e => {

              setTransactionQuantity(
                e.target.value
              )

              setTransactionError('')
              setTransactionSuccess('')

            }}
            placeholder={
              transactionType === 'in'
                ? 'كمية الوارد'
                : 'كمية المنصرف'
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              font-bold
              border
              border-slate-700
              placeholder:text-gray-400
            "
          />

          <input
            type="text"
            value={transactionNotes}
            onChange={e =>
              setTransactionNotes(
                e.target.value
              )
            }
            placeholder="ملاحظات الحركة"
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              font-bold
              border
              border-slate-700
              placeholder:text-gray-400
            "
          />

        </div>

        <div className="
          mt-5
          grid
          md:grid-cols-2
          gap-4
        ">

          <div className="
            bg-slate-800
            rounded-2xl
            p-4
            border
            border-slate-700
          ">

            <div className="
              text-gray-400
              text-sm
              font-bold
              mb-1
            ">
              نوع الحركة
            </div>

            <div className="
              text-xl
              font-black
            ">
              {transactionType === 'in'
                ? '⬆️ وارد'
                : '⬇️ صادر'}
            </div>

          </div>

          <div className="
            bg-slate-800
            rounded-2xl
            p-4
            border
            border-slate-700
          ">

            <div className="
              text-gray-400
              text-sm
              font-bold
              mb-1
            ">
              الرصيد المتوقع
            </div>

            <div className="
              text-xl
              font-black
              text-yellow-400
            ">

              {(() => {

                const product =
                  products.find(
                    item =>
                      String(
                        item.productId ||
                        item.id
                      ) ===
                      String(
                        transactionProductId
                      )
                  )

                const current =
                  Number(
                    product?.quantity || 0
                  )

                const amount =
                  Number(
                    transactionQuantity || 0
                  )

                return transactionType === 'in'
                  ? current + amount
                  : Math.max(
                      0,
                      current - amount
                    )

              })()}

            </div>

          </div>

        </div>

        {transactionError && (

          <div className="
            mt-4
            bg-red-900/50
            border
            border-red-500/40
            text-red-300
            p-4
            rounded-2xl
            font-bold
          ">
            {transactionError}
          </div>

        )}

        {transactionSuccess && (

          <div className="
            mt-4
            bg-green-900/50
            border
            border-green-500/40
            text-green-300
            p-4
            rounded-2xl
            font-bold
          ">
            {transactionSuccess}
          </div>

        )}

        <button
          onClick={submitTransaction}
          disabled={processingTransaction}
          className="
            w-full
            mt-5
            bg-yellow-500
            hover:bg-yellow-400
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-black
            p-4
            rounded-2xl
            font-black
            text-xl
          "
        >

          {processingTransaction
            ? '⏳ جاري تسجيل الحركة...'
            : transactionType === 'in'
              ? '⬆️ تسجيل وارد'
              : '⬇️ تسجيل صادر'}

        </button>

      </div>

      {/* ==================================================
          REPORTS
      ================================================== */}

      <div
        id="warehouse-report"
        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-8
          border
          border-yellow-500/30
        "
      >

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-6
        ">

          <div>

            <h2 className="
              text-3xl
              font-black
              text-yellow-400
            ">
              📊 التقرير المخزني{' '}
              {reportPeriodName}
            </h2>

            <div className="
              text-gray-400
              mt-2
            ">

              من{' '}

              {reportRange.start.toLocaleDateString(
                'ar-EG'
              )}

              {' إلى '}

              {reportRange.end.toLocaleDateString(
                'ar-EG'
              )}

            </div>

          </div>

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-3
          ">

            <select
              value={reportPeriod}
              onChange={e =>
                setReportPeriod(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                text-white
                p-4
                rounded-2xl
                font-black
                border
                border-slate-700
              "
            >

              <option value="daily">
                تقرير يومي
              </option>

              <option value="weekly">
                تقرير أسبوعي
              </option>

              <option value="monthly">
                تقرير شهري
              </option>

              <option value="quarterly">
                تقرير ربع سنوي
              </option>

              <option value="half-yearly">
                تقرير نصف سنوي
              </option>

              <option value="yearly">
                تقرير سنوي
              </option>

            </select>

            <button
              onClick={printReport}
              className="
                bg-blue-600
                hover:bg-blue-500
                px-6
                py-4
                rounded-2xl
                font-black
              "
            >
              🖨️ طباعة التقرير
            </button>

          </div>

        </div>

        {/* REPORT SUMMARY */}

        <div className="
          grid
          md:grid-cols-3
          gap-5
          mb-6
        ">

          <SummaryCard
            label="وارد الفترة"
            value={`+${reportIn}`}
            className="text-green-400"
            border="border-green-500/30"
          />

          <SummaryCard
            label="صادر الفترة"
            value={`-${reportOut}`}
            className="text-red-400"
            border="border-red-500/30"
          />

          <SummaryCard
            label="صافي حركة الفترة"
            value={reportBalance}
            className="text-yellow-400"
            border="border-yellow-500/30"
          />

        </div>

        {/* REPORT TABLE */}

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            text-right
            border-collapse
          ">

            <thead>

              <tr className="
                bg-slate-800
                text-yellow-400
              ">

                <th className="p-4">
                  التاريخ
                </th>

                <th className="p-4">
                  المنتج
                </th>

                <th className="p-4">
                  الحركة
                </th>

                <th className="p-4">
                  الكمية
                </th>

                <th className="p-4">
                  قبل
                </th>

                <th className="p-4">
                  بعد
                </th>

                <th className="p-4">
                  المستخدم
                </th>

              </tr>

            </thead>

            <tbody>

              {reportTransactions.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="
                      p-8
                      text-center
                      text-gray-400
                      font-bold
                    "
                  >
                    لا توجد حركات خلال هذه الفترة.
                  </td>

                </tr>

              ) : (

                [...reportTransactions]
                  .reverse()
                  .map(transaction => (

                    <tr
                      key={transaction.id}
                      className="
                        border-b
                        border-slate-800
                      "
                    >

                      <td className="p-4">

                        {transaction.createdAt
                          ? new Date(
                              transaction.createdAt
                            ).toLocaleString(
                              'ar-EG'
                            )
                          : '-'}

                      </td>

                      <td className="
                        p-4
                        font-bold
                      ">

                        {transaction.productName ||
                          'منتج'}

                      </td>

                      <td className="p-4">

                        <span
                          className={
                            transaction.type === 'in'
                              ? 'text-green-400 font-black'
                              : 'text-red-400 font-black'
                          }
                        >

                          {transaction.type === 'in'
                            ? '⬆️ وارد'
                            : '⬇️ صادر'}

                        </span>

                      </td>

                      <td className="
                        p-4
                        font-black
                      ">
                        {transaction.quantity || 0}
                      </td>

                      <td className="
                        p-4
                        text-yellow-400
                        font-black
                      ">
                        {
                          Number(
                            transaction.beforeQuantity ||
                            0
                          )
                        }
                      </td>

                      <td className="
                        p-4
                        text-green-400
                        font-black
                      ">
                        {
                          Number(
                            transaction.afterQuantity ||
                            0
                          )
                        }
                      </td>

                      <td className="
                        p-4
                        font-bold
                      ">
                        {
                          transaction.userName ||
                          transaction.userId ||
                          'غير محدد'
                        }
                      </td>

                    </tr>

                  ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-6
        border
        border-slate-700
        mb-8
      ">

        <h2 className="
          text-3xl
          font-black
          text-yellow-400
          mb-6
        ">
          📦 منتجات المخزن
        </h2>

        {!products.length ? (

          <div className="
            text-center
            py-12
            text-gray-400
            font-bold
          ">
            لا توجد منتجات في هذا المخزن حتى الآن.
          </div>

        ) : (

          <div className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">

            {products.map(product => {

              const quantity =
                Number(
                  product.quantity || 0
                )

              const incoming =
                Number(
                  product.incoming || 0
                )

              const outgoing =
                Number(
                  product.outgoing || 0
                )

              const availableQuantity =
                Number(
                  product.availableQuantity ??
                  quantity
                )

              return (

                <div
                  key={
                    product.productId ||
                    product.id
                  }
                  className="
                    bg-slate-800
                    rounded-2xl
                    p-5
                    border
                    border-slate-700
                  "
                >

                  <div className="
                    text-xl
                    font-black
                    text-white
                    mb-4
                  ">
                    {
                      product.productName ||
                      product.name ||
                      'منتج'
                    }
                  </div>

                  <div className="
                    grid
                    grid-cols-2
                    gap-3
                  ">

                    <StockBox
                      label="الرصيد الحالي"
                      value={quantity}
                      className="text-white"
                    />

                    <StockBox
                      label="⬆️ الوارد"
                      value={incoming}
                      className="text-green-400"
                    />

                    <StockBox
                      label="⬇️ المنصرف"
                      value={outgoing}
                      className="text-red-400"
                    />

                    <StockBox
                      label="المتاح"
                      value={availableQuantity}
                      className="text-blue-400"
                    />

                  </div>

                  <div className="
                    grid
                    grid-cols-2
                    gap-3
                    mt-4
                  ">

                    <InfoBox
                      label="سعر الشراء"
                      value={`${Number(
                        product.purchasePrice || 0
                      )} ج`}
                      valueClass="text-yellow-400"
                    />

                    <InfoBox
                      label="سعر البيع"
                      value={`${Number(
                        product.salePrice || 0
                      )} ج`}
                      valueClass="text-green-400"
                    />

                  </div>

                  <div className="
                    mt-4
                    grid
                    md:grid-cols-3
                    gap-3
                    text-sm
                    text-gray-300
                  ">

                    {product.brand && (

                      <div>

                        العلامة:

                        <span className="
                          font-bold
                          mr-2
                        ">
                          {product.brand}
                        </span>

                      </div>

                    )}

                    {product.barcode && (

                      <div>

                        الباركود:

                        <span className="
                          font-bold
                          mr-2
                        ">
                          {product.barcode}
                        </span>

                      </div>

                    )}

                    {product.unit && (

                      <div>

                        الوحدة:

                        <span className="
                          font-bold
                          mr-2
                        ">
                          {product.unit}
                        </span>

                      </div>

                    )}

                  </div>

                </div>

              )

            })}

          </div>

        )}

      </div>

      {/* ==================================================
          TRANSACTION HISTORY
      ================================================== */}

      <div className="
        bg-slate-900
        rounded-3xl
        p-6
        border
        border-slate-700
        mb-8
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-6
        ">

          <h2 className="
            text-3xl
            font-black
            text-yellow-400
          ">
            📋 سجل حركات المخزن
          </h2>

          <div className="
            text-gray-400
            font-bold
          ">
            صافي الحركة:
            <span className="
              text-yellow-400
              mr-2
            ">
              {transactionBalance}
            </span>
          </div>

        </div>

        {!transactions.length ? (

          <div className="
            text-center
            py-10
            text-gray-400
            font-bold
          ">
            لا توجد حركات مسجلة حتى الآن.
          </div>

        ) : (

          <div className="space-y-4">

            {[...transactions]
              .reverse()
              .map(transaction => {

                const quantity =
                  Number(
                    transaction.quantity || 0
                  )

                const beforeQuantity =
                  Number(
                    transaction.beforeQuantity || 0
                  )

                const afterQuantity =
                  Number(
                    transaction.afterQuantity || 0
                  )

                const unitPrice =
                  Number(
                    transaction.unitPrice || 0
                  )

                const totalValue =
                  Number(
                    transaction.totalValue ??
                    quantity * unitPrice
                  )

                return (

                  <div
                    key={transaction.id}
                    className="
                      bg-slate-800
                      rounded-2xl
                      p-5
                      border
                      border-slate-700
                    "
                  >

                    {/* TRANSACTION HEADER */}

                    <div className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-4
                      mb-5
                    ">

                      <div>

                        <div className="
                          text-xl
                          font-black
                          text-white
                        ">
                          {
                            transaction.productName ||
                            'منتج'
                          }
                        </div>

                        <div className="
                          text-gray-400
                          text-sm
                          mt-1
                        ">

                          {transaction.createdAt
                            ? new Date(
                                transaction.createdAt
                              ).toLocaleString(
                                'ar-EG'
                              )
                            : 'بدون تاريخ'}

                        </div>

                      </div>

                      <span
                        className={
                          transaction.type === 'in'
                            ? `
                              px-5
                              py-2
                              rounded-full
                              font-black
                              bg-green-900/50
                              text-green-400
                              text-lg
                            `
                            : `
                              px-5
                              py-2
                              rounded-full
                              font-black
                              bg-red-900/50
                              text-red-400
                              text-lg
                            `
                        }
                      >

                        {transaction.type === 'in'
                          ? '⬆️ وارد'
                          : '⬇️ صادر'}

                      </span>

                    </div>

                    {/* TRANSACTION DATA */}

                    <div className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      xl:grid-cols-4
                      gap-4
                    ">

                      <TransactionBox
                        label="الكمية"
                        value={quantity}
                      />

                      <TransactionBox
                        label="الرصيد قبل الحركة"
                        value={beforeQuantity}
                        valueClass="text-yellow-400"
                      />

                      <TransactionBox
                        label="الرصيد بعد الحركة"
                        value={afterQuantity}
                        valueClass="text-green-400"
                      />

                      <TransactionBox
                        label="سعر الوحدة"
                        value={`${unitPrice} ج`}
                        valueClass="text-blue-400"
                      />

                      <TransactionBox
                        label="قيمة الحركة"
                        value={`${totalValue} ج`}
                        valueClass="text-yellow-400"
                      />

                      <TransactionBox
                        label="سعر الشراء"
                        value={`${Number(
                          transaction.purchasePrice || 0
                        )} ج`}
                      />

                      <TransactionBox
                        label="سعر البيع"
                        value={`${Number(
                          transaction.salePrice || 0
                        )} ج`}
                        valueClass="text-green-400"
                      />

                      <TransactionBox
                        label="المستخدم"
                        value={
                          transaction.userName ||
                          transaction.userId ||
                          'غير محدد'
                        }
                      />

                    </div>

                    {/* EXTRA INFORMATION */}

                    {(
                      transaction.notes ||
                      transaction.reference ||
                      transaction.source
                    ) && (

                      <div className="
                        mt-4
                        bg-slate-900
                        rounded-2xl
                        p-4
                        space-y-2
                      ">

                        {transaction.notes && (

                          <div className="
                            text-gray-300
                          ">

                            <span className="
                              font-black
                              text-yellow-400
                            ">
                              ملاحظات:
                            </span>

                            <span className="
                              mr-2
                            ">
                              {transaction.notes}
                            </span>

                          </div>

                        )}

                        {transaction.reference && (

                          <div className="
                            text-gray-300
                          ">

                            <span className="
                              font-black
                              text-yellow-400
                            ">
                              المرجع:
                            </span>

                            <span className="
                              mr-2
                            ">
                              {transaction.reference}
                            </span>

                          </div>

                        )}

                        {transaction.source && (

                          <div className="
                            text-gray-400
                            text-sm
                          ">

                            مصدر الحركة:

                            <span className="
                              mr-2
                            ">
                              {transaction.source}
                            </span>

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                )

              })}

          </div>

        )}

      </div>

    </div>

  )
}


// ==================================================
// INFO CARD
// ==================================================

function InfoCard({
  label,
  value,
  valueClass = 'text-white'
}) {

  return (

    <div className="
      bg-slate-900
      rounded-3xl
      p-6
      border
      border-slate-700
    ">

      <div className="
        text-gray-400
        mb-2
      ">
        {label}
      </div>

      <div className={`
        text-2xl
        font-black
        ${valueClass}
      `}>
        {value}
      </div>

    </div>

  )
}


// ==================================================
// INFO BOX
// ==================================================

function InfoBox({
  label,
  value,
  valueClass = 'text-white'
}) {

  return (

    <div className="
      bg-slate-900
      rounded-2xl
      p-4
    ">

      <div className="
        text-gray-400
        text-sm
        mb-1
      ">
        {label}
      </div>

      <div className={`
        text-xl
        font-black
        break-words
        ${valueClass}
      `}>
        {value}
      </div>

    </div>

  )
}


// ==================================================
// SUMMARY CARD
// ==================================================

function SummaryCard({
  label,
  value,
  className,
  border
}) {

  return (

    <div className={`
      bg-slate-900
      rounded-3xl
      p-6
      border
      ${border}
    `}>

      <div className="
        text-gray-400
        mb-2
      ">
        {label}
      </div>

      <div className={`
        text-4xl
        font-black
        ${className}
      `}>
        {value}
      </div>

    </div>

  )
}


// ==================================================
// STOCK BOX
// ==================================================

function StockBox({
  label,
  value,
  className = 'text-white'
}) {

  return (

    <div className="
      bg-slate-900
      rounded-xl
      p-4
      border
      border-slate-700
    ">

      <div className="
        text-gray-400
        text-sm
        font-bold
        mb-1
      ">
        {label}
      </div>

      <div className={`
        text-2xl
        font-black
        ${className}
      `}>
        {value}
      </div>

    </div>

  )
}


// ==================================================
// TRANSACTION BOX
// ==================================================

function TransactionBox({
  label,
  value,
  valueClass = 'text-white'
}) {

  return (

    <div className="
      bg-slate-900
      rounded-2xl
      p-4
    ">

      <div className="
        text-gray-400
        text-sm
        mb-1
      ">
        {label}
      </div>

      <div className={`
        text-xl
        font-black
        break-words
        ${valueClass}
      `}>
        {value}
      </div>

    </div>

  )
}
