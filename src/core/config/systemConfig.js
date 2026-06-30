// ======================================================
// Elola ERP Enterprise
// System Configuration
// ======================================================

export const SYSTEM_CONFIG = {

  // ================= COMPANY =================

  company: {

    name: 'Elola ERP',

    country: 'Egypt',

    currency: 'EGP',

    language: 'ar',

    timezone: 'Africa/Cairo'

  },

  // ================= TAX =================

  tax: {

    enabled: false,

    percentage: 14,

    includedInPrice: false

  },

  // ================= ORDERS =================

  orders: {

    allowNegativeStock: false,

    autoReserveStock: false,

    cashbackAfterDelivery: true

  },

  // ================= INVENTORY =================

  inventory: {

    lowStockLimit: 5

  },

  // ================= SYSTEM =================

  system: {

    demoMode: false,

    developerMode: false,

    maintenanceMode: false

  }

}