// ======================================================
// Elola ERP Enterprise
// ERP Events
// ======================================================

export const ERP_EVENTS = {

  // ================= ORDERS =================

  ORDER_CREATED:
    'order.created',

  ORDER_UPDATED:
    'order.updated',

  ORDER_DELETED:
    'order.deleted',

  ORDER_CANCELLED:
    'order.cancelled',

  ORDER_RETURNED:
    'order.returned',

  // ================= INVENTORY =================

  STOCK_INCREASED:
    'inventory.stock.increased',

  STOCK_DECREASED:
    'inventory.stock.decreased',

  STOCK_TRANSFERRED:
    'inventory.stock.transferred',

  STOCK_ADJUSTED:
    'inventory.stock.adjusted',

  // ================= WALLETS =================

  WALLET_UPDATED:
    'wallet.updated',

  CASHBACK_ADDED:
    'wallet.cashback.added',

  CASHBACK_REVERSED:
    'wallet.cashback.reversed',

  // ================= ACCOUNTING =================

  JOURNAL_CREATED:
    'accounting.journal.created',

  // ================= SYSTEM =================

  BACKUP_CREATED:
    'system.backup.created',

  SYSTEM_RESET:
    'system.reset'

}