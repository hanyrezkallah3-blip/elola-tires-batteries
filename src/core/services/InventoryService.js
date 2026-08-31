// ======================================================
// Elola ERP Enterprise
// Inventory Service
// ======================================================

import BaseService from './BaseService'


class InventoryService extends BaseService {

  // ====================================================
  // STOCK ITEMS
  // ====================================================

  getStockItems() {

    return (

      this.getState().stockItems ||

      []

    )

  }


  // ====================================================
  // GET ITEM BY ID
  // ====================================================

  getItem(itemId) {

    return (

      this.getStockItems().find(

        item =>

          String(item.id) ===
          String(itemId)

      ) ||

      null

    )

  }


  // ====================================================
  // GET ITEM BY PRODUCT + WAREHOUSE
  //
  // This is now the primary inventory lookup.
  // ====================================================

  getItemByProduct(

    productId,

    warehouseId = null

  ) {

    const items =
      this.getStockItems()


    const normalizedProductId =
      String(productId ?? '')


    if (
      !normalizedProductId
    ) {

      return null

    }


    // --------------------------------------------------
    // EXACT PRODUCT + WAREHOUSE
    // --------------------------------------------------

    if (
      warehouseId !== null &&
      warehouseId !== undefined &&
      warehouseId !== ''
    ) {

      const normalizedWarehouseId =
        String(warehouseId)


      const exactItem =
        items.find(

          item =>

            String(
              item?.productId ?? ''
            ) ===
            normalizedProductId &&

            String(
              item?.warehouseId ?? ''
            ) ===
            normalizedWarehouseId

        )


      if (exactItem) {

        return exactItem

      }


      return null

    }


    // --------------------------------------------------
    // FALLBACK: PRODUCT ONLY
    //
    // Used for legacy products that do not specify
    // a warehouse.
    // --------------------------------------------------

    return (

      items.find(

        item =>

          String(
            item?.productId ?? ''
          ) ===
          normalizedProductId

      ) ||

      null

    )

  }


  // ====================================================
  // GET QUANTITY
  // ====================================================

  getQuantity(

    productId,

    warehouseId = null

  ) {

    const item =

      this.getItemByProduct(

        productId,

        warehouseId

      )


    return Number(

      item?.quantity || 0

    )

  }


  // ====================================================
  // SET QUANTITY
  // ====================================================

  setQuantity({

    productId,

    warehouseId = null,

    quantity

  }) {

    // --------------------------------------------------
    // If warehouse is specified, update the exact
    // warehouse stock item.
    // --------------------------------------------------

    if (
      warehouseId !== null &&
      warehouseId !== undefined &&
      warehouseId !== ''
    ) {

      const item =

        this.getItemByProduct(

          productId,

          warehouseId

        )


      if (!item) {

        return false

      }


      const stockState =
        this.getState()


      return (

        stockState.updateStockItem(

          item.id,

          {

            quantity:
              Number(quantity || 0)

          }

        ) !== false

      )

    }


    // --------------------------------------------------
    // Legacy behavior
    // --------------------------------------------------

    return this.getState()

      .setProductQuantity({

        productId,

        quantity

      })

  }


  // ====================================================
  // INCREASE
  // ====================================================

  increase(data) {

    return this.getState()

      .increaseStock(data)

  }


  // ====================================================
  // DECREASE
  // ====================================================

  decrease(data) {

    return this.getState()

      .decreaseStock(data)

  }


  // ====================================================
  // TRANSFER
  // ====================================================

  transfer(data) {

    return this.getState()

      .transferStock(data)

  }


  // ====================================================
  // EXISTS
  // ====================================================

  exists(

    productId,

    warehouseId = null

  ) {

    return Boolean(

      this.getItemByProduct(

        productId,

        warehouseId

      )

    )

  }


  // ====================================================
  // CAN SELL
  // ====================================================

  canSell({

    productId,

    warehouseId = null,

    quantity

  }) {

    const requestedQuantity =

      Number(quantity || 0)


    if (
      requestedQuantity <= 0
    ) {

      return false

    }


    const availableQuantity =

      this.getQuantity(

        productId,

        warehouseId

      )


    return (

      availableQuantity >=
      requestedQuantity

    )

  }


  // ====================================================
  // HAS STOCK
  // ====================================================

  hasStock(

    productId,

    warehouseId = null

  ) {

    return (

      this.getQuantity(

        productId,

        warehouseId

      ) > 0

    )

  }

}


export default InventoryService