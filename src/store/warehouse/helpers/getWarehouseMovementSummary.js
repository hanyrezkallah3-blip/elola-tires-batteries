export default function getWarehouseMovementSummary(

  warehouse = {}

) {

  const movements =

    warehouse.transactions || []


  return {

    incoming:

      movements

        .filter(

          item =>

            item.type === 'in'

        )

        .reduce(

          (sum, item) =>

            sum +

            Number(

              item.quantity || 0

            ),

          0

        ),


    outgoing:

      movements

        .filter(

          item =>

            item.type === 'out'

        )

        .reduce(

          (sum, item) =>

            sum +

            Number(

              item.quantity || 0

            ),

          0

        ),


    transfers:

      movements

        .filter(

          item =>

            item.type === 'transfer'

        )

        .reduce(

          (sum, item) =>

            sum +

            Number(

              item.quantity || 0

            ),

          0

        ),


    total:

      movements.length

  }

}