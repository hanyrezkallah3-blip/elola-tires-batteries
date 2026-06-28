import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWebsiteStore } from '../store/websiteStore'
import حماية_الصفحة from '../security/حماية_الصفحة'

export default function WarehouseDashboard() {
  const navigate = useNavigate()

  const currentUser =
    useWebsiteStore((state) => state.currentUser)

  const products =
    useWebsiteStore((state) => state.products || [])

  const orders =
    useWebsiteStore((state) => state.orders || [])

  const users =
    useWebsiteStore((state) => state.users || [])

  const transfers =
    useWebsiteStore((state) => state.transfers || [])

  const stockHistory =
    useWebsiteStore((state) => state.stockHistory || [])

  const logout =
    useWebsiteStore((state) => state.logout)

  const transferProductQuantity =
    useWebsiteStore(
      (state) => state.transferProductQuantity
    )

  const [selectedProduct, setSelectedProduct] =
    useState('')

  const [targetWarehouse, setTargetWarehouse] =
    useState('')

  const [quantity, setQuantity] =
    useState('')

  const [search, setSearch] =
    useState('')

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

    if (!allowedRoles.includes(currentUser.role)) {
      navigate('/home')
    }
  }, [currentUser, navigate])

  if (!currentUser) return null

  const warehouseProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.warehouseId === currentUser.warehouseId
    )
  }, [products, currentUser])

  const warehouseOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.warehouseId === currentUser.warehouseId
    )
  }, [orders, currentUser])

  const availableUnits = useMemo(() => {
    return users.filter(
      (u) =>
        (
          u.role === 'warehouse' ||
          u.role === 'branch' ||
          u.role === 'shop'
        ) &&
        u.warehouseId !== currentUser.warehouseId
    )
  }, [users, currentUser])

  const totalProducts =
    warehouseProducts.length

  const totalOrders =
    warehouseOrders.length

  const totalSales =
    warehouseOrders.reduce(
      (acc, o) =>
        acc + Number(o.total || 0),
      0
    )

  const totalStock =
    warehouseProducts.reduce(
      (acc, p) =>
        acc + Number(p.stock || 0),
      0
    )

  const lowStockProducts =
    warehouseProducts.filter(
      (p) => Number(p.stock || 0) <= 5
    )

  const filteredProducts =
    warehouseProducts.filter((p) =>
      (p.name || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  const warehouseTransfers =
    transfers.filter(
      (t) =>
        t.fromWarehouseId ===
          currentUser.warehouseId ||
        t.toWarehouseId ===
          currentUser.warehouseId
    )

  const warehouseHistory =
    stockHistory.filter(
      (h) =>
        h.warehouseId ===
        currentUser.warehouseId
    )

  const getRoleName = (role) => {
    if (role === 'warehouse')
      return '🏭 المخزن'

    if (role === 'branch')
      return '🏢 الفرع'

    if (role === 'shop')
      return '🏪 المعرض'

    if (role === 'owner')
      return '👑 الإدارة'

    return role
  }

  const handleTransfer = () => {
    if (
      !selectedProduct ||
      !targetWarehouse ||
      !quantity
    ) {
      alert('يرجى استكمال البيانات')
      return
    }

    transferProductQuantity({
      productId: selectedProduct,
      fromWarehouseId:
        currentUser.warehouseId,
      toWarehouseId: targetWarehouse,
      quantity: Number(quantity)
    })

    setSelectedProduct('')
    setTargetWarehouse('')
    setQuantity('')

    alert('تم التحويل بنجاح')
  }

  return (
    <حماية_الصفحة
      requiredPermission="warehouse_dashboard"
      requiredRole="warehouse"
      page="warehouse_dashboard"
    >
      <div className="min-h-screen bg-red text-white p-8 space-y-8">

        <div className="flex flex-wrap justify-between gap-4">

          <div>
            <h1 className="text-4xl font-black text-yellow-400">
              {getRoleName(currentUser.role)}
            </h1>

            <div className="text-gray-400 mt-2">
              {currentUser.warehouseName ||
                currentUser.username}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() =>
                navigate('/products')
              }
              className="bg-green-600 px-4 py-3 rounded-xl font-bold"
            >
              المنتجات
            </button>

            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="bg-red-600 px-4 py-3 rounded-xl font-bold"
            >
              خروج
            </button>

          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-slate-900 p-5 rounded-2xl">
            <div>الأصناف</div>
            <div className="text-3xl font-black">
              {totalProducts}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl">
            <div>الطلبات</div>
            <div className="text-3xl font-black">
              {totalOrders}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl">
            <div>إجمالي المخزون</div>
            <div className="text-3xl font-black">
              {totalStock}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl">
            <div>المبيعات</div>
            <div className="text-3xl font-black">
              {totalSales}
            </div>
          </div>

        </div>

        <div className="bg-slate-900 p-5 rounded-2xl space-y-4">

          <h2 className="text-2xl font-black">
            🚚 تحويل بين المخازن
          </h2>

          <select
            className="w-full p-3 rounded text-black"
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(
                e.target.value
              )
            }
          >
            <option value="">
              اختر المنتج
            </option>

            {warehouseProducts.map(
              (product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              )
            )}
          </select>

          <select
            className="w-full p-3 rounded text-black"
            value={targetWarehouse}
            onChange={(e) =>
              setTargetWarehouse(
                e.target.value
              )
            }
          >
            <option value="">
              اختر الوجهة
            </option>

            {availableUnits.map((unit) => (
              <option
                key={unit.id}
                value={unit.warehouseId}
              >
                {unit.warehouseName}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full p-3 rounded text-black"
            placeholder="الكمية"
          />

          <button
            onClick={handleTransfer}
            className="bg-blue-600 px-5 py-3 rounded-xl font-bold"
          >
            تنفيذ التحويل
          </button>

        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">

          <div className="flex justify-between mb-4">

            <h2 className="text-2xl font-black">
              📦 المنتجات
            </h2>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="بحث"
              className="p-2 rounded text-black"
            />

          </div>

          <div className="overflow-auto">

            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-right p-2">الصنف</th>
                  <th className="text-right p-2">المخزون</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="border-t border-slate-700"
                    >
                      <td className="p-2">
                        {product.name}
                      </td>

                      <td className="p-2">
                        {product.stock}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-slate-900 p-5 rounded-2xl">

            <h2 className="text-xl font-black mb-4">
              ⚠ الأصناف منخفضة المخزون
            </h2>

            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="border-b border-slate-700 py-2"
              >
                {p.name} - {p.stock}
              </div>
            ))}

          </div>

          <div className="bg-slate-900 p-5 rounded-2xl">

            <h2 className="text-xl font-black mb-4">
              🚚 آخر التحويلات
            </h2>

            {warehouseTransfers
              .slice(-10)
              .reverse()
              .map((t) => (
                <div
                  key={t.id}
                  className="border-b border-slate-700 py-2"
                >
                  {t.productName || t.productId}
                </div>
              ))}

          </div>

        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">

          <h2 className="text-xl font-black mb-4">
            📈 حركة المخزون
          </h2>

          {warehouseHistory
            .slice(-20)
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="border-b border-slate-700 py-2"
              >
                {item.action || item.type} -
                {item.productName}
              </div>
            ))}

        </div>

      </div>
    </حماية_الصفحة>
  )
}