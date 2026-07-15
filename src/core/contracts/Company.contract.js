// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Company.contract.js
// ======================================================

const CompanyContract = {

  // ================= IDENTITY =================

  id: 'company',

  nameArabic: 'شركة العلا للإطارات والبطاريات',

  nameEnglish: 'Elola Company For Tires & Batteries',

  commercialName: '',

  slogan: '',

  active: true,

  // ================= LEGAL =================

  commercialRegister: '',

  taxNumber: '',

  vatNumber: '',

  importLicense: '',

  exportLicense: '',

  // ================= CONTACT =================

  phone: '',

  whatsapp: '',

  email: '',

  website: '',

  // ================= ADDRESS =================

  country: 'Egypt',

  governorate: '',

  city: '',

  district: '',

  address: '',

  latitude: 0,

  longitude: 0,

  // ================= SOCIAL =================

  facebook: '',

  instagram: '',

  youtube: '',

  tiktok: '',

  linkedin: '',

  x: '',

  // ================= BUSINESS =================

  currency: 'EGP',

  language: 'ar',

  timezone: 'Africa/Cairo',

  fiscalYearStart: '01-01',

  // ================= PRODUCTS =================

  supportedProductTypes: [

    'tire',

    'battery',

    'engine_oil',

    'gear_oil',

    'brake_pad',

    'brake_disc',

    'belt',

    'filter',

    'coolant',

    'accessory'

  ],

  // ================= AI =================

  aiEnabled: true,

  aiAssistantName: 'Elola AI',

  aiRecommendations: true,

  aiVehicleAssistant: true,

  aiInventoryPrediction: true,

  aiSalesPrediction: true,

  // ================= REPORTS =================

  reports: {

    daily: true,

    weekly: true,

    monthly: true,

    quarterly: true,

    semiAnnual: true,

    annual: true,

    custom: true

  },

  // ================= SETTINGS =================

  maintenanceMode: false,

  walletSystemEnabled: true,

  cashbackEnabled: true,

  notificationsEnabled: true,

  multiWarehouseEnabled: true,

  erpEnabled: true,

  crmEnabled: true,

  biEnabled: true,

  // ================= BRANDING =================

  logo: '',

  favicon: '',

  primaryColor: '',

  secondaryColor: '',

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default CompanyContract