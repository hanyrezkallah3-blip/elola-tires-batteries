import generateWarehouseId from './generateWarehouseId'

export default function createWarehouseTransaction(transaction = {}) {

  return {

    id:
      transaction.id ||
      generateWarehouseId(),

    type:
      transaction.type || 'in',

    productId:
      transaction.productId || '',

    productName:
      transaction.productName || '',

    quantity:
      Number(transaction.quantity || 0),

    purchasePrice:
      Number(transaction.purchasePrice || 0),

    salePrice:
      Number(transaction.salePrice || 0),

    warehouseId:
      transaction.warehouseId || '',

    warehouseName:
      transaction.warehouseName || '',

    reference:
      transaction.reference || '',

    note:
      transaction.note || '',

    userId:
      transaction.userId || '',

    createdAt:
      transaction.createdAt ||
      new Date().toISOString()

  }

}