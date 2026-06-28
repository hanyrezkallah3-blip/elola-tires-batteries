import ERPBrain from './ERPBrain'
import PredictiveERP from './PredictiveERP'
import AutoPurchaseEngine from './AutoPurchaseEngine'
import AutoTransferEngine from './AutoTransferEngine'

import { useInventoryStore } from '../store/inventoryStore'
import { useWebsiteStore } from '../store/websiteStore'
import { useAnalyticsStore } from '../store/analyticsStore'

class SAPSupervisor {

  // ================= SYSTEM STATUS =================

  static getSystemStatus() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const analytics =
      useAnalyticsStore.getState()

    const lowStock =

      inventory.getLowStockItems
        ? inventory.getLowStockItems()
        : []

    return {

      warehouses:
        inventory.warehouses?.length || 0,

      products:
        inventory.stockItems?.length || 0,

      orders:
        website.orders?.length || 0,

      users:
        website.users?.length || 0,

      lowStock:
        lowStock.length,

      wallets:
        website.wallets?.length || 0,

      notifications:
        website.notifications?.length || 0,

      aiEnabled:
        website.aiSystemEnabled,

      erpMode:
        website.erpMode,

      dashboard:
        analytics.dashboardStats

    }

  }

  // ================= ERP HEALTH =================

  static calculateHealth() {

    const status =
      this.getSystemStatus()

    let score = 100

    score -= status.lowStock * 2

    if (!status.aiEnabled)
      score -= 15

    if (status.products === 0)
      score -= 25

    if (status.warehouses === 0)
      score -= 25

    return {

      score:
        Math.max(0, score),

      level:

        score >= 90
          ? 'EXCELLENT'

        : score >= 75
          ? 'GOOD'

        : score >= 50
          ? 'WARNING'

        : 'CRITICAL'

    }

  }

  // ================= ERP DECISIONS =================

  static generateDecisions() {

    const decisions = []

    const health =
      this.calculateHealth()

    const lowStock =
      useInventoryStore
        .getState()
        .getLowStockItems()

    if (lowStock.length > 0) {

      decisions.push({

        type:
          'PURCHASE',

        priority:
          'HIGH',

        title:
          'إعادة شراء الأصناف الناقصة'

      })

    }

    const transfers =
      AutoTransferEngine
        .analyzeTransfers()

    if (transfers.length > 0) {

      decisions.push({

        type:
          'TRANSFER',

        priority:
          'HIGH',

        title:
          'تحويل أصناف بين المخازن'

      })

    }

    if (
      health.level ===
      'CRITICAL'
    ) {

      decisions.push({

        type:
          'ALERT',

        priority:
          'CRITICAL',

        title:
          'النظام يحتاج تدخل فوري'

      })

    }

    return decisions

  }

  // ================= RUN ERP CYCLE =================

  static runCycle() {

    const website =
      useWebsiteStore.getState()

    if (
      !website.aiSystemEnabled
    ) {

      return {

        success: false,

        reason:
          'AI_DISABLED'

      }

    }

    const forecast =

      PredictiveERP
        .generatePurchasePlan()

    const purchases =

      AutoPurchaseEngine
        .generateOrders()

    const transfers =

      AutoTransferEngine
        .analyzeTransfers()

    const decisions =

      this.generateDecisions()

    return {

      success: true,

      forecast,

      purchases,

      transfers,

      decisions,

      health:
        this.calculateHealth()

    }

  }

  // ================= FULL AUTO MODE =================

  static runAutonomousMode() {

    const website =
      useWebsiteStore.getState()

    if (
      website.erpMode !==
      'auto'
    ) {

      return {

        success: false,

        reason:
          'AUTO_MODE_DISABLED'

      }

    }

    AutoTransferEngine
      .executeAllPossibleTransfers()

    AutoPurchaseEngine
      .saveOrders()

    return {

      success: true,

      message:
        'ERP AUTO MODE EXECUTED'

    }

  }

  // ================= ERP REPORT =================

  static generateReport() {

    return {

      status:
        this.getSystemStatus(),

      health:
        this.calculateHealth(),

      decisions:
        this.generateDecisions(),

      createdAt:
        new Date().toISOString()

    }

  }

  // ================= AI COMMAND CENTER =================

  static getCommandCenter() {

    return {

      brain:
        ERPBrain,

      predictor:
        PredictiveERP,

      purchasing:
        AutoPurchaseEngine,

      transfers:
        AutoTransferEngine,

      supervisor:
        SAPSupervisor

    }

  }

}

export default SAPSupervisor