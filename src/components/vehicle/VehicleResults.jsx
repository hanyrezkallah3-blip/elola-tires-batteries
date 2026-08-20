// ======================================================
// EL OLA ERP
// Vehicle Results
// ======================================================

import VehicleResultSection
  from './VehicleResultSection'


// ======================================================
// NORMALIZE TYPE
// ======================================================

const normalizeType = (value) =>

  String(value ?? '')
    .trim()
    .toLowerCase()


// ======================================================
// GET PRODUCT TYPE
// ======================================================

const getProductType = (product) => {

  const type =
    normalizeType(
      product?.type
    )


  if (
    type === 'tire' ||
    type === 'tyre' ||
    type === 'tires' ||
    type === 'إطار' ||
    type === 'اطار' ||
    type === 'إطارات' ||
    type === 'اطارات'
  ) {

    return 'tire'

  }


  if (
    type === 'battery' ||
    type === 'بطارية' ||
    type === 'بطاريات'
  ) {

    return 'battery'

  }


  if (
    type === 'oil' ||
    type === 'زيت' ||
    type === 'زيوت'
  ) {

    return 'oil'

  }


  return type

}


// ======================================================
// COMPONENT
// ======================================================

export default function VehicleResults({

  result,

  onAddToCart

}) {


  // ====================================================
  // NORMALIZE RESULT
  // ====================================================

  const products =

    Array.isArray(result)

      ? result

      : Array.isArray(result?.products)

        ? result.products

        : []


  // ====================================================
  // NO RESULTS
  // ====================================================

  if (!products.length)

    return null


  // ====================================================
  // CLASSIFY
  // ====================================================

  const tires =

    products.filter(

      product =>

        getProductType(product) ===
        'tire'

    )


  const batteries =

    products.filter(

      product =>

        getProductType(product) ===
        'battery'

    )


  const oils =

    products.filter(

      product =>

        getProductType(product) ===
        'oil'

    )


  // ====================================================
  // OTHER PRODUCTS
  // ====================================================

  const parts =

    products.filter(product => {

      const type =
        getProductType(product)

      return (

        type !== 'tire' &&

        type !== 'battery' &&

        type !== 'oil'

      )

    })


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div

      className="
        mt-10
        space-y-10
      "

    >


      <VehicleResultSection

        icon="🛞"

        title="الإطارات المناسبة"

        products={tires}

        onAddToCart={
          onAddToCart
        }

      />


      <VehicleResultSection

        icon="🔋"

        title="البطاريات المناسبة"

        products={batteries}

        onAddToCart={
          onAddToCart
        }

      />


      <VehicleResultSection

        icon="🛢️"

        title="الزيوت المناسبة"

        products={oils}

        onAddToCart={
          onAddToCart
        }

      />


      <VehicleResultSection

        icon="🔧"

        title="قطع الغيار"

        products={parts}

        onAddToCart={
          onAddToCart
        }

      />

    </div>

  )

}