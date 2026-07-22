import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import { transformUseOrderStore }
  from '../transforms/orders/useOrderStore.js'

export function ordersMigration(files) {

  const keywords = [

    'useWebsiteStore',

    'orders'

  ]

  const targets = filterFiles(

    files,

    keywords

  )

  console.log('')
  console.log('====================================')
  console.log(' Orders Migration')
  console.log('====================================')
  console.log('')

  let changed = 0

  for (const file of targets) {

    console.log('CHECKING:', file)

    const result = transformUseOrderStore(file)

    if (result.changed) {

      fs.writeFileSync(

        file,

        result.code,

        'utf8'

      )

      changed++

      console.log('UPDATED:', file)

    }

  }

  console.log('')
  console.log('Changed:', changed)

}