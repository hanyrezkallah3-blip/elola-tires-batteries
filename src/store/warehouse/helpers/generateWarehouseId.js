export default function generateWarehouseId() {

  if (crypto.randomUUID) {

    return crypto.randomUUID()

  }

  return (

    Date.now().toString() +

    Math.random()

      .toString(36)

      .slice(2)

  )

}