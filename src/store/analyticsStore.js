import { create } from 'zustand'

export const useAnalyticsStore = create(

(set, get) => ({

// ================= DASHBOARD =================

dashboardStats: {

totalRevenue: 0,

totalSales: 0,

totalOrders: 0,

totalProducts: 0,

totalStock: 0,

inventoryValue: 0,

totalCustomers: 0,

totalWalletBalance: 0,

totalCashback: 0,

totalWalletTransactions: 0,

todaySales: 0,

monthlySales: 0,

lowStockProducts: 0,

criticalStockProducts: 0,

activeWallets: 0,

topCustomer: null,

topProduct: null

},

// ================= ERP =================

erpSummary: {

warehouses: 0,

products: 0,

orders: 0,

users: 0,

stockItems: 0,

totalStock: 0,

inventoryValue: 0,

lowStock: 0,

criticalStock: 0,

totalSales: 0,

totalProfit: 0

},

// ================= KPI =================

kpi: {

revenueGrowth: 0,

orderGrowth: 0,

stockHealth: 100,

walletGrowth: 0,

inventoryTurnover: 0,

averageOrder: 0

},

// ================= CHARTS =================

salesChart: [],

walletChart: [],

ordersChart: [],

stockChart: [],

warehouseChart: [],

// ================= AI =================

aiInsights: {

salesTrend: 'stable',

walletTrend: 'stable',

stockRisk: 'low',

recommendation: '',

warehouseStatus: 'normal'

},

lastUpdated: null,

// ================= AI =================

setAIInsights: (

insights = {}

) =>

set((state) => ({

aiInsights: {

...state.aiInsights,

...insights

},

lastUpdated:

new Date().toISOString()

})),

// ================= RESET =================

resetAnalytics: () =>

set({

salesChart: [],

walletChart: [],

ordersChart: [],

stockChart: [],

warehouseChart: [],

lastUpdated: null,

aiInsights: {

salesTrend: 'stable',

walletTrend: 'stable',

stockRisk: 'low',

recommendation: '',

warehouseStatus: 'normal'

}

}),
// ================= UPDATE DASHBOARD =================

updateDashboardStats: ({

orders = [],

products = [],

stockItems = [],

wallets = [],

walletTransactions = [],

warehouses = []

}) => {

const totalRevenue =

orders.reduce(

(acc, order) =>

acc + Number(order.total || 0),

0

)

const totalSales =

stockItems.reduce(

(acc, item) =>

acc + Number(item.sold || 0),

0

)

const totalStock =

stockItems.reduce(

(acc, item) =>

acc + Number(item.quantity || 0),

0

)

const inventoryValue =

stockItems.reduce(

(acc, item) =>

acc +

Number(item.quantity || 0) *

Number(item.price || 0),

0

)

const today =

new Date().toDateString()

const todaySales =

orders

.filter(

order =>

new Date(

order.createdAt

).toDateString() === today

)

.reduce(

(acc, order) =>

acc +

Number(order.total || 0),

0

)

const currentMonth =

new Date().getMonth()

const monthlySales =

orders

.filter(

order =>

new Date(

order.createdAt

).getMonth() === currentMonth

)

.reduce(

(acc, order) =>

acc +

Number(order.total || 0),

0

)

const totalWalletBalance =

wallets.reduce(

(acc, wallet) =>

acc +

Number(wallet.balance || 0),

0

)

const totalCashback =

wallets.reduce(

(acc, wallet) =>

acc +

Number(wallet.totalCashback || 0),

0

)

const lowStockProducts =

stockItems.filter(

item =>

Number(item.quantity || 0) <=

Number(item.minQuantity || 5)

).length

const criticalStockProducts =

stockItems.filter(

item =>

Number(item.quantity || 0) <= 0

).length

const activeWallets =

wallets.filter(

wallet =>

Number(wallet.balance || 0) > 0

).length
let topCustomer = null

if (wallets.length > 0) {

  topCustomer =

    [...wallets].sort(

      (a, b) =>

        Number(b.balance || 0) -

        Number(a.balance || 0)

    )[0]

}

let topProduct = null

if (stockItems.length > 0) {

  topProduct =

    [...stockItems].sort(

      (a, b) =>

        Number(b.sold || 0) -

        Number(a.sold || 0)

    )[0]

}

const aiInsights = {

  salesTrend:

    totalRevenue > 100000

      ? 'up'

      : 'stable',

  walletTrend:

    totalWalletBalance > 50000

      ? 'up'

      : 'stable',

  stockRisk:

    criticalStockProducts > 0

      ? 'high'

      : lowStockProducts > 5

      ? 'medium'

      : 'low',

  warehouseStatus:

    warehouses.length > 1

      ? 'multi'

      : 'single',

  recommendation:

    criticalStockProducts > 0

      ? 'يوجد منتجات نفدت من المخزون'

      : lowStockProducts > 5

      ? 'يفضل إعادة تخزين المنتجات'

      : 'المخزون يعمل بكفاءة'

}

const newDashboardStats = {

  totalRevenue,

  totalSales,

  totalOrders: orders.length,

  totalProducts: products.length,

  totalStock,

  inventoryValue,

  totalCustomers: wallets.length,

  totalWalletBalance,

  totalCashback,

  totalWalletTransactions: walletTransactions.length,

  todaySales,

  monthlySales,

  lowStockProducts,

  criticalStockProducts,

  activeWallets,

  topCustomer,

  topProduct

}

const newKPI = {

  revenueGrowth:

    monthlySales > 0

      ? Math.round(

          (todaySales /

            monthlySales) *

            100

        )

      : 0,

  orderGrowth:

    orders.length,

  stockHealth:

    Math.max(

      0,

      100 -

        criticalStockProducts * 20 -

        lowStockProducts * 5

    ),

  walletGrowth:

    totalWalletBalance,

  inventoryTurnover:

    totalSales,

  averageOrder:

    orders.length

      ? Math.round(

          totalRevenue /

            orders.length

        )

      : 0

}

const state = get()

if (

  JSON.stringify(state.dashboardStats) ===

    JSON.stringify(newDashboardStats) &&

  JSON.stringify(state.kpi) ===

    JSON.stringify(newKPI) &&

  JSON.stringify(state.aiInsights) ===

    JSON.stringify(aiInsights)

) {

  return

}

set({

  dashboardStats: newDashboardStats,

  aiInsights,

  kpi: newKPI,

  lastUpdated: new Date().toISOString()

})

},
// ================= ERP SUMMARY =================

updateERPSummary: ({

  warehouses = [],

  products = [],

  orders = [],

  users = [],

  stockItems = []

}) => {

  const totalSales =

    orders.reduce(

      (acc, order) =>

        acc +

        Number(order.total || 0),

      0

    )

  const inventoryValue =

    stockItems.reduce(

      (acc, item) =>

        acc +

        Number(item.quantity || 0) *

        Number(item.price || 0),

      0

    )

  const totalStock =

    stockItems.reduce(

      (acc, item) =>

        acc +

        Number(item.quantity || 0),

      0

    )

  const lowStock =

    stockItems.filter(

      item =>

        Number(item.quantity || 0) <=

        Number(item.minQuantity || 5)

    ).length

  const criticalStock =

    stockItems.filter(

      item =>

        Number(item.quantity || 0) <= 0

    ).length

  const totalProfit =

    totalSales * 0.25

  const newERPSummary = {

  warehouses: warehouses.length,

  products: products.length,

  orders: orders.length,

  users: users.length,

  stockItems: stockItems.length,

  totalStock,

  inventoryValue,

  lowStock,

  criticalStock,

  totalSales,

  totalProfit

}

const state = get()

if (

  JSON.stringify(state.erpSummary) ===

  JSON.stringify(newERPSummary)

) {

  return

}

set({

  erpSummary: newERPSummary,

  lastUpdated: new Date().toISOString()

})

},
// ================= SALES CHART =================

generateSalesChart: (orders = []) => {

  const grouped = {}

  orders.forEach((order) => {

    const date =
      new Date(
        order.createdAt
      ).toLocaleDateString()

    grouped[date] =
      (grouped[date] || 0) +
      Number(order.total || 0)

  })

  const chart =

    Object.entries(grouped).map(

      ([date, total]) => ({

        date,

        total

      })

    )

  set({

    salesChart: chart,

    lastUpdated:
      new Date().toISOString()

  })

},

// ================= WALLET CHART =================

generateWalletChart: (wallets = []) => {

  const chart =

    wallets.map((wallet) => ({

      customer:
        wallet.customerName,

      balance:
        Number(wallet.balance || 0)

    }))

  set({

    walletChart: chart,

    lastUpdated:
      new Date().toISOString()

  })

},

// ================= ORDERS CHART =================

generateOrdersChart: (orders = []) => {

  const chart =

    orders.map((order, index) => ({

      name:
        `طلب ${index + 1}`,

      total:
        Number(order.total || 0)

    }))

  set({

    ordersChart: chart,

    lastUpdated:
      new Date().toISOString()

  })

},

// ================= STOCK CHART =================

generateStockChart: (stockItems = []) => {

  const chart =

    stockItems.map((item) => ({

      name:
        item.productName,

      quantity:
        Number(item.quantity || 0)

    }))

  set({

    stockChart: chart,

    lastUpdated:
      new Date().toISOString()

  })

},

// ================= WAREHOUSE CHART =================

generateWarehouseChart: (

  warehouses = [],

  stockItems = []

) => {

  const chart =

    warehouses.map((warehouse) => ({

      warehouse:

        warehouse.name,

      quantity:

        stockItems

          .filter(

            (item) =>

              item.warehouseId ===

              warehouse.id

          )

          .reduce(

            (acc, item) =>

              acc +

              Number(item.quantity || 0),

            0

          )

    }))

  set({

    warehouseChart: chart,

    lastUpdated:
      new Date().toISOString()

  })

}

})

)