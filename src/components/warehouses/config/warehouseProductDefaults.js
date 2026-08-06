export const warehouseProductDefaults = {

  // Warehouse

  warehouseId: '',

  // Basic Info

  name: '',
  shortName: '',

  category: '',
  type: '',

  brand: '',
  model: '',

  sku: '',
  barcode: '',

  image: '',

  // Inventory

  quantity: 0,

  unit: 'piece',

  minimumStock: 0,
  maximumStock: 0,
  reorderPoint: 0,

  // Pricing

  purchasePrice: 0,
  shippingCost: 0,
  transportCost: 0,
  customsCost: 0,
  otherCosts: 0,

  wholesalePrice: 0,
  salePrice: 0,

  // Supplier

  supplierId: '',
  supplierName: '',

  // Warehouse Location

  location: '',
  shelf: '',
  rack: '',
  bin: '',

  // Tracking

  batchNumber: '',
  lotNumber: '',
  serialNumbers: '',

  productionDate: '',
  expiryDate: '',

  warranty: '',

  // Description

  description: '',
  specifications: '',
  notes: '',

  // Publishing

  publishToHome: false,
  publishToProducts: true,
  publishToOffers: false,

  featured: false,

  showPrice: true,
  showBrand: true,
  showDescription: true,
  showAvailability: true,

  displayOrder: 0,

  active: true

}