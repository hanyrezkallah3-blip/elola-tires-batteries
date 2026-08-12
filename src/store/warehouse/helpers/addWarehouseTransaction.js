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

    const quantity =
      Number(transaction.quantity || 0)

    const beforeQuantity =
      Number(
        transaction.beforeQuantity ??
        transaction.previousQuantity ??
        0
      )

    const afterQuantity =
      Number(
        transaction.afterQuantity ??
        transaction.newQuantity ??
        (
          transaction.type === 'out'
            ? beforeQuantity - quantity
            : beforeQuantity + quantity
        )
      )

    const unitPrice =
      Number(
        transaction.unitPrice ??
        transaction.salePrice ??
        transaction.purchasePrice ??
        0
      )

    const totalValue =
      Number(
        transaction.totalValue ??
        (quantity * unitPrice)
      )

    return {

      ...warehouse,

      transactions: [

        ...(warehouse.transactions || []),

        {

          id:
            transaction.id ||
            generateWarehouseId(),

          type:
            transaction.type ||
            'in',

          productId:
            transaction.productId ||
            '',

          productName:
            transaction.productName ||
            '',

          quantity,

          beforeQuantity,

          afterQuantity,

          unitPrice,

          totalValue,

          purchasePrice:
            Number(
              transaction.purchasePrice || 0
            ),

          salePrice:
            Number(
              transaction.salePrice || 0
            ),

          userId:
            transaction.userId ||
            '',

          userName:
            transaction.userName ||
            '',

          notes:
            transaction.notes ||
            '',

          reference:
            transaction.reference ||
            '',

          source:
            transaction.source ||
            'manual',

          createdAt:
            transaction.createdAt ||
            new Date().toISOString()

        }

      ]

    }

  })

}
