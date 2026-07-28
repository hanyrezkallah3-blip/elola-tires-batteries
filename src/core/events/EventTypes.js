// ======================================================
// EL OLA ERP
// Event Types
// ======================================================

export const EventTypes = {

  // ===============================
  // VEHICLES
  // ===============================

  VEHICLE_SEARCH:
    'vehicle_search',

  VEHICLE_RESULT_FOUND:
    'vehicle_result_found',

  VEHICLE_RESULT_NOT_FOUND:
    'vehicle_result_not_found',

  // ===============================
  // PRODUCTS
  // ===============================

  PRODUCT_VIEW:
    'product_view',

  PRODUCT_SEARCH:
    'product_search',

  PRODUCT_CREATED:
    'product_created',

  PRODUCT_UPDATED:
    'product_updated',

  PRODUCT_DELETED:
    'product_deleted',

  PRODUCT_OUT_OF_STOCK:
    'product_out_of_stock',

  // ===============================
  // CART
  // ===============================

  CART_ADD:
    'cart_add',

  CART_REMOVE:
    'cart_remove',

  CART_CLEAR:
    'cart_clear',

  // ===============================
  // ORDERS
  // ===============================

  ORDER_CREATED:
    'order_created',

  ORDER_CANCELLED:
    'order_cancelled',

  ORDER_COMPLETED:
    'order_completed',

  ORDER_RETURNED:
    'order_returned',

  // ===============================
  // INVENTORY
  // ===============================

  STOCK_INCREASE:
    'stock_increase',

  STOCK_DECREASE:
    'stock_decrease',

  STOCK_TRANSFER:
    'stock_transfer',

  LOW_STOCK:
    'low_stock',

  // ===============================
  // WALLET
  // ===============================

  CASHBACK_GRANTED:
    'cashback_granted',

  WALLET_ADD:
    'wallet_add',

  WALLET_DEDUCT:
    'wallet_deduct',

  // ===============================
  // USERS
  // ===============================

  USER_LOGIN:
    'user_login',

  USER_LOGOUT:
    'user_logout',

  CUSTOMER_REGISTER:
    'customer_register',

  // ===============================
  // AI
  // ===============================

  AI_RECOMMENDATION:
    'ai_recommendation',

  AI_WARNING:
    'ai_warning'

}

export default EventTypes