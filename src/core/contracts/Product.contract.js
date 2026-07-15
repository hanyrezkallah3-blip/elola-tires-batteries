// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Product.contract.js
// ======================================================

const ProductContract = {

  // ================= IDENTITY =================

  id: '',

  code: '',

  barcode: '',

  sku: '',

  name: '',

  slug: '',

  active: true,

  // ================= CATEGORY =================

  categoryId: '',

  categoryName: '',

  type: 'tire',

  brand: '',

  model: '',

  // ================= PRICING =================

  purchasePrice: 0,

  salePrice: 0,

  discountPrice: 0,

  taxRate: 0,

  cost: 0,

  profit: 0,

  profitMargin: 0,

  currency: 'EGP',

  // ================= INVENTORY =================

  quantity: 0,

  minimumStock: 0,

  maximumStock: 0,

  reorderPoint: 0,

  available: true,

  stockStatus: 'available',

  preferredWarehouseId: '',

  stockByWarehouse: [],

  // ================= SUPPLIER =================

  supplierId: '',

  supplierName: '',

  supplierCode: '',

  supplierPartNumber: '',

  // ================= VEHICLE =================

  compatibleVehicles: [],

  compatibleSizes: [],

  // ================= TIRE =================

  tire: {

    width: '',

    height: '',

    rim: '',

    loadIndex: '',

    speedRating: '',

    season: '',

    pattern: '',

    country: '',

    tubeless: true

  },

  // ================= BATTERY =================

  battery: {

    capacity: '',

    cca: '',

    voltage: '',

    polarity: '',

    length: '',

    width: '',

    height: ''

  },

  // ================= OIL =================

  oil: {

    viscosity: '',

    api: '',

    acea: '',

    volume: ''

  },

  // ================= DYNAMIC =================

  attributes: {},

  specifications: {},

  tags: [],

  images: [],

  documents: [],

  notes: '',

  // ================= AI =================

  aiKeywords: [],

  aiDescription: '',

  popularityScore: 0,

  recommendationScore: 0,

  // ================= SEO =================

  seoTitle: '',

  seoDescription: '',

  seoKeywords: [],

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default ProductContract