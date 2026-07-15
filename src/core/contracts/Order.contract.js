// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Order.contract.js
// ======================================================

const OrderContract = {

  // ================= IDENTITY =================

  id: '',

  orderNumber: '',

  referenceNumber: '',

  active: true,

  status: 'pending',

  type: 'sale',

  // ================= CUSTOMER =================

  customerId: '',

  customerName: '',

  phone: '',

  email: '',

  address: '',

  vehicleId: '',

  // ================= SALES =================

  salesPersonId: '',

  salesPersonName: '',

  branchId: '',

  warehouseId: '',

  warehouseName: '',

  // ================= ITEMS =================

  items: [

    {

      productId: '',

      code: '',

      barcode: '',

      name: '',

      type: '',

      quantity: 0,

      purchasePrice: 0,

      salePrice: 0,

      discount: 0,

      tax: 0,

      total: 0,

      warehouseId: ''

    }

  ],

  // ================= TOTALS =================

  subTotal: 0,

  discount: 0,

  discountType: 'fixed',

  tax: 0,

  shipping: 0,

  total: 0,

  paid: 0,

  remaining: 0,

  // ================= PAYMENT =================

  paymentMethod: 'cash',

  paymentStatus: 'unpaid',

  walletUsed: 0,

  cashbackEarned: 0,

  // ================= DELIVERY =================

  deliveryMethod: '',

  deliveryStatus: '',

  expectedDeliveryDate: '',

  deliveredAt: '',

  // ================= DOCUMENTS =================

  invoiceNumber: '',

  attachments: [],

  notes: '',

  // ================= AI =================

  aiFraudScore: 0,

  aiProfitScore: 0,

  aiRecommendations: [],

  // ================= REPORTS =================

  reportTags: [],

  analytics: {

    profit: 0,

    margin: 0,

    itemsCount: 0

  },

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: '',

  deletedAt: ''

}

export default OrderContract