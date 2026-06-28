import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'

class PredictiveERP {

  // ================= SALES FORECAST =================

  static forecastMonthlyRevenue() {

    const website =
      useWebsiteStore.getState()

    const orders =
      website.orders || []

    if (!orders.length)
      return 0

    const totalRevenue =
      orders.reduce(

        (acc, order) =>

          acc +
          Number(order.total || 0),

        0

      )

    const averageOrderValue =

      totalRevenue /
      orders.length

    return Math.round(

      averageOrderValue *

      orders.length *

      1.15

    )

  }

  // ================= DEMAND FORECAST =================

  static forecastDemand(days = 30) {

    const website =
      useWebsiteStore.getState()

    const products =
      website.products || []

    return products.map(

      product => {

        const sold =
          Number(
            product.sold || 0
          )

        const demand =

          Math.ceil(

            (sold / 30) *

            days

          )

        return {

          productId:
            product.id,

          productName:
            product.name,

          predictedDemand:
            demand

        }

      }

    )

  }

  // ================= STOCK EXPIRY =================

  static forecastStockOut() {

    const inventory =
      useInventoryStore.getState()

    const items =
      inventory.stockItems || []

    return items.map(

      item => {

        const sold =
          Number(
            item.sold || 1
          )

        const stock =
          Number(
            item.quantity || 0
          )

        const estimatedDays =

          sold <= 0

            ? 999

            : Math.floor(

                stock /

                (sold / 30)

              )

        return {

          productId:
            item.productId,

          productName:
            item.productName,

          warehouseId:
            item.warehouseId,

          daysRemaining:
            estimatedDays

        }

      }

    )

  }

  // ================= PURCHASE PLAN =================

  static generatePurchasePlan() {

    const demand =
      this.forecastDemand(60)

    const inventory =
      useInventoryStore.getState()

    const stock =
      inventory.stockItems || []

    return demand.map(

      prediction => {

        const currentStock =

          stock.find(

            item =>

              item.productId ===

              prediction.productId

          )

        const available =

          Number(

            currentStock?.quantity || 0

          )

        return {

          productId:
            prediction.productId,

          productName:
            prediction.productName,

          currentStock:
            available,

          expectedDemand:

            prediction.predictedDemand,

          suggestedPurchase:

            Math.max(

              0,

              prediction.predictedDemand -

              available

            )

        }

      }

    )

  }

  // ================= TIRE SIZE FORECAST =================

  static forecastTopSizes() {

    const website =
      useWebsiteStore.getState()

    const products =
      website.products || []

    return [...products]

      .sort(

        (a, b) =>

          Number(b.sold || 0) -

          Number(a.sold || 0)

      )

      .slice(0, 20)

      .map(product => ({

        name:
          product.name,

        sold:
          product.sold || 0

      }))

  }

  // ================= BATTERY FORECAST =================

  static forecastTopBatteries() {

    const website =
      useWebsiteStore.getState()

    const products =
      website.products || []

    return products

      .filter(

        product =>

          String(

            product.category || ''

          )

            .toLowerCase()

            .includes('battery')

      )

      .sort(

        (a, b) =>

          Number(b.sold || 0) -

          Number(a.sold || 0)

      )

      .slice(0, 10)

  }

  // ================= FULL REPORT =================

  static generatePredictiveReport() {

    return {

      monthlyRevenue:

        this.forecastMonthlyRevenue(),

      demandForecast:

        this.forecastDemand(30),

      stockOutForecast:

        this.forecastStockOut(),

      purchasePlan:

        this.generatePurchasePlan(),

      topSizes:

        this.forecastTopSizes(),

      topBatteries:

        this.forecastTopBatteries(),

      generatedAt:

        new Date().toISOString()

    }

  }

  // ================= RUN =================

  static run() {

    try {

      const report =

        this.generatePredictiveReport()

      console.log(

        '🔮 Predictive ERP Report',

        report

      )

      return report

    }

    catch (error) {

      console.error(

        'Predictive ERP Error',

        error

      )

      return null

    }

  }

}

export default PredictiveERP