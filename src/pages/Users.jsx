import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../store/websiteStore'

const DEFAULT_ROLES = [
  'owner',
  'warehouse',
  'branch',
  'shop',
  'service',
  'cashier'
]

export default function Users() {

  const users =
    useWebsiteStore((s) => s.users || [])

  const setUsers =
    useWebsiteStore((s) => s.setUsers)

  const currentUser =
    useWebsiteStore((s) => s.currentUser)

  const [search, setSearch] = useState('')

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'warehouse',
    warehouseName: ''
  })

  // ================= SECURITY =================

  const isOwner = currentUser?.role === 'owner'

  // ================= FILTER USERS =================

  const filteredUsers = useMemo(() => {

    const q = search.toLowerCase()

    return (users || []).filter((user) => {
      return (
        (user.username || '').toLowerCase().includes(q) ||
        (user.role || '').toLowerCase().includes(q) ||
        (user.warehouseName || '').toLowerCase().includes(q)
      )
    })

  }, [users, search])

  // ================= ADD USER =================

  const addUser = () => {

    if (!isOwner) return

    if (!newUser.username.trim()) return
    if (!newUser.password.trim()) return

    const exists = users.some(
      (u) =>
        u.username?.toLowerCase() === newUser.username.toLowerCase()
    )

    if (exists) {
      alert('المستخدم موجود بالفعل')
      return
    }

    const user = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      warehouseName: newUser.warehouseName,
      permissions: []
    }

    setUsers([...users, user])

    setNewUser({
      username: '',
      password: '',
      role: 'warehouse',
      warehouseName: ''
    })
  }

  // ================= DELETE USER =================

  const deleteUser = (id) => {

    if (!isOwner) return

    const ok = window.confirm('هل تريد حذف المستخدم؟')
    if (!ok) return

    setUsers(users.filter((u) => u.id !== id))
  }

  // ================= ACCESS CONTROL =================

  if (!isOwner) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-xl">
          لا تملك صلاحية الوصول
        </div>
      </div>
    )
  }

  // ================= UI =================

  return (
    <div className="p-6 space-y-6 text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-yellow-400">
          👥 إدارة المستخدمين
        </h1>

        <p className="text-gray-400 mt-2">
          إدارة الحسابات والصلاحيات داخل النظام
        </p>
      </div>

      {/* ADD USER FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">

        <h2 className="text-xl font-bold text-white">
          إضافة مستخدم جديد
        </h2>

        <input
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          placeholder="اسم المستخدم"
          value={newUser.username}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              username: e.target.value
            })
          }
        />

        <input
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          placeholder="كلمة المرور"
          type="password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              password: e.target.value
            })
          }
        />

        <select
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          value={newUser.role}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              role: e.target.value
            })
          }
        >
          {DEFAULT_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <input
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          placeholder="المخزن / الفرع"
          value={newUser.warehouseName}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              warehouseName: e.target.value
            })
          }
        />

        <button
          onClick={addUser}
          className="w-full bg-yellow-500 text-black font-black py-3 rounded-xl"
        >
          إضافة مستخدم
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <input
          className="w-full p-3 rounded-xl bg-black border border-slate-700 text-white"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-auto">

        <table className="w-full text-white">

          <thead>
            <tr className="border-b border-slate-700 text-yellow-400">
              <th className="p-3 text-right">المستخدم</th>
              <th className="p-3 text-right">الدور</th>
              <th className="p-3 text-right">المخزن</th>
              <th className="p-3 text-right">إجراء</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-800">

                <td className="p-3">{user.username}</td>
                <td className="p-3 text-cyan-400">{user.role}</td>
                <td className="p-3 text-gray-300">{user.warehouseName}</td>

                <td className="p-3">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 px-3 py-2 rounded-lg font-bold"
                  >
                    حذف
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}