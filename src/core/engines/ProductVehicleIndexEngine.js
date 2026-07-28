// ======================================================
// EL OLA ERP
// Product Vehicle Index Engine
// ======================================================

export class ProductVehicleIndexEngine {

  static getVehicles(products = []) {

    return products.flatMap(

      product =>

        product.compatibleVehicles || []

    )

  }

  static getVehicleTypes(products = []) {

    return [

      ...new Set(

        this.getVehicles(products)

          .map(v => v.vehicleType)

          .filter(Boolean)

      )

    ]

  }

  static getBrands({

    products = [],

    vehicleType

  }) {

    return [

      ...new Set(

        this.getVehicles(products)

          .filter(v =>

            !vehicleType ||

            v.vehicleType === vehicleType

          )

          .map(v => v.brand)

          .filter(Boolean)

      )

    ]

  }

  static getModels({

    products = [],

    vehicleType,

    brand

  }) {

    return [

      ...new Set(

        this.getVehicles(products)

          .filter(v =>

            (

              !vehicleType ||

              v.vehicleType === vehicleType

            )

            &&

            (

              !brand ||

              v.brand === brand

            )

          )

          .map(v => v.model)

          .filter(Boolean)

      )

    ]

  }

  static getYears({

    products = [],

    vehicleType,

    brand,

    model

  }) {

    const years = []

    this.getVehicles(products)

      .filter(v =>

        (

          !vehicleType ||

          v.vehicleType === vehicleType

        )

        &&

        (

          !brand ||

          v.brand === brand

        )

        &&

        (

          !model ||

          v.model === model

        )

      )

      .forEach(vehicle => {

        const from =

          Number(vehicle.yearFrom)

        const to =

          Number(

            vehicle.yearTo ||

            vehicle.yearFrom

          )

        for (

          let year = from;

          year <= to;

          year++

        ) {

          years.push(year)

        }

      })

    return [

      ...new Set(years)

    ].sort(

      (a, b) => b - a

    )

  }

}

export default ProductVehicleIndexEngine