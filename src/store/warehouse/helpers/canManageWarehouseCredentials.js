export default function canManageWarehouseCredentials(

  currentUser = {},

  warehouse = {}

) {

  if (!currentUser || !warehouse)

    return false


  return (

    currentUser.role === 'owner' &&

    String(currentUser.id) ===

    String(warehouse.createdBy)

  )

}