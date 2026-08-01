export default function validateWarehouseOwner(

  currentUser = {},

  ownerId

) {

  if (!currentUser)

    return false


  if (

    currentUser.role === 'owner' &&

    currentUser.id === ownerId

  ) {

    return true

  }


  return false

}