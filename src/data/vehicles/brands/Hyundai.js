const Hyundai = {

  id: 'hyundai',

  name: 'Hyundai',

  country: 'South Korea',

  logo: '/brands/hyundai.png',

  vehicles: [

    {

      id: 'hyundai-elantra',

      type: 'passenger',

      model: 'Elantra',

      generation: 'CN7',

      years: [

        2021,
        2022,
        2023,
        2024,
        2025,
        2026

      ],

      tire: {

        oemSizes: [

          '195/65R15',

          '205/55R16'

        ],

        optionalSizes: [

          '225/45R17'

        ]

      },

      battery: {

        capacity: '60Ah',

        cca: 550,

        polarity: 'R'

      },

      oil: {

        viscosity: [

          '5W30',

          '0W20'

        ],

        capacity: 4.0

      }

    },
        {

      id: 'hyundai-tucson',

      type: 'suv',

      model: 'Tucson',

      generation: 'NX4',

      years: [

        2021,
        2022,
        2023,
        2024,
        2025,
        2026

      ],

      tire: {

        oemSizes: [

          '225/60R17',

          '235/55R18'

        ],

        optionalSizes: [

          '245/45R19'

        ]

      },

      battery: {

        capacity: '70Ah',

        cca: 680,

        polarity: 'R'

      },

      oil: {

        viscosity: [

          '0W20',

          '5W30'

        ],

        capacity: 5.2

      }

    }

  ]

}

export default Hyundai