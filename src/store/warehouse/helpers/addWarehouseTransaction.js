import generateWarehouseId from './generateWarehouseId'

export default function addWarehouseTransaction(

  warehouses = [],

  warehouseId,

  transaction = {}

) {

  return warehouses.map(warehouse => {

    if (warehouse.id !== warehouseId) {

      return warehouse

    }

    return {

      ...warehouse,

      transactions: [

        ...(warehouse.transactions || []),

        {

          id: generateWarehouseId(),

          type: transaction.type || 'in',

          productId: transaction.productId || '',

          productName: transaction.productName || '',

          quantity: Number(transaction.quantity || 0),

          createdAt: new Date().toISOString()

        }

      ]

    }

  })

}
