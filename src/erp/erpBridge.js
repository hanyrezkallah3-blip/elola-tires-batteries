import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'
import { useAnalyticsStore } from '../store/analyticsStore'

import ERPBrain from '../ai/ERPBrain'
import PredictiveERP from '../ai/PredictiveERP'
import SAPSupervisor from '../ai/SAPSupervisor'
import AutonomousERP from '../ai/AutonomousERP'
import AutoPurchaseEngine from '../ai/AutoPurchaseEngine'
import AutoTransferEngine from '../ai/AutoTransferEngine'

class ERPBridge {

  // ================= STORES =================

  static getWebsite() {

    return useWebsiteStore.getState()

  }

  static getInventory() {

    return useInventoryStore.getState()

  }

  static getAnalytics() {

    return useAnalyticsStore.getState()

  }

  // ================= ERP SNAPSHOT =================

  static getSnapshot() {

    const website =
      this.getWebsite()

    const inventory =
      this.getInventory()

    const analytics =
      this.getAnalytics()

    return {

      products:
        website.products || [],

      orders:
        website.orders || [],

      users:
        website.users || [],

      wallets:
        website.wallets || [],

      notifications:
        website.notifications || [],

      warehouses:
        inventory.warehouses || [],

      stockItems:
        inventory.stockItems || [],

      stockMovements:
        inventory.stockMovements || [],

      dashboard:
        analytics.dashboardStats || {},

      erpSummary:
        analytics.erpSummary || {}

    }

  }

  // ================= UPDATE ANALYTICS =================

  static syncAnalytics() {

    const website =
      this.getWebsite()

    const inventory =
      this.getInventory()

    const analytics =
      this.getAnalytics()

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

    return true

  }

  // ================= ERP HEALTH =================

  static getHealth() {

    return SAPSupervisor
      .calculateHealth()

  }

  // ================= ERP REPORT =================

  static generateReport() {

    return {

      health:
        this.getHealth(),

      snapshot:
        this.getSnapshot(),

      supervisor:

        SAPSupervisor
          .generateReport(),

      createdAt:
        new Date().toISOString()

    }

  }

  // ================= ERP BRAIN =================

  static runBrain() {

    if (
      ERPBrain.runAnalysis
    ) {

      return ERPBrain.runAnalysis()

    }

    return null

  }

  // ================= FORECAST =================

  static runForecast() {

    return PredictiveERP
      .generatePurchasePlan()

  }

  // ================= PURCHASE =================

  static runPurchaseEngine() {

    return AutoPurchaseEngine
      .generateOrders()

  }

  // ================= TRANSFER =================

  static runTransferEngine() {

    return AutoTransferEngine
      .analyzeTransfers()

  }

  // ================= FULL ERP =================

  static runERP() {

    const report = {

      brain:
        this.runBrain(),

      forecast:
        this.runForecast(),

      transfers:
        this.runTransferEngine(),

      purchases:
        this.runPurchaseEngine(),

      supervisor:
        SAPSupervisor.runCycle(),

      health:
        this.getHealth()

    }

    this.syncAnalytics()

    useWebsiteStore.setState({

      lastERPExecution:
        new Date().toISOString(),

      lastERPReport:
        report

    })

    return report

  }

  // ================= AUTO ERP =================

  static startAutoERP() {

    return AutonomousERP.start(5)

  }

  static stopAutoERP() {

    return AutonomousERP.stop()

  }

  static getAutoERPStatus() {

    return AutonomousERP.getStatus()

  }

  // ================= COMMAND CENTER =================

  static getCommandCenter() {

    return {

      ERPBrain,

      PredictiveERP,

      SAPSupervisor,

      AutonomousERP,

      AutoPurchaseEngine,

      AutoTransferEngine,

      ERPBridge

    }

  }

}

export default ERPBridge