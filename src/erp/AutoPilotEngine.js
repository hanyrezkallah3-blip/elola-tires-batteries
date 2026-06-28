import { useWebsiteStore } from '../store/websiteStore'
import { useInventoryStore } from '../store/inventoryStore'

class AutoPilotEngine {

  static analyzeLowStock() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const lowStockItems =
      inventory.getLowStockItems()

    lowStockItems.forEach((item) => {

      website.addNotification?.(

        '⚠️ مخزون منخفض',

        `${item.productName} يحتاج إعادة تخزين`

      )

    })

  }

  static analyzeCriticalStock() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const criticalItems =
      (inventory.stockItems || []).filter(

        item =>

          Number(item.quantity || 0) <= 0

      )

    criticalItems.forEach((item) => {

      website.addNotification?.(

        '🚨 نفاد مخزون',

        `${item.productName} نفد بالكامل`

      )

    })

  }

  static analyzeBestSellingProducts() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const bestSelling =

      [...(inventory.stockItems || [])]

        .sort(

          (a, b) =>

            Number(b.sold || 0) -

            Number(a.sold || 0)

        )

        .slice(0, 5)

    bestSelling.forEach((item) => {

      website.addNotification?.(

        '🔥 منتج قوي',

        `${item.productName} من أكثر المنتجات مبيعاً`

      )

    })

  }

  static analyzeDeadStock() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const deadStock =

      (inventory.stockItems || []).filter(

        item =>

          Number(item.sold || 0) === 0 &&

          Number(item.quantity || 0) > 0

      )

    deadStock.forEach((item) => {

      website.addNotification?.(

        '📦 مخزون راكد',

        `${item.productName} لم يحقق أي مبيعات`

      )

    })

  }

  static suggestTransfers() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const items =
      inventory.stockItems || []

    items.forEach((item) => {

      if (

        Number(item.quantity || 0) >

        Number(item.minQuantity || 5) * 5

      ) {

        website.addNotification?.(

          '🚚 اقتراح تحويل',

          `يمكن تحويل جزء من ${item.productName} لمخزن آخر`

        )

      }

    })

  }

  static suggestReorder() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const lowStock =
      inventory.getLowStockItems()

    lowStock.forEach((item) => {

      const suggestedQty =

        Math.max(

          10,

          Number(item.minQuantity || 5) * 3

        )

      website.addNotification?.(

        '🧠 إعادة طلب ذكية',

        `${item.productName} الكمية المقترحة ${suggestedQty}`

      )

    })

  }

  static run() {

    try {

      this.analyzeLowStock()

      this.analyzeCriticalStock()

      this.analyzeBestSellingProducts()

      this.analyzeDeadStock()

      this.suggestTransfers()

      this.suggestReorder()

    }

    catch (error) {

      console.error(

        'AutoPilotEngine Error',

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

        window.autoPilotInterval

      ) {

        clearInterval(

          window.autoPilotInterval

        )

      }

      window.autoPilotInterval =

        setInterval(() => {

          this.run()

        }, 10000)

    }

  }

  static stop() {

    if (

      typeof window !== 'undefined' &&

      window.autoPilotInterval

    ) {

      clearInterval(

        window.autoPilotInterval

      )

      window.autoPilotInterval = null

    }

  }

}

export default AutoPilotEngine