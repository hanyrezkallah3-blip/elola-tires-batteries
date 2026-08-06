export default function validateCategory(

  category

) {

  if (

    !category.name ||

    !category.name.trim()

  ) {

    return {

      valid: false,

      message: 'اسم التصنيف مطلوب'

    }

  }

  return {

    valid: true

  }

}