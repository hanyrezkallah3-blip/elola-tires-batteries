import {
  useCallback,
  useState
} from 'react'


// ======================================================
// INITIAL FORM
//
// The form supports two distinct purposes:
//
// 1. Creating a new product
//    -> only from the warehouse workflow.
//
// 2. Creating an offer from an existing warehouse product
//    -> the warehouse product data is copied into the form.
//    -> originalSalePrice / warehouseSalePrice remain the
//       original warehouse price.
//    -> offerPrice is the new lower offer price.
//
// IMPORTANT:
// offerPrice MUST remain separate from salePrice.
// The warehouse salePrice must never be overwritten by
// the offer price.
// ======================================================

const INITIAL_PRODUCT = {

  // ====================================================
  // IDENTITY
  // ====================================================

  id: '',

  productId: '',

  selectedProductId: '',

  selectedWarehouseProductId: '',

  warehouseId: '',

  warehouseName: '',


  // ====================================================
  // BASIC
  // ====================================================

  name: '',

  productName: '',

  type: 'tire',

  category: 'tire',

  brand: '',

  model: '',

  sku: '',

  barcode: '',

  code: '',

  keywords: '',

  description: '',

  specifications: {},

  attributes: {},

  vehicleCompatibility: '',


  // ====================================================
  // PRICING
  //
  // salePrice:
  //   Original warehouse price.
  //
  // warehouseSalePrice:
  //   Explicit copy of the warehouse price.
  //
  // originalSalePrice:
  //   Explicit original price used by the offer.
  //
  // offerPrice:
  //   NEW price entered by the administrator.
  // ====================================================

  purchasePrice: 0,

  salePrice: 0,

  warehouseSalePrice: 0,

  originalSalePrice: 0,

  offerPrice: 0,

  discountPrice: 0,

  wholesalePrice: 0,

  cost: 0,


  // ====================================================
  // STOCK
  // ====================================================

  quantity: 0,

  stock: 0,

  incoming: 0,

  outgoing: 0,

  reserved: 0,

  availableQuantity: 0,

  minimumStock: 0,

  maximumStock: 0,

  reorderPoint: 0,

  unit: 'piece',


  // ====================================================
  // COSTS
  // ====================================================

  shippingCost: 0,

  customsCost: 0,

  transportCost: 0,

  otherCosts: 0,


  // ====================================================
  // SUPPLIER
  // ====================================================

  supplierId: '',

  supplierName: '',


  // ====================================================
  // BATCH
  // ====================================================

  batchNumber: '',

  lotNumber: '',

  productionDate: '',

  expiryDate: '',

  warranty: '',

  serialNumbers: [],


  // ====================================================
  // LOCATION
  // ====================================================

  location: '',

  shelf: '',

  rack: '',

  bin: '',


  // ====================================================
  // TIRE
  // ====================================================

  tire: {

    width: '',

    height: '',

    rim: '',

    loadIndex: '',

    speedRating: '',

    season: '',

    size: ''

  },


  // ====================================================
  // BATTERY
  // ====================================================

  battery: {

    capacity: '',

    cca: '',

    voltage: '',

    polarity: '',

    length: '',

    width: '',

    height: '',

    model: ''

  },


  // ====================================================
  // OIL
  // ====================================================

  oil: {

    viscosity: '',

    api: '',

    acea: '',

    volume: ''

  },


  // ====================================================
  // TYPE DATA
  // ====================================================

  typeData: {},


  // ====================================================
  // COMPATIBILITY
  // ====================================================

  compatibleVehicles: [],

  compatibleSizes: [],


  // ====================================================
  // MEDIA
  // ====================================================

  image: '',

  images: [],


  // ====================================================
  // PUBLISHING
  // ====================================================

  publishToHome: false,

  publishToProducts: false,

  publishToOffers: false,

  publishedToHome: false,

  publishedToProducts: false,

  publishedToOffers: false,

  featured: false,

  hidden: false,


  // ====================================================
  // OFFER DATA
  // ====================================================

  isOffer: false,

  offerTitle: '',

  offerDescription: '',

  offerActive: true,

  startDate: '',

  endDate: '',


  // ====================================================
  // OTHER
  // ====================================================

  notes: '',

  active: true,

  createdAt: ''

}


