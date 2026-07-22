import { useUserStore } from "../store/userStore";import { useMemo, useState } from 'react';


const ROLE_PERMISSIONS = {
  owner: ['all'],

  warehouse: [
  'warehouse_dashboard',
  'products_view',
  'products_edit',
  'orders_view',
  'transfers_view',
  'transfers_create'],


  branch: [
  'branch_dashboard',
  'products_view',
  'orders_view'],


  shop: [
  'shop_dashboard',
  'products_view',
  'orders_view'],


  service: [
  'service_dashboard',
  'products_view'],


  cashier: [
  'orders_view',
  'orders_create']

};

export default function Permissions() {

  const users =
  useUserStore((s) => s.users || []);

  const setUsers =
  useUserStore((s) => s.setUsers);

  const currentUser =
  useUserStore((s) => s.currentUser);

  const [selectedUserId, setSelectedUserId] = useState('');

  // ================= SECURITY =================

  const isOwner = currentUser?.role === 'owner';

  // ================= SELECT USER =================

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId);
  }, [users, selectedUserId]);

  // ================= AVAILABLE PERMISSIONS =================

  const availablePermissions = useMemo(() => {

    if (!selectedUser) return [];

    return ROLE_PERMISSIONS[selectedUser.role] || [];

  }, [selectedUser]);

  // ================= TOGGLE PERMISSION =================

  const updatePermission = (permission) => {

    if (!selectedUser) return;

    const current = selectedUser.permissions || [];

    const exists = current.includes(permission);

    const updatedUsers = users.map((user) => {

      if (user.id !== selectedUser.id) return user;

      return {
        ...user,
        permissions: exists ?
        current.filter((p) => p !== permission) :
        [...current, permission]
      };
    });

    setUsers(updatedUsers);
  };

  // ================= RESET =================

  const resetRolePermissions = () => {

    if (!selectedUser) return;

    const defaults =
    ROLE_PERMISSIONS[selectedUser.role] || [];

    const updatedUsers = users.map((user) => {

      if (user.id !== selectedUser.id) return user;

      return {
        ...user,
        permissions: [...defaults]
      };
    });

    setUsers(updatedUsers);
  };

  // ================= ACCESS CONTROL =================

  if (!isOwner) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-xl">
          لا تملك صلاحية الوصول لهذه الصفحة
        </div>
      </div>);

  }

  // ================= UI =================

  return (
    <div className="p-6 space-y-6 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-yellow-400">
          🔐 إدارة الصلاحيات
        </h1>

        <p className="text-gray-400 mt-2">
          التحكم الكامل في صلاحيات المستخدمين داخل النظام
        </p>
      </div>

      {/* USER SELECT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <label className="block mb-2 font-bold text-white">
          اختر مستخدم
        </label>

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white">
          
          <option value="">-- اختر --</option>

          {users.map((user) =>
          <option key={user.id} value={user.id}>
              {user.username} ({user.role})
            </option>
          )}
        </select>
      </div>

      {/* PERMISSIONS PANEL */}
      {selectedUser &&
      <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <div className="flex justify-between items-center mb-4">

              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedUser.username}
                </h2>

                <p className="text-gray-400">
                  الدور: {selectedUser.role}
                </p>
              </div>

              <button
              onClick={resetRolePermissions}
              className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold">
              
                إعادة الافتراضي
              </button>

            </div>

            {/* PERMISSIONS LIST */}
            <div className="grid md:grid-cols-2 gap-3">

              {availablePermissions.map((permission) =>

            <label
              key={permission}
              className="flex items-center gap-3 bg-black border border-slate-700 p-3 rounded-xl">
              

                  <input
                type="checkbox"
                checked={(selectedUser.permissions || []).includes(permission)}
                onChange={() => updatePermission(permission)} />
              

                  <span className="text-white">
                    {permission}
                  </span>

                </label>

            )}

            </div>

          </div>

          {/* CURRENT PERMISSIONS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <h3 className="text-lg font-bold mb-3 text-white">
              الصلاحيات الحالية
            </h3>

            <div className="flex flex-wrap gap-2">

              {(selectedUser.permissions || []).map((p) =>
            <span
              key={p}
              className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-sm text-cyan-400">
              
                  {p}
                </span>
            )}

            </div>

          </div>
        </>
      }

    </div>);

}