import { useMemo } from 'react'
import { useWarehouseStore } from '../../../store/warehouseStore'

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
        ''

    }))
  }


  const handleProductChange = (
    productId
  ) => {

    if (!productId) {

      setForm(prev => ({

        ...prev,

        selectedProductId:
          '',

        selectedWarehouseProductId:
          ''

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
      return
    }


    const productIdValue =
      product.productId ||
      product.id ||
      ''


    setForm(prev => ({

      ...prev,

      // ==========================
      // PRODUCT IDENTITY
      // ==========================

      id:
        product.id ||
        prev.id ||
        '',

      selectedProductId:
        productIdValue,

      selectedWarehouseProductId:
        product.id ||
        '',

      warehouseId:
        selectedWarehouse?.id ||
        prev.warehouseId ||
        '',

      warehouseName:
        selectedWarehouse?.name ||
        prev.warehouseName ||
        '',


      // ==========================
      // BASIC
      // ==========================

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


      // ==========================
      // PRODUCT INFO
      // ==========================

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


      // ==========================
      // PRICING
      // ==========================

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

      discountPrice:
        Number(
          product.discountPrice ||
          0
        ),

      cost:
        Number(
          product.cost ||
          product.purchasePrice ||
          0
        ),


      // ==========================
      // STOCK INFORMATION
      // ==========================

      quantity:
        Number(
          product.quantity ||
          0
        ),

      stock:
        Number(
          product.quantity ||
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

      availableQuantity:
        Number(
          product.availableQuantity ??
          product.quantity ??
          0
        ),


      // ==========================
      // STOCK CONTROL
      // ==========================

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

      unit:
        product.unit ||
        'piece',


      // ==========================
      // COSTS
      // ==========================

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


      // ==========================
      // SUPPLIER
      // ==========================

      supplierId:
        product.supplierId ||
        '',

      supplierName:
        product.supplierName ||
        '',


      // ==========================
      // BATCH
      // ==========================

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
        product.serialNumbers ||
        [],


      // ==========================
      // LOCATION
      // ==========================

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


      // ==========================
      // PUBLISHING
      // ==========================

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


      // ==========================
      // TYPE DATA
      // ==========================

      typeData:
        product.typeData ||
        {},

      tire:
        product.tire ||
        prev.tire ||
        {},

      battery:
        product.battery ||
        prev.battery ||
        {},

      oil:
        product.oil ||
        prev.oil ||
        {},


      // ==========================
      // COMPATIBILITY
      // ==========================

      compatibleVehicles:
        product.compatibleVehicles ||
        [],

      compatibleSizes:
        product.compatibleSizes ||
        [],

      vehicleCompatibility:
        product.vehicleCompatibility ||
        '',


      // ==========================
      // MEDIA
      // ==========================

      images:
        product.images ||
        [],


      // ==========================
      // OTHER
      // ==========================

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
        داخله لتحميل بياناته وتعديلها.
      </div>


      {/* ==========================
          WAREHOUSE
      ========================== */}

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
                key={warehouse.id}
                value={warehouse.id}
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


      {/* ==========================
          PRODUCTS
      ========================== */}

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

                  </option>

                )
              )
            }

          </select>

        )
      }


      {/* ==========================
          NO PRODUCTS
      ========================== */}

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


      {/* ==========================
          SELECTED PRODUCT
      ========================== */}

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
            "
          >

            ✓ تم اختيار المنتج:

            {' '}

            <span className="text-white">
              {form.name}
            </span>

            <br />

            يمكنك الآن تعديل البيانات في الأقسام
            التالية ثم حفظ التعديلات.

          </div>

        )
      }


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