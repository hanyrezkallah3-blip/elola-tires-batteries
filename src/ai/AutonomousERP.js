import SAPSupervisor from './SAPSupervisor'
import ERPBrain from './ERPBrain'
import PredictiveERP from './PredictiveERP'
import AutoTransferEngine from './AutoTransferEngine'
import AutoPurchaseEngine from './AutoPurchaseEngine'

import { useInventoryStore } from '../store/inventoryStore'
import { useWebsiteStore } from '../store/websiteStore'
import { useAnalyticsStore } from '../store/analyticsStore'

class AutonomousERP {

  static interval = null

  // ================= RUN ONE CYCLE =================

  static executeCycle() {

    const website =
      useWebsiteStore.getState()

    if (
      !website.aiSystemEnabled
    ) {
      return false
    }

    try {

      // ================= ERP BRAIN =================

      const brainResult =

        ERPBrain.runAnalysis
          ? ERPBrain.runAnalysis()
          : null

      // ================= FORECAST =================

      const forecast =

        PredictiveERP.generatePurchasePlan()

      // ================= TRANSFERS =================

      const transferSuggestions =

        AutoTransferEngine
          .analyzeTransfers()

      if (
        website.erpMode ===
        'auto'
      ) {

        AutoTransferEngine
          .executeAllPossibleTransfers()

      }

      // ================= PURCHASES =================

      const purchasePlan =

        AutoPurchaseEngine
          .generateOrders()

      if (
        website.erpMode ===
        'auto'
      ) {

        AutoPurchaseEngine
          .saveOrders()

      }

      // ================= SUPERVISOR =================

      const supervisorResult =

        SAPSupervisor
          .runCycle()

      // ================= ANALYTICS =================

      const inventory =
        useInventoryStore.getState()

      const analytics =
        useAnalyticsStore.getState()

      analytics.updateDashboardStats({

        orders:
          website.orders || [],

        products:
          website.products || [],

        wallets:
          website.wallets || [],

        walletTransactions:
          website.walletTransactions || []

      })

      analytics.updateERPSummary({

        warehouses:
          inventory.warehouses || [],

        products:
          website.products || [],

        orders:
          website.orders || [],

        users:
          website.users || [],

        stockItems:
          inventory.stockItems || []

      })

      // ================= NOTIFICATIONS =================

      if (
        transferSuggestions.length > 0
      ) {

        website.addNotification?.(

          'ERP',

          `تم اكتشاف ${transferSuggestions.length} تحويلات مقترحة`

        )

      }

      if (
        purchasePlan.length > 0
      ) {

        website.addNotification?.(

          'ERP',

          `تم إنشاء ${purchasePlan.length} أوامر شراء`

        )

      }

      // ================= SAVE REPORT =================

      useWebsiteStore.setState({

        autonomousERPReport: {

          lastRun:
            new Date().toISOString(),

          brainResult,

          forecast,

          transferSuggestions,

          purchasePlan,

          supervisorResult

        }

      })

      return true

    } catch (error) {

      console.error(

        'AUTONOMOUS ERP ERROR',

        error

      )

      return false

    }

  }

  // ================= START =================

  static start(intervalMinutes = 5) {

    if (this.interval) {

      clearInterval(
        this.interval
      )

    }

    this.executeCycle()

    this.interval =

      setInterval(

        () => {

          this.executeCycle()

        },

        intervalMinutes *
        60 *
        1000

      )

    return true

  }

  // ================= STOP =================

  static stop() {

    if (this.interval) {

      clearInterval(
        this.interval
      )

      this.interval = null

    }

    return true

  }

  // ================= STATUS =================

  static getStatus() {

    const report =

      useWebsiteStore
        .getState()
        .autonomousERPReport

    return {

      running:
        Boolean(this.interval),

      lastRun:
        report?.lastRun || null,

      report

    }

  }

  // ================= FORCE RUN =================

  static runNow() {

    return this.executeCycle()

  }

}

export default AutonomousERP