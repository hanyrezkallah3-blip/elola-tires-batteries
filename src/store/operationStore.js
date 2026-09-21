import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'elola_operations'

const generateId = (prefix = 'op') => {
  try {
    return `${prefix}-${crypto.randomUUID()}`
  } catch {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }
}

const now = () => new Date().toISOString()

const numberValue = value => {
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}

const textValue = value =>
  value === null || value === undefined
    ? ''
    : String(value)

const normalizeReference = (
  value = {},
  prefix = 'ref'
) => ({
  id:
    value.id ||
    value.entityId ||
    generateId(prefix),

  name:
    value.name ||
    value.label ||
    value.entityName ||
    '',

  type:
    value.type ||
    value.entityType ||
    '',

  role:
    value.role ||
    '',

  external:
    value.external === true
})

const normalizeBeneficiary = (
  beneficiary = {}
) => ({
  id:
    textValue(
      beneficiary.id ||
      beneficiary.entityId ||
      beneficiary.customerId ||
      beneficiary.clientId
    ),

  name:
    textValue(
      beneficiary.name ||
      beneficiary.label ||
      beneficiary.entityName ||
      beneficiary.customerName ||
      beneficiary.clientName
    ),

  type:
    textValue(
      beneficiary.type ||
      beneficiary.entityType ||
      beneficiary.beneficiaryType ||
      'other'
    ),

  role:
    textValue(
      beneficiary.role ||
      'beneficiary'
    ),

  external:
    beneficiary.external === true
})

const normalizeDocument = (
  document = {}
) => ({
  id:
    document.id ||
    generateId('doc'),

  name:
    textValue(document.name),

  type:
    textValue(document.type),

  documentType:
    textValue(
      document.documentType ||
      document.category
    ),

  mimeType:
    textValue(
      document.mimeType ||
      document.type
    ),

  size:
    numberValue(document.size),

  url:
    textValue(
      document.url ||
      document.downloadURL ||
      document.cloudinaryUrl
    ),

  storagePath:
    textValue(document.storagePath),

  uploadedAt:
    document.uploadedAt ||
    now(),

  uploadedById:
    textValue(document.uploadedById),

  uploadedByName:
    textValue(document.uploadedByName),

  scope:
    textValue(document.scope),

  supplierId:
    textValue(document.supplierId),

  sourceId:
    textValue(document.sourceId),

  destinationId:
    textValue(document.destinationId),

  itemId:
    textValue(document.itemId),

  shipmentId:
    textValue(document.shipmentId),

  notes:
    textValue(document.notes)
})

const normalizePayment = (
  payment = {}
) => ({
  id:
    payment.id ||
    generateId('pay'),

  operationId:
    textValue(payment.operationId),

  obligationId:
    textValue(payment.obligationId),

  partyId:
    textValue(payment.partyId),

  partyName:
    textValue(payment.partyName),

  amount:
    numberValue(payment.amount),

  currency:
    textValue(payment.currency || 'EGP'),

  date:
    payment.date ||
    now(),

  paymentMethod:
    textValue(payment.paymentMethod),

  recordedById:
    textValue(
      payment.recordedById
    ),

  recordedByName:
    textValue(
      payment.recordedByName
    ),

  documentIds:
    Array.isArray(payment.documentIds)
      ? payment.documentIds
      : [],

  notes:
    textValue(payment.notes)
})

