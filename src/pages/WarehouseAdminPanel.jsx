import { useUserStore } from "../store/userStore";import { useProductStore } from "../store/productStore";import { useMemo, useState } from 'react';
import { useWebsiteStore } from '../store/websiteStore';
import { useNavigate } from 'react-router-dom';

export default function WarehouseAdminPanel() {

  const navigate = useNavigate();

  // ================= STORE =================

  const currentUser =
  useUserStore((s) => s.currentUser);

  const users =
  useUserStore((s) => s.users || []);

  const setUsers =
  useUserStore((s) => s.setUsers || (() => {}));

  const products =
  useProductStore((s) => s.products || []);

  const transfers =
  useWebsiteStore((s) => s.transfers || []);

  const transferProductQuantity =
  useWebsiteStore((s) => s.transferProductQuantity || (() => {}));

  const addNotification =
  useWebsiteStore((s) => s.addNotification || (() => {}));

  // ================= SECURITY =================

  const isOwner = currentUser?.role === 'owner';

  // ================= STATES =================

  const [search, setSearch] = useState('');
  const [unitName, setUnitName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('warehouse');
  const [showPassword, setShowPassword] = useState(false);

  const [permissions, setPermissions] = useState([
  'dashboard',
  'products',
  'orders']
  );

  const [productId, setProductId] = useState('');
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');

  // ================= FILTER USERS BY OWNER RULE =================

  const units = useMemo(() => {

    const base = users.filter((u) =>
    ['warehouse', 'branch', 'shop', 'service'].includes(u.role)
    );

    // 👑 المالك يرى كل شيء
    if (isOwner) return base;

    // 🔒 غير المالك يرى نفسه فقط
    return base.filter(
      (u) => u.warehouseId === currentUser?.warehouseId
    );

  }, [users, currentUser, isOwner]);

  // ================= FILTER PRODUCTS =================

  const visibleProducts = useMemo(() => {

    if (isOwner) return products;

    return products.filter(
      (p) => p.warehouseId === currentUser?.warehouseId
    );

  }, [products, currentUser, isOwner]);

  // ================= FILTER TRANSFERS =================

  const visibleTransfers = useMemo(() => {

    if (isOwner) return transfers;

    return transfers.filter(
      (t) =>
      t.fromWarehouseId === currentUser?.warehouseId ||
      t.toWarehouseId === currentUser?.warehouseId
    );

  }, [transfers, currentUser, isOwner]);

  // ================= CREATE UNIT (OWNER ONLY) =================

  const createUnit = () => {

    if (!isOwner) {
      alert('❌ غير مصرح لك');
      return;
    }

    if (!unitName || !username || !password) {
      alert('⚠ أكمل البيانات');
      return;
    }

    const exists = users.find(
      (u) =>
      u.username?.toLowerCase() === username.toLowerCase()
    );

    if (exists) {
      alert('⚠ اسم المستخدم موجود');
      return;
    }

    const id = Date.now().toString();

    const newUnit = {
      id,
      username,
      password,
      role,
      warehouseId: id,
      warehouseName: unitName,
      permissions,
      active: true,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, newUnit]);

    addNotification('🏭 وحدة جديدة', `تم إنشاء ${unitName}`);

    setUnitName('');
    setUsername('');
    setPassword('');
    setRole('warehouse');

    alert('✅ تم إنشاء الوحدة');
  };

  // ================= DELETE UNIT =================

  const deleteUnit = (id) => {

    if (!isOwner) return;

    const ok = window.confirm('هل تريد حذف الوحدة؟');
    if (!ok) return;

    setUsers(users.filter((u) => u.id !== id));

    addNotification('🗑 حذف', 'تم حذف وحدة');
  };

  // ================= TOGGLE ACTIVE =================

  const toggleActive = (id) => {

    if (!isOwner) return;

    const updated = users.map((u) =>
    u.id === id ? { ...u, active: !u.active } : u
    );

    setUsers(updated);
  };

  // ================= TRANSFER =================

  const handleTransfer = () => {

    if (!productId || !fromWarehouseId || !toWarehouseId || !quantity) {
      alert('أكمل البيانات');
      return;
    }

    const qty = Number(quantity);

    if (qty <= 0) {
      alert('كمية غير صحيحة');
      return;
    }

    transferProductQuantity({
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity: qty
    });

    const product = products.find((p) => p.id === productId);

    addNotification(
      '🚚 تحويل منتج',
      `${product?.name || ''}`
    );

    setProductId('');
    setFromWarehouseId('');
    setToWarehouseId('');
    setQuantity('');

    alert('✅ تم التحويل');
  };

  // ================= UI =================

  return (

    <div className="min-h-screen bg-green text-white p-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-yellow-400">
          🏭 إدارة المخازن
        </h1>

        <p className="text-red-400 mt-2">
          نظام ERP احترافي متعدد الفروع
        </p>
      </div>

      {/* CREATE UNIT (OWNER ONLY) */}
      {isOwner &&

      <div className="bg-slate-900 p-6 rounded-2xl space-y-4">

          <h2 className="text-2xl font-red text-yellow-400">
            ➕ إنشاء وحدة جديدة
          </h2>

          <input
          className="w-full p-3 text-black rounded-xl"
          placeholder="اسم الوحدة"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)} />
        

          <input
          className="w-full p-3 text-black rounded-xl"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
        

          <input
          type={showPassword ? 'text' : 'password'}
          className="w-full p-3 text-black rounded-xl"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        

          <button
          onClick={createUnit}
          className="w-full bg-yellow-500 text-black py-3 rounded-xl font-black">
          
            إنشاء
          </button>

        </div>

      }

      {/* UNITS LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {units.map((u) =>

        <div key={u.id} className="bg-slate-900 p-5 rounded-2xl">

            <div className="text-yellow-400 font-black text-xl">
              {u.warehouseName}
            </div>

            <div>{u.username}</div>

            <div className="text-sm text-gray-400">
              {u.role}
            </div>

            {isOwner &&
          <div className="text-green-400 mt-2">
                🔑 {u.password}
              </div>
          }

            {isOwner &&
          <div className="flex gap-2 mt-4">

                <button
              onClick={() => toggleActive(u.id)}
              className="bg-green-600 px-3 py-2 rounded-xl">
              
                  تفعيل
                </button>

                <button
              onClick={() => deleteUnit(u.id)}
              className="bg-red-600 px-3 py-2 rounded-xl">
              
                  حذف
                </button>

              </div>
          }

          </div>

        )}

      </div>

      {/* SEARCH */}
