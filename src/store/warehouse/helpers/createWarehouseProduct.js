import generateWarehouseId from './generateWarehouseId'

export default function createWarehouseProduct(product = {}) {

  return {

    id:
      product.id ||
      generateWarehouseId(),

    productId:
      product.productId ||
      generateWarehouseId(),

    name:
  product.name ||
  product.productName ||
  '',

    image:
      product.image || '',

    description:
      product.description || '',

    specifications:
      product.specifications || {},

    typeData:
  product.typeData || {},

    // ================= PRODUCT INFO =================

    brand:
      product.brand || '',
    
    model:
  product.model || '',

type:
  product.type || 'tire',

sku:
  product.sku || '',

    category:
      product.category || '',

    barcode:
      product.barcode || '',

    countryOfOrigin:
      product.countryOfOrigin || '',


    // ================= STOCK =================

    quantity:
      Number(product.quantity || 0),

    incoming:
      Number(product.incoming || 0),

    outgoing:
      Number(product.outgoing || 0),

    reserved:
      Number(product.reserved || 0),


    // ================= PRICES =================

    purchasePrice:
      Number(product.purchasePrice || 0),

    salePrice:
      Number(product.salePrice || 0),

    wholesalePrice:
      Number(product.wholesalePrice || 0),
    
    publishToHome:
  product.publishToHome ?? true,

publishToProducts:
  product.publishToProducts ?? true,

publishToOffers:
  product.publishToOffers ?? false,

featured:
  product.featured ?? false,

hidden:
  product.hidden ?? false,


    // ================= EXTRA COST =================

    shippingCost:
      Number(product.shippingCost || 0),

    customsCost:
      Number(product.customsCost || 0),

    transportCost:
      Number(product.transportCost || 0),

    otherCosts:
      Number(product.otherCosts || 0),


    realCost:
      Number(
        product.purchasePrice || 0
      ) +

      Number(
        product.shippingCost || 0
      ) +

      Number(
        product.customsCost || 0
      ) +

      Number(
        product.transportCost || 0
      ) +

      Number(
        product.otherCosts || 0
      ),

      availableQuantity:
  Number(product.quantity || 0),


    // ================= CONTROL =================

    minimumStock:
      Number(product.minimumStock || 0),

    maximumStock:
      Number(product.maximumStock || 0),

    reorderPoint:
      Number(product.reorderPoint || 0),


    // ================= BATCH =================

    batchNumber:
      product.batchNumber || '',

    lotNumber:
      product.lotNumber || '',

    serialNumbers:
      product.serialNumbers || [],


    productionDate:
      product.productionDate || '',

    expiryDate:
      product.expiryDate || '',


    warranty:
      product.warranty || '',


    // ================= LOCATION =================

    location:
      product.location || '',

    shelf:
      product.shelf || '',

    rack:
      product.rack || '',

    bin:
      product.bin || '',


    supplierId:
      product.supplierId || '',

    supplierName:
      product.supplierName || '',


    unit:
      product.unit || 'piece',


    notes:
      product.notes || '',
    
    // ================= PUBLISHING =================

hidden:
  product.hidden ?? false,

publishedToHome:
  product.publishedToHome ?? true,

publishedToProducts:
  product.publishedToProducts ?? true,

publishedToOffers:
  product.publishedToOffers ?? false,

featured:
  product.featured ?? false,  

    active:
      product.active !== false,


    createdAt:
      product.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    ...product

  }

}