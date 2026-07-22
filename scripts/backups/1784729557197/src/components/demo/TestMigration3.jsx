import { useWebsiteStore } from '../../store/websiteStore'

export default function TestMigration3() {

  const products = useWebsiteStore(
    s => s.products
  )

  const users = useWebsiteStore(
    s => s.users
  )

  const orders = useWebsiteStore(
    s => s.orders
  )

  const wallets = useWebsiteStore(
    s => s.wallets
  )

  const warehouses = useWebsiteStore(
    s => s.warehouses
  )

  return (

    <div>

      <h2>Migration Test</h2>

      <div>
        Products: {products.length}
      </div>

      <div>
        Users: {users.length}
      </div>

      <div>
        Orders: {orders.length}
      </div>

      <div>
        Wallets: {wallets.length}
      </div>

      <div>
        Warehouses: {warehouses.length}
      </div>

    </div>

  )

}