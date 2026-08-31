import { useMemo } from 'react'

import {
  useWarehouseStore
} from '../../../store/warehouseStore'


export default function ProductWarehouseSection({

  form,

  setForm

}) {

  const warehouses =
    useWarehouseStore(
      state => state.warehouses || []
    )


  const activeWarehouses =
    useMemo(
      () =>
        warehouses.filter(
          warehouse =>
            warehouse.active !== false
        ),
      [warehouses]
    )


  const selectedWarehouse =
    useMemo(
      () =>
        activeWarehouses.find(
          warehouse =>
            String(warehouse.id) ===
            String(form.warehouseId)
        ) || null,
      [
        activeWarehouses,
        form.warehouseId
      ]
    )


  const warehouseProducts =
    useMemo(
      () =>
        selectedWarehouse?.products || [],
      [selectedWarehouse]
    )


  // ======================================================
  // WAREHOUSE CHANGE
  // ======================================================

  const handleWarehouseChange = (
    warehouseId
  ) => {

    const warehouse =
      activeWarehouses.find(
        item =>
          String(item.id) ===
          String(warehouseId)
      )


    setForm(prev => ({

      ...prev,

      warehouseId:
        warehouseId,

      warehouseName:
        warehouse?.name || '',

      selectedProductId:
        '',

      selectedWarehouseProductId:
        '',

      originalSalePrice:
        0,

      warehouseSalePrice:
        0,

      offerPrice:
        0,

      // ==================================================
      // QUANTITY VISIBILITY
      // ==================================================

      showQuantityOnProducts:
        false,

      showQuantityOnOffers:
        false

    }))

  }


  // ======================================================
  // PRODUCT CHANGE
  // ======================================================

  const handleProductChange = (
    productId
  ) => {

    if (!productId) {

      setForm(prev => ({

        ...prev,

        selectedProductId:
          '',

        selectedWarehouseProductId:
          '',

        originalSalePrice:
          0,

        warehouseSalePrice:
          0,

        offerPrice:
          0,

        showQuantityOnProducts:
          false,

        showQuantityOnOffers:
          false

      }))

      return

    }


    const product =
      warehouseProducts.find(
        item =>
          String(
            item.productId ||
            item.id
          ) ===
          String(productId)
      )


    if (!product) {

      console.error(
        'Warehouse product not found:',
        productId
      )

      return

    }


    // ====================================================
    // IDS
    // ====================================================

    const productIdValue =
      product.productId ||
      product.id ||
      ''


    const warehouseProductId =
      product.id ||
      product.productId ||
      ''


    // ====================================================
    // ORIGINAL WAREHOUSE SALE PRICE
    //
    // IMPORTANT:
    // This value is copied from the warehouse product.
    // It becomes the reference price for the offer.
    // ====================================================

    const warehouseSalePrice =
      Number(
        product.salePrice ??
        product.price ??
        product.sellingPrice ??
        product.retailPrice ??
        0
      )


    const originalSalePrice =
      warehouseSalePrice


    // ====================================================
    // OFFER PRICE
    //
    // Initially the offer price is the same as the
    // warehouse price. The user can change it later.
    // ====================================================

    const offerPrice =
      warehouseSalePrice


    // ====================================================
    // LOAD ALL PRODUCT DATA
    // ====================================================

    setForm(prev => ({

      ...prev,


      // ==================================================
      // PRODUCT IDENTITY
      // ==================================================

      id:
        product.productId ||
        product.id ||
        prev.id ||
        '',

      selectedProductId:
        productIdValue,

      selectedWarehouseProductId:
        warehouseProductId,

      productId:
        productIdValue,

      warehouseId:
        selectedWarehouse?.id ||
        prev.warehouseId ||
        '',

      warehouseName:
        selectedWarehouse?.name ||
        prev.warehouseName ||
        '',


      // ==================================================
      // BASIC
      // ==================================================

      name:
        product.name ||
        product.productName ||
        '',

      productName:
        product.productName ||
        product.name ||
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


      // ==================================================
      // PRODUCT INFO
      // ==================================================

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

      countryOfOrigin:
        product.countryOfOrigin ||
        '',

      keywords:
        product.keywords ||
        '',


      // ==================================================
      // PRICING
      //
      // Warehouse values are copied exactly.
      // ==================================================

      purchasePrice:
        Number(
          product.purchasePrice ??
          0
        ),

      salePrice:
        warehouseSalePrice,

      originalSalePrice:
        originalSalePrice,

      warehouseSalePrice:
        warehouseSalePrice,

      offerPrice:
        offerPrice,

      wholesalePrice:
        Number(
          product.wholesalePrice ??
          0
        ),

      discountPrice:
        Number(
          product.discountPrice ??
          0
        ),

      cost:
        Number(
          product.cost ??
          product.purchasePrice ??
          0
        ),


      // ==================================================
      // STOCK
      // ==================================================

      quantity:
        Number(
          product.quantity ??
          0
        ),

      stock:
        Number(
          product.stock ??
          product.quantity ??
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


      // ==================================================
      // STOCK CONTROL
      // ==================================================

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


      // ==================================================
      // COSTS
      // ==================================================

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

      additionalCost:
        Number(
          product.additionalCost ??
          0
        ),


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
      // BATCH
      // ==================================================

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
      // PUBLISHING
      // ==================================================

      publishToHome:
        product.publishToHome ??
        product.publishedToHome ??
        false,

      publishToProducts:
        product.publishToProducts ??
        product.publishedToProducts ??
        false,

      publishToOffers:
        product.publishToOffers ??
        product.publishedToOffers ??
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

      featured:
        product.featured ??
        false,

      hidden:
        product.hidden ??
        false,


      // ==================================================
      // QUANTITY VISIBILITY
      //
      // IMPORTANT:
      // Default is FALSE.
      //
      // This controls what the customer sees,
      // NOT the real inventory quantity.
      // ==================================================

      showQuantityOnProducts:
        product.showQuantityOnProducts ??
        false,

      showQuantityOnOffers:
        product.showQuantityOnOffers ??
        false,


      // ==================================================
      // TYPE DATA
      // ==================================================

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


      // ==================================================
      // COMPATIBILITY
      // ==================================================

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

      vehicleCompatibility:
        product.vehicleCompatibility ||
        '',


      // ==================================================
      // MEDIA
      // ==================================================

      images:
        Array.isArray(
          product.images
        )
          ? product.images
          : [],


      // ==================================================
      // OTHER
      // ==================================================

      notes:
        product.notes ||
        '',

      active:
        product.active !== false,

      createdAt:
        product.createdAt ||
        prev.createdAt ||
        ''

    }))

  }


  return (

    <div

      className="
        bg-slate-900
        border
        border-slate-700
        rounded-3xl
        p-6
        space-y-5
      "

    >

      <h3

        className="
          text-2xl
          font-black
          text-yellow-400
        "

      >

        اختيار المنتج من المخزن

      </h3>


      <div

        className="
          text-gray-400
          font-bold
        "

      >

        اختر المخزن أولاً ثم اختر منتجًا موجودًا
        داخله لتحميل بياناته تلقائيًا.

      </div>


      {/* ==================================================
          WAREHOUSE
      ================================================== */}

      <select

        value={
          form.warehouseId || ''
        }

        onChange={(e) =>
          handleWarehouseChange(
            e.target.value
          )
        }

        className="
          w-full
          p-4
          rounded-2xl
          bg-white
          text-black
          font-bold
        "

      >

        <option value="">

          اختر المخزن

        </option>

        {

          activeWarehouses.map(
            warehouse => (

              <option

                key={
                  warehouse.id
                }

                value={
                  warehouse.id
                }

              >

                {warehouse.name}

                {

                  warehouse.type
                    ? ` (${warehouse.type})`
                    : ''

                }

              </option>

            )

          )

        }

      </select>


      {/* ==================================================
          PRODUCTS
      ================================================== */}

      {

        form.warehouseId && (

          <select

            value={
              form.selectedProductId ||
              ''
            }

            onChange={(e) =>
              handleProductChange(
                e.target.value
              )
            }

            className="
              w-full
              p-4
              rounded-2xl
              bg-yellow-50
              text-black
              font-bold
              border-2
              border-yellow-500
            "

          >

            <option value="">

              اختر المنتج الموجود في المخزن

            </option>

            {

              warehouseProducts.map(
                product => (

                  <option

                    key={

                      product.productId ||
                      product.id

                    }

                    value={

                      product.productId ||
                      product.id

                    }

                  >

                    {

                      product.name ||
                      product.productName ||
                      'منتج بدون اسم'

                    }

                    {' — الكمية: '}

                    {

                      Number(
                        product.quantity ||
                        0
                      )

                    }

                    {' — السعر: '}

                    {

                      Number(

                        product.salePrice ??
                        product.price ??
                        product.sellingPrice ??
                        product.retailPrice ??
                        0

                      )

                    }

                  </option>

                )

              )

            }

          </select>

        )

      }


      {/* ==================================================
          NO PRODUCTS
      ================================================== */}

      {

        form.warehouseId &&
        warehouseProducts.length === 0 && (

          <div

            className="
              rounded-2xl
              bg-red-900/30
              border
              border-red-500
              p-4
              text-red-300
              font-bold
            "

          >

            لا توجد منتجات في هذا المخزن.

            <br />

            إضافة منتج جديد إلى المخزن تتم
            من صفحة إدارة المخازن فقط.

          </div>

        )

      }


      {/* ==================================================
          SELECTED PRODUCT
      ================================================== */}

      {

        form.selectedProductId && (

          <div

            className="
              rounded-2xl
              bg-green-900/30
              border
              border-green-500
              p-4
              text-green-300
              font-bold
              space-y-2
            "

          >

            <div>

              ✓ تم اختيار المنتج:

              {' '}

              <span className="text-white">

                {form.name}

              </span>

            </div>


            <div>

              سعر المنتج في المخزن:

              {' '}

              <span className="text-yellow-400">

                {

                  Number(
                    form.originalSalePrice ||
                    0
                  ).toFixed(2)

                }

              </span>

            </div>


            <div>

              هذا السعر محفوظ كسعر أصلي للعرض
              ولن يتغير عند تغيير سعر العرض.

            </div>

          </div>

        )

      }


      {/* ==================================================
          CUSTOMER STOCK VISIBILITY
      ================================================== */}

      {

        form.selectedProductId && (

          <div

            className="
              rounded-3xl
              bg-slate-800
              border
              border-cyan-500/40
              p-6
              space-y-5
            "

          >

            <div>

              <h3

                className="
                  text-2xl
                  font-black
                  text-cyan-400
                "

              >

                👁 التحكم في ظهور الكمية للعميل

              </h3>

              <p

                className="
                  text-gray-400
                  mt-2
                  leading-relaxed
                "

              >

                هذه الإعدادات تتحكم فقط في المعلومات
                التي يراها العميل. كمية المخزون الحقيقية
                تظل محفوظة ويستخدمها النظام في البيع
                والتحقق من التوفر.

              </p>

            </div>


            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <label

              className="
                flex
                items-center
                justify-between
                gap-4
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-5
                cursor-pointer
              "

            >

              <div>

                <div

                  className="
                    text-lg
                    font-black
                    text-white
                  "

                >

                  إظهار الكمية في صفحة المنتجات

                </div>

                <div

                  className="
                    text-sm
                    text-gray-400
                    mt-1
                  "

                >

                  عند التفعيل سيظهر للعميل
                  العدد الفعلي المتاح.

                </div>

              </div>


              <input

                type="checkbox"

                checked={
                  Boolean(
                    form.showQuantityOnProducts
                  )
                }

                onChange={(e) =>
                  setForm(prev => ({

                    ...prev,

                    showQuantityOnProducts:
                      e.target.checked

                  }))
                }

                className="
                  w-6
                  h-6
                  accent-cyan-500
                  cursor-pointer
                "

              />

            </label>


            {/* ==================================================
                OFFERS
            ================================================== */}

            <label

              className="
                flex
                items-center
                justify-between
                gap-4
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-5
                cursor-pointer
              "

            >

              <div>

                <div

                  className="
                    text-lg
                    font-black
                    text-white
                  "

                >

                  إظهار الكمية في العروض

                </div>

                <div

                  className="
                    text-sm
                    text-gray-400
                    mt-1
                  "

                >

                  عند التفعيل سيظهر للعميل
                  العدد الفعلي المتاح في العرض.

                </div>

              </div>


              <input

                type="checkbox"

                checked={
                  Boolean(
                    form.showQuantityOnOffers
                  )
                }

                onChange={(e) =>
                  setForm(prev => ({

                    ...prev,

                    showQuantityOnOffers:
                      e.target.checked

                  }))
                }

                className="
                  w-6
                  h-6
                  accent-cyan-500
                  cursor-pointer
                "

              />

            </label>


            <div

              className="
                bg-yellow-900/20
                border
                border-yellow-500/30
                rounded-2xl
                p-4
                text-yellow-300
                text-sm
                font-bold
              "

            >

              الوضع الافتراضي:

              {' '}

              لا تظهر الكمية للعميل.

              <br />

              سيظهر فقط "متوفر" أو "غير متوفر".

            </div>

          </div>

        )

      }


      {/* ==================================================
          NO WAREHOUSES
      ================================================== */}

      {

        activeWarehouses.length === 0 && (

          <div

            className="
              rounded-2xl
              bg-red-900/30
              border
              border-red-500
              p-4
              text-red-300
              font-bold
            "

          >

            لا يوجد أي مخزن مسجل.

            قم بإنشاء المخازن والمنتجات من صفحة
            إدارة المخازن أولاً.

          </div>

        )

      }

    </div>

  )

}