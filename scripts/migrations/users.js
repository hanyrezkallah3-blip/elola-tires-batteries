import fs from 'fs'

import { filterFiles } from '../core/fileFilter.js'

import { transformUseUserStore }
  from '../transforms/users/useUserStore.js'

export function usersMigration(files) {

  const keywords = [

    // القديم
    'useWebsiteStore',

    // user store
    'users',
    'currentUser',
    'login',
    'logout',
    'register',
    'permissions',
    'setCurrentUser',
    'logoutUser',

    // setters
    'setUsers',
    'addUser',
    'updateUser',
    'deleteUser',
    'enableUser',
    'disableUser',

    // getters
    'getUserById',
    'getUserByUsername',
    'searchUsers',
    'getStatistics'

  ]

  const targets = filterFiles(

    files,

    keywords

  )

  console.log('')
  console.log('====================================')
  console.log(' Users Migration')
  console.log('====================================')
  console.log('')

  console.log(`Targets : ${targets.length}`)
  console.log('')

  let changed = 0

  for (const file of targets) {

    console.log('CHECKING:', file)

    try {

      const result = transformUseUserStore(file)

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

      console.log('FAILED :', file)
      console.error(err.message)

    }

  }

  console.log('')
  console.log('====================================')
  console.log(`Changed : ${changed}`)
  console.log('====================================')
  console.log('')

}