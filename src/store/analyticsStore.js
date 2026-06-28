import { create } from 'zustand'

export const useAnalyticsStore = create((set, get) => ({

  // ================= DASHBOARD ANALYTICS =================

  dashboardStats: {

    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,

    totalWalletBalance: 0,
    totalCashback: 0,
    totalWalletTransactions: 0,

    todaySales: 0,
    monthlySales: 0,

    lowStockProducts: 0,

    activeWallets: 0,

    topCustomer: null,
    topProduct: null

  },

  // ================= CHARTS =================

  salesChart: [],
  walletChart: [],
  ordersChart: [],
  lastUpdated: null,

  // ================= KPI =================

  kpi: {

    revenueGrowth: 0,
    orderGrowth: 0,
    stockHealth: 100,
    walletGrowth: 0

  },

  // ================= AI INSIGHTS =================

  aiInsights: {

    salesTrend: 'stable',

    walletTrend: 'stable',

    stockRisk: 'low',

    recommendation: ''

  },

  setAIInsights: (insights = {}) => {

  set((state) => ({

    aiInsights: {

      ...state.aiInsights,

      ...insights

    },

    lastUpdated:
      new Date().toISOString()

  }))

},

  // ================= ERP SUMMARY =================

  erpSummary: {

    warehouses: 0,
    products: 0,
    orders: 0,
    users: 0,
    lowStock: 0,
    criticalStock: 0,
    totalSales: 0,
    totalProfit: 0

  },

  // ================= ERP UPDATE =================

  updateERPSummary: ({

    warehouses = [],
    products = [],
    orders = [],
    users = [],
    stockItems = []

  }) => {

    const totalSales =
      orders.reduce(
        (a, o) => a + Number(o.total || 0),
        0
      )

    const totalProfit =
      totalSales * 0.25

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

    set({

      erpSummary: {

        warehouses: warehouses.length,

        products: products.length,

        orders: orders.length,

        users: users.length,

        lowStock,

        criticalStock,

        totalSales,

        totalProfit

      }

    })

  },

  // ================= UPDATE DASHBOARD =================

  updateDashboardStats: ({

    orders = [],
    products = [],
    wallets = [],
    walletTransactions = []

  }) => {

    const totalSales =
      orders.reduce(

        (acc, order) =>

          acc + Number(order.total || 0),

        0

      )

    const today = new Date().toDateString()

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

            acc + Number(order.total || 0),

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

            acc + Number(order.total || 0),

          0

        )

    const totalWalletBalance =
      wallets.reduce(

        (acc, wallet) =>

          acc + Number(wallet.balance || 0),

        0

      )

    const totalCashback =
      wallets.reduce(

        (acc, wallet) =>

          acc + Number(wallet.totalCashback || 0),

        0

      )

    const lowStockProducts =
      products.filter(

        product =>

          Number(product.stock || 0) <= 5

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

    if (products.length > 0) {

      topProduct =
        [...products].sort(

          (a, b) =>

            Number(b.sold || 0) -

            Number(a.sold || 0)

        )[0]

    }

    const aiInsights = {

      salesTrend:

        totalSales > 100000

          ? 'up'

          : 'stable',

      walletTrend:

        totalWalletBalance > 50000

          ? 'up'

          : 'stable',

      stockRisk:

        lowStockProducts > 5

          ? 'high'

          : 'low',

      recommendation:

        lowStockProducts > 5

          ? 'يفضل إعادة تخزين المنتجات'

          : 'النظام يعمل بكفاءة'

    }

    set({

      dashboardStats: {

        totalSales,

        totalOrders: orders.length,

        totalProducts: products.length,

        totalCustomers: wallets.length,

        totalWalletBalance,

        totalCashback,

        totalWalletTransactions:
          walletTransactions.length,

        todaySales,

        monthlySales,

        lowStockProducts,

        activeWallets,

        topCustomer,

        topProduct

      },

      aiInsights,

      kpi: {

        revenueGrowth:
          monthlySales > 0
            ? Math.round(
                (todaySales / monthlySales) *
                  100
              )
            : 0,

        orderGrowth:
          orders.length,

        stockHealth:
          Math.max(
            0,
            100 - lowStockProducts * 5
          ),

        walletGrowth:
          totalWalletBalance

      }

    })

  },

  // ================= SALES CHART =================

  generateSalesChart: (orders = []) => {
  const grouped = {}

  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString()

    grouped[date] =
      (grouped[date] || 0) + Number(order.total || 0)
  })

  const chart = Object.entries(grouped).map(([date, total]) => ({
    date,
    total
  }))

  set({
    salesChart: chart,
    lastUpdated: new Date().toISOString()
  })
},

    updateAnalytics: (orders = []) => {
  const chart = []

  orders.forEach(order => {
    chart.push({
      date: new Date(order.createdAt).toLocaleDateString(),
      total: Number(order.total || 0)
    })
  })

  set({
    salesChart: chart,
    lastUpdated: new Date().toISOString()
  })
},
  // ================= WALLET CHART =================

  generateWalletChart: (wallets = []) => {

    const chart = []

    wallets.forEach(wallet => {

      chart.push({

        customer:
          wallet.customerName,

        balance:
          Number(wallet.balance || 0)

      })

    })

    set({

  walletChart: chart,

  lastUpdated:
    new Date().toISOString()

})

  },

  // ================= ORDERS CHART =================

  generateOrdersChart: (orders = []) => {

    const chart = orders.map((order, index) => ({

      name: `طلب ${index + 1}`,

      total:
        Number(order.total || 0)

    }))

    set({

  ordersChart: chart,

  lastUpdated:
    new Date().toISOString()

})

  }

,

resetAnalytics: () =>

  set({

    salesChart: [],

    walletChart: [],

    ordersChart: [],

    lastUpdated: null,

    aiInsights: {

      salesTrend: 'stable',

      walletTrend: 'stable',

      stockRisk: 'low',

      recommendation: ''

    }

  })

}))