import { useCoreStore } from '../store/coreStore'
import { useWebsiteStore } from '../store/websiteStore'

export const AuthEngine = {

  // ================= USER =================

  getUser: () =>
    useCoreStore?.getState?.().currentUser ||
    useWebsiteStore?.getState?.().currentUser ||
    null,

  // ================= ROLE CHECK =================

  hasRole: (user, roles = []) => {

    if (!user) return false

    // SAP SUPER ADMIN
    if (user.role === 'owner') return true

    return roles.includes(user.role)
  },

  // ================= PERMISSION CHECK =================

  hasPermission: (permission) => {

    const user = AuthEngine.getUser()

    if (!user) return false

    // OWNER BYPASS

    if (user.role === 'owner')
      return true

    // ALL PERMISSIONS

    if (user.permissions?.includes('all'))
      return true

    // WILDCARD

    if (user.permissions?.includes('*'))
      return true

    return (user.permissions || []).includes(permission)
  },

  // ================= TENANT ACCESS =================

  canAccessTenant: (tenantId) => {

    const user = AuthEngine.getUser()

    if (!user) return false

    // OWNER BYPASS

    if (user.role === 'owner')
      return true

    if (!tenantId)
      return true

    return user.tenantId === tenantId
  },

  // ================= SYSTEM LOCK =================

  isSystemLocked: () => {

    return (
      useCoreStore?.getState?.().systemLocked ||
      false
    )
  },

  // ================= FULL ACCESS VALIDATION =================

  validateAccess: ({
    permission,
    tenantId
  }) => {

    // SYSTEM LOCK

    if (AuthEngine.isSystemLocked())
      return false

    const user =
      AuthEngine.getUser()

    if (!user)
      return false

    // OWNER BYPASS

    if (user.role === 'owner')
      return true

    // PERMISSION CHECK

    const permissionOk =
      permission
        ? AuthEngine.hasPermission(permission)
        : true

    // TENANT CHECK

    const tenantOk =
      tenantId
        ? AuthEngine.canAccessTenant(tenantId)
        : true

    return permissionOk && tenantOk
  }

}