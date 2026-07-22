import { useUserStore } from "../store/userStore";import { useOrderStore } from "../store/orderStore";import { useProductStore } from "../store/productStore";import { useMemo } from 'react';

import { useInventoryStore } from '../store/inventoryStore';
import AIControlPanel from '../components/ai/AIControlPanel';

export default function AIControlCenter() {
  const products = useProductStore((state) => state.products);
  const orders = useOrderStore((state) => state.orders);
  const users = useUserStore((state) => state.users);

  const warehouses = useInventoryStore((state) => state.warehouses);
  const stockItems = useInventoryStore((state) => state.stockItems);

  const summary = useMemo(() => {
    return {
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalUsers: users?.length || 0,
      totalWarehouses: warehouses?.length || 0,
      totalStockItems: stockItems?.length || 0
    };
  }, [
  products,
  orders,
  users,
  warehouses,
  stockItems]
  );

  return (
    <div className="space-y-6">
      <AIControlPanel />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow">
          <h3>Products</h3>
          <p>{summary.totalProducts}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h3>Orders</h3>
          <p>{summary.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h3>Users</h3>
          <p>{summary.totalUsers}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h3>Warehouses</h3>
          <p>{summary.totalWarehouses}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <h3>Stock Items</h3>
          <p>{summary.totalStockItems}</p>
        </div>
      </div>
    </div>);

}