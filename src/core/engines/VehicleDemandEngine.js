import useVehicleDemandStore from '../../store/vehicleDemandStore'
export class VehicleDemandEngine {

  static record({

    vehicleType = '',

    make = '',

    model = '',

    year = '',

    tireSize = '',

    batteryCapacity = '',

    oilViscosity = '',

    found = false,

    products = [],

    customerId = '',

    customerName = '',

    phone = '',

    warehouse = '',

    source = 'website'

  }) {

    const store =

      useVehicleDemandStore.getState()

    store.addSearch({

      vehicleType,

      make,

      model,

      year,

      tireSize,

      batteryCapacity,

      oilViscosity,

      found,

      productsCount:

        products.length,

      missingProducts:

        found

          ? []

          : [

              tireSize,

              batteryCapacity,

              oilViscosity

            ].filter(Boolean),

      customerId,

      customerName,

      phone,

      warehouse,

      source

    })

  }

  static found(data) {

    this.record({

      ...data,

      found: true

    })

  }

  static missing(data) {

    this.record({

      ...data,

      found: false

    })

  }

  static history() {

    return useVehicleDemandStore

      .getState()

      .getHistory()

  }

  static missingSearches() {

    return useVehicleDemandStore

      .getState()

      .getMissingSearches()

  }

  static successfulSearches() {

    return useVehicleDemandStore

      .getState()

      .getFoundSearches()

  }

  static topBrands() {

    return useVehicleDemandStore

      .getState()

      .getMostRequestedBrands()

  }

  static topModels() {

    return useVehicleDemandStore

      .getState()

      .getMostRequestedModels()

  }

  static topYears() {

    return useVehicleDemandStore

      .getState()

      .getMostRequestedYears()

  }

}

export default VehicleDemandEngine