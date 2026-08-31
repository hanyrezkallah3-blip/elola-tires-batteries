import {
  useMemo,
  useState,
  useEffect
} from 'react'

import { useNavigate } from 'react-router-dom'

import { useWebsiteStore } from '../store/websiteStore'

import { useWarehouseStore } from '../store/warehouseStore'

import حماية_الصفحة from '../security/حماية_الصفحة'


export default function WarehouseDashboard() {

  const navigate =
    useNavigate()


  // ======================================================
  // WEBSITE STORE
  // ======================================================
  // نستخدم websiteStore هنا فقط للهوية والطلبات والمستخدمين.
  // المخزون نفسه أصبح من warehouseStore.
  // ======================================================

  const currentUser =
    useWebsiteStore(
      state => state.currentUser
    )

  const orders =
    useWebsiteStore(
      state => state.orders || []
    )

  const users =
    useWebsiteStore(
      state => state.users || []
    )

  const logout =
    useWebsiteStore(
      state => state.logout
    )


  // ======================================================
  // WAREHOUSE STORE
  // ======================================================

  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )

  const getWarehouseProducts =
    useWarehouseStore(
      state => state.getWarehouseProducts
    )

  const addTransaction =
    useWarehouseStore(
      state => state.addTransaction
    )


  // ======================================================
  // LOCAL STATE
  // ======================================================

  const [
    selectedProduct,
    setSelectedProduct
  ] = useState('')


  const [
    targetWarehouse,
    setTargetWarehouse
  ] = useState('')


  const [
    quantity,
    setQuantity
  ] = useState('')


  const [
    search,
    setSearch
  ] = useState('')


  // ======================================================
  // AUTH
  // ======================================================

  useEffect(() => {

    if (!currentUser) {

      navigate('/login')

      return

    }


    const allowedRoles = [

      'warehouse',

      'branch',

      'shop',

      'owner'

    ]


    if (
      !allowedRoles.includes(
        currentUser.role
      )
    ) {

      navigate('/home')

    }

  }, [
    currentUser,
    navigate
  ])


  // ======================================================
  // CURRENT WAREHOUSE
  // ======================================================

  const warehouseId =
    currentUser?.warehouseId


  const currentWarehouse =
    useMemo(() => {

      if (!warehouseId) {
        return null
      }


      return warehouses.find(
        warehouse =>
          String(
            warehouse.id
          ) ===
          String(
            warehouseId
          )
      ) || null

    }, [
      warehouses,
      warehouseId
    ])


  // ======================================================
  // PRODUCTS
  // ======================================================

  const warehouseProducts =
    useMemo(() => {

      if (!warehouseId) {
        return []
      }


      return getWarehouseProducts(
        warehouseId
      ) || []

    }, [
      getWarehouseProducts,
      warehouseId,
      warehouses
    ])


  // ======================================================
  // ORDERS
  // ======================================================

  const warehouseOrders =
    useMemo(() => {

      if (!warehouseId) {
        return []
      }


      return orders.filter(
        order =>
          String(
            order.warehouseId
          ) ===
          String(
            warehouseId
          )
      )

    }, [
      orders,
      warehouseId
    ])


  // ======================================================
  // OTHER WAREHOUSES
  // ======================================================

  const availableWarehouses =
    useMemo(() => {

      if (!warehouseId) {
        return []
      }


      return warehouses.filter(
        warehouse =>
          String(
            warehouse.id
          ) !==
          String(
            warehouseId
          )
      )

    }, [
      warehouses,
      warehouseId
    ])


  // ======================================================
  // STATS
  // ======================================================

  const totalProducts =
    warehouseProducts.length


  const totalOrders =
    warehouseOrders.length


  const totalSales =
    warehouseOrders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order.total || 0
        ),
      0
    )


  const totalStock =
    warehouseProducts.reduce(
      (
        total,
        product
      ) =>
        total +
        Number(
          product.quantity || 0
        ),
      0
    )


  const lowStockProducts =
    warehouseProducts.filter(
      product =>
        Number(
          product.quantity || 0
        ) <=
        Number(
          product.reorderPoint || 5
        )
    )


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredProducts =
    warehouseProducts.filter(
      product => {

        const value =
          search
            .toLowerCase()
            .trim()


        if (!value) {
          return true
        }


        const name =
          String(
            product.name ||
            product.productName ||
            ''
          ).toLowerCase()


        const barcode =
          String(
            product.barcode ||
            ''
          ).toLowerCase()


        const brand =
          String(
            product.brand ||
            ''
          ).toLowerCase()


        return (

          name.includes(value) ||

          barcode.includes(value) ||

          brand.includes(value)

        )

      }
    )


  // ======================================================
  // TRANSACTIONS
  // ======================================================

  const warehouseTransactions =
    useMemo(() => {

      return (
        currentWarehouse?.transactions ||
        []
      )

    }, [
      currentWarehouse
    ])


  const recentTransactions =
    warehouseTransactions
      .slice(-20)
      .reverse()


  // ======================================================
  // ROLE NAME
  // ======================================================

  const getRoleName =
    role => {

      if (
        role === 'warehouse'
      ) {
        return '🏭 المخزن'
      }


      if (
        role === 'branch'
      ) {
        return '🏢 الفرع'
      }


      if (
        role === 'shop'
      ) {
        return '🏪 المعرض'
      }


      if (
        role === 'owner'
      ) {
        return '👑 الإدارة'
      }


      return role

    }


  // ======================================================
  // TRANSFER
  // ======================================================
  // في هذه المرحلة لا نستخدم transferProductQuantity
  // من websiteStore.
  //
  // التحويل يجب أن يتم لاحقًا عبر warehouseStore
  // باعتباره مصدر المخزون الوحيد.
  // ======================================================

  const handleTransfer = () => {

    if (
      !selectedProduct ||
      !targetWarehouse ||
      !quantity
    ) {

      alert(
        'يرجى استكمال البيانات'
      )

      return

    }


    const amount =
      Number(quantity)


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      alert(
        'الكمية غير صحيحة'
      )

      return

    }


    const product =
      warehouseProducts.find(
        item =>

          String(
            item.productId
          ) ===
          String(
            selectedProduct
          ) ||

          String(
            item.id
          ) ===
          String(
            selectedProduct
          )
      )


    if (!product) {

      alert(
        'المنتج غير موجود في المخزن'
      )

      return

    }


    const currentQuantity =
      Number(
        product.quantity || 0
      )


    if (
      amount >
      currentQuantity
    ) {

      alert(
        'الكمية المطلوبة أكبر من المخزون المتاح'
      )

      return

    }


    /*
     * لا ننفذ التحويل القديم من websiteStore.
     *
     * سيتم ربط هذه العملية مباشرة بمحرك المخزون
     * بعد نقل moveWarehouseProduct إلى المسار الموحد.
     *
     * نمنع هنا أي تعديل مزدوج للمخزون.
     */

    alert(
      'تم إيقاف التحويل القديم. سيتم تنفيذ التحويل من نظام المخزون الموحد.'
    )


    setSelectedProduct('')

    setTargetWarehouse('')

    setQuantity('')

  }


  // ======================================================
  // AUTH GUARD
  // ======================================================

  if (!currentUser) {
    return null
  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <حماية_الصفحة

      requiredPermission="warehouse_dashboard"

      requiredRole="warehouse"

      page="warehouse_dashboard"

    >

      <div
        className="
          min-h-screen
          bg-black
          text-white
          p-8
          space-y-8
        "
      >

        {/* ================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-black
                text-yellow-400
              "
            >

              {getRoleName(
                currentUser.role
              )}

            </h1>


            <div
              className="
                text-gray-400
                mt-2
              "
            >

              {
                currentWarehouse?.name ||
                currentUser.warehouseName ||
                currentUser.username
              }

            </div>

          </div>


          <div
            className="
              flex
              gap-3
              flex-wrap
            "
          >

            <button
              onClick={() =>
                navigate('/products')
              }
              className="
                bg-green-600
                px-4
                py-3
                rounded-xl
                font-bold
              "
            >

              المنتجات

            </button>


            <button
              onClick={() => {

                logout()

                navigate('/login')

              }}
              className="
                bg-red-600
                px-4
                py-3
                rounded-xl
                font-bold
              "
            >

              خروج

            </button>

          </div>

        </div>


        {/* ================================================
            STATS
        ================================================= */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >

          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <div>
              الأصناف
            </div>

            <div
              className="
                text-3xl
                font-black
              "
            >

              {totalProducts}

            </div>

          </div>


          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <div>
              الطلبات
            </div>

            <div
              className="
                text-3xl
                font-black
              "
            >

              {totalOrders}

            </div>

          </div>


          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <div>
              إجمالي المخزون
            </div>

            <div
              className="
                text-3xl
                font-black
              "
            >

              {totalStock}

            </div>

          </div>


          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <div>
              المبيعات
            </div>

            <div
              className="
                text-3xl
                font-black
              "
            >

              {totalSales}

            </div>

          </div>

        </div>


        {/* ================================================
            TRANSFER
        ================================================= */}

        <div
          className="
            bg-slate-900
            p-5
            rounded-2xl
            space-y-4
          "
        >

          <h2
            className="
              text-2xl
              font-black
            "
          >

            🚚 تحويل بين المخازن

          </h2>


          <select

            className="
              w-full
              p-3
              rounded
              text-black
            "

            value={
              selectedProduct
            }

            onChange={
              event =>
                setSelectedProduct(
                  event.target.value
                )
            }

          >

            <option value="">

              اختر المنتج

            </option>


            {warehouseProducts.map(
              product => (

                <option

                  key={
                    product.productId ||
                    product.id
                  }

                  value={
                    product.productId ||
                    product.id
                  }

                >

                  {
                    product.name ||
                    product.productName
                  }

                </option>

              )
            )}

          </select>


          <select

            className="
              w-full
              p-3
              rounded
              text-black
            "

            value={
              targetWarehouse
            }

            onChange={
              event =>
                setTargetWarehouse(
                  event.target.value
                )
            }

          >

            <option value="">

              اختر الوجهة

            </option>


            {availableWarehouses.map(
              warehouse => (

                <option

                  key={
                    warehouse.id
                  }

                  value={
                    warehouse.id
                  }

                >

                  {
                    warehouse.name ||
                    warehouse.id
                  }

                </option>

              )
            )}

          </select>


          <input

            type="number"

            min="1"

            value={
              quantity
            }

            onChange={
              event =>
                setQuantity(
                  event.target.value
                )
            }

            className="
              w-full
              p-3
              rounded
              text-black
            "

            placeholder="الكمية"

          />


          <button

            onClick={
              handleTransfer
            }

            className="
              bg-blue-600
              px-5
              py-3
              rounded-xl
              font-bold
            "

          >

            تنفيذ التحويل

          </button>

        </div>


        {/* ================================================
            PRODUCTS
        ================================================= */}

        <div
          className="
            bg-slate-900
            p-5
            rounded-2xl
          "
        >

          <div
            className="
              flex
              flex-wrap
              justify-between
              gap-4
              mb-4
            "
          >

            <h2
              className="
                text-2xl
                font-black
              "
            >

              📦 المنتجات

            </h2>


            <input

              value={
                search
              }

              onChange={
                event =>
                  setSearch(
                    event.target.value
                  )
              }

              placeholder="بحث"

              className="
                p-2
                rounded
                text-black
              "

            />

          </div>


          <div
            className="
              overflow-auto
            "
          >

            <table
              className="
                w-full
              "
            >

              <thead>

                <tr>

                  <th
                    className="
                      text-right
                      p-2
                    "
                  >
                    الصنف
                  </th>


                  <th
                    className="
                      text-right
                      p-2
                    "
                  >
                    المخزون
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.map(
                  product => (

                    <tr

                      key={
                        product.productId ||
                        product.id
                      }

                      className="
                        border-t
                        border-slate-700
                      "

                    >

                      <td
                        className="p-2"
                      >

                        {
                          product.name ||
                          product.productName
                        }

                      </td>


                      <td
                        className="p-2"
                      >

                        {
                          Number(
                            product.quantity || 0
                          )
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ================================================
            LOW STOCK
        ================================================= */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-6
          "
        >

          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <h2
              className="
                text-xl
                font-black
                mb-4
              "
            >

              ⚠ الأصناف منخفضة المخزون

            </h2>


            {lowStockProducts.length === 0 ? (

              <div
                className="
                  text-gray-400
                "
              >

                لا توجد أصناف منخفضة المخزون

              </div>

            ) : (

              lowStockProducts.map(
                product => (

                  <div

                    key={
                      product.productId ||
                      product.id
                    }

                    className="
                      border-b
                      border-slate-700
                      py-2
                    "

                  >

                    {
                      product.name ||
                      product.productName
                    }

                    {' - '}

                    {
                      Number(
                        product.quantity || 0
                      )
                    }

                  </div>

                )
              )

            )}

          </div>


          {/* ==============================================
              RECENT TRANSACTIONS
          =============================================== */}

          <div
            className="
              bg-slate-900
              p-5
              rounded-2xl
            "
          >

            <h2
              className="
                text-xl
                font-black
                mb-4
              "
            >

              🔄 آخر حركات المخزون

            </h2>


            {recentTransactions.length === 0 ? (

              <div
                className="
                  text-gray-400
                "
              >

                لا توجد حركات مخزون

              </div>

            ) : (

              recentTransactions.map(
                transaction => (

                  <div

                    key={
                      transaction.id
                    }

                    className="
                      border-b
                      border-slate-700
                      py-2
                    "

                  >

                    <span>

                      {
                        transaction.type === 'in'
                          ? 'دخول'
                          : 'خروج'
                      }

                    </span>

                    {' - '}

                    {
                      transaction.productName ||
                      transaction.productId
                    }

                    {' - '}

                    {
                      transaction.quantity
                    }

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ================================================
            STOCK HISTORY
        ================================================= */}

        <div
          className="
            bg-slate-900
            p-5
            rounded-2xl
          "
        >

          <h2
            className="
              text-xl
              font-black
              mb-4
            "
          >

            📈 حركة المخزون

          </h2>


          {recentTransactions.length === 0 ? (

            <div
              className="
                text-gray-400
              "
            >

              لا توجد حركة مخزون

            </div>

          ) : (

            recentTransactions.map(
              transaction => (

                <div

                  key={
                    `history-${transaction.id}`
                  }

                  className="
                    border-b
                    border-slate-700
                    py-2
                  "

                >

                  {
                    transaction.type === 'in'
                      ? 'إضافة'
                      : 'سحب'
                  }

                  {' - '}

                  {
                    transaction.productName ||
                    transaction.productId
                  }

                  {' - الكمية: '}

                  {
                    transaction.quantity
                  }

                  {' - الرصيد بعد الحركة: '}

                  {
                    transaction.afterQuantity ??
                    transaction.newQuantity ??
                    0
                  }

                </div>

              )
            )

          )}

        </div>

      </div>

    </حماية_الصفحة>

  )

}