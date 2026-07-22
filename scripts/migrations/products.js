import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import { transformUseProductStore }
  from '../transforms/products/useProductStore.js'

export function productsMigration(files) {

  const keywords = [

    'useWebsiteStore',

    'products'

  ]

  const targets = filterFiles(

    files,

    keywords

  )

  console.log('')
  console.log('====================================')
  console.log(' Product Migration')
  console.log('====================================')
  console.log('')

  let changed = 0

  for (const file of targets) {

    console.log('CHECKING:', file)

    try {

      const result = transformUseProductStore(file)

      if (result.changed) {

        fs.writeFileSync(

          file,

          result.code,

          'utf8'

        )

        changed++

        console.log('UPDATED:', file)

      }

    } catch (err) {

      console.log('')
      console.log('====================================')
      console.log('FAILED FILE:')
      console.log(file)
      console.log('------------------------------------')
      console.log(err.message)
      console.log('====================================')
      console.log('')

      throw err

    }

  }

  console.log('')
  console.log('Changed:', changed)

}