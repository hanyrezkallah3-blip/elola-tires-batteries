import createWarehouseProduct from './createWarehouseProduct'

const generateId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return (
    Date.now().toString() +
    Math.random().toString(36).slice(2)
  )
}

export default function addProductToWarehouse(
  warehouses = [],
  warehouseId,
  product = {}
) {

  if (!warehouseId || !product) {
    return warehouses
  }

  const productName =
    String(
      product.productName ||
      product.name ||
      ''
    ).trim()

  if (!productName) {
    return warehouses
  }

  return warehouses.map(
    warehouse => {

      if (
        String(warehouse.id) !==
        String(warehouseId)
      ) {
        return warehouse
      }

      const normalizedProduct = {
        ...product,

        productName,

        productId:
          product.productId ||
          product.id ||
          generateId()
      }

      const exists =
        (warehouse.products || [])
          .some(
            item =>
              String(item.productId) ===
              String(
                normalizedProduct.productId
              ) ||
              String(item.id) ===
              String(
                normalizedProduct.productId
              )
          )

      if (exists) {
        return warehouse
      }

      const createdProduct =
        createWarehouseProduct(
          normalizedProduct
        )

      const quantity =
        Number(
          createdProduct.quantity ||
          normalizedProduct.quantity ||
          0
        )

      const purchasePrice =
        Number(
          createdProduct.purchasePrice ||
          normalizedProduct.purchasePrice ||
          0
        )

      const salePrice =
        Number(
          createdProduct.salePrice ||
          normalizedProduct.salePrice ||
          0
        )

      const now =
        new Date().toISOString()

      // ==========================================
      // INITIAL STOCK TRANSACTION
      // ==========================================

      const initialTransaction = {

        id:
          generateId(),

        type:
          'in',

        warehouseId:
          warehouse.id,

        warehouseName:
          warehouse.name || '',

        productId:
          createdProduct.productId ||
          createdProduct.id ||
          normalizedProduct.productId,

        productName:
          createdProduct.productName ||
          productName,

        quantity,

        previousQuantity:
          0,

        beforeQuantity:
          0,

        newQuantity:
          quantity,

        afterQuantity:
          quantity,

        incoming:
          quantity,

        outgoing:
          0,

        unitPrice:
          purchasePrice,

        purchasePrice,

        salePrice,

        totalValue:
          quantity *
          purchasePrice,

        userId:
          product.userId ||
          '',

        userName:
          product.userName ||
          '',

        notes:
          product.notes ||
          'إضافة مخزون أولي عند إنشاء المنتج',

        reference:
          product.reference ||
          '',

        source:
          product.source ||
          'initial_stock',

        createdAt:
          now,

        updatedAt:
          now

      }

      return {

        ...warehouse,

        products: [

          ...(warehouse.products || []),

          createdProduct

        ],

        transactions: [

          ...(warehouse.transactions || []),

          initialTransaction

        ]

      }

    }
  )
}