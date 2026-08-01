export default function getWarehouseMovements(

  warehouse = {},

  filters = {}

) {

  let movements =

    warehouse.transactions || []


  if (filters.type) {

    movements =

      movements.filter(

        item =>

          item.type === filters.type

      )

  }


  if (filters.productId) {

    movements =

      movements.filter(

        item =>

          item.productId === filters.productId

      )

  }


  if (filters.fromDate) {

    movements =

      movements.filter(

        item =>

          new Date(item.createdAt)

          >=

          new Date(filters.fromDate)

      )

  }


  if (filters.toDate) {

    movements =

      movements.filter(

        item =>

          new Date(item.createdAt)

          <=

          new Date(filters.toDate)

      )

  }


  return movements

}