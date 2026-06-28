import { Navigate } from 'react-router-dom'
import { AuthEngine } from './authEngine'

export default function حماية_الصفحة({
  children,
  requiredPermission,
  requiredRole,
  page,
  tenantId
}) {

  // ================= USER =================

  const user = AuthEngine?.getUser?.() || null

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