<div className="bg-slate-900 p-4 rounded-2xl">
  <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث عن وحدة أو مستخدم"
          className="w-full p-3 text-black rounded-xl" />
        
</div>

{/* STATISTICS */}
<div className="grid md:grid-cols-4 gap-4">

  <div className="bg-slate-900 p-5 rounded-2xl">
    <div className="text-gray-400">الوحدات</div>
    <div className="text-3xl font-black text-yellow-400">
      {units.length}
    </div>
  </div>

  <div className="bg-slate-900 p-5 rounded-2xl">
    <div className="text-gray-400">المنتجات</div>
    <div className="text-3xl font-black text-cyan-400">
      {visibleProducts.length}
    </div>
  </div>

  <div className="bg-slate-900 p-5 rounded-2xl">
    <div className="text-gray-400">التحويلات</div>
    <div className="text-3xl font-black text-green-400">
      {visibleTransfers.length}
    </div>
  </div>

  <div className="bg-slate-900 p-5 rounded-2xl">
    <div className="text-gray-400">النشطة</div>
    <div className="text-3xl font-black text-purple-400">
      {units.filter((u) => u.active).length}
    </div>
  </div>

</div>

{/* TRANSFER FORM */}
<div className="bg-slate-900 p-6 rounded-2xl space-y-4">

  <h2 className="text-2xl font-black text-yellow-400">
    🚚 تحويل منتج
  </h2>

  <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full p-3 text-black rounded-xl">
          
    <option value="">اختر المنتج</option>

    {visibleProducts.map((p) =>
          <option key={p.id} value={p.id}>
        {p.name}
      </option>
          )}
  </select>

  <select
          value={fromWarehouseId}
          onChange={(e) => setFromWarehouseId(e.target.value)}
          className="w-full p-3 text-black rounded-xl">
          
    <option value="">من مخزن</option>

    {units.map((u) =>
          <option key={u.id} value={u.warehouseId}>
        {u.warehouseName}
      </option>
          )}
  </select>

  <select
          value={toWarehouseId}
          onChange={(e) => setToWarehouseId(e.target.value)}
          className="w-full p-3 text-black rounded-xl">
          
    <option value="">إلى مخزن</option>

    {units.map((u) =>
          <option key={u.id} value={u.warehouseId}>
        {u.warehouseName}
      </option>
          )}
  </select>

  <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-3 text-black rounded-xl"
          placeholder="الكمية" />
        

  <button
          onClick={handleTransfer}
          className="w-full bg-cyan-600 py-3 rounded-xl font-black">
          
    تنفيذ تحويل
  </button>

</div>

{/* TRANSFER HISTORY */}
<div className="bg-slate-900 p-6 rounded-2xl">

  <h2 className="text-2xl font-black text-yellow-400 mb-4">
    📋 سجل التحويلات
  </h2>

  <div className="overflow-auto">

    <table className="w-full">

      <thead>
        <tr>
          <th className="text-right p-2">الصنف</th>
          <th className="text-right p-2">من</th>
          <th className="text-right p-2">إلى</th>
          <th className="text-right p-2">الكمية</th>
        </tr>
      </thead>

      <tbody>

        {visibleTransfers.
              slice().
              reverse().
              map((t) =>

              <tr
                key={t.id}
                className="border-t border-slate-700">
                

              <td className="p-2">
                {t.productName || t.productId}
              </td>

              <td className="p-2">
                {t.fromWarehouseName || t.fromWarehouseId}
              </td>

              <td className="p-2">
                {t.toWarehouseName || t.toWarehouseId}
              </td>

              <td className="p-2">
                {t.quantity}
              </td>

            </tr>

              )}

      </tbody>

    </table>

  </div>

</div>

    </div>);

}