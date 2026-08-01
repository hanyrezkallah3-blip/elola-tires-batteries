import generateWarehouseId

  from './generateWarehouseId'


export default function createWarehouse(

  warehouse = {}

) {

  return {

    id:

      warehouse.id ||

      generateWarehouseId(),


    name:

      warehouse.name || '',


    type:

      warehouse.type || 'main',


    location:

      warehouse.location || '',


    phone:

      warehouse.phone || '',


    manager:

      warehouse.manager || '',


    username:

      warehouse.username || '',


    password:

      warehouse.password || '',


    createdBy:

      warehouse.createdBy || '',


    ownerControlled:

      true,


    active:

      warehouse.active !== false,


    products:

      warehouse.products || [],


    expenses:

      warehouse.expenses || [],


    transactions:

      warehouse.transactions || [],


    incoming:

      Number(

        warehouse.incoming || 0

      ),


    outgoing:

      Number(

        warehouse.outgoing || 0

      ),


    currentStock:

      Number(

        warehouse.currentStock || 0

      ),


    createdAt:

      warehouse.createdAt ||

      new Date().toISOString()

  }

}