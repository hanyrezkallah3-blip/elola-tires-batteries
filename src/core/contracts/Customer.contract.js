// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Customer.contract.js
// ======================================================

const CustomerContract = {

  // ================= IDENTITY =================

  id: '',

  code: '',

  customerNumber: '',

  name: '',

  companyName: '',

  active: true,

  // ================= CONTACT =================

  phone: '',

  whatsapp: '',

  email: '',

  address: '',

  country: '',

  governorate: '',

  city: '',

  district: '',

  // ================= VEHICLES =================

  vehicles: [],

  defaultVehicleId: '',

  // ================= WALLET =================

  walletId: '',

  walletBalance: 0,

  totalCashback: 0,

  loyaltyPoints: 0,

  loyaltyLevel: 'Bronze',

  // ================= SALES =================

  totalOrders: 0,

  totalInvoices: 0,

  totalReturns: 0,

  totalSpent: 0,

  averageOrderValue: 0,

  lastOrderDate: '',

  // ================= PRODUCTS =================

  favoriteProducts: [],

  purchaseHistory: [],

  // ================= AI =================

  aiScore: 0,

  customerValue: 0,

  riskLevel: 'Low',

  recommendations: [],

  predictedNeeds: [],

  // ================= REPORTS =================

  reports: {

    daily: {},

    weekly: {},

    monthly: {},

    quarterly: {},

    semiAnnual: {},

    annual: {},

    custom: {}

  },

  // ================= CRM =================

  notes: '',

  tags: [],

  assignedEmployee: '',

  preferredContactMethod: 'phone',

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default CustomerContract