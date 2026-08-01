const vehicleDatabase = [

  {
    brand: 'Toyota',

    models: [

      {
        name: 'Corolla',

        years: [
          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024
        ],

        tireSizes: [

          '195/65R15',

          '205/55R16'

        ]

      },


      {
        name: 'Camry',

        years: [

          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024

        ],

        tireSizes: [

          '215/55R17',

          '235/45R18'

        ]

      },


      {
        name: 'RAV4',

        years: [

          2019,
          2020,
          2021,
          2022,
          2023,
          2024

        ],

        tireSizes: [

          '225/65R17',

          '235/55R19'

        ]

      }

    ]

  },


  {
    brand: 'Hyundai',

    models: [

      {
        name: 'Elantra',

        years: [

          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023

        ],

        tireSizes: [

          '195/65R15',

          '205/55R16'

        ]

      },


      {
        name: 'Tucson',

        years: [

          2019,
          2020,
          2021,
          2022,
          2023,
          2024

        ],

        tireSizes: [

          '225/60R17',

          '235/55R18'

        ]

      }

        ]

  },

  {
    brand: 'Kia',

    models: [

      {
        name: 'Cerato',

        years: [

          2018,
          2019,
          2020,
          2021,
          2022,
          2023,
          2024

        ],

        tireSizes: [

          '195/65R15',

          '205/55R16'

        ]

      },


      {
        name: 'Sportage',

        years: [

          2019,
          2020,
          2021,
          2022,
          2023,
          2024

        ],

        tireSizes: [

          '225/55R18',

          '235/55R19'

        ]

      }

    ]

  },


  {
    brand: 'Nissan',

    models: [

      {
        name: 'Sunny',

        years: [

          2016,
          2017,
          2018,
          2019,
          2020,
          2021,
          2022,
          2023

        ],

        tireSizes: [

          '185/65R15',

          '195/65R15'

        ]

      },


      {
        name: 'Qashqai',

        years: [

          2018,
          2019,
          2020,
          2021,
          2022,
          2023

        ],

        tireSizes: [

          '215/60R17',

          '225/45R19'

        ]

      }

    ]

  },


  {
    brand: 'Mitsubishi',

    models: [

      {
        name: 'Lancer',

        years: [

          2015,
          2016,
          2017

        ],

        tireSizes: [

          '195/60R16',

          '205/55R16'

        ]

      },


      {
        name: 'Pajero',

        years: [

          2015,
          2016,
          2017,
          2018

        ],

        tireSizes: [

          '265/65R17'

        ]

      }

    ]

  }

]

export default vehicleDatabase

const getAllBrands = () => {

  return vehicleDatabase.map(

    vehicle => vehicle.brand

  )

}



const getModelsByBrand = (

  brand

) => {


  const vehicle =

    vehicleDatabase.find(

      item =>

        item.brand === brand

    )


  return (

    vehicle?.models || []

  )

}



const getVehicleCompatibility = (

  tireSize

) => {


  const results = []


  vehicleDatabase.forEach(

    brand => {


      brand.models.forEach(

        model => {


          if (

            model.tireSizes.includes(

              tireSize

            )

          ) {


            results.push({

              brand:

                brand.brand,


              model:

                model.name,


              years:

                model.years


            })

          }


        }

      )


    }

  )


  return results

}



const getCompatibleSizes = (

  vehicleName

) => {


  const sizes = []


  vehicleDatabase.forEach(

    brand => {


      brand.models.forEach(

        model => {


          if (

            model.name === vehicleName

          ) {


            sizes.push(

              ...model.tireSizes

            )


          }


        }

      )


    }

  )


  return [

    ...new Set(sizes)

  ]

}



export {

  getAllBrands,

  getModelsByBrand,

  getVehicleCompatibility,

  getCompatibleSizes

}


export {

  vehicleDatabase

}