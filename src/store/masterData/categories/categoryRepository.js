import { useCategoryStore } from './categoryStore'

export function getCategories() {

  return useCategoryStore

    .getState()

    .categories || []

}

export function getCategory(id) {

  return getCategories()

    .find(

      category =>

        category.id === id

    )

}

export function addCategory(category) {

  return useCategoryStore

    .getState()

    .addCategory(category)

}

export function updateCategory(

  id,

  data

) {

  return useCategoryStore

    .getState()

    .updateCategory(

      id,

      data

    )

}

export function deleteCategory(id) {

  return useCategoryStore

    .getState()

    .deleteCategory(id)

}