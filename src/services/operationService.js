import { useOperationStore } from '../store/operationStore'

const textValue = value =>
  value === null || value === undefined
    ? ''
    : String(value)

const numberValue = value => {
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}

const buildReference = (
  transaction,
  operationData = {}
) =>
  textValue(
    operationData.reference ||
    transaction?.reference
  )

const buildLine = ({
  transaction,
  operationData,
  countsAsSale = false
}) => {
  const quantity =
    numberValue(
      operationData.quantity ??
      transaction?.quantity
    )

  const purchasePrice =
    numberValue(
      operationData.purchasePrice ??
      transaction?.purchasePrice
    )

  const originalSalePrice =
    numberValue(
      operationData.originalSalePrice ??
      operationData.actualSalePrice ??
      operationData.salePrice ??
      transaction?.salePrice
    )

  const actualSalePrice =
    numberValue(
      operationData.actualSalePrice ??
      operationData.salePrice ??
      transaction?.salePrice
    )

  return {
    id:
      operationData.lineId || undefined,

    inventoryMovementId:
      transaction?.id || '',

    inventoryMovementType:
      transaction?.type || '',

    productId:
      textValue(
        operationData.productId ||
        transaction?.productId
      ),

    productName:
      textValue(
        operationData.productName ||
        transaction?.productName
      ),

    sku:
      textValue(
        operationData.sku
      ),

    quantity,

    sourceId:
      textValue(
        operationData.sourceId ||
        transaction?.warehouseId
      ),

    sourceName:
      textValue(
        operationData.sourceName ||
        transaction?.warehouseName
      ),

    sourceType:
      textValue(
        operationData.sourceType ||
        'warehouse'
      ),

    supplierId:
      textValue(
        operationData.supplierId
      ),

    supplierName:
      textValue(
        operationData.supplierName
      ),

    destinationId:
      textValue(
        operationData.destinationId
      ),

    destinationName:
      textValue(
        operationData.destinationName
      ),

    destinationType:
      textValue(
        operationData.destinationType
      ),

    beneficiaryId:
      textValue(
        operationData.beneficiaryId
      ),

    beneficiaryName:
      textValue(
        operationData.beneficiaryName
      ),

    beneficiaryType:
      textValue(
        operationData.beneficiaryType
      ),

    purchasePrice,

    purchaseCurrency:
      textValue(
        operationData.purchaseCurrency ||
        'EGP'
      ),

    originalSalePrice,

    actualSalePrice,

    saleCurrency:
      textValue(
        operationData.saleCurrency ||
        'EGP'
      ),

    salePriceSource:
      textValue(
        operationData.salePriceSource
      ),

    salePriceSourceId:
      textValue(
        operationData.salePriceSourceId
      ),

    salePriceSourceName:
      textValue(
        operationData.salePriceSourceName
      ),

    repricingId:
      textValue(
        operationData.repricingId
      ),

    repricingDate:
      operationData.repricingDate || null,

    repricingReason:
      textValue(
        operationData.repricingReason
      ),

    repricingUserId:
      textValue(
        operationData.repricingUserId
      ),

    repricingUserName:
      textValue(
        operationData.repricingUserName
      ),

    purchaseTotal:
      quantity * purchasePrice,

    saleTotal:
      countsAsSale
        ? quantity * actualSalePrice
        : 0,

    notes:
      textValue(
        operationData.notes ||
        transaction?.notes
      ),

    documents:
      Array.isArray(
        operationData.documents
      )
        ? operationData.documents
        : []
  }
}

