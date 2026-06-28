import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'

class BusinessIntelligenceEngine {

  // ================= SALES FORECAST =================

  static forecastSales() {

    const website =
      useWebsiteStore.getState()

    const orders =
      website.orders || []

    if (!orders.length)
      return 0

    const totalSales =
      orders.reduce(

        (acc, order) =>

          acc +
          Number(order.total || 0),

        0

      )

    const averageSales =

      totalSales /
      orders.length

    return Math.round(

      averageSales * 30

    )

  }

  // ================= TOP PRODUCTS =================

  static getTopProducts(limit = 10) {

    const website =
      useWebsiteStore.getState()

    return [

      ...(website.products || [])

    ]

      .sort(

        (a, b) =>

          Number(b.sold || 0) -

          Number(a.sold || 0)

      )

      .slice(0, limit)

  }

  // ================= WORST PRODUCTS =================

  static getWorstProducts(limit = 10) {

    const website =
      useWebsiteStore.getState()

    return [

      ...(website.products || [])

    ]

      .sort(

        (a, b) =>

          Number(a.sold || 0) -

          Number(b.sold || 0)

      )

      .slice(0, limit)

  }

  // ================= PURCHASE SUGGESTIONS =================

  static generatePurchaseSuggestions() {

    const inventory =
      useInventoryStore.getState()

    const lowStock =

      inventory.getLowStockItems?.() ||

      []

    return lowStock.map(

      item => ({

        productId:
          item.productId,

        productName:
          item.productName,

        currentStock:
          item.quantity,

        suggestedOrder:

          Number(item.minQuantity || 5) *

          5

      })

    )

  }

  // ================= STOCK RISK =================

  static predictStockRisk() {

    const inventory =
      useInventoryStore.getState()

    const stockItems =
      inventory.stockItems || []

    return stockItems.filter(

      item => {

        const sold =
          Number(item.sold || 0)

        const quantity =
          Number(item.quantity || 0)

        return (

          sold > 0 &&

          quantity <

          sold * 0.25

        )

      }

    )

  }

  // ================= WAREHOUSE PROFIT =================

  static calculateWarehouseProfit() {

    const inventory =
      useInventoryStore.getState()

    const warehouses =
      inventory.warehouses || []

    const items =
      inventory.stockItems || []

    return warehouses.map(

      warehouse => {

        const warehouseItems =

          items.filter(

            item =>

              item.warehouseId ===

              warehouse.id

          )

        const value =

          warehouseItems.reduce(

            (acc, item) =>

              acc +

              Number(item.quantity || 0) *

              Number(item.price || 0),

            0

          )

        return {

          warehouseId:
            warehouse.id,

          warehouseName:
            warehouse.name,

          stockValue:
            value

        }

      }

    )

  }

  // ================= FULL REPORT =================

  static generateReport() {

    return {

      forecastSales:

        this.forecastSales(),

      topProducts:

        this.getTopProducts(10),

      worstProducts:

        this.getWorstProducts(10),

      purchaseSuggestions:

        this.generatePurchaseSuggestions(),

      stockRisk:

        this.predictStockRisk(),

      warehouseProfit:

        this.calculateWarehouseProfit(),

      generatedAt:

        new Date().toISOString()

    }

  }

  // ================= AUTO RUN =================

  static run() {

    try {

      const report =
        this.generateReport()

      console.log(

        '📊 BI REPORT',

        report

      )

      return report

    }

    catch (error) {

      console.error(

        'Business Intelligence Error',

        error

      )

      return null

    }

  }

}

export default BusinessIntelligenceEngine