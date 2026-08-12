import { useCallback } from 'react'

import { useProductStore } from '../../store/productStore'
import { useWebsiteStore } from '../../store/websiteStore'
import { useWarehouseStore } from '../../store/warehouseStore'

import ProductEngine
from '../../core/engines/product/ProductEngine'

export default function useProductsActions() {

  const addProduct =
    useProductStore(
      state => state.addProduct
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


  const handleAddProduct =
    useCallback(async (product) => {

      // ==================================================
      // UPDATE EXISTING WAREHOUSE PRODUCT
      // ==================================================

      if (
        product?.selectedProductId &&
        product?.warehouseId
      ) {

        const warehouseProductId =
          product.selectedWarehouseProductId ||
          product.selectedProductId


        const updatedProduct = {

          ...product,

          id:
            product.selectedProductId,

          productId:
            product.selectedProductId,

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
        // UPDATE WAREHOUSE
        // ==================================================

        updateWarehouseProduct(

          product.warehouseId,

          warehouseProductId,

          updatedProduct

        )


        // ==================================================
        // UPDATE GLOBAL PRODUCT
        // ==================================================

        const globalProduct =
          useProductStore
            .getState()
            .getProduct(
              product.selectedProductId
            )


        if (globalProduct) {

          updateProduct(

            product.selectedProductId,

            {

              ...product,

              id:
                product.selectedProductId,

              name:
                product.name ||
                product.productName ||
                '',

              purchasePrice:
                Number(
                  product.purchasePrice || 0
                ),

              salePrice:
                Number(
                  product.salePrice || 0
                ),

              category:
                product.category ||
                product.type ||
                '',

              updatedAt:
                new Date().toISOString()

            }

          )

        }


        return {

          ...globalProduct,

          ...updatedProduct,

          id:
            product.selectedProductId

        }

      }


      // ==================================================
      // NEW PRODUCT BLOCKED
      // ==================================================

      alert(
        'لا يمكن إضافة منتج جديد من صفحة المنتجات. اختر منتجًا موجودًا في أحد المخازن أولاً.'
      )


      return null

    }, [

      updateProduct,

      updateWarehouseProduct

    ])


  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete =
    useCallback(id => {

      if (
        window.confirm(
          'هل تريد حذف المنتج؟'
        )
      ) {

        deleteProduct(id)

      }

    }, [

      deleteProduct

    ])


  return {

    handleAddProduct,

    handleDelete,

    toggleProductVisibility

  }

}