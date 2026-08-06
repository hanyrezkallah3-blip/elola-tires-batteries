import { useBrandStore } from './brandStore'

export function getBrands() {

  return useBrandStore

    .getState()

    .brands || []

}

export function getBrand(id) {

  return getBrands()

    .find(

      brand =>

        brand.id === id

    )

}

export function addBrand(brand) {

  return useBrandStore

    .getState()

    .addBrand(brand)

}

export function updateBrand(

  id,

  data

) {

  return useBrandStore

    .getState()

    .updateBrand(

      id,

      data

    )

}

export function deleteBrand(id) {

  return useBrandStore

    .getState()

    .deleteBrand(id)

}