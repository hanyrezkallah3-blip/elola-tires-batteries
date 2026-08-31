import ProductBasicSection
from './form/ProductBasicSection'

import ProductTypeSection
from './form/ProductTypeSection'

import ProductPricingSection
from './form/ProductPricingSection'

import ProductWarehouseSection
from './form/ProductWarehouseSection'

import ProductTireSection
from './form/ProductTireSection'

import ProductBatterySection
from './form/ProductBatterySection'

import ProductOilSection
from './form/ProductOilSection'

import ProductCompatibilitySection
from './form/ProductCompatibilitySection'

import ProductMediaSection
from './form/ProductMediaSection'

import ProductSubmitButton
from './form/ProductSubmitButton'

import useProductForm
from '../../hooks/products/useProductForm'

import {
useCallback
} from 'react'

export default function ProductForm({

onAddProduct

}) {

const {

form,

setForm,

resetForm

} = useProductForm()

// ==================================================
// SUBMIT OFFER
//
// IMPORTANT BUSINESS RULE
//
// New products are created ONLY from the Warehouse
// page.
//
// Products page:
// - selects an existing warehouse product
// - copies its data
// - copies its warehouse sale price
// - creates an OFFER linked to that product
// - allows changing ONLY the offer price
//
// The warehouse product itself is NEVER modified.
// ==================================================

const submit =
useCallback(async () => {

  // ==================================================
  // WAREHOUSE
  // ==================================================

  if (
    !form.warehouseId
  ) {

    alert(
      'اختر المخزن أولاً'
    )

    return

  }


  // ==================================================
  // EXISTING PRODUCT
  // ==================================================

  if (
    !form.selectedProductId
  ) {

    alert(
      'اختر منتجًا موجودًا في المخزن أولاً'
    )

    return

  }


  // ==================================================
  // PRODUCT NAME
  // ==================================================

  const productName =
    String(
      form.name ||
      form.productName ||
      ''
    ).trim()


  if (!productName) {

    alert(
      'اسم المنتج مطلوب'
    )

    return

  }


  // ==================================================
  // WAREHOUSE PRICE
  //
  // This is the original price of the product
  // currently stored in the warehouse.
  //
  // It is copied into the offer as the old price.
  // ==================================================

  const originalPrice =
    Number(
      form.originalSalePrice ??
      form.warehouseSalePrice ??
      form.salePrice ??
      0
    )


  if (
    !Number.isFinite(
      originalPrice
    ) ||
    originalPrice <= 0
  ) {

    alert(
      'سعر المنتج في المخزن غير صحيح'
    )

    return

  }


  // ==================================================
  // OFFER PRICE
  //
  // The user changes this price.
  //
  // It MUST be lower than the warehouse price.
  // ==================================================

  const offerPrice =
    Number(
      form.offerPrice ??
      0
    )


  if (
    !Number.isFinite(
      offerPrice
    ) ||
    offerPrice <= 0
  ) {

    alert(
      'يجب إدخال سعر العرض'
    )

    return

  }


  if (
    offerPrice >= originalPrice
  ) {

    alert(
      'سعر العرض يجب أن يكون أقل من سعر المنتج الحالي في المخزن'
    )

    return

  }


  // ==================================================
  // DISCOUNT
  // ==================================================

  const discount =
    Number(
      (
        (
          originalPrice -
          offerPrice
        ) /
        originalPrice
      ) *
      100
    )


  // ==================================================
  // OFFER OBJECT
  //
  // IMPORTANT:
  //
  // selectedProductId is intentionally included because
  // the action layer must know this is an existing
  // warehouse product and NOT a new product.
  //
  // isOffer is also explicit.
  // ==================================================

  const offer = {

    // ----------------------------------------------
    // OFFER FLAGS
    // ----------------------------------------------

    isOffer:
      true,

    source:
      'warehouse',


    // ----------------------------------------------
    // EXISTING PRODUCT REFERENCE
    // ----------------------------------------------

    selectedProductId:
      form.selectedProductId,

    selectedWarehouseProductId:
      form.selectedWarehouseProductId ||
      form.selectedProductId,

    productId:
      form.selectedProductId,

    sourceProductId:
      form.selectedProductId,


    // ----------------------------------------------
    // WAREHOUSE REFERENCE
    // ----------------------------------------------

    warehouseId:
      form.warehouseId,

    warehouseName:
      form.warehouseName ||
      '',


    // ----------------------------------------------
    // PRODUCT DATA
    //
    // These values were copied from the warehouse
    // product by ProductWarehouseSection.
    // ----------------------------------------------

    name:
      productName,

    productName:
      productName,

    title:
      form.offerTitle ||
      `عرض ${productName}`,

    description:
      form.offerDescription ||
      form.description ||
      '',

    type:
      form.type ||
      '',

    category:
      form.category ||
      '',

    brand:
      form.brand ||
      '',

    model:
      form.model ||
      '',

    sku:
      form.sku ||
      '',

    barcode:
      form.barcode ||
      '',

    code:
      form.code ||
      '',

    countryOfOrigin:
      form.countryOfOrigin ||
      '',


    // ----------------------------------------------
    // TYPE DATA
    // ----------------------------------------------

    tire:
      form.tire ||
      {},

    battery:
      form.battery ||
      {},

    oil:
      form.oil ||
      {},

    typeData:
      form.typeData ||
      {},


    // ----------------------------------------------
    // COMPATIBILITY
    // ----------------------------------------------

    compatibleVehicles:
      Array.isArray(
        form.compatibleVehicles
      )
        ? form.compatibleVehicles
        : [],

    compatibleSizes:
      Array.isArray(
        form.compatibleSizes
      )
        ? form.compatibleSizes
        : [],

    vehicleCompatibility:
      form.vehicleCompatibility ||
      '',


    // ----------------------------------------------
    // MEDIA
    // ----------------------------------------------

    image:
      form.image ||
      '',

    images:
      Array.isArray(
        form.images
      )
        ? form.images
        : [],


    // ----------------------------------------------
    // PRICING
    //
    // originalPrice:
    //   Warehouse price BEFORE the offer.
    //
    // oldPrice:
    //   Same warehouse price displayed as old price.
    //
    // offerPrice:
    //   New lower price.
    //
    // salePrice:
    //   Kept equal to offerPrice for compatibility
    //   with existing offer rendering.
    // ----------------------------------------------

    originalPrice:
      originalPrice,

    warehouseSalePrice:
      originalPrice,

    oldPrice:
      originalPrice,

    offerPrice:
      offerPrice,

    salePrice:
      offerPrice,

    discount:
      discount,


    // ----------------------------------------------
    // OFFER STATUS
    // ----------------------------------------------

    active:
      form.offerActive !== false,

    startDate:
      form.startDate ||
      '',

    endDate:
      form.endDate ||
      '',


    // ----------------------------------------------
    // PUBLISHING
    // ----------------------------------------------

    publishToHome:
      form.publishToHome !== false,

    publishedToHome:
      form.publishedToHome !== false,


    // ----------------------------------------------
    // TIMESTAMPS
    // ----------------------------------------------

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  }


  // ==================================================
  // SEND OFFER
  // ==================================================

  if (
    typeof onAddProduct !==
    'function'
  ) {

    console.error(
      'ProductForm: onAddProduct is not a function'
    )

    alert(
      'حدث خطأ في نظام حفظ العرض'
    )

    return

  }


  const result =
    await onAddProduct(
      offer
    )


  if (!result) {

    return

  }


  // ==================================================
  // RESET FORM
  // ==================================================

  resetForm()


  alert(
    'تم إنشاء العرض بنجاح دون تغيير المنتج أو سعره في المخزن'
  )

}, [

  form,

  onAddProduct,

  resetForm

])

// ==================================================
// UI
// ==================================================

return (

<div
  className="
    space-y-8
    mb-12
  "
>

  {/* ==================================================
      WAREHOUSE
  ================================================== */}

  <ProductWarehouseSection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      BASIC
  ================================================== */}

  <ProductBasicSection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      TYPE
  ================================================== */}

  <ProductTypeSection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      PRICING
  ================================================== */}

  <ProductPricingSection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      TIRE
  ================================================== */}

  {
    form.type === 'tire' && (

      <ProductTireSection

        form={
          form
        }

        setForm={
          setForm
        }

      />

    )
  }


  {/* ==================================================
      BATTERY
  ================================================== */}

  {
    form.type === 'battery' && (

      <ProductBatterySection

        form={
          form
        }

        setForm={
          setForm
        }

      />

    )
  }


  {/* ==================================================
      OIL
  ================================================== */}

  {
    form.type === 'oil' && (

      <ProductOilSection

        form={
          form
        }

        setForm={
          setForm
        }

      />

    )
  }


  {/* ==================================================
      COMPATIBILITY
  ================================================== */}

  <ProductCompatibilitySection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      MEDIA
  ================================================== */}

  <ProductMediaSection

    form={
      form
    }

    setForm={
      setForm
    }

  />


  {/* ==================================================
      SUBMIT
  ================================================== */}

  <ProductSubmitButton

    onSubmit={
      submit
    }

  />

</div>

)

}
