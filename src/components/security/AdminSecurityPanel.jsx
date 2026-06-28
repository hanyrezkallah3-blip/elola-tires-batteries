import { useMemo, useState } from 'react'
import { useWebsiteStore } from '../../store/websiteStore'

export default function AdminSecurityPanel() {

  // ================= STORE =================

  const users = useWebsiteStore(s => s.users || [])
  const auditLogs = useWebsiteStore(s => s.auditLogs || [])
  const notifications = useWebsiteStore(s => s.notifications || [])
  const currentUser = useWebsiteStore(s => s.currentUser)

  const addNotification = useWebsiteStore(s => s.addNotification)

  // ================= STATES =================

  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('users')

  // ================= SECURITY CHECK =================

  const isOwner = currentUser?.role === 'owner'

  // ================= FILTER USERS =================

  const filteredUsers = useMemo(() => {

    return (users || []).filter(u =>
      (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(search.toLowerCase())
    )

  }, [users, search])

  // ================= STATS =================

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.active).length
  const logsCount = auditLogs.length
  const notificationsCount = notifications.length

  // ================= DELETE USER =================

  const deleteUser = (id) => {

    if (!isOwner) {
      alert('❌ غير مصرح')
      return
    }

    const ok = window.confirm('هل تريد حذف المستخدم؟')
    if (!ok) return

    const updated = users.filter(u => u.id !== id)

    useWebsiteStore.setState({ users: updated })

    addNotification?.('🗑 حذف مستخدم', 'تم حذف مستخدم بنجاح')
  }

  // ================= TOGGLE USER =================

  const toggleUser = (id) => {

    const updated = users.map(u =>
      u.id === id ? { ...u, active: !u.active } : u
    )

    useWebsiteStore.setState({ users: updated })

  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-10">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-700 to-purple-800 p-8 rounded-3xl">
        <h1 className="text-4xl font-black">
          🔐 Security Control Center
        </h1>
        <p className="text-white/70 mt-2">
          نظام إدارة الأمان والصلاحيات (Enterprise Level)
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        <Stat title="👥 المستخدمين" value={totalUsers} color="blue" />
        <Stat title="🟢 النشطين" value={activeUsers} color="green" />
        <Stat title="📜 السجلات" value={logsCount} color="yellow" />
        <Stat title="🔔 التنبيهات" value={notificationsCount} color="red" />

      </div>

      {/* TABS */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'users' ? 'bg-red-600' : 'bg-slate-800'}`}
        >
          👥 المستخدمين
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 rounded-xl font-bold ${activeTab === 'logs' ? 'bg-red-600' : 'bg-slate-800'}`}
        >
          📜 السجلات
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 بحث عن مستخدم..."
        className="w-full p-4 rounded-2xl text-black"
      />

      {/* USERS */}
      {activeTab === 'users' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredUsers.map(user => (
            <div key={user.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-700">

              <div className="flex justify-between items-center">

                <div>
                  <div className="text-xl font-black text-yellow-400">
                    {user.username}
                  </div>
                  <div className="text-gray-400">
                    {user.role}
                  </div>
                </div>

                <div className={`px-3 py-2 rounded-xl font-bold ${user.active ? 'bg-green-600' : 'bg-red-600'}`}>
                  {user.active ? 'نشط' : 'معطل'}
                </div>

              </div>

              <div className="mt-4 text-sm text-gray-400">
                🏭 {user.warehouseName}
              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => toggleUser(user.id)}
                  className="flex-1 bg-yellow-500 text-black py-2 rounded-xl font-bold"
                >
                  تبديل الحالة
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="flex-1 bg-red-600 py-2 rounded-xl font-bold"
                >
                  حذف
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">

          {auditLogs.length === 0 && (
            <div className="text-gray-500 text-center">
              لا توجد سجلات
            </div>
          )}

          {auditLogs.map(log => (
            <div key={log.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700">

              <div className="font-bold text-yellow-400">
                {log.action}
              </div>

              <div className="text-gray-300">
                {log.user} → {log.details}
              </div>

              <div className="text-sm text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

// ================= STAT CARD =================

function Stat({ title, value, color }) {

  const colors = {
    blue: 'border-blue-500 text-blue-400',
    green: 'border-green-500 text-green-400',
    yellow: 'border-yellow-500 text-yellow-400',
    red: 'border-red-500 text-red-400'
  }

  return (
    <div className={`bg-slate-900 p-5 rounded-2xl border ${colors[color]}`}>
      <div className="font-bold">{title}</div>
      <div className="text-3xl font-black mt-3">
        {value}
      </div>
    </div>
  )
}