const calculateObligation = (
  obligation = {}
) => {
  const amount =
    numberValue(obligation.amount)

  const paidAmount =
    numberValue(obligation.paidAmount)

  const remainingAmount =
    Math.max(
      0,
      amount - paidAmount
    )

  let status =
    textValue(obligation.status)

  if (!remainingAmount) {
    status = 'paid'
  } else if (paidAmount > 0) {
    status = 'partial'
  } else {
    const dueDate =
      obligation.dueDate

    if (
      dueDate &&
      new Date(dueDate).getTime() <
        Date.now()
    ) {
      status = 'overdue'
    } else {
      status = 'due'
    }
  }

  return {
    ...obligation,

    id:
      obligation.id ||
      generateId('obl'),

    type:
      obligation.type ||
      'payable',

    partyId:
      textValue(obligation.partyId),

    partyName:
      textValue(obligation.partyName),

    amount,

    paidAmount,

    remainingAmount,

    currency:
      textValue(
        obligation.currency ||
        'EGP'
      ),

    dueDate:
      obligation.dueDate ||
      null,

    status,

    alertEnabled:
      obligation.alertEnabled !== false,

    alertDismissed:
      obligation.alertDismissed === true,

    createdAt:
      obligation.createdAt ||
      now(),

    updatedAt:
      now()
  }
}

const normalizeExpense = (
  expense = {}
) => ({
  id:
    expense.id ||
    generateId('exp'),

  type:
    textValue(
      expense.type || 'other'
    ),

  description:
    textValue(expense.description),

  amount:
    numberValue(expense.amount),

  currency:
    textValue(
      expense.currency ||
      'EGP'
    ),

  date:
    expense.date ||
    now(),

  paidAmount:
    numberValue(
      expense.paidAmount
    ),

  remainingAmount:
    Math.max(
      0,
      numberValue(expense.amount) -
        numberValue(expense.paidAmount)
    ),

  dueDate:
    expense.dueDate ||
    null,

  paidById:
    textValue(expense.paidById),

  paidByName:
    textValue(expense.paidByName),

  paymentMethod:
    textValue(expense.paymentMethod),

  supplierId:
    textValue(expense.supplierId),

  supplierName:
    textValue(expense.supplierName),

  partyId:
    textValue(expense.partyId),

  partyName:
    textValue(expense.partyName),

  partyType:
    textValue(expense.partyType),

  scope:
    textValue(expense.scope),

  sourceId:
    textValue(expense.sourceId),

  itemId:
    textValue(expense.itemId),

  shipmentId:
    textValue(expense.shipmentId),

  documents:
    Array.isArray(expense.documents)
      ? expense.documents.map(
          normalizeDocument
        )
      : [],

  notes:
    textValue(expense.notes)
})

const normalizeLine = (
  line = {}
) => ({
  id:
    line.id ||
    generateId('line'),

  inventoryMovementId:
    textValue(
      line.inventoryMovementId ||
      line.transactionId
    ),

  inventoryMovementType:
    textValue(
      line.inventoryMovementType
    ),

  productId:
    textValue(line.productId),

  productName:
    textValue(line.productName),

  sku:
    textValue(line.sku),

  quantity:
    numberValue(line.quantity),

  sourceId:
    textValue(line.sourceId),

  sourceName:
    textValue(line.sourceName),

  sourceType:
    textValue(line.sourceType),

  supplierId:
    textValue(line.supplierId),

  supplierName:
    textValue(line.supplierName),

  destinationId:
    textValue(line.destinationId),

  destinationName:
    textValue(line.destinationName),

  destinationType:
    textValue(line.destinationType),

  beneficiaryId:
    textValue(line.beneficiaryId),

  beneficiaryName:
    textValue(line.beneficiaryName),

  beneficiaryType:
    textValue(line.beneficiaryType),

  purchasePrice:
    numberValue(line.purchasePrice),

  purchaseCurrency:
    textValue(
      line.purchaseCurrency ||
      'EGP'
    ),

  originalSalePrice:
    numberValue(
      line.originalSalePrice ??
      line.actualSalePrice
    ),

  actualSalePrice:
    numberValue(
      line.actualSalePrice
    ),

  saleCurrency:
    textValue(
      line.saleCurrency ||
      'EGP'
    ),

  salePriceSource:
    textValue(
      line.salePriceSource
    ),

  salePriceSourceId:
    textValue(
      line.salePriceSourceId
    ),

  salePriceSourceName:
    textValue(
      line.salePriceSourceName
    ),

  repricingId:
    textValue(
      line.repricingId
    ),

  repricingDate:
    line.repricingDate ||
    null,

  repricingReason:
    textValue(
      line.repricingReason
    ),

  repricingUserId:
    textValue(
      line.repricingUserId
    ),

  repricingUserName:
    textValue(
      line.repricingUserName
    ),

  purchaseTotal:
    numberValue(
      line.purchaseTotal ??
      (
        numberValue(line.quantity) *
        numberValue(line.purchasePrice)
      )
    ),

  saleTotal:
    numberValue(
      line.saleTotal ?? 0
    ),

  notes:
    textValue(line.notes),

  documents:
    Array.isArray(line.documents)
      ? line.documents.map(
          normalizeDocument
        )
      : []
})

