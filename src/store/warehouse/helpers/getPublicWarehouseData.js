export default function getPublicWarehouseData(

  warehouse = {}

) {

  return {

    id:

      warehouse.id,


    name:

      warehouse.name,


    type:

      warehouse.type,


    location:

      warehouse.location,


    active:

      warehouse.active,


    products:

      warehouse.products || [],


    createdAt:

      warehouse.createdAt

  }

}