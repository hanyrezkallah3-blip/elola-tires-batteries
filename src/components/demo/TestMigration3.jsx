import { useInventoryStore } from "../../store/inventoryStore";
import { useWalletStore } from "../../store/walletStore";
import { useOrderStore } from "../../store/orderStore";
import { useUserStore } from "../../store/userStore";
import { useProductStore } from "../../store/productStore";
export default function TestMigration3() {
  const products = useProductStore(s => s.products);
  const users = useUserStore(s => s.users);
  const orders = useOrderStore(s => s.orders);
  const wallets = useWalletStore(s => s.wallets);
  const warehouses = useInventoryStore(s => s.warehouses);
  return <div>

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

    </div>;
}