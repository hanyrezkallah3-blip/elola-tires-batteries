import { useWebsiteStore } from './store/websiteStore'

export default function TestMigration() {

  const products = useWebsiteStore(
    s => s.products
  )

  const users = useWebsiteStore(
    s => s.users
  )

  return (
    <div>
      {products.length}
      {users.length}
    </div>
  )

}