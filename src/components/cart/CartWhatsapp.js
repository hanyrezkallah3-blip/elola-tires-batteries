// ======================================================
// Elola ERP Enterprise
// Cart Whatsapp
// ======================================================

import { calculateCartTotal } from './CartHelpers'

// ======================================================

export function buildWhatsappMessage({

  customerName,

  phone,

  address,

  cart = []

}) {

  const total =

    calculateCartTotal(cart)

  const products =

    cart.map(item =>

      `• ${item.name} - ${item.quantity || 1} × ${Number(

        String(

          item.price || ''

        ).replace(/[^\d]/g, '')

      )} جنيه`

    ).join('\n')

  return `

🛒 طلب جديد من الموقع

👤 اسم العميل:
${customerName}

📞 رقم الهاتف:
${phone}

📍 العنوان:
${address}

💰 الإجمالي:
${total} جنيه

📦 المنتجات:
${products}

`

}

// ======================================================

export function sendWhatsapp({

  phoneNumber,

  message

}) {

  window.open(

    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,

    '_blank'

  )

}