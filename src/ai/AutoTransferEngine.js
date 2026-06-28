import { useInventoryStore } from '../store/inventoryStore'

class AutoTransferEngine {

  // ================= FIND SURPLUS =================

  static getSurplusItems() {

    const inventory =
      useInventoryStore.getState()

    return (inventory.stockItems || [])

      .filter(

        item =>

          Number(item.quantity || 0) >

          Number(item.minQuantity || 5) * 3

      )

  }

  // ================= FIND SHORTAGE =================

  static getShortageItems() {

    const inventory =
      useInventoryStore.getState()

    return (inventory.stockItems || [])

      .filter(

        item =>

          Number(item.quantity || 0) <=

          Number(item.minQuantity || 5)

      )

  }

  // ================= ANALYZE =================

  static analyzeTransfers() {

    const inventory =
      useInventoryStore.getState()

    const stockItems =
      inventory.stockItems || []

    const warehouses =
      inventory.warehouses || []

    const suggestions = []

    stockItems.forEach(shortage => {

      const shortageQty =

        Number(shortage.minQuantity || 5) -

        Number(shortage.quantity || 0)

      if (shortageQty <= 0)
        return

      const sourceCandidates =

        stockItems.filter(

          item =>

            item.productId ===
            shortage.productId &&

            item.warehouseId !==
            shortage.warehouseId &&

            Number(item.quantity || 0) >

            Number(item.minQuantity || 5) * 2

        )

      sourceCandidates.forEach(source => {

        const availableTransfer =

          Number(source.quantity || 0) -

          Number(source.minQuantity || 5)

        if (availableTransfer <= 0)
          return

        suggestions.push({

          id:
            Date.now().toString() +
            Math.random()
              .toString(36)
              .slice(2),

          productId:
            shortage.productId,

          productName:
            shortage.productName,

          fromWarehouseId:
            source.warehouseId,

          fromWarehouseName:
            source.warehouseName,

          toWarehouseId:
            shortage.warehouseId,

          toWarehouseName:
            shortage.warehouseName,

          suggestedQuantity:

            Math.min(

              shortageQty,

              availableTransfer

            ),

          priority:

            Number(shortage.quantity || 0) <= 0

              ? 'CRITICAL'

              : 'HIGH',

          status:
            'PENDING',

          createdAt:
            new Date().toISOString()

        })

      })

    })

    return suggestions

  }

  // ================= EXECUTE =================

  static executeTransfer(transfer) {

    const inventory =
      useInventoryStore.getState()

    inventory.transferStock({

      itemId:
        transfer.sourceItemId,

      toWarehouseId:
        transfer.toWarehouseId,

      quantity:
        transfer.suggestedQuantity

    })

    return true

  }

  // ================= AUTO EXECUTE =================

  static executeAllPossibleTransfers() {

    const inventory =
      useInventoryStore.getState()

    const suggestions =
      this.analyzeTransfers()

    suggestions.forEach(transfer => {

      const sourceItem =

        (inventory.stockItems || [])

          .find(

            item =>

              item.productId ===
              transfer.productId &&

              item.warehouseId ===
              transfer.fromWarehouseId

          )

      if (!sourceItem)
        return

      inventory.transferStock({

        itemId:
          sourceItem.id,

        toWarehouseId:
          transfer.toWarehouseId,

        quantity:
          transfer.suggestedQuantity

      })

    })

    return suggestions.length

  }

  // ================= SUMMARY =================

  static getTransferSummary() {

    const suggestions =
      this.analyzeTransfers()

    return {

      totalSuggestions:
        suggestions.length,

      critical:

        suggestions.filter(

          s =>
            s.priority ===
            'CRITICAL'

        ).length,

      high:

        suggestions.filter(

          s =>
            s.priority ===
            'HIGH'

        ).length

    }

  }

}

export default AutoTransferEngine