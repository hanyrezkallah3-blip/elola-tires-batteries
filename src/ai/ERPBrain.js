import { useEffect, useRef } from 'react'
import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'
import { useAnalyticsStore } from '../store/analyticsStore'

// ================= HELPERS =================

function buildERPReport({
  website,
  inventory
}) {
  const orders = website.orders || []
  const stockItems = inventory.stockItems || []

  const lowStock = stockItems.filter(
    item =>
      Number(item.quantity || 0) <=
      Number(item.minQuantity || 5)
  )

  const critical = stockItems.filter(
    item =>
      Number(item.quantity || 0) <= 0
  )

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  )

  const estimatedProfit =
    totalSales * 0.25

  return {
    generatedAt:
      new Date().toISOString(),

    lowStock,

    critical,

    totalSales,

    estimatedProfit,

    recommendation:
      critical.length > 0
        ? 'إعادة التوريد العاجلة مطلوبة'
        : lowStock.length > 0
          ? 'يوجد أصناف تحتاج إعادة تخزين'
          : 'المخزون مستقر'
  }
}

// ================= AI ERP BRAIN =================

export function useERPBrain() {
  const website =
    useWebsiteStore()

  const inventory =
    useInventoryStore()

  const analytics =
    useAnalyticsStore()

  const lastSignature =
    useRef('')

  useEffect(() => {
    const runBrain = () => {
      const report =
        buildERPReport({
          website,
          inventory
        })

      const signature =
        JSON.stringify({
          low:
            report.lowStock.length,

          critical:
            report.critical.length,

          sales:
            Math.round(
              report.totalSales
            )
        })

      if (
        signature !==
        lastSignature.current
      ) {
        lastSignature.current =
          signature

        if (
          report.lowStock.length > 0
        ) {
          website.addNotification?.(
            '⚠️ AI تنبيه مخزون',
            `يوجد ${report.lowStock.length} منتجات تحتاج إعادة تخزين`
          )
        }

        if (
          report.critical.length > 0
        ) {
          website.addNotification?.(
            '🚨 مخزون حرج',
            `يوجد ${report.critical.length} منتجات نفدت تماماً`
          )
        }

        if (
          report.totalSales >
          1000000
        ) {
          website.addNotification?.(
            '📈 أداء عالي',
            'المبيعات مرتفعة جداً'
          )
        }

        if (
          report.estimatedProfit >
          500000
        ) {
          website.addNotification?.(
            '💰 أرباح قوية',
            `الأرباح التقديرية ${Math.round(
              report.estimatedProfit
            )}`
          )
        }
      }

      if (
        analytics &&
        typeof analytics.setAIInsights === 'function'
      ) {
        analytics.setAIInsights({
          salesTrend:
            report.totalSales >
            500000
              ? 'up'
              : 'stable',

          stockRisk:
            report.lowStock.length >
            0
              ? 'high'
              : 'low',

          recommendation:
            report.recommendation,

          lastRun:
            report.generatedAt
        })
      }
    }

    runBrain()

    const interval =
      setInterval(
        runBrain,
        60000
      )

    return () =>
      clearInterval(interval)

  }, [])
}

// ================= MANUAL TRIGGER =================

export function triggerERPBrain() {
  const website =
    useWebsiteStore.getState()

  const inventory =
    useInventoryStore.getState()

  const report =
    buildERPReport({
      website,
      inventory
    })

  website.addNotification?.(
    '🧠 AI Brain Report',
    `منخفض: ${report.lowStock.length} | حرج: ${report.critical.length} | أرباح: ${Math.round(report.estimatedProfit)}`
  )

  return report
}