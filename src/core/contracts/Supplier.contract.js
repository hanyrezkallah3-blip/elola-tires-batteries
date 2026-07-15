// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Supplier.contract.js
// ======================================================

const SupplierContract = {

  // ================= IDENTITY =================

  id: '',

  code: '',

  supplierNumber: '',

  companyName: '',

  contactPerson: '',

  active: true,

  // ================= CONTACT =================

  phone: '',

  whatsapp: '',

  email: '',

  website: '',

  address: '',

  country: '',

  governorate: '',

  city: '',

  district: '',

  // ================= BUSINESS =================

  taxNumber: '',

  commercialRegister: '',

  paymentTerms: '',

  currency: 'EGP',

  creditLimit: 0,

  balance: 0,

  // ================= PRODUCTS =================

  productTypes: [],

  products: [],

  brands: [],

  preferredProducts: [],

  // ================= PURCHASES =================

  totalPurchaseOrders: 0,

  totalPurchasedValue: 0,

  lastPurchaseDate: '',

  averageDeliveryDays: 0,

  onTimeDeliveryRate: 0,

  returnRate: 0,

  qualityScore: 0,

  // ================= PERFORMANCE =================

  performanceScore: 0,

  reliabilityScore: 0,

  responseTime: 0,

  rating: 0,

  // ================= AI =================

  aiScore: 0,

  riskLevel: 'Low',

  recommendations: [],

  demandForecast: {},

  // ================= DOCUMENTS =================

  contracts: [],

  attachments: [],

  notes: '',

  tags: [],

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default SupplierContract