const normalizeOperation = (
  operation = {}
) => {
  const lines =
    Array.isArray(operation.lines)
      ? operation.lines.map(
          normalizeLine
        )
      : []

  const payments =
    Array.isArray(operation.payments)
      ? operation.payments.map(
          normalizePayment
        )
      : []

  const documents =
    Array.isArray(operation.documents)
      ? operation.documents.map(
          normalizeDocument
        )
      : []

  const expenses =
    Array.isArray(operation.expenses)
      ? operation.expenses.map(
          normalizeExpense
        )
      : []

  const obligations =
    Array.isArray(
      operation.obligations
    )
      ? operation.obligations.map(
          calculateObligation
        )
      : []

  const purchaseValue =
    lines.reduce(
      (sum, line) =>
        sum +
        numberValue(
          line.purchaseTotal
        ),
      0
    )

  const salesValue =
    lines.reduce(
      (sum, line) =>
        sum +
        numberValue(
          line.saleTotal
        ),
      0
    )

  const expenseValue =
    expenses.reduce(
      (sum, expense) =>
        sum +
        numberValue(expense.amount),
      0
    )

  const totalCost =
    purchaseValue +
    expenseValue

  const totalPaid =
    payments.reduce(
      (sum, payment) =>
        sum +
        numberValue(payment.amount),
      0
    )

  return {
    id:
      operation.id ||
      generateId('op'),

    operationNumber:
      textValue(
        operation.operationNumber ||
        operation.reference
      ),

    type:
      textValue(
        operation.type ||
        'warehouse'
      ),

    status:
      textValue(
        operation.status ||
        'completed'
      ),

    performedAt:
      operation.performedAt ||
      operation.createdAt ||
      now(),

    performedById:
      textValue(
        operation.performedById
      ),

    performedByName:
      textValue(
        operation.performedByName
      ),

    performedByRole:
      textValue(
        operation.performedByRole
      ),

    sources:
      Array.isArray(operation.sources)
        ? operation.sources.map(
            value =>
              normalizeReference(
                value,
                'source'
              )
          )
        : [],

    suppliers:
      Array.isArray(operation.suppliers)
        ? operation.suppliers.map(
            value =>
              normalizeReference(
                value,
                'supplier'
              )
          )
        : [],

    destinations:
      Array.isArray(
        operation.destinations
      )
        ? operation.destinations.map(
            value =>
              normalizeReference(
                value,
                'destination'
              )
          )
        : [],

    beneficiaries:
      Array.isArray(
        operation.beneficiaries
      )
        ? operation.beneficiaries.map(
            normalizeBeneficiary
          )
        : (
          operation.beneficiary
            ? [
                normalizeBeneficiary(
                  operation.beneficiary
                )
              ]
            : []
        ),

    lines,

    payments,

    documents,

    expenses,

    obligations,

    purchaseValue,

    expenseValue,

    totalCost,

    salesValue,

    totalPaid,

    totalRemaining:
      Math.max(
        0,
        salesValue - totalPaid
      ),

    actualProfit:
      salesValue - totalCost,

    notes:
      textValue(operation.notes),

    createdAt:
      operation.createdAt ||
      now(),

    updatedAt:
      now()
  }
}

