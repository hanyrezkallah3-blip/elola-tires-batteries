import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import pkg from 'whatsapp-web.js'
import QRCode from 'qrcode'

const { Client, LocalAuth } = pkg

// ================= APP =================

const app = express()

app.use(cors())

app.use(express.json({ limit: '50mb' }))

// ================= SERVER =================

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// ================= PORT =================

const PORT = 5000

// ================= WHATSAPP =================

let latestQr = ''
let whatsappReady = false

const client = new Client({

  authStrategy: new LocalAuth({

    clientId: 'elola-company'

  }),

  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }

})

// ================= QR =================

client.on('qr', async (qr) => {

  latestQr = await QRCode.toDataURL(qr)

  whatsappReady = false

  console.log('📱 QR READY')

})

// ================= READY =================

client.on('ready', () => {

  whatsappReady = true

  console.log('✅ WhatsApp Ready')

})

// ================= AUTH =================

client.on('authenticated', () => {

  console.log('🔐 AUTH SUCCESS')

})

// ================= FAIL =================

client.on('auth_failure', (msg) => {

  console.log('❌ AUTH FAILED', msg)

})

// ================= DISCONNECT =================

client.on('disconnected', () => {

  whatsappReady = false

  console.log('⚠ WhatsApp Disconnected')

})

// ================= INIT =================

client.initialize()

// ================= ROOT =================

app.get('/', (req, res) => {

  res.json({

    success: true,
    message: 'Elola WhatsApp Server Running'

  })

})

// ================= QR API =================

app.get('/qr', (req, res) => {

  res.json({

    qr: latestQr,
    ready: whatsappReady

  })

})

// ================= SEND WHATSAPP =================

app.post('/send-order', async (req, res) => {

  try {

    const {

      numbers,
      order

    } = req.body

    if (!numbers || numbers.length === 0) {

      return res.status(400).json({

        success: false,
        message: 'No numbers provided'

      })

    }

    // ================= SAFE DATA =================

    const customerName =
      order?.customerName || 'غير موجود'

    const customerPhone =
      order?.phone || 'غير موجود'

    const customerAddress =
      order?.address || 'غير موجود'

    const totalPrice =
      order?.total || 0

    const itemsText = order?.items
      ?.map(

        (item) =>

          `• ${item.name} - ${item.price}`

      )

      .join('\n')

    // ================= MESSAGE =================

    const message = `

🛒 طلب جديد من الموقع

👤 اسم العميل:
${customerName}

📞 رقم الهاتف:
${customerPhone}

📍 العنوان:
${customerAddress}

💰 الإجمالي:
${totalPrice} جنيه

📦 المنتجات:
${itemsText}

`

    // ================= SEND =================

    for (const number of numbers) {

      const formatted = `${number}@c.us`

      await client.sendMessage(

        formatted,
        message

      )

    }

    // ================= SOCKET =================

    io.emit('new-order', order)

    return res.json({

      success: true

    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({

      success: false,
      error: error.message

    })

  }

})

// ================= CUSTOMER COMPLAINTS =================

const complaints = []

app.post('/complaint', (req, res) => {

  const complaint = {

    id: Date.now(),

    createdAt:
      new Date().toISOString(),

    ...req.body

  }

  complaints.unshift(complaint)

  io.emit('new-complaint', complaint)

  res.json({

    success: true

  })

})

// ================= GET COMPLAINTS =================

app.get('/complaints', (req, res) => {

  res.json(complaints)

})

// ================= DAILY REPORT =================

app.post('/daily-report', async (req, res) => {

  try {

    const {

      number,
      report

    } = req.body

    const message = `

📊 التقرير اليومي

🏭 الفرع:
${report.branch}

💰 إجمالي المبيعات:
${report.sales} جنيه

📦 عدد الطلبات:
${report.orders}

📉 المنتجات منخفضة المخزون:
${report.lowStock}

`

    await client.sendMessage(

      `${number}@c.us`,
      message

    )

    res.json({

      success: true

    })

  } catch (error) {

    res.status(500).json({

      success: false

    })

  }

})

// ================= SOCKET =================

io.on('connection', (socket) => {

  console.log('⚡ USER CONNECTED')

})

// ================= START =================

server.listen(PORT, () => {

  console.log(`🚀 Server Running On ${PORT}`)

})