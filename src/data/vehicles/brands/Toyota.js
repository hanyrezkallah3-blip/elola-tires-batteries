const Toyota = {

  id: 'toyota',

  name: 'Toyota',

  country: 'Japan',

  logo: '/brands/toyota.png',

  vehicles: [

    {

      id: 'toyota-corolla',

      type: 'passenger',

      model: 'Corolla',

      generation: 'E210',

      years: [

        2019,
        2020,
        2021,
        2022,
        2023,
        2024

      ],

      tire: {

        oemSizes: [

          '195/65R15',

          '205/55R16'

        ],

        optionalSizes: [

          '215/45R17'

        ]

      },

      battery: {

        capacity: '60Ah',

        cca: 540,

        polarity: 'R'

      },

      oil: {

        viscosity: [

          '0W20',

          '5W30'

        ],

        capacity: 4.2

      }

    },
        {

      id: 'toyota-camry',

      type: 'passenger',

      model: 'Camry',

      generation: 'XV70',

      years: [

        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024

      ],

      tire: {

        oemSizes: [

          '215/55R17',

          '235/45R18'

        ],

        optionalSizes: [

          '245/40R19'

        ]

      },

      battery: {

        capacity: '70Ah',

        cca: 620,

        polarity: 'R'

      },

      oil: {

        viscosity: [

          '0W20',

          '5W30'

        ],

        capacity: 4.8

      }

    },



    {

      id: 'toyota-rav4',

      type: 'suv',

      model: 'RAV4',

      generation: 'XA50',

      years: [

        2019,
        2020,
        2021,
        2022,
        2023,
        2024

      ],

      tire: {

        oemSizes: [

          '225/65R17',

          '235/55R19'

        ],

        optionalSizes: [

          '225/60R18'

        ]

      },

      battery: {

        capacity: '75Ah',

        cca: 680,

        polarity: 'R'

      },

      oil: {

        viscosity: [

          '0W16',

          '0W20'

        ],

        capacity: 4.8

      }

    }

  ]

}

export default Toyota