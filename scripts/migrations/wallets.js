import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import { transformUseWalletStore }
  from '../transforms/wallets/useWalletStore.js'

export function walletsMigration(files) {

  const keywords = [

    'useWebsiteStore',

    'wallet'

  ]

  const targets = filterFiles(

    files,

    keywords

  )

  console.log('')
  console.log('====================================')
  console.log(' Wallets Migration')
  console.log('====================================')
  console.log('')

  let changed = 0

  for (const file of targets) {

    console.log('CHECKING:', file)

    const result = transformUseWalletStore(file)

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