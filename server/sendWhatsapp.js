import pkg from 'whatsapp-web.js'

const { Client } = pkg

const client = new Client()

client.initialize()

export async function sendWhatsappMessage(message) {

  try {

    const number = '201000000000@c.us'

    await client.sendMessage(
      number,
      message
    )

    console.log('✅ WhatsApp Sent')

  } catch (err) {

    console.log(err)

  }

}