import { useInventoryStore } from '../store/inventoryStore'
import { useWebsiteStore } from '../store/websiteStore'

class WarehouseIntelligence {

  // ================= LOW STOCK ANALYSIS =================

  static analyzeWarehouseShortage() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const warehouses =
      inventory.warehouses || []

    warehouses.forEach((warehouse) => {

      const items =

        (inventory.stockItems || []).filter(

          item =>

            item.warehouseId ===
            warehouse.id

        )

      const lowStock =

        items.filter(

          item =>

            Number(item.quantity || 0) <=
            Number(item.minQuantity || 5)

        )

      if (lowStock.length > 0) {

        website.addNotification?.(

          '🏭 نقص مخزون',

          `${warehouse.name} يحتوي على ${lowStock.length} منتج منخفض المخزون`

        )

      }

    })

  }

  // ================= OVERSTOCK =================

  static analyzeOverStock() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const overStockItems =

      (inventory.stockItems || []).filter(

        item =>

          Number(item.quantity || 0) >

          Number(item.minQuantity || 5) * 10

      )

    overStockItems.forEach((item) => {

      website.addNotification?.(

        '📦 تكدس مخزون',

        `${item.productName} يوجد منه كمية كبيرة بالمخزن`

      )

    })

  }

  // ================= TRANSFER SUGGESTION =================

  static suggestTransfers() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const items =
      inventory.stockItems || []

    const warehouses =
      inventory.warehouses || []

    items.forEach((sourceItem) => {

      if (

        Number(sourceItem.quantity || 0) <

        Number(sourceItem.minQuantity || 5)

      ) {

        const donor =

          items.find(

            item =>

              item.productId ===
              sourceItem.productId &&

              item.warehouseId !==
              sourceItem.warehouseId &&

              Number(item.quantity || 0) >

              Number(item.minQuantity || 5) * 3

          )

        if (donor) {

          const sourceWarehouse =

            warehouses.find(

              w =>
                w.id ===
                sourceItem.warehouseId

            )

          const donorWarehouse =

            warehouses.find(

              w =>
                w.id ===
                donor.warehouseId

            )

          website.addNotification?.(

            '🚚 اقتراح تحويل',

            `نقل ${sourceItem.productName}
من ${donorWarehouse?.name}
إلى ${sourceWarehouse?.name}`

          )

        }

      }

    })

  }

  // ================= WAREHOUSE HEALTH =================

  static analyzeWarehouseHealth() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const analytics =

      inventory.getWarehouseAnalytics()

    analytics.forEach((warehouse) => {

      if (

        Number(warehouse.totalProducts || 0) === 0

      ) {

        website.addNotification?.(

          '⚠️ مخزن غير مستغل',

          `${warehouse.warehouseName} لا يحتوي على منتجات`

        )

      }

    })

  }

  // ================= SALES DISTRIBUTION =================

  static analyzeDistribution() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const stockItems =
      inventory.stockItems || []

    const weakProducts =

      stockItems.filter(

        item =>

          Number(item.sold || 0) === 0 &&

          Number(item.quantity || 0) > 0

      )

    weakProducts.forEach((item) => {

      website.addNotification?.(

        '📉 منتج ضعيف',

        `${item.productName} لم يحقق مبيعات`

      )

    })

  }

  // ================= EXECUTION =================

  static run() {

    try {

      this.analyzeWarehouseShortage()

      this.analyzeOverStock()

      this.suggestTransfers()

      this.analyzeWarehouseHealth()

      this.analyzeDistribution()

    }

    catch (error) {

      console.error(

        'WarehouseIntelligence Error',

        error

      )

    }

  }

  static start() {

    this.run()

    if (

      typeof window !== 'undefined'

    ) {

      if (

        window.warehouseAIInterval

      ) {

        clearInterval(

          window.warehouseAIInterval

        )

      }

      window.warehouseAIInterval =

        setInterval(() => {

          this.run()

        }, 15000)

    }

  }

  static stop() {

    if (

      typeof window !== 'undefined' &&

      window.warehouseAIInterval

    ) {

      clearInterval(

        window.warehouseAIInterval

      )

      window.warehouseAIInterval = null

    }

  }

}

export default WarehouseIntelligence