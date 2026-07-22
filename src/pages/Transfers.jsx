import { useUserStore } from "../store/userStore";import { useMemo, useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { useWebsiteStore } from '../store/websiteStore';

export default function Transfers() {
  const currentUser =
  useUserStore((s) => s.currentUser);

  const warehouses =
  useInventoryStore((s) => s.warehouses || []);

  const stockItems =
  useInventoryStore((s) => s.stockItems || []);

  const transfers =
  useInventoryStore((s) => s.transfers || []);

  const transferStock =
  useInventoryStore((s) => s.transferStock);

  const addNotification =
  useWebsiteStore((s) => s.addNotification);

  const [form, setForm] = useState({
    itemId: '',
    toWarehouseId: '',
    quantity: 1
  });

  const isOwner =
  currentUser?.role === 'owner';

  const selectedItem = useMemo(() => {
    return stockItems.find(
      (i) =>
      String(i.id) ===
      String(form.itemId)
    );
  }, [stockItems, form.itemId]);

  const sourceWarehouse = useMemo(() => {
    return warehouses.find(
      (w) =>
      w.id ===
      selectedItem?.warehouseId
    );
  }, [warehouses, selectedItem]);

  const availableWarehouses =
  useMemo(() => {
    if (!selectedItem) return [];

    return warehouses.filter(
      (w) =>
      w.id !==
      selectedItem.warehouseId
    );
  }, [warehouses, selectedItem]);

  const submitTransfer = () => {
    if (!isOwner) {
      alert('هذه العملية للمالك فقط');
      return;
    }

    if (!form.itemId) {
      alert('اختر الصنف');
      return;
    }

    if (!form.toWarehouseId) {
      alert('اختر الجهة المحول إليها');
      return;
    }

    if (
    Number(form.quantity) <= 0)
    {
      alert('أدخل كمية صحيحة');
      return;
    }

    const result =
    transferStock({
      itemId: form.itemId,
      toWarehouseId:
      form.toWarehouseId,
      quantity: Number(
        form.quantity
      )
    });

    if (!result) {
      alert(
        'فشل التحويل أو الكمية غير متاحة'
      );
      return;
    }

    if (addNotification) {
      addNotification(
        'تحويل مخزني',
        `تم تحويل ${form.quantity} من ${selectedItem?.productName}`
      );
    }

    setForm({
      itemId: '',
      toWarehouseId: '',
      quantity: 1
    });

    alert('تم التحويل بنجاح');
  };

  return (
    <div className="p-6 space-y-6 text-white">

      <div>
        <h1 className="text-3xl font-black text-yellow-400">
          🚚 التحويلات المخزنية
        </h1>

        <p className="text-gray-400 mt-2">
          تحويل المنتجات بين المخازن والفروع والمعارض والموزعين
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">

        <h2 className="text-xl font-bold">
          إنشاء تحويل جديد
        </h2>

        <select
          value={form.itemId}
          onChange={(e) =>
          setForm({
            ...form,
            itemId:
            e.target.value
          })
          }
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white">
          
          <option value="">
            اختر المنتج
          </option>

          {stockItems.map((item) =>
          <option
            key={item.id}
            value={item.id}>
            
              {item.productName}
              {' - '}
              {item.warehouseName}
              {' - '}
              الكمية:
              {' '}
              {item.quantity}
            </option>
          )}
        </select>

        {selectedItem &&
        <div className="bg-black border border-slate-700 rounded-xl p-4">

            <div>
              الصنف:
              {' '}
              {selectedItem.productName}
            </div>

            <div>
              الكمية الحالية:
              {' '}
              {selectedItem.quantity}
            </div>

            <div>
              المصدر:
              {' '}
              {
            selectedItem.warehouseName
            }
            </div>

            <div>
              نوع الجهة:
              {' '}
              {
            sourceWarehouse?.type ||
            'warehouse'
            }
            </div>

          </div>
        }

        <select
          value={form.toWarehouseId}
          onChange={(e) =>
          setForm({
            ...form,
            toWarehouseId:
            e.target.value
          })
          }
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white">
          
          <option value="">
            اختر الجهة المحول إليها
          </option>

          {availableWarehouses.map(
            (warehouse) =>
            <option
              key={warehouse.id}
              value={warehouse.id}>
              
                {warehouse.name}
                {' - '}
                {warehouse.type ===
              'warehouse' ?
              'مخزن' :
              warehouse.type ===
              'branch' ?
              'فرع' :
              warehouse.type ===
              'shop' ?
              'معرض' :
              warehouse.type ===
              'distributor' ?
              'موزع معتمد' :
              warehouse.type}
              </option>

          )}
        </select>

        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) =>
          setForm({
            ...form,
            quantity:
            e.target.value
          })
          }
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          placeholder="الكمية" />
        

        <button
          onClick={submitTransfer}
          className="w-full bg-yellow-500 text-black font-black py-3 rounded-xl">
          
          تنفيذ التحويل
        </button>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-auto">

        <h2 className="text-xl font-bold mb-4">
          سجل التحويلات
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-700 text-yellow-400">
              <th className="p-3 text-right">
                الصنف
              </th>

              <th className="p-3 text-right">
                من
              </th>

              <th className="p-3 text-right">
                إلى
              </th>

              <th className="p-3 text-right">
                الكمية
              </th>

              <th className="p-3 text-right">
                التاريخ
              </th>
            </tr>
          </thead>

          <tbody>

            {(transfers || []).map(
              (transfer) =>
              <tr
                key={transfer.id}
                className="border-b border-slate-800">
                
                  <td className="p-3">
                    {
                  transfer.productName
                  }
                  </td>

                  <td className="p-3 text-cyan-400">
                    {
                  transfer.fromWarehouseName
                  }
                  </td>

                  <td className="p-3 text-green-400">
                    {
                  transfer.toWarehouseName
                  }
                  </td>

                  <td className="p-3">
                    {
                  transfer.quantity
                  }
                  </td>

                  <td className="p-3 text-gray-500">
                    {
                  transfer.createdAt
                  }
                  </td>
                </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>);

}