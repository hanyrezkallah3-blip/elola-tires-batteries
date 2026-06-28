import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'

export default function Cart({ open, setOpen }) {

  const {
    cart,
    removeFromCart,
    clearCart,
    addOrder
  } = useWebsiteStore()

  // ================= REAL INVENTORY =================
  const stockItems =
    useInventoryStore((s) => s.stockItems || [])

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const safeCart = useMemo(() => {
    return Array.isArray(cart) ? cart : []
  }, [cart])

  if (!open) return null

  // ================= TOTAL =================
  const total = safeCart.reduce((acc, item) => {
    const price = Number(
      String(item.price || '').replace(/[^\d]/g, '')
    )
    return acc + price
  }, 0)

  // ================= FIND STOCK ITEM =================
  const findStock = (item) => {
    return stockItems.find(
      (s) =>
        String(s.productId) === String(item.id) ||
        String(s.productId) === String(item.productId)
    )
  }

  // ================= STOCK VALIDATION (REAL ERP) =================
  const validateStock = () => {

    for (const item of safeCart) {

      const stockItem = findStock(item)

      if (!stockItem) {
        alert(`المنتج غير موجود في المخزون: ${item.name}`)
        return false
      }

      const available = Number(stockItem.quantity || 0)

      if (available <= 0) {
        alert(`المنتج غير متوفر بالمخزون: ${item.name}`)
        return false
      }
    }

    return true
  }

  const validatePhone = () => {
    if (phone.trim().length < 11) {
      alert('رقم الهاتف غير صحيح')
      return false
    }
    return true
  }

  // ================= ORDER =================
  const handleOrder = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      safeCart.length === 0
    ) {
      alert('يرجى إدخال جميع البيانات')
      return
    }

    if (!validatePhone()) return
    if (!validateStock()) return

    setLoading(true)

    try {

      const orderData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: safeCart,
        total,
        warehouseId: safeCart[0]?.warehouseId || 'main',
        createdBy: 'website',
        paymentMethod: 'cash',
        date: new Date().toLocaleString(),
        status: 'طلب جديد'
      }

      await addOrder(orderData)

      const message = `
📦 طلب جديد

الاسم: ${customerName}
الهاتف: ${phone}
العنوان: ${address}

----------------

${safeCart.map(item => {
  const stockItem = findStock(item)
  return `${item.name} - الكمية المتاحة: ${stockItem?.quantity || 0}`
}).join('\n')}

----------------

الإجمالي: ${total} جنيه
`

      window.open(
        `https://wa.me/201022464897?text=${encodeURIComponent(message)}`,
        '_blank'
      )

      clearCart()
      setCustomerName('')
      setPhone('')
      setAddress('')

      alert('تم إرسال الطلب بنجاح')
      setOpen(false)

    } catch (err) {
      console.log(err)
      alert(err.message || 'حدث خطأ أثناء إرسال الطلب')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdrop = (e) => {
    if (e.target.id === 'cart-backdrop') {
      setOpen(false)
    }
  }
  

  return (
    <div
      id="cart-backdrop"
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/70 z-50 flex justify-end"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:w-[520px] h-screen bg-slate-950 overflow-y-auto p-6"
      >

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl text-yellow-400 font-bold">
            سلة المشتريات
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="bg-red-600 px-3 py-2 rounded"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleOrder} className="space-y-4">

          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="اسم العميل"
            className="w-full p-3 rounded bg-white text-black"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="رقم الهاتف"
            className="w-full p-3 rounded bg-white text-black"
          />

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="العنوان"
            className="w-full p-3 rounded bg-white text-black h-24"
          />

          <button
            disabled={loading}
            className="w-full bg-yellow-500 py-3 font-bold rounded"
          >
            {loading ? 'جاري التنفيذ...' : 'تأكيد الطلب'}
          </button>

        </form>

        {/* ITEMS */}
        <div className="mt-6 space-y-4">

          {safeCart.map((item) => {

            const stockItem = findStock(item)

            return (
              <div key={item.cartId} className="bg-slate-900 p-4 rounded">

                <div className="text-xl font-bold">
                  {item.name}
                </div>

                <div className="text-yellow-400">
                  السعر: {item.price}
                </div>

                <div className="text-blue-400">
                  المخزون الحقيقي: {stockItem?.quantity || 0}
                </div>

                {(!stockItem || stockItem.quantity <= 0) && (
                  <div className="text-red-500 font-bold mt-2">
                    غير متوفر في المخزون
                  </div>
                )}

                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="mt-3 bg-red-600 px-3 py-1 rounded text-white"
                >
                  حذف
                </button>

              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}