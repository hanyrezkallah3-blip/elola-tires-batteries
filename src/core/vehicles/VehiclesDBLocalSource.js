// ======================================================
// EL OLA ERP
// VehiclesDB Local Source
// ======================================================
//
// RESPONSIBILITY
// ------------------------------------------------------
//
// Reads the local VehiclesDB Open Data catalog.
//
// IMPORTANT
// ------------------------------------------------------
//
// 1. No API key is required.
// 2. No network request is made.
// 3. This source does NOT fabricate years.
// 4. VehiclesDB is treated as a vehicle catalog source.
// 5. Vehicle fitment/product compatibility remains
//    outside this source.
// 6. The source preserves the original VehiclesDB record
//    under `raw`.
// 7. Supports the actual kinds present in the dataset.
// ======================================================

import vehiclesDB
  from '../../../vehiclesdb.json'


// ======================================================
// CONSTANTS
// ======================================================

const SOURCE =
  'vehiclesdb'


// ======================================================
// NORMALIZE
// ======================================================

const normalize =
  value =>
    String(value ?? '')
      .trim()
      .toLowerCase()


// ======================================================
// VEHICLE TYPE
// ======================================================

const normalizeVehicleType =
  type => {

    const value =
      normalize(type)


    if (
      [
        'car',
        'cars',
        'passenger',
        'passenger car'
      ].includes(value)
    ) {

      return 'car'
    }


    if (
      [
        'truck',
        'trucks',
        'lorry'
      ].includes(value)
    ) {

      return 'truck'
    }


    if (
      [
        'bus',
        'buses'
      ].includes(value)
    ) {

      return 'bus'
    }


    if (
      [
        'motorcycle',
        'motorcycles',
        'motorbike',
        'motorbikes',
        'motor'
      ].includes(value)
    ) {

      return 'motorcycle'
    }


    if (
      [
        'van',
        'vans'
      ].includes(value)
    ) {

      return 'van'
    }


    if (
      [
        'moped',
        'mopeds'
      ].includes(value)
    ) {

      return 'moped'
    }


    return value

  }


// ======================================================
// DISPLAY NAME
// ======================================================

const getMakeName =
  make =>
    make?.name ??
    make?.make ??
    make?.manufacturer ??
    ''


// ======================================================
// MAKE ID
// ======================================================

const getMakeId =
  make =>
    make?.slug ??
    make?.id ??
    normalize(
      getMakeName(make)
    )


// ======================================================
// MODEL NAME
// ======================================================

const getModelName =
  model =>
    model?.name ??
    model?.model ??
    model?.model_name ??
    ''


// ======================================================
// MODEL ID
// ======================================================

const getModelId =
  (
    make,
    model
  ) => {

    return (
      model?.slug ??
      model?.id ??
      [
        getMakeId(make),
        getModelName(model)
      ]
        .filter(Boolean)
        .join('-')
    )

  }


// ======================================================
// MAP MODEL
// ======================================================

const mapModel =
  (
    make,
    model
  ) => {

    if (
      !model ||
      typeof model !== 'object'
    ) {

      return null
    }


    const makeName =
      getMakeName(make)


    const makeId =
      getMakeId(make)


    const modelName =
      getModelName(model)


    if (
      !modelName
    ) {

      return null
    }


    const type =
      normalizeVehicleType(
        model?.kind
      )


    return {

      id:
        getModelId(
          make,
          model
        ),

      modelId:
        getModelId(
          make,
          model
        ),

      makeId,

      brand:
        makeName,

      make:
        makeName,

      manufacturer:
        makeName,

      model:
        modelName,

      modelName,

      name:
        modelName,

      label:
        modelName,

      vehicleType:
        type,

      type,

      typeName:
        type,

      bodyType:
        model?.body_type ??
        '',

      globalDecile:
        model?.global_decile,

      availability:
        Array.isArray(
          model?.availability
        )
          ? [
              ...model.availability
            ]
          : [],

      yearFrom:
        null,

      yearTo:
        null,

      source:
        SOURCE,

      raw:
        model

    }

  }


// ======================================================
// ALL MAKES
// ======================================================

const getMakes =
  () => {

    return Array.isArray(
      vehiclesDB?.makes
    )
      ? vehiclesDB.makes
      : []

  }


// ======================================================
// ALL MODELS
// ======================================================

const getAllModels =
  () => {

    const result = []


    getMakes()
      .forEach(make => {

        const models =
          Array.isArray(
            make?.models
          )
            ? make.models
            : []


        models.forEach(
          model => {

            const mapped =
              mapModel(
                make,
                model
              )


            if (
              mapped
            ) {

              result.push(
                mapped
              )

            }

          }
        )

      })


    return result

  }


// ======================================================
// GET VEHICLE TYPES
// ======================================================

const getVehicleTypes =
  () => {

    const types =
      new Map()


    getMakes()
      .forEach(make => {

        const models =
          Array.isArray(
            make?.models
          )
            ? make.models
            : []


        models.forEach(model => {

          const type =
            normalizeVehicleType(
              model?.kind
            )


          if (
            !type
          ) {

            return
          }


          if (
            !types.has(type)
          ) {

            types.set(
              type,
              {
                id: type,
                value: type,
                name: type,
                label: type,
                source: SOURCE
              }
            )

          }

        })

      })


    return Array.from(
      types.values()
    )

  }


