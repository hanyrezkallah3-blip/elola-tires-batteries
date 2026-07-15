// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Wallet.contract.js
// ======================================================

const WalletContract = {

  // ================= IDENTITY =================

  id: '',

  walletNumber: '',

  customerId: '',

  customerCode: '',

  customerName: '',

  phone: '',

  active: true,

  // ================= BALANCE =================

  balance: 0,

  totalCashback: 0,

  totalEarned: 0,

  totalSpent: 0,

  totalExpired: 0,

  pendingCashback: 0,

  availableBalance: 0,

  // ================= SETTINGS =================

  cashbackEnabled: true,

  cashbackPercentage: 0,

  allowNegativeBalance: false,

  maxBalance: 0,

  expirationDays: 0,

  // ================= TRANSACTIONS =================

  transactions: [],

  lastTransactionId: '',

  lastTransactionDate: '',

  lastTransactionAmount: 0,

  // ================= STATISTICS =================

  totalOrders: 0,

  totalPurchases: 0,

  averageCashback: 0,

  largestCashback: 0,

  lastOrderId: '',

  // ================= AI =================

  loyaltyScore: 0,

  customerValue: 0,

  predictedBalance: 0,

  recommendations: [],

  fraudScore: 0,

  // ================= REPORTS =================

  monthlyCashback: {},

  yearlyCashback: {},

  customReports: {},

  // ================= AUDIT =================

  notes: '',

  tags: [],

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default WalletContract