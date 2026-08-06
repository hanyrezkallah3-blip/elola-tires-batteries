import { useSupplierStore } from './supplierStore'

export function getSuppliers() {

  return useSupplierStore

    .getState()

    .suppliers || []

}

export function getSupplier(id) {

  return getSuppliers()

    .find(

      supplier =>

        supplier.id === id

    )

}

export function addSupplier(supplier) {

  return useSupplierStore

    .getState()

    .addSupplier(supplier)

}

export function updateSupplier(

  id,

  data

) {

  return useSupplierStore

    .getState()

    .updateSupplier(

      id,

      data

    )

}

export function deleteSupplier(id) {

  return useSupplierStore

    .getState()

    .deleteSupplier(id)

}