// src/store/constants.js

/**
 * ==========================================================
 * EL OLA ERP
 * Global Constants
 * ----------------------------------------------------------
 * This file contains all application constants.
 * Never hard-code values inside stores or components.
 * ==========================================================
 */

// ==========================================================
// SYSTEM
// ==========================================================

export const APP_NAME = 'EL OLA ERP'

export const APP_VERSION = '6.0.0'

export const DEFAULT_LANGUAGE = 'ar'

export const DEFAULT_CURRENCY = 'EGP'

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

// ==========================================================
// ROLES
// ==========================================================

export const ROLES = {

  OWNER: 'owner',

  ADMIN: 'admin',

  MANAGER: 'manager',

  ACCOUNTANT: 'accountant',

  WAREHOUSE: 'warehouse',

  CASHIER: 'cashier',

  SALES: 'sales',

  EMPLOYEE: 'employee',

  CUSTOMER: 'customer'

}

// ==========================================================
// ORDER STATUS
// ==========================================================

export const ORDER_STATUS = {

  PENDING: 'pending',

  CONFIRMED: 'confirmed',

  PROCESSING: 'processing',

  SHIPPED: 'shipped',

  DELIVERED: 'delivered',

  CANCELLED: 'cancelled'

}

// ==========================================================
// TRANSFER STATUS
// ==========================================================

export const TRANSFER_STATUS = {

  PENDING: 'pending',

  APPROVED: 'approved',

  REJECTED: 'rejected',

  COMPLETED: 'completed'

}

// ==========================================================
// PRODUCT STATUS
// ==========================================================

export const PRODUCT_STATUS = {

  ACTIVE: true,

  INACTIVE: false

}

// ==========================================================
// WALLET
// ==========================================================

export const DEFAULT_CASHBACK_PERCENTAGE = 0

export const DEFAULT_WALLET_BALANCE = 0

export const WALLET_ENABLED = true

// ==========================================================
// INVENTORY
// ==========================================================

export const LOW_STOCK_LIMIT = 5

// ==========================================================
// COMPANY
// ==========================================================

export const DEFAULT_COMPANY = {

  name: 'شركة العلا للإطارات والبطاريات',

  address: '',

  phone: '',

  whatsapp: '',

  email: '',

  website: '',

  facebook: '',

  instagram: '',

  youtube: '',

  logo: ''

}

// ==========================================================
// DEFAULT OWNER
// ==========================================================

export const DEFAULT_OWNER = {

  id: 'owner',

  username: 'owner',

  password: 'owner123',

  fullName: 'System Owner',

  role: ROLES.OWNER,

  active: true,

  permissions: ['*'],

  createdAt: new Date().toISOString()

}

// ==========================================================
// PERMISSIONS
// ==========================================================

export const PERMISSIONS = {

  DASHBOARD: 'dashboard',

  USERS: 'users',

  PERMISSIONS: 'permissions',

  PRODUCTS: 'products',

  ORDERS: 'orders',

  CUSTOMERS: 'customers',

  WALLETS: 'wallets',

  FINANCE: 'finance',

  INVENTORY: 'inventory',

  WAREHOUSES: 'warehouses',

  TRANSFERS: 'transfers',

  OFFERS: 'offers',

  SERVICES: 'services',

  VIDEOS: 'videos',

  SLIDES: 'slides',

  COMPANY: 'company',

  SETTINGS: 'settings',

  ANALYTICS: 'analytics',

  AI: 'ai'

}

// ==========================================================
// ROLE PERMISSIONS
// ==========================================================

export const ROLE_PERMISSIONS = {

  [ROLES.OWNER]: ['*'],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.MANAGER]: [

    PERMISSIONS.DASHBOARD,

    PERMISSIONS.PRODUCTS,

    PERMISSIONS.ORDERS,

    PERMISSIONS.CUSTOMERS,

    PERMISSIONS.INVENTORY,

    PERMISSIONS.WAREHOUSES,

    PERMISSIONS.TRANSFERS,

    PERMISSIONS.ANALYTICS

  ],

  [ROLES.ACCOUNTANT]: [

    PERMISSIONS.DASHBOARD,

    PERMISSIONS.FINANCE,

    PERMISSIONS.WALLETS,

    PERMISSIONS.ANALYTICS

  ],

  [ROLES.WAREHOUSE]: [

    PERMISSIONS.DASHBOARD,

    PERMISSIONS.INVENTORY,

    PERMISSIONS.WAREHOUSES,

    PERMISSIONS.TRANSFERS,

    PERMISSIONS.PRODUCTS

  ],

  [ROLES.CASHIER]: [

    PERMISSIONS.DASHBOARD,

    PERMISSIONS.ORDERS,

    PERMISSIONS.WALLETS

  ],

  [ROLES.SALES]: [

    PERMISSIONS.DASHBOARD,

    PERMISSIONS.PRODUCTS,

    PERMISSIONS.ORDERS,

    PERMISSIONS.CUSTOMERS

  ],

  [ROLES.EMPLOYEE]: [

    PERMISSIONS.DASHBOARD

  ],

  [ROLES.CUSTOMER]: []

}

// ==========================================================
// LOCAL STORAGE KEYS
// ==========================================================

export const STORAGE_KEYS = {

  AUTH: 'elola-auth',

  USERS: 'elola-users',

  PRODUCTS: 'elola-products',

  ORDERS: 'elola-orders',

  WALLETS: 'elola-wallets',

  COMPANY: 'elola-company',

  ERP: 'elola-erp',

  SETTINGS: 'elola-settings'

}

// ==========================================================
// ERP SETTINGS
// ==========================================================

export const ERP_DEFAULT_SETTINGS = {

  autoBackup: true,

  aiEnabled: true,

  walletEnabled: true,

  inventoryTracking: true,

  notificationsEnabled: true,

  maintenanceMode: false

}