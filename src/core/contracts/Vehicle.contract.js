// ======================================================
// Elola ERP Enterprise
// src/core/contracts/Vehicle.contract.js
// ======================================================

const VehicleContract = {

  // ================= IDENTITY =================

  id: '',

  customerId: '',

  active: true,

  // ================= BASIC =================

  manufacturer: '',

  brand: '',

  model: '',

  subModel: '',

  year: '',

  generation: '',

  bodyType: '',

  engine: '',

  engineCode: '',

  transmission: '',

  driveType: '',

  fuelType: '',

  vin: '',

  plateNumber: '',

  color: '',

  mileage: 0,

  // ================= TIRE =================

  tire: {

    frontSize: '',

    rearSize: '',

    spareSize: '',

    recommendedPressureFront: '',

    recommendedPressureRear: '',

    recommendedBrands: [],

    recommendedPatterns: []

  },

  // ================= BATTERY =================

  battery: {

    groupSize: '',

    capacity: '',

    cca: '',

    voltage: '',

    polarity: '',

    recommendedBrands: []

  },

  // ================= FLUIDS =================

  engineOil: {

    viscosity: '',

    capacity: '',

    api: '',

    acea: ''

  },

  transmissionOil: {

    type: '',

    capacity: ''

  },

  coolant: {

    type: '',

    capacity: ''

  },

  brakeFluid: {

    type: ''

  },

  powerSteeringFluid: {

    type: ''

  },

  // ================= SERVICE =================

  lastServiceDate: '',

  nextServiceDate: '',

  serviceHistory: [],

  maintenanceSchedule: [],

  // ================= PURCHASE HISTORY =================

  purchasedProducts: [],

  installedProducts: [],

  preferredProducts: [],

  // ================= AI =================

  aiRecommendations: [],

  predictedMaintenance: [],

  compatibilityScore: 100,

  // ================= REPORTS =================

  reports: {

    maintenance: {},

    purchases: {},

    expenses: {},

    performance: {}

  },

  // ================= NOTES =================

  notes: '',

  tags: [],

  attachments: [],

  // ================= AUDIT =================

  createdAt: '',

  updatedAt: '',

  createdBy: '',

  updatedBy: ''

}

export default VehicleContract