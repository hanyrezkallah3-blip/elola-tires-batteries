import {

  getSuppliers,

  getSupplier,

  addSupplier,

  updateSupplier,

  deleteSupplier

} from './supplierRepository'

export function loadSuppliers() {

  return getSuppliers()

}

export function loadSupplier(id) {

  return getSupplier(id)

}

export function createSupplier(supplier) {

  return addSupplier(supplier)

}

export function editSupplier(

  id,

  data

) {

  return updateSupplier(

    id,

    data

  )

}

export function removeSupplier(id) {

  return deleteSupplier(id)

}