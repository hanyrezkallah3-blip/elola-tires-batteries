import {
  useMemo,
  useState
} from 'react'

import {
  useWarehouseStore
} from '../store/warehouseStore'

import {
  useUserStore
} from '../store/userStore'

import {
  useNavigate
} from 'react-router-dom'

import WarehouseProductForm
from '../components/warehouses/WarehouseProductForm'


export default function Warehouses() {

  const navigate = useNavigate()


  // ==================================================
  // USER
  // ==================================================

  const currentUser =
    useUserStore(
      state => state.currentUser
    )


  // ==================================================
  // STORE
  // ==================================================

  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )

  const addWarehouse =
    useWarehouseStore(
      state => state.addWarehouse
    )

  const updateWarehouse =
    useWarehouseStore(
      state => state.updateWarehouse
    )

  const deleteWarehouse =
    useWarehouseStore(
      state => state.deleteWarehouse
    )

  const addProductToWarehouse =
    useWarehouseStore(
      state => state.addProductToWarehouse
    )

  const processInventoryTransaction =
    useWarehouseStore(
      state => state.processInventoryTransaction
    )


  // ==================================================
  // SEARCH
  // ==================================================

  const [search, setSearch] =
    useState('')


  // ==================================================
  // CREATE WAREHOUSE FORM
  // ==================================================

  const [form, setForm] = useState({

    name: '',
    type: 'main',
    location: '',
    phone: '',
    manager: '',
    username: '',
    password: ''

  })


  // ==================================================
  // EDIT WAREHOUSE
  // ==================================================

  const [
    editingWarehouseId,
    setEditingWarehouseId
  ] = useState(null)

  const [editForm, setEditForm] =
    useState({

      name: '',
      type: 'main',
      location: '',
      phone: '',
      manager: '',
      username: '',
      password: ''

    })


  // ==================================================
  // PRODUCT FORM
  // ==================================================

  const [productForm, setProductForm] =
    useState({

      warehouseId: '',

      name: '',
      image: '',
      description: '',

      type: 'tire',

      category: '',
      brand: '',
      model: '',

      sku: '',
      barcode: '',

      quantity: 0,

      minimumStock: 0,
      maximumStock: 0,
      reorderPoint: 0,

      unit: 'piece',

      purchasePrice: 0,
      salePrice: 0,
      wholesalePrice: 0,

      shippingCost: 0,
      customsCost: 0,
      transportCost: 0,
      otherCosts: 0,

      supplierId: '',
      supplierName: '',

      countryOfOrigin: '',

      location: '',
      shelf: '',
      rack: '',
      bin: '',

      batchNumber: '',
      lotNumber: '',

      productionDate: '',
      expiryDate: '',

      warranty: '',

      serialNumbers: [],

      specifications: {},

      notes: '',

      publishToHome: true,
      publishToProducts: true,
      publishToOffers: false,

      featured: false,
      hidden: false

    })


  // ==================================================
  // INVENTORY TRANSACTION STATE
  // ==================================================

  const [
    transactionWarehouseId,
    setTransactionWarehouseId
  ] = useState('')

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
    reportWarehouseId,
    setReportWarehouseId
  ] = useState('all')


  // ==================================================
  // FILTERED WAREHOUSES
  // ==================================================

  const filteredWarehouses =
    useMemo(() => {

      if (!search.trim()) {

        return warehouses

      }

      const value =
        search
          .toLowerCase()
          .trim()


      return warehouses.filter(
        warehouse =>
          String(
            warehouse.name || ''
          )
            .toLowerCase()
            .includes(value)
      )

    }, [
      warehouses,
      search
    ])


  // ==================================================
  // SELECTED TRANSACTION WAREHOUSE
  // ==================================================

  const transactionWarehouse =
    useMemo(() => {

      return warehouses.find(
        warehouse =>
          String(warehouse.id) ===
          String(transactionWarehouseId)
      ) || null

    }, [
      warehouses,
      transactionWarehouseId
    ])


  // ==================================================
  // TRANSACTION PRODUCTS
  // ==================================================

  const transactionProducts =
    useMemo(() => {

      return (
        transactionWarehouse?.products ||
        []
      )

    }, [
      transactionWarehouse
    ])


  // ==================================================
  // SELECTED TRANSACTION PRODUCT
  // ==================================================

  const transactionProduct =
    useMemo(() => {

      return transactionProducts.find(
        product =>
          String(
            product.productId ||
            product.id
          ) ===
          String(transactionProductId)
      ) || null

    }, [
      transactionProducts,
      transactionProductId
    ])


  // ==================================================
  // REPORT TRANSACTIONS
  // ==================================================

  const reportTransactions =
    useMemo(() => {

      let result = []

      if (
        reportWarehouseId === 'all'
      ) {

        warehouses.forEach(
          warehouse => {

            result.push(
              ...(
                warehouse.transactions ||
                []
              ).map(
                transaction => ({
                  ...transaction,

                  warehouseId:
                    warehouse.id,

                  warehouseName:
                    warehouse.name ||
                    'مخزن'
                })
              )
            )

          }
        )

      } else {

        const warehouse =
          warehouses.find(
            item =>
              String(item.id) ===
              String(reportWarehouseId)
          )

        result = (
          warehouse?.transactions ||
          []
        ).map(
          transaction => ({
            ...transaction,

            warehouseId:
              warehouse.id,

            warehouseName:
              warehouse.name ||
              'مخزن'
          })
        )

      }

      return [...result].reverse()

    }, [
      warehouses,
      reportWarehouseId
    ])


  // ==================================================
  // REPORT TOTALS
  // ==================================================

  const reportIn =
    useMemo(() => {

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

    }, [
      reportTransactions
    ])


  const reportOut =
    useMemo(() => {

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

    }, [
      reportTransactions
    ])


  const reportBalance =
    reportIn - reportOut


  // ==================================================
  // CREATE WAREHOUSE
  // ==================================================

  const submitWarehouse = () => {

    if (!form.name.trim()) {

      return

    }

    addWarehouse({

      name:
        form.name.trim(),

      type:
        form.type,

      location:
        form.location.trim(),

      phone:
        form.phone.trim(),

      manager:
        form.manager.trim(),

      username:
        form.username.trim(),

      password:
        form.password.trim()

    })


    setForm({

      name: '',
      type: 'main',
      location: '',
      phone: '',
      manager: '',
      username: '',
      password: ''

    })

  }


  // ==================================================
  // START EDIT
  // ==================================================

  const startEditWarehouse = (
    warehouse
  ) => {

    setEditingWarehouseId(
      warehouse.id
    )


    setEditForm({

      name:
        warehouse.name || '',

      type:
        warehouse.type || 'main',

      location:
        warehouse.location || '',

      phone:
        warehouse.phone || '',

      manager:
        warehouse.manager || '',

      username:
        warehouse.username || '',

      password:
        warehouse.password || ''

    })

  }


  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const cancelEditWarehouse = () => {

    setEditingWarehouseId(null)

    setEditForm({

      name: '',
      type: 'main',
      location: '',
      phone: '',
      manager: '',
      username: '',
      password: ''

    })

  }


  // ==================================================
  // SAVE EDIT
  // ==================================================

  const saveEditWarehouse = () => {

    if (
      !editingWarehouseId ||
      !editForm.name.trim()
    ) {

      return

    }


    updateWarehouse(
      editingWarehouseId,
      {

        name:
          editForm.name.trim(),

        type:
          editForm.type,

        location:
          editForm.location.trim(),

        phone:
          editForm.phone.trim(),

        manager:
          editForm.manager.trim(),

        username:
          editForm.username.trim(),

        password:
          editForm.password.trim()

      }
    )


    cancelEditWarehouse()

  }


  // ==================================================
  // ADD PRODUCT
  // ==================================================

  const submitProduct = () => {

    if (
      !productForm.warehouseId ||
      !productForm.name.trim()
    ) {

      return

    }


    addProductToWarehouse(
      productForm.warehouseId,
      productForm
    )


    setProductForm({

      warehouseId: '',

      name: '',
      image: '',
      description: '',

      type: 'tire',

      category: '',
      brand: '',
      model: '',

      sku: '',
      barcode: '',

      quantity: 0,

      minimumStock: 0,
      maximumStock: 0,
      reorderPoint: 0,

      unit: 'piece',

      purchasePrice: 0,
      salePrice: 0,
      wholesalePrice: 0,

      shippingCost: 0,
      customsCost: 0,
      transportCost: 0,
      otherCosts: 0,

      supplierId: '',
      supplierName: '',

      countryOfOrigin: '',

      location: '',
      shelf: '',
      rack: '',
      bin: '',

      batchNumber: '',
      lotNumber: '',

      productionDate: '',
      expiryDate: '',

      warranty: '',

      serialNumbers: [],

      specifications: {},

      notes: '',

      publishToHome: true,
      publishToProducts: true,
      publishToOffers: false,

      featured: false,
      hidden: false

    })

  }


  // ==================================================
  // TRANSACTION SUBMIT
  // ==================================================

  const submitTransaction = () => {

    setTransactionError('')
    setTransactionSuccess('')


    if (!transactionWarehouseId) {

      setTransactionError(
        '⚠ يرجى اختيار المخزن'
      )

      return

    }


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


    if (!transactionProduct) {

      setTransactionError(
        '⚠ المنتج غير موجود في المخزن'
      )

      return

    }


    const currentQuantity =
      Number(
        transactionProduct.quantity ||
        0
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
              transactionProduct.purchasePrice ||
              0
            )
          : Number(
              transactionProduct.salePrice ||
              0
            )


      const result =
        processInventoryTransaction(

          transactionWarehouseId,

          transactionProductId,

          transactionType,

          quantity,

          {

            unitPrice,

            purchasePrice:
              Number(
                transactionProduct.purchasePrice ||
                0
              ),

            salePrice:
              Number(
                transactionProduct.salePrice ||
                0
              ),

            userId:
              currentUser?.id ||
              '',

            userName:
              currentUser?.name ||
              currentUser?.username ||
              currentUser?.email ||
              '',

            notes:
              transactionNotes.trim(),

            source:
              'warehouses'

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

          ? `✅ تم تسجيل الوارد بنجاح. الرصيد الجديد: ${result.newQuantity}`

          : `✅ تم تسجيل المنصرف بنجاح. الرصيد الجديد: ${result.newQuantity}`

      )


      setTransactionQuantity('')
      setTransactionNotes('')


    } catch (error) {

      console.error(
        'Warehouse Transaction Error:',
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
  // RENDER
  // ==================================================

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
        p-6
        lg:p-10
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-blue-950
          via-blue-700
          to-yellow-500
          rounded-[40px]
          p-8
          mb-10
        "
      >

        <h1
          className="
            text-5xl
            font-black
          "
        >
          إدارة المخازن
        </h1>


        <p
          className="
            text-lg
            mt-3
            font-bold
          "
        >
          إدارة المخازن والمنتجات والكميات
        </p>

      </div>


      {/* ==================================================
          CREATE WAREHOUSE
      ================================================== */}

      <div
        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
          space-y-5
        "
      >

        <h2
          className="
            text-3xl
            font-black
            text-yellow-400
          "
        >
          إنشاء مخزن جديد
        </h2>


        <input
          value={form.name}
          onChange={(e) =>
            setForm({

              ...form,

              name:
                e.target.value

            })
          }
          placeholder="اسم المخزن"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <select
          value={form.type}
          onChange={(e) =>
            setForm({

              ...form,

              type:
                e.target.value

            })
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
          "
        >

          <option value="main">
            مخزن رئيسي
          </option>

          <option value="branch">
            فرع
          </option>

          <option value="showroom">
            معرض
          </option>

          <option value="service">
            مركز خدمة
          </option>

        </select>


        <input
          value={form.location}
          onChange={(e) =>
            setForm({

              ...form,

              location:
                e.target.value

            })
          }
          placeholder="الموقع"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <input
          value={form.phone}
          onChange={(e) =>
            setForm({

              ...form,

              phone:
                e.target.value

            })
          }
          placeholder="رقم الهاتف"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <input
          value={form.manager}
          onChange={(e) =>
            setForm({

              ...form,

              manager:
                e.target.value

            })
          }
          placeholder="المسؤول"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <input
          value={form.username}
          onChange={(e) =>
            setForm({

              ...form,

              username:
                e.target.value

            })
          }
          placeholder="اسم مستخدم المخزن"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <input
          value={form.password}
          onChange={(e) =>
            setForm({

              ...form,

              password:
                e.target.value

            })
          }
          placeholder="كلمة مرور المخزن"
          type="text"
          className="
            w-full
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            placeholder:text-gray-400
          "
        />


        <button
          onClick={submitWarehouse}
          className="
            w-full
            bg-yellow-500
            hover:bg-yellow-400
            text-black
            p-4
            rounded-2xl
            font-black
            text-xl
          "
        >
          ➕ إضافة المخزن
        </button>

      </div>


      {/* ==================================================
          ADD PRODUCT
      ================================================== */}

      <WarehouseProductForm

        warehouses={warehouses}

        onSubmit={(product) => {

          addProductToWarehouse(
            product.warehouseId,
            product
          )

        }}

        onCancel={() => {}}

      />


      {/* ==================================================
          INVENTORY TRANSACTION
      ================================================== */}

      <div
        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
          border
          border-blue-500/30
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-3
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-yellow-400
              "
            >
              📦 تسجيل حركة مخزون
            </h2>

            <p
              className="
                text-gray-400
                mt-2
              "
            >
              تسجيل الوارد والمنصرف مباشرة من صفحة المخازن
            </p>

          </div>

        </div>


        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >

          {/* WAREHOUSE */}

          <select
            value={transactionWarehouseId}
            onChange={(e) => {

              setTransactionWarehouseId(
                e.target.value
              )

              setTransactionProductId('')

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
              اختر المخزن
            </option>

            {warehouses.map(
              warehouse => (

                <option
                  key={warehouse.id}
                  value={warehouse.id}
                >
                  {warehouse.name}
                </option>

              )
            )}

          </select>


          {/* PRODUCT */}

          <select
            value={transactionProductId}
            onChange={(e) => {

              setTransactionProductId(
                e.target.value
              )

              setTransactionError('')

              setTransactionSuccess('')

            }}
            disabled={
              !transactionWarehouseId
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
              disabled:opacity-50
            "
          >

            <option value="">
              اختر المنتج
            </option>

            {transactionProducts.map(
              product => {

                const productId =
                  product.productId ||
                  product.id

                return (

                  <option
                    key={productId}
                    value={productId}
                  >
                    {product.productName ||
                      product.name ||
                      'منتج'}
                    {' — '}
                    المخزون:
                    {' '}
                    {product.quantity || 0}
                  </option>

                )

              }
            )}

          </select>


          {/* TYPE */}

          <select
            value={transactionType}
            onChange={(e) => {

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


          {/* QUANTITY */}

          <input
            type="number"
            min="1"
            value={transactionQuantity}
            onChange={(e) => {

              setTransactionQuantity(
                e.target.value
              )

              setTransactionError('')

              setTransactionSuccess('')

            }}
            placeholder="الكمية"
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


        {/* PRODUCT INFO */}

        {transactionProduct && (

          <div
            className="
              mt-4
              bg-slate-800
              rounded-2xl
              p-5
              grid
              md:grid-cols-3
              gap-4
            "
          >

            <div>

              <div className="text-gray-400 text-sm">
                المنتج
              </div>

              <div className="font-black text-white">
                {transactionProduct.productName ||
                  transactionProduct.name ||
                  'منتج'}
              </div>

            </div>


            <div>

              <div className="text-gray-400 text-sm">
                الرصيد الحالي
              </div>

              <div className="font-black text-green-400 text-xl">
                {Number(
                  transactionProduct.quantity || 0
                )}
              </div>

            </div>


            <div>

              <div className="text-gray-400 text-sm">
                سعر الحركة
              </div>

              <div className="font-black text-yellow-400 text-xl">

                {transactionType === 'in'
                  ? Number(
                      transactionProduct.purchasePrice ||
                      0
                    )
                  : Number(
                      transactionProduct.salePrice ||
                      0
                    )}

                {' '}ج

              </div>

            </div>

          </div>

        )}


        {/* NOTES */}

        <textarea
          value={transactionNotes}
          onChange={(e) =>
            setTransactionNotes(
              e.target.value
            )
          }
          placeholder="ملاحظات الحركة — اختياري"
          rows="3"
          className="
            w-full
            mt-4
            p-4
            rounded-2xl
            bg-slate-800
            text-white
            font-bold
            border
            border-slate-700
            placeholder:text-gray-400
            resize-none
          "
        />


        {/* ERROR */}

        {transactionError && (

          <div
            className="
              mt-4
              bg-red-900/50
              border
              border-red-500/40
              text-red-300
              p-4
              rounded-2xl
              font-bold
            "
          >
            {transactionError}
          </div>

        )}


        {/* SUCCESS */}

        {transactionSuccess && (

          <div
            className="
              mt-4
              bg-green-900/50
              border
              border-green-500/40
              text-green-300
              p-4
              rounded-2xl
              font-bold
            "
          >
            {transactionSuccess}
          </div>

        )}


        {/* SUBMIT */}

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
          SEARCH
      ================================================== */}

      <div
        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
        "
      >

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="🔍 البحث عن مخزن"
          className="
            w-full
            p-4
            rounded-2xl
            text-black
            font-bold
          "
        />

      </div>


      {/* ==================================================
          WAREHOUSE REPORT
      ================================================== */}

      <div
        id="warehouse-report"
        className="
          bg-slate-900
          rounded-3xl
          p-6
          mb-10
          border
          border-yellow-500/30
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-4
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-yellow-400
              "
            >
              📊 تقرير حركات المخزون
            </h2>

            <p className="text-gray-400 mt-2">
              تقرير الوارد والمنصرف المسجل في المخازن
            </p>

          </div>


          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
          >

            <select
              value={reportWarehouseId}
              onChange={(e) =>
                setReportWarehouseId(
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

              <option value="all">
                جميع المخازن
              </option>

              {warehouses.map(
                warehouse => (

                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </option>

                )
              )}

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

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
            mb-6
          "
        >

          <div
            className="
              bg-slate-800
              rounded-2xl
              p-5
              border
              border-green-500/30
            "
          >

            <div className="text-gray-400">
              إجمالي الوارد
            </div>

            <div
              className="
                text-4xl
                font-black
                text-green-400
                mt-2
              "
            >
              +{reportIn}
            </div>

          </div>


          <div
            className="
              bg-slate-800
              rounded-2xl
              p-5
              border
              border-red-500/30
            "
          >

            <div className="text-gray-400">
              إجمالي المنصرف
            </div>

            <div
              className="
                text-4xl
                font-black
                text-red-400
                mt-2
              "
            >
              -{reportOut}
            </div>

          </div>


          <div
            className="
              bg-slate-800
              rounded-2xl
              p-5
              border
              border-yellow-500/30
            "
          >

            <div className="text-gray-400">
              صافي الحركة
            </div>

            <div
              className="
                text-4xl
                font-black
                text-yellow-400
                mt-2
              "
            >
              {reportBalance}
            </div>

          </div>

        </div>


        {/* REPORT TABLE */}

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              text-right
              border-collapse
            "
          >

            <thead>

              <tr
                className="
                  bg-slate-800
                  text-yellow-400
                "
              >

                <th className="p-4">
                  التاريخ
                </th>

                <th className="p-4">
                  المخزن
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
                    colSpan="8"
                    className="
                      p-8
                      text-center
                      text-gray-400
                      font-bold
                    "
                  >
                    لا توجد حركات مخزون حتى الآن.
                  </td>

                </tr>

              ) : (

                reportTransactions.map(
                  transaction => (

                    <tr
                      key={
                        transaction.id
                      }
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


                      <td className="p-4 font-bold">

                        {transaction.warehouseName ||
                          '-'}

                      </td>


                      <td className="p-4 font-bold">

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


                      <td className="p-4 font-black">

                        {transaction.quantity || 0}

                      </td>


                      <td className="p-4 text-yellow-400 font-bold">

                        {transaction.beforeQuantity ??
                          transaction.previousQuantity ??
                          0}

                      </td>


                      <td className="p-4 text-green-400 font-bold">

                        {transaction.afterQuantity ??
                          transaction.newQuantity ??
                          0}

                      </td>


                      <td className="p-4">

                        {transaction.userName ||
                          transaction.userId ||
                          'غير محدد'}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          WAREHOUSES
      ================================================== */}

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "
      >

        {
          filteredWarehouses.map(
            warehouse => {

              const totalQuantity =

                (
                  warehouse.products ||
                  []
                )
                  .reduce(

                    (sum, product) =>

                      sum +
                      Number(
                        product.quantity || 0
                      ),

                    0

                  )


              const totalValue =

                (
                  warehouse.products ||
                  []
                )
                  .reduce(

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


              const isEditing =
                editingWarehouseId ===
                warehouse.id


              return (

                <div
                  key={warehouse.id}
                  className="
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-3xl
                    p-6
                  "
                >

                  {/* ==================================================
                      EDIT FORM
                  ================================================== */}

                  {
                    isEditing ? (

                      <div className="space-y-4">

                        <h3
                          className="
                            text-2xl
                            font-black
                            text-yellow-400
                          "
                        >
                          ✏️ تعديل المخزن
                        </h3>


                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              name:
                                e.target.value

                            })
                          }
                          placeholder="اسم المخزن"
                          className="
                            w-full
                            p-3
                            rounded-xl
                            text-black
                            font-bold
                          "
                        />


                        <select
                          value={editForm.type}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              type:
                                e.target.value

                            })
                          }
                          className="
                            w-full
                            p-3
                            rounded-xl
                            text-black
                            font-bold
                          "
                        >

                          <option value="main">
                            مخزن رئيسي
                          </option>

                          <option value="branch">
                            فرع
                          </option>

                          <option value="showroom">
                            معرض
                          </option>

                          <option value="service">
                            مركز خدمة
                          </option>

                        </select>


                        <input
                          value={editForm.location}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              location:
                                e.target.value

                            })
                          }
                          placeholder="الموقع"
                          className="
                            w-full
                            p-3
                            rounded-xl
                            text-black
                            font-bold
                          "
                        />


                        <input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              phone:
                                e.target.value

                            })
                          }
                          placeholder="رقم الهاتف"
                          className="
                            w-full
                            p-3
                            rounded-xl
                            text-black
                            font-bold
                          "
                        />


                        <input
                          value={editForm.manager}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              manager:
                                e.target.value

                            })
                          }
                          placeholder="المسؤول"
                          className="
                            w-full
                            p-3
                            rounded-xl
                            text-black
                            font-bold
                          "
                        />


                        <input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              username:
                                e.target.value

                            })
                          }
                          placeholder="اسم مستخدم المخزن"
                          className="
                            w-full
                            p-4
                            rounded-2xl
                            bg-slate-800
                            text-white
                            font-bold
                            placeholder:text-gray-400
                          "
                        />


                        <input
                          value={editForm.password}
                          onChange={(e) =>
                            setEditForm({

                              ...editForm,

                              password:
                                e.target.value

                            })
                          }
                          placeholder="كلمة مرور المخزن"
                          type="text"
                          className="
                            w-full
                            p-4
                            rounded-2xl
                            bg-slate-800
                            text-white
                            font-bold
                            placeholder:text-gray-400
                          "
                        />


                        <div className="flex gap-3">

                          <button
                            onClick={
                              saveEditWarehouse
                            }
                            className="
                              flex-1
                              bg-green-600
                              hover:bg-green-500
                              p-3
                              rounded-xl
                              font-black
                            "
                          >
                            💾 حفظ
                          </button>


                          <button
                            onClick={
                              cancelEditWarehouse
                            }
                            className="
                              flex-1
                              bg-slate-700
                              hover:bg-slate-600
                              p-3
                              rounded-xl
                              font-black
                            "
                          >
                            إلغاء
                          </button>

                        </div>

                      </div>

                    ) : (

                      <>

                        {/* ==================================================
                            WAREHOUSE HEADER
                        ================================================== */}

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            flex-wrap
                          "
                        >

                          <h2
                            className="
                              text-2xl
                              font-black
                              text-yellow-400
                            "
                          >
                            {warehouse.name}
                          </h2>

                        </div>


                        <div
                          className="
                            mt-4
                            space-y-2
                            text-sm
                          "
                        >

                          <div>
                            النوع : {warehouse.type}
                          </div>

                          <div>
                            الموقع : {
                              warehouse.location ||
                              'غير محدد'
                            }
                          </div>

                          <div>
                            المسؤول : {
                              warehouse.manager ||
                              'غير محدد'
                            }
                          </div>

                          <div>
                            الهاتف : {
                              warehouse.phone ||
                              'غير محدد'
                            }
                          </div>

                          <div>
                            عدد المنتجات : {
                              (
                                warehouse.products ||
                                []
                              ).length
                            }
                          </div>

                          <div>
                            إجمالي الكمية : {
                              totalQuantity
                            }
                          </div>

                          <div>
                            قيمة المخزون : {
                              totalValue
                            } ج
                          </div>

                        </div>


                        {/* ==================================================
                            PRODUCTS
                        ================================================== */}

                        <div
                          className="
                            mt-6
                            space-y-3
                          "
                        >

                          {
                            (
                              warehouse.products ||
                              []
                            ).map(

                              product => (

                                <div
                                  key={
                                    product.productId ||
                                    product.id
                                  }
                                  className="
                                    bg-slate-800
                                    rounded-xl
                                    p-3
                                    border
                                    border-slate-700
                                  "
                                >

                                  <div
                                    className="
                                      font-bold
                                    "
                                  >
                                    {
                                      product.productName ||
                                      product.name ||
                                      'منتج بدون اسم'
                                    }
                                  </div>


                                  <div
                                    className="
                                      text-gray-400
                                    "
                                  >
                                    الكمية :
                                    {' '}
                                    {
                                      product.quantity
                                    }
                                  </div>


                                  <div
                                    className="
                                      text-green-400
                                    "
                                  >
                                    البيع :
                                    {' '}
                                    {
                                      product.salePrice
                                    } ج
                                  </div>

                                </div>

                              )

                            )

                          }

                        </div>


                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                          className="
                            grid
                            grid-cols-3
                            gap-2
                            mt-6
                          "
                        >

                          {/* DETAILS */}

                          <button
                            onClick={() =>
                              navigate(
                                `/warehouses/${warehouse.id}`
                              )
                            }
                            className="
                              bg-blue-600
                              hover:bg-blue-500
                              p-3
                              rounded-xl
                              font-black
                            "
                          >
                            📋 التفاصيل
                          </button>


                          {/* EDIT */}

                          <button
                            onClick={() =>
                              startEditWarehouse(
                                warehouse
                              )
                            }
                            className="
                              bg-yellow-500
                              hover:bg-yellow-400
                              text-black
                              p-3
                              rounded-xl
                              font-black
                            "
                          >
                            ✏️ تعديل
                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              deleteWarehouse(
                                warehouse.id
                              )
                            }
                            className="
                              bg-red-600
                              hover:bg-red-500
                              p-3
                              rounded-xl
                              font-black
                            "
                          >
                            🗑️ حذف
                          </button>

                        </div>

                      </>

                    )
                  }

                </div>

              )

            }
          )
        }

      </div>


      {/* ==================================================
          PRINT STYLE
      ================================================== */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            #warehouse-report,
            #warehouse-report * {
              visibility: visible;
            }

            #warehouse-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              border: none !important;
              margin: 0 !important;
              padding: 20px !important;
            }

            #warehouse-report .text-gray-400,
            #warehouse-report .text-white {
              color: black !important;
            }

            #warehouse-report .bg-slate-900,
            #warehouse-report .bg-slate-800 {
              background: white !important;
            }

            #warehouse-report button,
            #warehouse-report select {
              display: none !important;
            }

            #warehouse-report table {
              color: black !important;
            }

            #warehouse-report th,
            #warehouse-report td {
              color: black !important;
              border: 1px solid #999 !important;
            }

          }
        `}
      </style>

    </div>

  )

}