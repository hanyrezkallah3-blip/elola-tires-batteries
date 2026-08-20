import generateWarehouseId
  from './generateWarehouseId'


export default function createWarehouseProduct(
  product = {}
) {

  return {

    // ==================================================
    // IDENTITY
    // ==================================================

    id:
      product.id ||
      generateWarehouseId(),

    productId:
      product.productId ||
      product.id ||
      generateWarehouseId(),

    productName:
      product.productName ||
      product.name ||
      '',

    name:
      product.name ||
      product.productName ||
      '',


    // ==================================================
    // PRODUCT TYPE
    // ==================================================

    type:
      product.type ||
      product.category ||
      'tire',


    category:
      product.category ||
      product.type ||
      '',


    // ==================================================
    // PRODUCT INFORMATION
    // ==================================================

    image:
      product.image ||
      '',

    images:
      Array.isArray(
        product.images
      )
        ? product.images
        : [],

    description:
      product.description ||
      '',

    brand:
      product.brand ||
      '',

    model:
      product.model ||
      '',

    barcode:
      product.barcode ||
      '',

    sku:
      product.sku ||
      '',

    countryOfOrigin:
      product.countryOfOrigin ||
      '',


    // ==================================================
    // SPECIFICATIONS
    // ==================================================

    specifications:
      product.specifications ||
      {},

    attributes:
      product.attributes ||
      {},

    tags:
      Array.isArray(
        product.tags
      )
        ? product.tags
        : [],


    // ==================================================
    // TIRE
    // ==================================================

    tire:
      product.tire ||
      product.tireData ||
      product.tireSpecification ||
      product.tireSpecifications ||
      {},


    // ==================================================
    // BATTERY
    // ==================================================

    battery:
      product.battery ||
      {},


    // ==================================================
    // OIL
    // ==================================================

    oil:
      product.oil ||
      {},


    // ==================================================
    // VEHICLE COMPATIBILITY
    // ==================================================

    compatibleVehicles:
      Array.isArray(
        product.compatibleVehicles
      )
        ? product.compatibleVehicles
        : [],


    // ==================================================
    // STOCK
    // ==================================================

    quantity:
      Number(
        product.quantity ||
        product.availableQuantity ||
        0
      ),

    availableQuantity:
      Number(
        product.availableQuantity ??
        product.quantity ??
        0
      ),

    incoming:
      Number(
        product.incoming ||
        0
      ),

    outgoing:
      Number(
        product.outgoing ||
        0
      ),

    reserved:
      Number(
        product.reserved ||
        0
      ),


    // ==================================================
    // PRICES
    // ==================================================

    purchasePrice:
      Number(
        product.purchasePrice ||
        0
      ),

    salePrice:
      Number(
        product.salePrice ||
        0
      ),

    wholesalePrice:
      Number(
        product.wholesalePrice ||
        0
      ),

    averagePurchasePrice:
      Number(
        product.averagePurchasePrice ||
        0
      ),

    profit:
      Number(
        product.profit ||
        0
      ),

    profitMargin:
      Number(
        product.profitMargin ||
        0
      ),


    // ==================================================
    // PRICE VISIBILITY
    // ==================================================

    purchasePriceVisible:
      product.purchasePriceVisible ??
      false,

    salePriceVisible:
      product.salePriceVisible ??
      true,


    // ==================================================
    // EXTRA COST
    // ==================================================

    shippingCost:
      Number(
        product.shippingCost ||
        0
      ),

    customsCost:
      Number(
        product.customsCost ||
        0
      ),

    transportCost:
      Number(
        product.transportCost ||
        0
      ),

    otherCosts:
      Number(
        product.otherCosts ||
        0
      ),

    realCost:
      Number(
        product.realCost ??
        (
          Number(
            product.purchasePrice ||
            0
          ) +

          Number(
            product.shippingCost ||
            0
          ) +

          Number(
            product.customsCost ||
            0
          ) +

          Number(
            product.transportCost ||
            0
          ) +

          Number(
            product.otherCosts ||
            0
          )
        )
      ),


    // ==================================================
    // STOCK CONTROL
    // ==================================================

    minimumStock:
      Number(
        product.minimumStock ||
        0
      ),

    maximumStock:
      Number(
        product.maximumStock ||
        0
      ),

    reorderPoint:
      Number(
        product.reorderPoint ||
        0
      ),


    // ==================================================
    // BATCH / LOT
    // ==================================================

    batchNumber:
      product.batchNumber ||
      '',

    lotNumber:
      product.lotNumber ||
      '',

    serialNumbers:
      Array.isArray(
        product.serialNumbers
      )
        ? product.serialNumbers
        : [],

    productionDate:
      product.productionDate ||
      '',

    expiryDate:
      product.expiryDate ||
      '',

    warranty:
      product.warranty ||
      '',


    // ==================================================
    // LOCATION
    // ==================================================

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


    // ==================================================
    // SUPPLIER
    // ==================================================

    supplierId:
      product.supplierId ||
      '',

    supplierName:
      product.supplierName ||
      '',


    // ==================================================
    // UNIT
    // ==================================================

    unit:
      product.unit ||
      'piece',


    // ==================================================
    // PUBLISHING
    // ==================================================

    hidden:
      product.hidden ??
      false,

    publishedToHome:
      product.publishedToHome ??
      product.publishToHome ??
      false,

    publishedToProducts:
      product.publishedToProducts ??
      product.publishToProducts ??
      false,

    publishedToOffers:
      product.publishedToOffers ??
      product.publishToOffers ??
      false,


    // ==================================================
    // NOTES
    // ==================================================

    notes:
      product.notes ||
      '',


    // ==================================================
    // STATUS
    // ==================================================

    active:
      product.active !== false,


    // ==================================================
    // DATES
    // ==================================================

    createdAt:
      product.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  }

}
