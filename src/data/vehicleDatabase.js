// ======================================================
// EL OLA ERP
// Vehicle Database
// Single Source Of Truth
// ======================================================


export const vehicleDatabase = [


  {
    id: 1,

    type: 'car',

    typeName: 'سيارات',

    make: 'Toyota',

    model: 'Corolla',

    yearFrom: 2019,

    yearTo: 2022,

    engine: '1.6',


    tires: [

      {
        width: 205,

        profile: 55,

        rim: 16
      }

    ],


    batteries: [

      {
        capacity: 70,

        cca: 620,

        voltage: 12
      }

    ],


    oils: [

      {
        viscosity: '5W-30',

        quantity: 4.2
      }

    ]

  },



  {
    id: 2,

    type: 'car',

    typeName: 'سيارات',

    make: 'Hyundai',

    model: 'Elantra',

    yearFrom: 2021,

    yearTo: 2024,

    engine: '1.6',


    tires: [

      {
        width: 205,

        profile: 55,

        rim: 16
      }

    ],


    batteries: [

      {
        capacity: 60,

        cca: 540,

        voltage: 12
      }

    ],


    oils: [

      {
        viscosity: '5W-30',

        quantity: 4.5
      }

    ]

  },
  // ======================================================
// EL OLA ERP
// Vehicle Database
// Single Source Of Truth
// ======================================================


  {
    id: 3,

    type: 'car',

    typeName: 'سيارات',

    make: 'Kia',

    model: 'Cerato',

    yearFrom: 2020,

    yearTo: 2025,

    engine: '1.6',


    tires: [

      {
        width: 205,

        profile: 55,

        rim: 16
      }

    ],


    batteries: [

      {
        capacity: 60,

        cca: 540,

        voltage: 12
      }

    ],


    oils: [

      {
        viscosity: '5W-30',

        quantity: 4.0
      }

    ]

  },


  {

    id: 4,

    type: 'suv',

    typeName: 'SUV',

    make: 'Hyundai',

    model: 'Tucson',

    yearFrom: 2021,

    yearTo: 2025,

    engine: '2.0',


    tires: [

      {
        width: 225,

        profile: 55,

        rim: 18
      }

    ],


    batteries: [

      {
        capacity: 70,

        cca: 620,

        voltage: 12
      }

    ],


    oils: [

      {
        viscosity: '5W-30',

        quantity: 5.0
      }

    ]

  },


  {

    id: 5,

    type: 'truck',

    typeName: 'شاحنات',

    make: 'Isuzu',

    model: 'NPR',

    yearFrom: 2018,

    yearTo: 2025,

    engine: '3.0',


    tires: [

      {
        width: 215,

        profile: 75,

        rim: 17.5
      }

    ],


    batteries: [

      {
        capacity: 100,

        cca: 850,

        voltage: 12
      }

    ],


    oils: [

      {
        viscosity: '15W-40',

        quantity: 7.0
      }

    ]

  },
  // ======================================================
// EL OLA ERP
// Vehicle Database
// Single Source Of Truth
// ======================================================


  {

    id: 6,

    type: 'bus',

    typeName: 'حافلات',

    make: 'Mercedes',

    model: 'Sprinter',

    yearFrom: 2019,

    yearTo: 2025,

    engine: '2.2',


    tires: [

      {

        width: 225,

        profile: 75,

        rim: 16

      }

    ],


    batteries: [

      {

        capacity: 100,

        cca: 900,

        voltage: 12

      }

    ],


    oils: [

      {

        viscosity: '10W-40',

        quantity: 8.0

      }

    ]

  }


]