export const useOperationStore = create(
  persist(
    (set, get) => ({
      operations: [],

      addOperation: operation => {
        const normalized =
          normalizeOperation(
            operation
          )

        set(state => ({
          operations: [
            ...state.operations,
            normalized
          ]
        }))

        return normalized
      },

      updateOperation: (
        id,
        updates = {}
      ) => {
        let updated = null

        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(id)
                ) {
                  return operation
                }

                updated =
                  normalizeOperation({
                    ...operation,
                    ...updates,
                    id: operation.id,
                    createdAt:
                      operation.createdAt
                  })

                return updated
              }
            )
        }))

        return updated
      },

      getOperation: id =>
        get().operations.find(
          operation =>
            String(operation.id) ===
            String(id)
        ) || null,

      deleteOperation: id =>
        set(state => ({
          operations:
            state.operations.filter(
              operation =>
                String(operation.id) !==
                String(id)
            )
        })),

      searchOperations: filters => {
        const options =
          filters || {}

        return get().operations.filter(
          operation => {
            if (
              options.type &&
              operation.type !==
                options.type
            ) {
              return false
            }

            if (
              options.status &&
              operation.status !==
                options.status
            ) {
              return false
            }

            if (
              options.performedById &&
              operation.performedById !==
                options.performedById
            ) {
              return false
            }

            if (
              options.supplierId &&
              !operation.suppliers.some(
                supplier =>
                  String(
                    supplier.id
                  ) ===
                  String(
                    options.supplierId
                  )
              )
            ) {
              return false
            }

            if (
              options.sourceId &&
              !operation.sources.some(
                source =>
                  String(
                    source.id
                  ) ===
                  String(
                    options.sourceId
                  )
              )
            ) {
              return false
            }

            if (
              options.destinationId &&
              !operation.destinations.some(
                destination =>
                  String(
                    destination.id
                  ) ===
                  String(
                    options.destinationId
                  )
              )
            ) {
              return false
            }

            if (
              options.fromDate &&
              new Date(
                operation.performedAt
              ) <
                new Date(
                  options.fromDate
                )
            ) {
              return false
            }

            if (
              options.toDate &&
              new Date(
                operation.performedAt
              ) >
                new Date(
                  options.toDate
                )
            ) {
              return false
            }

            return true
          }
        )
      },

      addPayment: (
        operationId,
        payment = {}
      ) => {
        let created = null

        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                created =
                  normalizePayment({
                    ...payment,
                    operationId:
                      operation.id
                  })

                return normalizeOperation({
                  ...operation,
                  payments: [
                    ...operation.payments,
                    created
                  ]
                })
              }
            )
        }))

        return created
      },

      addDocument: (
        operationId,
        document = {}
      ) => {
        let created = null

        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                created =
                  normalizeDocument(
                    document
                  )

                return {
                  ...operation,
                  documents: [
                    ...operation.documents,
                    created
                  ],
                  updatedAt: now()
                }
              }
            )
        }))

        return created
      },

      addExpense: (
        operationId,
        expense = {}
      ) => {
        let created = null

        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                created =
                  normalizeExpense(
                    expense
                  )

                return normalizeOperation({
                  ...operation,
                  expenses: [
                    ...operation.expenses,
                    created
                  ]
                })
              }
            )
        }))

        return created
      },

      addObligation: (
        operationId,
        obligation = {}
      ) => {
        let created = null

        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                created =
                  calculateObligation({
                    ...obligation,
                    operationId:
                      operation.id
                  })

                return {
                  ...operation,
                  obligations: [
                    ...operation.obligations,
                    created
                  ],
                  updatedAt: now()
                }
              }
            )
        }))

        return created
      },

      getPayables: filters => {
        return get()
          .searchOperations(filters)
          .flatMap(
            operation =>
              operation.obligations
                .filter(
                  obligation =>
                    obligation.type ===
                    'payable'
                )
                .map(
                  obligation => ({
                    ...obligation,
                    operationId:
                      operation.id,
                    operationNumber:
                      operation.operationNumber
                  })
                )
          )
      },

      getReceivables: filters => {
        return get()
          .searchOperations(filters)
          .flatMap(
            operation =>
              operation.obligations
                .filter(
                  obligation =>
                    obligation.type ===
                    'receivable'
                )
                .map(
                  obligation => ({
                    ...obligation,
                    operationId:
                      operation.id,
                    operationNumber:
                      operation.operationNumber
                  })
                )
          )
      },

      getFinancialSummary: filters => {
        const operations =
          get().searchOperations(
            filters
          )

        const payables =
          operations.flatMap(
            operation =>
              operation.obligations.filter(
                obligation =>
                  obligation.type ===
                  'payable'
              )
          )

        const receivables =
          operations.flatMap(
            operation =>
              operation.obligations.filter(
                obligation =>
                  obligation.type ===
                  'receivable'
              )
          )

        const summarize = list => ({
          total:
            list.reduce(
              (sum, item) =>
                sum +
                numberValue(
                  item.amount
                ),
              0
            ),

          paid:
            list.reduce(
              (sum, item) =>
                sum +
                numberValue(
                  item.paidAmount
                ),
              0
            ),

          remaining:
            list.reduce(
              (sum, item) =>
                sum +
                numberValue(
                  item.remainingAmount
                ),
              0
            ),

          overdue:
            list
              .filter(
                item =>
                  item.status ===
                  'overdue'
              )
              .reduce(
                (sum, item) =>
                  sum +
                  numberValue(
                    item.remainingAmount
                  ),
                0
              )
        })

        return {
          payables:
            summarize(payables),

          receivables:
            summarize(receivables),

          operationCount:
            operations.length
        }
      },

      getDueAlerts: () => {
        const today =
          Date.now()

        return get()
          .operations
          .flatMap(operation =>
            operation.obligations
              .filter(
                obligation =>
                  obligation.alertEnabled !==
                    false &&
                  obligation.alertDismissed !==
                    true &&
                  numberValue(
                    obligation.remainingAmount
                  ) > 0 &&
                  obligation.dueDate &&
                  new Date(
                    obligation.dueDate
                  ).getTime() <=
                    today
              )
              .map(
                obligation => ({
                  ...obligation,
                  operationId:
                    operation.id,
                  operationNumber:
                    operation.operationNumber
                })
              )
          )
      },

      setObligationAlert: (
        operationId,
        obligationId,
        enabled
      ) =>
        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                return {
                  ...operation,
                  obligations:
                    operation.obligations.map(
                      obligation =>
                        String(
                          obligation.id
                        ) ===
                        String(
                          obligationId
                        )
                          ? {
                              ...obligation,
                              alertEnabled:
                                enabled === true,
                              updatedAt:
                                now()
                            }
                          : obligation
                    ),
                  updatedAt: now()
                }
              }
            )
        })),

      dismissObligationAlert: (
        operationId,
        obligationId
      ) =>
        set(state => ({
          operations:
            state.operations.map(
              operation => {
                if (
                  String(operation.id) !==
                  String(operationId)
                ) {
                  return operation
                }

                return {
                  ...operation,
                  obligations:
                    operation.obligations.map(
                      obligation =>
                        String(
                          obligation.id
                        ) ===
                        String(
                          obligationId
                        )
                          ? {
                              ...obligation,
                              alertDismissed:
                                true,
                              updatedAt:
                                now()
                            }
                          : obligation
                    ),
                  updatedAt: now()
                }
              }
            )
        })),

      clearOperations: () =>
        set({
          operations: []
        })
    }),
    {
      name: STORAGE_KEY
    }
  )
)