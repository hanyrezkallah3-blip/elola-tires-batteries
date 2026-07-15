// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Warehouse.contract.js
// ======================================================

const WarehouseContract = {

  // ================= IDENTITY =================

  id: '',

  code: '',

  name: '',

  type: 'main',

  active: true,

  description: '',

  // ================= LOCATION =================

  country: '',

  governorate: '',

  city: '',

  district: '',

  address: '',

  latitude: 0,

  longitude: 0,

  phone: '',

  email: '',

  manager: '',

  // ================= PRODUCTS =================

  products: [],

  stockItems: [],

  categories: [],

  allowedProductTypes: [],

  // ================= CAPACITY =================

  capacity: 0,

  usedCapacity: 0,

  availableCapacity: 0,

  utilizationRate: 0,

  // ================= INVENTORY =================

  totalProducts: 0,

  totalQuantity: 0,

  inventoryValue: 0,

  minimumStockAlerts: 0,

  outOfStockItems: 0,

  pendingTransfers: 0,

  // ================= OPERATIONS =================

  receivesPurchases: true,

  allowsSales: true,

  allowsTransfers: true,

  allowsReturns: true,

  defaultWarehouse: false,

  // ================= EMPLOYEES =================

  employees: [],

  managerId: '',

  supervisors: [],

  workers: [],

  // ================= SECURITY =================

  allowedUsers: [],

  permissions: [],

  cameras: [],

  alarmsEnabled: false,

  // ================= REPORTS =================

  dailySales: 0,

  monthlySales: 0,

  yearlySales: 0,

  totalOrders: 0,

  totalTransfers: 0,

  performanceScore: 0,

  // ================= AI =================

  aiHealthScore: 0,

  aiRecommendations: [],

  aiForecast: {},

  // ================= AUDIT =================

  notes: '',

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default WarehouseContract