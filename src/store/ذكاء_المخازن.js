import { useInventoryStore } from '../store/inventoryStore'

export const استخدام_ذكاء_المخزون = () => {

  const warehouses =
    useInventoryStore((s) => s.warehouses)

  const stockItems =
    useInventoryStore((s) => s.stockItems)

  const movements =
    useInventoryStore((s) => s.stockMovements)

  // ================= تحليل النقص =================

  const تحليل_النقص = () => {

    return stockItems.map((item) => {

      const معدل_الاستهلاك =
        item.sold || 1

      const كمية =
        item.quantity || 0

      const ايام =
        معدل_الاستهلاك > 0
          ? Math.floor(كمية / معدل_الاستهلاك)
          : 999

      return {
        productId: item.productId,
        الاسم: item.productName,
        المخزن: item.warehouseId,
        خطر: ايام < 5 ? 'HIGH' : 'OK',
        ايام_متبقية: ايام
      }

    })

  }

  // ================= اقتراح نقل ذكي =================

  const اقتراح_نقل = () => {

    const suggestions = []

    stockItems.forEach((item) => {

      if (item.quantity < 5) {

        const source = stockItems.find(
          (i) =>
            i.productId === item.productId &&
            i.quantity > 15
        )

        if (source) {

          suggestions.push({
            من: source.warehouseId,
            الى: item.warehouseId,
            productId: item.productId,
            كمية: 5,
            سبب: 'نقص في المخزون'
          })

        }

      }

    })

    return suggestions

  }

  // ================= تحليل المخازن =================

  const تحليل_المخازن = () => {

    return warehouses.map((w) => {

      const items =
        stockItems.filter(
          (i) => i.warehouseId === w.id
        )

      const totalStock =
        items.reduce(
          (a, i) => a + i.quantity,
          0
        )

      return {
        warehouseId: w.id,
        name: w.name,
        totalProducts: items.length,
        totalStock
      }

    })

  }

  // ================= تقرير شامل =================

  const تقرير_ذكي = () => {

    const نقص = تحليل_النقص()
    const نقل = اقتراح_نقل()
    const مخازن = تحليل_المخازن()

    const highRisk =
      نقص.filter((i) => i.خطر === 'HIGH').length

    return {

      نقص,
      نقل,
      مخازن,

      ملخص: {
        منتجات_خطرة: highRisk,

        توصية:
          highRisk > 5
            ? '⚠ إعادة توزيع فورية للمخزون'
            : '✅ النظام مستقر'
      }

    }

  }

  return {

    تحليل_النقص,
    اقتراح_نقل,
    تحليل_المخازن,
    تقرير_ذكي

  }

}