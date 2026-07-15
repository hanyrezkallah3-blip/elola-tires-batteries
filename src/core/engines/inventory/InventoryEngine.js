import ProductEngine from '../product/ProductEngine'

class InventoryEngine {

  async receiveStock({

    productId,

    warehouseId,

    quantity

  }) {

    if (

      !productId ||

      !warehouseId ||

      Number(quantity) <= 0

    ) {

      return {

        success: false,

        message:
          'بيانات غير صحيحة'

      }

    }

    await ProductEngine.increaseStock(

      productId,

      warehouseId,

      quantity

    )

    return {

      success: true

    }

  }

  async issueStock({

    productId,

    warehouseId,

    quantity

  }) {

    if (

      !productId ||

      !warehouseId ||

      Number(quantity) <= 0

    ) {

      return {

        success: false,

        message:
          'بيانات غير صحيحة'

      }

    }

    await ProductEngine.decreaseStock(

      productId,

      warehouseId,

      quantity

    )

    return {

      success: true

    }

  }

  async transfer({

    productId,

    fromWarehouse,

    toWarehouse,

    quantity

  }) {

    if (

      !productId ||

      !fromWarehouse ||

      !toWarehouse ||

      Number(quantity) <= 0

    ) {

      return {

        success: false,

        message:
          'بيانات غير صحيحة'

      }

    }

    await ProductEngine.decreaseStock(

      productId,

      fromWarehouse,

      quantity

    )

    await ProductEngine.increaseStock(

      productId,

      toWarehouse,

      quantity

    )

    return {

      success: true

    }

  }

}

export default new InventoryEngine()