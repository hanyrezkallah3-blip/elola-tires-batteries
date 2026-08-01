import {
  getVehicleCompatibility,
  getCompatibleSizes
} from '../data/vehicleDatabase'



function normalizeSize({

  width,

  profile,

  rim

}) {


  return (

    `${width}/${profile}R${rim}`

  )

}



export function analyzeTire({

  width,

  profile,

  rim,

  loadIndex,

  speedRating,

  season

}) {


  const size =

    normalizeSize({

      width,

      profile,

      rim

    })



  const compatibleVehicles =

    getVehicleCompatibility(

      size

    )



  const compatibleSizes =

    [

      size,

      ...getCompatibleSizes(

        compatibleVehicles[0]?.model

      )

    ]

    .filter(Boolean)



  return {

    tireDetails: {

      size,


      loadIndex,


      speedRating,


      season,


      tubeless: true,


      category:

        compatibleVehicles.some(

          vehicle =>

            [

              'Tucson',

              'Sportage',

              'RAV4',

              'Pajero'

            ]

            .includes(

              vehicle.model

            )

        )

        ?

        'SUV'

        :

        'Passenger',


      usage:

        season === 'Winter'

          ?

          'Winter Driving'

          :

          'All Season'

    },



    compatibleVehicles,


    compatibleSizes:

      [

        ...new Set(

          compatibleSizes

        )

      ]

  }

}
export function generateTireAIProfile({

  width,

  profile,

  rim,

  loadIndex,

  speedRating,

  season

}) {


  const analysis =

    analyzeTire({

      width,

      profile,

      rim,

      loadIndex,

      speedRating,

      season

    })



  return {


    ...analysis,


    aiGenerated: true,


    generatedAt:

      new Date()

        .toISOString(),



    searchKeywords:

      [

        analysis.tireDetails.size,


        loadIndex,


        speedRating,


        season,


        ...(

          analysis.compatibleVehicles

            || []

        )

        .map(

          vehicle =>

            `${vehicle.brand} ${vehicle.model}`

        )

      ]

      .filter(Boolean)

      .join(' ')

  }

}



export default {

  analyzeTire,

  generateTireAIProfile

}