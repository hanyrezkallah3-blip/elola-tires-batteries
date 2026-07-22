export const STORE_MAP = {

  products: {

    hook: 'useProductStore',

    store: 'productStore'

  },

  orders: {

    hook: 'useOrderStore',

    store: 'orderStore'

  },

  users: {

    hook: 'useUserStore',

    store: 'userStore'

  },

  currentUser: {

    hook: 'useUserStore',

    store: 'userStore'

  },

  wallets: {

    hook: 'useWalletStore',

    store: 'walletStore'

  },

  walletTransactions: {

    hook: 'useWalletStore',

    store: 'walletStore'

  },

  walletEnabled: {

    hook: 'useWalletStore',

    store: 'walletStore'

  },

  cashbackPercentage: {

    hook: 'useWalletStore',

    store: 'walletStore'

  },

  warehouses: {

    hook: 'useInventoryStore',

    store: 'inventoryStore'

  },

  stockItems: {

    hook: 'useInventoryStore',

    store: 'inventoryStore'

  },

  inventory: {

    hook: 'useInventoryStore',

    store: 'inventoryStore'

  },

  analytics: {

    hook: 'useAnalyticsStore',

    store: 'analyticsStore'

  },

  reports: {

    hook: 'useAnalyticsStore',

    store: 'analyticsStore'

  },

  permissions: {

    hook: 'usePermissionStore',

    store: 'permissionStore'

  },

  company: {

    hook: 'useCompanyStore',

    store: 'companyStore'

  },

  settings: {

    hook: 'useSettingsStore',

    store: 'settingsStore'

  }

}

export function resolveStore(property) {

  return STORE_MAP[property] || null

}