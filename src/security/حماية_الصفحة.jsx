import { Navigate } from 'react-router-dom'
import { AuthEngine } from './authEngine'
import { useWebsiteStore } from '../store/websiteStore'

export default function حماية_الصفحة({
  children,
  requiredPermission,
  requiredRole,
  page,
  tenantId
}) {

  // ================= HYDRATION GUARD =================

  const hydrated =
    useWebsiteStore((s) => s.hydrated) ?? true

  const user =
    AuthEngine?.getUser?.() || null

  // ================= WAIT UNTIL READY =================

  if (!hydrated) {
    return (
      <div className="p-10 text-white text-xl">
        ⏳ جاري تحميل النظام...
      </div>
    )
  }

  // ================= NO USER =================

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ================= SYSTEM LOCK =================

  if (AuthEngine?.isSystemLocked?.()) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🔒 النظام مغلق من الإدارة
      </div>
    )
  }

  // ================= ACCESS VALIDATION =================

  const allowed = AuthEngine?.validateAccess?.({
    permission: requiredPermission,
    tenantId: tenantId || user?.tenantId
  })

  if (!allowed) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🚫 لا تملك صلاحية الدخول لهذه الصفحة
      </div>
    )
  }

  // ================= ROLE CHECK =================

  if (requiredRole) {
    const roleOk = AuthEngine?.hasRole?.(user, [requiredRole])

    if (!roleOk) {
      return (
        <div className="p-10 text-red-500 text-2xl">
          🚫 دور غير مسموح
        </div>
      )
    }
  }

  // ================= ALLOW ACCESS =================

  return children
}