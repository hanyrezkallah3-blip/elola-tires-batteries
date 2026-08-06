import {

  getCategories,

  getCategory,

  addCategory,

  updateCategory,

  deleteCategory

} from './categoryRepository'

export function loadCategories() {

  return getCategories()

}

export function loadCategory(id) {

  return getCategory(id)

}

export function createCategory(category) {

  return addCategory(category)

}

export function editCategory(

  id,

  data

) {

  return updateCategory(

    id,

    data

  )

}

export function removeCategory(id) {

  return deleteCategory(id)

}