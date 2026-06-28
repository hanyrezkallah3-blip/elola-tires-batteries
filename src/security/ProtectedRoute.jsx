import { AuthEngine } from './authEngine'
import { useCoreStore } from '../store/coreStore'

export default function ProtectedRoute({
  children,
  permission,
  role,
  tenantId
}) {
  const currentTenantId = useCoreStore(
    (state) => state.currentTenantId
  )

  const user = AuthEngine.getUser()

  const resolvedTenantId =
    tenantId ||
    currentTenantId ||
    user?.tenantId ||
    null

  if (!user) {
    return (
      <div className="p-10 text-red-500 text-xl">
        🚫 يجب تسجيل الدخول
      </div>
    )
  }

  if (AuthEngine.isSystemLocked()) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🔒 النظام مغلق من الإدارة
      </div>
    )
  }

  if (role && !AuthEngine.hasRole(user, [role])) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🚫 لا تملك الصلاحية
      </div>
    )
  }

  if (
    permission &&
    !AuthEngine.hasPermission(permission)
  ) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🚫 لا تملك صلاحية الوصول
      </div>
    )
  }

  if (
    resolvedTenantId &&
    !AuthEngine.canAccessTenant(resolvedTenantId)
  ) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        🚫 غير مسموح لهذا الفرع
      </div>
    )
  }

  return children
}