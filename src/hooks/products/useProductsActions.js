import {
  useCallback
} from 'react'

import {
  useProductStore
} from '../../store/productStore'

import {
  useWebsiteStore
} from '../../store/websiteStore'

import {
  useWarehouseStore
} from '../../store/warehouseStore'

import ProductEngine
  from '../../core/engines/product/ProductEngine'


export default function useProductsActions() {

  const setProducts =
    useProductStore(
      state => state.setProducts
    )


  const updateProduct =
    useProductStore(
      state => state.updateProduct
    )


  const deleteProduct =
    useProductStore(
      state => state.deleteProduct
    )


  const toggleProductVisibility =
    useWebsiteStore(
      state => state.toggleProductVisibility
    )


  const updateWarehouseProduct =
    useWarehouseStore(
      state => state.updateWarehouseProduct
    )


  // ======================================================
  // ADD / UPDATE PRODUCT
  // ======================================================

  const handleAddProduct =
    useCallback(async (product = {}) => {

      try {

        // ==================================================
        // UPDATE EXISTING WAREHOUSE PRODUCT
        // ==================================================

        if (
          product?.selectedProductId &&
          product?.warehouseId
        ) {

          const productId =
            product.selectedProductId


          const warehouseProductId =
            product.selectedWarehouseProductId ||
            productId


          const updatedProduct = {

            ...product,

            id:
              productId,

            productId,

            productName:
              product.name ||
              product.productName ||
              '',

            name:
              product.name ||
              product.productName ||
              '',

            quantity:
              Number(
                product.quantity || 0
              ),

            availableQuantity:
              Number(
                product.availableQuantity ??
                product.quantity ??
                0
              ),

            purchasePrice:
              Number(
                product.purchasePrice || 0
              ),

            salePrice:
              Number(
                product.salePrice || 0
              ),

            updatedAt:
              new Date().toISOString()

          }


          // ==================================================
          // UPDATE FIRESTORE PRODUCT
          // ==================================================

          const result =
            await ProductEngine.update(

              productId,

              updatedProduct

            )


          if (
            !result?.success
          ) {

            console.error(
              'ProductEngine.update failed:',
              result
            )

            alert(
              result?.message ||
              'فشل تحديث المنتج'
            )

            return null

          }


          // ==================================================
          // UPDATE LOCAL PRODUCT STORE
          // ==================================================

          updateProduct(

            productId,

            updatedProduct

          )


          // ==================================================
          // UPDATE WAREHOUSE STORE
          // ==================================================

          updateWarehouseProduct(

            product.warehouseId,

            warehouseProductId,

            updatedProduct

          )


          // ==================================================
          // RETURN UPDATED PRODUCT
          // ==================================================

          return {

            ...(result.data || {}),

            ...updatedProduct,

            id:
              productId

          }

        }


        // ==================================================
        // NEW PRODUCT
        // ==================================================

        const result =
          await ProductEngine.create(
            product
          )


        if (
          !result?.success
        ) {

          console.error(
            'ProductEngine.create failed:',
            result
          )

          alert(
            result?.message ||
            'فشل إنشاء المنتج'
          )

          return null

        }


        const createdProduct = {

          ...(result.data || {}),

          ...product,

          id:
            result.data?.id,

          createdAt:
            result.data?.createdAt ||
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString()

        }


        // ==================================================
        // SYNCHRONIZE LOCAL STORE
        // ==================================================

        const currentProducts =
          useProductStore
            .getState()
            .products || []


        setProducts([

          createdProduct,

          ...currentProducts

        ])


        return createdProduct

      }

      catch (error) {

        console.error(
          'handleAddProduct failed:',
          error
        )

        alert(
          error?.message ||
          'حدث خطأ أثناء حفظ المنتج'
        )

        return null

      }

    }, [

      setProducts,

      updateProduct,

      updateWarehouseProduct

    ])


  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete =
    useCallback(async (id) => {

      if (!id) {

        return

      }


      const confirmed =
        window.confirm(
          'هل تريد حذف المنتج؟'
        )


      if (!confirmed) {

        return

      }


      try {

        const result =
          await ProductEngine.delete(
            id
          )


        if (
          !result?.success
        ) {

          console.error(
            'ProductEngine.delete failed:',
            result
          )

          alert(
            result?.message ||
            'فشل حذف المنتج'
          )

          return

        }


        deleteProduct(id)

      }

      catch (error) {

        console.error(
          'handleDelete failed:',
          error
        )

        alert(
          error?.message ||
          'حدث خطأ أثناء حذف المنتج'
        )

      }

    }, [

      deleteProduct

    ])


  // ======================================================
  // RETURN
  // ======================================================

  return {

    handleAddProduct,

    handleDelete,

    toggleProductVisibility

  }

}