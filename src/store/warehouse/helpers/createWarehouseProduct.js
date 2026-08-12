import generateWarehouseId from './generateWarehouseId'

export default function createWarehouseProduct(product = {}) {

  const now =
    new Date().toISOString()

  return {

    // ================= ID =================

    id:
      product.id ||
      generateWarehouseId(),

    productId:
      product.productId ||
      generateWarehouseId(),


    // ================= PRODUCT INFO =================

    name:
      product.name ||
      product.productName ||
      '',

    image:
      product.image ||
      '',

    description:
      product.description ||
      '',

    specifications:
      product.specifications ||
      {},

    typeData:
      product.typeData ||
      {},


    brand:
      product.brand ||
      '',

    model:
      product.model ||
      '',

    type:
      product.type ||
      'tire',

    sku:
      product.sku ||
      '',

    category:
      product.category ||
      '',

    barcode:
      product.barcode ||
      '',

    countryOfOrigin:
      product.countryOfOrigin ||
      '',


    // ================= STOCK =================

    quantity:
      Number(
        product.quantity || 0
      ),

    incoming:
      Number(
        product.incoming || 0
      ),

    outgoing:
      Number(
        product.outgoing || 0
      ),

    reserved:
      Number(
        product.reserved || 0
      ),

    availableQuantity:
      Number(
        product.availableQuantity ??
        product.quantity ??
        0
      ),


    // ================= PRICES =================

    purchasePrice:
      Number(
        product.purchasePrice || 0
      ),

    salePrice:
      Number(
        product.salePrice || 0
      ),

    wholesalePrice:
      Number(
        product.wholesalePrice || 0
      ),


    // ================= PUBLISHING =================
    // المخزن لا يقوم بالنشر تلقائياً.
    // إدارة المنتجات هي المسؤولة عن النشر.

    publishToHome:
      product.publishToHome ?? false,

    publishToProducts:
      product.publishToProducts ?? false,

    publishToOffers:
      product.publishToOffers ?? false,

    publishedToHome:
      product.publishedToHome ?? false,

    publishedToProducts:
      product.publishedToProducts ?? false,

    publishedToOffers:
      product.publishedToOffers ?? false,

    featured:
      product.featured ?? false,

    hidden:
      product.hidden ?? false,


    // ================= EXTRA COST =================

    shippingCost:
      Number(
        product.shippingCost || 0
      ),

    customsCost:
      Number(
        product.customsCost || 0
      ),

    transportCost:
      Number(
        product.transportCost || 0
      ),

    otherCosts:
      Number(
        product.otherCosts || 0
      ),


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


    // ================= CONTROL =================

    minimumStock:
      Number(
        product.minimumStock || 0
      ),

    maximumStock:
      Number(
        product.maximumStock || 0
      ),

    reorderPoint:
      Number(
        product.reorderPoint || 0
      ),


    // ================= BATCH =================

    batchNumber:
      product.batchNumber ||
      '',

    lotNumber:
      product.lotNumber ||
      '',

    serialNumbers:
      product.serialNumbers ||
      [],

    productionDate:
      product.productionDate ||
      '',

    expiryDate:
      product.expiryDate ||
      '',

    warranty:
      product.warranty ||
      '',


    // ================= LOCATION =================

    location:
      product.location ||
      '',

    shelf:
      product.shelf ||
      '',

    rack:
      product.rack ||
      '',

    bin:
      product.bin ||
      '',


    // ================= SUPPLIER =================

    supplierId:
      product.supplierId ||
      '',

    supplierName:
      product.supplierName ||
      '',


    // ================= UNIT =================

    unit:
      product.unit ||
      'piece',


    // ================= NOTES =================

    notes:
      product.notes ||
      '',


    // ================= CONTROL =================

    active:
      product.active !== false,


    // ================= DATES =================

    createdAt:
      product.createdAt ||
      now,

    updatedAt:
      now,


    // ================= PRESERVE EXTRA DATA =================

    ...product,


    // ================= FINAL PUBLISHING SAFETY =================
    // يمنع ...product من إعادة القيم القديمة
    // التي قد تجعل المنتج منشوراً تلقائياً.

    publishToHome:
      product.publishToHome ?? false,

    publishToProducts:
      product.publishToProducts ?? false,

    publishToOffers:
      product.publishToOffers ?? false,

    publishedToHome:
      product.publishedToHome ?? false,

    publishedToProducts:
      product.publishedToProducts ?? false,

    publishedToOffers:
      product.publishedToOffers ?? false

  }

}