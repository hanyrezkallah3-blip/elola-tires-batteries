import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import {
  transformAllStores
} from '../transforms/shared/transformAllStores.js'

export function storeMigration(files) {

  const keywords = [

    'useWebsiteStore',

    ...new Set([

      'products',

      'orders',

      'wallet',

      'wallets',

      'walletTransactions',

      'walletEnabled',

      'cashbackPercentage',

      'users',

      'currentUser',

      'login',

      'logout',

      'register',

      'permissions',

      'setCurrentUser',

      'logoutUser',

      'setUsers',

      'addUser',

      'updateUser',

      'deleteUser',

      'enableUser',

      'disableUser',

      'getUserById',

      'getUserByUsername',

      'searchUsers',

      'getStatistics'

    ])

  ]

  const targets = filterFiles(

    files,

    keywords

  )

  console.log('')
  console.log('====================================')
  console.log(' Store Migration')
  console.log('====================================')
  console.log('')

  let changed = 0

  for (const file of targets) {

    console.log('CHECKING:', file)

    try {

      const result = transformAllStores(file)

      if (!result)
        continue

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
  console.log(`Changed: ${changed}`)
  console.log('')

}