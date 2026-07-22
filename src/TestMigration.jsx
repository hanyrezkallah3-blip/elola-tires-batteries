import { useUserStore } from "store/userStore";import { useProductStore } from "store/productStore";import { useWebsiteStore } from './store/websiteStore';

export default function TestMigration() {

  const products = useProductStore(
    (s) => s.products
  );

  const users = useUserStore(
    (s) => s.users
  );

  return (
    <div>
      {products.length}
      {users.length}
    </div>);


}