export const recordInventoryOperation = ({
  transaction,
  operationData = {}
} = {}) => {
  if (!transaction?.id) {
    return {
      success: false,
      error:
        'Inventory movement transaction is required.'
    }
  }

  const addOperation =
    useOperationStore.getState().addOperation

  const countsAsSale =
    operationData.countsAsSale === true
  const line =
    buildLine({
      transaction,
      operationData,
      countsAsSale
    })

  const operation =
    addOperation({
      operationNumber:
        buildReference(
          transaction,
          operationData
        ),

      type:
        textValue(
          operationData.type ||
          'warehouse'
        ),

      status:
        textValue(
          operationData.status ||
          'completed'
        ),

      performedAt:
        operationData.performedAt ||
        transaction.createdAt ||
        new Date().toISOString(),

      performedById:
        textValue(
          operationData.performedById ||
          transaction.userId
        ),

      performedByName:
        textValue(
          operationData.performedByName ||
          transaction.userName
        ),

      performedByRole:
        textValue(
          operationData.performedByRole
        ),

      sources:
        operationData.sourceId ||
        transaction.warehouseId
          ? [
              {
                id:
                  operationData.sourceId ||
                  transaction.warehouseId,

                name:
                  operationData.sourceName ||
                  transaction.warehouseName,

                type:
                  operationData.sourceType ||
                  'warehouse'
              }
            ]
          : [],

      suppliers:
        operationData.supplierId ||
        operationData.supplierName
          ? [
              {
                id:
                  operationData.supplierId ||
                  '',

                name:
                  operationData.supplierName ||
                  ''
              }
            ]
          : [],

      destinations:
        operationData.destinationId ||
        operationData.destinationName
          ? [
              {
                id:
                  operationData.destinationId ||
                  '',

                name:
                  operationData.destinationName ||
                  '',

                type:
                  operationData.destinationType ||
                  ''
              }
            ]
          : [],

      beneficiaries:
        Array.isArray(operationData.beneficiaries)
          ? operationData.beneficiaries
          : (
              operationData.beneficiaryId ||
              operationData.beneficiaryName
                ? [
                    {
                      id:
                        operationData.beneficiaryId ||
                        '',

                      name:
                        operationData.beneficiaryName ||
                        '',

                      type:
                        operationData.beneficiaryType ||
                        'other',

                      role:
                        'beneficiary',

                      external:
                        operationData.beneficiaryExternal === true
                    }
                  ]
                : []
            ),

      lines: [
        line
      ],

      notes:
        textValue(
          operationData.operationNotes ||
          operationData.notes ||
          transaction.notes
        )
    })

  return {
    success: true,
    operation
  }
}

export default {
  recordInventoryOperation
}

export const recordRepricingOperation = ({
  repricing = {},
  operationData = {}
} = {}) => {
  const addOperation =
    useOperationStore.getState().addOperation

  if (!repricing?.id) {
    return {
      success: false,
      error:
        'Repricing record is required.'
    }
  }

  const quantity =
    Number(repricing.quantity) || 0

  const previousSalePrice =
    Number(repricing.previousSalePrice) || 0

  const newSalePrice =
    Number(repricing.newSalePrice) || 0

  const operation =
    addOperation({
      operationNumber:
        textValue(
          operationData.operationNumber ||
          repricing.id
        ),

      type:
        'repricing',

      status:
        textValue(
          operationData.status ||
          'completed'
        ),

      performedAt:
        repricing.date ||
        operationData.performedAt ||
        new Date().toISOString(),

      performedById:
        textValue(
          repricing.userId ||
          operationData.performedById
        ),

      performedByName:
        textValue(
          repricing.userName ||
          operationData.performedByName
        ),

      performedByRole:
        textValue(
          operationData.performedByRole
        ),

      sources:
        repricing.warehouseId
          ? [
              {
                id:
                  repricing.warehouseId,

                name:
                  textValue(
                    operationData.warehouseName
                  ),

                type:
                  'warehouse'
              }
            ]
          : [],

      lines: [
        {
          inventoryMovementId:
            '',

          inventoryMovementType:
            'repricing',

          productId:
            textValue(
              repricing.productId
            ),

          productName:
            textValue(
              repricing.productName
            ),

          quantity,

          originalSalePrice:
            previousSalePrice,

          actualSalePrice:
            newSalePrice,

          salePriceSource:
            textValue(
              repricing.salePriceSource ||
              'repricing'
            ),

          salePriceSourceId:
            textValue(
              repricing.id
            ),

          salePriceSourceName:
            'Repricing',

          repricingId:
            textValue(
              repricing.id
            ),

          repricingDate:
            repricing.date ||
            null,

          repricingReason:
            textValue(
              repricing.reason
            ),

          repricingUserId:
            textValue(
              repricing.userId
            ),

          repricingUserName:
            textValue(
              repricing.userName
            ),

          purchaseTotal:
            0,

          saleTotal:
            0,

          notes:
            textValue(
              operationData.notes
            )
        }
      ],

      notes:
        textValue(
          operationData.operationNotes ||
          operationData.notes ||
          repricing.reason
        )
    })

  return {
    success: true,
    operation
  }
}
