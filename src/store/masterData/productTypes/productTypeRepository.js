import { useProductTypeStore } from './productTypeStore'

export function getProductTypes() {

  return useProductTypeStore

    .getState()

    .productTypes || []

}