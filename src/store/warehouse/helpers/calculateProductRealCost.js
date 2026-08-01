export default function calculateProductRealCost(

  product = {}

) {

  const purchasePrice =

    Number(

      product.purchasePrice || 0

    )


  const extraCosts =

    Number(

      product.shippingCost || 0

    ) +

    Number(

      product.customsCost || 0

    ) +

    Number(

      product.transportCost || 0

    ) +

    Number(

      product.otherCosts || 0

    )


  const quantity =

    Number(

      product.quantity || 1

    )


  if (quantity <= 0) {

    return purchasePrice + extraCosts

  }


  return (

    (

      purchasePrice * quantity

    ) +

    extraCosts

  ) / quantity

}