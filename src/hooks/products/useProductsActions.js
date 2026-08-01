import { useCallback } from 'react'

import { useProductStore } from '../../store/productStore'
import { useWebsiteStore } from '../../store/websiteStore'
import { useInventoryStore } from '../../store/inventoryStore'

import ProductEngine
  from '../../core/engines/product/ProductEngine'

export default function useProductsActions() {

  const addProduct =
    useProductStore(
      state => state.addProduct
    )

  const deleteProduct =
    useProductStore(
      state => state.deleteProduct
    )

  const toggleProductVisibility =
    useWebsiteStore(
      state => state.toggleProductVisibility
    )

  const addStockItem =
    useInventoryStore(
      state => state.addStockItem
    )

  const handleAddProduct =
    useCallback(async (product) => {

      const result =
        await ProductEngine.create(product)

      if (!result.success) {

        alert(
          result.errors.join('\n')
        )

        return

      }

      const newProduct =
        addProduct(result.data)

      addStockItem({

        productId:
          newProduct.id,

        warehouseId:
          product.warehouseId,

        quantity: 0,

        minQuantity: 0,

        price:
          Number(
            newProduct.salePrice || 0
          )

      })

    }, [

      addProduct,

      addStockItem

    ])

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