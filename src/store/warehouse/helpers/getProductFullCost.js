import calculateProductRealCost

  from './calculateProductRealCost'


export default function getProductFullCost(

  product = {}

) {

  return {

    purchasePrice:

      Number(

        product.purchasePrice || 0

      ),


    shippingCost:

      Number(

        product.shippingCost || 0

      ),


    customsCost:

      Number(

        product.customsCost || 0

      ),


    transportCost:

      Number(

        product.transportCost || 0

      ),


    otherCosts:

      Number(

        product.otherCosts || 0

      ),


    realCost:

      calculateProductRealCost(

        product

      )

  }

}