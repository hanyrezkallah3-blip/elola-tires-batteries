// src/store/helpers.js

/**
 * ==========================================================
 * EL OLA ERP
 * Shared Helper Functions
 * ----------------------------------------------------------
 * All stores must use these helpers.
 * Never duplicate helper functions inside stores.
 * ==========================================================
 */

// ===========================
// ID
// ===========================

export const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

// ===========================
// Dates
// ===========================

export const now = () => new Date().toISOString()

export const today = () =>
  new Date().toISOString().split('T')[0]

// ===========================
// Numbers
// ===========================

export const toNumber = (value, fallback = 0) => {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : fallback
}

export const round = (value, decimals = 2) => {
  const number = toNumber(value)

  return Number(number.toFixed(decimals))
}

export const clamp = (value, min = 0, max = Infinity) =>
  Math.min(max, Math.max(min, toNumber(value)))

// ===========================
// Arrays
// ===========================

export const ensureArray = (value) =>
  Array.isArray(value)
    ? value
    : []

export const uniqueBy = (array, key) => {
  const map = new Map()

  ensureArray(array).forEach(item => {
    if (!item) return
    map.set(item[key], item)
  })

  return [...map.values()]
}

// ===========================
// Objects
// ===========================

export const deepClone = (value) =>
  structuredClone(value)

export const isObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value)

// ===========================
// Strings
// ===========================

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true

  return String(value).trim() === ''
}

export const normalizeText = (text) =>
  String(text ?? '')
    .trim()
    .toLowerCase()

// ===========================
// Search
// ===========================

export const contains = (source, keyword) =>
  normalizeText(source).includes(
    normalizeText(keyword)
  )

// ===========================
// Money
// ===========================

export const money = (value) =>
  round(value, 2)

// ===========================
// Percent
// ===========================

export const percent = (
  value,
  total,
  decimals = 2
) => {

  const t = toNumber(total)

  if (t <= 0) return 0

  return round(
    (toNumber(value) / t) * 100,
    decimals
  )
}

// ===========================
// Stock
// ===========================

export const safeStock = (value) =>
  Math.max(0, toNumber(value))

// ===========================
// Wallet
// ===========================

export const safeBalance = (value) =>
  Math.max(0, round(value))

// ===========================
// Random
// ===========================

export const randomColor = () => {

  const colors = [

    '#2563eb',
    '#16a34a',
    '#dc2626',
    '#ca8a04',
    '#7c3aed',
    '#0891b2',
    '#db2777',
    '#ea580c'

  ]

  return colors[
    Math.floor(Math.random() * colors.length)
  ]
}

// ===========================
// Equality
// ===========================

export const shallowEqual = (a, b) => {

  if (Object.is(a, b))
    return true

  if (!isObject(a) || !isObject(b))
    return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length)
    return false

  for (const key of keysA) {

    if (!Object.is(a[key], b[key]))
      return false

  }

  return true
}

// ===========================
// Empty Models
// ===========================

export const createEmptyWallet = () => ({

  id: generateId(),

  customerName: '',

  phone: '',

  balance: 0,

  totalCashback: 0,

  createdAt: now()

})

export const createEmptyOrder = () => ({

  id: generateId(),

  customerName: '',

  phone: '',

  items: [],

  total: 0,

  status: 'pending',

  createdAt: now()

})

export const createEmptyProduct = () => ({

  id: generateId(),

  name: '',

  sku: '',

  category: '',

  brand: '',

  price: 0,

  cost: 0,

  stock: 0,

  sold: 0,

  active: true,

  createdAt: now()

})

export const createEmptyUser = () => ({

  id: generateId(),

  username: '',

  password: '',

  fullName: '',

  role: 'employee',

  active: true,

  permissions: [],

  createdAt: now()

})