// ======================================================
// GET BRANDS
// ======================================================

const getBrands =
  (
    vehicleType = ''
  ) => {

    const requestedType =
      normalizeVehicleType(
        vehicleType
      )


    const brands =
      new Map()


    getMakes()
      .forEach(make => {

        const models =
          Array.isArray(
            make?.models
          )
            ? make.models
            : []


        if (
          requestedType
        ) {

          const hasType =
            models.some(
              model =>
                normalizeVehicleType(
                  model?.kind
                ) === requestedType
            )


          if (
            !hasType
          ) {

            return
          }

        }


        const name =
          getMakeName(make)


        const id =
          getMakeId(make)


        if (
          !name ||
          !id
        ) {

          return
        }


        brands.set(
          normalize(id),
          {

            id,

            value:
              id,

            name,

            label:
              name,

            source:
              SOURCE,

            kinds:
              Array.isArray(
                make?.kinds
              )
                ? [
                    ...make.kinds
                  ]
                : []

          }
        )

      })


    return Array.from(
      brands.values()
    )

  }


// ======================================================
// GET MODELS
// ======================================================

const getModels =
  (
    params = {}
  ) => {

    const requestedType =
      normalizeVehicleType(
        params?.vehicleType ??
        params?.type ??
        ''
      )


    const requestedBrand =
      normalize(
        params?.brand ??
        params?.make ??
        params?.brandId ??
        ''
      )


    const result = []


    getMakes()
      .forEach(make => {

        const makeName =
          normalize(
            getMakeName(make)
          )


        const makeId =
          normalize(
            getMakeId(make)
          )


        if (
          requestedBrand &&
          requestedBrand !== makeName &&
          requestedBrand !== makeId
        ) {

          return
        }


        const models =
          Array.isArray(
            make?.models
          )
            ? make.models
            : []


        models.forEach(model => {

          const type =
            normalizeVehicleType(
              model?.kind
            )


          if (
            requestedType &&
            type !== requestedType
          ) {

            return
          }


          const mapped =
            mapModel(
              make,
              model
            )


          if (
            mapped
          ) {

            result.push(
              mapped
            )

          }

        })

      })


    return result

  }


// ======================================================
// GET YEARS
// ======================================================
//
// VehiclesDB model records do not reliably contain a
// model year in the downloaded open dataset.
//
// Therefore this method intentionally returns [].
// Other configured sources remain responsible for years.
// ======================================================

const getYears =
  () => []


// ======================================================
// FIND VEHICLE
// ======================================================

const findVehicle =
  (
    params = {}
  ) => {

    const requestedBrand =
      normalize(
        params?.brand ??
        params?.make ??
        params?.brandId ??
        ''
      )


    const requestedModel =
      normalize(
        params?.model ??
        params?.modelName ??
        ''
      )


    const requestedType =
      normalizeVehicleType(
        params?.vehicleType ??
        params?.type ??
        ''
      )


    if (
      !requestedBrand ||
      !requestedModel
    ) {

      return null
    }


    const models =
      getModels({

        vehicleType:
          requestedType,

        brand:
          requestedBrand

      })


    const exact =
      models.find(
        vehicle => {

          const model =
            normalize(
              vehicle?.model
            )


          return (
            model ===
            requestedModel
          )

        }
      )


    if (
      exact
    ) {

      return exact
    }


    const partial =
      models.find(
        vehicle => {

          const model =
            normalize(
              vehicle?.model
            )


          return (
            model.includes(
              requestedModel
            ) ||
            requestedModel.includes(
              model
            )
          )

        }
      )


    return (
      partial ??
      null
    )

  }


// ======================================================
// GET ALL
// ======================================================

const getAll =
  () =>
    getAllModels()


// ======================================================
// SEARCH
// ======================================================

const search =
  (
    query = ''
  ) => {

    const value =
      normalize(query)


    if (
      !value
    ) {

      return []

    }


    return getAllModels()
      .filter(vehicle => {

        const haystack =
          [

            vehicle?.brand,

            vehicle?.make,

            vehicle?.model,

            vehicle?.bodyType,

            vehicle?.vehicleType

          ]
            .map(normalize)
            .join(' ')


        return haystack.includes(
          value
        )

      })

  }


// ======================================================
// METADATA
// ======================================================

const getMetadata =
  () => ({

    version:
      vehiclesDB?.version ??
      '',

    schemaVersion:
      vehiclesDB?.schema_version ??
      '',

    region:
      vehiclesDB?.region ??
      '',

    source:
      vehiclesDB?.source ??
      '',

    license:
      vehiclesDB?.license ??
      '',

    attribution:
      vehiclesDB?.attribution ??
      '',

    makeCount:
      getMakes().length,

    modelCount:
      getAllModels().length

  })


// ======================================================
// EXPORT
// ======================================================

const VehiclesDBLocalSource = {

  getVehicleTypes,

  getBrands,

  getModels,

  getYears,

  findVehicle,

  getAll,

  search,

  getMetadata

}


export default VehiclesDBLocalSource