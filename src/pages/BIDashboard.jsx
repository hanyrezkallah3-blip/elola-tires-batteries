import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

import { useWebsiteStore } from '../store/websiteStore'

export default function BIDashboard() {

  const navigate = useNavigate()

  const store = useWebsiteStore()

  const orders = Array.isArray(store.orders) ? store.orders : []
  const products = Array.isArray(store.products) ? store.products : []
  const transfers = Array.isArray(store.transfers) ? store.transfers : []
  const users = Array.isArray(store.users) ? store.users : []
  const wallets = Array.isArray(store.wallets) ? store.wallets : []
  const walletTransactions = Array.isArray(store.walletTransactions)
    ? store.walletTransactions
    : []

  const walletBalance = useMemo(() => {
    return wallets.reduce(
      (acc, w) => acc + Number(w.balance || 0),
      0
    )
  }, [wallets])

  const walletCashback = useMemo(() => {
    return wallets.reduce(
      (acc, w) => acc + Number(w.totalCashback || 0),
      0
    )
  }, [wallets])

  const lowStockProducts = useMemo(() => {
    return products.filter(
      (p) => Number(p.stock || 0) <= 5
    )
  }, [products])

  const data = useMemo(() => {

    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    )

    const totalStockValue = products.reduce(
      (sum, p) =>
        sum +
        Number(p.price || 0) *
          Number(p.stock || 0),
      0
    )

    return {

      totalRevenue,
      totalStockValue,

      summary: {
        products: products.length,
        orders: orders.length,
        users: users.length,
        lowStock: lowStockProducts.length,
        wallets: wallets.length,
        walletBalance
      },

      revenueTrend: orders.map((o, i) => ({
        name: `طلب ${i + 1}`,
        value: Number(o.total || 0)
      })),

      bestSellingProducts:
        products
          .slice(0, 10)
          .map((p) => ({
            name: p.name || 'منتج',
            sold: Number(p.sold || 0)
          })),

      orderStatusChart: [
        {
          name: 'الطلبات',
          value: orders.length
        },
        {
          name: 'التحويلات',
          value: transfers.length
        },
        {
          name: 'المخزون المنخفض',
          value: lowStockProducts.length
        },
        {
          name: 'المحافظ',
          value: wallets.length
        }
      ],

      lowStockProducts

    }

  }, [
    orders,
    products,
    transfers,
    users,
    wallets,
    walletBalance,
    lowStockProducts
  ])

  const [lastUpdate, setLastUpdate] =
    useState(Date.now())

  useEffect(() => {

    const interval = setInterval(() => {
      setLastUpdate(Date.now())
    }, 4000)

    return () =>
      clearInterval(interval)

  }, [])

  const aiPrediction = useMemo(() => {

    const revenue =
      Number(data.totalRevenue || 0)

    return {

      nextWeekRevenue:
        Math.round(revenue * 1.15),

      expectedOrders:
        Math.ceil(orders.length * 1.2),

      stockRisk:
        lowStockProducts.length,

      walletGrowth:
        Math.round(walletBalance * 1.1),

      recommendation:
        lowStockProducts.length > 5
          ? '⚠ إعادة تخزين عاجلة'
          : walletBalance > 0
            ? '💳 نظام المحافظ نشط'
            : '📊 النظام مستقر'

    }

  }, [
    data,
    orders,
    walletBalance,
    lowStockProducts
  ])

  const COLORS = [
    '#22c55e',
    '#3b82f6',
    '#facc15',
    '#ef4444',
    '#a855f7',
    '#06b6d4'
  ]

  const navItems = [
    {
      name: '🏠 الرئيسية',
      path: '/dashboard',
      color: 'bg-blue-600'
    },
    {
      name: '📦 المنتجات',
      path: '/products',
      color: 'bg-green-600'
    },
    {
      name: '🛒 الطلبات',
      path: '/orders',
      color: 'bg-yellow-600'
    },
    {
      name: '💳 المحافظ',
      path: '/wallets',
      color: 'bg-purple-600'
    },
    {
      name: '🤖 الذكاء الاصطناعي',
      path: '/ai',
      color: 'bg-pink-600'
    }
  ]

  return (

    <div className="min-h-screen bg-black text-white p-4 md:p-10 space-y-10">

      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

        <div>

          <h1 className="text-5xl font-black text-yellow-400 mb-3">
            📊 BI Dashboard PRO
          </h1>

          <p className="text-gray-400 text-lg">
            نظام التحليلات الذكية لشركة العلا
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {navItems.map((item) => (

            <button
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              className={`${item.color} px-4 py-3 rounded-2xl font-bold`}
            >
              {item.name}
            </button>

          ))}

        </div>

      </div>

      <div className="bg-slate-900 p-4 rounded-2xl flex justify-between">

        <div className="text-green-400 font-bold">
          🟢 النظام مباشر
        </div>

        <div className="text-gray-400">
          آخر تحديث:
          {' '}
          {new Date(
            lastUpdate
          ).toLocaleTimeString()}
        </div>

      </div>

      <div className="bg-gradient-to-r from-purple-800 to-blue-800 p-8 rounded-3xl">

        <h2 className="text-3xl font-black text-yellow-300 mb-6">
          🤖 مركز الذكاء الاصطناعي
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-black/30 p-5 rounded-2xl">
            الإيرادات المتوقعة
            <div className="text-3xl font-black text-green-400">
              {aiPrediction.nextWeekRevenue}
            </div>
          </div>

          <div className="bg-black/30 p-5 rounded-2xl">
            الطلبات المتوقعة
            <div className="text-3xl font-black text-yellow-300">
              {aiPrediction.expectedOrders}
            </div>
          </div>

          <div className="bg-black/30 p-5 rounded-2xl">
            نمو المحافظ
            <div className="text-3xl font-black text-purple-300">
              {aiPrediction.walletGrowth}
            </div>
          </div>

          <div className="bg-black/30 p-5 rounded-2xl">
            التوصية
            <div className="text-lg font-black text-red-300">
              {aiPrediction.recommendation}
            </div>
          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-5 gap-4">

        <div className="bg-green-700 p-6 rounded-3xl text-center">
          <div className="text-2xl font-black">
            {data.totalRevenue}
          </div>
          الإيرادات
        </div>

        <div className="bg-blue-700 p-6 rounded-3xl text-center">
          <div className="text-2xl font-black">
            {products.length}
          </div>
          المنتجات
        </div>

        <div className="bg-yellow-600 p-6 rounded-3xl text-center text-black">
          <div className="text-2xl font-black">
            {orders.length}
          </div>
          الطلبات
        </div>

        <div className="bg-purple-700 p-6 rounded-3xl text-center">
          <div className="text-2xl font-black">
            {walletBalance}
          </div>
          المحافظ
        </div>

        <div className="bg-red-700 p-6 rounded-3xl text-center">
          <div className="text-2xl font-black">
            {lowStockProducts.length}
          </div>
          مخزون منخفض
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black mb-5 text-green-400">
            📈 الإيرادات
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenueTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                dataKey="value"
                stroke="#22c55e"
                fill="#22c55e"
              />
            </AreaChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black mb-5 text-blue-400">
            🥇 أفضل المنتجات
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.bestSellingProducts}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black mb-5 text-purple-400">
            🥧 توزيع النظام
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.orderStatusChart}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              >
                {data.orderStatusChart.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="bg-slate-900 p-6 rounded-3xl">

          <h2 className="text-2xl font-black mb-5 text-red-400">
            ⚠ أصناف تحتاج إعادة تخزين
          </h2>

          <div className="space-y-3">

            {lowStockProducts
              .slice(0, 10)
              .map((product) => (

                <div
                  key={product.id}
                  className="bg-slate-800 p-4 rounded-xl flex justify-between"
                >

                  <span>
                    {product.name}
                  </span>

                  <span className="text-red-400 font-black">
                    {product.stock}
                  </span>

                </div>

              ))}

          </div>

        </div>

      </div>

    </div>

  )

}