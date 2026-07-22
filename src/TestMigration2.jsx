import { useInventoryStore } from "./store/inventoryStore";
import { useWalletStore } from "./store/walletStore";
import { useOrderStore } from "./store/orderStore";
import { useUserStore } from "./store/userStore";
import { useProductStore } from "./store/productStore";
export default function TestMigration2() {
  const products = useProductStore(s => s.products);
  const users = useUserStore(s => s.users);
  const orders = useOrderStore(s => s.orders);
  const wallets = useWalletStore(s => s.wallets);
  const warehouses = useInventoryStore(s => s.warehouses);
  return <>
      {products.length}
      {users.length}
      {orders.length}
      {wallets.length}
      {warehouses.length}
    </>;
}