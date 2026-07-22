import { useWebsiteStore } from './store/websiteStore'

export default function TestMigration2() {

  const products = useWebsiteStore(s => s.products)

  const users = useWebsiteStore(s => s.users)

  const orders = useWebsiteStore(s => s.orders)

  const wallets = useWebsiteStore(s => s.wallets)

  const warehouses = useWebsiteStore(s => s.warehouses)

  return (
    <>
      {products.length}
      {users.length}
      {orders.length}
      {wallets.length}
      {warehouses.length}
    </>
  )

}