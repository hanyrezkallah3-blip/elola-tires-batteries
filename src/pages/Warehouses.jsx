import { useUserStore } from "../store/userStore";import { useProductStore } from "../store/productStore";import { useMemo, useState } from 'react';


export default function Warehouses() {

  const users =
  useUserStore((s) => s.users || []);

  const setUsers =
  useUserStore((s) => s.setUsers);

  const products =
  useProductStore((s) => s.products || []);

  const currentUser =
  useUserStore((s) => s.currentUser);

  const isOwner =
  currentUser?.role === 'owner';

  const [warehouseName, setWarehouseName] =
  useState('');

  const [managerName, setManagerName] =
  useState('');

  const [warehouseType, setWarehouseType] =
  useState('warehouse');

  const [username, setUsername] =
  useState('');

  const [password, setPassword] =
  useState('123456');

  const warehouseUsers = useMemo(() => {

    return users.filter(
      (u) =>
      u.role === 'warehouse' ||
      u.role === 'branch' ||
      u.role === 'shop' ||
      u.role === 'service'
    );

  }, [users]);

  const warehouseStats = useMemo(() => {

    const stats = {};

    warehouseUsers.forEach((user) => {

      const name =
      user.warehouseName ||
      'غير محدد';

      if (!stats[name]) {

        stats[name] = {

          users: 0,

          products: 0,

          type:
          user.warehouseType ||
          user.role,

          username:
          user.username,

          password:
          user.password,

          manager:
          user.managerName ||
          ''

        };

      }

      stats[name].users += 1;

    });

    products.forEach((product) => {

      const name =
      product.warehouseName ||
      'غير محدد';

      if (!stats[name]) {

        stats[name] = {

          users: 0,

          products: 0,

          type: 'warehouse',

          username: '',

          password: '',

          manager: ''

        };

      }

      stats[name].products += 1;

    });

    return stats;

  }, [warehouseUsers, products]);

  const getRoleFromType = (type) => {

    if (type === 'warehouse')
    return 'warehouse';

    if (type === 'branch')
    return 'branch';

    if (type === 'showroom')
    return 'shop';

    if (type === 'distributor')
    return 'service';

    return 'warehouse';

  };

  const getTypeName = (type) => {

    if (type === 'warehouse')
    return '🏭 مخزن';

    if (type === 'branch')
    return '🏢 فرع';

    if (type === 'showroom')
    return '🏪 معرض';

    if (type === 'distributor')
    return '🚚 موزع معتمد';

    return '🏭 مخزن';

  };

  const createWarehouse = () => {

    if (!isOwner) return;

    if (!warehouseName.trim()) {

      alert('ادخل اسم الجهة');

      return;

    }

    const exists = users.some(
      (u) =>
      u.warehouseName ===
      warehouseName.trim()
    );

    if (exists) {

      alert('الجهة موجودة بالفعل');

      return;

    }

    const warehouseId =
    Date.now().toString();

    const newUser = {

      id:
      warehouseId,

      username:
      username.trim() ||
      `user_${warehouseId}`,

      password:
      password.trim() ||
      '123456',

      role:
      getRoleFromType(
        warehouseType
      ),

      warehouseType,

      warehouseId,

      warehouseName:
      warehouseName.trim(),

      managerName:
      managerName.trim(),

      active: true,

      permissions: [

      'warehouse_dashboard',

      'products_view',

      'orders_view',

      'transfers_view',

      'transfers_create']



    };

    setUsers([
    ...users,
    newUser]
    );

    setWarehouseName('');
    setManagerName('');
    setUsername('');
    setPassword('123456');
    setWarehouseType('warehouse');

    alert(
      'تم إنشاء الجهة بنجاح'
    );

  };

  const deleteWarehouse = (
  warehouseName) =>
  {

    if (!isOwner) return;

    const ok =
    window.confirm(
      `حذف ${warehouseName} ؟`
    );

    if (!ok) return;

    const updated =
    users.filter(
      (u) =>
      u.warehouseName !==
      warehouseName
    );

    setUsers(updated);

  };

  if (!isOwner) {

    return (

      <div className="p-6">

        <div
          className="
          bg-red-900/30
          border
          border-red-500
          text-red-300
          p-4
          rounded-xl
        ">






          







          
          لا تملك صلاحية الوصول
        </div>

      </div>);



  }

  return (

    <div
      className="
      p-6
      space-y-6
      text-white
    ">



      




      

      <div>

        <h1
          className="
          text-3xl
          font-black
          text-yellow-400
        ">



          




          
          🏭 إدارة المخازن والفروع
        </h1>

        <p className="text-gray-400">

          إدارة المخازن والفروع والمعارض
          والموزعين المعتمدين

        </p>

      </div>

      <div
        className="
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        p-5
        space-y-4
      ">






        







        

        <h2
          className="
          text-xl
          font-black
        ">


          



          
          إنشاء جهة جديدة
        </h2>

        <select
          value={warehouseType}
          onChange={(e) =>
          setWarehouseType(
            e.target.value
          )
          }
          className="
            w-full
            p-3
            rounded-xl
            bg-black
            border
            border-slate-700
            text-white
          ">







          








          

          <option value="warehouse">
            مخزن
          </option>

          <option value="branch">
            فرع
          </option>

          <option value="showroom">
            معرض
          </option>

          <option value="distributor">
            موزع معتمد
          </option>

        </select>

        <input
          value={warehouseName}
          onChange={(e) =>
          setWarehouseName(
            e.target.value
          )
          }
          placeholder="اسم الجهة"
          className="
            w-full
            p-3
            rounded-xl
            bg-black
            border
            border-slate-700
            text-white
          " />







        








        

        <input
          value={managerName}
          onChange={(e) =>
          setManagerName(
            e.target.value
          )
          }
          placeholder="اسم المسؤول"
          className="
            w-full
            p-3
            rounded-xl
            bg-black
            border
            border-slate-700
            text-white
          " />







        








        

        <input
          value={username}
          onChange={(e) =>
          setUsername(
            e.target.value
          )
          }
          placeholder="اسم المستخدم"
          className="
            w-full
            p-3
            rounded-xl
            bg-black
            border
            border-slate-700
            text-white
          " />







        








        

        <input
          value={password}
          onChange={(e) =>
          setPassword(
            e.target.value
          )
          }
          placeholder="كلمة المرور"
          className="
            w-full
            p-3
            rounded-xl
            bg-black
            border
            border-slate-700
            text-white
          " />







        








        

        <button
          onClick={createWarehouse}
          className="
            w-full
            bg-yellow-500
            text-black
            font-black
            py-3
            rounded-xl
          ">






          







          
          إنشاء
        </button>

      </div>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-4
      ">




        





        

        {Object.entries(
          warehouseStats
        ).map(
          ([name, stats]) =>

          <div
            key={name}
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-2xl
              p-5
            ">





            






            

              <div
              className="
                text-yellow-400
                text-xl
                font-black
              ">



              




              
                {name}
              </div>

              <div className="mt-3">
                {getTypeName(
                stats.type
              )}
              </div>

              <div>
                👤 المسؤول:
                {' '}
                {stats.manager}
              </div>

              <div>
                🔑 المستخدم:
                {' '}
                {stats.username}
              </div>

              <div>
                🔒 كلمة المرور:
                {' '}
                {stats.password}
              </div>

              <div>
                👥 المستخدمون:
                {' '}
                {stats.users}
              </div>

              <div>
                📦 المنتجات:
                {' '}
                {stats.products}
              </div>

              <button
              onClick={() =>
              deleteWarehouse(
                name
              )
              }
              className="
                  mt-4
                  bg-red-600
                  px-4
                  py-2
                  rounded-xl
                  font-bold
                ">






              







              
                حذف
              </button>

            </div>


        )}

      </div>

    </div>);



}