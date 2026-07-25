import { useCoreStore } from '../store/coreStore'
import { useWebsiteStore } from '../store/websiteStore'
import { useUserStore } from '../store/userStore'

export const AuthEngine = {

  // ================= STABLE USER =================

  getUser: () => {

  const userStoreUser =
    useUserStore?.getState?.()?.currentUser

  if (userStoreUser) {
    return userStoreUser
  }

  const coreUser =
    useCoreStore?.getState?.()?.currentUser

  if (coreUser) {
    return coreUser
  }

  const websiteUser =
    useWebsiteStore?.getState?.()?.currentUser

  if (websiteUser) {
    return websiteUser
  }

  return null
},

  // ================= ROLE CHECK =================

  hasRole: (user, roles = []) => {

    if (!user) return false

    if (user.role === 'owner') return true

    return roles.includes(user.role)
  },

  // ================= PERMISSION CHECK =================

  hasPermission: (permission) => {

    const user = AuthEngine.getUser()

    if (!user) return false

    if (user.role === 'owner') return true

    const perms = user.permissions || []

    if (perms.includes('all') || perms.includes('*')) {
      return true
    }

    return perms.includes(permission)
  },

  // ================= TENANT =================

  canAccessTenant: (tenantId) => {

    const user = AuthEngine.getUser()

    if (!user) return false

    if (user.role === 'owner') return true

    if (!tenantId) return true

    return user.tenantId === tenantId
  },

  // ================= SYSTEM LOCK =================

  isSystemLocked: () => {
    return useCoreStore?.getState?.()?.systemLocked || false
  },

  // ================= VALIDATION =================

  validateAccess: ({ permission, tenantId }) => {

    if (AuthEngine.isSystemLocked()) return false

    const user = AuthEngine.getUser()

    if (!user) return false

    if (user.role === 'owner') return true

    const permissionOk =
      permission ? AuthEngine.hasPermission(permission) : true

    const tenantOk =
      tenantId ? AuthEngine.canAccessTenant(tenantId) : true

    return permissionOk && tenantOk
  }

}