// ======================================================
// CREATE INITIAL FORM
//
// Return a fresh object every time.
//
// This is important because nested objects/arrays must
// not be shared between form resets.
// ======================================================

const createInitialProduct = () => ({

  ...INITIAL_PRODUCT,

  specifications: {},

  attributes: {},

  tire: {

    ...INITIAL_PRODUCT.tire

  },

  battery: {

    ...INITIAL_PRODUCT.battery

  },

  oil: {

    ...INITIAL_PRODUCT.oil

  },

  typeData: {},

  compatibleVehicles: [],

  compatibleSizes: [],

  serialNumbers: [],

  images: []

})


// ======================================================
// HOOK
// ======================================================

export default function useProductForm() {

  const [

    form,

    setForm

  ] = useState(

    createInitialProduct

  )


  // ====================================================
  // RESET
  // ====================================================

  const resetForm =
    useCallback(() => {

      setForm(

        createInitialProduct()

      )

    }, [])


  // ====================================================
  // LOAD WAREHOUSE PRODUCT
  //
  // This helper is intentionally inside the form hook.
  //
  // It copies the warehouse product into the form while
  // preserving the pricing separation required for offers.
  //
  // IMPORTANT:
  // The warehouse product itself is NOT modified here.
  // ====================================================

  const loadWarehouseProduct =
    useCallback((product = {}, warehouse = null) => {

      if (!product) {

        return

      }


      // ==================================================
      // ORIGINAL WAREHOUSE SALE PRICE
      // ==================================================

      const warehouseSalePrice =
        Number(
          product.salePrice ??
          product.price ??
          0
        )


      const safeWarehouseSalePrice =
        Number.isFinite(
          warehouseSalePrice
        )
          ? warehouseSalePrice
          : 0


      // ==================================================
      // PRODUCT ID
      // ==================================================

      const productId =
        product.productId ||
        product.id ||
        ''


      // ==================================================
      // COPY PRODUCT
      // ==================================================

      setForm({

        ...createInitialProduct(),

        // ----------------------------------------------
        // IDENTITY
        // ----------------------------------------------

        id:
          product.id ||
          productId,

        productId,

        selectedProductId:
          productId,

        selectedWarehouseProductId:
          product.id ||
          productId,

        warehouseId:
          warehouse?.id ||
          product.warehouseId ||
          '',

        warehouseName:
          warehouse?.name ||
          product.warehouseName ||
          '',


        // ----------------------------------------------
        // BASIC
        // ----------------------------------------------

        name:
          product.name ||
          product.productName ||
          '',

        productName:
          product.productName ||
          product.name ||
          '',

        type:
          product.type ||
          'tire',

        category:
          product.category ||
          product.type ||
          '',

        brand:
          product.brand ||
          '',

        model:
          product.model ||
          '',

        sku:
          product.sku ||
          '',

        barcode:
          product.barcode ||
          '',

        code:
          product.code ||
          '',

        keywords:
          product.keywords ||
          '',

        description:
          product.description ||
          '',

        specifications:
          product.specifications ||
          {},

        attributes:
          product.attributes ||
          {},

        vehicleCompatibility:
          product.vehicleCompatibility ||
          '',


        // ----------------------------------------------
        // PRICING
        //
        // The warehouse price is copied into all
        // ORIGINAL price fields.
        //
        // offerPrice starts with the same value so the
        // administrator can immediately see the current
        // price and then lower it.
        // ----------------------------------------------

        purchasePrice:
          Number(
            product.purchasePrice ??
            0
          ),

        salePrice:
          safeWarehouseSalePrice,

        warehouseSalePrice:
          safeWarehouseSalePrice,

        originalSalePrice:
          safeWarehouseSalePrice,

        offerPrice:
          safeWarehouseSalePrice,

        discountPrice:
          Number(
            product.discountPrice ??
            0
          ),

        wholesalePrice:
          Number(
            product.wholesalePrice ??
            0
          ),

        cost:
          Number(
            product.cost ??
            product.purchasePrice ??
            0
          ),


        // ----------------------------------------------
        // STOCK
        // ----------------------------------------------

        quantity:
          Number(
            product.quantity ??
            0
          ),

        stock:
          Number(
            product.quantity ??
            product.stock ??
            0
          ),

        incoming:
          Number(
            product.incoming ??
            0
          ),

        outgoing:
          Number(
            product.outgoing ??
            0
          ),

        reserved:
          Number(
            product.reserved ??
            0
          ),

        availableQuantity:
          Number(
            product.availableQuantity ??
            product.quantity ??
            0
          ),

        minimumStock:
          Number(
            product.minimumStock ??
            0
          ),

        maximumStock:
          Number(
            product.maximumStock ??
            0
          ),

        reorderPoint:
          Number(
            product.reorderPoint ??
            0
          ),

        unit:
          product.unit ||
          'piece',


        // ----------------------------------------------
        // COSTS
        // ----------------------------------------------

        shippingCost:
          Number(
            product.shippingCost ??
            0
          ),

        customsCost:
          Number(
            product.customsCost ??
            0
          ),

        transportCost:
          Number(
            product.transportCost ??
            0
          ),

        otherCosts:
          Number(
            product.otherCosts ??
            0
          ),


        // ----------------------------------------------
        // SUPPLIER
        // ----------------------------------------------

        supplierId:
          product.supplierId ||
          '',

        supplierName:
          product.supplierName ||
          '',


        // ----------------------------------------------
        // BATCH
        // ----------------------------------------------

        batchNumber:
          product.batchNumber ||
          '',

        lotNumber:
          product.lotNumber ||
          '',

        productionDate:
          product.productionDate ||
          '',

        expiryDate:
          product.expiryDate ||
          '',

        warranty:
          product.warranty ||
          '',

        serialNumbers:
          Array.isArray(
            product.serialNumbers
          )
            ? product.serialNumbers
            : [],


        // ----------------------------------------------
        // LOCATION
        // ----------------------------------------------

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


        // ----------------------------------------------
        // TYPE DATA
        // ----------------------------------------------

        typeData:
          product.typeData ||
          {},

        tire:
          product.tire ||
          {},

        battery:
          product.battery ||
          {},

        oil:
          product.oil ||
          {},


        // ----------------------------------------------
        // COMPATIBILITY
        // ----------------------------------------------

        compatibleVehicles:
          Array.isArray(
            product.compatibleVehicles
          )
            ? product.compatibleVehicles
            : [],

        compatibleSizes:
          Array.isArray(
            product.compatibleSizes
          )
            ? product.compatibleSizes
            : [],


        // ----------------------------------------------
        // MEDIA
        // ----------------------------------------------

        image:
          product.image ||
          '',

        images:
          Array.isArray(
            product.images
          )
            ? product.images
            : [],


        // ----------------------------------------------
        // PUBLISHING
        // ----------------------------------------------

        publishToHome:
          product.publishToHome ??
          product.publishedToHome ??
          false,

        publishToProducts:
          product.publishToProducts ??
          product.publishedToProducts ??
          false,

        publishToOffers:
          true,

        publishedToHome:
          product.publishedToHome ??
          product.publishToHome ??
          false,

        publishedToProducts:
          product.publishedToProducts ??
          product.publishToProducts ??
          false,

        publishedToOffers:
          true,

        featured:
          product.featured ??
          false,

        hidden:
          product.hidden ??
          false,


        // ----------------------------------------------
        // OFFER
        // ----------------------------------------------

        isOffer:
          true,

        offerTitle:
          product.offerTitle ||
          `عرض ${product.name || product.productName || ''}`,

        offerDescription:
          product.offerDescription ||
          '',

        offerActive:
          true,

        startDate:
          '',

        endDate:
          '',


        // ----------------------------------------------
        // OTHER
        // ----------------------------------------------

        notes:
          product.notes ||
          '',

        active:
          product.active !== false,

        createdAt:
          product.createdAt ||
          ''

      })

    }, [])


  // ====================================================
  // RETURN
  // ====================================================

  return {

    form,

    setForm,

    resetForm,

    loadWarehouseProduct

  }

}