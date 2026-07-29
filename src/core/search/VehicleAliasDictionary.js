// ======================================================
// EL OLA ERP
// Vehicle Alias Dictionary
// ======================================================

const aliases = {

  toyota: [
    'toyota',
    'تويوتا',
    'toy',
    'تويو'
  ],

  hyundai: [
    'hyundai',
    'هيونداي',
    'هونداي',
    'hyun'
  ],

  kia: [
    'kia',
    'كيا'
  ],

  nissan: [
    'nissan',
    'نيسان'
  ],

  honda: [
    'honda',
    'هوندا'
  ],

  bmw: [
    'bmw',
    'بي ام دبليو',
    'بى ام دبليو',
    'بي إم دبليو'
  ],

  mercedes: [
    'mercedes',
    'mercedes-benz',
    'benz',
    'mb',
    'مرسيدس',
    'بنز'
  ],

  chevrolet: [
    'chevrolet',
    'chevy',
    'شيفروليه',
    'شيفرولية'
  ],

  ford: [
    'ford',
    'فورد'
  ],

  volkswagen: [
    'volkswagen',
    'vw',
    'فولكس',
    'فولكس فاجن'
  ]

}

export default class VehicleAliasDictionary {

  // ====================================================
  // EXPAND QUERY
  // ====================================================

  static expand(query = '') {

    const value =

      String(query)

        .toLowerCase()

        .trim()

    const result = new Set([

      value

    ])

    for (

      const list of Object.values(

        aliases

      )

    ) {

      if (

        list.some(alias =>

          alias.includes(value)

          ||

          value.includes(alias)

        )

      ) {

        list.forEach(alias =>

          result.add(alias)

        )

      }

    }

    return [

      ...result

    ]

  }

}