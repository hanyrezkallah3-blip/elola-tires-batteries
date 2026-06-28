import { useEffect, useRef } from 'react'
import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'
import { useAnalyticsStore } from '../store/analyticsStore'

// ================= HELPERS =================

function buildERPReport({ website, inventory }) {

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

  return {

    generatedAt:
      new Date().toISOString(),

    lowStock,

    critical,

    totalSales,

    estimatedProfit:
      totalSales * 0.25

  }

}

// ================= ERP BRAIN =================

export function useERPBrain() {

  const addNotification =
    useWebsiteStore(
      s => s.addNotification
    )

  const setAIInsights =
    useAnalyticsStore(
      s => s.setAIInsights
    )

  const lastSignature =
    useRef('')

  const initialized =
    useRef(false)

  useEffect(() => {

    const runBrain = () => {

      const orders =
        useWebsiteStore
          .getState()
          .orders || []

      const stockItems =
        useInventoryStore
          .getState()
          .stockItems || []

      const report =
        buildERPReport({

          website: {
            orders
          },

          inventory: {
            stockItems
          }

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
        signature ===
        lastSignature.current
      ) {
        return
      }

      lastSignature.current =
        signature

      // ================= FIRST RUN =================

      if (!initialized.current) {

        initialized.current = true

      } else {

        if (
          report.lowStock.length > 0
        ) {

          addNotification?.(

            '⚠️ AI تنبيه مخزون',

            `يوجد ${report.lowStock.length} منتجات تحتاج إعادة تخزين`

          )

        }

        if (
          report.critical.length > 0
        ) {

          addNotification?.(

            '🚨 مخزون حرج',

            `يوجد ${report.critical.length} منتجات نفدت تماماً`

          )

        }

        if (
          report.totalSales >
          1000000
        ) {

          addNotification?.(

            '📈 أداء عالي',

            'المبيعات مرتفعة جداً'

          )

        }

      }

      setAIInsights?.({

        salesTrend:

          report.totalSales >
          500000

            ? 'up'

            : 'stable',

        stockRisk:

          report.lowStock.length > 0

            ? 'high'

            : 'low',

        lastRun:
          report.generatedAt

      })

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

      website: {

        orders:
          website.orders || []

      },

      inventory: {

        stockItems:
          inventory.stockItems || []

      }

    })

  website.addNotification?.(

    '🧠 AI Brain Report',

    `منخفض: ${report.lowStock.length} | حرج: ${report.critical.length} | أرباح: ${Math.round(report.estimatedProfit)}`

  )

  return report

}