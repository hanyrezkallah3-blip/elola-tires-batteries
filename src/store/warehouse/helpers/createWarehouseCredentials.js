import canManageWarehouseCredentials

  from './canManageWarehouseCredentials'


export default function createWarehouseCredentials(

  currentUser = {},

  warehouse = {},

  credentials = {}

) {

  if (

    !canManageWarehouseCredentials(

      currentUser,

      warehouse

    )

  ) {

    return null

  }


  return {

    username:

      credentials.username || '',


    password:

      credentials.password || '',


    updatedBy:

      currentUser.id,


    updatedAt:

      new Date().toISOString()

  }

}