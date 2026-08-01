import canManageWarehouseCredentials

  from './canManageWarehouseCredentials'


export default function updateWarehouseCredentials(

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

    return warehouse

  }


  return {

    ...warehouse,

    username:

      credentials.username ||

      warehouse.username || '',


    password:

      credentials.password ||

      warehouse.password || '',


    credentialsUpdatedAt:

      new Date().toISOString(),


    credentialsUpdatedBy:

      currentUser.id

  }

}