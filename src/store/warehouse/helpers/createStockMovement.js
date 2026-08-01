import generateWarehouseId

  from './generateWarehouseId'


export default function createStockMovement(

  movement = {}

) {

  return {

    id:

      movement.id ||

      generateWarehouseId(),


    warehouseId:

      movement.warehouseId || '',


    productId:

      movement.productId || '',


    productName:

      movement.productName || '',


    type:

      movement.type || 'in',


    quantity:

      Number(

        movement.quantity || 0

      ),


    purchasePrice:

      Number(

        movement.purchasePrice || 0

      ),


    salePrice:

      Number(

        movement.salePrice || 0

      ),


    batchNumber:

      movement.batchNumber || '',


    lotNumber:

      movement.lotNumber || '',


    reference:

      movement.reference || '',


    note:

      movement.note || '',


    createdBy:

      movement.createdBy || '',


    createdAt:

      movement.createdAt ||

      new Date().toISOString()

  }

}