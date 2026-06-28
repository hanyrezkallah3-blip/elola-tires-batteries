import PredictiveERP from './PredictiveERP'
import { useInventoryStore } from '../store/inventoryStore'
import { useWebsiteStore } from '../store/websiteStore'

class AutoPurchaseEngine {

  // ================= BUILD PURCHASE PLAN =================

  static generateOrders() {

    const inventory =
      useInventoryStore.getState()

    const website =
      useWebsiteStore.getState()

    const stockItems =
      inventory.stockItems || []

    const forecast =
      PredictiveERP.generatePurchasePlan()

    const purchaseOrders = []

    forecast.forEach(plan => {

      const item =
        stockItems.find(

          stock =>

            stock.productId ===
            plan.productId

        )

      const currentStock =
        Number(
          item?.quantity || 0
        )

      const minQuantity =
        Number(
          item?.minQuantity || 5
        )

      const suggested =
        Number(
          plan.suggestedPurchase || 0
        )

      if (

        currentStock <= minQuantity ||

        suggested > 0

      ) {

        purchaseOrders.push({

          id:
            Date.now().toString() +
            Math.random()
              .toString(36)
              .slice(2),

          productId:
            plan.productId,

          productName:
            plan.productName,

          currentStock,

          minQuantity,

          expectedDemand:
            plan.expectedDemand,

          suggestedQuantity:

            Math.max(

              suggested,

              minQuantity * 3

            ),

          priority:

            currentStock <= 0

              ? 'CRITICAL'

              : currentStock <= minQuantity

              ? 'HIGH'

              : 'NORMAL',

          status:
            'PENDING',

          supplier:
            'غير محدد',

          createdAt:
            new Date().toISOString()

        })

      }

    })

    return purchaseOrders

  }

  // ================= SAVE TO ERP =================

  static saveOrders() {

    const website =
      useWebsiteStore.getState()

    const purchaseOrders =
      this.generateOrders()

    const currentOrders =

      website.purchaseOrders || []

    useWebsiteStore.setState({

      purchaseOrders: [

        ...purchaseOrders,

        ...currentOrders

      ]

    })

    return purchaseOrders

  }

  // ================= APPROVE =================

  static approveOrder(orderId) {

    const website =
      useWebsiteStore.getState()

    const orders =
      [...(website.purchaseOrders || [])]

    const target =
      orders.find(

        order =>
          order.id === orderId

      )

    if (!target)
      return false

    target.status =
      'APPROVED'

    target.approvedAt =
      new Date().toISOString()

    useWebsiteStore.setState({

      purchaseOrders:
        orders

    })

    return true

  }

  // ================= REJECT =================

  static rejectOrder(orderId) {

    const website =
      useWebsiteStore.getState()

    const orders =
      [...(website.purchaseOrders || [])]

    const target =
      orders.find(

        order =>
          order.id === orderId

      )

    if (!target)
      return false

    target.status =
      'REJECTED'

    target.rejectedAt =
      new Date().toISOString()

    useWebsiteStore.setState({

      purchaseOrders:
        orders

    })

    return true

  }

  // ================= EXECUTE =================

  static executeApprovedOrders() {

    const website =
      useWebsiteStore.getState()

    const inventory =
      useInventoryStore.getState()

    const orders =
      website.purchaseOrders || []

    const stockItems =
      [...(inventory.stockItems || [])]

    orders

      .filter(

        order =>

          order.status ===
          'APPROVED'

      )

      .forEach(order => {

        const item =
          stockItems.find(

            stock =>

              stock.productId ===

              order.productId

          )

        if (item) {

          item.quantity +=

            Number(

              order.suggestedQuantity || 0

            )

        }

      })

    useInventoryStore.setState({

      stockItems

    })

    return true

  }

  // ================= SUMMARY =================

  static getSummary() {

    const website =
      useWebsiteStore.getState()

    const orders =
      website.purchaseOrders || []

    return {

      total:
        orders.length,

      pending:

        orders.filter(

          o =>
            o.status ===
            'PENDING'

        ).length,

      approved:

        orders.filter(

          o =>
            o.status ===
            'APPROVED'

        ).length,

      rejected:

        orders.filter(

          o =>
            o.status ===
            'REJECTED'

        ).length

    }

  }

}

export default AutoPurchaseEngine