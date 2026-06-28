// src/store/index.js

/**
 * ==========================================================
 * EL OLA ERP
 * Store Index
 * ----------------------------------------------------------
 * Central export for all Zustand stores.
 * Every store should be imported from this file.
 * ==========================================================
 */

// ===========================
// Core
// ===========================

export * from './authStore'
export * from './userStore'
export * from './permissionStore'

// ===========================
// Catalog
// ===========================

export * from './productStore'
export * from './offerStore'
export * from './serviceStore'
export * from './videoStore'
export * from './slideStore'

// ===========================
// Sales
// ===========================

export * from './orderStore'
export * from './customerStore'
export * from './walletStore'
export * from './financeStore'

// ===========================
// ERP
// ===========================

export * from './warehouseStore'
export * from './inventoryStore'
export * from './transferStore'

// ===========================
// System
// ===========================

export * from './companyStore'
export * from './notificationStore'
export * from './analyticsStore'
export * from './uiStore'


// ===========================
// Shared
// ===========================

export * from './helpers'
export * from './constants'