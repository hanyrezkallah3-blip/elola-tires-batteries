import {
  useCallback
} from 'react'

import {
  useProductStore
} from '../../store/productStore'

import {
  useWebsiteStore
} from '../../store/websiteStore'

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


  const addOffer =
    useWebsiteStore(
      state => state.addOffer
    )


  // ======================================================
  // ADD / UPDATE
  // ======================================================

  const handleAddProduct =
    useCallback(async (product = {}) => {

      try {

        // ==================================================
        // OFFER
        //
        // Products page uses an existing warehouse product
        // as the source of the offer.
        //
        // IMPORTANT:
        // NEVER update the warehouse product here.
        // NEVER call ProductEngine.update().
        // NEVER call ProductEngine.create() for an offer.
        // ==================================================

        if (
          product?.isOffer === true
        ) {

          const sourceProductId =
            product.sourceProductId ||
            product.selectedProductId ||
            product.productId ||
            ''


          const warehouseId =
            product.warehouseId ||
            ''


          if (!sourceProductId) {

            console.error(
              'Offer creation failed: missing source product id',
              product
            )

            alert(
              'لم يتم تحديد المنتج الأصلي من المخزن'
            )

            return null

          }


          if (!warehouseId) {

            console.error(
              'Offer creation failed: missing warehouse id',
              product
            )

            alert(
              'لم يتم تحديد المخزن'
            )

            return null

          }


          const originalPrice =
            Number(
              product.originalPrice ??
              product.originalSalePrice ??
              product.warehouseSalePrice ??
              0
            )


          const offerPrice =
            Number(
              product.offerPrice ??
              product.salePrice ??
              0
            )


          if (
            !Number.isFinite(
              originalPrice
            ) ||
            originalPrice <= 0
          ) {

            alert(
              'سعر المنتج الأصلي في المخزن غير صحيح'
            )

            return null

          }


          if (
            !Number.isFinite(
              offerPrice
            ) ||
            offerPrice <= 0
          ) {

            alert(
              'يجب إدخال سعر العرض'
            )

            return null

          }


          if (
            offerPrice >= originalPrice
          ) {

            alert(
              'سعر العرض يجب أن يكون أقل من سعر المنتج الأصلي'
            )

            return null

          }


          const now =
            new Date().toISOString()


          const offer = {

            ...product,

            id:
              product.id ||
              undefined,

            productId:
              sourceProductId,

            sourceProductId,

            selectedProductId:
              sourceProductId,

            warehouseId,

            warehouseName:
              product.warehouseName ||
              '',

            originalPrice,

            oldPrice:
              originalPrice,

            originalSalePrice:
              originalPrice,

            warehouseSalePrice:
              originalPrice,

            offerPrice,

            salePrice:
              offerPrice,

            price:
              offerPrice,

            discount:
              Number(
                (
                  (
                    originalPrice -
                    offerPrice
                  ) /
                  originalPrice
                ) *
                100
              ),

            isOffer:
              true,

            source:
              'warehouse',

            createdAt:
              product.createdAt ||
              now,

            updatedAt:
              now

          }


          // ==================================================
          // SAVE OFFER ONLY
          // ==================================================

          addOffer(
            offer
          )


          // ==================================================
          // IMPORTANT
          //
          // No ProductEngine.create()
          // No ProductEngine.update()
          // No ProductStore update
          // No WarehouseStore update
          //
          // The warehouse product remains untouched.
          // ==================================================

          return offer

        }


        // ==================================================
        // NORMAL PRODUCT CREATION
        //
        // This branch remains available for existing code
        // that creates a real product outside the offer flow.
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
        // SYNCHRONIZE LOCAL PRODUCT STORE
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

      addOffer

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


        deleteProduct(
          id
        )

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