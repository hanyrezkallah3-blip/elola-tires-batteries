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
  // SUBMIT
  // ==================================================

  const submit =
    useCallback(async () => {

      // ==================================================
      // PRODUCT MUST BE SELECTED FROM WAREHOUSE
      // ==================================================

      if (
        !form.warehouseId
      ) {

        alert(
          'اختر المخزن أولاً'
        )

        return

      }


      if (
        !form.selectedProductId
      ) {

        alert(
          'اختر منتجًا موجودًا في المخزن أولاً'
        )

        return

      }


      // ==================================================
      // NAME
      // ==================================================

      if (
        !String(
          form.name || ''
        ).trim()
      ) {

        alert(
          'اسم المنتج مطلوب'
        )

        return

      }


      // ==================================================
      // SALE PRICE
      // ==================================================

      if (
        Number(
          form.salePrice || 0
        ) <= 0
      ) {

        alert(
          'سعر البيع غير صحيح'
        )

        return

      }


      // ==================================================
      // UPDATE EXISTING PRODUCT
      // ==================================================

      const product = {

        ...form,

        id:
          form.selectedProductId,

        productId:
          form.selectedProductId,

        productName:
          form.name.trim(),

        name:
          form.name.trim(),

        category:
          form.category ||
          form.type,

        purchasePrice:
          Number(
            form.purchasePrice || 0
          ),

        salePrice:
          Number(
            form.salePrice || 0
          ),

        quantity:
          Number(
            form.quantity || 0
          ),

        availableQuantity:
          Number(
            form.availableQuantity ??
            form.quantity ??
            0
          ),

        updatedAt:
          new Date().toISOString()

      }


      const updatedProduct =
        await onAddProduct(
          product
        )


      if (!updatedProduct) {
        return
      }


      // ==================================================
      // RESET
      // ==================================================

      resetForm()


      alert(
        'تم تحديث بيانات المنتج الموجود في المخزن بنجاح'
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
          WAREHOUSE + EXISTING PRODUCT
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